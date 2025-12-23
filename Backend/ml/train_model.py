import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# 1. NAVIGATION LOGIC based on your image
# Script is in: Backend/ml/train_model.py
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__)) 

# Data is in: Backend/data/startup_data.csv
# We go UP one level from 'ml' to 'Backend', then DOWN into 'data'
DATA_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'startup_data.csv')

# Model will be saved in: Backend/ml/models/startup_predictor.pkl
MODEL_DIR = os.path.join(SCRIPT_DIR, 'models')
MODEL_FILE = os.path.join(MODEL_DIR, 'startup_predictor.pkl')

print(f"📍 Training script location: {SCRIPT_DIR}")
print(f"📂 Searching for data at: {os.path.abspath(DATA_PATH)}")

try:
    if not os.path.exists(DATA_PATH):
        print(f"❌ ERROR: Cannot find startup_data.csv at {DATA_PATH}")
        exit()

    df = pd.read_csv(DATA_PATH)
    print(f"✅ Data loaded successfully ({len(df)} rows).")

    # 2. PRE-PROCESSING
    le_sector, le_market, le_comp = LabelEncoder(), LabelEncoder(), LabelEncoder()
    df['Sector'] = le_sector.fit_transform(df['Sector'])
    df['MarketSize'] = le_market.fit_transform(df['MarketSize'])
    df['Competition'] = le_comp.fit_transform(df['Competition'])

    X = df[['Funding', 'TeamSize', 'Sector', 'MarketSize', 'Competition']]
    y = df['Outcome']

    # 3. TRAINING
    print("🧠 Training Random Forest Model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    # 4. SAVE TO 'ml/models/'
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    artifacts = {
        'model': model,
        'le_sector': le_sector,
        'le_market': le_market,
        'le_comp': le_comp
    }

    joblib.dump(artifacts, MODEL_FILE)
    print(f"🎉 SUCCESS! Model saved at: {MODEL_FILE}")

except Exception as e:
    print(f"❌ ERROR: {e}")