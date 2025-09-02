# File: roi_model_ml.py

import pandas as pd
import json
import joblib

# --- 1. Load the Trained Models and Columns ---
# This is done once when the script starts.
try:
    proactive_model = joblib.load('ml_models/proactive_cost_model.pkl')
    reactive_model = joblib.load('ml_models/reactive_cost_model.pkl')
    model_columns = joblib.load('ml_models/model_columns.pkl')
    print("ML models loaded successfully.")
except FileNotFoundError:
    print("Error: Model files not found.")
    print("Please run the 'train_model.py' script first to train and save the models.")
    exit()


def predict_roi_costs_ml(risk_stratification_output: dict) -> dict:
    """
    Predicts costs using a trained Gradient Boosting Regressor model.
    The prediction is dynamic based on age and condition.
    """
    # --- 2. Extract Information from the Input ---
    patient_id = risk_stratification_output.get("patientId", "Unknown")
    age = risk_stratification_output.get("age", 65)  # Default to 65 if age is missing

    # --- 3. Get all unique conditions ---
    conditions = set()
    if risk_stratification_output.get("presentRiskCondition"):
        conditions.add(risk_stratification_output["presentRiskCondition"])
    if risk_stratification_output.get("primaryRiskCondition"):
        conditions.add(risk_stratification_output["primaryRiskCondition"])
    for outcome in risk_stratification_output.get("predictedOutcomes", []):
        conditions.add(outcome["condition"])

    # --- 4. Predict Costs for Each Condition using the ML Model ---
    predicted_costs = []
    for condition in conditions:
        # a. Create a DataFrame for the patient's data
        # This input format MUST match the training data format
        input_data = {
            'age': [age],
            'condition': [condition]
        }
        input_df = pd.DataFrame(input_data)

        # b. One-Hot Encode the input data
        input_encoded = pd.get_dummies(input_df, columns=['condition'])

        # c. Align columns with the model's training columns
        # This ensures the model sees the exact same feature columns.
        # Any missing columns from the input will be added and filled with 0.
        input_aligned = input_encoded.reindex(columns=model_columns, fill_value=0)

        # d. Make Predictions
        proactive_prediction = proactive_model.predict(input_aligned)[0]
        reactive_prediction = reactive_model.predict(input_aligned)[0]
        potential_savings = reactive_prediction - proactive_prediction

        predicted_costs.append({
            "condition": condition,
            "predicted_proactive_cost": round(proactive_prediction, 2),
            "predicted_reactive_cost": round(reactive_prediction, 2),
            "potential_savings": round(potential_savings, 2)
        })

    # --- 5. Format the Final Output ---
    roi_output = {
        "patientId": patient_id,
        "age": age,
        "predictedCosts": predicted_costs
    }
    return roi_output


if __name__ == '__main__':
    # --- Example Usage ---
    example_risk_input = {
  "patientId": "PATIENT-HIGH-003",
  "age": 72,
  "overallRiskScore": 0.219,
  "primaryRiskCondition": "ACUTE KIDNEY INJURY",
  "predictedOutcomes": [
    {
      "condition": "ACUTE HEART FAILURE",
      "riskScore": 0.13,
      "riskTier": "Tier 1: Minimal Risk",
      "keyRiskFactors": [
        "MEDREIMB_OP",
        "MEDREIMB_CAR",
        "SP_CHF"
      ]
    },
    {
      "condition": "ACUTE KIDNEY INJURY",
      "riskScore": 0.219,
      "riskTier": "Tier 1: Minimal Risk",
      "keyRiskFactors": [
        "SP_CHRNKIDN",
        "MEDREIMB_CAR",
        "MEDREIMB_OP"
      ]
    },
    {
      "condition": "COPD EXACERBATION",
      "riskScore": 0.036,
      "riskTier": "Tier 1: Minimal Risk",
      "keyRiskFactors": [
        "SP_COPD",
        "HAD_ACUTE_HEART_FAILURE_IN_2010",
        "outpatient_visit_count_08_09"
      ]
    }
  ]
}

    # Get the cost predictions from your new ML-powered ROI model
    roi_prediction = predict_roi_costs_ml(example_risk_input)

    print("\n--- ML-Powered ROI Model Output ---")
    print(json.dumps(roi_prediction, indent=4))