# File: generate_synthetic_data.py

import pandas as pd
import random

# Based on research into annual patient costs.
# Proactive = Management, prevention, regular check-ups.
# Reactive = Emergency visits, hospitalization, acute procedures.
COST_DATA = {
    "SEVERE HEART FAILURE": {
        "proactive_min": 2000, "proactive_max": 6000,
        "reactive_min": 15000, "reactive_max": 45000
    },
    "ACUTE HEART FAILURE": {
        "proactive_min": 2000, "proactive_max": 6000,
        "reactive_min": 15000, "reactive_max": 45000
    },
    "ACUTE KIDNEY INJURY": {
        "proactive_min": 1500, "proactive_max": 5000,
        "reactive_min": 10000, "reactive_max": 55000
    },
    "COPD EXACERBATION": {
        "proactive_min": 1000, "proactive_max": 4000,
        "reactive_min": 8000, "reactive_max": 30000
    }
}


def generate_synthetic_data(num_records=1000):
    """
    Generates a synthetic dataset of patient healthcare costs.

    This function creates a dataset with randomized costs for different
    medical conditions, factoring in age as a cost multiplier.

    Args:
        num_records (int): The number of synthetic patient records to create.

    Returns:
        pandas.DataFrame: A DataFrame containing the synthetic data.
    """
    data = []
    conditions = list(COST_DATA.keys())

    for i in range(num_records):
        patient_id = f"PATIENT-SYN-{i + 1:04d}"
        age = random.randint(45, 90)  # Age range for these conditions
        condition = random.choice(conditions)

        # Get base costs from our cost dictionary
        base_costs = COST_DATA[condition]

        # Generate a base cost within the min/max range
        proactive_base = random.uniform(base_costs["proactive_min"], base_costs["proactive_max"])
        reactive_base = random.uniform(base_costs["reactive_min"], base_costs["reactive_max"])

        # Create an age modifier: cost increases slightly for older patients
        # For every year over 45, cost increases by 1.5%
        age_modifier = 1 + (age - 45) * 0.015

        # Apply the age modifier to the base costs
        final_proactive_cost = round(proactive_base * age_modifier, 2)
        final_reactive_cost = round(reactive_base * age_modifier, 2)

        data.append({
            "patientId": patient_id,
            "age": age,
            "condition": condition,
            "proactive_cost": final_proactive_cost,
            "reactive_cost": final_reactive_cost
        })

    df = pd.DataFrame(data)
    return df


if __name__ == "__main__":
    # Generate the data and save it to a CSV file
    synthetic_df = generate_synthetic_data(num_records=1000)
    synthetic_df.to_csv("synthetic_patient_costs.csv", index=False)
    print("Successfully generated 'synthetic_patient_costs.csv' with 1000 records.")
    print("\nSample of the data:")
    print(synthetic_df.head())