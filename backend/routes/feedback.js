const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getFeedback,
  getAllFeedback,
  getFeedbackStats,
} = require("../controllers/feedbackController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ User routes (protected)
router.post("/", authMiddleware, submitFeedback);
router.get("/:bookingId", authMiddleware, getFeedback);

// ✅ Admin routes (protected)
router.get("/admin/all", authMiddleware, getAllFeedback);
router.get("/admin/stats", authMiddleware, getFeedbackStats);

module.exports = router;
