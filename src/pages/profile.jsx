import { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaSignOutAlt, FaUpload,FaHistory, FaSun, FaMoon, FaTwitter, FaLinkedin } from "react-icons/fa";
import {  FiSettings, } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import DeleteProfileButton from "./DeleteProfileButton";
import './../style files/profile.css';
import './../style files/settings.css';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", bio: "", twitter: "", linkedin: "" });
    const [darkMode, setDarkMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    

   const toggleDarkMode = () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5001/profile/${id}`);
                if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
                const data = await response.json();
                setUser(data);
                setFormData({
                    name: data.name,
                    email: data.email,
                    bio: data.bio || "",
                    twitter: data.twitter || "",
                    linkedin: data.linkedin || "",
                });
                if (data.isPremium) {
                    localStorage.setItem("isPremium", "true");
                }
            } catch (error) {
                console.error("Error fetching profile:", error.message);
                alert(error.message);
                navigate("/login");
            }
        };

        fetchProfile();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const response = await fetch(`http://localhost:5001/profile/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const updatedUser = await response.json();
            setUser(updatedUser);
            alert("Profile updated successfully!");
            setEditing(false);
        } else {
            alert("Update failed!");
        }

        console.log("Sending form data:", formData);
        console.log("Response status:", response.status);

    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Image size should be less than 2MB");
                return;
            }
            setSelectedFile(file);
            setSelectedImage(URL.createObjectURL(file));
            setShowImageModal(true);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedFile) {
            alert("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("profileImage", selectedFile);

        try {
            const response = await fetch(`http://localhost:5001/upload-profile/${id}`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setSelectedImage(null);
                setSelectedFile(null);
                setShowImageModal(false);
                alert("Profile picture updated successfully!");
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    if (!user) return (
        <div className="profile-loading">
            <div className="loading-spinner"></div>
        </div>
    );

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h1 className="profile-header-title"> Welcome {user.name}!</h1>
                    <div className="profile-header-actions">
                        <NavLink to="/settings" className="dark-mode-toggle">
                            <FiSettings className="dark-mode-icon" style={{fontSize: '2rem'}} />
                        {/* <span>Settings</span> */}
                        </NavLink>

                        <NavLink to="/payment-history" className="dark-mode-toggle">
                            <FaHistory className="dark-mode-icon" style={{fontSize: '2rem'}}/>
                            {/* <span>Payment History</span> */}
                        </NavLink>

                        <button
                            onClick={toggleDarkMode}
                            className="dark-mode-toggle"
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {darkMode ? <FaSun className="dark-mode-icon" /> : <FaMoon className="dark-mode-icon" />}
                        </button>
                    </div>
            </header>

            <main className="profile-main">
                <div className="profile-card">
                    <div className="profile-banner">
                        <div className="profile-image-container">
                            <div className="profile-image-wrapper">
                                <img
                                    src={selectedImage || user.profile_image || "https://placehold.co/150x150"}
                                    alt="Profile"
                                    className="profile-image"
                                    onError={(e) => e.target.src = "https://placehold.co/150x150"}
                                />
                                <label className="profile-upload-label">
                                    <FaUpload className="upload-icon" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="profile-upload-input"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="profile-content">
                        {editing ? (
                            <div className="edit-profile-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="form-input-readonly"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="3"
                                        className="form-textarea"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <FaTwitter className="social-icon twitter" /> Twitter
                                        </label>
                                        <input
                                            type="text"
                                            name="twitter"
                                            value={formData.twitter}
                                            onChange={handleChange}
                                            placeholder="https://twitter.com/username"
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            <FaLinkedin className="social-icon linkedin" /> LinkedIn
                                        </label>
                                        <input
                                            type="text"
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                            placeholder="https://linkedin.com/in/username"
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="cancel-button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        className="save-button"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="view-profile">
                                <div className="profile-header-section">
                                    <div>
                                        <h2 className="profile-name">{user.name}</h2>
                                        <p className="profile-email">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="edit-profile-button"
                                    >
                                        <FaEdit className="edit-icon" />
                                        Edit Profile
                                    </button>
                                </div>

                                {user.bio && (
                                    <div className="profile-bio-section">
                                        <h3 className="section-title">ABOUT</h3>
                                        <p className="profile-bio">{user.bio}</p>
                                    </div>
                                )}

                                <div className="profile-details-grid">
                                    <div className="profile-detail-section">
                                        <h3 className="section-title">JOINED</h3>
                                        <p className="detail-text">
                                        {user.created_at 
                                            ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                                            : "N/A"}
                                        </p>
                                    </div>

                                    <div className="profile-detail-section">
                                        <h3 className="section-title">SOCIAL LINKS</h3>
                                        <div className="social-links">
                                            {user.twitter && (
                                                <a 
                                                    href={user.twitter.startsWith('http') ? user.twitter : `https://twitter.com/${user.twitter}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="social-link twitter"
                                                >
                                                    <FaTwitter className="social-icon" />
                                                </a>
                                            )}
                                            {user.linkedin && (
                                                <a 
                                                    href={user.linkedin.startsWith('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="social-link linkedin"
                                                >
                                                    <FaLinkedin className="social-icon" />
                                                </a>
                                            )}
                                            {!user.twitter && !user.linkedin && (
                                                <p className="no-social-links">No social links added</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-actions">
                                    <button
                                        onClick={handleLogout}
                                        className="logout-button"
                                    >
                                        <FaSignOutAlt className="logout-icon" />
                                        Logout
                                    </button>

                                    <DeleteProfileButton userId={user.id} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {showImageModal && (
                <div className="image-modal-overlay">
                    <div className="image-modal">
                        <div className="modal-header">
                            <h3 className="modal-title">Update Profile Picture</h3>
                            <button 
                                onClick={() => setShowImageModal(false)}
                                className="modal-close-button"
                            >
                                <IoMdClose className="close-icon" />
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="image-preview-container">
                                <img 
                                    src={selectedImage} 
                                    alt="Preview" 
                                    className="image-preview"
                                />
                            </div>
                            <p className="image-preview-text">
                                This will be your new profile picture
                            </p>
                        </div>

                        <div className="modal-actions">
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="modal-cancel-button"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImageUpload}
                                className="modal-confirm-button"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;