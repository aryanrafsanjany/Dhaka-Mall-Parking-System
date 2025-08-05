const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  paymentAmount: {
    type: Number,
    default: 0,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);

