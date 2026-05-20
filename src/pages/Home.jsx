import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/App.css";

export default function Home() {
  const { user } = useAuth();
  const { addItem, count } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [added, setAdded] = useState({});

  useEffect(() => {
    fetch("/api/products/", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.products?.length) setProducts(data.products); })
      .catch(() => {});
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filtered = category === "All" ? products : products.filter(p => p.category === category);

  const handleAdd = (product) => {
    if (!user) return navigate("/login");
    if (user.role === "admin") return;
    addItem(product);
    setAdded(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product.id]: false })), 1200);
  };

  return (
    <div className="page-container">
      <div className="menu-hero">
        <h1>Our Menu</h1>
        <p>Fresh ingredients, bold flavors — order with ease.</p>
      </div>
      <div className="category-tabs">
        {categories.map(cat => (
          <button key={cat} className={`cat-tab ${category === cat ? "active" : ""}`} onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>
      <div className="products-grid">
        {filtered.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image_url ? <img src={product.image_url} alt={product.name} /> : <div className="product-placeholder">🍽️</div>}
              <span className="product-category">{product.category}</span>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-footer">
                <span className="product-price">₱{parseFloat(product.price).toFixed(2)}</span>
                {user?.role === "admin" ? (
                  <button className="btn-add" disabled style={{opacity:0.4,cursor:"not-allowed"}}>+ Add to Cart</button>
                ) : (
                  <button className={`btn-add ${added[product.id] ? "added" : ""}`} onClick={() => handleAdd(product)}>
                    {added[product.id] ? "✓ Added" : "+ Add to Cart"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {count > 0 && (
        <div className="floating-cart" onClick={() => navigate("/cart")}>🛒 View Cart ({count} items)</div>
      )}
    </div>
  );
}
