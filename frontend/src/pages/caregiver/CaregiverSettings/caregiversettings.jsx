import React, { useState, useEffect } from 'react';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import {
  User, Calendar, Bell, Shield, LogOut, CheckCircle2,
  ChevronRight, Edit3, Zap, Lock, Loader2, ShieldCheck, ShieldOff, X, ScanLine
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './caregiverSettings.css';

const API_BASE = 'http://localhost:5000';

// ── Small reusable pieces ──────────────────────────────────────

const NavButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`settings-nav-btn ${active ? 'active' : ''}`}>
    <div className="nav-btn-content">{icon}<span>{label}</span></div>
    {active && <ChevronRight size={16} />}
  </button>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder, disabled }) => (
  <div className="settings-input-group">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

const Toggle = ({ active, onChange }) => (
  <div
    className={`custom-toggle ${active ? 'active' : ''}`}
    onClick={onChange}
    style={{ cursor: 'pointer' }}
  >
    <div className="toggle-knob" />
  </div>
);

const ScheduleRow = ({ day, startVal, endVal, active, onToggle, onStartChange, onEndChange }) => {
  const fmt = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h, 10);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className={`schedule-row ${active ? 'active' : ''}`}>
      <div className="schedule-day">
        <div className="custom-checkbox desktop-only" onClick={onToggle} style={{ cursor: 'pointer' }}>
          {active && <CheckCircle2 size={14} />}
        </div>
        <span>{day}</span>
      </div>
      <div className="schedule-time-wrapper">
        {active && startVal !== undefined ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="time"
              value={startVal}
              onChange={e => onStartChange(e.target.value)}
              style={timeInputStyle}
            />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>–</span>
            <input
              type="time"
              value={endVal}
              onChange={e => onEndChange(e.target.value)}
              style={timeInputStyle}
            />
          </div>
        ) : (
          <span className="schedule-time">{active ? `${fmt(startVal)} – ${fmt(endVal)}` : 'OFF'}</span>
        )}
        <div
          className="custom-checkbox mobile-only"
          onClick={onToggle}
          style={{ cursor: 'pointer' }}
        >
          {active && <CheckCircle2 size={14} />}
        </div>
      </div>
    </div>
  );
};

const timeInputStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '3px 6px',
  fontSize: '0.75rem',
  color: '#0d9488',
  outline: 'none',
  background: '#f0fdfa',
};

const NotificationRow = ({ title, desc, active, colorClass, onToggle }) => (
  <div className="notification-row">
    <div className="notification-info">
      <div className={`notification-dot ${colorClass}`} />
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
    <div
      className={`custom-checkbox desktop-only ${active ? 'active' : ''}`}
      onClick={onToggle}
      style={{ cursor: 'pointer' }}
    >
      {active && <CheckCircle2 size={14} />}
    </div>
    <div className="mobile-only">
      <Toggle active={active} onChange={onToggle} />
    </div>
  </div>
);

