const Device = require("../models/FingerprintDevice");

// Lấy danh sách thiết bị
export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách thiết bị" });
  }
};

// Thêm thiết bị mới
export const createDevice = async (req, res) => {
  try {
    const newDevice = new Device(req.body);
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo thiết bị" });
  }
};

// Cập nhật thiết bị
export const updateDevice = async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật thiết bị" });
  }
};

// Xóa thiết bị
export const deleteDevice = async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa thiết bị thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa thiết bị" });
  }
};
