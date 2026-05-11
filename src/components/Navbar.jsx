import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🍽️ <span>Saveur</span>
      </Link>

      <div className="navbar-links">
        <Link to="/">Menu</Link>
        {user && <Link to="/order-history">My Orders</Link>}
        {isAdmin && (
          <Link to="/admin" className="admin-link">
            ⚙️ Admin
          </Link>
        )}
      </div>

      <div className="navbar-actions">
        {user ? (
          <>
            <Link to="/cart" className="cart-btn">
              🛒 <span className="cart-badge">{count}</span>
            </Link>
            <span className="nav-username">
              {isAdmin && <span className="admin-badge">ADMIN</span>}
              {user.username}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-nav-login">Login</Link>
            <Link to="/signup" className="btn-nav-signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}