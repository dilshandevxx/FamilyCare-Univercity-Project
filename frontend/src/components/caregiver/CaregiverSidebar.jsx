import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, FilePlus, Clock, Mail, Settings, Phone, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './CaregiverSidebar.css';

const CaregiverSidebar = () => {
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleEmergencyCall = () => {
    window.location.href = 'tel:911';
    setShowModal(false);
  };

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
          to="/caregiver/healthlog/add" 
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
        <button className="btn-emergency" onClick={() => setShowModal(true)}>
          <Phone size={16} fill="currentColor" />
          Emergency Call
        </button>
      </div>

      {/* Emergency Call Confirmation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          backgroundColor: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            textAlign: 'center', position: 'relative',
          }}>
            {/* Close */}
            <button onClick={() => setShowModal(false)} style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280',
            }}>
              <X size={20} />
            </button>

            {/* Icon */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <AlertTriangle size={32} color="#DC2626" />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Emergency Call
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              You are about to call <strong style={{ color: '#DC2626' }}>Emergency Services (911)</strong>.
              Only proceed if there is a real emergency.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: '11px', borderRadius: '8px',
                border: '1px solid #D1D5DB', background: '#fff',
                color: '#374151', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
              }}>
                Cancel
              </button>
              <button onClick={handleEmergencyCall} style={{
                flex: 1, padding: '11px', borderRadius: '8px',
                border: 'none', background: '#DC2626',
                color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                <Phone size={15} fill="currentColor" />
                Call 911
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverSidebar;