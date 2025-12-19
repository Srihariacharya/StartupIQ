from flask import Blueprint, request, jsonify
import random

analyzer_bp = Blueprint('analyzer', __name__)

@analyzer_bp.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_startup():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        
        # 1. Extract Data from the new Frontend Form
        industry = data.get('industry', '')
        funding = float(data.get('funding', 0))
        team_size = data.get('teamSize', 'Solo Founder')
        market_size = data.get('marketSize', 'Regional')
        competitors = data.get('competitors', '')
        
        # 2. Logic: Calculate Success Score (Mock Logic)
        score = 60 # Base score
        
        # Industry adjustments
        if industry in ['AI', 'Fintech', 'Healthcare']:
            score += 10
        elif industry in ['E-commerce', 'Edtech']:
            score += 5
            
        # Funding adjustments
        if funding > 50: # If funding > 50L
            score += 10
        elif funding > 20:
            score += 5
            
        # Team adjustments
        if team_size != 'Solo Founder':
            score += 10
            
        # Market adjustments
        if market_size == 'Global':
            score += 5
            
        # Randomize slightly to make it feel "alive"
        final_score = min(score + random.randint(-5, 5), 96)

        # 3. Generate Feedback
        feedback = {
            "score": final_score,
            "analysis": f"Your {industry} startup shows strong potential in the {market_size} market.",
            "recommendations": [
                "Expand your team to include a technical co-founder." if team_size == 'Solo Founder' else "Focus on team culture scaling.",
                "Increase initial runway to 18 months." if funding < 30 else "Allocate 40% of funds to customer acquisition.",
                "Conduct a deep competitor analysis." if not competitors else "Differentiate your feature set from listed competitors."
            ]
        }
        
        return jsonify(feedback), 200

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"error": str(e)}), 500