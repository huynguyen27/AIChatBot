from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.conversation import Conversation
from app.models.message import Message

bp = Blueprint('chat', __name__)

@bp.route('/api/conversations', methods=['GET'])
@login_required
def get_conversations():
    try:
        conversations = Conversation.query.filter_by(user_id=current_user.id)\
            .order_by(Conversation.created_at.desc()).all()
        return jsonify([{
            'id': c.id,
            'name': c.name,
            'messages': [{
                'id': m.id,
                'sender': m.sender,
                'text': m.text,
                'created_at': m.created_at.isoformat()
            } for m in c.messages]
        } for c in conversations])
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug print
        return jsonify({'error': str(e)}), 500

@bp.route('/api/conversations', methods=['POST'])
@login_required
def create_conversation():
    data = request.get_json()
    conversation = Conversation(
        name=data['name'],
        user_id=current_user.id
    )
    db.session.add(conversation)
    db.session.commit()
    return jsonify({
        'id': conversation.id,
        'name': conversation.name
    }), 201