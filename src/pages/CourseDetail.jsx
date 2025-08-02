import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaYoutube, FaFileVideo, FaRegClock } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import "../style-files/courseDetail.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVideo, setActiveVideo] = useState(0);
  const [videoError, setVideoError] = useState(null);
  const isPremium = localStorage.getItem("isPremium") === "true";
  const role = localStorage.getItem("role");
  const hasAccess = role === "admin" || isPremium;

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // Fetch course details
        const courseResponse = await axios.get(`${apiBaseUrl}/api/courses/${id}`);
        setCourse(courseResponse.data);
        
        // Fetch videos for this course
        const videosResponse = await axios.get(`${apiBaseUrl}/api/courses/${id}/videos`);
        setVideos(videosResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId 
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` 
      : url;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getVideoUrl = (url) => {
    if (!url) return '';
    // Handle relative paths
    if (url.startsWith('/uploads/')) {
      return `${apiBaseUrl}${url}`;
    }
    // Handle full URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Handle potential malformed URLs
    return `${apiBaseUrl}/uploads/${url}`;
  };

  const getVideoType = (url) => {
    if (!url) return 'mp4';
    const extension = url.split('.').pop().split(/[#?]/)[0].toLowerCase();
    switch(extension) {
      case 'mov': return 'quicktime';
      case 'webm': return 'webm';
      case 'ogg': return 'ogg';
      default: return 'mp4';
    }
  }

  const handleVideoError = (e) => {
    console.error("Video playback error:", e.target.error);
    setVideoError("Failed to play video. The format may not be supported.");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <ImSpinner8 className="spinner" />
        <p>Loading course content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <MdErrorOutline className="error-icon" />
        <h3>Error loading course</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
        <button onClick={() => navigate("/PublicCourses")} className="back-button">
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <FaArrowLeft /> Back
      </button>

      {course && (
        <header className="course-header">
          <h1>{course.title}</h1>
          <p className="course-description">{course.description}</p>
          <div className="course-meta">
            <span className="meta-item">
              <FaFileVideo /> {videos.length} {videos.length === 1 ? "video" : "videos"}
            </span>
            {course.totalDuration && (
              <span className="meta-item">
                <FaRegClock /> {formatDuration(course.totalDuration)} total
              </span>
            )}
          </div>
        </header>
      )}

      {videos.length === 0 ? (
        <div className="empty-state">
          <p>No videos available for this course yet.</p>
          <p>Check back later or contact the instructor.</p>
        </div>
      ) : (
        <div className="video-content">
          <div className="video-player-container">
            {hasAccess ? (
              videos[activeVideo]?.type === "youtube" ? (
                <div className="video-responsive">
                  <iframe
                    src={getEmbedUrl(videos[activeVideo]?.url)}
                    title={videos[activeVideo]?.title || "Course video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>
              ) : (
                <div className="video-player-wrapper">
                  <video
                    controls
                    autoPlay
                    playsInline
                    controlsList = "nodownload"
                    key={videos[activeVideo]?.url}
                    onError={handleVideoError}
                    onCanPlay={() => setVideoError(null)}
                  >
                    <source 
                      src={getVideoUrl(videos[activeVideo]?.url)} 
                      type={`video/${getVideoType(videos[activeVideo]?.url)}`}
                    />
                    Your browser does not support HTML5 video.
                  </video>
                  {videoError && (
                    <div className="video-error">
                      <MdErrorOutline />
                      <span>{videoError}</span>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="locked-content">
                <p>This is a premium video. Please upgrade to access.</p>
                <button onClick={() => navigate("/upgrade")} className="pay-button">
                  Upgrade Now
                </button>
              </div>
            )}
            <div className="current-video-info">
              <h2>{videos[activeVideo]?.title || "Untitled Video"}</h2>
              <p>{videos[activeVideo]?.description || ""}</p>
              {/* {videos[activeVideo]?.duration && (
                <span className="video-duration">
                  <FaRegClock /> {formatDuration(videos[activeVideo].duration)}
                </span>
              )} */}
            </div>
          </div>

          <div className="video-list-container">
            <h3>Course Videos</h3>
            <div className="video-list">
              {videos.map((video, index) => (
                <div
                  key={video.id || index}
                  className={`video-item ${index === activeVideo ? "active" : ""}`}
                  onClick={() => setActiveVideo(index)}
                >
                  <div className="video-thumbnail">
                    {video.type === "youtube" ? (
                      <FaYoutube className="youtube-icon" />
                    ) : (
                      <FaFileVideo className="video-icon" />
                    )}
                  </div>
                  <div className="video-details">
                    <h4>{video.title || "Untitled Video"}</h4>
                    {/* {video.duration && (
                      <span className="duration">{formatDuration(video.duration)}</span>
                    )} */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}