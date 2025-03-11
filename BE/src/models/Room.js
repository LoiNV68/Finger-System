const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên phòng (Phòng 101, 102, ...)
  floor: { type: Number, required: true }, // Tầng
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device" }, // Gán thiết bị vân tay vào phòng
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", roomSchema);
