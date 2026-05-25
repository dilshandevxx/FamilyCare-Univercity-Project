import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, X } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import './AdminAlerts.css';

const mockAlerts = [
  { id: 1, level: 'Critical', title: 'High Blood Pressure',      elder: 'Martha K.',  zone: 'Zone 4', time: '9:15 AM', resolved: false },
  { id: 2, level: 'Critical', title: 'Low Oxygen Saturation',    elder: 'Frank L.',   zone: 'Zone 2', time: '8:50 AM', resolved: false },
  { id: 3, level: 'Critical', title: 'Irregular Heart Rate',     elder: 'Robert H.',  zone: 'Zone 3', time: '8:22 AM', resolved: false },
  { id: 4, level: 'Critical', title: 'Missed Medication',        elder: 'Alice W.',   zone: 'Zone 1', time: '7:00 AM', resolved: false },
  { id: 5, level: 'Warning',  title: 'Elevated Blood Glucose',   elder: 'George P.',  zone: 'Zone 1', time: '8:40 AM', resolved: false },
  { id: 6, level: 'Warning',  title: 'No Activity Detected',     elder: 'Dorothy M.', zone: 'Zone 2', time: '7:30 AM', resolved: false },
  { id: 7, level: 'Warning',  title: 'Fall Risk Assessment Due', elder: 'Martha K.',  zone: 'Zone 4', time: '6:00 AM', resolved: false },
  { id: 8, level: 'Warning',  title: 'Hydration Alert',          elder: 'George P.',  zone: 'Zone 1', time: 'Yesterday',resolved: false },
  { id: 9, level: 'Info',     title: 'Routine Checkup Reminder', elder: 'Alice W.',   zone: 'Zone 2', time: 'Yesterday',resolved: true  },
  { id: 10,level: 'Info',     title: 'New Caregiver Assigned',   elder: 'Frank L.',   zone: 'Zone 2', time: '2 days ago',resolved: true },
  { id: 11,level: 'Info',     title: 'Lab Results Available',    elder: 'Robert H.',  zone: 'Zone 3', time: '2 days ago',resolved: true },
  { id: 12,level: 'Info',     title: 'Monthly Report Generated', elder: 'Dorothy M.', zone: 'Zone 1', time: '3 days ago',resolved: true },
];

const levelStyle = {
  Critical: { bg: '#fef2f2', color: '#dc2626', icon: AlertTriangle },
  Warning:  { bg: '#fef3c7', color: '#b45309', icon: Bell },
  Info:     { bg: '#eff6ff', color: '#3b82f6', icon: Bell },
};

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [tab, setTab] = useState('Active');

  const resolve = id => setAlerts(prev =>
    prev.map(a => a.id === id ? { ...a, resolved: true } : a)
  );

  const dismiss = id => setAlerts(prev => prev.filter(a => a.id !== id));

  const shown = alerts.filter(a => tab === 'Active' ? !a.resolved : a.resolved);

  return (
    <AdminLayout title="Alerts">
      <div className="aa-page">
        <div className="aa-header">
          <div>
            <h1 className="aa-title">Alerts</h1>
            <p className="aa-subtitle">
              {alerts.filter(a => !a.resolved).length} active alerts require attention.
            </p>
          </div>
          <div className="aa-counts">
            <span className="aa-count critical">{alerts.filter(a => !a.resolved && a.level === 'Critical').length} Critical</span>
            <span className="aa-count warning">{alerts.filter(a => !a.resolved && a.level === 'Warning').length} Warnings</span>
          </div>
        </div>

        <div className="aa-tabs">
          {['Active', 'Resolved'].map(t => (
            <button
              key={t}
              className={`aa-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="aa-list">
          {shown.map(a => {
            const s = levelStyle[a.level];
            const Icon = s.icon;
            return (
              <div key={a.id} className="aa-item" style={{ borderLeftColor: s.color }}>
                <div className="aa-icon" style={{ background: s.bg }}>
                  <Icon size={16} color={s.color} />
                </div>
                <div className="aa-info">
                  <div className="aa-info-top">
                    <span className="aa-level" style={{ color: s.color }}>{a.level}</span>
                    <span className="aa-time">{a.time}</span>
                  </div>
                  <p className="aa-item-title">{a.title}</p>
                  <p className="aa-item-meta">{a.elder} · {a.zone}</p>
                </div>
                {!a.resolved && (
                  <div className="aa-actions">
                    <button className="aa-resolve-btn" onClick={() => resolve(a.id)}>
                      <CheckCircle size={14} /> Resolve
                    </button>
                    <button className="aa-dismiss-btn" onClick={() => dismiss(a.id)}>
                      <X size={14} />
                    </button>
                  </div>
                )}
                {a.resolved && (
                  <span className="aa-resolved-badge">
                    <CheckCircle size={12} /> Resolved
                  </span>
                )}
              </div>
            );
          })}
          {shown.length === 0 && (
            <div className="aa-empty">
              <CheckCircle size={40} color="#14b8a6" />
              <p>No {tab.toLowerCase()} alerts.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAlerts;
