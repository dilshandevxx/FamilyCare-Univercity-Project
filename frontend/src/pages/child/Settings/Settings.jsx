import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2,
  AlertOctagon, LifeBuoy, Bell, Settings as SettingsIcon, AlertCircle, HelpCircle
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './Settings.css';

const Settings = () => {
  // Profile State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+1 (800) 234-5678'); // Mock phone
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Privacy State
  const [publicVisibility, setPublicVisibility] = useState(true);
  const [shareHealthData, setShareHealthData] = useState(true);
  const [emergencyAccess, setEmergencyAccess] = useState(false);

  // Notification State
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [caregiverUpdates, setCaregiverUpdates] = useState(true);
  const [dailyReports, setDailyReports] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // UI States
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Profile details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/users/profile');
        setName(data.name || '');
        setEmail(data.email || '');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setErrorMsg('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Update Profile & Toggles (Save Changes)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setErrorMsg('');
      setSuccessMsg('');

      await api.put('/users/profile', {
        name,
        email
      });

      setSuccessMsg('Account settings updated successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  // Update Password only
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setErrorMsg('Please provide both current and new password.');
      return;
    }

    try {
      setUpdating(true);
      setErrorMsg('');
      setSuccessMsg('');

      await api.put('/users/profile', {
        currentPassword,
        newPassword
      });

      setSuccessMsg('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error updating password:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setUpdating(false);
    }
  };

  // Delete Account trigger
  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.'
    );
    if (confirmed) {
      alert('Delete Account request triggered. Please contact support to complete this operation.');
    }
  };

  return (
    <ChildLayout title="Settings">
      <div className="se-container">

        {/* HEADER TOP BAR */}
        <div className="se-header-row">
          <div className="se-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span className="se-bc-separator">&gt;</span>
            <span className="se-bc-active">Settings</span>
          </div>

          <div className="se-header-search">
            <input type="text" placeholder="Search settings..." />
            <div className="se-header-icons">
              <button className="se-h-icon-btn"><Bell size={18} /></button>
              <button className="se-h-icon-btn"><ShieldCheck size={18} /></button>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Family" alt="avatar" className="se-user-avatar" />
            </div>
          </div>
        </div>

        {/* PAGE TITLE */}
        <h2 className="se-page-title">Account Settings</h2>
        <p className="se-page-subtitle">
          Manage your profile, security preferences, and health notification rules.
        </p>

        {/* FEEDBACK BANNER */}
        {successMsg && (
          <div className="se-feedback-banner success">
            <CheckCircle2 size={16} /> <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="se-feedback-banner error">
            <AlertCircle size={16} /> <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="se-loader">Loading profile settings...</div>
        ) : (
          /* TWO COLUMN SETTINGS GRID */
          <div className="se-grid">
            
            {/* COLUMN 1 - MAIN SETTINGS FORM */}
            <form onSubmit={handleSaveProfile} className="se-main-column">
              
              {/* Profile Information Panel */}
              <div className="se-panel">
                <div className="se-panel-profile-header">
                  <div className="se-avatar-container">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Julian" 
                      alt="Profile Avatar" 
                      className="se-profile-pic"
                    />
                  </div>
                  <div>
                    <h3 className="se-panel-title">Profile Information</h3>
                    <p className="se-panel-subtitle-text">
                      Update your personal details. Let's keep others up to date.
                    </p>
                  </div>
                </div>

                <div className="se-panel-fields">
                  <div className="se-field">
                    <label>Full Name</label>
                    <div className="se-input-wrapper">
                      <User size={16} className="se-field-icon" />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Julian Henderson"
                        required
                      />
                    </div>
                  </div>

                  <div className="se-field">
                    <label>Email Address</label>
                    <div className="se-input-wrapper">
                      <Mail size={16} className="se-field-icon" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="julian.h@familycare.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="se-field">
                    <label>Phone Number</label>
                    <div className="se-input-wrapper">
                      <Phone size={16} className="se-field-icon" />
                      <input 
                        type="text" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (800) 234-5678"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Authentication Panel */}
              <div className="se-panel">
                <h3 className="se-panel-title">Security & Authentication</h3>
                <p className="se-panel-subtitle-text">
                  Keep your account secure with regular password updates.
                </p>

                <div className="se-panel-fields row">
                  <div className="se-field">
                    <label>Current Password</label>
                    <div className="se-input-wrapper">
                      <Lock size={16} className="se-field-icon" />
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="se-field">
                    <label>New Password</label>
                    <div className="se-input-wrapper">
                      <Lock size={16} className="se-field-icon" />
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleUpdatePassword} 
                  className="se-update-pwd-btn"
                  disabled={updating}
                >
                  Update Password
                </button>
              </div>

              {/* Privacy & Transparency Panel */}
              <div className="se-panel">
                <h3 className="se-panel-title">Privacy & Transparency</h3>
                
                <div className="se-toggle-item">
                  <div className="se-toggle-label">
                    <span className="se-toggle-title">Public Visibility</span>
                    <span className="se-toggle-desc">
                      Allow certified caregivers to view your basic profile information.
                    </span>
                  </div>
                  <label className="se-switch">
                    <input 
                      type="checkbox" 
                      checked={publicVisibility}
                      onChange={(e) => setPublicVisibility(e.target.checked)}
                    />
                    <span className="se-slider"></span>
                  </label>
                </div>

                <div className="se-toggle-item">
                  <div className="se-toggle-label">
                    <span className="se-toggle-title">Share Health Data</span>
                    <span className="se-toggle-desc">
                      Automatically share critical vitals history with primary caregiver.
                    </span>
                  </div>
                  <label className="se-switch">
                    <input 
                      type="checkbox" 
                      checked={shareHealthData}
                      onChange={(e) => setShareHealthData(e.target.checked)}
                    />
                    <span className="se-slider"></span>
                  </label>
                </div>

                <div className="se-toggle-item">
                  <div className="se-toggle-label">
                    <span className="se-toggle-title">Emergency Access</span>
                    <span className="se-toggle-desc">
                      Grant temporary access to health history during emergency cases.
                    </span>
                  </div>
                  <label className="se-switch">
                    <input 
                      type="checkbox" 
                      checked={emergencyAccess}
                      onChange={(e) => setEmergencyAccess(e.target.checked)}
                    />
                    <span className="se-slider"></span>
                  </label>
                </div>
              </div>

              {/* Danger Zone Panel */}
              <div className="se-panel border-danger">
                <div className="se-danger-row">
                  <div>
                    <h3 className="se-panel-title text-danger">Danger Zone</h3>
                    <p className="se-panel-subtitle-text no-margin">
                      Permanently delete your account and all associated health history.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleDeleteAccount} 
                    className="se-delete-btn"
                  >
                    Delete My Account
                  </button>
                </div>
              </div>

              {/* Save changes footer submit */}
              <div className="se-submit-row">
                <button type="submit" className="se-save-changes-btn" disabled={updating}>
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>

            {/* COLUMN 2 - SIDEBAR INFO PANELS */}
            <div className="se-sidebar-column">
              
              {/* Membership Status Card */}
              <div className="se-widget teal-bg">
                <span className="se-widget-lbl white-text">MEMBERSHIP STATUS</span>
                <h3 className="se-widget-title white-text">Child Role</h3>
                
                <span className="se-badge-pill">
                  Managed Account
                </span>

                <p className="se-widget-text white-text">
                  Your account details are managed by <span className="bold">Sarah Henderson</span>. Some administrative actions require parental approval.
                </p>
              </div>

              {/* Notification Preferences Panel */}
              <div className="se-widget">
                <span className="se-widget-lbl">Notifications</span>
                
                <div className="se-toggle-item mini">
                  <span className="se-toggle-title-mini">Health Alerts</span>
                  <label className="se-switch">
                    <input 
                      type="checkbox" 
                      checked={healthAlerts}
                      onChange={(e) => setHealthAlerts(e.target.checked)}
                    />
                    <span className="se-slider"></span>
                  </label>
                </div>

                <div className="se-toggle-item mini">
                  <span className="se-toggle-title-mini">Caregiver Updates</span>
                  <label className="se-switch">
                    <input 
                      type="checkbox" 
                      checked={caregiverUpdates}
                      onChange={(e) => setCaregiverUpdates(e.target.checked)}
                    />
                    <span className="se-slider"></span>
                  </label>
                </div>

                <div className="se-toggle-item mini">
                  <span className="se-toggle-title-mini">Daily Reports</span>
                  <label className="se-switch">
                    <input 
                      type="checkbox" 
                      checked={dailyReports}
                      onChange={(e) => setDailyReports(e.target.checked)}
                    />
                    <span className="se-slider"></span>
                  </label>
                </div>

                <div className="se-toggle-item mini">
                  <span className="se-toggle-title-mini">SMS Alerts</span>
                  <label className="se-switch">
                    <input 
                      type="checkbox" 
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                    />
                    <span className="se-slider"></span>
                  </label>
                </div>
              </div>

              {/* Help & Support Widget */}
              <div className="se-widget light-yellow-bg">
                <div className="se-help-hdr">
                  <HelpCircle size={16} className="yellow-text" />
                  <span className="se-widget-lbl yellow-text no-margin">Need help with permissions?</span>
                </div>
                
                <p className="se-widget-text yellow-text">
                  Contact a family administrator to request change of permissions or to transfer ownership.
                </p>

                <a href="#help" className="se-help-link">
                  Visit Help Docs
                </a>
              </div>

            </div>

          </div>
        )}

      </div>
    </ChildLayout>
  );
};

export default Settings;
