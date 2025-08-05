const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  completeBooking,
  adminCancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ User routes (protected)
router.post("/", authMiddleware, createBooking);
router.get("/my-bookings", authMiddleware, getUserBookings);
router.put("/cancel/:bookingId", authMiddleware, cancelBooking);
router.put("/complete/:bookingId", authMiddleware, completeBooking);

// ✅ Admin routes (protected)
router.get("/all", authMiddleware, getAllBookings);
router.put("/admin-cancel/:bookingId", authMiddleware, adminCancelBooking);

module.exports = router;

