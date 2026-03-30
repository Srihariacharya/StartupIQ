from flask import Blueprint, request, jsonify
from google import genai
import os
import json
import re
from dotenv import load_dotenv

load_dotenv(override=True)
canvas_bp = Blueprint('canvas', __name__)

# --- CONFIG ---
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None
MODEL_ID = "gemini-2.5-flash-lite"

@canvas_bp.route('/canvas', methods=['POST', 'OPTIONS'])
def generate_canvas():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        startup_name = data.get('startupName', 'Startup')
        description = data.get('description', '')

        prompt = f"""
        Act as a startup business strategist. Generate a complete Business Model Canvas for this startup:
        
        Startup Name: {startup_name}
        Description: {description}
        
        Fill out all 9 blocks of the Business Model Canvas:
        1. Key Partners - Who are the key partners and suppliers?
        2. Key Activities - What key activities does the value proposition require?
        3. Key Resources - What key resources does the value proposition require?
        4. Value Propositions - What value do we deliver to the customer?
        5. Customer Relationships - What type of relationship does each customer segment expect?
        6. Channels - Through which channels do customer segments want to be reached?
        7. Customer Segments - For whom are we creating value?
        8. Cost Structure - What are the most important costs inherent in the business model?
        9. Revenue Streams - For what value are customers willing to pay?
        
        For each block, provide 3-5 specific, actionable bullet points.
        
        RETURN JSON ONLY:
        {{
            "canvas": {{
                "keyPartners": ["string", "string", "string"],
                "keyActivities": ["string", "string", "string"],
                "keyResources": ["string", "string", "string"],
                "valuePropositions": ["string", "string", "string"],
                "customerRelationships": ["string", "string", "string"],
                "channels": ["string", "string", "string"],
                "customerSegments": ["string", "string", "string"],
                "costStructure": ["string", "string", "string"],
                "revenueStreams": ["string", "string", "string"]
            }}
        }}
        """

        result = {"canvas": {}}

        if client:
            try:
                response = client.models.generate_content(model=MODEL_ID, contents=prompt)
                match = re.search(r'\{.*\}', response.text, re.DOTALL)
                if match:
                    result = json.loads(match.group())
            except Exception as e:
                print(f"[WARN] Canvas AI Error: {e}")
                # Fallback with generic canvas
                result = {
                    "canvas": {
                        "keyPartners": ["Technology vendors", "Distribution partners", "Industry experts"],
                        "keyActivities": ["Product development", "Marketing", "Customer support"],
                        "keyResources": ["Development team", "IP/Technology", "Brand"],
                        "valuePropositions": ["Solving core problem", "Better UX than competitors", "Cost savings"],
                        "customerRelationships": ["Self-service platform", "Community forums", "Premium support"],
                        "channels": ["Website/App", "Social media", "Partnerships"],
                        "customerSegments": ["Early adopters", "SMBs", "Enterprise customers"],
                        "costStructure": ["Development costs", "Marketing budget", "Infrastructure"],
                        "revenueStreams": ["Subscription fees", "Freemium upsell", "Enterprise licensing"]
                    }
                }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
