import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../style files/PublicCourse.css'

export default function PublicCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
    if (!token) {
      navigate('/login'); // Adjust to your login route
    } else {
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get('/api/courses');
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [...new Set(courses.map(course => course.category))];
  const filteredCourses = selectedCategory
    ? courses.filter(course => course.category === selectedCategory)
    : courses;

  
  return (
    <div className="public-courses-container">
      <header className="courses-header">
        <h1>Explore Courses</h1>
        <p>Browse our collection of available courses</p>
      </header>

      <div className="filter-bar">
        <label htmlFor="category-filter">Filter by Category: </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          disabled={isLoading}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {error && (
          <button 
            className="refresh-button"
            onClick={fetchCourses}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Try Again'}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="empty-state">
          <p>No courses found{selectedCategory ? ` in ${selectedCategory}` : ''}.</p>
        </div>
      ) : (
        <div className="course-grid">
          {filteredCourses.map(course => (
            <div className="course-card" key={course.id}>
              <div className="course-image">
                {course.imageUrl ? (
                  <img src={course.imageUrl } alt={course.name} />
                ) : (
                  <div className="image-placeholder"></div>
                )}
              </div>
              <div className="course-content">
                <h3>{course.name}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span><strong>Duration:</strong> {course.duration} Week</span>
                  <span className="category-badge">{course.category}</span>
                </div>
                <button className="view-course-button" onClick={() => navigate(`/courses/${course.id}/`)}>
                  View Course Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}