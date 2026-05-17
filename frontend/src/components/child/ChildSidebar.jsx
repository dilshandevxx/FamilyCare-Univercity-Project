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
  Mail, 
  Settings 
} from 'lucide-react';
import './ChildSidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'My Parents', path: '/parents' },
  { icon: UserPlus, label: 'Add Parent', path: '/add-parent' },
  { icon: HeartPulse, label: 'Caregivers', path: '/caregivers-list' },
  { icon: Activity, label: 'Health Feed', path: '/health-feed' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Bell, label: 'Alerts', path: '/alerts' },
  { icon: Mail, label: 'Messages', path: '/messages' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const ChildSidebar = () => {
  return (
    <aside className="child-sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">FamilyCare</h1>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} className="sidebar-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <div className="premium-plan">
          <span className="premium-text">Premium Plan</span>
        </div>
      </div>
    </aside>
  );
};

export default ChildSidebar;
