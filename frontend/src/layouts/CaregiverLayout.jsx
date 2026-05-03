import React, { useState } from 'react';
import { Bell, HelpCircle, Menu } from 'lucide-react';
import CaregiverSidebar from '../components/caregiver/CaregiverSidebar';
import './CaregiverLayout.css';

const CaregiverLayout = ({ children, title = "Dashboard" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="layout-wrapper">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar - Fixed on the left */}
      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <CaregiverSidebar />
      </div>

      {/* Main Content Area */}
      <div className="layout-main">
        {/* Header */}
        <header className="layout-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h2 className="header-title">{title}</h2>
          </div>

          <div className="header-actions">
            <div className="header-icon-group">
              <button className="icon-btn">
                <Bell size={20} strokeWidth={2} />
                <span className="notification-dot"></span>
              </button>
              <button className="icon-btn hide-on-mobile">
                <HelpCircle size={20} strokeWidth={2} />
              </button>
            </div>
            
            <div className="header-divider hide-on-mobile"></div>

            <div className="profile-group">
              <div className="profile-info hide-on-mobile">
                <p className="profile-name">Sarah Mitchell</p>
                <p className="profile-role">Senior Caregiver</p>
              </div>
              <div className="profile-avatar">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CaregiverLayout;