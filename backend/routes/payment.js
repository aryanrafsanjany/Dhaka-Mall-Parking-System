const express = require("express");
const router = express.Router();
const {
  processPayment,
  getPaymentHistory,
  getPaymentSummary,
} = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ All routes are protected
router.post("/process", authMiddleware, processPayment);
router.get("/history", authMiddleware, getPaymentHistory);
router.get("/summary", authMiddleware, getPaymentSummary);

module.exports = router;
