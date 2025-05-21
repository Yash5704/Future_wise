const express = require("express");
const router = express.Router();
const {
    uploadVideo,
    addYouTubeLink,
    getVideos,
    deleteVideo,
    updateVideo,
    getVideosByCourse
} = require("../controllers/videoController");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

// Corrected routes
router.post("/upload", authenticateToken, isAdmin, upload.single('video'), uploadVideo);
router.post("/videos/youtube", authenticateToken, isAdmin, addYouTubeLink);
router.get("/videos", authenticateToken, getVideos);
router.delete("/videos/:id", authenticateToken, isAdmin, deleteVideo);
router.put("/videos/:id", authenticateToken, isAdmin, updateVideo);
router.get("/courses/:id/videos", authenticateToken, getVideosByCourse);

module.exports = router;