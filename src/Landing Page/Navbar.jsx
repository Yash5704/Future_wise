import { useState,useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaHome, FaList, FaPlay, FaUser, FaSignInAlt, FaChalkboardTeacher, FaUsers, FaBook, FaBars, FaTimes,FaStar } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import "../style-files/navbar.css";

function Navbar() {
    const [isPremium, setIsPremium] = useState(false);
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("isPremium");
        window.location.href = "/login";
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    useEffect(() => {
        const premiumStatus = localStorage.getItem("isPremium");
        setIsPremium(premiumStatus === "true");
    }, []); // this runs once when the component mounts

return (
    <header className="navbar">
        <div className="navbar-container">
            <div className="logo-and-hamburger">
                <Link to="/" className="logo-link">
                    <span className="logo-text">FutureWise</span>
                </Link>
                
                <button className="hamburger-btn" onClick={toggleMobileMenu}>
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            <nav className={`navigation ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>
                <ul className="nav-list">
                    {role === "admin" ? (
                        <>
                            <li className="nav-item">
                                <NavLink to="/admin/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                    <FaChalkboardTeacher className="nav-icon" />
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/admin/AdminUsers" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                    <FaUsers className="nav-icon" />
                                    <span>Users</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/admin/courses" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                    <FaBook className="nav-icon" />
                                    <span>Courses</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/admin/AdminVideoManager" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                    <FaPlay className="nav-icon" />
                                    <span>Video Management</span>
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link" end onClick={() => setMobileMenuOpen(false)}>
                                    <FaHome className="nav-icon" />
                                    <span>Home</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/PublicCourses" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                    <FaChalkboardTeacher className="nav-icon" />
                                    <span>Courses</span>
                                </NavLink>
                            </li>
                            {token && isPremium && (
                                <li className="nav-item">
                                    <NavLink to="/videos" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                        <FaPlay className="nav-icon" />
                                        <span>Videos</span>
                                    </NavLink>
                                </li>
                            )}
                            {token && !isPremium && (
                                <li className="nav-item">
                                    <NavLink
                                        className="upgrade-button"
                                        onClick={() => {
                                            window.location.href = "/upgrade";
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <FaStar className="nav-icon" />
                                    <span> Upgrade Premium</span>
                                    </NavLink>
                                </li>
                            )}
                            {token && isPremium && ( 
                                <li className="nav-item">
                                    <div className="upgrade-button">
                                        <FaStar className="nav-icon" />
                                        <span> Premium</span>
                                    </div>
                                </li>
                            )}
                        </>
                    )}
                </ul>
            </nav>

            <div className={`auth-section ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>
                {userId ? (
                    <>
                        <NavLink to={`/profile/${userId}`} className="profile-link" onClick={() => setMobileMenuOpen(false)}>
                            <FaUser className="nav-icon" />
                            <span>Profile</span>
                        </NavLink>
                        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="logout-button">
                            <FiLogOut className="nav-icon" />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <NavLink to="/login" className="login-link" onClick={() => setMobileMenuOpen(false)}>
                        <FaSignInAlt className="nav-icon" />
                        <span>Login</span>
                    </NavLink>
                )}
            </div>
        </div>
    </header>
);

}

export default Navbar;