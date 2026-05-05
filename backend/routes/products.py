from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Product, User

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    category = request.args.get('category')
    query = Product.query.filter_by(available=True)
    if category:
        query = query.filter_by(category=category)
    return jsonify([p.to_dict() for p in query.all()]), 200

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200

@products_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    data = request.get_json()
    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        category=data.get('category', 'other'),
        image_url=data.get('image_url', '')
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@products_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    for field in ('name', 'description', 'price', 'category', 'image_url', 'available'):
        if field in data:
            setattr(product, field, data[field])
    db.session.commit()
    return jsonify(product.to_dict()), 200

@products_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    product = Product.query.get_or_404(product_id)
    product.available = False
    db.session.commit()
    return jsonify({'message': 'Product removed'}), 200