import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/App.css";

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleOrder = async () => {
    if (!user) return navigate("/login");
    if (user.role === "admin") return setError("Admins are not allowed to place orders.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      clearCart();
      setSuccess(true);
      setTimeout(() => navigate("/order-history"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-container center-content">
        <div className="success-box">
          <div className="success-icon">✅</div>
          <h2>Order Placed!</h2>
          <p>Your order has been received. Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-container center-content">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some items from the menu to get started.</p>
          <Link to="/" className="btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Your Cart</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {user?.role === "admin" && (
        <div className="alert alert-error">Admins are not allowed to place orders.</div>
      )}

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.product_id} className="cart-item">
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <span className="item-price">₱{item.price.toFixed(2)} each</span>
              </div>
              <div className="cart-item-controls">
                <button onClick={() => updateQty(item.product_id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item.product_id, item.quantity + 1)}>+</button>
                <button className="btn-remove" onClick={() => removeItem(item.product_id)}>🗑</button>
              </div>
              <span className="item-subtotal">₱{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
          <div className="summary-line total">
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
          <div className="form-group">
            <label>Special Instructions</label>
            <textarea
              placeholder="Any notes for the kitchen..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <button className="btn-primary btn-place-order" onClick={handleOrder} disabled={loading || user?.role === "admin"}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
          <Link to="/" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
