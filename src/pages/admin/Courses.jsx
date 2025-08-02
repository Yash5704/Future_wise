import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus, FiLoader } from 'react-icons/fi';
import '../../style-files/Courses.css';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '',
    duration: '',
    category: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setFetching(true);
      const res = await axios.get('http://localhost:5001/api/courses');
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setCourses([]);
      showMessage('Failed to load courses', 'error');
    } finally {
      setFetching(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category) {
      showMessage('Name, description, and category are required', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:5001/api/courses/${editingId}`, formData);
        showMessage('Course updated successfully', 'success');
      } else {
        await axios.post('/api/courses', formData);
        showMessage('Course added successfully', 'success');
      }
      resetForm();
      fetchCourses();
    } catch (err) {
      console.error('Submission failed:', err);
      const errorMsg = err.response?.data?.message || 'An error occurred';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      description: '',
      duration: '',
      category: 'Programming'
    });
    setEditingId(null);
  };

  const handleEdit = (course) => {
    setFormData({
      name: course.name,
      description: course.description,
      duration: course.duration || '',
      category: course.category || ''
    });
    setEditingId(course.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');  // Retrieve token
    console.log('Token:', token);  // Check if the token is retrieved correctly
  
    if (!token) {
      console.error('No token found, cannot delete');
      showMessage('Please log in to delete courses', 'error');
      return;
    }
  
    if (!window.confirm('Are you sure you want to delete this course?')) return;
  
    try {
      const response = await axios.delete(`http://localhost:5001/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`  // Send token in headers
        }
      });
  
      console.log('Response from server:', response);
      showMessage('Course deleted successfully', 'success');
      fetchCourses();  // Fetch updated list of courses
    } catch (err) {
      console.error('Delete failed:', err);
      showMessage('Failed to delete course', 'error');
    }
  };
  
  
  

  return (
    <div className="courses-container">
      <h1 className="courses-header">Course Management</h1>
      <p className="courses-subtitle">Add, edit, and manage your courses</p>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="course-form">
        <h2 className="form-title">
          {editingId ? 'Edit Course' : 'Add New Course'}
        </h2>

        <div className="form-group">
          <label>Course Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter course name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            placeholder="Enter course description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading}
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              placeholder="e.g., 4 weeks"
              value={formData.duration}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Science">Science</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

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
                {editingId ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <FiPlus className="button-icon" />
                {editingId ? 'Update Course' : 'Add Course'}
              </>
            )}
          </button>
        </div>
      </form>

      <div className="courses-list-container">
        <h2 className="list-header">Available Courses</h2>
        
        {fetching ? (
          <div className="loading-state">
            <FiLoader className="loading-icon" />
            <p>Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <p className="no-courses">No courses available yet</p>
        ) : (
          <ul className="courses-list">
            {courses.map((course) => (
              <li key={course.id} className="course-item">
                <div className="course-info">
                  <h3>{course.name}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    {course.duration && (
                      <span className="meta-item">
                        <strong>Duration:</strong> {course.duration}
                      </span>
                    )}
                    {course.category && (
                      <span className="meta-item">
                        <strong>Category:</strong> {course.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="course-actions">
                  <button
                    onClick={() => handleEdit(course)}
                    className="edit-button"
                    disabled={loading}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="delete-button"
                    disabled={loading}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
