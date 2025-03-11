const Room = require("../models/Room");

// Lấy danh sách phòng
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phòng" });
  }
};

// Thêm phòng mới
export const createRoom = async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo phòng" });
  }
};

// Cập nhật phòng học
export const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật phòng" });
  }
};

// Xóa phòng học
export const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa phòng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa phòng" });
  }
};
