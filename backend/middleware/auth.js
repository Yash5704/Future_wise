const jwt = require("jsonwebtoken");
const { pool } = require('../config/pool');

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next){
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};


const adminMiddleware = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT role FROM users WHERE id = ?', 
      [req.userId]
    );
    
    if (rows.length === 0 || rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error during admin verification' });
  }
};


module.exports = { 
  authenticateToken, 
  isAdmin,
  adminMiddleware
 };
