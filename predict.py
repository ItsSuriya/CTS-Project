import pandas as pd
import joblib
import config


def predict_new_patient(patient_data):
    """
    Loads the trained model and predicts the risk tier for a new patient.
    """

    try:
        print(f"Loading model: {config.MODEL_NAME}")
        saved = joblib.load(config.MODEL_OUTPUT_PATH)
        model = saved["model"]
        training_columns = saved["training_columns"]

        # Convert input dict to DataFrame
        new_df = pd.DataFrame([patient_data])

        # Encode categorical variables
        new_df_encoded = pd.get_dummies(new_df)
        new_df_encoded.columns = new_df_encoded.columns.str.replace(r'\[|\]|<', '_', regex=True)

        # Align with training columns
        new_df_aligned = new_df_encoded.reindex(columns=training_columns, fill_value=0)

        # Predict
        prediction = model.predict(new_df_aligned)
        print("\n--- Prediction ---")
        print(f"Predicted Risk Tier: {prediction[0]}")

    except FileNotFoundError:
        print(f"❌ Error: Model file '{config.MODEL_OUTPUT_PATH}' not found. Run train.py first.")
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    # Example new patient
    new_patient = {
        'age': 68, 'sex': 'Male', 'state': 'CA', 'urbanicity': 'Urban',
        'insurance_type': 'Private', 'income_bracket': '<25k',
        'employment_status': 'Employed', 'hospital_visits_past_year': 3,
        'days_since_last_visit': 45, 'num_prescriptions': 5,
        'has_diabetes': 1, 'has_hypertension': 1, 'has_heart_disease': 0,
        'has_ckd': 0, 'has_copd': 0, 'has_asthma': 1,
        'medication_adherence': 0.85, 'bmi': 29.5, 'hba1c_level': 7.2,
        'blood_pressure_systolic': 145, 'smoker_status': 'Former',
        'alcohol_use': 'Light', 'physical_activity_level': 'Moderate',
        'emergency_room_visits': 1, 'readmissions_30d': 0,
        'missed_appointments': 2, 'care_gaps_count': 1,
        'has_primary_care_physician': 1, 'telehealth_usage': 3,
        'social_support_score': 60, 'health_literacy_score': 80,
        'preventive_visits': 1, 'vaccination_status': 'Up-to-date',
        'mental_health_condition': 0, 'depression_screen_score': 4,
        'substance_use_disorder': 0, 'outpatient_visits': 5,
        'inpatient_admissions': 1
    }
    predict_new_patient(new_patient)
