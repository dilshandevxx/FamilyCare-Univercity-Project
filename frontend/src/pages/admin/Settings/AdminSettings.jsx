import React, { useState, useEffect } from 'react';
import { Save, Bell, Globe, Lock, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import api from '../../../services/api';
import './AdminSettings.css';

const DEFAULTS = {
  platformName:    'FamilyCare',
  supportEmail:    'support@familycare.com',
  timezone:        'UTC+05:30',
  emailAlerts:     'true',
  smsAlerts:       'false',
  criticalOnly:    'false',
  twoFactor:       'true',
  sessionTimeout:  '30',
  maintenanceMode: 'false',
};

const toBool = (v) => v === true || v === 'true';

const Toast = ({ toast }) => {
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: ok ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${ok ? '#86efac' : '#fca5a5'}`,
      color: ok ? '#166534' : '#991b1b',
      padding: '12px 18px', borderRadius: 10,
      fontSize: '0.83rem', fontWeight: 600,
      boxShadow: '0 4px 16px rgba(0,0,0,.1)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {ok ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
      {toast.message}
    </div>
  );
};

const AdminSettings = () => {
  const [form, setForm]       = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    api.get('/admin/settings')
      .then(({ data }) => {
        setForm({ ...DEFAULTS, ...data });
      })
      .catch(() => {
        // Backend table not yet seeded — use defaults silently
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (key) => setForm(prev => ({ ...prev, [key]: String(!toBool(prev[key])) }));
  const change = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', form);
      showToast('success', 'Settings saved successfully');
    } catch {
      showToast('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

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
              type="email"
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
            { key: 'emailAlerts',  label: 'Email Alerts',  desc: 'Receive alerts via email'          },
            { key: 'smsAlerts',    label: 'SMS Alerts',    desc: 'Receive alerts via SMS'            },
            { key: 'criticalOnly', label: 'Critical Only', desc: 'Only notify for critical events'   },
          ].map(t => (
            <div key={t.key} className="as-toggle-row">
              <div>
                <p className="as-toggle-label">{t.label}</p>
                <p className="as-toggle-desc">{t.desc}</p>
              </div>
              <button
                className={`as-toggle ${toBool(form[t.key]) ? 'on' : ''}`}
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
              className={`as-toggle ${toBool(form.twoFactor) ? 'on' : ''}`}
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
              className={`as-toggle ${toBool(form.maintenanceMode) ? 'on danger' : ''}`}
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
      <Toast toast={toast} />

      <div className="as-page">
        <div className="as-header">
          <div>
            <h1 className="as-title">Settings</h1>
            <p className="as-subtitle">Configure platform behaviour and security options.</p>
          </div>
          <button
            className="as-save-btn"
            onClick={handleSave}
            disabled={saving || loading}
            style={{ opacity: saving || loading ? 0.7 : 1, cursor: saving || loading ? 'not-allowed' : 'pointer' }}
          >
            {saving
              ? <><Loader2 size={14} style={{ animation: 'as-spin 1s linear infinite' }} /> Saving…</>
              : <><Save size={14} /> Save Changes</>}
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 size={28} style={{ animation: 'as-spin 1s linear infinite', color: '#0d9488' }} />
          </div>
        ) : (
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
        )}
      </div>

      <style>{`@keyframes as-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
};

export default AdminSettings;
