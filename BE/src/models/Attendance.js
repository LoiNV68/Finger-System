const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  }, // Sinh viên điểm danh
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }, // Phòng học
  checkInTime: { type: Date, default: Date.now }, // Thời gian vào
  checkOutTime: { type: Date }, // Thời gian ra
});

module.exports = mongoose.model("Attendance", attendanceSchema);
  