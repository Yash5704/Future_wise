const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { pool } = require('../config/pool');
const { authenticateToken } = require('../middleware/auth');
const { sendOTP } = require('../controllers/userController');
const db = require('../config/db');

// Get user settings
router.get('/settings', authenticateToken, async (req, res) => {
   console.log('Authenticated user:', req.user);
  try {
    const [rows] = await pool.query('SELECT email FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ email: rows[0].email });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update email
router.put('/update-email', authenticateToken, async (req, res) => {
  const userId = req.user.id; // assuming decoded token
  const { newEmail } = req.body;

  try {
    // Check if new email is already used
    const [existing] = await db.promise().query("SELECT id FROM users WHERE email = ?", [newEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 4 * 60 * 1000);

    // Update user's email and save OTP
    await db.promise().query(
      "UPDATE users SET pending_email = ?, otp = ?, otp_expiry = ? WHERE id = ?",
      [newEmail, otp, otpExpiry, userId]
    );

    await sendOTP(newEmail, otp);

    res.json({ message: "Email updated. OTP sent to new email." });
  } catch (err) {
    console.error("Update email error:", err);
    res.status(500).json({ error: "Failed to update email" });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password' });
  }
});

module.exports = router;
