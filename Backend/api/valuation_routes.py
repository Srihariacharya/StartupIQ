import numpy as np
import pandas as pd
import os
import json
import joblib
import random 
import google.generativeai as genai
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from sklearn.linear_model import LinearRegression

valuation_bp = Blueprint('valuation', __name__)

# --- CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("⚠️ WARNING: GEMINI_API_KEY not found.")
else:
    genai.configure(api_key=api_key)
    print("✅ Valuation Module: Gemini API Key Loaded.")

# --- PATH SETUP ---
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_ROOT = os.path.dirname(CURRENT_DIR)
DATA_FILE = os.path.join(BACKEND_ROOT, 'data', 'valuation_dataset.csv')
MODEL_DIR = os.path.join(BACKEND_ROOT, 'ml', 'models')
MODEL_FILE = os.path.join(MODEL_DIR, 'valuation_model.pkl')

# --- MODEL TRAINING ---
def get_trained_model():
    if os.path.exists(MODEL_FILE):
        return joblib.load(MODEL_FILE)
    
    if not os.path.exists(DATA_FILE):
        return None

    try:
        os.makedirs(MODEL_DIR, exist_ok=True)
        df = pd.read_csv(DATA_FILE)
        X = df[['revenue_k', 'growth_pct', 'users_k']]
        y = df['valuation_m']
        
        model = LinearRegression()
        model.fit(X, y)
        joblib.dump(model, MODEL_FILE)
        return model
    except Exception as e:
        print(f"❌ Model Training Error: {e}")
        return None

local_model = get_trained_model()

# --- ROUTE 1: PREDICT VALUATION (ML + LOGIC HYBRID) ---
@valuation_bp.route('/predict_valuation', methods=['POST', 'OPTIONS'])
@cross_origin()
def predict_valuation():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    
    global local_model
    if not local_model:
        local_model = get_trained_model()

    try:
        data = request.get_json()
        
        # --- INPUTS ---
        revenue_in_lakhs = float(data.get('revenue', 0)) 
        growth = float(data.get('growth', 0))
        users_in_thousands = float(data.get('users', 0))
        
        # --- STEP 1: ML PREDICTION (For Base Stability) ---
        input_features = np.array([[revenue_in_lakhs, 0, users_in_thousands]])
        base_valuation_crores = local_model.predict(input_features)[0]
        
        # --- STEP 2: MANUAL GROWTH BOOST (Guaranteed Positive) ---
        growth_multiplier = 1 + (growth * 0.005) 
        
        final_valuation = base_valuation_crores * growth_multiplier
        
        # --- STEP 3: REALISM CHECK ---
        if revenue_in_lakhs < 1:
             # Cap value at roughly 10x revenue for tiny projects
             max_allowed = (revenue_in_lakhs * 10) / 100 # Convert back to Crores
             final_valuation = min(final_valuation, max_allowed)

        # Ensure positive
        final_valuation = max(0.001, final_valuation)

        # --- FORMATTING LOGIC ---
        val_in_rupees = final_valuation * 10000000
        formatted_result = ""
        
        if val_in_rupees >= 10000000:
            val = round(val_in_rupees / 10000000, 2)
            formatted_result = f"₹{val} Crores"
        elif val_in_rupees >= 100000:
            val = round(val_in_rupees / 100000, 1)
            formatted_result = f"₹{val} Lakhs"
        else:
            val = round(val_in_rupees / 1000, 1)
            formatted_result = f"₹{val} Thousand"

        return jsonify({
            "valuation": formatted_result,
            "details": f"Calculated for {users_in_thousands}k Users & ₹{revenue_in_lakhs}L Revenue.",
            "algorithm": "Hybrid Regression (ML + Growth Logic)"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- ROUTE 2: AUTO-ESTIMATE METRICS (AI) ---
@valuation_bp.route('/estimate_metrics', methods=['POST', 'OPTIONS'])
@cross_origin()
def estimate_metrics():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
        
    try:
        data = request.get_json()
        industry = data.get('industry', 'Technology')
        
        if not api_key:
            raise ValueError("No Gemini API Key")

        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # --- FIX FOR REPETITIVE NUMBERS ---
        scenarios = [
            "a viral high-growth startup",
            "a steady bootstrapped business",
            "an aggressive venture-backed startup",
            "an early-stage research project"
        ]
        chosen_scenario = random.choice(scenarios)

        prompt = f"""
        I am launching {chosen_scenario} in the "{industry}" industry in India.
        Provide OPTIMISTIC Year 1 metrics (Seed Stage).
        
        Return STRICT JSON format (no markdown):
        {{
            "revenue": (number between 5 and 50), 
            "growth": (number between 15 and 100), 
            "users": (number between 1 and 20)
        }}
        """
        
        response = model.generate_content(prompt)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        estimates = json.loads(clean_text)
        
        return jsonify(estimates), 200
        
    except Exception as e:
        print(f"⚠️ Auto-Fill Failed: {e}")
        
        # Fallback with randomness if API fails
        return jsonify({
            "revenue": random.randint(5, 20), 
            "growth": random.randint(10, 40), 
            "users": random.randint(1, 10)
        }), 200