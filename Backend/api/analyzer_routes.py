from flask import Blueprint, request, jsonify
from google import genai
from google.api_core.exceptions import ResourceExhausted
import os
import json
import re
import time
from dotenv import load_dotenv
from database.db import db
from database.models import StartupAnalysis

load_dotenv(override=True)
analyzer_bp = Blueprint('analyzer', __name__)

# --- CONFIG ---
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None
MODEL_ID = "gemini-2.5-flash-lite"

@analyzer_bp.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_startup():
    if request.method == 'OPTIONS': return jsonify({'status': 'ok'}), 200
    try:
        data = request.get_json()
        
        # 1. Extract Data
        startup_name = data.get('startupName', 'Startup')
        raw_funding = float(data.get('funding', 0))
        market = data.get('marketSize', 'Regional')
        team = data.get('teamSize', 'Solo Founder')
        
        formatted_funding = f"₹{raw_funding:,.0f}"

        # 2. CONSTRUCT THE "VC JUDGE" PROMPT
        # We give the AI the rubric so it calculates the score itself.
        prompt = f"""
        Act as a strict Venture Capitalist. Evaluate this startup:
        
        Name: {startup_name}
        Funding: {formatted_funding}
        Market Scope: {market}
        Team Size: {team}

        SCORING RUBRIC (0-100%):
        - 0-20%: Pocket money (< ₹10k) or hobby projects.
        - 21-50%: Early stage, low funding (< ₹2L), or risky global goals with small team.
        - 51-75%: Good regional potential, decent funding (> ₹2L), solo or small team.
        - 76-95%: High funding (> ₹10L), strong team, or high-growth market fit.

        TASK:
        1. Calculate a "Success Score" based on the rubric above.
        2. Write a 2-sentence analysis.
        3. Provide 3 specific recommendations.

        RETURN JSON ONLY:
        {{
            "score": integer,
            "analysis": "string",
            "recommendations": ["string", "string", "string"]
        }}
        """

        # 3. CALL GEMINI API
        ai_data = {}
        # Default Fallback if API fails
        fallback_score = 10 if raw_funding < 10000 else 50 
        
        if client:
            for attempt in range(2): # Retry logic
                try:
                    response = client.models.generate_content(model=MODEL_ID, contents=prompt)
                    # Extract JSON from response
                    match = re.search(r'\{.*\}', response.text, re.DOTALL)
                    if match:
                        ai_data = json.loads(match.group())
                        break 
                except ResourceExhausted:
                    print("⚠️ Quota hit, retrying...")
                    time.sleep(2)
                except Exception as e:
                    print(f"⚠️ AI Error: {e}")
                    break

        # 4. EXTRACT & VALIDATE SCORE (The "Python Veto")
        # We take the AI's score, but we double-check it with hard logic.
        final_score = ai_data.get('score', fallback_score)
        
        # VETO 1: The "Pocket Money" Rule
        if raw_funding < 5000:
            final_score = min(final_score, 15) # AI cannot give >15% for <5k
            ai_data['analysis'] = f"Funding of {formatted_funding} is too low for business operations."

        # VETO 2: The "Unrealistic Global" Rule
        elif market == "Global" and raw_funding < 500000:
            final_score = min(final_score, 35) # Cap at 35% if global but poor

        # VETO 3: The "Solid Regional" Boost
        elif market == "Regional" and raw_funding > 100000:
            final_score = max(final_score, 60) # Ensure at least 60%

        # 5. PREPARE RESPONSE
        final_result = {
            "score": final_score,
            "analysis": ai_data.get('analysis', "Could not generate analysis."),
            "recommendations": ai_data.get('recommendations', ["Secure funding", "Build MVP"])
        }

        # 6. SAVE TO DATABASE
        try:
            new_entry = StartupAnalysis(
                startup_name=startup_name,
                funding=raw_funding,
                market_size=market,
                ai_result=final_result
            )
            db.session.add(new_entry)
            db.session.commit()
        except Exception as e:
            print(f"⚠️ DB Save Error: {e}")

        return jsonify(final_result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500