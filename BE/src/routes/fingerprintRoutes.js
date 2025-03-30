const express = require("express");
const router = express.Router();
const fingerprintController = require("../controllers/fingerprintController");

// Định tuyến
router.post("/request-register", fingerprintController.requestRegister);
router.get("/check-request", fingerprintController.checkRequest);
router.post("/register-fingerprint", fingerprintController.registerFingerprint);
router.post("/verify-fingerprint", fingerprintController.verifyFingerprint);
router.post("/delete-fingerprint", fingerprintController.deleteFingerprint);
router.get("/check-delete", fingerprintController.checkDelete);
router.get("/next-id", fingerprintController.getNextFingerprintId);

module.exports = router;
