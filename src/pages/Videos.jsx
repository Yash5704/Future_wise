import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiChevronLeft, FiChevronRight, FiLoader, FiAlertCircle } from "react-icons/fi";
import { FaRegSadTear } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_API_URL;
import "../style-files/videos.css";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please log in to view videos");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/videos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { search: query, page },
        });
        setVideos(res.data.videos);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Failed to load videos", err);
        setError(err.response?.data?.message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // Handle various YouTube URL formats
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    return url;
  };

  return (
    <div className="videos-container">
      <header className="videos-header">
        <h1>Video Gallery</h1>
        <p>Browse and manage your video collection</p>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos by title..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading-state">
          <FiLoader className="loading-icon" />
          <p>Loading videos...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <FiAlertCircle className="error-icon" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="empty-state">
          <FaRegSadTear className="empty-icon" />
          <p>No videos found</p>
          {query && <p>Try a different search term</p>}
        </div>
      )}

      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-player">
              {video.type === "youtube" || video.url.includes("youtube") || video.url.includes("youtu.be") ? (
                <iframe
                  src={getEmbedUrl(video.url)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video width="320" height="240" controls controlsList="nodownload">
                  <source
                    src={
                      video.url.startsWith("http")
                        ? video.url
                        : `${BASE_URL}${video.url}`
                    }
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

              )}
            </div>
            <div className="video-info">
              <h3 className="video-title">{video.title}</h3>
              {video.description && (
                <p className="video-description">{video.description}</p>
              )}
              {video.duration && (
                <span className="video-meta">Duration: {video.duration}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="pagination-button"
          >
            <FiChevronLeft className="button-icon" />
            Previous
          </button>
          
          <div className="page-indicator">
            Page {page} of {totalPages}
          </div>
          
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="pagination-button"
          >
            Next
            <FiChevronRight className="button-icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Videos;