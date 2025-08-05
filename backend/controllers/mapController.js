const ParkingLocation = require("../models/ParkingLocation");

const getMapLink = async (req, res) => {
  try {
    const { locationId } = req.params;

    const location = await ParkingLocation.findById(locationId);
    if (!location || !location.address) {
      return res.status(404).json({ msg: "Parking location or address not found" });
    }

    const encodedAddress = encodeURIComponent(location.address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

    res.status(200).json({ mapsUrl });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { getMapLink };
