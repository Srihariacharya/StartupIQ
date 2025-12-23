from flask import Blueprint, request, jsonify
import requests
import os
import json
import joblib
import pandas as pd
from dotenv import load_dotenv

load_dotenv(override=True)
analyzer_bp = Blueprint('analyzer', __name__)

# --- PRECISE ABSOLUTE PATHING ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, '..', 'data', 'startup_data.csv')
MODEL_PATH = os.path.join(BASE_DIR, '..', 'ml', 'models', 'startup_predictor.pkl')

print(f"✅ CSV PATH: {os.path.abspath(CSV_PATH)}")
print(f"✅ MODEL PATH: {os.path.abspath(MODEL_PATH)}")

def get_ml_score(data):
    try:
        if not os.path.exists(MODEL_PATH):
            print(f"⚠️ Model not found at {MODEL_PATH}")
            return 50
        
        artifacts = joblib.load(MODEL_PATH)
        model = artifacts['model']
        le_sector = artifacts.get('le_sector')
        le_market = artifacts.get('le_market')

        # Map UI Text to Numbers
        team_size_map = {
            "Solo Founder": 1,
            "2-4 Employees": 3,
            "5-10 Employees": 7,
            "10+ Employees": 15
        }
        raw_team_text = data.get('teamSize', 'Solo Founder').strip()
        numeric_team_size = team_size_map.get(raw_team_text, 1)

        try:
            sector_encoded = le_sector.transform([data.get('industry', 'Other')])[0]
            market_encoded = le_market.transform([data.get('marketSize', 'Regional')])[0]
        except:
            sector_encoded, market_encoded = 0, 0
        
        input_df = pd.DataFrame([[
            float(data.get('funding', 0)),
            numeric_team_size,
            sector_encoded,
            market_encoded,
            1 
        ]], columns=['Funding', 'TeamSize', 'Sector', 'MarketSize', 'Competition'])

        # Predict probability from the trained Random Forest
        return int(model.predict_proba(input_df)[0][1] * 100)
    except Exception as e:
        print(f"❌ ML Error: {e}")
        return 45

@analyzer_bp.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_startup():
    if request.method == 'OPTIONS': 
        return jsonify({'status': 'ok'}), 200
    try:
        data = request.get_json()
        startup_name = data.get('startupName', '').strip()
        
        # 1. Check CSV for Historical Ground Truth
        final_score = None
        source = "Random Forest Model (Trained)"
        
        if os.path.exists(CSV_PATH):
            df = pd.read_csv(CSV_PATH)
            match = df[df['StartupName'].str.lower() == startup_name.lower()]
            
            if not match.empty:
                # NEW: Look for specific SuccessProb column first
                if 'SuccessProb' in df.columns:
                    final_score = int(match.iloc[0]['SuccessProb'])
                else:
                    # Fallback to binary outcome if column doesn't exist
                    final_score = int(match.iloc[0]['Outcome'] * 100)
                
                source = "Local Dataset (Exact Match)"

        # 2. Use ML Model if no exact CSV match is found
        if final_score is None:
            final_score = get_ml_score(data)

        # 3. Gemini Qualitative Analysis
        api_key = os.getenv("GEMINI_API_KEY")
        prompt = f"""
        Act as a Venture Capital Analyst. 
        Analyze the startup '{startup_name}' which has a calculated feasibility score of {final_score}/100.
        
        Return a JSON object with this EXACT structure:
        {{
            "analysis": "A professional 2-sentence summary.",
            "recommendations": [
                "Specific strategic tip 1",
                "Specific strategic tip 2",
                "Specific strategic tip 3"
            ]
        }}
        Crucial: 'recommendations' MUST be a list of simple strings.
        """
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
        response = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
        
        if response.status_code == 200:
            gen_text = response.json()['candidates'][0]['content']['parts'][0]['text']
            clean_text = gen_text.replace("```json", "").replace("```", "").strip()
            ai_content = json.loads(clean_text)
            
            return jsonify({
                "score": final_score,
                "analysis": ai_content.get('analysis'),
                "recommendations": ai_content.get('recommendations'),
                "source": source
            }), 200
            
    except Exception as e:
        print(f"Backend Error: {e}")
        return jsonify({"error": str(e)}), 500