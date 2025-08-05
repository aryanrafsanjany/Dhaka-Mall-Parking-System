import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { paymentAPI } from "../utils/api";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [paymentSummary, setPaymentSummary] = useState(null);

  useEffect(() => {
    if (user && !user.isAdmin) {
      fetchPaymentSummary();
    }
  }, [user]);

  const fetchPaymentSummary = async () => {
    try {
      const data = await paymentAPI.getSummary();
      setPaymentSummary(data);
    } catch (error) {
      console.error("Error fetching payment summary:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className={`navbar ${isDarkMode ? "dark" : ""}`}>
      <div className="navbar-brand">
        <Link to={user.isAdmin ? "/admin" : "/dashboard"} className="navbar-logo">
          🚗 Dhaka Mall Parking
        </Link>
      </div>

      <div className="navbar-menu">
        {!user.isAdmin && (
          <>
            <Link to="/dashboard" className="navbar-item">
              Dashboard
            </Link>
            <Link to="/book" className="navbar-item">
              New Booking
            </Link>
            <Link to="/payment" className="navbar-item">
              Payment
            </Link>
            <Link to="/feedback" className="navbar-item">
              Feedback
            </Link>
          </>
        )}

        {user.isAdmin && (
          <>
            <Link to="/admin" className="navbar-item">
              Admin Dashboard
            </Link>
          </>
        )}
      </div>

      <div className="navbar-end">
        <div className="navbar-user-info">
          <span className="user-name">{user.name}</span>
          {!user.isAdmin && (
            <>
              <span className="user-points">⭐ {user.points} pts</span>
              {paymentSummary && paymentSummary.paymentAmount > 0 && (
                <span className="payment-amount">
                  💰 ৳{paymentSummary.paymentAmount}
                </span>
              )}
            </>
          )}
        </div>

        <button onClick={toggleTheme} className="theme-toggle">
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
