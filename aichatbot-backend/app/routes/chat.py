import os
from groq import Groq
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.conversation import Conversation
from app.models.message import Message
from datetime import datetime

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

bp = Blueprint("chat", __name__)

MODEL_SETTINGS = {
    "llama3-8b-8192": {
        "temperature": 0.8,
        "max_tokens": 1024,
        "max_context_messages": 10,  # Limit context window to last 10 messages
    }
}


def prepare_conversation_context(conversation_id, limit=10):
    """
    Prepare conversation context for AI, limiting to recent messages
    """
    messages = (
        Message.query.filter_by(conversation_id=conversation_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
        .all()
    )

    # Reverse to get chronological order
    messages = messages[::-1]

    # Start with system message
    context = [
        {
            "role": "system",
            "content": (
                "You are a helpful AI assistant. Your name is Groq Assistant. "
                "You remember that the user's previous messages are part of the conversation context. "
                "Keep responses concise but informative."
            ),
        }
    ]

    # Add message history
    for msg in messages:
        role = "user" if msg.sender == "user" else "assistant"
        context.append({"role": role, "content": msg.text})

    return context


@bp.route("/api/conversations", methods=["GET"])
@login_required
def get_conversations():
    try:
        conversations = (
            Conversation.query.filter_by(user_id=current_user.id)
            .order_by(Conversation.created_at.desc())
            .all()
        )

        return jsonify(
            [
                {
                    "id": c.id,
                    "name": c.name,
                    "created_at": c.created_at.isoformat(),
                    "last_message": c.messages[-1].text if c.messages else None,
                    "message_count": len(c.messages),
                }
                for c in conversations
            ]
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/api/conversations", methods=["POST"])
@login_required
def create_conversation():
    try:
        data = request.get_json()
        if not data.get("name"):
            return jsonify({"error": "Conversation name is required"}), 400

        conversation = Conversation(name=data["name"], user_id=current_user.id)
        db.session.add(conversation)
        db.session.commit()

        # Create initial AI greeting
        context = [
            {
                "role": "system",
                "content": "You are a helpful AI assistant named Groq Assistant. Greet the user and keep it brief.",
            }
        ]

        ai_response = client.chat.completions.create(
            messages=context,
            model="llama3-8b-8192",
            temperature=MODEL_SETTINGS["llama3-8b-8192"]["temperature"],
            max_tokens=100,  # Shorter for greeting
        )

        greeting = Message(
            sender="bot",
            text=ai_response.choices[0].message.content,
            conversation_id=conversation.id,
        )
        db.session.add(greeting)
        db.session.commit()

        return (
            jsonify(
                {
                    "id": conversation.id,
                    "name": conversation.name,
                    "created_at": conversation.created_at.isoformat(),
                    "greeting": greeting.text,
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/api/conversations/<int:conversation_id>/messages", methods=["GET"])
@login_required
def get_messages(conversation_id):
    try:
        conversation = Conversation.query.filter_by(
            id=conversation_id, user_id=current_user.id
        ).first()

        if not conversation:
            return jsonify({"error": "Conversation not found"}), 404

        # Paginate messages
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 20, type=int)

        messages = (
            Message.query.filter_by(conversation_id=conversation_id)
            .order_by(Message.created_at.desc())
            .paginate(page=page, per_page=per_page)
        )

        return jsonify(
            {
                "messages": [
                    {
                        "id": message.id,
                        "sender": message.sender,
                        "text": message.text,
                        "created_at": message.created_at.isoformat(),
                    }
                    for message in messages.items
                ],
                "total_pages": messages.pages,
                "current_page": page,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/api/conversations/<int:conversation_id>/messages", methods=["POST"])
@login_required
def create_message(conversation_id):
    try:
        conversation = Conversation.query.filter_by(
            id=conversation_id, user_id=current_user.id
        ).first()

        if not conversation:
            return jsonify({"error": "Conversation not found"}), 404

        data = request.get_json()
        if not data.get("text"):
            return jsonify({"error": "Message text is required"}), 400

        # Create user message
        user_message = Message(
            sender="user", text=data["text"], conversation_id=conversation_id
        )
        db.session.add(user_message)
        db.session.commit()  # Commit immediately to include in context

        # Prepare context with limited history
        context = prepare_conversation_context(
            conversation_id, MODEL_SETTINGS["llama3-8b-8192"]["max_context_messages"]
        )

        # Get AI response
        ai_response = client.chat.completions.create(
            messages=context,
            model="llama3-8b-8192",
            temperature=MODEL_SETTINGS["llama3-8b-8192"]["temperature"],
            max_tokens=MODEL_SETTINGS["llama3-8b-8192"]["max_tokens"],
        )

        # Create AI message
        ai_message = Message(
            sender="bot",
            text=ai_response.choices[0].message.content,
            conversation_id=conversation_id,
        )
        db.session.add(ai_message)
        db.session.commit()

        return (
            jsonify(
                {
                    "user_message": {
                        "id": user_message.id,
                        "sender": user_message.sender,
                        "text": user_message.text,
                        "created_at": user_message.created_at.isoformat(),
                    },
                    "ai_message": {
                        "id": ai_message.id,
                        "sender": ai_message.sender,
                        "text": ai_message.text,
                        "created_at": ai_message.created_at.isoformat(),
                    },
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/api/conversations/<int:conversation_id>", methods=["DELETE"])
@login_required
def delete_conversation(conversation_id):
    try:
        conversation = Conversation.query.filter_by(
            id=conversation_id, user_id=current_user.id
        ).first()

        if not conversation:
            return jsonify({"error": "Conversation not found"}), 404

        db.session.delete(conversation)
        db.session.commit()

        return jsonify({"message": "Conversation deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
