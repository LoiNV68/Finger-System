const express = require("express");
const Fingerprint = require("../models/Fingerprint");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const router = express.Router();

let pendingStudentId = null;
let pendingDeviceId = null;
let pendingDeleteFingerprintId = null;
let pendingDeleteDeviceId = null;

router.post("/request-register", (req, res) => {
  const { studentId, deviceId } = req.body;
  if (!studentId || !deviceId) {
    return res.status(400).json({ message: "Thiếu studentId hoặc deviceId" });
  }
  pendingStudentId = studentId;
  pendingDeviceId = deviceId;
  res.json({ message: "Yêu cầu đăng ký đã được gửi" });
});

router.get("/check-request", async (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) {
    return res.status(400).json({ message: "Thiếu deviceId" });
  }
  if (pendingStudentId && pendingDeviceId === deviceId) {
    res.json({ studentId: pendingStudentId, deviceId: pendingDeviceId });
  } else {
    res.json({ studentId: null, deviceId });
  }
});

router.post("/register-fingerprint", async (req, res) => {
  const { studentId, fingerprintId, deviceId } = req.body;
  if (!studentId || !fingerprintId || !deviceId) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
  }

  const student = await Student.findOne({ studentId, deviceId });
  if (!student) {
    return res
      .status(403)
      .json({ message: "DeviceId không khớp với sinh viên" });
  }

  const existingFingerprint = await Fingerprint.findOne({
    fingerprintId,
    deviceId,
  });
  if (existingFingerprint) {
    return res
      .status(400)
      .json({ message: "FingerprintId đã tồn tại trên thiết bị này" });
  }

  const fingerprint = new Fingerprint({
    studentId,
    fingerprintId,
    deviceId,
  });
  await fingerprint.save();

  pendingStudentId = null;
  pendingDeviceId = null;

  res.status(200).json({ message: "Đăng ký thành công" });
});

router.post("/verify-fingerprint", async (req, res) => {
  const { fingerprintId, deviceId } = req.body;
  if (!fingerprintId || !deviceId) {
    return res
      .status(400)
      .json({ message: "Thiếu fingerprintId hoặc deviceId" });
  }

  const fingerprint = await Fingerprint.findOne({ fingerprintId, deviceId });
  if (fingerprint) {
    res.json({ studentId: fingerprint.studentId });
  } else {
    res.status(404).json({ message: "Không tìm thấy vân tay" });
  }
});

router.post("/delete-fingerprint", async (req, res) => {
  const { studentId, deviceId } = req.body;
  if (!studentId || !deviceId) {
    return res.status(400).json({ message: "Thiếu studentId hoặc deviceId" });
  }

  // Tìm sinh viên để lấy _id
  const student = await Student.findOne({ studentId, deviceId });
  if (!student) {
    return res.status(404).json({ message: "Không tìm thấy sinh viên" });
  }

  // Tìm và xóa vân tay
  const fingerprint = await Fingerprint.findOne({ studentId, deviceId });
  if (!fingerprint) {
    return res.status(404).json({ message: "Không tìm thấy vân tay" });
  }

  await Fingerprint.deleteOne({ studentId, deviceId });

  // Xóa lịch sử điểm danh liên quan đến sinh viên
  const deleteResult = await Attendance.deleteMany({ student: student._id });
  console.log(
    `Deleted ${deleteResult.deletedCount} attendance records for student ${studentId}`
  );

  // Lưu thông tin để ESP32 xóa trong AS608
  pendingDeleteFingerprintId = fingerprint.fingerprintId;
  pendingDeleteDeviceId = deviceId;

  res.json({
    message: "Yêu cầu xóa vân tay và lịch sử điểm danh đã được gửi",
    fingerprintId: fingerprint.fingerprintId,
  });
});

router.get("/check-delete", async (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) {
    return res.status(400).json({ message: "Thiếu deviceId" });
  }
  if (pendingDeleteFingerprintId && pendingDeleteDeviceId === deviceId) {
    res.json({ fingerprintId: pendingDeleteFingerprintId });
    pendingDeleteFingerprintId = null; // Reset sau khi gửi
    pendingDeleteDeviceId = null;
  } else {
    res.json({ fingerprintId: 0 });
  }
});

// Route mới: Lấy ID tiếp theo cho fingerprint
router.get("/next-id", async (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) {
    return res.status(400).json({ message: "Thiếu deviceId" });
  }

  try {
    // Tìm tất cả fingerprint đã đăng ký cho deviceId
    const fingerprints = await Fingerprint.find({ deviceId });
    if (fingerprints.length === 0) {
      // Nếu chưa có fingerprint nào, trả về ID 1
      return res.json({ nextId: 1 });
    }

    // Lấy fingerprintId lớn nhất
    const maxId = Math.max(...fingerprints.map((fp) => fp.fingerprintId));
    const nextId = maxId + 1;

    res.json({ nextId });
  } catch (error) {
    console.error("Lỗi khi lấy nextId:", error);
    res.status(500).json({ message: "Lỗi server khi lấy nextId" });
  }
});

module.exports = router;
