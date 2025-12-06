from flask import Blueprint, request, jsonify
import random

analyzer_bp = Blueprint('analyzer', __name__)

@analyzer_bp.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_startup():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        
        funding = float(data.get('funding', 0) or 0)
        team_size = int(data.get('teamSize', 1) or 1)
        
        base_score = 50
        if funding > 100000: base_score += 20
        if team_size > 1: base_score += 15
        final_score = min(base_score + random.randint(-5, 5), 95)
        
        response = {
            "success_probability": final_score,
            "risks": [
                "Market saturation is potentially high in this sector.",
                "Runway might be less than 12 months with current funding."
            ],
            "recommendations": [
                "Consider finding a co-founder with complementary skills.",
                "Validate the product with 10 paying customers before scaling."
            ]
        }
        
        return jsonify(response), 200

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"error": str(e)}), 500