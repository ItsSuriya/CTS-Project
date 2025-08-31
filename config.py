import os

# Base directory for the project
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Data folder inside the project
DATA_DIR = os.path.join(BASE_DIR, "data")

# Model output path
MODEL_OUTPUT_PATH = os.path.join(BASE_DIR, "models", "xgboost_model.pkl")

# Dataset settings
DATASET_TO_USE = "patients"

DATA_PATHS = {
    # Load all synthetic CSVs automatically
    "patients": os.path.join(DATA_DIR, "massive_synthetic_data*.csv"),

    # Example if you want to switch to a different dataset later
    "cleaned": os.path.join(DATA_DIR, "cleaned_patient_data_for_training.csv"),
}

# Target variable name
TARGET_VARIABLE = "risk_tier"  # change if your CSV target column has a different name

# Model name (for printing/logging only)
MODEL_NAME = "XGBoost Risk Stratification Model"