import React, { useState } from 'react';
import { Save, Shield, Bell, Globe, Lock } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import './AdminSettings.css';

const AdminSettings = () => {
  const [form, setForm] = useState({
    platformName: 'FamilyCare',
    supportEmail: 'support@familycare.com',
    timezone: 'UTC+05:30',
    emailAlerts: true,
    smsAlerts: false,
    criticalOnly: false,
    twoFactor: true,
    sessionTimeout: '30',
    maintenanceMode: false,
  });

  const toggle = key => setForm(prev => ({ ...prev, [key]: !prev[key] }));
  const change = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const sections = [
    {
      icon: Globe,
      label: 'General',
      fields: (
        <div className="as-fields">
          <label className="as-label">
            Platform Name
            <input
              className="as-input"
              value={form.platformName}
              onChange={e => change('platformName', e.target.value)}
            />
          </label>
          <label className="as-label">
            Support Email
            <input
              className="as-input"
              value={form.supportEmail}
              onChange={e => change('supportEmail', e.target.value)}
            />
          </label>
          <label className="as-label">
            Timezone
            <select
              className="as-input"
              value={form.timezone}
              onChange={e => change('timezone', e.target.value)}
            >
              {['UTC-08:00', 'UTC-05:00', 'UTC+00:00', 'UTC+01:00', 'UTC+05:30', 'UTC+09:00'].map(tz => (
                <option key={tz}>{tz}</option>
              ))}
            </select>
          </label>
        </div>
      ),
    },
    {
      icon: Bell,
      label: 'Notifications',
      fields: (
        <div className="as-fields">
          {[
            { key: 'emailAlerts', label: 'Email Alerts',    desc: 'Receive alerts via email'     },
            { key: 'smsAlerts',   label: 'SMS Alerts',      desc: 'Receive alerts via SMS'       },
            { key: 'criticalOnly',label: 'Critical Only',   desc: 'Only notify for critical events' },
          ].map(t => (
            <div key={t.key} className="as-toggle-row">
              <div>
                <p className="as-toggle-label">{t.label}</p>
                <p className="as-toggle-desc">{t.desc}</p>
              </div>
              <button
                className={`as-toggle ${form[t.key] ? 'on' : ''}`}
                onClick={() => toggle(t.key)}
              >
                <span className="as-toggle-thumb" />
              </button>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Lock,
      label: 'Security',
      fields: (
        <div className="as-fields">
          <div className="as-toggle-row">
            <div>
              <p className="as-toggle-label">Two-Factor Authentication</p>
              <p className="as-toggle-desc">Require 2FA for all admin accounts</p>
            </div>
            <button
              className={`as-toggle ${form.twoFactor ? 'on' : ''}`}
              onClick={() => toggle('twoFactor')}
            >
              <span className="as-toggle-thumb" />
            </button>
          </div>
          <div className="as-toggle-row">
            <div>
              <p className="as-toggle-label">Maintenance Mode</p>
              <p className="as-toggle-desc">Take platform offline for maintenance</p>
            </div>
            <button
              className={`as-toggle ${form.maintenanceMode ? 'on danger' : ''}`}
              onClick={() => toggle('maintenanceMode')}
            >
              <span className="as-toggle-thumb" />
            </button>
          </div>
          <label className="as-label">
            Session Timeout (minutes)
            <input
              className="as-input"
              type="number"
              min={5}
              max={120}
              value={form.sessionTimeout}
              onChange={e => change('sessionTimeout', e.target.value)}
            />
          </label>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Settings">
      <div className="as-page">
        <div className="as-header">
          <div>
            <h1 className="as-title">Settings</h1>
            <p className="as-subtitle">Configure platform behaviour and security options.</p>
          </div>
          <button className="as-save-btn">
            <Save size={14} /> Save Changes
          </button>
        </div>

        <div className="as-sections">
          {sections.map(s => (
            <div key={s.label} className="as-section">
              <div className="as-section-head">
                <div className="as-section-icon"><s.icon size={16} /></div>
                <h3 className="as-section-title">{s.label}</h3>
              </div>
              {s.fields}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
