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

// API tìm kiếm bản ghi điểm danh
router.get("/search", async (req, res) => {
  try {
    const {
      name,
      studentId,
      room,
      class: className,
      department,
      gender,
    } = req.query;

    // Tạo điều kiện tìm kiếm
    const query = {};

    // Tìm kiếm trong Attendance với populate student và room
    const attendanceQuery = {};

    // Tìm kiếm theo studentId
    if (studentId) {
      const student = await Student.findOne({
        studentId: { $regex: studentId, $options: "i" },
      });
      if (student) attendanceQuery.student = student._id;
    }

    // Tìm kiếm theo tên sinh viên
    if (name) {
      const students = await Student.find({
        name: { $regex: name, $options: "i" },
      });
      if (students.length > 0)
        attendanceQuery.student = { $in: students.map((s) => s._id) };
    }

    // Tìm kiếm theo phòng
    if (room) {
      const rooms = await Room.find({ name: { $regex: room, $options: "i" } });
      if (rooms.length > 0)
        attendanceQuery.room = { $in: rooms.map((r) => r._id) };
    }

    // Tìm kiếm theo lớp
    if (className) {
      const students = await Student.find({
        class: { $regex: className, $options: "i" },
      });
      if (students.length > 0)
        attendanceQuery.student = { $in: students.map((s) => s._id) };
    }

    // Tìm kiếm theo viện (department)
    if (department) {
      const students = await Student.find({
        department: { $regex: department, $options: "i" },
      });
      if (students.length > 0)
        attendanceQuery.student = { $in: students.map((s) => s._id) };
    }

    // Tìm kiếm theo giới tính
    if (gender) {
      const students = await Student.find({
        gender: { $regex: gender, $options: "i" },
      });
      if (students.length > 0)
        attendanceQuery.student = { $in: students.map((s) => s._id) };
    }

    // Thực hiện truy vấn
    const attendanceRecords = await Attendance.find(attendanceQuery)
      .populate("student")
      .populate("room");

    // Chuyển đổi dữ liệu sang định dạng mong muốn
    const mappedData = attendanceRecords.map((record) => ({
      id: record._id || "N/A",
      name: record.student?.name || "Không xác định",
      gender: record.student?.gender || "N/A",
      studentId: record.student?.studentId || "N/A",
      timeIn: record.checkInTime
        ? new Date(record.checkInTime).toLocaleString()
        : "N/A",
      timeOut: record.checkOutTime
        ? new Date(record.checkOutTime).toLocaleString()
        : "",
      room: record.room?.name || "N/A",
      class: record.student?.class || "N/A",
      department: record.student?.department || "N/A",
    }));

    res.status(200).json(mappedData);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm điểm danh:", error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm điểm danh" });
  }
});
module.exports = router;
