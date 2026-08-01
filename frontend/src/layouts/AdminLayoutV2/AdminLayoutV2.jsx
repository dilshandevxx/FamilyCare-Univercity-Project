import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, Server, Shield, Loader2 } from 'lucide-react';
import AdminSidebarV2 from '../../components/adminV2/AdminSidebarV2';
import { useAuth } from '../../context/AuthContext';
import { AdminStatsProvider } from '../../context/AdminStatsContext';
import adminService from '../../services/adminService';
import './AdminLayoutV2.css';

const formatTimeAgo = (ts) => {
  if (!ts) return 'Just now';
  const diffM = Math.floor((Date.now() - new Date(ts)) / 60000);
  if (diffM < 1) return 'Just now';
  if (diffM < 60) return `${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
};

const AdminLayoutV2 = ({ children, title = 'Dashboard' }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      setLoadingNotifs(true);
      try {
        const { data } = await adminService.getAlerts();
        const activeNotifs = (data || [])
          .filter(a => !a.is_resolved)
          .slice(0, 5)
          .map(a => ({
            id: a.id,
            title: a.title || 'System Alert',
            desc: a.description || `Alert regarding ${a.elder_name || 'resident'}`,
            time: formatTimeAgo(a.created_at),
            unread: true
          }));
        setNotifications(activeNotifs);
      } catch (err) {
        console.error('Failed to fetch header notifications:', err);
        setNotifications([]);
      } finally {
        setLoadingNotifs(false);
      }
    };
    if (showNotifications) {
      fetchNotifs();
    }
  }, [showNotifications]);

  const handleClearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <AdminStatsProvider>
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
                        <span className="admin-v2-badge-unread">{notifications.length} Active</span>
                      </div>
                      <div className="admin-v2-notif-dropdown-body">
                        {loadingNotifs ? (
                          <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 0' }}>
                            <Loader2 className="animate-spin" size={20} color="#00A896" />
                          </div>
                        ) : notifications.length === 0 ? (
                          <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', padding: '1rem 0' }}>
                            No active notifications.
                          </p>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className={`admin-v2-notif-item ${n.unread ? 'unread' : ''}`}>
                              <div className="admin-v2-notif-item-top">
                                <span className="admin-v2-notif-title">{n.title}</span>
                                <span className="admin-v2-notif-time">{n.time}</span>
                              </div>
                              <p className="admin-v2-notif-desc">{n.desc}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="admin-v2-notif-dropdown-footer">
                        <button onClick={handleClearNotifications}>Dismiss All</button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="admin-v2-header-divider" />

              <div className="admin-v2-profile-group">
                <div className="admin-v2-profile-info">
                  <p className="admin-v2-profile-name">{user?.name || 'Administrator'}</p>
                  <div className="admin-v2-profile-badge">
                    <Shield size={10} style={{ marginRight: '4px' }} />
                    {user?.role === 'admin' ? 'Super Admin' : 'Admin User'}
                  </div>
                </div>
                <div className="admin-v2-profile-avatar">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.email || user?.name || 'SystemAdmin')}&backgroundColor=b6e3f4`}
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
    </AdminStatsProvider>
  );
};

export default AdminLayoutV2;
