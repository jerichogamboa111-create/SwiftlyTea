import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from flask import Blueprint, request, jsonify, session
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if not user or not check_password_hash(user.password, data.get('password', '')):
        return jsonify({'error': 'Invalid credentials'}), 401
    session.permanent = True
    session['user_id'] = user.id
    session['role'] = user.role
    session['username'] = user.username
    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        role='customer'
    )
    db.session.add(user)
    db.session.commit()
    session.permanent = True
    session['user_id'] = user.id
    session['role'] = user.role
    session['username'] = user.username
    return jsonify({'user': user.to_dict()}), 201

@auth_bp.route('/me', methods=['GET'])
def me():
    if not session.get('user_id'):
        return jsonify({'error': 'Not logged in'}), 401
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'}), 200
