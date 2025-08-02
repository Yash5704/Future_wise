import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUsers, FiBook, FiVideo, FiSettings, FiPieChart } from "react-icons/fi";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import "./../../style-files/adminDashboard.css";


function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, students: 0, faculty: 0, courses: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userRes, courseRes] = await Promise.all([
          fetch("/api/users", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("/api/courses", {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        if (!userRes.ok || !courseRes.ok) {
          throw new Error("Failed to fetch data from server");
        }

        const users = await userRes.json();
        const courses = await courseRes.json();

        const students = users.filter(user => user.role === "user").length;
        const faculty = users.filter(user => user.role === "admin").length;

        setStats({
          users: users.length,
          students,
          faculty,
          courses: courses.length,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          {/* <button onClick={handleLogout} className="logout-button">
            <FiLogOut className="logout-icon" />
            <span>Logout</span>
          </button> */}
        </div>
      </header>

      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav>
            <ul>
              <li>
                <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? "active" : ""}>
                  <FiPieChart className="nav-icon" />
                  <span>Analytics</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/AdminUsers" className={({ isActive }) => isActive ? "active" : ""}>
                  <FiUsers className="nav-icon" />
                  <span>User Management</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/courses" className={({ isActive }) => isActive ? "active" : ""}>
                  <FiBook className="nav-icon" />
                  <span>Course Management</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/AdminVideoManager" className={({ isActive }) => isActive ? "active" : ""}>
                  <FiVideo className="nav-icon" />
                  <span>Video Management</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/payments" className={({ isActive }) => isActive ? "active" : ""}>
                  <FiSettings className="nav-icon" />
                  <span>Payment Approvals</span>
                </NavLink>
              </li>

              {/* <li>
                <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
                  <FiSettings className="nav-icon" />
                  <span>Settings</span>
                </NavLink>
              </li> */}
            </ul>
          </nav>
        </aside>

        <main className="dashboard-main">
          <section className="welcome-section">
            <h2>Welcome back, Admin!</h2>
            <p className="welcome-message">Here's an overview of your platform statistics</p>
          </section>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading statistics...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-icon">!</div>
              <p className="error-message">Error: {error}</p>
            </div>
          ) : (
            <div className="stats-grid">
              <div className="stats-card total-users">
                <div className="stats-icon">
                  <FiUsers />
                </div>
                <div className="stats-info">
                  <h3>Total Users</h3>
                  <span className="stats-value">{stats.users}</span>
                </div>
              </div>
              <div className="stats-card students">
                <div className="stats-icon">
                  <FaUserGraduate />
                </div>
                <div className="stats-info">
                  <h3>Students</h3>
                  <span className="stats-value">{stats.students}</span>
                </div>
              </div>
              <div className="stats-card faculty">
                <div className="stats-icon">
                  <FaChalkboardTeacher />
                </div>
                <div className="stats-info">
                  <h3>Admin</h3>
                  <span className="stats-value">{stats.faculty}</span>
                </div>
              </div>
              <div className="stats-card courses">
                <div className="stats-icon">
                  <FiBook />
                </div>
                <div className="stats-info">
                  <h3>Courses</h3>
                  <span className="stats-value">{stats.courses}</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;