import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  HeartPulse,
  Activity,
  BarChart2,
  Bell,
  Settings
} from 'lucide-react';
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

const ChildSidebar = () => (
  <aside className="child-sidebar">
    <div className="cs-header">
      <span className="cs-logo">FamilyCare</span>
    </div>

    <div className="cs-user-block">
      <div className="cs-avatar">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="user" />
      </div>
      <div className="cs-user-info">
        <p className="cs-user-name">Alex Johnson</p>
        <p className="cs-user-role">Primary Caregiver</p>
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
  </aside>
);

export default ChildSidebar;
