const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middleware/auth");

const {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
} = require('../controllers/courseController');

const { getVideosByCourse } = require("../controllers/videoController"); 

// Route Definitions
router.get('/courses', getAllCourses);
router.post("/courses", authenticateToken, isAdmin, addCourse);
router.put("/courses/:id", authenticateToken, isAdmin, updateCourse);
router.delete("/courses/:id", authenticateToken, isAdmin, deleteCourse);
router.get('/courses/:id', getCourseById);
router.get('/courses/:id/videos', getVideosByCourse);

module.exports = router;
