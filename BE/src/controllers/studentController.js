// src/controllers/studentController.js
const Student = require("../models/Student");
const Fingerprint = require("../models/Fingerprint");
const Room = require("../models/Room");

// Lấy danh sách sinh viên kèm thông tin vân tay và phòng học
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
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

    res.status(200).json(studentsWithDetails);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách sinh viên",
        error: error.message,
      });
  }
};

// Thêm sinh viên mới với validate studentId
exports.createStudent = async (req, res) => {
  try {
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
    res
      .status(400)
      .json({ message: "Lỗi khi tạo sinh viên", error: error.message });
  }
};

// Cập nhật thông tin sinh viên với validate studentId
exports.updateStudent = async (req, res) => {
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
    res.status(200).json(student);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi cập nhật sinh viên", error: error.message });
  }
};

// Xóa sinh viên
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Không tìm thấy sinh viên" });
    }
    res.status(200).json({ message: "Xóa sinh viên thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa sinh viên", error: error.message });
  }
};

// Lấy danh sách sinh viên có vân tay (dành cho route /list)
exports.getStudentsWithFingerprints = async (req, res) => {
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
    res.status(200).json({ success: true, data: studentsWithFingerprints });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách sinh viên có vân tay",
        error: error.message,
      });
  }
};

module.exports = exports;
