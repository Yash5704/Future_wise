const db = require('../config/db');

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, course_id } = req.body;
    const fileUrl = `${process.env.BASE_URL || 'http://localhost:5001'}/uploads/${req.file.filename}`;

    // Insert into database
    const sql = "INSERT INTO videos (title, type, url, course_id) VALUES (?, 'upload', ?, ?)";
    db.query(sql, [title, fileUrl, course_id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Video uploaded successfully", url: fileUrl });
    });

  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Video upload failed" });
  }
};

const addYouTubeLink = async (req, res) => {
  const { title, url, course_id } = req.body;

  const sql = "INSERT INTO videos (title, type, url, course_id) VALUES (?, 'youtube', ?, ?)";
  db.query(sql, [title, url, course_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "YouTube link added successfully" });
  });
};


const getVideos = (req, res) => {
  const { search = "", page = 1, limit = 6, category } = req.query;
  const offset = (page - 1) * limit;
  const searchQuery = `%${search}%`;
  let sql = "SELECT * FROM videos WHERE title LIKE ?";
  let sqlCount = "SELECT COUNT(*) AS total FROM videos WHERE title LIKE ?";
  const params = [searchQuery];

  if (category) {
    sql += " AND category = ?";
    sqlCount += " AND category = ?";
    params.push(category);
  }

  sql += " ORDER BY id DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));

  db.query(sqlCount, [searchQuery, ...(category ? [category] : [])], (err, countResult) => {
    if (err) return res.status(500).json({ error: err });
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ videos: results, totalPages, currentPage: parseInt(page) });
    });
  });
};

const deleteVideo = (req, res) => {
  const { id } = req.params;
  
  // Soft delete recommended instead of hard delete
  const sql = "DELETE FROM videos WHERE id = ?";

  
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to delete video" });
    }
    
    // 204 No Content is standard for successful deletes
    res.status(204).end();
  });
};

const updateVideo = (req, res) => {
  const { id } = req.params;
  const { title, url, course_id } = req.body;

  const sql = "UPDATE videos SET title = ?, url = ?, course_id = ? WHERE id = ?";
  db.query(sql, [title, url, course_id, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Video updated successfully" });
  });
};


const getVideosByCourse = (req, res) => {
  const courseId = req.params.id;

  db.query('SELECT * FROM videos WHERE course_id = ?', [courseId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch videos", error: err });
    }
    res.json(results);
  });
};


module.exports = {
  uploadVideo,
  addYouTubeLink,
  getVideos,
  deleteVideo,
  updateVideo,
  getVideosByCourse
};