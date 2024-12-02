from flask import Blueprint, request, jsonify
from flask_login import (
    login_user,
    logout_user,
    login_required,
    current_user,
)  # Add current_user here
from app import db
from app.models.user import User
from datetime import datetime  # Add this import!

bp = Blueprint("auth", __name__)


@bp.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already exists"}), 400

    # Get the last user_id or start from 1
    last_user = User.query.order_by(User.user_id.desc()).first()
    next_user_id = 1 if last_user is None else last_user.user_id + 1

    user = User(username=data["username"], user_id=next_user_id)
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    return (
        jsonify({"message": "User created successfully", "user_id": next_user_id}),
        201,
    )


@bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()

    if user and user.check_password(data["password"]):
        user.is_logged_in = True
        user.last_login = datetime.utcnow()
        db.session.commit()
        login_user(user)
        return jsonify(
            {
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "user_id": user.user_id,
                    "username": user.username,
                },
            }
        )
    return jsonify({"error": "Invalid username or password"}), 401


@bp.route("/api/logout/<int:user_id>", methods=["POST"])
@login_required
def logout(user_id):
    try:
        if current_user.user_id != user_id:
            return jsonify({"error": "Cannot logout different user"}), 403

        current_user.is_logged_in = False
        current_user.last_logout = datetime.utcnow()
        db.session.commit()
        logout_user()

        return jsonify({"message": f"User {user_id} logged out successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/api/users/status", methods=["GET"])
def get_users_status():
    try:
        users = User.query.all()
        return jsonify(
            {
                "users": [
                    {
                        "user_id": user.user_id,
                        "username": user.username,
                        "status": "Online" if user.is_logged_in else "Offline",
                        "last_login": (
                            user.last_login.isoformat() if user.last_login else None
                        ),
                        "last_logout": (
                            user.last_logout.isoformat() if user.last_logout else None
                        ),
                    }
                    for user in users
                ]
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/api/current_user", methods=["GET"])
@login_required
def get_current_user():
    try:
        return (
            jsonify(
                {
                    "user": {
                        "id": current_user.id,
                        "user_id": current_user.user_id,
                        "username": current_user.username,
                    }
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": "Failed to retrieve current user."}), 500
