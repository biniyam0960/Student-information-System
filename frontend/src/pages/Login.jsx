import { useState, useRef } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Student Information System
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Welcome back! Please sign in to continue.
        </p>

        {/* EMAIL INPUT */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">
              ✉️
            </span>
            <input
              ref={emailRef}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder-gray-400"
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
        </div>

        {/* PASSWORD INPUT */}
        <div className="mb-4">
          <div className="relative">
            <input
              ref={passwordRef}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder-gray-400"
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
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer hover:opacity-70 transition"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
        </div>

        {/* FORGOT PASSWORD */}
        <div className="text-right mb-6">
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
          >
            Forgot password?
          </a>
        </div>

        {/* LOGIN BUTTON */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 uppercase tracking-wide"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Login;
