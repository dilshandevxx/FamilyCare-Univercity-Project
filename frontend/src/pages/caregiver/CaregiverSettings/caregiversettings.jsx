import React, { useState } from 'react';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import { 
  User, Calendar, Bell, Shield, LogOut, CheckCircle2, 
  ChevronRight, Edit3, Zap, Lock 
} from 'lucide-react';
import './caregiverSettings.css';

const NavButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`settings-nav-btn ${active ? 'active' : ''}`}
  >
    <div className="nav-btn-content">
      {icon}
      <span>{label}</span>
    </div>
    {active && <ChevronRight size={16} />}
  </button>
);

const InputField = ({ label, defaultValue, type = "text", placeholder }) => (
  <div className="settings-input-group">
    <label>{label}</label>
    <input 
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
    />
  </div>
);

const ScheduleRow = ({ day, time, active }) => (
  <div className={`schedule-row ${active ? 'active' : ''}`}>
    <div className="schedule-day">
      <div className="custom-checkbox desktop-only">
        {active && <CheckCircle2 size={14} />}
      </div>
      <span>{day}</span>
    </div>
    <div className="schedule-time-wrapper">
      <span className="schedule-time">{time}</span>
      <div className="custom-checkbox mobile-only">
        {active && <CheckCircle2 size={14} />}
      </div>
    </div>
  </div>
);

const Toggle = ({ active }) => (
  <div className={`custom-toggle ${active ? 'active' : ''}`}>
    <div className="toggle-knob"></div>
  </div>
);

const NotificationRow = ({ title, desc, active, colorClass }) => (
  <div className="notification-row">
    <div className="notification-info">
      <div className={`notification-dot ${colorClass}`}></div>
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
    <div className={`custom-checkbox desktop-only ${active ? 'active' : ''}`}>
      {active && <CheckCircle2 size={14} />}
    </div>
    <div className="mobile-only">
      <Toggle active={active} />
    </div>
  </div>
);

const CaregiverSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'availability', label: 'Availability' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <CaregiverLayout title="Settings">
      <div className="settings-container relative">
        
        {/* Header Section */}
        <div className="settings-header">
          <div className="breadcrumb desktop-only">
            <span>Dashboard</span>
            <span className="separator">›</span>
            <span className="current">Settings</span>
          </div>
          <h1>Account Settings</h1>
          <p className="desktop-only subtitle">
            Manage your professional profile, availability windows, and notification preferences to provide the best care experience.
          </p>
          <p className="mobile-only subtitle">
            Customize your sanctuary and schedule.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="settings-layout">
          
          {/* Mobile Tabs */}
          <div className="mobile-tabs sticky">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Desktop Sidebar Navigation */}
          <div className="settings-sidebar sticky">
            <NavButton 
              active={activeTab === 'profile'} 
              onClick={() => scrollToSection('profile')}
              icon={<User size={18} />} 
              label="Profile" 
            />
            <NavButton 
              active={activeTab === 'availability'} 
              onClick={() => scrollToSection('availability')}
              icon={<Calendar size={18} />} 
              label="Availability" 
            />
            <NavButton 
              active={activeTab === 'notifications'} 
              onClick={() => scrollToSection('notifications')}
              icon={<Bell size={18} />} 
              label="Notifications" 
            />
            <NavButton 
              active={activeTab === 'security'} 
              onClick={() => scrollToSection('security')}
              icon={<Shield size={18} />} 
              label="Security" 
            />
          </div>

          {/* Right Content Area */}
          <div className="settings-content">
            
            {/* Profile Section */}
            <div id="profile" className="settings-card">
              <div className="card-header mobile-only">
                <h2>Personal Information</h2>
                <User className="icon-muted" size={20} />
              </div>
              
              <div className="profile-layout">
                <div className="profile-avatar-container desktop-only">
                  <div className="profile-avatar-box"></div>
                  <button className="edit-avatar-btn">
                    <Edit3 size={14} />
                  </button>
                </div>
                
                <div className="profile-fields">
                  <InputField label="FULL NAME" defaultValue="Sarah Jenkins" />
                  <InputField label="EMAIL ADDRESS" defaultValue="sarah.j@familycare.io" type="email" />
                  
                  <div className="desktop-only">
                    <InputField label="PHONE NUMBER" defaultValue="+1 (555) 234-5678" />
                  </div>
                  <div className="desktop-only">
                    <div className="settings-input-group">
                      <label>YEARS OF EXPERIENCE</label>
                      <div className="select-wrapper">
                        <select>
                          <option>8+ Years</option>
                          <option>5-7 Years</option>
                          <option>1-4 Years</option>
                        </select>
                        <ChevronRight size={16} className="select-icon rotate-90" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mobile-only full-width">
                     <div className="settings-input-group">
                        <label>BIO</label>
                        <textarea 
                          defaultValue="Certified senior caregiver with 8+ years of experience in memory care and mobility assistance. Passionate about creating joyful moments every day."
                        />
                      </div>
                  </div>
                </div>
              </div>
              <div className="card-actions desktop-only">
                <button className="btn-primary-teal">Save Changes</button>
              </div>
            </div>

            {/* Availability Section */}
            <div id="availability" className="availability-layout">
              <div className="settings-card flex-2">
                <div className="card-header">
                  <h2>Weekly Schedule</h2>
                  <Calendar className="icon-muted mobile-only" size={20} />
                  <Calendar className="icon-teal desktop-only" size={20} />
                </div>
                
                <div className="schedule-list">
                  <ScheduleRow day="Mon - Fri" time="08:00 AM - 05:30 PM" active={true} />
                  <ScheduleRow day="Sat" time="10:00 AM - 02:00 PM" active={true} />
                  <ScheduleRow day="Sun" time="OFF" active={false} />
                </div>

                <p className="mobile-only note">* Clients can only book during your active hours.</p>
              </div>

              <div className="settings-card flex-1 center-content">
                <div className="card-header mobile-only full-width">
                   <h2>Status</h2>
                   <Toggle active={true} />
                </div>
                <div className="card-header desktop-only full-width">
                  <h2>Status Toggle</h2>
                  <Toggle active={true} />
                </div>
                <div className="status-icon-wrapper">
                  <Zap className="icon-zap" size={24} />
                </div>
                <h3 className="status-title">Accepting New Cases</h3>
                <p className="status-desc">When active, your profile is visible to families seeking new caregivers.</p>
              </div>
            </div>

            {/* Notifications Section */}
            <div id="notifications" className="settings-card">
              <div className="card-header">
                <h2 className="mobile-only">Alert Preferences</h2>
                <h2 className="desktop-only">Notification Preferences</h2>
                <Bell className="icon-muted mobile-only" size={20} />
              </div>
              
              <div className="notifications-list">
                <NotificationRow 
                  title="Messages & Chat" 
                  desc="Real-time alerts when a family member sends a message."
                  active={true}
                  colorClass="bg-teal"
                />
                <NotificationRow 
                  title="Health Updates" 
                  desc="Critical notifications regarding patient health trends."
                  active={true}
                  colorClass="bg-orange"
                />
                <NotificationRow 
                  title="Visit Reminders" 
                  desc="Automated nudges for upcoming scheduled home visits."
                  active={false}
                  colorClass="bg-gray"
                />
              </div>
            </div>

            {/* Security Section */}
            <div id="security" className="settings-card">
              <div className="card-header mobile-only">
                <h2>Security</h2>
                <Lock className="icon-muted" size={20} />
              </div>
              <h2 className="desktop-only section-title">Security & Authentication</h2>
              
              <div className="security-grid desktop-only">
                <InputField label="CURRENT PASSWORD" type="password" defaultValue="........" />
                <InputField label="NEW PASSWORD" type="password" placeholder="Min. 8 chars" />
                <InputField label="CONFIRM PASSWORD" type="password" placeholder="Repeat new" />
              </div>

              <div className="security-actions desktop-only">
                <button className="btn-dark">Update Security</button>
                <button className="btn-link">Enable Two-Factor Auth</button>
              </div>

              <div className="security-mobile-list mobile-only">
                <button className="security-mobile-btn">
                  <span>Change Password</span>
                  <ChevronRight size={18} className="icon-muted" />
                </button>
                <button className="security-mobile-btn">
                  <span>Two-Factor Authentication</span>
                  <span className="badge-enabled">ENABLED</span>
                </button>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="mobile-actions mobile-only">
              <button className="btn-outline-red">
                <LogOut size={18} /> Sign Out
              </button>
              <button className="btn-primary-teal full-width-btn">
                Save All Changes <CheckCircle2 size={18} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </CaregiverLayout>
  );
};

export default CaregiverSettings;
