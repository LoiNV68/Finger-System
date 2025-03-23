const express = require("express");
const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid"); // Sử dụng để tạo deviceId duy nhất

const router = express.Router();

// 🏠 Lấy danh sách phòng
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Tạo phòng mới
router.post("/create", async (req, res) => {
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
      status: status || (deviceName ? "Hoạt động" : "Không có thiết bị"), // Mặc định trạng thái dựa trên deviceName
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔄 Cập nhật thông tin phòng
router.put("/update/:id", async (req, res) => {
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

    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🗑️ Xóa phòng học
router.delete("/delete/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Không tìm thấy phòng" });
    }
    res.json({ message: "Xóa phòng thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔍 Lấy phòng theo deviceId
router.get("/get-by-device", async (req, res) => {
  try {
    const { deviceId } = req.query;
    const room = await Room.findOne({ deviceId });
    if (!room) return res.status(404).json({ message: "Không tìm thấy phòng" });
    res.json({ roomId: room._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
