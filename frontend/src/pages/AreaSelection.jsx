import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { areasAPI, authAPI } from "../utils/api";

const AreaSelection = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const data = await areasAPI.getWithLocations();
      setAreas(data);
    } catch (err) {
      setError("Failed to fetch areas");
      console.error("Error fetching areas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
  };

  const handleContinue = async () => {
    if (!selectedArea) {
      setError("Please select an area");
      return;
    }

    try {
      // Mark first login as complete
      const response = await authAPI.markFirstLoginComplete();
      updateUser(response.user);
      
      // Navigate to booking page with selected area
      navigate("/book", { state: { selectedArea } });
    } catch (err) {
      setError("Failed to continue");
      console.error("Error marking first login complete:", err);
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
        <h1>🏙️ Select Your Area</h1>
        <p>Welcome to Dhaka Mall Parking! Please select your preferred area to continue.</p>
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
        {areas.map((area) => (
          <div
            key={area._id}
            className={`card ${selectedArea?._id === area._id ? "selected" : ""}`}
            style={{
              cursor: "pointer",
              border: selectedArea?._id === area._id ? "3px solid #667eea" : "1px solid #ddd",
              transform: selectedArea?._id === area._id ? "scale(1.02)" : "scale(1)",
            }}
            onClick={() => handleAreaSelect(area)}
          >
            <h2 style={{ marginBottom: "1rem", color: "#667eea" }}>
              📍 {area.name}
            </h2>
            {area.description && (
              <p style={{ color: "#666", marginBottom: "1rem" }}>
                {area.description}
              </p>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <strong>Available Parking Locations:</strong>
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                {area.locations && area.locations.length > 0 ? (
                  area.locations.map((location) => (
                    <li key={location._id}>
                      🏬 {location.mallName} - {location.freeSpot} spots available
                    </li>
                  ))
                ) : (
                  <li>No parking locations available</li>
                )}
              </ul>
            </div>
            {selectedArea?._id === area._id && (
              <div style={{ textAlign: "center" }}>
                <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                  ✅ Selected
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedArea && (
        <div className="text-center mt-4">
          <button
            onClick={handleContinue}
            className="btn btn-primary"
            style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}
          >
            Continue to Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default AreaSelection;
