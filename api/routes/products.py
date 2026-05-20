import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from flask import Blueprint, request, jsonify
from models import db, Product
import jwt

products_bp = Blueprint('products', __name__)
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

def get_user_id(req):
    token = req.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return None
    try:
        data = jwt.decode(token, SECRET, algorithms=['HS256'])
        return data.get('user_id')
    except:
        return None

@products_bp.route('/', methods=['GET'])
def get_products():
    products = Product.query.filter_by(available=True).all()
    return jsonify({'products': [p.to_dict() for p in products]}), 200

@products_bp.route('/all', methods=['GET'])
def get_all_products():
    if get_role(request) != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    products = Product.query.all()
    return jsonify({'products': [p.to_dict() for p in products]}), 200

@products_bp.route('/', methods=['POST'])
def create_product():
    if get_role(request) != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    data = request.get_json()
    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        category=data.get('category', 'Other'),
        image_url=data.get('image_url', ''),
        available=data.get('available', True)
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'product': product.to_dict()}), 201

@products_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    if get_role(request) != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    for field in ['name', 'description', 'price', 'category', 'image_url', 'available']:
        if field in data:
            setattr(product, field, data[field])
    db.session.commit()
    return jsonify({'product': product.to_dict()}), 200

@products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    if get_role(request) != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 200
EOFcat > api/routes/products.py << 'EOF'
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from flask import Blueprint, request, jsonify
from models import db, Product
import jwt

products_bp = Blueprint('products', __name__)
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

def get_user_id(req):
    token = req.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return None
    try:
        data = jwt.decode(token, SECRET, algorithms=['HS256'])
        return data.get('user_id')
    except:
        return None

@products_bp.route('/', methods=['GET'])
def get_products():
    products = Product.query.filter_by(available=True).all()
    return jsonify({'products': [p.to_dict() for p in products]}), 200

@products_bp.route('/all', methods=['GET'])
def get_all_products():
    if get_role(request) != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    products = Product.query.all()
    return jsonify({'products': [p.to_dict() for p in products]}), 200

@products_bp.route('/', methods=['POST'])
def create_product():
    if get_role(request) != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    data = request.get_json()
    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        category=data.get('category', 'Other'),
        image_url=data.get('image_url', ''),
        available=data.get('available', True)
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'product': product.to_dict()}), 201

@products_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    if get_role(request) != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    for field in ['name', 'description', 'price', 'category', 'image_url', 'available']:
        if field in data:
            setattr(product, field, data[field])
    db.session.commit()
    return jsonify({'product': product.to_dict()}), 200

@products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    if get_role(request) != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 200
