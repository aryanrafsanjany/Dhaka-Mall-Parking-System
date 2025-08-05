// File: src/pages/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../utils/api";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData);
      
      if (response.token) {
        login(response);
        
        // Redirect based on user type and first login status
        if (response.user.isAdmin) {
          navigate("/admin");
        } else if (response.user.firstLogin) {
          navigate("/areas");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(response.msg || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${isDarkMode ? "dark" : ""}`}>
      <div className="flex-center" style={{ minHeight: "80vh" }}>
        <div className="card" style={{ maxWidth: "400px", width: "100%" }}>
          <div className="text-center mb-4">
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              🚗 Welcome Back
            </h1>
            <p style={{ color: "#666" }}>
              Sign in to your Dhaka Mall Parking account
            </p>
          </div>

          {error && (
            <div
              style={{
                background: "#f8d7da",
                color: "#721c24",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                border: "1px solid #f5c6cb",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginBottom: "1rem" }}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center">
            <p style={{ marginBottom: "1rem" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#667eea",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

