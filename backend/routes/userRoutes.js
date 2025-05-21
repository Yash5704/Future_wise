const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middleware/auth");
const {register,
  login,
  getProfile,
  updateProfile,
  uploadProfileImage,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  verifyOtp
} = require("../controllers/userController");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) => cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// Routes
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.post("/upload-profile/:id", upload.single("profileImage"), uploadProfileImage);
router.delete("/delete/:id", deleteUser);

// Update premium status after fake payment
router.post("/upgrade", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = "UPDATE users SET is_premium = 1 WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to upgrade user" });
    res.json({ message: "User upgraded to premium successfully" });
  });
});

module.exports = router;


router.get("/api/users", authenticateToken, isAdmin, getAllUsers);
router.post("/api/users",authenticateToken,isAdmin, addUser,
  [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
  ], 
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    res.json({ message: "User created!" });
  }
);
router.put("/api/users/:id", authenticateToken, isAdmin, updateUser);
router.delete("/api/users/:id", authenticateToken, isAdmin, deleteUser);


module.exports = router;
