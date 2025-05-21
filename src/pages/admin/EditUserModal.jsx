import React from "react";
import { FiX, FiUser, FiMail, FiLock } from "react-icons/fi";
import "../../style files/EditUserModal.css";

const EditUserModal = ({ user, onChange, onSave, onCancel, loading = false }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...user, [name]: value });
  };

  return (
    <div className="edit-user-modal">
      <div className="modal-overlay" onClick={onCancel}></div>
      
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit User</h2>
          <button onClick={onCancel} className="close-button">
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
              <FiUser className="input-icon" />
            <label>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Enter user's name"
            />
          </div>

          <div className="form-group">
              <FiMail className="input-icon" />
            <label>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter user's email"
            />
          </div>

          <div className="form-group">
              <FiLock className="input-icon" />
            <label>
              Role
            </label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="role-select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={onCancel}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="save-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;