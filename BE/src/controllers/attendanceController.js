const Attendance = require("../models/Attendance");

// Lấy danh sách điểm danh
export const getAttendanceRecords = async (req, res) => {
  try {
    const records = await Attendance.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách điểm danh" });
  }
};

// Ghi nhận điểm danh
export const createAttendanceRecord = async (req, res) => {
  try {
    const newRecord = new Attendance(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi ghi nhận điểm danh" });
  }
};
