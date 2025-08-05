const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Area", areaSchema);
