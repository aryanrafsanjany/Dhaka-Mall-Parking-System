// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { bookingsAPI } from "../utils/api";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsAPI.getUserBookings();
      setBookings(data);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsAPI.cancel(bookingId);
      await fetchBookings();
      // Update user's payment amount
      const updatedUser = { ...user, paymentAmount: user.paymentAmount + 10 };
      updateUser(updatedUser);
    } catch (err) {
      setError("Failed to cancel booking");
      console.error("Error cancelling booking:", err);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await bookingsAPI.complete(bookingId);
      await fetchBookings();
      // Update user's payment amount
      const updatedUser = { ...user, paymentAmount: user.paymentAmount + 50 };
      updateUser(updatedUser);
    } catch (err) {
      setError("Failed to complete booking");
      console.error("Error completing booking:", err);
    }
  };

  const handleGetDirections = (location) => {
    const address = encodeURIComponent(location.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "status-active",
      completed: "status-completed",
      cancelled: "status-cancelled",
      expired: "status-expired",
    };
    return `status-badge ${statusClasses[status] || ""}`;
  };

  const currentBookings = bookings.filter(b => b.status === "active");
  const completedBookings = bookings.filter(b => b.status === "completed");
  const cancelledBookings = bookings.filter(b => b.status === "cancelled" || b.status === "expired");

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
        <h1>🚗 My Parking Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
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

      <div className="grid grid-3">
        {/* Current Bookings */}
        <div className="card">
          <h2 style={{ marginBottom: "1rem", color: "#27ae60" }}>
            🟢 Current Bookings ({currentBookings.length})
          </h2>
          {currentBookings.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No active bookings
            </p>
          ) : (
            currentBookings.map((booking) => (
              <div
                key={booking._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h3>{booking.locationId?.mallName}</h3>
                <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                  📍 {booking.locationId?.address}
                </p>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
                  🕒 Booked: {formatDate(booking.bookingTime)}
                </p>
                <div className="flex" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="btn btn-danger"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCompleteBooking(booking._id)}
                    className="btn btn-success"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleGetDirections(booking.locationId)}
                    className="btn btn-secondary"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Directions
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Completed Bookings */}
        <div className="card">
          <h2 style={{ marginBottom: "1rem", color: "#3498db" }}>
            ✅ Completed Bookings ({completedBookings.length})
          </h2>
          {completedBookings.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No completed bookings
            </p>
          ) : (
            completedBookings.map((booking) => (
              <div
                key={booking._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h3>{booking.locationId?.mallName}</h3>
                <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                  📍 {booking.locationId?.address}
                </p>
                <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                  🕒 Completed: {formatDate(booking.updatedAt)}
                </p>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
                  💰 Amount: ৳{booking.paymentAmount}
                </p>
                <span className={getStatusBadge(booking.status)}>
                  {booking.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Cancelled Bookings */}
        <div className="card">
          <h2 style={{ marginBottom: "1rem", color: "#e74c3c" }}>
            ❌ Cancelled Bookings ({cancelledBookings.length})
          </h2>
          {cancelledBookings.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No cancelled bookings
            </p>
          ) : (
            cancelledBookings.map((booking) => (
              <div
                key={booking._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h3>{booking.locationId?.mallName}</h3>
                <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                  📍 {booking.locationId?.address}
                </p>
                <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                  🕒 {booking.status === "expired" ? "Expired" : "Cancelled"}: {formatDate(booking.updatedAt)}
                </p>
                {booking.fineAmount > 0 && (
                  <p style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#e74c3c" }}>
                    ⚠️ Fine: ৳{booking.fineAmount}
                  </p>
                )}
                <span className={getStatusBadge(booking.status)}>
                  {booking.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
