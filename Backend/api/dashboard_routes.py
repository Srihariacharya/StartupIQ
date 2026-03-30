from flask import Blueprint, request, jsonify
from database.db import db
from database.models import StartupAnalysis
from api.auth_routes import token_required

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/user/dashboard', methods=['GET'])
@token_required
def get_dashboard(current_user):
    """Get dashboard stats and recent analyses for the logged-in user."""
    try:
        # Get all analyses for this user
        analyses = StartupAnalysis.query.filter_by(user_id=current_user.id)\
            .order_by(StartupAnalysis.created_at.desc()).all()
        
        # Calculate stats
        total = len(analyses)
        scores = [a.ai_result.get('score', 0) for a in analyses if a.ai_result]
        avg_score = round(sum(scores) / len(scores), 1) if scores else 0
        best_score = max(scores) if scores else 0

        # Recent analyses (last 5)
        recent = [a.to_dict() for a in analyses[:5]]

        return jsonify({
            'stats': {
                'total': total,
                'avgScore': avg_score,
                'bestScore': best_score
            },
            'recent': recent
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
