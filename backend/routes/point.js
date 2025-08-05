const express = require("express");
const router = express.Router();
const { completeBooking, redeemPoints } = require("../controllers/pointController");
const verifyToken = require("../middleware/authMiddleware");

router.put("/complete", verifyToken, completeBooking);
router.put("/redeem", verifyToken, redeemPoints);

module.exports = router;
