import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import {
  Users, FileText, CheckCircle, AlertTriangle,
  ArrowRight, CheckSquare, Square, Loader2,
  UserPlus, Check, X, Phone, Mail, Clock, AlertCircle, Sparkles
} from 'lucide-react';
import api from '../../../services/api';
import './CaregiverDashboard.css';

const API_BASE = 'http://localhost:5000';

// ── Helpers ───────────────────────────────────────────────────────

const careStatusClass = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'CRITICAL':         return 'care-badge critical';
    case 'NEEDS ATTENTION':  return 'care-badge attention';
    case 'MODERATE CARE':    return 'care-badge moderate';
    default:                 return 'care-badge stable';
  }
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return isToday ? `Today, ${time}` : `Yesterday, ${time}`;
};

const residentAvatar = (name) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'elder')}`;

// ── Toast ─────────────────────────────────────────────────────────

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
      {ok ? <CheckCircle size={16} /> : '✕'} {toast.message}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────

const CaregiverDashboard = () => {
  const navigate = useNavigate();

  // ── state ──────────────────────────────────────────────
  const [stats, setStats]           = useState({ total_residents: 0, max_capacity: 4, pending_requests: 0, logs_today: 0, pending_tasks: 0, urgent_count: 0, pendingTasksList: [], recentActivity: [] });
  const [residents, setResidents]   = useState([]);
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);

  // Reject modal / inline state
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Reached maximum capacity (4/4 residents)');
  const [actionLoading, setActionLoading] = useState(false);

  // Health-entry form state
  const [selectedParent, setSelectedParent] = useState('');
  const [bp, setBp]                 = useState('');
  const [temp, setTemp]             = useState('');
  const [mealStatus, setMealStatus] = useState('Full');
  const [notes, setNotes]           = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // ── Load on mount ──────────────────────────────────────
  const loadDashboard = async () => {
    try {
      const [{ data: statsData }, { data: residentsData }, { data: requestsData }] = await Promise.all([
        api.get('/users/dashboard-stats'),
        api.get('/users/my-residents'),
        api.get('/users/caregiver-requests'),
      ]);
      setStats(statsData);
      setResidents(residentsData);
      setRequests(requestsData?.requests || []);
      if (residentsData.length > 0 && !selectedParent) setSelectedParent(String(residentsData[0].id));
      
      if (statsData.pendingTasksList) {
        setTasks(statsData.pendingTasksList.map(p => ({
          id: p.id,
          title: `Log health for ${p.name}`,
          time: 'Required Today',
          done: false
        })));
      }
      if (statsData.recentActivity) {
        setRecentActivity(statsData.recentActivity);
      }
    } catch (err) {
      showToast('error', 'Could not load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ── Helpers ────────────────────────────────────────────
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleTask = (id) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const doneCount = tasks.filter(t => t.done).length;

  // ── Handle Accept Care Request ─────────────────────────
  const handleAcceptRequest = async (parentId, parentName) => {
    setActionLoading(true);
    try {
      await api.put(`/users/caregiver-requests/${parentId}/accept`);
      showToast('success', `Accepted care assignment for ${parentName}!`);
      await loadDashboard();
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to accept request');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Handle Reject Care Request ─────────────────────────
  const handleRejectRequest = async (parentId, parentName) => {
    setActionLoading(true);
    try {
      await api.put(`/users/caregiver-requests/${parentId}/reject`, {
        reason: rejectReason
      });
      showToast('success', `Declined request for ${parentName}`);
      setRejectingId(null);
      await loadDashboard();
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to decline request');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Submit Quick Health Entry ──────────────────────────
  const handleSubmit = async () => {
    if (!selectedParent) { showToast('error', 'Please select a resident'); return; }
    setSubmitting(true);
    try {
      await api.post('/health', {
        parent_id:      parseInt(selectedParent),
        blood_pressure: bp    || null,
        temperature:    temp  || null,
        meal_status:    mealStatus,
        notes:          notes || null,
      });
      showToast('success', 'Health log submitted!');
      setBp(''); setTemp(''); setNotes(''); setMealStatus('Full');

      // Refresh stats + residents after submitting
      const [{ data: s }, { data: r }] = await Promise.all([
        api.get('/users/dashboard-stats'),
        api.get('/users/my-residents'),
      ]);
      setStats(s);
      setResidents(r);
      if (s.pendingTasksList) {
        setTasks(s.pendingTasksList.map(p => ({
          id: p.id,
          title: `Log health for ${p.name}`,
          time: 'Required Today',
          done: false
        })));
      }
      if (s.recentActivity) {
        setRecentActivity(s.recentActivity);
      }
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to submit log');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <CaregiverLayout title="Dashboard">
      <Toast toast={toast} />

      <div className="dashboard-container">

        {/* ── Stat Cards ── */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon teal"><Users size={20} /></div>
              <span className="stat-label">Capacity ({stats.total_residents}/{stats.max_capacity || 4})</span>
            </div>
            <div>
              <h2 className="stat-value">
                {String(stats.total_residents).padStart(2, '0')}<span style={{ fontSize: '18px', color: '#94a3b8', fontWeight: 600 }}>/{stats.max_capacity || 4}</span>
              </h2>
              <p className="stat-desc">
                {stats.total_residents >= (stats.max_capacity || 4) ? (
                  <span style={{ color: '#ea580c', fontWeight: 700 }}>● Full Capacity</span>
                ) : (
                  <span style={{ color: '#0d9488', fontWeight: 700 }}>● {(stats.max_capacity || 4) - stats.total_residents} Spot{(stats.max_capacity || 4) - stats.total_residents > 1 ? 's' : ''} Open</span>
                )}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon orange"><FileText size={20} /></div>
              <span className="stat-label">Today</span>
            </div>
            <div>
              <h2 className="stat-value">{String(stats.logs_today).padStart(2, '0')}</h2>
              <p className="stat-desc">Logs<br />Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon emerald"><CheckCircle size={20} /></div>
              <span className="stat-label">Remaining</span>
            </div>
            <div>
              <h2 className="stat-value">{String(stats.pending_tasks).padStart(2, '0')}</h2>
              <p className="stat-desc">Pending<br />Tasks</p>
            </div>
          </div>

          <div className={`stat-card ${requests.length > 0 ? 'request-highlight' : 'urgent'}`}>
            <div className="stat-header">
              <div className="stat-icon red">
                {requests.length > 0 ? <UserPlus size={20} style={{ color: '#0284c7' }} /> : <AlertTriangle size={20} />}
              </div>
              <span className={`stat-label ${requests.length > 0 ? 'blue' : 'red'}`}>
                {requests.length > 0 ? 'Incoming Requests' : 'Urgent'}
              </span>
            </div>
            <div>
              <h2 className={`stat-value ${requests.length > 0 ? 'blue' : 'red'}`}>
                {requests.length > 0 ? String(requests.length).padStart(2, '0') : String(stats.urgent_count).padStart(2, '0')}
              </h2>
              <p className={`stat-desc ${requests.length > 0 ? 'blue' : 'red'}`}>
                {requests.length > 0 ? 'Care Requests Awaiting Approval' : 'Active Alerts'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Incoming Care Requests Banner / Section (if any) ── */}
        {requests.length > 0 && (
          <section className="care-requests-banner" style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #bae6fd',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 16px rgba(2, 132, 199, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: '#0284c7', color: 'white', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center'
                }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Incoming Care Assignment Requests
                    <span style={{
                      background: '#0284c7', color: 'white', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 700
                    }}>
                      {requests.length} New
                    </span>
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#0284c7' }}>
                    Family members requested you to care for their elder. Please accept or decline based on your workload.
                  </p>
                </div>
              </div>

              {stats.total_residents >= (stats.max_capacity || 4) && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: '#fff7ed', border: '1px solid #fdba74', color: '#c2410c',
                  padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700
                }}>
                  <AlertCircle size={15} /> You are at full capacity ({stats.total_residents}/{stats.max_capacity || 4})
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {requests.map(req => (
                <div key={req.id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={residentAvatar(req.name)}
                          alt={req.name}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#f1f5f9' }}
                        />
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>{req.name}</h4>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                            {req.age ? `${req.age} yrs` : 'Age unknown'}{req.gender ? ` • ${req.gender}` : ''}{req.relationship ? ` (${req.relationship})` : ''}
                          </span>
                        </div>
                      </div>
                      <span style={{
                        background: '#fef3c7', color: '#92400e', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '8px'
                      }}>
                        Pending
                      </span>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', fontSize: '0.8rem', marginBottom: '12px' }}>
                      <div style={{ color: '#475569', marginBottom: '4px' }}>
                        <strong>Requested By:</strong> {req.child_name || 'Family Member'} {req.child_phone ? `(${req.child_phone})` : ''}
                      </div>
                      {req.medical_conditions && (
                        <div style={{ color: '#475569', marginBottom: '4px' }}>
                          <strong>Medical:</strong> {req.medical_conditions}
                        </div>
                      )}
                      {req.allergies && (
                        <div style={{ color: '#dc2626' }}>
                          <strong>Allergies:</strong> {req.allergies}
                        </div>
                      )}
                    </div>
                  </div>

                  {rejectingId === req.id ? (
                    <div style={{
                      background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '12px', marginTop: '6px'
                    }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9f1239', display: 'block', marginBottom: '6px' }}>
                        Select Reason for Declining:
                      </label>
                      <select
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #fda4af', fontSize: '0.78rem', marginBottom: '8px', background: 'white' }}
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                      >
                        <option value="Reached maximum capacity (4/4 residents)">Reached maximum capacity (4/4 residents)</option>
                        <option value="Schedule or working hours conflict">Schedule or working hours conflict</option>
                        <option value="Specialized medical care required">Specialized medical care required</option>
                        <option value="Location / distance not serviceable">Location / distance not serviceable</option>
                      </select>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          style={{ flex: 1, padding: '7px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                          onClick={() => handleRejectRequest(req.id, req.name)}
                          disabled={actionLoading}
                        >
                          Confirm Decline
                        </button>
                        <button
                          style={{ padding: '7px 12px', background: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                          onClick={() => setRejectingId(null)}
                          disabled={actionLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: '#0d9488',
                          color: 'white',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(13,148,136,0.2)'
                        }}
                        onClick={() => handleAcceptRequest(req.id, req.name)}
                        disabled={actionLoading}
                      >
                        <Check size={16} /> Accept Assignment
                      </button>
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: '#fff1f2',
                          color: '#e11d48',
                          border: '1px solid #fecdd3',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setRejectingId(req.id);
                          setRejectReason(stats.total_residents >= (stats.max_capacity || 4)
                            ? `Reached maximum capacity (${stats.total_residents}/${stats.max_capacity || 4} residents)`
                            : 'Reached maximum capacity (4/4 residents)');
                        }}
                        disabled={actionLoading}
                      >
                        <X size={16} /> Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Main Grid ── */}
        <div className="main-grid">

          {/* Left Column */}
          <div className="left-column">

            {/* My Residents */}
            <section>
              <div className="section-header">
                <h3 className="section-title">My Residents</h3>
                <button className="view-all-btn" onClick={() => navigate('/caregiver/residents')}>
                  View All <ArrowRight size={14} />
                </button>
              </div>

              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                  <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: '#0d9488' }} />
                </div>
              ) : residents.length === 0 ? (
                <div className="empty-state">
                  <Users size={32} style={{ color: '#cbd5e1', marginBottom: 8 }} />
                  <p>No residents assigned yet.</p>
                  <small>Ask your admin to assign residents to your account.</small>
                </div>
              ) : (
                <div className="residents-grid">
                  {residents.slice(0, 2).map(r => (
                    <div key={r.id} className="resident-card">
                      <div className="resident-info">
                        <div className="resident-avatar">
                          <img src={residentAvatar(r.name)} alt={r.name} />
                        </div>
                        <div>
                          <h4 className="resident-name">{r.name}</h4>
                          <p className="resident-meta">
                            {r.age ? `${r.age} Years` : 'Age unknown'}{r.room_number ? ` • Room ${r.room_number}` : ''}
                          </p>
                          <span className={careStatusClass(r.care_status)}>
                            {(r.care_status || 'STABLE').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="resident-stats">
                        <div className="stat-row">
                          <span className="label">Condition</span>
                          <span className="value">{r.medical_conditions || '—'}</span>
                        </div>
                        <div className="stat-row">
                          <span className="label">Last Update</span>
                          <span className="value">{formatDate(r.last_update)}</span>
                        </div>
                      </div>

                      <div className="resident-actions">
                        <button
                          className="btn-secondary"
                          onClick={() => navigate(`/caregiver/residents`)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn-primary"
                          onClick={() => {
                            setSelectedParent(String(r.id));
                            document.querySelector('.quick-entry')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Add Log
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Activity Feed */}
            <section className="activity-feed">
              <h3 className="section-title" style={{ marginBottom: 24 }}>Recent Activity Feed</h3>
              <div className="activity-list">
                {recentActivity.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '13px' }}>No recent activity.</p>
                ) : recentActivity.map((item, idx) => (
                  <div key={item.id} className="activity-item">
                    <div className="activity-icon teal">
                      <FileText size={14} />
                    </div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <h5 className="activity-title">Health Log: {item.elder_name}</h5>
                        <span className="activity-time">{formatDate(item.logged_at)}</span>
                      </div>
                      <p className="activity-desc">
                        {item.overall_condition} 
                        {item.blood_pressure && ` • BP: ${item.blood_pressure}`}
                        {item.temperature && ` • Temp: ${item.temperature}`}
                      </p>
                    </div>
                    {idx < recentActivity.length - 1 && <div className="activity-line" />}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="right-column">

            {/* Quick Health Entry */}
            <div className="quick-entry">
              <h3 className="section-title" style={{ marginBottom: 20 }}>Quick Health Entry</h3>

              <div className="form-group">
                <label className="form-label">Select Resident</label>
                <select
                  className="form-select"
                  value={selectedParent}
                  onChange={e => setSelectedParent(e.target.value)}
                >
                  {residents.length === 0 && (
                    <option value="">— No residents assigned —</option>
                  )}
                  {residents.map(r => (
                    <option key={r.id} value={String(r.id)}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div>
                  <label className="form-label">BP (mmHg)</label>
                  <input
                    type="text"
                    placeholder="120/80"
                    className="form-input"
                    value={bp}
                    onChange={e => setBp(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Temp (°F)</label>
                  <input
                    type="text"
                    placeholder="98.6"
                    className="form-input"
                    value={temp}
                    onChange={e => setTemp(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Meal Status</label>
                <div className="meal-status-group">
                  {['Full', 'Partial', 'None'].map(s => (
                    <button
                      key={s}
                      onClick={() => setMealStatus(s)}
                      className={`meal-btn ${mealStatus === s ? 'active' : ''}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  placeholder="Any behavioral changes?"
                  className="form-textarea"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={submitting || residents.length === 0}
              >
                {submitting
                  ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  : 'Submit Log Entry'
                }
              </button>
            </div>

            {/* Tasks for Today */}
            <div className="tasks-card">
              <div className="tasks-header">
                <h3 className="section-title" style={{ margin: 0 }}>Tasks for Today</h3>
                <span className="tasks-badge">{doneCount}/{tasks.length} Done</span>
              </div>
              <div className="tasks-list">
                {tasks.map(t => (
                  <div key={t.id} className={`task-item ${t.done ? 'completed' : ''}`}>
                    <button className="task-checkbox" onClick={() => toggleTask(t.id)}>
                      {t.done
                        ? <CheckSquare size={18} fill="currentColor" color="white" />
                        : <Square size={18} />
                      }
                    </button>
                    <div className="task-info">
                      <p className="task-title">{t.title}</p>
                      <p className={`task-time ${t.urgent ? 'orange' : ''}`}>{t.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgent Alerts */}
            {stats.urgent_count > 0 && (
              <div className="urgent-card">
                <div className="urgent-header">
                  <AlertTriangle size={18} />
                  <h3 className="urgent-title">Urgent Alerts</h3>
                </div>
                <div className="alerts-list">
                  {residents.filter(r => ['CRITICAL', 'NEEDS ATTENTION'].includes((r.care_status || '').toUpperCase()))
                    .map(r => (
                      <div key={r.id} className="alert-item">
                        <h4 className="alert-type">{r.care_status}</h4>
                        <p className="alert-desc">
                          {r.name}
                          {r.blood_pressure ? ` — BP: ${r.blood_pressure}` : ''}
                          {r.temperature ? `, Temp: ${r.temperature}°F` : ''}
                        </p>
                      </div>
                    ))
                  }
                </div>
                <button className="ack-btn">Acknowledge All Alerts</button>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </CaregiverLayout>
  );
};

export default CaregiverDashboard;
