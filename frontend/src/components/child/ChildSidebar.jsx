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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ChildSidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users,           label: 'My Parents', path: '/parents' },
  { icon: UserPlus,        label: 'Add Parent', path: '/add-parent' },
  { icon: HeartPulse,      label: 'Caregivers', path: '/caregivers-list' },
  { icon: Activity,        label: 'Health Feed', path: '/health-feed' },
  { icon: BarChart2,       label: 'Analytics', path: '/analytics' },
  { icon: Bell,            label: 'Alerts', path: '/alerts' },
  { icon: Settings,        label: 'Settings', path: '/settings' },
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
      <div className="cs-header">
        <span className="cs-logo">FamilyCare</span>
      </div>

      <div className="cs-user-block">
        <div className="cs-avatar">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
            alt="user"
          />
        </div>
        <div className="cs-user-info">
          <p className="cs-user-name">{user?.name || 'Family Member'}</p>
          <p className="cs-user-role">Family Member</p>
        </div>
      </div>

      <div className="cs-premium">Premium Plan</div>

      <nav className="cs-nav">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `cs-link${isActive ? ' active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="cs-footer">
        <button className="cs-btn-logout" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default ChildSidebar;
