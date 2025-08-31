import pandas as pd
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
import config

# --- 1. INITIALIZE FASTAPI APP ---
app = FastAPI(title="Patient Risk Stratification API")

# --- 2. LOAD THE SAVED MODEL AND COLUMNS ---
# This is loaded once when the application starts
try:
    saved_model_data = joblib.load(config.MODEL_OUTPUT_PATH)
    model = saved_model_data["model"]
    training_columns = saved_model_data["training_columns"]
    print("✅ Model and training columns loaded successfully.")
except FileNotFoundError:
    print(f"❌ Error: Model file not found at '{config.MODEL_OUTPUT_PATH}'.")
    model = None
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None


# --- 3. DEFINE THE INPUT DATA MODEL (CRITICAL SECTION) ---
# This class MUST inherit from BaseModel
class Patient(BaseModel):
    age: int
    sex: str
    state: str
    urbanicity: str
    insurance_type: str
    income_bracket: str
    employment_status: str
    hospital_visits_past_year: int
    days_since_last_visit: int
    num_prescriptions: int
    has_diabetes: int
    has_hypertension: int
    has_heart_disease: int
    has_ckd: int
    has_copd: int
    has_asthma: int
    medication_adherence: float
    bmi: float
    hba1c_level: float
    blood_pressure_systolic: int
    smoker_status: str
    alcohol_use: str
    physical_activity_level: str
    emergency_room_visits: int
    readmissions_30d: int
    missed_appointments: int
    care_gaps_count: int
    has_primary_care_physician: int
    telehealth_usage: int
    social_support_score: int
    health_literacy_score: int
    preventive_visits: int
    vaccination_status: str
    mental_health_condition: int
    depression_screen_score: int
    substance_use_disorder: int
    outpatient_visits: int
    inpatient_admissions: int


# --- 4. CREATE THE PREDICTION ENDPOINT ---
@app.post("/predict")
def predict_risk(patient_data: Patient):
    """
    Accepts patient data and returns the predicted risk tier.
    """
    if not model:
        return {"error": "Model not loaded. Please check server logs."}

    # Convert Pydantic model to a dictionary, then to a DataFrame
    data_dict = patient_data.dict()
    new_df = pd.DataFrame([data_dict])

    # Preprocess the new data exactly like the training data
    new_df_encoded = pd.get_dummies(new_df)
    new_df_encoded.columns = new_df_encoded.columns.str.replace(r'\[|\]|<', '_', regex=True)

    # Align columns with the training set
    new_df_aligned = new_df_encoded.reindex(columns=training_columns, fill_value=0)

    # Make prediction
    prediction = model.predict(new_df_aligned)

    # Return the result
    return {"predicted_risk_tier": int(prediction[0])}


# --- 5. CREATE A ROOT ENDPOINT FOR TESTING ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Patient Risk Prediction API!"}