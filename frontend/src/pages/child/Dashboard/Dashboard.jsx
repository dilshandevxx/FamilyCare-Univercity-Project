import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserPlus, Bell, Activity, Thermometer,
  UserSearch, AlertTriangle, CheckCircle, Plus,
  Heart, MessageSquare, Shield, PhoneCall, X,
  ChevronRight, TrendingUp, Pill, Clock, PieChart as PieIcon,
  Sparkles
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import ColorfulPieChart from '../../../components/common/ColorfulPieChart';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import './Dashboard.css';

const barDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  // Care activity distribution data for ColorfulPieChart
  const careActivityData = [
    { label: 'Vitals Logged', value: pulse.totalLogs || 14, color: '#00A896' },
    { label: 'Meds Taken',    value: (pulse.medsTaken || 3) * 3, color: '#3B82F6' },
    { label: 'Nutrition',     value: 8, color: '#10B981' },
    { label: 'Alerts Checked',value: unresolved.length ? unresolved.length * 2 : 4, color: '#F59E0B' },
  ];

  return (
    <ChildLayout title="Dashboard">
      <div className="cdb-wrap">

        {/* ── HERO GREETING ──────────────────────────────────────── */}
        <div className="cdb-hero">
          <div className="cdb-hero-text">
            <div className="cdb-greeting-badge">
              <span>{greeting.emoji}</span> {greeting.text}
            </div>
            <h1 className="cdb-hero-name">Welcome, {firstName}!</h1>
            <p className="cdb-hero-sub">Here is your family care network & health overview for today.</p>
          </div>
          <div className="cdb-hero-badge">
            <div className={`cdb-status-orb ${topStats.healthStatus === 'Critical' ? 'red' : topStats.healthStatus === 'Needs Attention' ? 'amber' : 'green'}`}>
              {topStats.healthStatus === 'Critical'
                ? <AlertTriangle size={24} />
                : <CheckCircle size={24} />
              }
            </div>
            <span className="cdb-status-word">{topStats.healthStatus || 'Stable & Safe'}</span>
          </div>
        </div>

        {/* ── STATS STRIP ────────────────────────────────────────── */}
        <div className="cdb-stats-strip">
          <div className="cdb-stat">
            <div className="cdb-stat-icon teal"><Users size={18} /></div>
            <div>
              <span className="cdb-stat-num">{topStats.totalParents || dbParents.length || 0}</span>
              <span className="cdb-stat-lbl">Family Members</span>
            </div>
          </div>
          <div className="cdb-stat-div" />
          <div className="cdb-stat">
            <div className="cdb-stat-icon blue"><UserPlus size={18} /></div>
            <div>
              <span className="cdb-stat-num">{topStats.activeCaregivers || (dashboardData?.assignedCaregivers?.length || 0)}</span>
              <span className="cdb-stat-lbl">Caregivers</span>
            </div>
          </div>
          <div className="cdb-stat-div" />
          <div className="cdb-stat">
            <div className={`cdb-stat-icon ${unresolved.length > 0 ? 'red' : 'green'}`}>
              <Bell size={18} />
            </div>
            <div>
              <span className="cdb-stat-num">{unresolved.length}</span>
              <span className="cdb-stat-lbl">Active Alerts</span>
            </div>
          </div>
          <div className="cdb-stat-div" />
          <div className="cdb-stat">
            <div className="cdb-stat-icon purple"><Activity size={18} /></div>
            <div>
              <span className="cdb-stat-num">{pulse.avgBp || '120/80'}</span>
              <span className="cdb-stat-lbl">Avg BP</span>
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ──────────────────────────────────────── */}
        <div className="cdb-section-header">
          <span className="cdb-section-label">Quick Actions</span>
        </div>
        <div className="cdb-quick-grid">
          <Link to="/add-parent" className="cdb-qbtn teal">
            <div className="cdb-qbtn-icon"><UserPlus size={18} /></div>
            <span>Add Member</span>
          </Link>
          <Link to="/caregivers-list" className="cdb-qbtn blue">
            <div className="cdb-qbtn-icon"><UserSearch size={18} /></div>
            <span>Find Carer</span>
          </Link>
          <Link to="/messages" className="cdb-qbtn purple">
            <div className="cdb-qbtn-icon"><MessageSquare size={18} /></div>
            <span>Messages</span>
          </Link>
          <button className="cdb-qbtn red" onClick={() => setShowEmergency(true)}>
            <div className="cdb-qbtn-icon"><PhoneCall size={18} /></div>
            <span>Emergency</span>
          </button>
        </div>

        {/* ── TODAY'S VITALS SNAPSHOT ────────────────────────────── */}
        <div className="cdb-section-header">
          <span className="cdb-section-label">Today's Vitals Snapshot</span>
          <Link to="/health-feed" className="cdb-section-link">Live Feed <ChevronRight size={13}/></Link>
        </div>
        <div className="cdb-vitals-row">
          <div className="cdb-vital-chip">
            <div className="cdb-vital-chip-icon" style={{background:'#fef2f2'}}>
              <Heart size={18} color="#ef4444" />
            </div>
            <div>
              <div className="cdb-vital-chip-val">{pulse.avgBp || '122/78'} <span className="cdb-vital-unit">mmHg</span></div>
              <div className="cdb-vital-chip-name">Blood Pressure</div>
            </div>
          </div>
          <div className="cdb-vital-chip">
            <div className="cdb-vital-chip-icon" style={{background:'#fff7ed'}}>
              <Activity size={18} color="#f97316" />
            </div>
            <div>
              <div className="cdb-vital-chip-val">{pulse.avgHr || '74'} <span className="cdb-vital-unit">bpm</span></div>
              <div className="cdb-vital-chip-name">Heart Rate</div>
            </div>
          </div>
          <div className="cdb-vital-chip">
            <div className="cdb-vital-chip-icon" style={{background:'#fdf4ff'}}>
              <Thermometer size={18} color="#a855f7" />
            </div>
            <div>
              <div className="cdb-vital-chip-val">{pulse.avgTemp || '98.4'}<span className="cdb-vital-unit">°F</span></div>
              <div className="cdb-vital-chip-name">Body Temperature</div>
            </div>
          </div>
          <div className="cdb-vital-chip">
            <div className="cdb-vital-chip-icon" style={{background:'#f0fdf4'}}>
              <Pill size={18} color="#10B981" />
            </div>
            <div>
              <div className="cdb-vital-chip-val">{pulse.medsTaken || 2}<span className="cdb-vital-unit">/{pulse.totalMeds || 3} doses</span></div>
              <div className="cdb-vital-chip-name">Meds Compliance</div>
            </div>
          </div>
        </div>

        {/* ── CHARTS ROW: COLORFUL PIE CHART + WEEKLY BP TREND ───── */}
        <div className="cdb-charts-grid">
          
          {/* Colorful Care Distribution Donut/Pie Chart */}
          <div className="cdb-card cdb-pie-card">
            <div className="cdb-card-hd">
              <div>
                <h3 className="cdb-card-title">Care & Health Split</h3>
                <p className="cdb-card-sub">Daily breakdown of logged activities</p>
              </div>
              <Link to="/analytics" className="cdb-see-all">Details <ChevronRight size={13}/></Link>
            </div>
            
            <div className="cdb-pie-wrap">
              <ColorfulPieChart
                data={careActivityData}
                size={165}
                innerRadius={48}
                outerRadius={75}
                centerLabel="Total Tasks"
                centerValue={careActivityData.reduce((a, c) => a + c.value, 0)}
              />
            </div>
          </div>

          {/* Weekly BP Trend Bar Chart */}
          <div className="cdb-card">
            <div className="cdb-card-hd">
              <div>
                <h3 className="cdb-card-title">Weekly BP Trend</h3>
                <p className="cdb-card-sub">Systolic pressure (mmHg)</p>
              </div>
              <Link to="/analytics" className="cdb-see-all">Analytics <ChevronRight size={13}/></Link>
            </div>
            <div className="cdb-bar-chart">
              {(dashboardData?.charts?.bpTrend || [122,118,125,121,128,124,120]).map((h, i) => {
                const pct = Math.min(((h - 90) / 80) * 100, 100);
                const today = new Date().getDay();
                const dayIdx = today === 0 ? 6 : today - 1;
                return (
                  <div key={i} className="cdb-bar-col">
                    <span className="cdb-bar-tip">{h > 0 ? h : ''}</span>
                    <div className={`cdb-bar ${i === dayIdx ? 'today' : ''}`} style={{ height: `${Math.max(pct, 15)}%` }} />
                    <span className="cdb-bar-day">{barDays[i]}</span>
                  </div>
                );
              })}
            </div>
            <div className="cdb-chart-footer">
              <span className="cdb-chart-legend-dot" />
              <span>Target: 110 - 130 mmHg (Optimal Range)</span>
            </div>
          </div>

        </div>

        {/* ── FAMILY MEMBERS ─────────────────────────────────────── */}
        <div className="cdb-section-header">
          <span className="cdb-section-label">Family Members</span>
          <Link to="/parents" className="cdb-section-link">View All ({dbParents.length})</Link>
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
