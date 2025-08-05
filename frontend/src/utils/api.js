const API_BASE_URL = "http://localhost:5001/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  markFirstLoginComplete: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/first-login-complete`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Areas API
export const areasAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/areas`);
    return response.json();
  },

  getWithLocations: async () => {
    const response = await fetch(`${API_BASE_URL}/areas/with-locations`);
    return response.json();
  },

  getLocationsByArea: async (areaId) => {
    const response = await fetch(`${API_BASE_URL}/areas/${areaId}/locations`);
    return response.json();
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  getUserBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  cancel: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/cancel/${bookingId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  complete: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/complete/${bookingId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Admin endpoints
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/all`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  adminCancel: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/admin-cancel/${bookingId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Payment API
export const paymentAPI = {
  process: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payment/process`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  getHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/payment/history`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/payment/summary`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getAreas: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/areas`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  addArea: async (areaData) => {
    const response = await fetch(`${API_BASE_URL}/admin/areas`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(areaData),
    });
    return response.json();
  },

  getLocations: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/locations`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  addLocation: async (locationData) => {
    const response = await fetch(`${API_BASE_URL}/admin/locations`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(locationData),
    });
    return response.json();
  },

  updateLocation: async (locationId, locationData) => {
    const response = await fetch(`${API_BASE_URL}/admin/locations/${locationId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(locationData),
    });
    return response.json();
  },

  deleteLocation: async (locationId) => {
    const response = await fetch(`${API_BASE_URL}/admin/locations/${locationId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Feedback API
export const feedbackAPI = {
  submit: async (feedbackData) => {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(feedbackData),
    });
    return response.json();
  },

  getForBooking: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/feedback/${bookingId}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Admin endpoints
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/feedback/admin/all`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/feedback/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};
