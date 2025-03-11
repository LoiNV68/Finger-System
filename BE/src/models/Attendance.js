const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  }, // Sinh viên điểm danh
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }, // Phòng học
  device: { type: mongoose.Schema.Types.ObjectId, ref: "Device" }, // Thiết bị vân tay
  timestamp: { type: Date, default: Date.now }, // Thời gian điểm danh
});
module.exports = mongoose.model("Attendance", attendanceSchema);
