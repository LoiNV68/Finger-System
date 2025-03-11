const express = require("express");
const Room = require("../models/Room");

const router = express.Router();

// Lấy danh sách phòng
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().populate("deviceId");
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo phòng mới
router.post("/create", async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cập nhật phòng học
router.put("/update/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Xóa phòng học
router.delete("/delete/:id", async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
