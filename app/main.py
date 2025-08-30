# app/main.py
from fastapi import FastAPI
from app.models import Patient  # Updated import from models
from faker import Faker
import random

app = FastAPI()
fake = Faker()

def generate_random_patient() -> Patient:
    return Patient(
        name=fake.name(),
        risk_tier=random.randint(1, 5),
        hospital_visits=random.randint(1, 20),
        roi_amount=random.uniform(1000.0, 50000.0),
    )

@app.get("/patient", response_model=Patient)
def get_patient():
    return generate_random_patient()

@app.get("/patients", response_model=list[Patient])
def get_patients():
    return [generate_random_patient() for _ in range(10)]
