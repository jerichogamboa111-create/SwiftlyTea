import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <a href="#" className="navbar-link">Home Page</a>
        <a href="#" className="navbar-link">About</a>
        <a href="#" className="navbar-link">Products</a>
        <span className="navbar-caret">&lt;</span>
      </div>
      <div className="navbar-brand">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Milk tea logo"
        >
          {/* Straw */}
          <rect x="17" y="2" width="3" height="10" rx="1.5" fill="#c084fc" />

          {/* Cup body */}
          <path
            d="M6 11 L8 24 Q8.5 26 11 26 H17 Q19.5 26 20 24 L22 11 Z"
            fill="#fde68a"
            stroke="#d97706"
            strokeWidth="1"
          />

          {/* Tea liquid inside */}
          <path
            d="M7.5 15 L9 24 Q9.5 26 11 26 H17 Q18.5 26 19 24 L20.5 15 Z"
            fill="#92400e"
            opacity="0.5"
          />

          {/* Tapioca pearls */}
          <circle cx="11.5" cy="22" r="1.5" fill="#44200a" />
          <circle cx="14" cy="23" r="1.5" fill="#44200a" />
          <circle cx="16.5" cy="22" r="1.5" fill="#44200a" />

          {/* Cup lid */}
          <rect x="5" y="9" width="18" height="3" rx="1.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />

          {/* Foam / cream top */}
          <ellipse cx="14" cy="9.5" rx="7" ry="2" fill="#fef9ee" opacity="0.85" />
        </svg>
        <span className="navbar-title">Swiftly Tea</span>
      </div>
      <div className="navbar-actions">
        <button className="navbar-signup">Sign up</button>
      </div>
    </nav>
  );
}