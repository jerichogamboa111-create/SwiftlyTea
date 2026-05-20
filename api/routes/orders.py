from flask import Blueprint, request, jsonify, session
from models import db, Order, OrderItem, Product

orders_bp = Blueprint('orders', __name__)

def require_login():
    if not session.get('user_id'):
        return jsonify({'error': 'Login required'}), 401
    return None

@orders_bp.route('/', methods=['POST'])
def place_order():
    err = require_login()
    if err: return err

    data = request.get_json()
    items = data.get('items', [])
    notes = data.get('notes', '')

    if not items:
        return jsonify({'error': 'Cart is empty'}), 400

    total = 0
    order_items = []
    for item in items:
        product = Product.query.get(item['product_id'])
        if not product or not product.available:
            return jsonify({'error': f'Product {item["product_id"]} not available'}), 400
        subtotal = product.price * item['quantity']
        total += subtotal
        order_items.append(OrderItem(
            product_id=product.id,
            quantity=item['quantity'],
            unit_price=product.price
        ))

    order = Order(
        user_id=session['user_id'],
        total=total,
        notes=notes
    )
    db.session.add(order)
    db.session.flush()

    for oi in order_items:
        oi.order_id = order.id
        db.session.add(oi)

    db.session.commit()
    return jsonify({'order': order.to_dict()}), 201

@orders_bp.route('/my', methods=['GET'])
def my_orders():
    err = require_login()
    if err: return err
    orders = Order.query.filter_by(user_id=session['user_id']).order_by(Order.created_at.desc()).all()
    return jsonify({'orders': [o.to_dict() for o in orders]}), 200

@orders_bp.route('/all', methods=['GET'])
def all_orders():
    if session.get('role') != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify({'orders': [o.to_dict() for o in orders]}), 200

@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
def update_status(order_id):
    if session.get('role') != 'admin':
        return jsonify({'error': 'Admin required'}), 403
    order = Order.query.get_or_404(order_id)
    data = request.get_json()
    valid = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
    status = data.get('status')
    if status not in valid:
        return jsonify({'error': 'Invalid status'}), 400
    order.status = status
    db.session.commit()
    return jsonify({'order': order.to_dict()}), 200

@orders_bp.route('/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = Order.query.get_or_404(order_id)
    for item in order.items:
        db.session.delete(item)
    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': 'Order deleted'}), 200