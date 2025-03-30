const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

// Định tuyến
router.get("/", roomController.getRooms);
router.post("/create", roomController.createRoom);
router.put("/update/:id", roomController.updateRoom);
router.delete("/delete/:id", roomController.deleteRoom);
router.get("/get-by-device", roomController.getRoomByDeviceId);

module.exports = router;
