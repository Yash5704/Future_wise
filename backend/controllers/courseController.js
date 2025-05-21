const db = require("../config/db.js");

// Controller functions

// Get all courses
const getAllCourses = (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch courses", error: err });
    res.json(results);
  });
};

// Add a course
const addCourse = (req, res) => {
  const { name, description, duration, category } = req.body;

  if (!name || !description || !category) {
    return res.status(400).json({ message: 'Name, description, and category are required' });
  }
  db.query(
    'INSERT INTO courses (name, description, duration, category) VALUES (?, ?, ?, ?)',
    [name, description, duration, category],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to add course', error: err });
      res.status(201).json({ message: 'Course added successfully', courseId: results.insertId });
    }
  );
};

// Update a course
const updateCourse = (req, res) => {
  const { name, description, duration, category } = req.body;

  db.query(
    'UPDATE courses SET name = ?, description = ?, duration = ?, category = ? WHERE id = ?',
    [name, description, duration, category, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to update course', error: err });
    
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }
    
      res.json({ message: 'Course updated successfully' });
    }
  );
};

// Delete a course
const deleteCourse = (req, res) => {
  const courseId = req.params.id;
  
  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  db.query('DELETE FROM courses WHERE id = ?', [courseId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete course', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found or already deleted' });
    }

    res.json({ message: 'Course deleted successfully' });
  });
};


// Get course by ID
const getCourseById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM courses WHERE id = ?';
  
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(results[0]);
  });
};

module.exports = {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
};
