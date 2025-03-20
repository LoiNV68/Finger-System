const express = require("express");
const Attendance = require("../models/Attendance");
const Room = require("../models/Room");
const router = express.Router();

router.post("/check", async (req, res) => {
  const { student, deviceId } = req.body;
  if (!student || !deviceId) {
    return res.status(400).json({ message: "Thiếu student hoặc deviceId" });
  }

  try {
    const room = await Room.findOne({ deviceId });
    if (!room) return res.status(404).json({ message: "Không tìm thấy phòng" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let attendance = await Attendance.findOne({
      student,
      room: room._id,
      checkInTime: { $gte: today, $lt: tomorrow },
    });

    if (!attendance) {
      // Check-in
      attendance = new Attendance({
        student,
        room: room._id,
        checkInTime: new Date(),
      });
      await attendance.save();
      res.status(201).json({ message: "Check-in thành công", attendance });
    } else if (!attendance.checkOutTime) {
      // Check-out
      attendance.checkOutTime = new Date();
      await attendance.save();
      res.status(200).json({ message: "Check-out thành công", attendance });
    } else {
      res.status(400).json({ message: "Đã check-out trong ngày" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
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
