from flask import Blueprint, request, jsonify, session
from models import db, Product

products_bp = Blueprint('products', __name__)

def require_admin():
    if session.get('role') != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    return None

@products_bp.route('/', methods=['GET'])
def get_products():
    category = request.args.get('category')
    query = Product.query
    if category:
        query = query.filter_by(category=category)
    products = query.filter_by(available=True).all()
    return jsonify({'products': [p.to_dict() for p in products]}), 200

@products_bp.route('/all', methods=['GET'])
def get_all_products():
    err = require_admin()
    if err: return err
    products = Product.query.all()
    return jsonify({'products': [p.to_dict() for p in products]}), 200

@products_bp.route('/', methods=['POST'])
def create_product():
    err = require_admin()
    if err: return err
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
    err = require_admin()
    if err: return err
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    for field in ['name', 'description', 'price', 'category', 'image_url', 'available']:
        if field in data:
            setattr(product, field, data[field])
    db.session.commit()
    return jsonify({'product': product.to_dict()}), 200

@products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    err = require_admin()
    if err: return err
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 200