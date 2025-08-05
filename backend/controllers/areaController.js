const Area = require("../models/Area");
const ParkingLocation = require("../models/ParkingLocation");

// ✅ Get all areas
const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find().sort({ name: 1 });
    res.json(areas);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get areas with parking locations
const getAreasWithLocations = async (req, res) => {
  try {
    const areas = await Area.find().sort({ name: 1 });
    
    const areasWithLocations = await Promise.all(
      areas.map(async (area) => {
        const locations = await ParkingLocation.find({ areaId: area._id });
        return {
          ...area.toObject(),
          locations,
        };
      })
    );

    res.json(areasWithLocations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get parking locations by area
const getLocationsByArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    const area = await Area.findById(areaId);
    if (!area) {
      return res.status(404).json({ msg: "Area not found" });
    }

    const locations = await ParkingLocation.find({ areaId }).sort({ mallName: 1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getAllAreas,
  getAreasWithLocations,
  getLocationsByArea,
};
