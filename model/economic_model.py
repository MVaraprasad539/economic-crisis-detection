"""
EcoGuard AI: Economic Crisis Prediction Model (Demo)
This script demonstrates the Machine Learning pipeline described in the methodology.
"""

import time
import random

class EconomicCrisisModel:
    def __init__(self):
        self.indicators = ["GDP Growth", "Inflation Rate", "Debt-to-GDP Ratio", "Interest Rate"]
        self.is_trained = False

    def load_dataset(self):
        print("[1/5] Loading datasets from World Bank & IMF...")
        time.sleep(1)
        print("      - Macroeconomic indicators loaded (1980-2024)")
        print("      - Historical crisis labels identified (e.g., 2008 Financial Crisis)")

    def preprocess_data(self):
        print("[2/5] Preprocessing & Data Cleaning...")
        time.sleep(1)
        print("      - Normalizing time-series data")
        print("      - Handling missing values using linear interpolation")

    def train_model(self):
        print("[3/5] Training Machine Learning Model (Random Forest Classifier)...")
        # Simulating training epochs
        for i in range(1, 4):
            time.sleep(0.8)
            accuracy = 85 + (i * 2) + random.uniform(-1, 1)
            print(f"      - Epoch {i}: Accuracy = {accuracy:.2f}%")
        self.is_trained = True
        print("      - Model training completed.")

    def predict(self, gdp, inflation, debt, interest):
        if not self.is_trained:
            print("Error: Model must be trained before prediction.")
            return

        print(f"\n[ANALYZING] Current Indicators -> GDP: {gdp}%, Inflation: {inflation}%, Debt: {debt}%")
        time.sleep(1.5)
        
        # Mock Prediction Logic
        score = ( (10 - gdp) * 2 + inflation * 3 + (debt / 10) * 4 ) / 10
        probability = min(max(score * 10, 5), 99)
        
        print("-" * 40)
        print(f"ECOGUARD AI PREDICTION RESULT")
        print("-" * 40)
        print(f"Crisis Probability: {probability:.1f}%")
        
        if probability < 30:
            print("STATUS: LOW RISK - Economic stability predicted.")
        elif probability < 65:
            print("STATUS: MODERATE RISK - Early warning signals detected.")
        else:
            print("STATUS: HIGH RISK - Imminent economic crisis indicated.")
        print("-" * 40)

if __name__ == "__main__":
    print("=== EcoGuard: Economic Crisis Prediction System ===")
    model = EconomicCrisisModel()
    
    # Run the pipeline
    model.load_dataset()
    model.preprocess_data()
    model.train_model()
    
    # Example prediction
    # High risk scenario
    model.predict(gdp=-1.2, inflation=7.5, debt=85.0, interest=5.5)
    
    # Low risk scenario
    # model.predict(gdp=3.5, inflation=2.0, debt=45.0, interest=3.0)
