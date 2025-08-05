const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  points: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  firstLogin: { type: Boolean, default: true },
  paymentAmount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
