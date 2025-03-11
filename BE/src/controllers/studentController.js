const Student = require('../models/Student');

// Lấy danh sách sinh viên
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sinh viên" });
  }
};

// Thêm sinh viên mới
export const createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo sinh viên" });
  }
};

// Cập nhật thông tin sinh viên
export const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sinh viên" });
  }
};

// Xóa sinh viên
export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa sinh viên thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sinh viên" });
  }
};
