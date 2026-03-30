from flask import Blueprint, request, jsonify
from google import genai
import os
import json
import re
from dotenv import load_dotenv

load_dotenv(override=True)
competitor_bp = Blueprint('competitors', __name__)

# --- CONFIG ---
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None
MODEL_ID = "gemini-2.5-flash-lite"

@competitor_bp.route('/competitors', methods=['POST', 'OPTIONS'])
def analyze_competitors():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        startup_name = data.get('startupName', 'Startup')
        industry = data.get('industry', 'Technology')
        description = data.get('description', '')

        prompt = f"""
        Act as a market research analyst. Analyze the competitive landscape for this startup:
        
        Startup Name: {startup_name}
        Industry: {industry}
        Description: {description}
        
        TASK:
        1. Identify the top 5 real or likely competitors in this space (prefer Indian market competitors if applicable).
        2. For each competitor, provide:
           - name: company name
           - strengths: array of 2-3 key strengths
           - weaknesses: array of 2-3 key weaknesses
           - marketPosition: short description of their market position
           - threatLevel: "High", "Medium", or "Low"
        3. Write a brief 2-sentence summary of the competitive landscape.
        
        RETURN JSON ONLY:
        {{
            "summary": "string",
            "competitors": [
                {{
                    "name": "string",
                    "strengths": ["string", "string"],
                    "weaknesses": ["string", "string"],
                    "marketPosition": "string",
                    "threatLevel": "High|Medium|Low"
                }}
            ]
        }}
        """

        result = {"summary": "Unable to analyze competitors.", "competitors": []}

        if client:
            try:
                response = client.models.generate_content(model=MODEL_ID, contents=prompt)
                match = re.search(r'\{.*\}', response.text, re.DOTALL)
                if match:
                    result = json.loads(match.group())
            except Exception as e:
                print(f"[WARN] Competitor AI Error: {e}")
                # Fallback
                result = {
                    "summary": f"Could not complete AI analysis for {startup_name} in {industry}.",
                    "competitors": [
                        {
                            "name": "Market Leader A",
                            "strengths": ["Strong brand", "Large user base"],
                            "weaknesses": ["Slow innovation", "High pricing"],
                            "marketPosition": "Market leader with dominant share",
                            "threatLevel": "High"
                        },
                        {
                            "name": "Emerging Player B",
                            "strengths": ["Innovative product", "Good funding"],
                            "weaknesses": ["Limited reach", "New to market"],
                            "marketPosition": "Growing challenger",
                            "threatLevel": "Medium"
                        }
                    ]
                }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
