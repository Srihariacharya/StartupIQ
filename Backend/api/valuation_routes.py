import numpy as np
import pandas as pd
import os
import json  # <--- WAS MISSING
import joblib
import google.generativeai as genai # <--- WAS MISSING
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from sklearn.linear_model import LinearRegression

valuation_bp = Blueprint('valuation', __name__)

# --- CONFIGURATION ---
# Load API Key for Gemini (Auto-Fill Feature)
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("⚠️ WARNING: GEMINI_API_KEY not found. Auto-Fill will use fallback data.")
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

# --- ROUTE 1: PREDICT VALUATION (ML) ---
@valuation_bp.route('/predict_valuation', methods=['POST', 'OPTIONS'])
@cross_origin()
def predict_valuation():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    
    global local_model
    if not local_model:
        local_model = get_trained_model()
        if not local_model:
            return jsonify({"error": "Model training failed."}), 500

    try:
        data = request.get_json()
        
        # Inputs
        revenue = float(data.get('revenue', 0)) 
        growth = float(data.get('growth', 0))
        users = float(data.get('users', 0))
        
        input_features = np.array([[revenue, growth, users]])
        prediction = local_model.predict(input_features)[0]
        
        # Formatting
        val_cap = max(0.1, round(prediction, 2)) 
        
        return jsonify({
            "valuation": f"₹{val_cap} Crores",
            "details": f"Calculated based on ₹{revenue} Lakhs MRR & {growth}% growth.",
            "algorithm": "Linear Regression (Locally Trained)"
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
        print(f"🤖 AI Estimating numbers for: {industry}")

        # Safety Check: Is API Key working?
        if not api_key:
            raise ValueError("No Gemini API Key configured")

        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        I am launching a seed-stage startup in the "{industry}" industry in India.
        Provide REALISTIC conservative estimates for Year 1 metrics.
        
        Return STRICT JSON format (no markdown):
        {{
            "revenue": 15, 
            "growth": 20, 
            "users": 5
        }}
        """
        
        response = model.generate_content(prompt)
        # Clean the response to ensure it's valid JSON
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        estimates = json.loads(clean_text)
        
        return jsonify(estimates), 200
        
    except Exception as e:
        print(f"⚠️ Auto-Fill Failed: {e}") # Check your terminal for this error!
        # Fallback values if AI fails
        return jsonify({
            "revenue": 5, 
            "growth": 15, 
            "users": 1
        }), 200