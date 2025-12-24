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

        team_size_map = { "Solo Founder": 1, "2-4 Employees": 3, "5-10 Employees": 7, "10+ Employees": 15 }
        raw_team_text = data.get('teamSize', 'Solo Founder').strip()
        numeric_team_size = team_size_map.get(raw_team_text, 1)

        try:
            sector_encoded = le_sector.transform([data.get('industry', 'Other')])[0]
            market_encoded = le_market.transform([data.get('marketSize', 'Regional')])[0]
        except:
            sector_encoded, market_encoded = 0, 0
        
        input_df = pd.DataFrame([[
            float(data.get('funding', 0)), numeric_team_size,
            sector_encoded, market_encoded, 1 
        ]], columns=['Funding', 'TeamSize', 'Sector', 'MarketSize', 'Competition'])

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
        
        final_score = None
        source = "Random Forest Model (Trained)"
        
        # 1. ROBUST CSV CHECK
        if os.path.exists(CSV_PATH):
            try:
                df = pd.read_csv(CSV_PATH)
                
                # --- FIX 1: Clean Headers AND Data ---
                df.columns = df.columns.str.strip() # Clean headers
                if 'StartupName' in df.columns:
                    # Clean the actual names in the rows (remove hidden spaces)
                    df['StartupName'] = df['StartupName'].astype(str).str.strip()
                    
                    match = df[df['StartupName'].str.lower() == startup_name.lower()]
                    
                    if not match.empty:
                        if 'SuccessProb' in df.columns:
                            final_score = int(match.iloc[0]['SuccessProb'])
                        elif 'Outcome' in df.columns:
                            final_score = int(match.iloc[0]['Outcome'] * 100)
                        source = "Local Dataset (Exact Match)"
                else:
                    print("❌ ERROR: 'StartupName' column missing from CSV!")

            except Exception as csv_err:
                print(f"❌ CSV Read Error: {csv_err}")

        # 2. Fallback to ML
        if final_score is None:
            print(f"🤖 Startup '{startup_name}' not found in CSV. Using ML Model.")
            final_score = get_ml_score(data)

        # 3. Gemini Analysis with FALLBACK
        api_key = os.getenv("GEMINI_API_KEY")
        prompt = f"""
        Act as a Venture Capital Analyst. Analyze '{startup_name}' (Score: {final_score}/100).
        Return JSON: {{ "analysis": "2 sentences", "recommendations": ["Tip 1", "Tip 2", "Tip 3"] }}
        """
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
        response = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
        
        ai_analysis = "AI analysis unavailable at the moment."
        ai_recs = ["Focus on MVP", "Validate market fit", "Optimize cash burn"]

        if response.status_code == 200:
            try:
                gen_text = response.json()['candidates'][0]['content']['parts'][0]['text']
                clean_text = gen_text.replace("```json", "").replace("```", "").strip()
                ai_content = json.loads(clean_text)
                ai_analysis = ai_content.get('analysis', ai_analysis)
                ai_recs = ai_content.get('recommendations', ai_recs)
            except Exception as parse_err:
                print(f"⚠️ JSON Parse Error: {parse_err}")
        else:
            print(f"⚠️ Gemini API Failed: {response.status_code} - {response.text}")

        # --- FIX 2: ALWAYS RETURN A RESPONSE ---
        return jsonify({
            "score": final_score,
            "analysis": ai_analysis,
            "recommendations": ai_recs,
            "source": source
        }), 200
            
    except Exception as e:
        print(f"🔥 Backend Critical Error: {e}")
        # Always return JSON error, never just crash
        return jsonify({"error": str(e)}), 500