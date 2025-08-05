const express = require("express");
const router = express.Router();
const { cancelBooking } = require("../controllers/cancelController");
const verifyToken = require("../middleware/authMiddleware");

router.put("/:id", verifyToken, cancelBooking); // PUT /api/cancel/:id

module.exports = router;
