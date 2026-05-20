import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

export default function OrderHistory() {
  const { user, authHeaders } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate("/login");
    fetch("/api/orders/my", { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, [user]);

  const cancelOrder = async (id) => {
    await fetch(`/api/orders/${id}`, { method: "DELETE", headers: authHeaders() });
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const statusColor = (s) => ({
    pending: "#ff9800", confirmed: "#2196f3", preparing: "#9c27b0",
    ready: "#4caf50", delivered: "#4caf50", cancelled: "#f44336"
  })[s] || "#999";

  if (loading) return <div className="page-container center-content"><p>Loading...</p></div>;

  return (
    <div className="page-container">
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No orders yet</h2>
          <p>Place your first order from the menu!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <span className="order-status" style={{background: statusColor(order.status)+"22", color: statusColor(order.status)}}>
                  {order.status}
                </span>
              </div>
              {order.items?.map((item, i) => (
                <div key={i} className="order-item-row">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₱{(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {order.notes && <p className="order-notes">📝 {order.notes}</p>}
              <div className="order-total">Total: ₱{parseFloat(order.total).toFixed(2)}</div>
              {order.status === "pending" && (
                <button className="btn-danger-sm" style={{marginTop:"10px"}} onClick={() => cancelOrder(order.id)}>
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
