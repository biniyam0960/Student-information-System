import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Login.css";

const Login = () => {
  // State for form fields and UI feedback
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for keyboard navigation between inputs
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  /**
   * Handles user login submission.
   * 1. Validates inputs.
   * 2. Sends credentials to the backend API.
   * 3. Stores the received token and user role in localStorage.
   * 4. Redirects the user to their specific dashboard based on role.
   */
  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // attempt login
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Normalize role to lowercase for consistent comparison
      const role = String(user.role).toLowerCase();

      // Store auth data for session persistence
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", user.id);

      // Navigate to the appropriate dashboard based on user role
      if (role === "student") navigate("/student");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page">
      <h1 className="app-title">Student Information System</h1>
      <p className="welcome-text">Welcome back! Please sign in to continue.</p>

      {/* EMAIL INPUT */}
      <div className="input-wrapper">
        <span className="input-icon">✉️</span>
        <input
          ref={emailRef}
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
              passwordRef.current?.focus();
            }
          }}
          required
        />
      </div>

      {/* PASSWORD INPUT */}
      <div className="password-wrapper">
        <input
          ref={passwordRef}
          className="login-input"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              emailRef.current?.focus();
            }
          }}
          required
        />

        <span
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "👁️‍🗨️" : "👁️"}
        </span>
      </div>
      {/* ERROR MESSAGE */}
      {error && <p className="error-text">{error}</p>}
      {/* FORGOT PASSWORD */}
      <p className="forgot-password">forgot password?</p>

      {/* LOGIN BUTTON */}
      <button className="login-button" onClick={handleLogin} disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>

    </div>
  );
};

export default Login;
