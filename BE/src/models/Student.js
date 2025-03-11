const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  class: { type: String, required: true },
  department: { type: String, required: true },
  fingerprintTemplate: { type: String }, // Lưu template vân tay (Base64 hoặc Buffer)
});

module.exports = mongoose.model("Student", studentSchema);
