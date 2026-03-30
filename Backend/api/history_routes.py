from flask import Blueprint, request, jsonify
from database.db import db
from database.models import StartupAnalysis
from api.auth_routes import token_required

history_bp = Blueprint('history', __name__)

@history_bp.route('/user/history', methods=['GET'])
@token_required
def get_history(current_user):
    """Get all analyses for the logged-in user."""
    try:
        analyses = StartupAnalysis.query.filter_by(user_id=current_user.id)\
            .order_by(StartupAnalysis.created_at.desc()).all()
        
        return jsonify({
            'analyses': [a.to_dict() for a in analyses]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@history_bp.route('/user/history/<int:analysis_id>', methods=['GET'])
@token_required
def get_analysis_detail(current_user, analysis_id):
    """Get a single analysis detail."""
    try:
        analysis = StartupAnalysis.query.filter_by(
            id=analysis_id, user_id=current_user.id
        ).first()
        
        if not analysis:
            return jsonify({'error': 'Analysis not found'}), 404
        
        return jsonify(analysis.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@history_bp.route('/user/history/<int:analysis_id>', methods=['DELETE'])
@token_required
def delete_analysis(current_user, analysis_id):
    """Delete a specific analysis."""
    try:
        analysis = StartupAnalysis.query.filter_by(
            id=analysis_id, user_id=current_user.id
        ).first()
        
        if not analysis:
            return jsonify({'error': 'Analysis not found'}), 404
        
        db.session.delete(analysis)
        db.session.commit()
        
        return jsonify({'message': 'Analysis deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
