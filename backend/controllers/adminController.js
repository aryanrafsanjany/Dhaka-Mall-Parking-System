const Area = require("../models/Area");
const ParkingLocation = require("../models/ParkingLocation");
const Booking = require("../models/Booking");
const User = require("../models/User");

// ✅ Add new area
const addArea = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Area name is required" });
    }

    const existingArea = await Area.findOne({ name });
    if (existingArea) {
      return res.status(400).json({ msg: "Area already exists" });
    }

    const area = new Area({
      name,
      description: description || "",
    });

    await area.save();

    res.status(201).json(area);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Add new parking location
const addParkingLocation = async (req, res) => {
  try {
    const { mallName, address, totalSpot, areaId } = req.body;

    if (!mallName || !address || !totalSpot || !areaId) {
      return res.status(400).json({ 
        msg: "Mall name, address, total spots, and area are required" 
      });
    }

    // Check if area exists
    const area = await Area.findById(areaId);
    if (!area) {
      return res.status(404).json({ msg: "Area not found" });
    }

    const location = new ParkingLocation({
      mallName,
      address,
      totalSpot: parseInt(totalSpot),
      freeSpot: parseInt(totalSpot), // Initially all spots are free
      areaId,
    });

    await location.save();

    res.status(201).json(location);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get all areas
const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find().sort({ name: 1 });
    res.json(areas);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get all parking locations
const getAllParkingLocations = async (req, res) => {
  try {
    const locations = await ParkingLocation.find()
      .populate("areaId", "name")
      .sort({ mallName: 1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get admin dashboard stats
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: "active" });
    const totalAreas = await Area.countDocuments();
    const totalLocations = await ParkingLocation.countDocuments();

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate("userId", "name email")
      .populate("locationId", "mallName address")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalUsers,
        totalBookings,
        activeBookings,
        totalAreas,
        totalLocations,
      },
      recentBookings,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Update parking location
const updateParkingLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { mallName, address, totalSpot } = req.body;

    const location = await ParkingLocation.findById(locationId);
    if (!location) {
      return res.status(404).json({ msg: "Parking location not found" });
    }

    // Calculate new free spots
    const usedSpots = location.totalSpot - location.freeSpot;
    const newFreeSpots = Math.max(0, totalSpot - usedSpots);

    location.mallName = mallName || location.mallName;
    location.address = address || location.address;
    location.totalSpot = totalSpot || location.totalSpot;
    location.freeSpot = newFreeSpots;

    await location.save();

    res.json(location);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Delete parking location
const deleteParkingLocation = async (req, res) => {
  try {
    const { locationId } = req.params;

    // Check if there are active bookings
    const activeBookings = await Booking.find({
      locationId,
      status: "active",
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        msg: "Cannot delete location with active bookings" 
      });
    }

    await ParkingLocation.findByIdAndDelete(locationId);

    res.json({ msg: "Parking location deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  addArea,
  addParkingLocation,
  getAllAreas,
  getAllParkingLocations,
  getAdminDashboard,
  updateParkingLocation,
  deleteParkingLocation,
};
