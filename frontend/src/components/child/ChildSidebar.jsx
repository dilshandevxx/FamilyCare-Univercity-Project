import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  HeartPulse,
  Activity,
  BarChart2,
  Bell,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../common/BrandLogo';
import './ChildSidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/dashboard' },
  { icon: Users,           label: 'My Parents',  path: '/parents' },
  { icon: UserPlus,        label: 'Add Parent',  path: '/add-parent' },
  { icon: HeartPulse,      label: 'Caregivers',  path: '/caregivers-list' },
  { icon: Activity,        label: 'Health Feed', path: '/health-feed' },
  { icon: BarChart2,       label: 'Analytics',   path: '/analytics' },
  { icon: Bell,            label: 'Alerts',      path: '/alerts' },
  { icon: Settings,        label: 'Settings',    path: '/settings' },
];

const ChildSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="child-sidebar">
      {/* Brand Header */}
      <div className="cs-header">
        <BrandLogo to="/dashboard" size="md" tagline="Family Portal" />
      </div>

      {/* User Profile Block */}
      <div className="cs-user-block">
        <div className="cs-avatar-wrap">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
            alt="user"
            className="cs-avatar-img"
          />
          <span className="cs-online-dot" />
        </div>
        <div className="cs-user-info">
          <p className="cs-user-name">{user?.name || 'Family Member'}</p>
          <span className="cs-user-badge">
            <Sparkles size={10} /> Active Plan
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="cs-nav">
        <span className="cs-nav-section-title">Menu</span>
        {navItems.map(({ icon: Icon, label, path, badge }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `cs-link${isActive ? ' active' : ''}`}
          >
            <div className="cs-link-icon-wrap">
              <Icon size={18} />
            </div>
            <span className="cs-link-text">{label}</span>
            {badge && <span className="cs-nav-pill">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="cs-footer">
        <button className="cs-btn-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default ChildSidebar;

