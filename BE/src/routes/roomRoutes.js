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
    const room = new Room({
      deviceId: uuidv4(), // Tạo deviceId duy nhất
      status: "Không có thiết bị", // Mặc định trạng thái
      ...req.body,
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔄 Cập nhật thông tin phòng (hỗ trợ reset deviceId nếu cần)
router.put("/update/:id", async (req, res) => {
  try {
    const updatedData = { ...req.body };

    // Nếu có yêu cầu reset deviceId
    if (req.body.resetDeviceId) {
      updatedData.deviceId = uuidv4();
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🗑️ Xóa phòng học
router.delete("/delete/:id", async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa phòng thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
