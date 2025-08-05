const mongoose = require("mongoose");

const parkingLocationSchema = new mongoose.Schema({
  mallName: { type: String, required: true },
  address: { type: String, required: true },
  totalSpot: { type: Number, required: true },
  freeSpot: { type: Number, required: true },
  areaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Area",
    required: true,
  },
});

module.exports = mongoose.model("ParkingLocation", parkingLocationSchema);
