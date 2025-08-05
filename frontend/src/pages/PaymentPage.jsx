// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { paymentAPI } from "../utils/api";

const PaymentPage = () => {
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const [summary, history] = await Promise.all([
        paymentAPI.getSummary(),
        paymentAPI.getHistory(),
      ]);
      setPaymentSummary(summary);
      setPaymentHistory(history);
    } catch (err) {
      setError("Failed to fetch payment data");
      console.error("Error fetching payment data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      const response = await paymentAPI.process({ paymentMethod });
      
      if (response.msg) {
        setSuccess(response.msg);
        
        // Update user data
        const updatedUser = { ...user, paymentAmount: 0 };
        if (paymentMethod === "points") {
          updatedUser.points -= response.pointsDeducted;
        }
        updateUser(updatedUser);
        
        // Refresh payment data
        await fetchPaymentData();
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      setError(err.msg || "Payment failed");
      console.error("Payment error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className={`container ${isDarkMode ? "dark" : ""}`}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={`container ${isDarkMode ? "dark" : ""}`}>
      <div className="text-center mb-4">
        <h1>💰 Payment Center</h1>
        <p>Manage your parking payments and view transaction history</p>
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

      {success && (
        <div
          style={{
            background: "#d4edda",
            color: "#155724",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            border: "1px solid #c3e6cb",
          }}
        >
          {success}
        </div>
      )}

      <div className="grid grid-2">
        {/* Payment Summary */}
        <div className="card">
          <h2 style={{ marginBottom: "1rem", color: "#667eea" }}>
            💳 Payment Summary
          </h2>
          
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span>Current Balance:</span>
              <span style={{ fontWeight: "bold", color: "#e74c3c" }}>
                ৳{paymentSummary?.paymentAmount || 0}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span>Available Points:</span>
              <span style={{ fontWeight: "bold", color: "#f39c12" }}>
                ⭐ {user.points} pts
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span>Unpaid Bookings:</span>
              <span style={{ fontWeight: "bold" }}>
                {paymentSummary?.unpaidBookings || 0}
              </span>
            </div>
          </div>

          {paymentSummary?.paymentAmount > 0 && (
            <div>
              <h3 style={{ marginBottom: "1rem" }}>Select Payment Method:</h3>
              
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: "0.5rem" }}
                  />
                  💵 Pay with Cash (৳{paymentSummary.paymentAmount})
                </label>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="points"
                    checked={paymentMethod === "points"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: "0.5rem" }}
                    disabled={user.points < (paymentSummary.unpaidBookings * 100)}
                  />
                  ⭐ Pay with Points ({paymentSummary.unpaidBookings * 100} points required)
                  {user.points < (paymentSummary.unpaidBookings * 100) && (
                    <span style={{ color: "#e74c3c", marginLeft: "0.5rem" }}>
                      (Insufficient points)
                    </span>
                  )}
                </label>
              </div>

              <button
                onClick={handlePayment}
                className="btn btn-primary"
                disabled={processing || !paymentMethod || (paymentMethod === "points" && user.points < (paymentSummary.unpaidBookings * 100))}
                style={{ width: "100%" }}
              >
                {processing ? "Processing Payment..." : "Process Payment"}
              </button>
            </div>
          )}

          {paymentSummary?.paymentAmount === 0 && (
            <div style={{ textAlign: "center", color: "#27ae60" }}>
              <h3>✅ All Paid Up!</h3>
              <p>You have no outstanding payments.</p>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="card">
          <h2 style={{ marginBottom: "1rem", color: "#667eea" }}>
            📋 Payment History
          </h2>
          
          {paymentHistory.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No payment history available
            </p>
          ) : (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {paymentHistory.map((payment) => (
                <div
                  key={payment._id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <strong>{payment.bookingId?.locationId?.mallName || "Unknown Location"}</strong>
                    <span style={{ fontWeight: "bold", color: "#27ae60" }}>
                      ৳{payment.paymentAmount}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>
                    📍 {payment.bookingId?.locationId?.address || "Unknown Address"}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#999" }}>
                    💳 {payment.bookingId?.paymentMethod || "Unknown"} • {formatDate(payment.paymentDate)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
