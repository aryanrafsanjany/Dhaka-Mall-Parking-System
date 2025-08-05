const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingLocation",
    required: true,
  },
  bookingTime: {
    type: Date,
    default: Date.now,
  },
  arrivalTime: Date,
  status: {
    type: String,
    enum: ["active", "cancelled", "expired", "completed"],
    default: "active",
  },
  paymentAmount: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "points"],
    default: "cash",
  },
  fineAmount: {
    type: Number,
    default: 0,
  },
  // ⭐ Feedback fields
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
