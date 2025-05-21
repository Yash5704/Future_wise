import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaChalkboardTeacher, FaLaptopCode, FaComments, FaCalendarAlt, FaUsers, FaBookOpen } from "react-icons/fa";
import "../style files/homepage.css"; // Adjust the path as necessary

function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  
  const handleStartLearning = () => {
    if (isAuthenticated) {
      navigate("/PublicCourses");   
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Empowering Students to Succeed in Tech</h1>
          <p className="hero-subtitle">Access high-quality educational videos and resources for IT professionals</p>
          <button className="cta-button" onClick={handleStartLearning}>
            Start Learning Now
            <FaGraduationCap className="cta-icon" />
          </button>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="featured-section">
        <h2 className="section-title">Featured Courses</h2>
        <div className="course-grid">
          <div className="course-card" >
            <FaLaptopCode className="course-icon" />
            <h3>IT Fundamentals</h3>
            <p>Master the essential concepts of Information Technology</p>
          </div>
          <div className="course-card" >
            <FaLaptopCode className="course-icon" />
            <h3>Programming Basics</h3>
            <p>Learn core programming concepts across multiple languages</p>
          </div>
          <div className="course-card" >
            <FaLaptopCode className="course-icon" />
            <h3>Web Development</h3>
            <p>Build modern websites with HTML, CSS, and JavaScript</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h2 className="section-title">Why Learn With Us?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <FaChalkboardTeacher className="benefit-icon" />
            <h3>Expert Instructors</h3>
            <p>Learn from industry professionals with real-world experience</p>
          </div>
          <div className="benefit-card">
            <FaLaptopCode className="benefit-icon" />
            <h3>Interactive Content</h3>
            <p>Engaging videos, exercises, and hands-on projects</p>
          </div>
          <div className="benefit-card">
            <FaGraduationCap className="benefit-icon" />
            <h3>Flexible Learning</h3>
            <p>Study at your own pace, anytime and anywhere</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Students Say</h2>
        <div className="testimonial-card">
          <FaComments className="testimonial-icon" />
          <blockquote>
            "This platform completely transformed my learning experience! The IT courses helped me land my first tech job."
          </blockquote>
          <p className="testimonial-author">- Sarah K., Junior Developer</p>
        </div>
      </section>

      {/* Current Offerings */}
      <section className="offerings-section">
          <h2 className="section-title">Current Course Offerings</h2>
        <div className="offerings-content">
          <FaBookOpen className="section-icon" />
          <p>
            Currently, we specialize in IT-related courses with carefully curated content. 
            Based on user feedback, we're actively working to expand our course catalog 
            to include more tech specializations in the near future.
          </p>
        </div>
      </section>

      {/* Community CTA */}
      <section className="community-section">
        <div className="community-content">
          <FaUsers className="section-icon" />
          <h2 className="section-title">Join Our Learning Community</h2>
          <p>
            Connect with fellow learners, ask questions, and share knowledge in our 
            growing community forums.
          </p>
          <button className="secondary-button">
            Explore Community
          </button>
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="upcoming-section">
          <h2 className="section-title">Coming Soon</h2>
        <div className="upcoming-content">
          <FaCalendarAlt className="section-icon" />
          <ul className="upcoming-list">
            <li>New courses in Cybersecurity and Data Science</li>
            <li>Interactive coding challenges</li>
            <li>Personalized learning paths</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default HomePage;