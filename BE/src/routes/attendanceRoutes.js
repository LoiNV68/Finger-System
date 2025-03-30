const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// Định tuyến
router.get("/", attendanceController.getAttendanceRecords);
router.post("/check", attendanceController.createAttendanceRecord);

module.exports = router;
