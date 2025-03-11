const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const studentRoutes = require("./src/routes/studentRoutes");
const roomRoutes = require("./src/routes/roomRoutes");
const deviceRoutes = require("./src/routes/deviceRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");
const fingerprintRoutes = require("./src/routes/fingerprint");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/admin";

// Kết nối MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Middleware
app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fingerprint", fingerprintRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
