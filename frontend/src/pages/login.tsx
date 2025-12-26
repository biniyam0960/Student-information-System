import { useState, useRef } from "react";
import "../style/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ must define this

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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

      {/* FORGOT PASSWORD */}
      <p className="forgot-password">forgot password?</p>

      {/* LOGIN BUTTON */}
      <button className="login-button">sign in</button>

    </div>
  );
};

export default Login;
