const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Định tuyến
router.get("/", studentController.getStudents);
router.post("/create", studentController.createStudent);
router.put("/update/:id", studentController.updateStudent);
router.delete("/delete/:id", studentController.deleteStudent);
router.get("/list", studentController.getStudentsWithFingerprints);

module.exports = router;
