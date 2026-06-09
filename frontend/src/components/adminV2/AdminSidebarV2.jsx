import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, Heart, Activity,
  Bell, BarChart2, Monitor, Settings, LogOut, Radio, X, AlertTriangle, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebarV2.css';

const AdminSidebarV2 = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // V2 Navigation routes
  const navItems = [
    { to: '/admin-v2/dashboard',           icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin-v2/users',               icon: Users,            label: 'User Management' },
    { to: '/admin-v2/caregiver-approval',  icon: UserCheck,        label: 'Caregiver Approval', badge: 3 },
    { to: '/admin-v2/elders',              icon: Heart,            label: 'Elder Management' },
    { to: '/admin-v2/health-logs',         icon: Activity,         label: 'Health Logs' },
    { to: '/admin-v2/alerts',              icon: Bell,             label: 'Alerts', badge: 2 },
    { to: '/admin-v2/analytics',           icon: BarChart2,        label: 'Analytics' },
    { to: '/admin-v2/monitoring',          icon: Monitor,          label: 'System Monitor' },
    { to: '/admin-v2/settings',            icon: Settings,         label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastText('');
      setShowBroadcast(false);
    }, 2000);
  };

  return (
    <div className="admin-v2-sidebar">
      <div className="admin-v2-sidebar-header">
        <div className="admin-v2-logo-container">
          <div className="admin-v2-logo-icon">FC</div>
          <div>
            <h1 className="admin-v2-logo">FamilyCare</h1>
            <p className="admin-v2-logo-sub">Console V2</p>
          </div>
        </div>
      </div>

      <nav className="admin-v2-nav">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `admin-v2-nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} className="admin-v2-nav-icon" />
            <span className="admin-v2-nav-label">{label}</span>
            {badge !== undefined && badge > 0 && (
              <span className="admin-v2-nav-badge">{badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="admin-v2-sidebar-footer">
        <button className="admin-v2-btn-broadcast" onClick={() => setShowBroadcast(true)}>
          <Radio size={15} />
          Emergency Broadcast
        </button>
        <button className="admin-v2-btn-logout" onClick={handleLogout}>
          <LogOut size={15} />
          Logout
        </button>
      </div>

      {showBroadcast && (
        <div className="admin-v2-modal-overlay" onClick={() => setShowBroadcast(false)}>
          <div className="admin-v2-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-v2-modal-close" onClick={() => setShowBroadcast(false)}>
              <X size={18} />
            </button>
            
            {broadcastSent ? (
              <div className="admin-v2-broadcast-success">
                <div className="admin-v2-success-icon-wrapper">
                  <Check size={36} color="#00A896" />
                </div>
                <h3>Broadcast Dispatched!</h3>
                <p>All platform users have been notified of this critical broadcast alert.</p>
              </div>
            ) : (
              <form onSubmit={handleSendBroadcast}>
                <div className="admin-v2-modal-header">
                  <div className="admin-v2-modal-icon">
                    <AlertTriangle size={24} color="#dc2626" />
                  </div>
                  <div>
                    <h2 className="admin-v2-modal-title">Emergency Broadcast</h2>
                    <p className="admin-v2-modal-desc">
                      Transmit a system-wide high-priority alert directly to all active clients and caregivers.
                    </p>
                  </div>
                </div>

                <div className="admin-v2-form-group">
                  <textarea
                    className="admin-v2-modal-textarea"
                    rows={4}
                    value={broadcastText}
                    onChange={e => setBroadcastText(e.target.value)}
                    placeholder="Enter urgent broadcast message details..."
                    required
                  />
                </div>

                <div className="admin-v2-modal-actions">
                  <button type="button" className="admin-v2-modal-cancel" onClick={() => setShowBroadcast(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-v2-modal-send">
                    <Radio size={14} />
                    Send Broadcast
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebarV2;
