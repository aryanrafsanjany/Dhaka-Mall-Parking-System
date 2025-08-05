const express = require("express");
const router = express.Router();
const { getMapLink } = require("../controllers/mapController");
const verifyToken = require("../middleware/authMiddleware");

// GET /api/maps/:locationId
router.get("/:locationId", verifyToken, getMapLink);

module.exports = router;
