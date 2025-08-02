import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUpload, FiYoutube, FiEdit2, FiTrash2, FiLoader, FiX, FiCheck } from "react-icons/fi";
import "../../style-files/adminvideomanager.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Add this near your imports
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend URL
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const AdminVideoManager = () => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    type: "upload",
    course_id: ""
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Use the configured api instance instead of direct axios
      const res = await api.get("/videos");
      
      // Handle different possible response structures
      const videosData = Array.isArray(res.data) 
        ? res.data 
        : res.data?.videos 
        ? res.data.videos 
        : [];
      
      if (!videosData) {
        throw new Error("Invalid videos data format");
      }
      
      setVideos(videosData);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      
      // More detailed error handling
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to load videos";
      setError(errorMessage);
      setVideos([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
  try {
    const res = await api.get("/courses");
    // Handle different response formats
    const coursesData = Array.isArray(res.data) 
      ? res.data 
      : res.data?.courses || [];
    setCourses(coursesData);
  } catch (err) {
    console.error("Failed to fetch courses:", err);
    setError("Failed to load courses");
    setCourses([]); // Ensure it's always an array
  }
};

  useEffect(() => {
    fetchVideos();
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    
    if (!validTypes.includes(file?.type)) {
      showMessage("Only MP4, MOV, and AVI files are allowed", "error");
      e.target.value = "";
      return;
    }
    
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setVideoFile(file);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", url: "", type: "upload", course_id: "" });
    setVideoFile(null);
    setVideoPreview(null);
    setSelectedCourseId("");
    setEditingId(null);
  };

  const showMessage = (message, type) => {
    if (type === "error") {
      setError(message);
      setSuccess("");
    } else {
      setSuccess(message);
      setError("");
    }
    setTimeout(() => {
      if (type === "error") setError("");
      else setSuccess("");
    }, 5000);
  };

  const validateYouTubeURL = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return pattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.title) {
      showMessage("Title is required", "error");
      return;
    }
  
    if (!selectedCourseId) {
      showMessage("Please select a course", "error");
      return;
    }
  
    setLoading(true);
  
    try {
      formData.course_id = selectedCourseId;
  
      if (editingId) {
        await api.put(`/videos/${editingId}`, formData);
        showMessage("Video updated successfully", "success");
      } else if (formData.type === "youtube") {
        if (!validateYouTubeURL(formData.url)) {
          showMessage("Invalid YouTube URL format", "error");
          return;
        }
        await api.post("/videos/youtube", formData);
        showMessage("YouTube video added successfully", "success");
      } else {
        if (!videoFile) {
          showMessage("Video file is required", "error");
          return;
        }
        const uploadFormData = new FormData();
        uploadFormData.append("title", formData.title);
        uploadFormData.append("video", videoFile);
        uploadFormData.append("course_id", selectedCourseId);
  
        await api.post("/upload", uploadFormData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        showMessage("Video uploaded successfully", "success");
      }
  
      resetForm();
      fetchVideos();
    } catch (err) {
      console.error("Operation failed:", err);
      showMessage(err.response?.data?.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`${API_BASE_URL}/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage("Video deleted successfully", "success");
      fetchVideos();
    } catch (err) {
      console.error("Delete failed:", err);
      showMessage("Failed to delete video", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video) => {
    setFormData({
      title: video.title,
      url: video.type === "youtube" ? video.url : "",
      type: video.type
    });
    setSelectedCourseId(video.course_id);
    setEditingId(video.id);
  };

  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    return url;
  };

  return (
    <div className="video-manager-container">
      <header className="manager-header">
        <h1>Video Manager</h1>
        <p>Upload and manage your video content</p>
      </header>

      {error && (
        <div className="message error">
          <FiX className="message-icon" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="message success">
          <FiCheck className="message-icon" />
          <span>{success}</span>
        </div>
      )}

      <div className="form-container">
        <div className="form-tabs">
          <button
            className={`tab-button ${formData.type === "upload" ? "active" : ""}`}
            onClick={() => setFormData({ ...formData, type: "upload" })}
          >
            <FiUpload className="tab-icon" />
            Upload Video
          </button>
          <button
            className={`tab-button ${formData.type === "youtube" ? "active" : ""}`}
            onClick={() => setFormData({ ...formData, type: "youtube" })}
          >
            <FiYoutube className="tab-icon" />
            YouTube Link
          </button>
        </div>

        <form onSubmit={handleSubmit} className="video-form">
          <div className="form-group">
            <label>Video Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              required
              disabled={loading}
            />
          </div>

          {formData.type === "youtube" ? (
            <div className="form-group">
              <label>YouTube URL *</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                required
                disabled={loading}
              />
              <label>Assign to Course *</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select a course</option>
                {courses.length === 0 ? (
                  <option disabled>No courses available</option>
                ) : (
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label>Video File *</label>
              <div className="file-upload">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={loading || editingId}
                  required={!editingId}
                />
                <label htmlFor="video-upload">
                  {videoFile ? videoFile.name : "Choose a video file"}
                </label>
              </div>
              
              {videoPreview && (
                <div className="video-preview">
                  <video controls src={videoPreview} />
                </div>
              )}

              <label>Assign to Course *</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select a course</option>
                {courses.length === 0 ? (
                  <option disabled>No courses available</option>
                ) : (
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          <div className="form-actions">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="loading-icon" />
                  {editingId ? "Updating..." : "Submitting..."}
                </>
              ) : editingId ? (
                <>
                  <FiEdit2 className="button-icon" />
                  Update Video
                </>
              ) : formData.type === "youtube" ? (
                <>
                  <FiYoutube className="button-icon" />
                  Add YouTube Video
                </>
              ) : (
                <>
                  <FiUpload className="button-icon" />
                  Upload Video
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="videos-list-container">
        <h2 className="list-header">Your Videos</h2>
        
        {loading && videos.length === 0 ? (
          <div className="loading-state">
            <FiLoader className="loading-icon" />
            <p>Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <p className="no-videos">No videos available yet</p>
        ) : (
          <div className="videos-grid">
            {videos.map((video) => (
              <div key={video.id} className="video-card">
                <div className="video-player">
                  {video.type === "youtube" ? (
                    <iframe
                      src={getEmbedUrl(video.url)}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video controls>
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <div className="video-actions">
                    <button
                      onClick={() => handleEdit(video)}
                      className="edit-button"
                      disabled={loading}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="delete-button"
                      disabled={loading}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideoManager;
