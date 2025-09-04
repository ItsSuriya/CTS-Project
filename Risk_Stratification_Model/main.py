from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd
import sys
import os

# --- Import your model function ---
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from RiskStratification_Final import predict_patient_risk  # <-- your function

# --- Initialize App ---
app = FastAPI()

# --- Configure CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend origin (React dev server)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Root Endpoint ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Risk Stratification Model API"}

# --- Prediction Endpoint (CSV Upload) ---
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read uploaded CSV
        df = pd.read_csv(file.file)

        # Convert DataFrame rows into list of dicts
        patients = df.to_dict(orient="records")

        # Collect predictions 
        all_predictions = []
        for patient_data in patients:
            prediction = predict_patient_risk(patient_data)  # your function expects dict
            all_predictions.append(prediction)

        return {"predictions": all_predictions}

    except Exception as e:
        return {"error": str(e)}

# --- Mount Frontend ---
frontend_path = os.path.join(os.path.dirname(__file__), "..", "CTS-Project-Frontend-kishore", "dist")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")
