import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { adminAPI, bookingsAPI, feedbackAPI } from "../utils/api";

const AdminInterface = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Form states
  const [newArea, setNewArea] = useState({ name: "", description: "" });
  const [newLocation, setNewLocation] = useState({
    mallName: "",
    address: "",
    totalSpot: "",
    areaId: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, bookings, areasData, locationsData, feedbackData] = await Promise.all([
        adminAPI.getDashboard(),
        bookingsAPI.getAll(),
        adminAPI.getAreas(),
        adminAPI.getLocations(),
        feedbackAPI.getAll(),
      ]);
      
      setDashboardData(dashboard);
      setAllBookings(bookings);
      setAreas(areasData);
      setLocations(locationsData);
      setFeedback(feedbackData);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminCancelBooking = async (bookingId) => {
    try {
      await bookingsAPI.adminCancel(bookingId);
      setSuccess("Booking cancelled successfully");
      await fetchDashboardData();
    } catch (err) {
      setError("Failed to cancel booking");
      console.error("Error cancelling booking:", err);
    }
  };

  const handleAddArea = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addArea(newArea);
      setSuccess("Area added successfully");
      setNewArea({ name: "", description: "" });
      await fetchDashboardData();
    } catch (err) {
      setError(err.msg || "Failed to add area");
      console.error("Error adding area:", err);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addLocation(newLocation);
      setSuccess("Parking location added successfully");
      setNewLocation({ mallName: "", address: "", totalSpot: "", areaId: "" });
      await fetchDashboardData();
    } catch (err) {
      setError(err.msg || "Failed to add parking location");
      console.error("Error adding location:", err);
    }
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
        <h1>👨‍💼 Admin Dashboard</h1>
        <p>Welcome, {user.name}! Manage your parking system</p>
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

      {/* Tab Navigation */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="flex" style={{ gap: "1rem", flexWrap: "wrap" }}>
          {[
            { id: "dashboard", label: "📊 Dashboard", icon: "📊" },
            { id: "bookings", label: "📋 All Bookings", icon: "📋" },
            { id: "areas", label: "📍 Manage Areas", icon: "📍" },
            { id: "locations", label: "🏬 Manage Locations", icon: "🏬" },
            { id: "feedback", label: "⭐ Feedback", icon: "⭐" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "0.9rem" }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="grid grid-3">
          <div className="card text-center">
            <h3>👥 Total Users</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#667eea" }}>
              {dashboardData?.stats?.totalUsers || 0}
            </p>
          </div>
          <div className="card text-center">
            <h3>📋 Total Bookings</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#27ae60" }}>
              {dashboardData?.stats?.totalBookings || 0}
            </p>
          </div>
          <div className="card text-center">
            <h3>🟢 Active Bookings</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f39c12" }}>
              {dashboardData?.stats?.activeBookings || 0}
            </p>
          </div>
          <div className="card text-center">
            <h3>📍 Total Areas</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#9b59b6" }}>
              {dashboardData?.stats?.totalAreas || 0}
            </p>
          </div>
          <div className="card text-center">
            <h3>🏬 Total Locations</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#e74c3c" }}>
              {dashboardData?.stats?.totalLocations || 0}
            </p>
          </div>
          <div className="card text-center">
            <h3>⭐ Total Feedback</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f39c12" }}>
              {feedback.length}
            </p>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="card">
          <h2 style={{ marginBottom: "1rem" }}>📋 All Bookings</h2>
          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {allBookings.map((booking) => (
              <div
                key={booking._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div className="flex-between">
                  <div>
                    <h3>{booking.locationId?.mallName}</h3>
                    <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                      👤 {booking.userId?.name} ({booking.userId?.email})
                    </p>
                    <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                      📍 {booking.locationId?.address}
                    </p>
                    <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                      🕒 Booked: {formatDate(booking.bookingTime)}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={getStatusBadge(booking.status)}>
                      {booking.status}
                    </span>
                    {booking.status === "active" && (
                      <button
                        onClick={() => handleAdminCancelBooking(booking._id)}
                        className="btn btn-danger"
                        style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas Tab */}
      {activeTab === "areas" && (
        <div className="grid grid-2">
          <div className="card">
            <h2 style={{ marginBottom: "1rem" }}>📍 Add New Area</h2>
            <form onSubmit={handleAddArea}>
              <div className="form-group">
                <label className="form-label">Area Name:</label>
                <input
                  type="text"
                  value={newArea.name}
                  onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                  className="form-input"
                  placeholder="Enter area name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description:</label>
                <textarea
                  value={newArea.description}
                  onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                  className="form-input"
                  placeholder="Enter area description"
                  rows="3"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Area
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: "1rem" }}>📍 Existing Areas</h2>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {areas.map((area) => (
                <div
                  key={area._id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <h3>{area.name}</h3>
                  {area.description && (
                    <p style={{ color: "#666", fontSize: "0.9rem" }}>
                      {area.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === "locations" && (
        <div className="grid grid-2">
          <div className="card">
            <h2 style={{ marginBottom: "1rem" }}>🏬 Add New Parking Location</h2>
            <form onSubmit={handleAddLocation}>
              <div className="form-group">
                <label className="form-label">Mall Name:</label>
                <input
                  type="text"
                  value={newLocation.mallName}
                  onChange={(e) => setNewLocation({ ...newLocation, mallName: e.target.value })}
                  className="form-input"
                  placeholder="Enter mall name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address:</label>
                <input
                  type="text"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                  className="form-input"
                  placeholder="Enter address"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Total Spots:</label>
                <input
                  type="number"
                  value={newLocation.totalSpot}
                  onChange={(e) => setNewLocation({ ...newLocation, totalSpot: e.target.value })}
                  className="form-input"
                  placeholder="Enter total parking spots"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Area:</label>
                <select
                  value={newLocation.areaId}
                  onChange={(e) => setNewLocation({ ...newLocation, areaId: e.target.value })}
                  className="form-input"
                  required
                >
                  <option value="">Select an area</option>
                  {areas.map((area) => (
                    <option key={area._id} value={area._id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Add Location
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: "1rem" }}>🏬 Existing Locations</h2>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {locations.map((location) => (
                <div
                  key={location._id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <h3>{location.mallName}</h3>
                  <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                    📍 {location.address}
                  </p>
                  <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                    🚗 {location.freeSpot}/{location.totalSpot} spots available
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "#999" }}>
                    📍 Area: {location.areaId?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === "feedback" && (
        <div className="card">
          <h2 style={{ marginBottom: "1rem" }}>⭐ User Feedback</h2>
          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {feedback.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>
                No feedback available
              </p>
            ) : (
              feedback.map((item) => (
                <div
                  key={item._id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div className="flex-between">
                    <div>
                      <h3>{item.locationId?.mallName}</h3>
                      <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                        👤 {item.userId?.name} ({item.userId?.email})
                      </p>
                      <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                        📍 {item.locationId?.address}
                      </p>
                      <div style={{ marginBottom: "0.5rem" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color: star <= item.rating ? "#f39c12" : "#ddd",
                              fontSize: "1.2rem",
                            }}
                          >
                            ⭐
                          </span>
                        ))}
                        <span style={{ marginLeft: "0.5rem", fontWeight: "bold" }}>
                          {item.rating}/5
                        </span>
                      </div>
                      {item.comment && (
                        <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                          "{item.comment}"
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right", fontSize: "0.9rem", color: "#999" }}>
                      {formatDate(item.updatedAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInterface;