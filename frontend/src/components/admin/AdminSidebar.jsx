import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, Heart, Activity,
  Bell, BarChart2, Monitor, Settings, LogOut, Radio, X, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState(null);
  const [activeAlerts, setActiveAlerts]         = useState(null);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => {
        setPendingApprovals(data.pending_approvals ?? null);
        setActiveAlerts(data.active_alerts ?? null);
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { to: '/admin/dashboard',           icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users',               icon: Users,            label: 'User Management' },
    { to: '/admin/caregiver-approval',  icon: UserCheck,        label: 'Caregiver Approval', badge: pendingApprovals },
    { to: '/admin/elders',              icon: Heart,            label: 'Elder Management' },
    { to: '/admin/health-logs',         icon: Activity,         label: 'Health Logs' },
    { to: '/admin/alerts',              icon: Bell,             label: 'Alerts', badge: activeAlerts },
    { to: '/admin/analytics',           icon: BarChart2,        label: 'Analytics' },
    { to: '/admin/monitoring',          icon: Monitor,          label: 'System Monitoring' },
    { to: '/admin/settings',            icon: Settings,         label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h1 className="admin-logo">FamilyCare</h1>
        <p className="admin-logo-sub">Admin Console</p>
      </div>

      <nav className="admin-nav">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span className="admin-nav-label">{label}</span>
            {badge !== null && badge !== undefined && badge > 0 && (
              <span className="admin-nav-badge">{badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-btn-broadcast" onClick={() => setShowBroadcast(true)}>
          <Radio size={15} />
          Emergency Broadcast
        </button>
        <button className="admin-btn-logout" onClick={handleLogout}>
          <LogOut size={15} />
          Logout
        </button>
      </div>

      {showBroadcast && (
        <div className="admin-modal-overlay" onClick={() => setShowBroadcast(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setShowBroadcast(false)}>
              <X size={18} />
            </button>
            <div className="admin-modal-icon">
              <AlertTriangle size={30} color="#dc2626" />
            </div>
            <h2 className="admin-modal-title">Emergency Broadcast</h2>
            <p className="admin-modal-desc">
              Send an emergency alert to all active users and caregivers on the platform.
              This action cannot be undone.
            </p>
            <textarea
              className="admin-modal-textarea"
              rows={3}
              placeholder="Enter emergency message..."
            />
            <div className="admin-modal-actions">
              <button className="admin-modal-cancel" onClick={() => setShowBroadcast(false)}>
                Cancel
              </button>
              <button className="admin-modal-send" onClick={() => setShowBroadcast(false)}>
                <Radio size={14} />
                Send Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
