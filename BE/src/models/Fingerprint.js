// src/models/Fingerprint.js
const mongoose = require("mongoose");

const fingerprintSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  fingerprintId: { type: Number, required: true }, // Thêm trường này
  deviceId: { type: String, required: true },
});

module.exports = mongoose.model("Fingerprint", fingerprintSchema);
