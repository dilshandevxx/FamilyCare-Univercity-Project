import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Heart, Activity, Bell, AlertTriangle,
  TrendingUp, Download, ArrowUpRight, UserPlus, Eye, ShieldAlert,
  HeartHandshake, ChevronRight, ActivitySquare, Server, AlertCircle, Loader2
} from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import api from '../../../services/api';
import './AdminDashboardV2.css';

const formatActivityTime = (ts) => {
  if (!ts) return '';
  const diffMs  = Date.now() - new Date(ts);
  const diffM   = Math.floor(diffMs / 60000);
  const diffH   = Math.floor(diffMs / 3600000);
  const diffD   = Math.floor(diffMs / 86400000);
  if (diffM < 1)  return 'Just now';
  if (diffM < 60) return `${diffM}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD === 1) return '1d ago';
  return `${diffD}d ago`;
};

const AdminDashboardV2 = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: '—', total_caregivers: '—', total_elders: '—',
    logs_today: '—', active_alerts: '—', critical_alerts: '—', pending_approvals: '—',
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    setLoadingActivity(true);
    try {
      const { data } = await api.get('/admin/activity');
      setRecentActivity(data);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      setRecentActivity([]);
    } finally {
      setLoadingActivity(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchActivity();
  }, [fetchStats, fetchActivity]);

  return (
    <AdminLayoutV2 title="Overview Dashboard">
      <div className="v2-dash-container">
        
        {/* Hero Section */}
        <div className="v2-dash-hero">
          <div className="v2-hero-text">
            <h3>System Status Operational</h3>
            <h2>FamilyCare Infrastructure Console</h2>
            <p>
              Your central platform administration center. Currently monitoring <strong>{stats.total_elders !== '—' ? stats.total_elders : 0} active senior residents</strong> and <strong>{stats.total_caregivers !== '—' ? stats.total_caregivers : 0} verified caregivers</strong> in real-time.
            </p>
          </div>
          <div className="v2-hero-stats">
            <div className="v2-hero-stat-pill" onClick={() => navigate('/admin-v2/alerts')} style={{ cursor: 'pointer' }}>
              <span className={`dot ${stats.critical_alerts > 0 ? 'active' : ''}`} style={stats.critical_alerts === 0 ? {background: '#94A3B8', boxShadow: 'none'} : {}} />
              <span>{stats.critical_alerts !== '—' ? stats.critical_alerts : 0} Critical Alerts</span>
            </div>
            <div className="v2-hero-stat-pill" onClick={() => navigate('/admin-v2/caregiver-approval')} style={{ cursor: 'pointer' }}>
              <span className={`dot ${stats.pending_approvals > 0 ? 'pending' : ''}`} style={stats.pending_approvals === 0 ? {background: '#94A3B8', boxShadow: 'none'} : {}} />
              <span>{stats.pending_approvals !== '—' ? stats.pending_approvals : 0} Pending Audits</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="v2-stats-row">
          
          <div className="v2-stat-card card-gradient-teal">
            <div className="v2-stat-glass-overlay" />
            <div className="v2-stat-info">
              <span className="label">System User Base</span>
              <h3 className="value">{stats.total_users}</h3>
              <p className="detail positive">
                <ArrowUpRight size={12} /> Registered accounts
              </p>
            </div>
            <div className="v2-stat-icon-circle bg-teal">
              <Users size={24} />
            </div>
          </div>

          <div className="v2-stat-card card-gradient-indigo">
            <div className="v2-stat-glass-overlay" />
            <div className="v2-stat-info">
              <span className="label">Registered Caregivers</span>
              <h3 className="value">{stats.total_caregivers}</h3>
              <p className="detail neutral">
                {stats.pending_approvals} applications pending
              </p>
            </div>
            <div className="v2-stat-icon-circle bg-indigo">
              <UserCheck size={24} />
            </div>
          </div>

          <div className="v2-stat-card card-gradient-orange">
            <div className="v2-stat-glass-overlay" />
            <div className="v2-stat-info">
              <span className="label">Elders Monitored</span>
              <h3 className="value">{stats.total_elders}</h3>
              <p className="detail positive">
                Active profiles
              </p>
            </div>
            <div className="v2-stat-icon-circle bg-orange">
              <Heart size={24} />
            </div>
          </div>

          <div className="v2-stat-card card-gradient-rose">
            <div className="v2-stat-glass-overlay" />
            <div className="v2-stat-info">
              <span className="label">Critical Active Alerts</span>
              <h3 className="value">{stats.active_alerts}</h3>
              <p className={`detail ${stats.critical_alerts > 0 ? 'critical animate-pulse-glow' : 'neutral'}`}>
                {stats.critical_alerts > 0 ? `${stats.critical_alerts} requires immediate resolution` : 'All criticals resolved'}
              </p>
            </div>
            <div className="v2-stat-icon-circle bg-rose">
              <ShieldAlert size={24} />
            </div>
          </div>

        </div>

        {/* Central Dashboard Layout */}
        <div className="v2-dashboard-body">
          
          {/* Chart Widget */}
          <div className="v2-dashboard-panel chart-panel">
            <div className="v2-panel-header">
              <div>
                <h4>Weekly System Traffic Activity</h4>
                <p>Track uploads of daily health records and active user registrations</p>
              </div>
              <button className="v2-header-action-btn" onClick={() => navigate('/admin-v2/analytics')}>
                <ActivitySquare size={14} style={{ marginRight: '6px' }} />
                Detailed Reports
              </button>
            </div>

            <div className="v2-chart-space">
              <svg viewBox="0 0 500 220" className="v2-premium-svg-chart">
                <defs>
                  <linearGradient id="glowTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00A896" stopOpacity="0.45"/>
                    <stop offset="100%" stopColor="#00A896" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>

                {/* Guide Lines */}
                <line x1="20" y1="40" x2="480" y2="40" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="20" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="20" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="20" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Shaded Area Under Path */}
                <path d="M 25 150 Q 100 70, 175 110 T 325 50 T 475 75 L 475 180 L 25 180 Z" fill="url(#glowTeal)" />

                {/* Primary Trend Line */}
                <path d="M 25 150 Q 100 70, 175 110 T 325 50 T 475 75" fill="none" stroke="#00A896" strokeWidth="3" strokeLinecap="round" />

                {/* Interaction Glow Circles */}
                <circle cx="25" cy="150" r="5" fill="#00A896" stroke="white" strokeWidth="2" />
                <circle cx="100" cy="85" r="5" fill="#00A896" stroke="white" strokeWidth="2" />
                <circle cx="175" cy="110" r="5" fill="#00A896" stroke="white" strokeWidth="2" />
                <circle cx="250" cy="78" r="5" fill="#00A896" stroke="white" strokeWidth="2" />
                <circle cx="325" cy="50" r="5" fill="#00A896" stroke="white" strokeWidth="2" />
                <circle cx="400" cy="62" r="5" fill="#00A896" stroke="white" strokeWidth="2" />
                <circle cx="475" cy="75" r="5" fill="#00A896" stroke="white" strokeWidth="2" />
              </svg>
              
              <div className="v2-chart-x-labels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Activity Feed Widget */}
          <div className="v2-dashboard-panel feed-panel">
            <div className="v2-panel-header">
              <h4>Recent Event Logs</h4>
              <button className="v2-header-link" onClick={() => navigate('/admin-v2/health-logs')}>View All Logs</button>
            </div>

            <div className="v2-feed-list">
              {loadingActivity ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                  <Loader2 className="animate-spin" size={24} color="#00A896" />
                </div>
              ) : recentActivity.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem', padding: '1rem 0' }}>No recent activity found.</p>
              ) : (
                recentActivity.slice(0, 5).map((act, i) => {
                  let type = 'log';
                  if (act.icon === 'UserPlus' || act.icon === 'UserCheck') type = 'approval';
                  else if (act.icon === 'AlertTriangle' || act.icon === 'Bell') type = 'alert';
                  else if (act.title.toLowerCase().includes('senior')) type = 'parent';

                  return (
                    <div key={i} className="v2-feed-item">
                      <div className={`v2-feed-icon-badge ${type}`}>
                        {type === 'approval' && <UserCheck size={14} />}
                        {type === 'alert' && <AlertCircle size={14} />}
                        {type === 'parent' && <Heart size={14} />}
                        {type === 'log' && <Activity size={14} />}
                      </div>
                      <div className="v2-feed-details">
                        <div className="v2-feed-title-time">
                          <h5>{act.title}</h5>
                          <span>{formatActivityTime(act.ts)}</span>
                        </div>
                        <p>{act.desc}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Global Controls Grid */}
        <div className="v2-controls-panel">
          <h4>Platform Controls & Diagnostics</h4>
          <div className="v2-controls-grid">
            <div className="v2-control-card" onClick={() => navigate('/admin-v2/caregiver-approval')}>
              <div className="v2-control-icon-circle bg-teal">
                <UserCheck size={20} />
              </div>
              <div className="v2-control-text">
                <h5>Verify Caregivers</h5>
                <p>Approve credentials and activation status.</p>
              </div>
              <ChevronRight size={18} className="v2-control-arrow" />
            </div>

            <div className="v2-control-card" onClick={() => navigate('/admin-v2/alerts')}>
              <div className="v2-control-icon-circle bg-rose">
                <Bell size={20} />
              </div>
              <div className="v2-control-text">
                <h5>Vitals Alerts Registry</h5>
                <p>Inspect trigger thresholds and critical statuses.</p>
              </div>
              <ChevronRight size={18} className="v2-control-arrow" />
            </div>

            <div className="v2-control-card" onClick={() => navigate('/admin-v2/users')}>
              <div className="v2-control-icon-circle bg-indigo">
                <UserPlus size={20} />
              </div>
              <div className="v2-control-text">
                <h5>User Access Registry</h5>
                <p>Audit family members, caregivers, and roles.</p>
              </div>
              <ChevronRight size={18} className="v2-control-arrow" />
            </div>

            <div className="v2-control-card" onClick={() => navigate('/admin-v2/monitoring')}>
              <div className="v2-control-icon-circle bg-orange">
                <Server size={20} />
              </div>
              <div className="v2-control-text">
                <h5>Hardware Diagnostics</h5>
                <p>View live CPU gauges and API database latency.</p>
              </div>
              <ChevronRight size={18} className="v2-control-arrow" />
            </div>
          </div>
        </div>

      </div>
    </AdminLayoutV2>
  );
};

export default AdminDashboardV2;
