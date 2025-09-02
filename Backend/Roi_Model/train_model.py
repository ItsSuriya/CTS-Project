# File: train_model.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, r2_score # Import metrics
import joblib

print("--- Starting Model Training & Evaluation ---")

# 1. Load Data
try:
    df = pd.read_csv("synthetic_patient_costs.csv")
except FileNotFoundError:
    print("Error: 'synthetic_patient_costs.csv' not found.")
    print("Please run the 'generate_synthetic_data.py' script first.")
    exit()

# 2. Feature Engineering
features = pd.get_dummies(df[['age', 'condition']], columns=['condition'])
target_proactive = df['proactive_cost']
target_reactive = df['reactive_cost']

# Save the column names for the prediction step
model_columns = features.columns.tolist()
joblib.dump(model_columns, 'ml_models/model_columns.pkl')
print(f"Model will use these columns: {model_columns}")

# --- 3. Split data into training and testing sets ---
# We'll train on 80% of the data and test on the remaining 20%
X_train, X_test, y_proactive_train, y_proactive_test = train_test_split(
    features, target_proactive, test_size=0.2, random_state=42
)
_, _, y_reactive_train, y_reactive_test = train_test_split(
    features, target_reactive, test_size=0.2, random_state=42
)
print("\nData split into 80% training and 20% testing sets.")

# --- 4. Train and Evaluate the Proactive Cost Model ---
print("\n--- Training Proactive Cost Model ---")
proactive_model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
proactive_model.fit(X_train, y_proactive_train)

# Evaluate on the test set
proactive_predictions = proactive_model.predict(X_test)
proactive_mae = mean_absolute_error(y_proactive_test, proactive_predictions)
proactive_r2 = r2_score(y_proactive_test, proactive_predictions)

print("Proactive Model Evaluation:")
print(f"  Mean Absolute Error (MAE): ${proactive_mae:,.2f}")
print(f"  R-squared (R2) Score: {proactive_r2:.4f}")

# --- 5. Train and Evaluate the Reactive Cost Model ---
print("\n--- Training Reactive Cost Model ---")
reactive_model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
reactive_model.fit(X_train, y_reactive_train)

# Evaluate on the test set
reactive_predictions = reactive_model.predict(X_test)
reactive_mae = mean_absolute_error(y_reactive_test, reactive_predictions)
reactive_r2 = r2_score(y_reactive_test, reactive_predictions)

print("Reactive Model Evaluation:")
print(f"  Mean Absolute Error (MAE): ${reactive_mae:,.2f}")
print(f"  R-squared (R2) Score: {reactive_r2:.4f}")

# --- 6. Save the final models trained on ALL data ---
# After evaluation, it's common practice to retrain on all data to make the final model as robust as possible
proactive_model.fit(features, target_proactive)
reactive_model.fit(features, target_reactive)
joblib.dump(proactive_model, 'ml_models/proactive_cost_model.pkl')
joblib.dump(reactive_model, 'ml_models/reactive_cost_model.pkl')

print("\n--- Models trained and saved successfully! ---")