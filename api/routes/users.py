import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from flask import Blueprint, request, jsonify
from models import db, User
import jwt

users_bp = Blueprint('users', __name__)
SECRET = 'swiftlytea-jwt-secret-2024'

def get_role(req):
    token = req.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return None
    try:
        data = jwt.decode(token, SECRET, algorithms=['HS256'])
        return data.get('role')
    except:
        return None

@users_bp.route('/', methods=['GET'])
def get_users():
    if get_role(request) != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    users = User.query.all()
    return jsonify({'users': [u.to_dict() for u in users]}), 200
