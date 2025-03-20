const express = require("express");
const Student = require("../models/Student");
const Fingerprint = require("../models/Fingerprint");
const router = express.Router();

// Lấy danh sách sinh viên kèm thông tin vân tay
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    const fingerprints = await Fingerprint.find();

    const studentsWithFingerprints = students.map((student) => {
      const fingerprint = fingerprints.find(
        (fp) => fp.studentId === student.studentId
      );
      return {
        ...student.toObject(),
        fingerprintTemplate: fingerprint
          ? fingerprint.fingerprintTemplate
          : null,
      };
    });

    res.json(studentsWithFingerprints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo sinh viên mới
router.post("/create", async (req, res) => {
  try {
    console.log("Dữ liệu nhận từ client:", req.body);

    // Nếu req.body là mảng, xử lý từng sinh viên
    if (Array.isArray(req.body)) {
      const students = await Student.insertMany(req.body);
      res.status(201).json({ message: "Thêm sinh viên thành công", students });
    } else {
      // Nếu chỉ là một object đơn
      const student = new Student(req.body);
      await student.save();
      res.status(201).json(student);
    }
  } catch (error) {
    console.error("Lỗi khi tạo sinh viên:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Cập nhật sinh viên
router.put("/update/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Xóa sinh viên
router.delete("/delete/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy danh sách sinh viên đã đăng ký vân tay
router.get("/list", async (req, res) => {
  try {
    const students = await Student.find();
    const fingerprints = await Fingerprint.find();
    const studentsWithFingerprints = students
      .filter((student) =>
        fingerprints.some((fp) => fp.studentId === student.studentId)
      )
      .map((student) => {
        const fingerprint = fingerprints.find(
          (fp) => fp.studentId === student.studentId
        );
        return {
          studentId: student.studentId,
          name: student.name,
          fingerprintTemplate: fingerprint
            ? fingerprint.fingerprintTemplate
            : null,
        };
      });
    res.json({ success: true, data: studentsWithFingerprints });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
});

module.exports = router;
