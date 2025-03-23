// src/routes/attendance.js
const express = require("express");
const Attendance = require("../models/Attendance");
const Room = require("../models/Room");
const Student = require("../models/Student");
const router = express.Router();

router.post("/check", async (req, res) => {
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
    res.status(200).json({ message: "Check-out OK" });
  } else {
    const attendance = new Attendance({
      student: student._id,
      room: room._id,
      checkInTime: new Date(),
    });
    await attendance.save();
    res.status(201).json({ message: "Check-in OK" });
  }
});

router.get("/", async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
      .populate("student")
      .populate("room");
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
