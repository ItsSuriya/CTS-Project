# File: Backend/Stratification_Model/Stratification_Final.py

import pandas as pd
import joblib
import shap
import numpy as np
import json
import os


class RiskStratificationModel:
    """
    A class to load the stratification model and artifacts once,
    and provide a clean prediction method.
    """

    def __init__(self):
        print("--- Initializing Risk Stratification Model ---")

        # --- 1. Define RELATIVE Paths ---
        # This makes the code portable and works on any machine.
        base_dir = os.path.dirname(__file__)  # Gets the directory where this script is located
        model_path = os.path.join(base_dir, 'Model & Dataset', 'classifier_chain_gpu_model_v2.joblib')
        dataset_path = os.path.join(base_dir, 'Model & Dataset', 'prognos_health_multilabel_dataset.parquet')

        # --- 2. Load All Necessary Artifacts ---
        print("Loading model and dataset for column information...")
        try:
            self.model = joblib.load(model_path)
            final_df = pd.read_parquet(dataset_path)
        except FileNotFoundError as e:
            print(f"❌ CRITICAL ERROR: Could not find model files. {e}")
            print(
                "Please ensure 'classifier_chain_gpu_model_v2.joblib' and 'prognos_health_multilabel_dataset.parquet' are in the 'Model & Dataset' folder.")
            self.model = None
            return

        # --- 3. Prepare Column Lists ---
        cols_to_drop = [
            'DESYNPUF_ID', 'BENE_BIRTH_DT', 'BENE_DEATH_DT', 'SP_STATE_CODE',
            'BENE_COUNTY_CD', 'was_hospitalized_in_2010'
        ]
        self.target_cols = [col for col in final_df.columns if col.startswith('HAD_')]
        X = final_df.drop(columns=cols_to_drop + self.target_cols)
        self.training_columns = X.columns.tolist()

        # --- 4. Create SHAP Explainers (once at startup) ---
        print("Creating SHAP explainers...")
        self.explainers = [shap.TreeExplainer(estimator) for estimator in self.model.estimators_]
        print("✅ Stratification Model Initialized Successfully.")

    def predict(self, patient_data: dict):
        """
        Predicts risk for a single patient.
        """
        if not self.model:
            return {"error": "Model is not loaded."}

        patient_df = pd.DataFrame([patient_data]).reindex(columns=self.training_columns, fill_value=0)

        predicted_outcomes = []
        risk_scores = []
        x_transformed = patient_df.copy()

        for i, condition in enumerate(self.target_cols):
            estimator = self.model.estimators_[i]
            prob_array = estimator.predict_proba(x_transformed)
            risk_score = float(prob_array.flatten()[-1])
            risk_scores.append(risk_score)

            shap_values = self.explainers[i](x_transformed)
            abs_shap = np.abs(shap_values.values)
            feature_indices = np.argsort(abs_shap)[0, ::-1][:3]
            feature_names_array = np.array(shap_values.feature_names)
            key_risk_factors = feature_names_array[feature_indices].tolist()

            if risk_score >= 0.75:
                risk_tier = "Tier 4: High Risk"
            elif risk_score >= 0.50:
                risk_tier = "Tier 3: Moderate Risk"
            elif risk_score >= 0.25:
                risk_tier = "Tier 2: Low Risk"
            else:
                risk_tier = "Tier 1: Minimal Risk"

            clean_condition_name = condition.replace('HAD_', '').replace('_IN_2010', ' ').replace('_', ' ').strip()

            predicted_outcomes.append({
                "condition": clean_condition_name,
                "riskScore": round(risk_score, 3),
                "riskTier": risk_tier,
                "keyRiskFactors": key_risk_factors
            })

            if i < len(self.target_cols) - 1:
                x_transformed[condition] = prob_array[:, 1]

        overall_risk_score = float(max(risk_scores))
        primary_condition_index = risk_scores.index(overall_risk_score)
        primary_condition = predicted_outcomes[primary_condition_index]['condition']

        return {
            "patientId": patient_data.get("DESYNPUF_ID", "UNKNOWN"),
            "age": patient_data.get("Age"),
            "overallRiskScore": round(overall_risk_score, 3),
            "presentRiskCondition": primary_condition,
            "predictedOutcomes": predicted_outcomes
        }


# --- Create a single instance of the model for the API to use ---
risk_model_instance = RiskStratificationModel()


def predict_risk(patient_data: dict):
    """
    This is the clean function your FastAPI app will import and call.
    """
    return risk_model_instance.predict(patient_data)