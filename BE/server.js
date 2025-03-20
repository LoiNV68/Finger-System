const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const studentRoutes = require("./src/routes/studentRoutes");
const roomRoutes = require("./src/routes/roomRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");
const fingerprints = require("./src/routes/fingerprintRoutes");
const cors = require("cors");
const os = require("os");
const interfaces = os.networkInterfaces();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/admin";

app.use(cors());

function getLocalIP() {
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "localhost";
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fingerprint", fingerprints);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy tại http://${getLocalIP()}:${PORT}`);
});
