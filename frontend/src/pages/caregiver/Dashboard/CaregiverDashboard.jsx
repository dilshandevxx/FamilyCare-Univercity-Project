import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import {
  Users, FileText, CheckCircle, AlertTriangle,
  ArrowRight, CheckSquare, Square, Loader2,
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

// ── Activity Feed (static for now, real logs to come) ─────────────

const ACTIVITY = [
  { id: 1, icon: 'teal',   Icon: CheckCircle,    title: 'Morning Medication Administered', desc: 'Logged by You',       time: '10:45 AM' },
  { id: 2, icon: 'orange', Icon: AlertTriangle,  title: 'Elevated Heart Rate Detected',     desc: 'Auto-monitored',      time: '09:12 AM' },
  { id: 3, icon: 'slate',  Icon: FileText,       title: 'Breakfast Log Entry',              desc: 'Full meal consumed',  time: '08:00 AM' },
];

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
  const [stats, setStats]           = useState({ total_residents: 0, logs_today: 0, pending_tasks: 0, urgent_count: 0 });
  const [residents, setResidents]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);

  // Health-entry form state
  const [selectedParent, setSelectedParent] = useState('');
  const [bp, setBp]                 = useState('');
  const [temp, setTemp]             = useState('');
  const [mealStatus, setMealStatus] = useState('Full');
  const [notes, setNotes]           = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Tasks (static demo — swap for real API when appointments are seeded)
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Blood Pressure Check (Eleanor)', time: 'Completed at 09:00 AM', done: true },
    { id: 2, title: 'Insulin Shot (Clara)',            time: 'Scheduled for 12:30 PM', done: false, urgent: true },
    { id: 3, title: 'Physical Therapy Assist (Robert)',time: 'Scheduled for 02:00 PM', done: false },
    { id: 4, title: 'Daily Hygiene Check (All)',       time: 'Self-paced task',        done: false },
  ]);

  // ── Load on mount ──────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: statsData }, { data: residentsData }] = await Promise.all([
          api.get('/users/dashboard-stats'),
          api.get('/users/my-residents'),
        ]);
        setStats(statsData);
        setResidents(residentsData);
        if (residentsData.length > 0) setSelectedParent(String(residentsData[0].id));
      } catch (err) {
        showToast('error', 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Helpers ────────────────────────────────────────────
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleTask = (id) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const doneCount = tasks.filter(t => t.done).length;

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
              <span className="stat-label">Total</span>
            </div>
            <div>
              <h2 className="stat-value">{String(stats.total_residents).padStart(2, '0')}</h2>
              <p className="stat-desc">Assigned<br />Elders</p>
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

          <div className="stat-card urgent">
            <div className="stat-header">
              <div className="stat-icon red"><AlertTriangle size={20} /></div>
              <span className="stat-label red">Urgent</span>
            </div>
            <div>
              <h2 className="stat-value red">{String(stats.urgent_count).padStart(2, '0')}</h2>
              <p className="stat-desc red">Active Alerts</p>
            </div>
          </div>
        </div>

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
                            {r.age} Years{r.room_number ? ` • Room ${r.room_number}` : ''}
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
                {ACTIVITY.map((item, idx) => (
                  <div key={item.id} className="activity-item">
                    <div className={`activity-icon ${item.icon}`}>
                      <item.Icon size={14} />
                    </div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <h5 className="activity-title">{item.title}</h5>
                        <span className="activity-time">{item.time}</span>
                      </div>
                      <p className="activity-desc">{item.desc}</p>
                    </div>
                    {idx < ACTIVITY.length - 1 && <div className="activity-line" />}
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
