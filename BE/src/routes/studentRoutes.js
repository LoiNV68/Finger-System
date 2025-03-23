const express = require("express");
const Student = require("../models/Student");
const Fingerprint = require("../models/Fingerprint");
const Room = require("../models/Room");
const router = express.Router();

// Lấy tất cả sinh viên kèm thông tin vân tay và phòng học
router.get("/", async (req, res) => {
  try {
    const students = await Student.find(); // Lấy tất cả sinh viên
    const fingerprints = await Fingerprint.find();
    const rooms = await Room.find();

    const studentsWithDetails = students.map((student) => {
      const fingerprint = fingerprints.find(
        (fp) => fp.studentId === student.studentId
      );
      const room = rooms.find((r) => r.deviceId === student.deviceId);
      return {
        ...student.toObject(),
        hasFingerprint: !!fingerprint, // true nếu có vân tay, false nếu không
        roomName: room ? room.name : "Chưa gán phòng",
      };
    });

    res.json(studentsWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo sinh viên mới với validate studentId
router.post("/create", async (req, res) => {
  try {
    console.log("Dữ liệu nhận từ client:", req.body);
    const { studentId } = req.body;

    // Kiểm tra trùng studentId
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ error: "Mã sinh viên đã tồn tại" });
    }

    if (Array.isArray(req.body)) {
      const students = await Student.insertMany(req.body);
      res.status(201).json({ message: "Thêm sinh viên thành công", students });
    } else {
      const student = new Student(req.body);
      await student.save();
      res.status(201).json(student);
    }
  } catch (error) {
    console.error("Lỗi khi tạo sinh viên:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Cập nhật sinh viên với validate studentId
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    // Kiểm tra trùng studentId (ngoại trừ sinh viên hiện tại)
    const existingStudent = await Student.findOne({
      studentId,
      _id: { $ne: id },
    });
    if (existingStudent) {
      return res.status(400).json({ error: "Mã sinh viên đã tồn tại" });
    }

    const student = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!student) {
      return res.status(404).json({ error: "Không tìm thấy sinh viên" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Xóa sinh viên
router.delete("/delete/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Không tìm thấy sinh viên" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route /list không cần thiết cho StudentManagement, có thể giữ hoặc xóa
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
        };
      });
    res.json({ success: true, data: studentsWithFingerprints });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
});

module.exports = router;
  