import joblib
import pandas as pd
import os

# 1. SETUP PATHS
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, 'models', 'startup_predictor.pkl')

print(f"🔍 Testing model at: {MODEL_PATH}")

try:
    # 2. LOAD THE SERIALIZED BRAIN
    if not os.path.exists(MODEL_PATH):
        print("❌ ERROR: startup_predictor.pkl not found! Run train_model.py first.")
        exit()

    artifacts = joblib.load(MODEL_PATH)
    model = artifacts['model']
    
    # 3. CREATE A TEST CASE (Simulation)
    test_startup = pd.DataFrame([[75.0, 5, 0, 1, 1]], 
                               columns=['Funding', 'TeamSize', 'Sector', 'MarketSize', 'Competition'])

    # 4. GET THE MATHEMATICAL PROBABILITY
    # predict_proba returns [Probability of Failure, Probability of Success]
    probabilities = model.predict_proba(test_startup)
    success_chance = int(probabilities[0][1] * 100)

    print("-" * 30)
    print(f"✅ LOCAL ML STATUS: ACTIVE")
    print(f"📈 Predicted Success Probability: {success_chance}%")
    print("-" * 30)
    print("This score is generated locally WITHOUT using Gemini API.")

except Exception as e:
    print(f"❌ TEST FAILED: {e}")