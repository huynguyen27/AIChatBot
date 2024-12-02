from app import db
from datetime import datetime

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(10), nullable=False)  # 'user' or 'bot'
    text = db.Column(db.Text, nullable=False)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)