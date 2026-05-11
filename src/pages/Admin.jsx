import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

const STATUS_OPTIONS = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];
const STATUS_COLORS = {
  pending: "#f59e0b", confirmed: "#3b82f6", preparing: "#8b5cf6",
  ready: "#10b981", delivered: "#6b7280", cancelled: "#ef4444",
};

export default function Admin() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", category: "Mains", image_url: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/");
  }, [isAdmin, authLoading]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchOrders();
    fetchProducts();
    fetchUsers();
  }, [isAdmin]);

  const fetchOrders = () =>
    fetch("http://localhost:5000/api/orders/all", { credentials: "include" })
      .then((r) => r.json()).then((d) => setOrders(d.orders || []));

  const fetchProducts = () =>
    fetch("http://localhost:5000/api/products/all", { credentials: "include" })
      .then((r) => r.json()).then((d) => setProducts(d.products || []));

  const fetchUsers = () =>
    fetch("http://localhost:5000/api/users/", { credentials: "include" })
      .then((r) => r.json()).then((d) => setUsers(d.users || []));

    const deleteOrder = async (id) => {
    if (!confirm("Delete this order?")) return;
    await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: "DELETE", credentials: "include"
    });
    fetchOrders();
  };

  const updateStatus = async (orderId, status) => {
    await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...newProduct, price: parseFloat(newProduct.price) }),
    });
    if (res.ok) {
      setMsg("✅ Product added!");
      setNewProduct({ name: "", description: "", price: "", category: "Mains", image_url: "" });
      fetchProducts();
      setTimeout(() => setMsg(""), 2000);
    }
  };

  const toggleAvailability = async (product) => {
    await fetch(`http://localhost:5000/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ available: !product.available }),
    });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE", credentials: "include"
    });
    fetchProducts();
  };

  if (authLoading) return <div className="page-container"><p>Loading...</p></div>;

  return (
    <div className="page-container">
      <div className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p>Manage orders, menu, and users</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-num">{orders.filter(o => o.status === "pending").length}</span>
          <span className="stat-label">Pending Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{orders.length}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{products.length}</span>
          <span className="stat-label">Menu Items</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{users.length}</span>
          <span className="stat-label">Users</span>
        </div>
      </div>

      <div className="admin-tabs">
        {["orders", "products", "users"].map((t) => (
          <button key={t} className={`admin-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div className="admin-section">
          <h2>All Orders</h2>
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">Order #{order.id}</span>
                    <span className="order-customer">👤 {order.username}</span>
                    <span className="order-date">{new Date(order.created_at).toLocaleString()}</span>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="status-select"
                    style={{ borderColor: STATUS_COLORS[order.status] }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                  </select>
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
                <div className="order-total">Total: ₱{order.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="admin-section">
          <h2>Menu Items</h2>
          {msg && <div className="alert alert-success">{msg}</div>}

          <div className="add-product-form">
            <h3>Add New Item</h3>
            <form onSubmit={addProduct} className="product-form">
              <input placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
              <input placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
              <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required step="0.01" />
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                {["Starters", "Mains", "Desserts", "Drinks", "Other"].map((c) => <option key={c}>{c}</option>)}
              </select>
              <input placeholder="Image URL (optional)" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} />
              <button type="submit" className="btn-primary">Add Item</button>
            </form>
          </div>

          <div className="products-table">
            <table>
              <thead>
                <tr><th>Name</th><th>Category</th><th>Price</th><th>Available</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₱{p.price.toFixed(2)}</td>
                    <td>
                      <button className={`toggle-btn ${p.available ? "on" : "off"}`} onClick={() => toggleAvailability(p)}>
                        {p.available ? "✅ Yes" : "❌ No"}
                      </button>
                    </td>
                    <td>
                      <button className="btn-danger-sm" onClick={() => deleteProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="admin-section">
          <h2>Registered Users</h2>
          <div className="products-table">
            <table>
              <thead>
                <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}