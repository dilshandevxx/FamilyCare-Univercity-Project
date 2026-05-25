import React, { useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children, title = 'Dashboard' }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-layout-wrapper">
      {isSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className={`admin-sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <AdminSidebar />
      </div>

      <div className="admin-layout-main">
        <header className="admin-layout-header">
          <div className="admin-header-left">
            <button className="admin-mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={22} />
            </button>
            <div className="admin-search-bar">
              <Search size={15} color="#94a3b8" />
              <input type="text" placeholder="Search for users, records, or logs..." />
            </div>
          </div>

          <div className="admin-header-right">
            <div className="admin-system-status">
              <span className="admin-status-dot" />
              System Status: Healthy
            </div>

            <button className="admin-icon-btn">
              <Bell size={18} />
              <span className="admin-notif-dot" />
            </button>

            <div className="admin-header-divider" />

            <div className="admin-profile-group">
              <div className="admin-profile-info">
                <p className="admin-profile-name">{user?.name || 'FamilyCare Admin'}</p>
                <p className="admin-profile-role">Super Admin</p>
              </div>
              <div className="admin-profile-avatar">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'Admin')}`}
                  alt="Admin Avatar"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="admin-layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
