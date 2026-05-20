import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)
SECRET = 'swiftlytea-jwt-secret-2024'

def make_token(user):
    return jwt.encode({
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, SECRET, algorithm='HS256')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if not user or not check_password_hash(user.password, data.get('password', '')):
        return jsonify({'error': 'Invalid credentials'}), 401
    token = make_token(user)
    return jsonify({'user': user.to_dict(), 'token': token}), 200

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
    token = make_token(user)
    return jsonify({'user': user.to_dict(), 'token': token}), 201

@auth_bp.route('/me', methods=['GET'])
def me():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Not logged in'}), 401
    try:
        data = jwt.decode(token, SECRET, algorithms=['HS256'])
        user = User.query.get(data['user_id'])
        return jsonify({'user': user.to_dict()}), 200
    except:
        return jsonify({'error': 'Invalid token'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out'}), 200
