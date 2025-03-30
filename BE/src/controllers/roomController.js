const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");

// Lấy danh sách phòng
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách phòng", error: error.message });
  }
};

// Thêm phòng mới
exports.createRoom = async (req, res) => {
  try {
    const { name, floor, deviceName, status } = req.body;

    // Kiểm tra xem tên phòng đã tồn tại chưa
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ error: "Tên phòng đã tồn tại" });
    }

    const room = new Room({
      deviceId: uuidv4(), // Tạo deviceId duy nhất
      name,
      floor,
      deviceName: deviceName || undefined,
      status: status || (deviceName ? "Hoạt động" : "Không có thiết bị"), // Mặc định trạng thái
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi tạo phòng", error: error.message });
  }
};

// Cập nhật phòng học
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, floor, deviceName, status, resetDeviceId } = req.body;

    // Kiểm tra trùng tên phòng (trừ phòng hiện tại)
    const existingRoom = await Room.findOne({ name, _id: { $ne: id } });
    if (existingRoom) {
      return res.status(400).json({ error: "Tên phòng đã tồn tại" });
    }

    const updatedData = {
      name,
      floor,
      deviceName: deviceName || undefined,
      status,
    };

    // Nếu có yêu cầu reset deviceId
    if (resetDeviceId) {
      updatedData.deviceId = uuidv4();
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedRoom) {
      return res.status(404).json({ error: "Không tìm thấy phòng" });
    }

    res.status(200).json(updatedRoom);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi cập nhật phòng", error: error.message });
  }
};

// Xóa phòng học
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Không tìm thấy phòng" });
    }
    res.status(200).json({ message: "Xóa phòng thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa phòng", error: error.message });
  }
};

// Lấy phòng theo deviceId
exports.getRoomByDeviceId = async (req, res) => {
  try {
    const { deviceId } = req.query;
    const room = await Room.findOne({ deviceId });
    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }
    res.status(200).json({ roomId: room._id });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy phòng theo deviceId",
      error: error.message,
    });
  }
};

module.exports = exports;
