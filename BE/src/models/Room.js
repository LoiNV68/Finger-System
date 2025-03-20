const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Sử dụng UUID để tạo deviceId duy nhất

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }, // Tên phòng duy nhất
  floor: { type: Number, required: true }, // Tầng
  deviceId: {
    type: String,
    unique: true,
    default: function () {
      return this.deviceName ? uuidv4() : null;
    }, // Chỉ tạo deviceId khi có deviceName
  },
  deviceName: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Không có thiết bị", "Hoạt động", "Bị lỗi"],
    default: function () {
      return this.deviceName ? "Hoạt động" : "Không có thiết bị";
    }, // Cập nhật trạng thái dựa vào deviceName
  },
  createdAt: { type: Date, default: Date.now },
});

// Middleware để cập nhật deviceId và status khi có deviceName
roomSchema.pre("save", function (next) {
  if (this.deviceName && !this.deviceId) {
    this.deviceId = uuidv4();
  }
  this.status = this.deviceName ? "Hoạt động" : "Không có thiết bị";
  next();
});

// Tạo index để đảm bảo name là duy nhất trong DB
roomSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Room", roomSchema);
