// File: src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import AreaSelection from "./pages/AreaSelection.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import AdminInterface from "./pages/AdminInterface.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import { useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";

// ✅ Route protection wrapper
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/dashboard" />;

  return children;
};

// ✅ First login redirect wrapper
const FirstLoginRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.isAdmin) return <Navigate to="/admin" />;
  if (!user.firstLogin) return <Navigate to="/dashboard" />;

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* ✅ Default redirect */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* ✅ Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ First Login Route */}
          <Route
            path="/areas"
            element={
              <FirstLoginRoute>
                <AreaSelection />
              </FirstLoginRoute>
            }
          />

          {/* ✅ Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/book"
            element={
              <PrivateRoute>
                <BookingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <PaymentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <FeedbackPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <AdminInterface />
              </PrivateRoute>
            }
          />

          {/* ✅ Catch-all: redirect unknown routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