const Toast = ({ toast }) => {
  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  return (
    <div style={{
      position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
      backgroundColor: isSuccess ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${isSuccess ? '#86efac' : '#fca5a5'}`,
      color: isSuccess ? '#166534' : '#991b1b',
      padding: '12px 18px', borderRadius: '10px',
      fontSize: '0.83rem', fontWeight: '600',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', gap: '8px',
      animation: 'fadeIn 0.2s ease',
    }}>
      {isSuccess ? <CheckCircle2 size={16} /> : '✕'} {toast.message}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────

const EXPERIENCE_OPTIONS = ['', '0-1', '1-3', '3-5', '5-10', '10+'];
const CERT_OPTIONS = ['', 'CNA', 'LPN', 'RN', 'HHA', 'Other'];

const CaregiverSettings = () => {
  const { logout, refreshUser, user } = useAuth();
  const [activeTab, setActiveTab]   = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = React.useRef(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [toast, setToast]           = useState(null);

  const [profile, setProfile] = useState({
    name: '', email: '', phone: '',
    experience_years: '', bio: '', certification: '', license_id: '', hourly_rate: '',
  });

  const [availability, setAvailability] = useState({
    is_available: true,
    schedule_weekday_start: '08:00', schedule_weekday_end: '17:30', schedule_weekday_active: true,
    schedule_sat_start: '10:00', schedule_sat_end: '14:00', schedule_sat_active: true,
    schedule_sun_active: false,
  });

  const [notifications, setNotifications] = useState({
    notif_messages: true,
    notif_health: true,
    notif_visits: false,
  });

  const [security, setSecurity] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  // ── 2FA state ──────────────────────────────────────────────
  const [tfaEnabled, setTfaEnabled]       = useState(false);
  const [tfaModal, setTfaModal]           = useState(null); // null | 'setup' | 'disable'
  const [tfaQrCode, setTfaQrCode]         = useState('');
  const [tfaSecret, setTfaSecret]         = useState('');
  const [tfaOtp, setTfaOtp]               = useState('');
  const [tfaLoading, setTfaLoading]       = useState(false);
  const [tfaStep, setTfaStep]             = useState(1); // 1=scan QR, 2=enter code

  const [saving, setSaving] = useState(''); // 'profile' | 'availability' | 'notifications' | 'password'

  // ── Load settings on mount ─────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [{ data }, { data: tfaData }] = await Promise.all([
          api.get('/users/caregiver-settings'),
          api.get('/users/2fa/status'),
        ]);
        setProfile({
          name:             data.name             || '',
          email:            data.email            || '',
          phone:            data.phone            || '',
          experience_years: data.experience_years || '',
          bio:              data.bio              || '',
          certification:    data.certification    || '',
          license_id:       data.license_id       || '',
          hourly_rate:      data.hourly_rate != null ? String(data.hourly_rate) : '',
        });
        setAvailability({
          is_available:            !!data.is_available,
          schedule_weekday_start:  data.schedule_weekday_start  || '08:00',
          schedule_weekday_end:    data.schedule_weekday_end    || '17:30',
          schedule_weekday_active: !!data.schedule_weekday_active,
          schedule_sat_start:      data.schedule_sat_start      || '10:00',
          schedule_sat_end:        data.schedule_sat_end        || '14:00',
          schedule_sat_active:     !!data.schedule_sat_active,
          schedule_sun_active:     !!data.schedule_sun_active,
        });
        setNotifications({
          notif_messages: data.notif_messages !== undefined ? !!data.notif_messages : true,
          notif_health:   data.notif_health   !== undefined ? !!data.notif_health   : true,
          notif_visits:   data.notif_visits   !== undefined ? !!data.notif_visits   : false,
        });
        setTfaEnabled(!!tfaData.tfa_enabled);
      } catch {
        showToast('error', 'Failed to load settings');
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, []);

  // ── Helpers ────────────────────────────────────────────────
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
  };

  const pf  = (key) => (e) => setProfile(p => ({ ...p, [key]: e.target.value }));
  const av  = (key) => (val) => setAvailability(a => ({ ...a, [key]: val }));
  const avE = (key) => (e) => setAvailability(a => ({ ...a, [key]: e.target.value }));
  const nt  = (key) => () => setNotifications(n => ({ ...n, [key]: !n[key] }));

  // ── Avatar upload ──────────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      // Do NOT set Content-Type manually — axios sets it with the correct boundary
      await api.post('/users/avatar', formData);
      await refreshUser();
      showToast('success', 'Profile picture updated');
    } catch {
      setAvatarPreview(null);
      showToast('error', 'Failed to upload picture');
    }
  };

  // ── Save handlers ──────────────────────────────────────────
  const saveProfile = async () => {
    setSaving('profile');
    try {
      await api.put('/users/caregiver-settings/profile', profile);
      await refreshUser();
      showToast('success', 'Profile saved successfully');
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving('');
    }
  };

  const saveAvailability = async () => {
    setSaving('availability');
    try {
      await api.put('/users/caregiver-settings/availability', availability);
      showToast('success', 'Availability updated');
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to update availability');
    } finally {
      setSaving('');
    }
  };

  const saveNotifications = async () => {
    setSaving('notifications');
    try {
      await api.put('/users/caregiver-settings/notifications', notifications);
      showToast('success', 'Notification preferences saved');
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to save notifications');
    } finally {
      setSaving('');
    }
  };

  const savePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      showToast('error', 'New passwords do not match');
      return;
    }
    setSaving('password');
    try {
      await api.put('/users/caregiver-settings/password', {
        currentPassword: security.currentPassword,
        newPassword:     security.newPassword,
      });
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('success', 'Password updated successfully');
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to update password');
    } finally {
      setSaving('');
    }
  };

  const saveAll = async () => {
    await Promise.all([saveProfile(), saveAvailability(), saveNotifications()]);
  };

  // ── 2FA handlers ───────────────────────────────────────────
  const openEnableModal = async () => {
    setTfaOtp('');
    setTfaStep(1);
    setTfaModal('setup');
    setTfaLoading(true);
    try {
      const { data } = await api.post('/users/2fa/setup');
      setTfaQrCode(data.qrCode);
      setTfaSecret(data.secret);
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to start 2FA setup');
      setTfaModal(null);
    } finally {
      setTfaLoading(false);
    }
  };

  const confirmEnable2FA = async () => {
    if (tfaOtp.replace(/\s/g, '').length !== 6) {
      showToast('error', 'Enter the 6-digit code from your authenticator app');
      return;
    }
    setTfaLoading(true);
    try {
      await api.post('/users/2fa/verify', { token: tfaOtp });
      setTfaEnabled(true);
      setTfaModal(null);
      showToast('success', '2FA enabled — your account is now more secure!');
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Invalid code — please try again');
    } finally {
      setTfaLoading(false);
    }
  };

  const confirmDisable2FA = async () => {
    if (tfaOtp.replace(/\s/g, '').length !== 6) {
      showToast('error', 'Enter the 6-digit code from your authenticator app');
      return;
    }
    setTfaLoading(true);
    try {
      await api.post('/users/2fa/disable', { token: tfaOtp });
      setTfaEnabled(false);
      setTfaModal(null);
      showToast('success', '2FA has been disabled');
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Invalid code — please try again');
    } finally {
      setTfaLoading(false);
    }
  };

  const closeTfaModal = () => {
    setTfaModal(null);
    setTfaOtp('');
    setTfaQrCode('');
    setTfaSecret('');
    setTfaStep(1);
  };

  const SpinBtn = ({ onClick, loading, label, className }) => (
    <button className={className} onClick={onClick} disabled={loading}>
      {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : label}
    </button>
  );

  const tabs = [
    { id: 'profile',       label: 'Profile' },
    { id: 'availability',  label: 'Availability' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security',      label: 'Security' },
  ];

  if (pageLoading) {
    return (
      <CaregiverLayout title="Settings">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#0d9488' }} />
        </div>
      </CaregiverLayout>
    );
  }

  return (
    <CaregiverLayout title="Settings">
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Toast toast={toast} />

      <div className="settings-container relative">

        {/* Header */}
        <div className="settings-header">
          <div className="breadcrumb desktop-only">
            <span>Dashboard</span>
            <span className="separator">›</span>
            <span className="current">Settings</span>
          </div>
          <h1>Account Settings</h1>
          <p className="desktop-only subtitle">
            Manage your professional profile, availability windows, and notification preferences.
          </p>
          <p className="mobile-only subtitle">Customize your schedule and preferences.</p>
        </div>

        <div className="settings-layout">

          {/* Mobile Tabs */}
          <div className="mobile-tabs sticky">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => scrollToSection(tab.id)}
                className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Desktop Sidebar */}
          <div className="settings-sidebar sticky">
            <NavButton active={activeTab === 'profile'}       onClick={() => scrollToSection('profile')}       icon={<User size={18} />}     label="Profile" />
            <NavButton active={activeTab === 'availability'}  onClick={() => scrollToSection('availability')}  icon={<Calendar size={18} />} label="Availability" />
            <NavButton active={activeTab === 'notifications'} onClick={() => scrollToSection('notifications')} icon={<Bell size={18} />}     label="Notifications" />
            <NavButton active={activeTab === 'security'}      onClick={() => scrollToSection('security')}      icon={<Shield size={18} />}   label="Security" />
          </div>

          {/* Content Area */}
          <div className="settings-content">

            {/* ── Profile ── */}
            <div id="profile" className="settings-card">
              <div className="card-header mobile-only">
                <h2>Personal Information</h2>
                <User className="icon-muted" size={20} />
              </div>

              <div className="profile-layout">
                <div className="profile-avatar-container">
                  <div
                    className="profile-avatar-box"
                    onClick={() => avatarInputRef.current?.click()}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                  >
                    {(avatarPreview || user?.avatar_url) ? (
                      <img
                        src={avatarPreview || API_BASE + user.avatar_url}
                        alt="avatar"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '2rem', fontWeight: '700', color: '#94a3b8' }}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                  <button className="edit-avatar-btn" onClick={() => avatarInputRef.current?.click()}>
                    <Edit3 size={14} />
                  </button>
                </div>

                <div className="profile-fields">
                  <InputField label="FULL NAME"      value={profile.name}  onChange={pf('name')}  placeholder="Your full name" />
                  <InputField label="EMAIL ADDRESS"  value={profile.email} onChange={pf('email')} type="email" placeholder="you@example.com" />

                  <div className="desktop-only">
                    <InputField label="PHONE NUMBER" value={profile.phone} onChange={pf('phone')} type="tel" placeholder="+1 (555) 000-0000" />
                  </div>

                  <div className="desktop-only">
                    <div className="settings-input-group">
                      <label>YEARS OF EXPERIENCE</label>
                      <div className="select-wrapper">
                        <select value={profile.experience_years} onChange={pf('experience_years')}>
                          <option value="">Select...</option>
                          <option value="0-1">Less than 1 year</option>
                          <option value="1-3">1–3 years</option>
                          <option value="3-5">3–5 years</option>
                          <option value="5-10">5–10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                        <ChevronRight size={16} className="select-icon rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="desktop-only">
                    <div className="settings-input-group">
                      <label>CERTIFICATION</label>
                      <div className="select-wrapper">
                        <select value={profile.certification} onChange={pf('certification')}>
                          {CERT_OPTIONS.map(o => <option key={o} value={o}>{o || 'Select...'}</option>)}
                        </select>
                        <ChevronRight size={16} className="select-icon rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="desktop-only">
                    <InputField label="LICENSE / ID (optional)" value={profile.license_id} onChange={pf('license_id')} placeholder="e.g. CNA-123456" />
                  </div>

                  <div className="desktop-only">
                    <div className="settings-input-group">
                      <label>HOURLY RATE ($ / hr)</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096', fontWeight: '600', fontSize: '0.95rem' }}>$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={profile.hourly_rate}
                          onChange={pf('hourly_rate')}
                          placeholder="e.g. 25"
                          style={{ paddingLeft: '1.8rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="full-width">
                    <div className="settings-input-group">
                      <label>BIO</label>
                      <textarea value={profile.bio} onChange={pf('bio')} placeholder="Tell families about yourself..." rows={3} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-actions desktop-only">
                <SpinBtn
                  onClick={saveProfile}
                  loading={saving === 'profile'}
                  label="Save Changes"
                  className="btn-primary-teal"
                />
              </div>
            </div>

            {/* ── Availability ── */}
            <div id="availability" className="availability-layout">
              <div className="settings-card flex-2">
                <div className="card-header">
                  <h2>Weekly Schedule</h2>
                  <Calendar className="icon-muted mobile-only" size={20} />
                  <Calendar className="icon-teal desktop-only" size={20} />
                </div>

                <div className="schedule-list">
                  <ScheduleRow
                    day="Mon – Fri"
                    startVal={availability.schedule_weekday_start}
                    endVal={availability.schedule_weekday_end}
                    active={availability.schedule_weekday_active}
                    onToggle={() => av('schedule_weekday_active')(!availability.schedule_weekday_active)}
                    onStartChange={avE('schedule_weekday_start')}
                    onEndChange={avE('schedule_weekday_end')}
                  />
                  <ScheduleRow
                    day="Sat"
                    startVal={availability.schedule_sat_start}
                    endVal={availability.schedule_sat_end}
                    active={availability.schedule_sat_active}
                    onToggle={() => av('schedule_sat_active')(!availability.schedule_sat_active)}
                    onStartChange={avE('schedule_sat_start')}
                    onEndChange={avE('schedule_sat_end')}
                  />
                  <ScheduleRow
                    day="Sun"
                    active={availability.schedule_sun_active}
                    onToggle={() => av('schedule_sun_active')(!availability.schedule_sun_active)}
                  />
                </div>

                <p className="mobile-only note">* Clients can only book during your active hours.</p>

                <div className="card-actions" style={{ marginTop: '12px' }}>
                  <SpinBtn
                    onClick={saveAvailability}
                    loading={saving === 'availability'}
                    label="Save Schedule"
                    className="btn-primary-teal"
                  />
                </div>
              </div>

              <div className="settings-card flex-1 center-content">
                <div className="card-header mobile-only full-width">
                  <h2>Status</h2>
                  <Toggle active={availability.is_available} onChange={() => av('is_available')(!availability.is_available)} />
                </div>
                <div className="card-header desktop-only full-width">
                  <h2>Status Toggle</h2>
                  <Toggle active={availability.is_available} onChange={() => av('is_available')(!availability.is_available)} />
                </div>
                <div className="status-icon-wrapper">
                  <Zap className="icon-zap" size={24} />
                </div>
                <h3 className="status-title">
                  {availability.is_available ? 'Accepting New Cases' : 'Not Accepting Cases'}
                </h3>
                <p className="status-desc">
                  {availability.is_available
                    ? 'Your profile is visible to families seeking caregivers.'
                    : 'Your profile is hidden from new family searches.'}
                </p>
              </div>
            </div>

            {/* ── Notifications ── */}
            <div id="notifications" className="settings-card">
              <div className="card-header">
                <h2 className="mobile-only">Alert Preferences</h2>
                <h2 className="desktop-only">Notification Preferences</h2>
                <Bell className="icon-muted mobile-only" size={20} />
              </div>

              <div className="notifications-list">
                <NotificationRow
                  title="Messages & Chat"
                  desc="Real-time alerts when a family member sends a message."
                  active={notifications.notif_messages}
                  colorClass="bg-teal"
                  onToggle={nt('notif_messages')}
                />
                <NotificationRow
                  title="Health Updates"
                  desc="Critical notifications regarding patient health trends."
                  active={notifications.notif_health}
                  colorClass="bg-orange"
                  onToggle={nt('notif_health')}
                />
                <NotificationRow
                  title="Visit Reminders"
                  desc="Automated nudges for upcoming scheduled home visits."
                  active={notifications.notif_visits}
                  colorClass="bg-gray"
                  onToggle={nt('notif_visits')}
                />
              </div>

              <div className="card-actions" style={{ marginTop: '16px' }}>
                <SpinBtn
                  onClick={saveNotifications}
                  loading={saving === 'notifications'}
                  label="Save Preferences"
                  className="btn-primary-teal"
                />
              </div>
            </div>

            {/* ── Security ── */}
            <div id="security" className="settings-card">
              <div className="card-header mobile-only">
                <h2>Security</h2>
                <Lock className="icon-muted" size={20} />
              </div>
              <h2 className="desktop-only section-title">Security &amp; Authentication</h2>

              <div className="security-grid desktop-only">
                <InputField
                  label="CURRENT PASSWORD" type="password"
                  value={security.currentPassword}
                  onChange={e => setSecurity(s => ({ ...s, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
                <InputField
                  label="NEW PASSWORD" type="password"
                  value={security.newPassword}
                  onChange={e => setSecurity(s => ({ ...s, newPassword: e.target.value }))}
                  placeholder="Min. 8 characters"
                />
                <InputField
                  label="CONFIRM PASSWORD" type="password"
                  value={security.confirmPassword}
                  onChange={e => setSecurity(s => ({ ...s, confirmPassword: e.target.value }))}
                  placeholder="Repeat new password"
                />
              </div>

              <div className="security-actions desktop-only">
                <SpinBtn
                  onClick={savePassword}
                  loading={saving === 'password'}
                  label="Update Security"
                  className="btn-dark"
                />
                {tfaEnabled ? (
                  <button className="btn-link tfa-disable-link" onClick={() => { setTfaOtp(''); setTfaModal('disable'); }}>
                    <ShieldOff size={15} /> Disable Two-Factor Auth
                  </button>
                ) : (
                  <button className="btn-link" onClick={openEnableModal}>
                    <ShieldCheck size={15} /> Enable Two-Factor Auth
                  </button>
                )}
              </div>

              <div className="security-mobile-list mobile-only">
                <button className="security-mobile-btn" onClick={() => {}}>
                  <span>Change Password</span>
                  <ChevronRight size={18} className="icon-muted" />
                </button>
                <button
                  className="security-mobile-btn"
                  onClick={tfaEnabled
                    ? () => { setTfaOtp(''); setTfaModal('disable'); }
                    : openEnableModal
                  }
                >
                  <span>Two-Factor Authentication</span>
                  {tfaEnabled
                    ? <span className="badge-enabled">ENABLED</span>
                    : <span className="badge-disabled">DISABLED</span>
                  }
                </button>
              </div>
            </div>

            {/* ── 2FA Modal ── */}
            {tfaModal && (
              <div className="tfa-overlay" onClick={closeTfaModal}>
                <div className="tfa-modal" onClick={e => e.stopPropagation()}>

                  {/* Header */}
                  <div className="tfa-modal-header">
                    <div className="tfa-modal-icon">
                      {tfaModal === 'setup' ? <ShieldCheck size={22} /> : <ShieldOff size={22} />}
                    </div>
                    <div>
                      <h3>{tfaModal === 'setup' ? 'Enable Two-Factor Authentication' : 'Disable Two-Factor Authentication'}</h3>
                      <p>{tfaModal === 'setup'
                        ? 'Add an extra layer of security to your account.'
                        : 'Remove the extra security layer from your account.'
                      }</p>
                    </div>
                    <button className="tfa-close-btn" onClick={closeTfaModal}><X size={18} /></button>
                  </div>

                  {tfaLoading && tfaModal === 'setup' && tfaStep === 1 ? (
                    <div className="tfa-loading">
                      <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#0d9488' }} />
                      <p>Generating your QR code…</p>
                    </div>
                  ) : tfaModal === 'setup' ? (
                    <>
                      {/* Step indicator */}
                      <div className="tfa-steps">
                        <div className={`tfa-step ${tfaStep >= 1 ? 'active' : ''}`}>
                          <div className="tfa-step-num">1</div>
                          <span>Scan QR</span>
                        </div>
                        <div className="tfa-step-line" />
                        <div className={`tfa-step ${tfaStep >= 2 ? 'active' : ''}`}>
                          <div className="tfa-step-num">2</div>
                          <span>Verify Code</span>
                        </div>
                      </div>

                      {tfaStep === 1 ? (
                        <>
                          <p className="tfa-instruction">
                            Open <strong>Google Authenticator</strong>, <strong>Authy</strong>, or any TOTP app
                            and scan the QR code below.
                          </p>
                          <div className="tfa-qr-wrapper">
                            {tfaQrCode && <img src={tfaQrCode} alt="2FA QR Code" className="tfa-qr-img" />}
                          </div>
                          <details className="tfa-manual">
                            <summary><ScanLine size={14} /> Can't scan? Enter key manually</summary>
                            <code className="tfa-secret-code">{tfaSecret}</code>
                          </details>
                          <div className="tfa-modal-actions">
                            <button className="btn-outline-gray" onClick={closeTfaModal}>Cancel</button>
                            <button className="btn-primary-teal" onClick={() => setTfaStep(2)}>
                              I've scanned it →
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="tfa-instruction">
                            Enter the <strong>6-digit code</strong> shown in your authenticator app to confirm setup.
                          </p>
                          <input
                            className="tfa-otp-input"
                            type="text"
                            inputMode="numeric"
                            maxLength={7}
                            placeholder="_ _ _ _ _ _"
                            value={tfaOtp}
                            onChange={e => setTfaOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            autoFocus
                          />
                          <div className="tfa-modal-actions">
                            <button className="btn-outline-gray" onClick={() => setTfaStep(1)}>← Back</button>
                            <button
                              className="btn-primary-teal"
                              onClick={confirmEnable2FA}
                              disabled={tfaLoading}
                            >
                              {tfaLoading
                                ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                : 'Activate 2FA'
                              }
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    /* ── Disable flow ── */
                    <>
                      <p className="tfa-instruction">
                        Enter the <strong>6-digit code</strong> from your authenticator app to confirm disabling 2FA.
                      </p>
                      <input
                        className="tfa-otp-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={7}
                        placeholder="_ _ _ _ _ _"
                        value={tfaOtp}
                        onChange={e => setTfaOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        autoFocus
                      />
                      <div className="tfa-modal-actions">
                        <button className="btn-outline-gray" onClick={closeTfaModal}>Cancel</button>
                        <button
                          className="btn-danger"
                          onClick={confirmDisable2FA}
                          disabled={tfaLoading}
                        >
                          {tfaLoading
                            ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                            : 'Disable 2FA'
                          }
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Mobile action row */}
            <div className="mobile-actions mobile-only">
              <button className="btn-outline-red" onClick={logout}>
                <LogOut size={18} /> Sign Out
              </button>
              <button
                className="btn-primary-teal full-width-btn"
                onClick={saveAll}
                disabled={saving !== ''}
              >
                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><CheckCircle2 size={18} /> Save All Changes</>}
              </button>
            </div>

          </div>
        </div>
      </div>
    </CaregiverLayout>
  );
};

export default CaregiverSettings;
