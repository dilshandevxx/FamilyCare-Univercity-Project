import React, { useState } from 'react';
import { Bell, Search, Menu, Server, Shield } from 'lucide-react';
import AdminSidebarV2 from '../../components/adminV2/AdminSidebarV2';
import { useAuth } from '../../context/AuthContext';
import './AdminLayoutV2.css';

const AdminLayoutV2 = ({ children, title = 'Dashboard' }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    { id: 1, title: 'New Caregiver Signup', desc: 'Ravi registered and requires verification approval.', time: '5m ago', unread: true },
    { id: 2, title: 'Critical Health Alert', desc: 'Eleanor Vance reported Critical care status.', time: '12m ago', unread: true },
    { id: 3, title: 'System Load Normal', desc: 'Weekly analytics reporting generated.', time: '1h ago', unread: false }
  ];

  return (
    <div className="admin-v2-layout-wrapper">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="admin-v2-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Navigation Sidebar Wrapper */}
      <div className={`admin-v2-sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <AdminSidebarV2 />
      </div>

      {/* Main Workspace */}
      <div className="admin-v2-layout-main">
        <header className="admin-v2-layout-header">
          <div className="admin-v2-header-left">
            <button className="admin-v2-mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={22} />
            </button>
            <div className="admin-v2-search-bar">
              <Search size={16} color="#94A3B8" />
              <input type="text" placeholder="Search users, elders, logs..." />
            </div>
          </div>

          <div className="admin-v2-header-right">
            <div className="admin-v2-system-status">
              <span className="admin-v2-status-dot animated" />
              <Server size={14} style={{ marginRight: '6px', opacity: 0.8 }} />
              System Status: Healthy
            </div>

            <div className="admin-v2-notif-container">
              <button className="admin-v2-icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={19} />
                <span className="admin-v2-notif-dot" />
              </button>

              {showNotifications && (
                <>
                  <div className="admin-v2-notif-backdrop" onClick={() => setShowNotifications(false)} />
                  <div className="admin-v2-notif-dropdown">
                    <div className="admin-v2-notif-dropdown-header">
                      <h3>Notifications</h3>
                      <span className="admin-v2-badge-unread">2 New</span>
                    </div>
                    <div className="admin-v2-notif-dropdown-body">
                      {mockNotifications.map(n => (
                        <div key={n.id} className={`admin-v2-notif-item ${n.unread ? 'unread' : ''}`}>
                          <div className="admin-v2-notif-item-top">
                            <span className="admin-v2-notif-title">{n.title}</span>
                            <span className="admin-v2-notif-time">{n.time}</span>
                          </div>
                          <p className="admin-v2-notif-desc">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                    <div className="admin-v2-notif-dropdown-footer">
                      <button onClick={() => setShowNotifications(false)}>Clear Notifications</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="admin-v2-header-divider" />

            <div className="admin-v2-profile-group">
              <div className="admin-v2-profile-info">
                <p className="admin-v2-profile-name">{user?.name || 'Rithwik Sen'}</p>
                <div className="admin-v2-profile-badge">
                  <Shield size={10} style={{ marginRight: '4px' }} />
                  Super Admin
                </div>
              </div>
              <div className="admin-v2-profile-avatar">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'AdminRithwik')}&backgroundColor=b6e3f4`}
                  alt="Admin Avatar"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="admin-v2-layout-content">
          <div className="admin-v2-breadcrumb-bar">
            <h2>{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayoutV2;
