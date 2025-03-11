const express = require("express");
const Device = require("../models/FingerprintDevice");

const router = express.Router();

// Lấy danh sách thiết bị
router.get("/", async (req, res) => {
  try {
    const devices = await Device.find().populate("room");
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo thiết bị mới
router.post("/create", async (req, res) => {
  try {
    const device = new Device(req.body);
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cập nhật thiết bị
router.put("/update/:id", async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(device);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Xóa thiết bị
router.delete("/delete/:id", async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
