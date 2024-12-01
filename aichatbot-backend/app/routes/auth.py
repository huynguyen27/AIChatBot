from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required
from app import db
from app.models.user import User

bp = Blueprint('auth', __name__)

@bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    user = User(username=data['username'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        login_user(user, remember=True)  # Add remember=True
        return jsonify({
            'message': 'Login successful',
            'user': {'id': user.id, 'username': user.username}
        })
    return jsonify({'error': 'Invalid username or password'}), 401

@bp.route('/api/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})