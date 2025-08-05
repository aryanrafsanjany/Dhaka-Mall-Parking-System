// src/pages/FeedbackPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { bookingsAPI, feedbackAPI } from "../utils/api";

const FeedbackPage = () => {
  const [completedBookings, setCompletedBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchCompletedBookings();
  }, []);

  const fetchCompletedBookings = async () => {
    try {
      setLoading(true);
      const bookings = await bookingsAPI.getUserBookings();
      const completed = bookings.filter(b => b.status === "completed" && !b.rating);
      setCompletedBookings(completed);
    } catch (err) {
      setError("Failed to fetch completed bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSelect = async (booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setComment("");
    
    // Check if feedback already exists
    try {
      const feedback = await feedbackAPI.getForBooking(booking._id);
      if (feedback.hasFeedback) {
        setRating(feedback.rating);
        setComment(feedback.comment);
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedBooking) {
      setError("Please select a booking");
      return;
    }

    if (rating === 0) {
      setError("Please provide a rating");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await feedbackAPI.submit({
        bookingId: selectedBooking._id,
        rating,
        comment,
      });

      if (response.msg) {
        setSuccess(response.msg);
        
        // Update user points
        const updatedUser = { ...user, points: user.points + 10 };
        updateUser(updatedUser);
        
        // Remove booking from list
        setCompletedBookings(prev => prev.filter(b => b._id !== selectedBooking._id));
        setSelectedBooking(null);
        setRating(0);
        setComment("");
      }
    } catch (err) {
      setError(err.msg || "Failed to submit feedback");
      console.error("Error submitting feedback:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderStars = (currentRating, interactive = false) => {
    return (
      <div style={{ display: "flex", gap: "0.25rem" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && setRating(star)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: interactive ? "pointer" : "default",
              color: star <= currentRating ? "#f39c12" : "#ddd",
            }}
          >
            ⭐
          </button>
        ))}
      </div>
    );
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
        <h1>⭐ Feedback & Ratings</h1>
        <p>Share your experience and earn points for your feedback!</p>
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
        {/* Completed Bookings */}
        <div className="card">
          <h2 style={{ marginBottom: "1rem", color: "#667eea" }}>
            📋 Completed Bookings ({completedBookings.length})
          </h2>
          
          {completedBookings.length === 0 ? (
            <div style={{ textAlign: "center", color: "#666" }}>
              <p>No completed bookings available for feedback</p>
              <p style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                Complete a parking session to leave feedback and earn 10 points!
              </p>
            </div>
          ) : (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {completedBookings.map((booking) => (
                <div
                  key={booking._id}
                  className={`card ${selectedBooking?._id === booking._id ? "selected" : ""}`}
                  style={{
                    cursor: "pointer",
                    marginBottom: "1rem",
                    border: selectedBooking?._id === booking._id ? "2px solid #667eea" : "1px solid #ddd",
                    padding: "1rem",
                  }}
                  onClick={() => handleBookingSelect(booking)}
                >
                  <h3 style={{ marginBottom: "0.5rem" }}>{booking.locationId?.mallName}</h3>
                  <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                    📍 {booking.locationId?.address}
                  </p>
                  <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                    🕒 Completed: {formatDate(booking.updatedAt)}
                  </p>
                  <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                    💰 Amount: ৳{booking.paymentAmount}
                  </p>
                  {selectedBooking?._id === booking._id && (
                    <div style={{ textAlign: "center" }}>
                      <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                        ✅ Selected for Feedback
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Form */}
        <div className="card">
          <h2 style={{ marginBottom: "1rem", color: "#667eea" }}>
            ✍️ Submit Feedback
          </h2>
          
          {!selectedBooking ? (
            <div style={{ textAlign: "center", color: "#666" }}>
              <p>Select a completed booking to leave feedback</p>
              <p style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                Earn 10 points for each feedback submission!
              </p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Selected Booking:</h3>
                <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "8px" }}>
                  <h4>{selectedBooking.locationId?.mallName}</h4>
                  <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                    📍 {selectedBooking.locationId?.address}
                  </p>
                  <p style={{ fontSize: "0.9rem" }}>
                    🕒 Completed: {formatDate(selectedBooking.updatedAt)}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label className="form-label">Rating:</label>
                {renderStars(rating, true)}
                <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
                  Click on the stars to rate your experience
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label htmlFor="comment" className="form-label">
                  Comments (Optional):
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="form-input"
                  rows="4"
                  placeholder="Share your experience with this parking location..."
                  style={{ resize: "vertical" }}
                />
              </div>

              <button
                onClick={handleSubmitFeedback}
                className="btn btn-primary"
                disabled={submitting || rating === 0}
                style={{ width: "100%" }}
              >
                {submitting ? "Submitting Feedback..." : "Submit Feedback (+10 points)"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;

