import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

export default function Admin() {
  const { user, isAdmin, authHeaders } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "Mains", image_url: "" });

  useEffect(() => {
    if (!isAdmin) return navigate("/");
    fetchAll();
  }, [isAdmin]);

  const fetchAll = () => {
    fetch("/api/orders/all", { headers: authHeaders() }).then(r => r.json()).then(d => setOrders(d.orders || []));
    fetch("/api/products/all", { headers: authHeaders() }).then(r => r.json()).then(d => setProducts(d.products || []));
    fetch("/api/users/", { headers: authHeaders() }).then(r => r.json()).then(d => setUsers(d.users || []));
  };

  const deleteOrder = async (id) => {
    await fetch(`/api/orders/${id}`, { method: "DELETE", headers: authHeaders() });
    fetchAll();
  };

  const updateStatus = async (orderId, status) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ status })
    });
    fetchAll();
  };

  const addProduct = async () => {
    if (!form.name || !form.price) return;
    await fetch("/api/products/", {
      method: "POST", headers: authHeaders(),
      body: JSON.stringify({ ...form, price: parseFloat(form.price) })
    });
    setForm({ name: "", description: "", price: "", category: "Mains", image_url: "" });
    fetchAll();
  };

  const toggleAvailable = async (product) => {
    await fetch(`/api/products/${product.id}`, {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ available: !product.available })
    });
    fetchAll();
  };

  const deleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE", headers: authHeaders() });
    fetchAll();
  };

  const pending = orders.filter(o => o.status === "pending").length;

  const statusColor = (s) => ({
    pending: "#ff9800", confirmed: "#2196f3", preparing: "#9c27b0",
    ready: "#4caf50", delivered: "#4caf50", cancelled: "#f44336"
  })[s] || "#999";

  return (
    <div className="page-container">
      <div className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p>Manage orders, menu, and users</p>
      </div>
      <div className="admin-stats">
        <div className="stat-card"><span className="stat-num">{pending}</span><div className="stat-label">Pending Orders</div></div>
        <div className="stat-card"><span className="stat-num">{orders.length}</span><div className="stat-label">Total Orders</div></div>
        <div className="stat-card"><span className="stat-num">{products.length}</span><div className="stat-label">Menu Items</div></div>
        <div className="stat-card"><span className="stat-num">{users.length}</span><div className="stat-label">Users</div></div>
      </div>
      <div className="admin-tabs">
        {["orders","products","users"].map(t => (
          <button key={t} className={`admin-tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div className="admin-section">
          <h2>All Orders</h2>
          {orders.length === 0 ? <p>No orders yet.</p> : orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-customer">{order.username}</span>
                  <span className="order-date">{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                  <select className="status-select" value={order.status}
                    style={{borderColor: statusColor(order.status), color: statusColor(order.status)}}
                    onChange={e => updateStatus(order.id, e.target.value)}>
                    {["pending","confirmed","preparing","ready","delivered","cancelled"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button className="btn-danger-sm" onClick={() => deleteOrder(order.id)}>Delete</button>
                </div>
              </div>
              {order.items?.map((item, i) => (
                <div key={i} className="order-item-row">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₱{(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {order.notes && <p className="order-notes">📝 {order.notes}</p>}
              <div className="order-total">Total: ₱{parseFloat(order.total).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "products" && (
        <div className="admin-section">
          <h2>Menu Items</h2>
          <div className="add-product-form">
            <h3>Add New Item</h3>
            <div className="product-form">
              <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {["Mains","Starters","Desserts","Drinks","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
              <input placeholder="Image URL (optional)" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
              <button className="btn-primary" onClick={addProduct}>Add Item</button>
            </div>
          </div>
          <div className="products-table">
            <table>
              <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Available</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₱{parseFloat(p.price).toFixed(2)}</td>
                    <td>
                      <button className={`toggle-btn ${p.available?"on":"off"}`} onClick={() => toggleAvailable(p)}>
                        {p.available ? "✅ Yes" : "❌ No"}
                      </button>
                    </td>
                    <td><button className="btn-danger-sm" onClick={() => deleteProduct(p.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="admin-section">
          <h2>Users</h2>
          <div className="products-table">
            <table>
              <thead><tr><th>Username</th><th>Email</th><th>Role</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
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
