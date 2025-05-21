const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const path = require("path");
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 4 minutes.</p>`
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email send error:", error);
  }
};

const register = async (req, res) => {
  const { name, email, password, role = "user", profileImage } = req.body;

  try {
    const [existing] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 4 * 60 * 1000); // 10 minutes from now


    const [result] = await db.promise().query(
      `INSERT INTO users (name, email, password, role, profile_image, otp,otp_expiry, is_verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role, profileImage, otp, otpExpiry, false]
    );

    await sendOTP(email, otp);

    res.status(200).json({
      message: "OTP sent to email",
      otpRequired: true,
      userId: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

const verifyOtp = async (req, res) => {
  const { userId, otp, purpose = "signup" } = req.body;

  try {
    const [rows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = rows[0];

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check if OTP has expired
    const currentTime = new Date().getTime();
    const expiryTime = new Date(user.otp_expiry).getTime();

    if (currentTime > expiryTime) {
      if (purpose === "signup") {
        await db.promise().query("DELETE FROM users WHERE id = ? AND is_verified = false", [userId]);
        return res.status(400).json({ error: "OTP expired. Please register again." });
      } else if (purpose === "emailChange") {
        // Reset OTP and pending_email, but keep user intact
        await db.promise().query("UPDATE users SET otp = NULL, otp_expiry = NULL, pending_email = NULL WHERE id = ?", [userId]);
        return res.status(400).json({ error: "OTP expired. Email was not changed." });
      }
    }

    if (purpose === "signup") {
      await db.promise().query("UPDATE users SET is_verified = true, otp = NULL, otp_expiry = NULL WHERE id = ?", [userId]);
    } else if (purpose === "emailChange") {
      // Transfer pending_email to email
      await db.promise().query(
        "UPDATE users SET email = pending_email, pending_email = NULL, otp = NULL, otp_expiry = NULL, is_verified = true WHERE id = ?",
        [userId]
      );
    }

    res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const [rows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = rows[0];
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.json({ 
      message: "Login successful!", 
      token, 
      userId: user.id, 
      role: user.role,
      name: user.name,
      email: user.email,
      isPremium: user.is_premium === 1, // Add this line
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

const getProfile = (req, res) => {

  const userId = req.params.id;
  const sql = `
    SELECT id, name, email, profile_image, bio, twitter, linkedin, created_at, is_premium, premium_expires_at 
    FROM users 
    WHERE id = ?`;
    
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (result.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result[0]);
  });
};


const updateProfile = (req, res) => {
  const { name, bio, twitter, linkedin } = req.body;
  const userId = req.params.id;

  const sql = `
    UPDATE users
    SET name = ?, bio = ?, twitter = ?, linkedin = ?
    WHERE id = ?
  `;

  db.query(sql, [name, bio, twitter, linkedin, userId], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });

    db.query("SELECT * FROM users WHERE id = ?", [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: "Failed to fetch updated user" });
      res.json(rows[0]);
    });
  });
};

const uploadProfileImage = (req, res) => {
  const userId = req.params.id;

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const profileImagePath = `http://localhost:5001/uploads/${req.file.filename}`;
  const sql = "UPDATE users SET profile_image = ? WHERE id = ?";

  db.query(sql, [profileImagePath, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Profile image updated!", imageUrl: profileImagePath });
  });
};

const getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const addUser = (req, res) => {
  const { name, email, password, role } = req.body;
  db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User added" });
    }
  );
};

const updateUser = (req, res) => {
  const { name, email, role } = req.body;
  db.query("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
    [name, email, role, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User updated" });
    }
  );
};

const deleteUser = (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted" });
  });
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  register,
  login,
  getProfile,
  updateProfile,
  uploadProfileImage,
  verifyOtp,
  sendOTP
};