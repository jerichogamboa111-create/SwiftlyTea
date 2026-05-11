from flask import Blueprint, jsonify, session
from models import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
def get_users():
    if session.get('role') != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    users = User.query.all()
    return jsonify({'users': [u.to_dict() for u in users]}), 200