from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Order, OrderItem, Product, User

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    items = data.get('items', [])
    if not items:
        return jsonify({'error': 'Order must have at least one item'}), 400
    total = 0
    order_items = []
    for item in items:
        product = Product.query.get(item['product_id'])
        if not product or not product.available:
            return jsonify({'error': f'Product {item["product_id"]} not available'}), 400
        total += product.price * item['quantity']
        order_items.append(OrderItem(
            product_id=product.id,
            quantity=item['quantity'],
            price=product.price
        ))
    order = Order(user_id=user_id, total=total)
    db.session.add(order)
    db.session.flush()
    for oi in order_items:
        oi.order_id = order.id
        db.session.add(oi)
    db.session.commit()
    return jsonify(order.to_dict()), 201

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user and user.is_admin:
        orders = Order.query.order_by(Order.created_at.desc()).all()
    else:
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders]), 200

@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_status(order_id):
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    order = Order.query.get_or_404(order_id)
    data = request.get_json()
    order.status = data.get('status', order.status)
    db.session.commit()
    return jsonify(order.to_dict()), 200