import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={close}>
        🍽️ <span>Home</span>
      </Link>

      {/* Desktop links */}
      <div className="navbar-links">
        <Link to="/">Menu</Link>
        {user && <Link to="/order-history">My Orders</Link>}
        {isAdmin && <Link to="/admin" className="admin-link">⚙️ Admin</Link>}
      </div>

      {/* Desktop actions */}
      <div className="navbar-actions desktop-only">
        {user ? (
          <>
            <Link to="/cart" className="cart-btn">
              🛒 <span className="cart-badge">{count}</span>
            </Link>
            <span className="nav-username">
              {isAdmin && <span className="admin-badge">ADMIN</span>}
              {user.username}
            </span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-nav-login">Login</Link>
            <Link to="/signup" className="btn-nav-signup">Sign Up</Link>
          </>
        )}
      </div>

      {/* Mobile right side: cart + hamburger */}
      <div className="mobile-right">
        {user && (
          <Link to="/cart" className="cart-btn" onClick={close}>
            🛒 <span className="cart-badge">{count}</span>
          </Link>
        )}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`ham-line ${menuOpen ? "open" : ""}`}></span>
          <span className={`ham-line ${menuOpen ? "open" : ""}`}></span>
          <span className={`ham-line ${menuOpen ? "open" : ""}`}></span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={close}>Menu</Link>
          {user && <Link to="/order-history" onClick={close}>My Orders</Link>}
          {isAdmin && <Link to="/admin" className="admin-link" onClick={close}>⚙️ Admin</Link>}
          <div className="mobile-divider" />
          {user ? (
            <>
              <span className="mobile-username">
                {isAdmin && <span className="admin-badge">ADMIN</span>}
                {user.username}
              </span>
              <button onClick={handleLogout} className="btn-logout mobile-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-login" onClick={close}>Login</Link>
              <Link to="/signup" className="btn-nav-signup mobile-signup" onClick={close}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
