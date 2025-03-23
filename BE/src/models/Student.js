const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  class: { type: String, required: true },
  department: { type: String, required: true },
  deviceId: { type: String, default: null }, // Liên kết với Room.deviceId
});

module.exports = mongoose.model("Student", studentSchema);