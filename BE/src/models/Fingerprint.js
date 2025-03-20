// src/models/Fingerprint.js
const mongoose = require("mongoose");

const fingerprintSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  fingerprintTemplate: { type: String, required: true },
});

module.exports = mongoose.model("Fingerprint", fingerprintSchema);
