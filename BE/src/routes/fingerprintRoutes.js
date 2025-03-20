const express = require("express");
const Fingerprint = require("../models/Fingerprint");
const Student = require("../models/Student");
const router = express.Router();

let pendingStudentId = null;

router.post("/request-register", (req, res) => {
  const { studentId } = req.body;
  if (!studentId) return res.status(400).json({ message: "Thiếu studentId" });
  pendingStudentId = studentId;
  res.json({ message: "Yêu cầu đăng ký đã được gửi" });
});

router.get("/check-request", (req, res) => {
  res.json({ studentId: pendingStudentId || null });
});

router.post("/register-fingerprint", async (req, res) => {
  const { studentId, fingerprintTemplate } = req.body;
  if (!studentId || !fingerprintTemplate) {
    return res.status(400).json({ message: "Thiếu studentId hoặc fingerprintTemplate" });
  }
  try {
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: "Sinh viên không tồn tại" });

    let fingerprint = await Fingerprint.findOne({ studentId });
    if (fingerprint) {
      fingerprint.fingerprintTemplate = fingerprintTemplate;
    } else {
      fingerprint = new Fingerprint({ studentId, fingerprintTemplate });
    }
    await fingerprint.save();
    pendingStudentId = null;
    res.json({ message: "Lưu vân tay thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

router.post("/verify-fingerprint", async (req, res) => {
  const { fingerprintTemplate } = req.body;
  if (!fingerprintTemplate) return res.status(400).json({ message: "Thiếu fingerprintTemplate" });

  try {
    const fingerprint = await Fingerprint.findOne({ fingerprintTemplate });
    if (!fingerprint) return res.status(404).json({ message: "Không tìm thấy sinh viên" });

    const student = await Student.findOne({ studentId: fingerprint.studentId });
    res.json({
      message: "Xác thực thành công",
      student: { studentId: student._id, name: student.name, class: student.class },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

router.get("/sync", async (req, res) => {
  try {
    const fingerprints = await Fingerprint.find({}, "studentId fingerprintTemplate");
    res.json(fingerprints);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách vân tay" });
  }
});

module.exports = router;