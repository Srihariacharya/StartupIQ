from flask import Blueprint, request, jsonify
from database.db import db
from database.models import StartupAnalysis
from api.auth_routes import token_required
import uuid

share_bp = Blueprint('share', __name__)

@share_bp.route('/share/<int:analysis_id>', methods=['POST'])
@token_required
def create_share_link(current_user, analysis_id):
    """Generate a shareable link for an analysis."""
    try:
        analysis = StartupAnalysis.query.filter_by(
            id=analysis_id, user_id=current_user.id
        ).first()

        if not analysis:
            return jsonify({'error': 'Analysis not found'}), 404

        # Generate unique share ID if not exists
        if not analysis.share_id:
            analysis.share_id = str(uuid.uuid4())[:8]
            db.session.commit()

        return jsonify({
            'share_id': analysis.share_id,
            'message': 'Share link created!'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@share_bp.route('/shared/<string:share_id>', methods=['GET'])
def get_shared_report(share_id):
    """Get a shared report (public, no auth required)."""
    try:
        analysis = StartupAnalysis.query.filter_by(share_id=share_id).first()

        if not analysis:
            return jsonify({'error': 'Report not found'}), 404

        return jsonify(analysis.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
