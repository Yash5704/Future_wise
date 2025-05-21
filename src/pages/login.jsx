import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { FaEye, FaEyeSlash, FaLock, FaHome } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import "../style files/loginpage.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "user"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("role", data.role);
            localStorage.setItem("isPremium", data.isPremium ? "true" : "false");

            if (data.message === "OTP sent to email") {
                navigate(`/verify-otp/${data.userId}`);
            } else {
                navigate(data.role === 'admin' ? "/admin/dashboard" : "/profile/" + data.userId);
                window.location.reload();
            }

        } catch (err) {
            setError(err.message);
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="form-container">
                    <div className="login-header">
                        <h1>Welcome Back</h1>
                        <p>Please enter your credentials to login</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-field">
                                <FiMail className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-field">
                                <FaLock className="input-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* <div className="input-group">
                            <label htmlFor="role">Login As</label>
                            <div className="input-field">
                                <FaUser className="input-icon" />
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="role-select"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div> */}

                        {/* <div className="forgot-password">
                            <NavLink to="/forgot-password">Forgot Password?</NavLink>
                        </div> */}

                        <button type="submit" className="login-button" disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an account? <NavLink to="/signup">Sign Up</NavLink></p>
                        <NavLink to="/" className="home-link">
                            <FaHome className="home-icon" />
                            Return to Home
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;