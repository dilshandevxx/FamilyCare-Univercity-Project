import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, FilePlus, Clock, Mail, Settings, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './CaregiverSidebar.css';

const CaregiverSidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">
          FamilyCare
        </h1>
        <p className="sidebar-subtitle">
          Caregiver Portal
        </p>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/caregiver/dashboard" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Home size={18} className="stroke-[2px]" />
          <span className="sidebar-link-text">Dashboard</span>
        </NavLink>

        <NavLink 
          to="/caregiver/residents" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Users size={18} className="stroke-[2px]" />
          <span className="sidebar-link-text">Assigned Elders</span>
        </NavLink>

        <NavLink 
          to="/caregiver/logs" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <FilePlus size={18} className="stroke-[2px]" />
          <span className="sidebar-link-text">Add Health Log</span>
        </NavLink>

        <NavLink 
          to="/caregiver/history" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Clock size={18} className="stroke-[2px]" />
          <span className="sidebar-link-text">Visit History</span>
        </NavLink>

        <NavLink 
          to="/caregiver/messages" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Mail size={18} className="stroke-[2px]" />
          <span className="sidebar-link-text">Messages</span>
        </NavLink>

        <NavLink 
          to="/caregiver/settings" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          style={{ marginTop: '16px' }}
        >
          <Settings size={18} className="stroke-[2px]" />
          <span className="sidebar-link-text">Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="btn-emergency">
          <Phone size={16} fill="currentColor" />
          Emergency Call
        </button>
      </div>
    </div>
  );
};

export default CaregiverSidebar;