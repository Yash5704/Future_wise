const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {authenticateToken,isAdmin} = require("../middleware/auth");
const { submitManualPayment,
  getPendingPayments,
  updatePaymentStatus,
  getUserPayments,
 } = require("../controllers/paymentController");

const storage = multer.diskStorage({
  destination: "./uploads/payments/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/manual",authenticateToken, upload.single("screenshot"), submitManualPayment);

router.get("/pending", authenticateToken, isAdmin, getPendingPayments);
router.patch("/:id/status", authenticateToken, isAdmin, updatePaymentStatus);
router.get("/history", authenticateToken, getUserPayments);

module.exports = router;
