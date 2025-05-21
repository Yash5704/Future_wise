import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { FaEnvelope, FaLock, FaCheck, FaTimes } from 'react-icons/fa';
import '../../style files/settings.css';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/user/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEmail(res.data.email);
      } catch (err) {
        setMessage({ text: 'Error fetching settings', type: 'error' });
        console.error('Error fetching settings:', err);
      }
    };
    
    fetchUserSettings();
  }, []);

  const handleChangeEmail = async () => {
    if (!newEmail || newEmail === email) {
      setMessage({ text: 'Please enter a new email address', type: 'error' });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch("http://localhost:5001/api/user/update-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ newEmail })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setMessage({ text: data.message || 'OTP sent to your new email', type: 'success' });
      setShowOtpModal(true);
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setMessage({ text: 'Please enter a valid OTP', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5001/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ userId, otp })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      setMessage({ text: data.message || 'Email updated successfully', type: 'success' });
      setShowOtpModal(false);
      setEmail(newEmail);
      setNewEmail('');
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }

    const strength = 
      (password.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(password) ? 1 : 0) +
      (/\d/.test(password) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

    if (strength < 2) setPasswordStrength('Weak');
    else if (strength < 4) setPasswordStrength('Medium');
    else setPasswordStrength('Strong');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const changePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ text: 'Please fill all password fields', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/user/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setMessage({ text: 'Password changed successfully', type: 'success' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Password change failed', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h2 className="settings-title">Account Settings</h2>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.type === 'success' ? <FaCheck /> : <FaTimes />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="settings-section">
          <h3 className="section-title">
            <FaEnvelope className="section-icon" />
            Email Settings
          </h3>
          
          <div className="form-group">
            <label>Current Email</label>
            <div className="current-email">{email}</div>
          </div>

          <div className="form-group">
            <label htmlFor="newEmail">New Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                id="newEmail"
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleChangeEmail} 
            className="update-btn"
            disabled={isLoading || !newEmail || newEmail === email}
          >
            {isLoading ? 'Updating...' : 'Update Email'}
          </button>
        </div>

        <div className="divider"></div>

        <div className="settings-section">
          <h3 className="section-title">
            <FaLock className="section-icon" />
            Password Settings
          </h3>

          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="currentPassword"
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            {passwordStrength && (
              <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Password Strength: {passwordStrength}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
            {passwordForm.newPassword && passwordForm.confirmPassword && (
              <div className="password-match">
                {passwordForm.newPassword === passwordForm.confirmPassword ? (
                  <span className="match"><FaCheck /> Passwords match</span>
                ) : (
                  <span className="no-match"><FaTimes /> Passwords don't match</span>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={changePassword} 
            className="update-btn"
            disabled={isLoading || 
              !passwordForm.currentPassword || 
              !passwordForm.newPassword || 
              !passwordForm.confirmPassword ||
              passwordForm.newPassword !== passwordForm.confirmPassword}
          >
            {isLoading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </div>

      {showOtpModal && (
        <div className="otp-modal-overlay">
          <div className="otp-modal">
            <h3>Verify Your Email</h3>
            <p>We've sent a verification code to <strong>{newEmail}</strong></p>
            
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength="6"
              />
            </div>

            <div className="otp-actions">
              <button 
                onClick={handleVerifyOtp} 
                className="verify-btn"
                disabled={isLoading || !otp || otp.length < 4}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
              <button 
                onClick={() => setShowOtpModal(false)} 
                className="cancel-btn"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>

            <p className="resend-otp">
              Didn't receive code? <button className="resend-link">Resend OTP</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;