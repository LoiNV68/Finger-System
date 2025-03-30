const Fingerprint = require("../models/Fingerprint");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// Biến trạng thái toàn cục
let pendingStudentId = null;
let pendingDeviceId = null;
let pendingDeleteFingerprintId = null;
let pendingDeleteDeviceId = null;

// Yêu cầu đăng ký vân tay
exports.requestRegister = (req, res) => {
  const { studentId, deviceId } = req.body;
  if (!studentId || !deviceId) {
    return res.status(400).json({ message: "Thiếu studentId hoặc deviceId" });
  }
  pendingStudentId = studentId;
  pendingDeviceId = deviceId;
  res.status(200).json({ message: "Yêu cầu đăng ký đã được gửi" });
};

// Kiểm tra yêu cầu đăng ký vân tay
exports.checkRequest = async (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) {
    return res.status(400).json({ message: "Thiếu deviceId" });
  }
  if (pendingStudentId && pendingDeviceId === deviceId) {
    res
      .status(200)
      .json({ studentId: pendingStudentId, deviceId: pendingDeviceId });
  } else {
    res.status(200).json({ studentId: null, deviceId });
  }
};

// Đăng ký vân tay
exports.registerFingerprint = async (req, res) => {
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
};

// Xác minh vân tay
exports.verifyFingerprint = async (req, res) => {
  const { fingerprintId, deviceId } = req.body;
  if (!fingerprintId || !deviceId) {
    return res
      .status(400)
      .json({ message: "Thiếu fingerprintId hoặc deviceId" });
  }

  const fingerprint = await Fingerprint.findOne({ fingerprintId, deviceId });
  if (fingerprint) {
    res.status(200).json({ studentId: fingerprint.studentId });
  } else {
    res.status(404).json({ message: "Không tìm thấy vân tay" });
  }
};

// Yêu cầu xóa vân tay và lịch sử điểm danh
exports.deleteFingerprint = async (req, res) => {
  const { studentId, deviceId } = req.body;
  if (!studentId || !deviceId) {
    return res.status(400).json({ message: "Thiếu studentId hoặc deviceId" });
  }

  const student = await Student.findOne({ studentId, deviceId });
  if (!student) {
    return res.status(404).json({ message: "Không tìm thấy sinh viên" });
  }

  const fingerprint = await Fingerprint.findOne({ studentId, deviceId });
  if (!fingerprint) {
    return res.status(404).json({ message: "Không tìm thấy vân tay" });
  }

  await Fingerprint.deleteOne({ studentId, deviceId });

  const deleteResult = await Attendance.deleteMany({ student: student._id });
  console.log(
    `Deleted ${deleteResult.deletedCount} attendance records for student ${studentId}`
  );

  pendingDeleteFingerprintId = fingerprint.fingerprintId;
  pendingDeleteDeviceId = deviceId;

  res.status(200).json({
    message: "Yêu cầu xóa vân tay và lịch sử điểm danh đã được gửi",
    fingerprintId: fingerprint.fingerprintId,
  });
};

// Kiểm tra yêu cầu xóa vân tay
exports.checkDelete = async (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) {
    return res.status(400).json({ message: "Thiếu deviceId" });
  }
  if (pendingDeleteFingerprintId && pendingDeleteDeviceId === deviceId) {
    res.status(200).json({ fingerprintId: pendingDeleteFingerprintId });
    pendingDeleteFingerprintId = null; // Reset sau khi gửi
    pendingDeleteDeviceId = null;
  } else {
    res.status(200).json({ fingerprintId: 0 });
  }
};

// Lấy ID tiếp theo cho fingerprint
exports.getNextFingerprintId = async (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) {
    return res.status(400).json({ message: "Thiếu deviceId" });
  }

  try {
    const fingerprints = await Fingerprint.find({ deviceId });
    if (fingerprints.length === 0) {
      return res.status(200).json({ nextId: 1 });
    }

    const maxId = Math.max(...fingerprints.map((fp) => fp.fingerprintId));
    const nextId = maxId + 1;

    res.status(200).json({ nextId });
  } catch (error) {
    console.error("Lỗi khi lấy nextId:", error);
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy nextId", error: error.message });
  }
};

module.exports = exports;
