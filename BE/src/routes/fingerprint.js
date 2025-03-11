const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// API lưu vân tay vào MongoDB
router.post("/register-fingerprint", async (req, res) => {
  const { studentId, fingerprintTemplate } = req.body;

  if (!studentId || !fingerprintTemplate) {
    return res
      .status(400)
      .json({ message: "Thiếu studentId hoặc fingerprintTemplate" });
  }

  try {
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Sinh viên không tồn tại" });
    }

    student.fingerprintTemplate = fingerprintTemplate;
    await student.save();

    res.json({ message: "Lưu vân tay thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

// API xác thực vân tay
router.post("/verify-fingerprint", async (req, res) => {
  const { fingerprintTemplate } = req.body;

  if (!fingerprintTemplate) {
    return res.status(400).json({ message: "Thiếu fingerprintTemplate" });
  }

  try {
    // Tìm sinh viên có vân tay khớp
    const student = await Student.findOne({ fingerprintTemplate });

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }

    res.json({
      message: "Xác thực thành công",
      student: {
        studentId: student.studentId,
        name: student.name,
        class: student.class,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

module.exports = router;
