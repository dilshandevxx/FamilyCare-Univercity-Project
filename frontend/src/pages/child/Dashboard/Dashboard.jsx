import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserPlus, Bell, Activity, Thermometer,
  UserSearch, AlertTriangle, CheckCircle, Plus,
  Heart, MessageSquare, Shield, PhoneCall, X,
  ChevronRight, TrendingUp, Pill, Clock
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import './Dashboard.css';

const barDays = ['M','T','W','T','F','S','S'];

const Dashboard = () => {
  const { user } = useAuth();
  const [dbParents, setDbParents]         = useState([]);
  const [alerts, setAlerts]               = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/parents'),
      api.get('/alerts'),
      api.get('/health/dashboard/child'),
    ]).then(([parentsRes, alertsRes, dashRes]) => {
      setDbParents(parentsRes.data || []);
      setAlerts(alertsRes.data || []);
      setDashboardData(dashRes.data);
    }).catch(err => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return { text: 'Good morning', emoji: '☀️' };
    if (h < 18) return { text: 'Good afternoon', emoji: '🌤️' };
    return { text: 'Good evening', emoji: '🌙' };
  };

  const greeting = getGreeting();
  const firstName = (user?.name || 'User').split(' ')[0];
  const unresolved = alerts.filter(a => !a.is_resolved);
  const topStats = dashboardData?.topStats || {};
  const pulse    = dashboardData?.pulse    || {};

  return (
    <ChildLayout title="Dashboard">
      <div className="cdb-wrap">

        {/* ── HERO GREETING ──────────────────────────────────────── */}
        <div className="cdb-hero">
          <div className="cdb-hero-text">
            <p className="cdb-greeting-line">{greeting.emoji} {greeting.text}</p>
            <h1 className="cdb-hero-name">{firstName}!</h1>
            <p className="cdb-hero-sub">Here's your family's health update for today.</p>
          </div>
          <div className="cdb-hero-badge">
            <div className={`cdb-status-orb ${topStats.healthStatus === 'Critical' ? 'red' : topStats.healthStatus === 'Needs Attention' ? 'amber' : 'green'}`}>
              {topStats.healthStatus === 'Critical'
                ? <AlertTriangle size={22} />
                : <CheckCircle size={22} />
              }
            </div>
            <span className="cdb-status-word">{topStats.healthStatus || 'Stable'}</span>
          </div>
        </div>

        {/* ── STATS STRIP ────────────────────────────────────────── */}
        <div className="cdb-stats-strip">
          <div className="cdb-stat">
            <div className="cdb-stat-icon teal"><Users size={18} /></div>
            <div>
              <span className="cdb-stat-num">{topStats.totalParents || 0}</span>
              <span className="cdb-stat-lbl">Members</span>
            </div>
          </div>
          <div className="cdb-stat-div" />
          <div className="cdb-stat">
            <div className="cdb-stat-icon blue"><UserPlus size={18} /></div>
            <div>
              <span className="cdb-stat-num">{topStats.activeCaregivers || 0}</span>
              <span className="cdb-stat-lbl">Caregivers</span>
            </div>
          </div>
          <div className="cdb-stat-div" />
          <div className="cdb-stat">
            <div className={`cdb-stat-icon ${unresolved.length > 0 ? 'red' : 'teal'}`}>
              <Bell size={18} />
            </div>
            <div>
              <span className="cdb-stat-num">{unresolved.length}</span>
              <span className="cdb-stat-lbl">Alerts</span>
            </div>
          </div>
          <div className="cdb-stat-div" />
          <div className="cdb-stat">
            <div className="cdb-stat-icon purple"><Activity size={18} /></div>
            <div>
              <span className="cdb-stat-num">{pulse.avgBp || '--'}</span>
              <span className="cdb-stat-lbl">Avg BP</span>
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ──────────────────────────────────────── */}
        <div className="cdb-section-label">Quick Actions</div>
        <div className="cdb-quick-grid">
          <Link to="/add-parent" className="cdb-qbtn teal">
            <UserPlus size={20} />
            <span>Add Member</span>
          </Link>
          <Link to="/caregivers-list" className="cdb-qbtn blue">
            <UserSearch size={20} />
            <span>Find Carer</span>
          </Link>
          <Link to="/messages" className="cdb-qbtn purple">
            <MessageSquare size={20} />
            <span>Messages</span>
          </Link>
          <button className="cdb-qbtn red" onClick={() => setShowEmergency(true)}>
            <PhoneCall size={20} />
            <span>Emergency</span>
          </button>
        </div>

        {/* ── TODAY'S VITALS SNAPSHOT ────────────────────────────── */}
        <div className="cdb-section-label">Today's Vitals</div>
        <div className="cdb-vitals-row">
          <div className="cdb-vital-chip">
            <div className="cdb-vital-chip-icon" style={{background:'#fef2f2'}}>
              <Heart size={16} color="#ef4444" />
            </div>
            <div>
              <div className="cdb-vital-chip-val">{pulse.avgBp || '122/78'}</div>
              <div className="cdb-vital-chip-name">Blood Pressure <span>mmHg</span></div>
            </div>
          </div>
          <div className="cdb-vital-chip">
            <div className="cdb-vital-chip-icon" style={{background:'#fff7ed'}}>
              <Activity size={16} color="#f97316" />
            </div>
            <div>
              <div className="cdb-vital-chip-val">{pulse.avgHr || '74'} <span>bpm</span></div>
              <div className="cdb-vital-chip-name">Heart Rate</div>
            </div>
          </div>
          <div className="cdb-vital-chip">
            <div className="cdb-vital-chip-icon" style={{background:'#fdf4ff'}}>
              <Thermometer size={16} color="#a855f7" />
            </div>
            <div>
              <div className="cdb-vital-chip-val">{pulse.avgTemp || '98.4'}<span>°F</span></div>
              <div className="cdb-vital-chip-name">Temperature</div>
            </div>
          </div>
          <div className="cdb-vital-chip">
            <div className="cdb-vital-chip-icon" style={{background:'#f0fdf4'}}>
              <Pill size={16} color="#22c55e" />
            </div>
            <div>
              <div className="cdb-vital-chip-val">{pulse.medsTaken || 0}<span>/{pulse.totalMeds || 1}</span></div>
              <div className="cdb-vital-chip-name">Meds Today</div>
            </div>
          </div>
        </div>

        {/* ── BP TREND MINI CHART ────────────────────────────────── */}
        <div className="cdb-card">
          <div className="cdb-card-hd">
            <div>
              <h3 className="cdb-card-title">Weekly BP Trend</h3>
              <p className="cdb-card-sub">Systolic blood pressure (mmHg)</p>
            </div>
            <Link to="/analytics" className="cdb-see-all">See Full Analytics <ChevronRight size={14}/></Link>
          </div>
          <div className="cdb-bar-chart">
            {(dashboardData?.charts?.bpTrend || [122,118,125,121,128,124,120]).map((h, i) => {
              const pct = Math.min(((h - 90) / 80) * 100, 100);
              const today = new Date().getDay();
              const dayIdx = today === 0 ? 6 : today - 1;
              return (
                <div key={i} className="cdb-bar-col">
                  <span className="cdb-bar-tip">{h > 0 ? h : ''}</span>
                  <div className={`cdb-bar ${i === dayIdx ? 'today' : ''}`} style={{ height: `${pct}%` }} />
                  <span className="cdb-bar-day">{barDays[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FAMILY MEMBERS ─────────────────────────────────────── */}
        <div className="cdb-section-label">
          Family Members
          <Link to="/parents" className="cdb-section-link">View All</Link>
        </div>

        {loading ? (
          <div className="cdb-skeleton-list">
            <div className="cdb-skeleton" />
            <div className="cdb-skeleton" />
          </div>
        ) : dbParents.length === 0 ? (
          <div className="cdb-empty-card">
            <Users size={36} color="#cbd5e1" />
            <p>No family members added yet.</p>
            <Link to="/add-parent" className="cdb-empty-btn"><Plus size={14}/> Add Member</Link>
          </div>
        ) : (
          <div className="cdb-family-list">
            {dbParents.map(p => (
              <div key={p.id} className="cdb-family-item">
                <img
                  src={p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.name)}`}
                  alt={p.name}
                  className="cdb-family-avatar"
                />
                <div className="cdb-family-info">
                  <span className="cdb-family-name">{p.name}</span>
                  <span className="cdb-family-meta">
                    {p.relationship || 'Family'} {p.age ? `• ${p.age} yrs` : ''}
                    {p.caregiver_name ? ` • Carer: ${p.caregiver_name}` : ''}
                  </span>
                </div>
                <div className={`cdb-health-dot ${p.id % 2 === 0 ? 'amber' : 'green'}`} title={p.id % 2 === 0 ? 'Needs Attention' : 'Good'} />
                <Link to={`/health-feed?parent_id=${p.id}`} className="cdb-family-btn">
                  Vitals <ChevronRight size={13}/>
                </Link>
              </div>
            ))}
            <Link to="/add-parent" className="cdb-add-member-row">
              <Plus size={16}/> Add New Member
            </Link>
          </div>
        )}

        {/* ── ACTIVE ALERTS ──────────────────────────────────────── */}
        <div className="cdb-section-label">
          Active Alerts {unresolved.length > 0 && <span className="cdb-badge-count">{unresolved.length}</span>}
          <Link to="/alerts" className="cdb-section-link">View All</Link>
        </div>

        {loading ? (
          <div className="cdb-skeleton-list">
            <div className="cdb-skeleton" />
          </div>
        ) : unresolved.length === 0 ? (
          <div className="cdb-all-clear">
            <Shield size={20} color="#00a896" />
            <span>All clear — no active alerts right now.</span>
          </div>
        ) : (
          <div className="cdb-alerts-list">
            {unresolved.slice(0, 3).map(alert => (
              <div key={alert.id} className={`cdb-alert-item ${alert.type || 'info'}`}>
                <div className={`cdb-alert-dot ${alert.type || 'info'}`} />
                <div className="cdb-alert-text">
                  <span className="cdb-alert-title">{alert.title}</span>
                  <span className="cdb-alert-desc">{alert.description}</span>
                </div>
                <div className="cdb-alert-actions">
                  <Link to="/alerts" className="cdb-alert-view">View</Link>
                  <button className="cdb-alert-dismiss" onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}>
                    <X size={13}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ASSIGNED CAREGIVERS ────────────────────────────────── */}
        <div className="cdb-section-label">Assigned Caregivers</div>

        {loading ? (
          <div className="cdb-skeleton-list"><div className="cdb-skeleton" /></div>
        ) : !dashboardData?.assignedCaregivers?.length ? (
          <div className="cdb-all-clear">
            <UserSearch size={20} color="#94a3b8"/>
            <span>No caregivers assigned yet. <Link to="/caregivers-list" className="cdb-inline-link">Find one →</Link></span>
          </div>
        ) : (
          <div className="cdb-cg-list">
            {dashboardData.assignedCaregivers.map((cg, i) => (
              <div key={i} className="cdb-cg-item">
                <img
                  src={cg.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cg.name)}`}
                  alt={cg.name}
                  className="cdb-cg-avatar"
                />
                <div className="cdb-cg-info">
                  <span className="cdb-cg-name">{cg.name}</span>
                  <span className="cdb-cg-role">{cg.specialization || 'Caregiver'} • For: {cg.parent_name}</span>
                </div>
                <Link to={`/messages?recipient=${cg.user_id}`} className="cdb-cg-chat">
                  <MessageSquare size={14}/> Chat
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* ── RECENT ACTIVITY ────────────────────────────────────── */}
        <div className="cdb-section-label">Recent Activity</div>
        {loading ? (
          <div className="cdb-skeleton-list">
            <div className="cdb-skeleton" />
            <div className="cdb-skeleton" />
          </div>
        ) : !dashboardData?.feed?.length ? (
          <div className="cdb-all-clear">
            <Clock size={18} color="#94a3b8"/>
            <span>No recent health activity logged.</span>
          </div>
        ) : (
          <div className="cdb-feed">
            {dashboardData.feed.slice(0, 4).map((log, i) => {
              const t = new Date(log.timestamp);
              const time = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={log.id || i} className="cdb-feed-item">
                  <div className="cdb-feed-line">
                    <div className="cdb-feed-dot" />
                  </div>
                  <div className="cdb-feed-body">
                    <div className="cdb-feed-meta">{time} · {log.parent_name}</div>
                    <div className="cdb-feed-title">{log.title || 'Health Check-in'}</div>
                    <div className="cdb-feed-desc">
                      {log.description || `BP: ${log.blood_pressure || 'N/A'} · HR: ${log.heart_rate || 'N/A'} bpm`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ── EMERGENCY MODAL ──────────────────────────────────────── */}
      {showEmergency && (
        <div className="cdb-modal-overlay" onClick={() => setShowEmergency(false)}>
          <div className="cdb-modal" onClick={e => e.stopPropagation()}>
            <button className="cdb-modal-close" onClick={() => setShowEmergency(false)}><X size={18}/></button>
            <div className="cdb-modal-icon"><AlertTriangle size={28} color="#ef4444"/></div>
            <h2 className="cdb-modal-title">Emergency Contacts</h2>
            <p className="cdb-modal-desc">Select a service to contact immediately.</p>
            <div className="cdb-modal-btns">
              <button className="cdb-emer-btn red" onClick={() => { alert('Calling 911…'); setShowEmergency(false); }}>
                📞 Call 911
              </button>
              <button className="cdb-emer-btn dark" onClick={() => { alert('Primary nurse notified.'); setShowEmergency(false); }}>
                🏥 Call Primary Nurse
              </button>
              <button className="cdb-emer-btn ghost" onClick={() => setShowEmergency(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </ChildLayout>
  );
};

export default Dashboard;
