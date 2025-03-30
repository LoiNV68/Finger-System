const Attendance = require("../models/Attendance");
const Room = require("../models/Room");
const Student = require("../models/Student");

// Lấy danh sách điểm danh
exports.getAttendanceRecords = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
      .populate("student")
      .populate("room");
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách điểm danh",
      error: error.message,
    });
  }
};

// Ghi nhận điểm danh (check-in/check-out)
exports.createAttendanceRecord = async (req, res) => {
  try {
    const { studentId, deviceId } = req.body;
    if (!studentId || !deviceId) {
      return res.status(400).json({ message: "Thiếu studentId hoặc deviceId" });
    }

    const student = await Student.findOne({ studentId, deviceId });
    if (!student) {
      return res.status(403).json({ message: "DeviceId không khớp" });
    }

    const room = await Room.findOne({ deviceId });
    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    const existingRecord = await Attendance.findOne({
      student: student._id,
      room: room._id,
      checkOutTime: null,
    });

    if (existingRecord) {
      existingRecord.checkOutTime = new Date();
      await existingRecord.save();
      res.status(200).json({ message: "Check-out OK", data: existingRecord });
    } else {
      const attendance = new Attendance({
        student: student._id,
        room: room._id,
        checkInTime: new Date(),
      });
      await attendance.save();
      res.status(201).json({ message: "Check-in OK", data: attendance });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi ghi nhận điểm danh", error: error.message });
  }
};

module.exports = exports;
