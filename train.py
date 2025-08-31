import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import config
import glob  # <-- ADD THIS IMPORT


def train_model():
    """
    Trains an XGBoost model using all CSV files listed in config.py.
    """

    # 1. Load datasets
    dataset_key = config.DATASET_TO_USE
    path_pattern = config.DATA_PATHS[dataset_key]  # <-- GET THE PATTERN

    print(f"--- Training with '{dataset_key}' dataset ---")

    # --- THIS SECTION IS FIXED ---
    # Use glob to find all files that match the pattern
    files = glob.glob(path_pattern)
    if not files:
        print(f"❌ Error: No files found for pattern '{path_pattern}'. Check your config.py and data folder.")
        return
    # --------------------------------

    print(f"Files to load: {files}")

    df_list = [pd.read_csv(f) for f in files]
    df = pd.concat(df_list, axis=0, ignore_index=True)
    print(f"✅ Data loaded: {len(df):,} rows from {len(files)} files")

    # 2. Preprocessing
    print("Preprocessing data...")
    X = df.drop(config.TARGET_VARIABLE, axis=1)
    y = df[config.TARGET_VARIABLE]

    # Encode categorical variables
    X = pd.get_dummies(X)
    X.columns = X.columns.str.replace(r'\[|\]|<', '_', regex=True)

    # 3. Train-test split
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 4. Train XGBoost model
    print("Training XGBoost model...")
    model = xgb.XGBClassifier(
        objective="multi:softmax",
        num_class=len(y.unique()),
        device="cuda",  # use "cpu" if no GPU
        eval_metric="mlogloss",
        use_label_encoder=False
    )
    model.fit(X_train, y_train)

    # 5. Evaluate
    print("Evaluating...")
    preds = model.predict(X_test)
    print("\nClassification Report:")
    print(classification_report(y_test, preds))

    # 6. Save model + training columns
    print(f"Saving model to: {config.MODEL_OUTPUT_PATH}")
    joblib.dump({
        "model": model,
        "training_columns": list(X.columns)  # Save columns as a list
    }, config.MODEL_OUTPUT_PATH)

    print("✅ Training complete!")


if __name__ == "__main__":
    train_model()