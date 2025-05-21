import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FiUsers, FiBook, FiLoader, FiAlertCircle } from "react-icons/fi";
import "../../style files/analytics.css";

const Analytics = () => {
  const [stats, setStats] = useState({ 
    users: 0, 
    courses: 0,
    students: 0,
    faculty: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const [usersRes, coursesRes] = await Promise.all([
          fetch("http://localhost:5001/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5001/api/courses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!usersRes.ok || !coursesRes.ok) {
          throw new Error("Failed to fetch analytics data.");
        }

        const usersData = await usersRes.json();
        const coursesData = await coursesRes.json();

        const students = usersData.filter(user => user.role === "user").length;
        const faculty = usersData.filter(user => user.role === "admin").length;

        setStats({ 
          users: usersData.length, 
          courses: coursesData.length,
          students,
          faculty
        });
      } catch (err) {
        setError("Failed to load analytics data. Please try again later.");
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const userPieData = [
    { name: "Students", value: stats.students },
    { name: "Faculty", value: stats.faculty },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>Platform Analytics</h1>
        <p className="subtitle">Overview of your platform statistics</p>
      </header>

      {loading ? (
        <div className="loading-state">
          <FiLoader className="loading-icon" />
          <p>Loading analytics data...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <FiAlertCircle className="error-icon" />
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card users-stat">
              <div className="stat-icon">
                <FiUsers />
              </div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.users}</p>
                <p className="stat-description">Registered platform users</p>
              </div>
            </div>

            <div className="stat-card courses-stat">
              <div className="stat-icon">
                <FiBook />
              </div>
              <div className="stat-content">
                <h3>Total Courses</h3>
                <p className="stat-value">{stats.courses}</p>
                <p className="stat-description">Available courses</p>
              </div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <h3>User Distribution</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {userPieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} users`, value === 1 ? "User" : "Users"]}
                    />
                    <Legend 
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;