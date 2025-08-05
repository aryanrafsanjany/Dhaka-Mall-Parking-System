const express = require("express");
const router = express.Router();
const {
  getAllAreas,
  getAreasWithLocations,
  getLocationsByArea,
} = require("../controllers/areaController");

// ✅ Public routes
router.get("/", getAllAreas);
router.get("/with-locations", getAreasWithLocations);
router.get("/:areaId/locations", getLocationsByArea);

module.exports = router;
