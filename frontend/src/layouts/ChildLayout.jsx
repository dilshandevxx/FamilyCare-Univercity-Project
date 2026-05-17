import React, { useState } from 'react';
import { Bell, MessageSquare, HelpCircle, Menu, Search } from 'lucide-react';
import ChildSidebar from '../components/child/ChildSidebar';
import './ChildLayout.css';
import { useAuth } from '../context/AuthContext';

const ChildLayout = ({ children, title = "Dashboard" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="child-layout-wrapper">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar - Fixed on the left */}
      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <ChildSidebar />
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
            <div className="search-bar hide-on-mobile">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search care network..." />
            </div>

            <div className="header-icon-group">
              <button className="icon-btn">
                <Bell size={20} strokeWidth={2} />
                <span className="notification-dot"></span>
              </button>
              <button className="icon-btn hide-on-mobile">
                <MessageSquare size={20} strokeWidth={2} />
              </button>
              <button className="icon-btn hide-on-mobile">
                <HelpCircle size={20} strokeWidth={2} />
              </button>
            </div>
            
            <div className="profile-group">
              <div className="profile-avatar">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Alex'}`} alt="Avatar" />
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

export default ChildLayout;
