from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    return jsonify([u.to_dict() for u in User.query.all()]), 200

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict()), 200