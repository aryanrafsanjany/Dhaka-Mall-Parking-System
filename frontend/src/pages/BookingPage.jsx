// src/pages/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { areasAPI, bookingsAPI } from "../utils/api";

const BookingPage = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAreas();
    // Check if user came from area selection
    if (location.state?.selectedArea) {
      setSelectedArea(location.state.selectedArea);
      fetchLocationsByArea(location.state.selectedArea._id);
    }
  }, [location.state]);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const data = await areasAPI.getAll();
      setAreas(data);
    } catch (err) {
      setError("Failed to fetch areas");
      console.error("Error fetching areas:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationsByArea = async (areaId) => {
    try {
      setLocationsLoading(true);
      setError("");
      console.log("Fetching locations for area:", areaId);
      const data = await areasAPI.getLocationsByArea(areaId);
      console.log("Received locations data:", data);
      setLocations(data);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Failed to fetch parking locations. Please try again.");
    } finally {
      setLocationsLoading(false);
    }
  };

  const handleAreaChange = (area) => {
    console.log("Area selected:", area);
    setSelectedArea(area);
    setSelectedLocation(null);
    setError(""); // Clear any previous errors
    fetchLocationsByArea(area._id);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleBooking = async () => {
    if (!selectedLocation) {
      setError("Please select a parking location");
      return;
    }

    try {
      setBookingLoading(true);
      await bookingsAPI.create({ locationId: selectedLocation._id });
      setError("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.msg || "Failed to create booking");
      console.error("Error creating booking:", err);
    } finally {
      setBookingLoading(false);
    }
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
        <h1>🚗 New Parking Booking</h1>
        <p>Select your preferred area and parking location</p>
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

      <div className="grid grid-2">
        {/* Area Selection */}
        <div className="card">
          <h2 style={{ marginBottom: "1rem", color: "#667eea" }}>
            📍 Select Area
          </h2>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {areas.map((area) => (
              <div
                key={area._id}
                className={`card ${selectedArea?._id === area._id ? "selected" : ""}`}
                style={{
                  cursor: "pointer",
                  marginBottom: "1rem",
                  border: selectedArea?._id === area._id ? "2px solid #667eea" : "1px solid #ddd",
                  padding: "1rem",
                }}
                onClick={() => handleAreaChange(area)}
              >
                <h3 style={{ marginBottom: "0.5rem" }}>{area.name}</h3>
                {area.description && (
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>
                    {area.description}
                  </p>
                )}
                {selectedArea?._id === area._id && (
                  <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                    ✅ Selected
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Location Selection */}
        <div className="card">
          <h2 style={{ marginBottom: "1rem", color: "#667eea" }}>
            🏬 Select Parking Location
          </h2>
          {!selectedArea ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              Please select an area first
            </p>
          ) : (
            <div>
              {locationsLoading ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: "1rem", color: "#666" }}>
                    Loading locations for <strong>{selectedArea.name}</strong>...
                  </p>
                </div>
              ) : locations.length === 0 ? (
                <p style={{ textAlign: "center", color: "#666" }}>
                  No parking locations available in this area
                </p>
              ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {locations.map((location) => (
                    <div
                      key={location._id}
                      className={`card ${selectedLocation?._id === location._id ? "selected" : ""}`}
                      style={{
                        cursor: "pointer",
                        marginBottom: "1rem",
                        border: selectedLocation?._id === location._id ? "2px solid #667eea" : "1px solid #ddd",
                        padding: "1rem",
                        opacity: location.freeSpot === 0 ? 0.6 : 1,
                      }}
                      onClick={() => location.freeSpot > 0 && handleLocationSelect(location)}
                    >
                      <h3 style={{ marginBottom: "0.5rem" }}>{location.mallName}</h3>
                      <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                        📍 {location.address}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.9rem" }}>
                          🚗 {location.freeSpot}/{location.totalSpot} spots available
                        </span>
                        {location.freeSpot === 0 && (
                          <span style={{ color: "#e74c3c", fontWeight: "bold" }}>
                            FULL
                          </span>
                        )}
                      </div>
                      {selectedLocation?._id === location._id && (
                        <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                          <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                            ✅ Selected
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedLocation && (
        <div className="card">
          <h2 style={{ marginBottom: "1rem", color: "#27ae60" }}>
            📋 Booking Summary
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <strong>Selected Area:</strong>
              <p>{selectedArea?.name}</p>
            </div>
            <div>
              <strong>Parking Location:</strong>
              <p>{selectedLocation?.mallName}</p>
            </div>
            <div>
              <strong>Address:</strong>
              <p>{selectedLocation?.address}</p>
            </div>
            <div>
              <strong>Available Spots:</strong>
              <p>{selectedLocation?.freeSpot} out of {selectedLocation?.totalSpot}</p>
            </div>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={handleBooking}
              className="btn btn-primary"
              disabled={bookingLoading}
              style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}
            >
              {bookingLoading ? "Creating Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
