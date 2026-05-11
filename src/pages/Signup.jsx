import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/App.css";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pw) => {
    if (pw.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pw)) return "Password must contain at least 1 uppercase letter.";
    if (!/[0-9]/.test(pw)) return "Password must contain at least 1 number.";
    if (!/[^A-Za-z0-9]/.test(pw)) return "Password must contain at least 1 special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.endsWith("st")) {
      setError("Username must end with 'st' (e.g. johnnyst) — our SwiftlyTea signature! 🍵");
      return;
    }

    const pwError = validatePassword(form.password);
    if (pwError) {
      setError(pwError);
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🍵 SwiftlyTea</h1>
          <p>Create your account to start ordering.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="e.g. johnnyst"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <small style={{ color: "#999", fontSize: "0.8rem" }}>
              Must end with <strong>st</strong> — your SwiftlyTea signature 🍵
            </small>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Your email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <small style={{ color: "#999", fontSize: "0.8rem" }}>
              Min 8 chars · 1 uppercase · 1 number · 1 special character
            </small>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}