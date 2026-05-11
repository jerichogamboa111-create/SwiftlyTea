import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/App.css";

const STATUS_COLORS = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#8b5cf6",
  ready: "#10b981",
  delivered: "#6b7280",
  cancelled: "#ef4444",
};

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOrders([]);
    setLoading(true);
    fetch("http://localhost:5000/api/orders/my", {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, [user]);

  const deleteOrder = async (id) => {
    if (!confirm("Delete this order?")) return;
    await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: "DELETE", credentials: "include",
    });
    setOrders(orders.filter((o) => o.id !== id));
  };

  if (loading) return <div className="page-container"><p>Loading orders...</p></div>;

  if (orders.length === 0) {
    return (
      <div className="page-container center-content">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No orders yet</h2>
          <p>Your order history will appear here.</p>
          <Link to="/" className="btn-primary">Start Ordering</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-id">Order #{order.id}</span>
                <span className="order-date">{new Date(order.created_at).toLocaleString()}</span>
              </div>
              <span
                className="order-status"
                style={{ background: STATUS_COLORS[order.status] + "22", color: STATUS_COLORS[order.status] }}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="order-items-list">
              {order.items.map((item) => (
                <div key={item.id} className="order-item-row">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span>₱{item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            {order.notes && <p className="order-notes">📝 {order.notes}</p>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
              <div className="order-total" style={{ margin: 0 }}>Total: ₱{order.total.toFixed(2)}</div>
              <button className="btn-danger-sm" onClick={() => deleteOrder(order.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}