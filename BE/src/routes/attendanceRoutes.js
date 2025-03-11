const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

// Lấy danh sách điểm danh
router.get("/", async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
      .populate("student")
      .populate("room")
      .populate("device");
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo bản ghi điểm danh
router.post("/create", async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
