const express = require("express");
const router = express.Router();
const { registerUser, loginUser, markFirstLoginComplete } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Protected routes
router.put("/first-login-complete", authMiddleware, markFirstLoginComplete);

module.exports = router;
