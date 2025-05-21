import { useState } from "react";
import axios from "axios";
import './../style files/DeleteProfileButton.css';

const DeleteProfileButton = ({ userId }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete profile.");
    }
  };

  return (
    <div className="delete-profile-container">
      {!showConfirm ? (
        <button onClick={() => setShowConfirm(true)} className="danger-button">
          🗑️ Delete My Profile
        </button>
      ) : (
        <div className="confirm-modal">
          <p className="confirm-text">
            ⚠️ Are you sure you want to delete your profile? This action is <strong>irreversible</strong>.
          </p>
          <div className="confirm-actions">
            <button onClick={handleDelete} className="confirm-delete">
              Yes, Delete
            </button>
            <button onClick={() => setShowConfirm(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteProfileButton;
