# File: Backend/Roi_Model/main.py

import sys
import os
import pandas as pd
import joblib
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

# --- 1. Add Parent Directory to Path to find sibling folders ---
# This allows us to import from Stratification_Model
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- 2. Import Teammate's Model Function ---
try:
    from Stratification_Model.Stratification_Final import predict_risk

    print("✅ Teammate's risk model function loaded successfully!")
except ImportError as e:
    print(f"❌ Could not import from 'Stratification_Final.py'. Error: {e}")
    predict_risk = None

# --- 3. Initialize FastAPI App ---
app = FastAPI(
    title="Full Healthcare Prediction API",
    description="Runs risk stratification and then predicts ROI.",
    version="2.0.0"
)

# --- 4. Add CORS Middleware ---
# This is essential for your React front end to be able to call the API
origins = [
    "http://localhost",
    "http://localhost:5173",  # Default Vite React port
    "http://localhost:3000",  # Default Create React App port
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 5. Load Your ROI Models with Robust Relative Paths ---
try:
    # Get the directory where this main.py file lives
    base_dir = os.path.dirname(__file__)

    # Create the full, correct paths to your model files
    proactive_path = os.path.join(base_dir, 'ml_models', 'proactive_cost_model.pkl')
    reactive_path = os.path.join(base_dir, 'ml_models', 'reactive_cost_model.pkl')
    columns_path = os.path.join(base_dir, 'ml_models', 'model_columns.pkl')

    # Load the models using the new, robust paths
    proactive_model = joblib.load(proactive_path)
    reactive_model = joblib.load(reactive_path)
    model_columns = joblib.load(columns_path)

    print("✅ Your ROI models and columns loaded successfully!")
except FileNotFoundError as e:
    print(f"❌ Error loading your ROI model files: {e}")
    proactive_model = reactive_model = model_columns = None

# --- 6. Define Pydantic Model for Input Validation ---
# This defines the data structure the API expects from the front end.
# Based on your teammate's model test case.
class RawPatientInput(BaseModel):
    DESYNPUF_ID: Optional[str] = "TEST_PATIENT"
    Age: int
    BENE_SEX_IDENT_CD: Optional[int] = 0
    BENE_RACE_CD: Optional[int] = 0
    SP_ALZHDMTA: Optional[int] = 0
    SP_CHF: Optional[int] = 0
    SP_CHRNKIDN: Optional[int] = 0
    SP_CNCR: Optional[int] = 0
    SP_COPD: Optional[int] = 0
    SP_DEPRESSN: Optional[int] = 0
    SP_DIABETES: Optional[int] = 0
    SP_ISCHMCHT: Optional[int] = 0
    SP_OSTEOPRS: Optional[int] = 0
    SP_RA_OA: Optional[int] = 0
    SP_STRKETIA: Optional[int] = 0


# --- 7. Define API Endpoints ---
@app.get("/")
async def root():
    return {"message": "Welcome to the Full Healthcare Prediction API."}


@app.post("/predict_full_pipeline/")
async def predict_full_pipeline(raw_input: RawPatientInput):
    """
    Runs the full prediction pipeline from raw patient data to ROI costs.
    """
    if not predict_risk:
        return {"error": "Risk stratification model is not available."}
    if not all([proactive_model, reactive_model, model_columns]):
        return {"error": "ROI models are not loaded. Please check server logs."}

    # Step 1: Run your teammate's risk model
    risk_output_json = predict_risk(raw_input.dict())

    # Step 2: Run your ROI model using the output from Step 1
    age = risk_output_json.get("age", 65)

    conditions = {outcome["condition"] for outcome in risk_output_json.get("predictedOutcomes", [])}
    if risk_output_json.get("presentRiskCondition"):
        conditions.add(risk_output_json["presentRiskCondition"])

    predicted_costs = []
    for condition in conditions:
        input_data = {'age': [age], 'condition': [condition]}
        input_df = pd.DataFrame(input_data)
        input_encoded = pd.get_dummies(input_df, columns=['condition'])
        input_aligned = input_encoded.reindex(columns=model_columns, fill_value=0)

        proactive_prediction = proactive_model.predict(input_aligned)[0]
        reactive_prediction = reactive_model.predict(input_aligned)[0]
        potential_savings = reactive_prediction - proactive_prediction

        predicted_costs.append({
            "condition": condition,
            "predicted_proactive_cost": round(proactive_prediction, 2),
            "predicted_reactive_cost": round(reactive_prediction, 2),
            "potential_savings": round(potential_savings, 2)
        })

    # Step 3: Format the final combined output
    final_output = {
        "risk_stratification_result": risk_output_json,
        "roi_prediction_result": {
            "patientId": raw_input.DESYNPUF_ID,
            "age_used_for_prediction": age,
            "predictedCosts": predicted_costs
        }
    }
    return final_output