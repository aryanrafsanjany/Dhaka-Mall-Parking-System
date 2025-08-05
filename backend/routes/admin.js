const express = require("express");
const router = express.Router();
const {
  addArea,
  addParkingLocation,
  getAllAreas,
  getAllParkingLocations,
  getAdminDashboard,
  updateParkingLocation,
  deleteParkingLocation,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ All routes are protected and admin-only
router.get("/dashboard", authMiddleware, getAdminDashboard);
router.get("/areas", authMiddleware, getAllAreas);
router.post("/areas", authMiddleware, addArea);
router.get("/locations", authMiddleware, getAllParkingLocations);
router.post("/locations", authMiddleware, addParkingLocation);
router.put("/locations/:locationId", authMiddleware, updateParkingLocation);
router.delete("/locations/:locationId", authMiddleware, deleteParkingLocation);

module.exports = router;
