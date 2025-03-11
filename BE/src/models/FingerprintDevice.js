const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true }, // ID của ESP32
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }, // Phòng được gán thiết bị
  status: {
    type: String,
    enum: ["Hoạt động", "Bị lỗi", "Không sử dụng"],
    default: "Hoạt động",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Device", deviceSchema);
