import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Heart, Activity, Bell, AlertTriangle,
  TrendingUp, Download, ArrowUpRight, UserPlus, Eye, Loader2,
} from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import api from '../../../services/api';
import './AdminDashboard.css';

const weeklyData = [
  { label: 'Week 1', value: 180, pct: 50 },
  { label: 'Week 2', value: 245, pct: 68 },
  { label: 'Week 3', value: 312, pct: 86 },
  { label: 'Week 4', value: 360, pct: 100 },
];

const ACTIVITY_ICONS = {
  UserPlus:         { icon: UserPlus,       color: '#14b8a6', bg: '#f0fdfa' },
  AlertTriangle:    { icon: AlertTriangle,  color: '#ef4444', bg: '#fef2f2' },
  Activity:         { icon: Activity,       color: '#3b82f6', bg: '#eff6ff' },
  Bell:             { icon: Bell,           color: '#f59e0b', bg: '#fffbeb' },
  TrendingUp:       { icon: TrendingUp,     color: '#10b981', bg: '#f0fdf4' },
  UserCheck:        { icon: UserCheck,      color: '#8b5cf6', bg: '#f5f3ff' },
};

const formatActivityTime = (ts) => {
  if (!ts) return '';
  const diffMs  = Date.now() - new Date(ts);
  const diffM   = Math.floor(diffMs / 60000);
  const diffH   = Math.floor(diffMs / 3600000);
  const diffD   = Math.floor(diffMs / 86400000);
  if (diffM < 1)  return 'Just now';
  if (diffM < 60) return `${diffM} min${diffM > 1 ? 's' : ''} ago`;
  if (diffH < 24) return `${diffH} hour${diffH > 1 ? 's' : ''} ago`;
  if (diffD === 1) return '1 day ago';
  return `${diffD} days ago`;
};

const exportCSV = (stats) => {
  const rows = [
    ['Metric', 'Value'],
    ['Total Users',        stats.total_users],
    ['Total Caregivers',   stats.total_caregivers],
    ['Active Elders',      stats.total_elders],
    ['Health Logs Today',  stats.logs_today],
    ['Active Alerts',      stats.active_alerts],
    ['Critical Alerts',    stats.critical_alerts],
    ['Pending Approvals',  stats.pending_approvals],
  ];
  const csv  = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `admin-stats-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: '—', total_caregivers: '—', total_elders: '—',
    logs_today: '—', active_alerts: '—', critical_alerts: '—', pending_approvals: '—',
  });
  const [activity, setActivity]         = useState([]);
  const [activityLoading, setActLoading] = useState(true);

  const fetchStats = useCallback(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const fetchActivity = useCallback(async () => {
    setActLoading(true);
    try {
      const { data } = await api.get('/admin/activity');
      setActivity(data);
    } catch {
      setActivity([]);
    } finally {
      setActLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchActivity();
  }, [fetchStats, fetchActivity]);

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="admin-dash">
        {/* Page heading */}
        <div className="admin-dash-heading">
          <h1 className="admin-dash-title">Admin Dashboard</h1>
          <p className="admin-dash-subtitle">
            {stats.active_alerts !== '—'
              ? `${stats.active_alerts} active alert${stats.active_alerts !== 1 ? 's' : ''} require attention.`
              : 'Loading platform summary…'}
          </p>
        </div>

        <div className="admin-dash-body">
          {/* Left column */}
          <div className="admin-dash-left">
            {/* Top stat cards */}
            <div className="admin-stat-row">
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <div>
                    <p className="admin-stat-label">Total Users</p>
                    <h2 className="admin-stat-value">{stats.total_users}</h2>
                    <p className="admin-stat-change positive">
                      <ArrowUpRight size={13} /> Registered accounts
                    </p>
                  </div>
                  <div className="admin-stat-icon teal">
                    <Users size={22} />
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <div>
                    <p className="admin-stat-label">Total Caregivers</p>
                    <h2 className="admin-stat-value">{stats.total_caregivers}</h2>
                    <p className="admin-stat-change neutral">{stats.pending_approvals} pending approval</p>
                  </div>
                  <div className="admin-stat-icon blue">
                    <UserCheck size={22} />
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <div>
                    <p className="admin-stat-label">Active Elders</p>
                    <h2 className="admin-stat-value">{stats.total_elders}</h2>
                    <p className="admin-stat-change neutral">Registered</p>
                  </div>
                  <div className="admin-stat-icon rose">
                    <Heart size={22} />
                  </div>
                </div>
              </div>
            </div>

            {/* Second stat row */}
            <div className="admin-stat-row">
              <div className="admin-stat-card">
                <p className="admin-stat-label">Health Logs Today</p>
                <h2 className="admin-stat-value">{stats.logs_today}</h2>
                <div className="admin-stat-bar">
                  <div className="admin-stat-bar-fill" style={{ width: '72%' }} />
                </div>
              </div>

              <div className="admin-stat-card">
                <p className="admin-stat-label">Active Alerts</p>
                <h2 className="admin-stat-value">{stats.active_alerts}</h2>
                <span className="admin-badge-critical">{stats.critical_alerts} Critical</span>
              </div>

              <div className="admin-stat-card">
                <p className="admin-stat-label">Pending Approvals</p>
                <h2 className="admin-stat-value">{stats.pending_approvals}</h2>
                <p className="admin-stat-change warning">Requires swift action</p>
              </div>
            </div>

            {/* Chart */}
            <div className="admin-chart-card">
              <div className="admin-chart-header">
                <div>
                  <h3 className="admin-chart-title">System Usage Trends</h3>
                  <p className="admin-chart-sub">Weekly active user sessions &nbsp;·&nbsp; last 30 days</p>
                </div>
                <div className="admin-chart-actions">
                  <button
                    className="admin-chart-btn outline"
                    onClick={() => exportCSV(stats)}
                  >
                    <Download size={13} /> Export CSV
                  </button>
                  <button className="admin-chart-btn filled" onClick={() => navigate('/admin/analytics')}>
                    View Details
                  </button>
                </div>
              </div>

              <div className="admin-chart-area">
                {/* Y-axis labels */}
                <div className="admin-chart-y-axis">
                  {['360', '285', '190', '95', '0'].map(v => (
                    <span key={v}>{v}</span>
                  ))}
                </div>
                {/* Bars */}
                <div className="admin-chart-bars">
                  {weeklyData.map(d => (
                    <div key={d.label} className="admin-chart-bar-col">
                      <div className="admin-chart-bar-wrapper">
                        <div
                          className="admin-chart-bar"
                          style={{ height: `${d.pct}%` }}
                          title={`${d.value} sessions`}
                        />
                      </div>
                      <span className="admin-chart-bar-label">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-quick-actions">
              <h3 className="admin-section-title">Quick Actions</h3>
              <div className="admin-qa-row">
                <button className="admin-qa-btn" onClick={() => navigate('/admin/caregiver-approval')}>
                  <div className="admin-qa-icon"><UserCheck size={22} color="#14b8a6" /></div>
                  <span>Approve Caregiver</span>
                </button>
                <button className="admin-qa-btn" onClick={() => navigate('/admin/alerts')}>
                  <div className="admin-qa-icon"><Bell size={22} color="#14b8a6" /></div>
                  <span>View Alerts</span>
                </button>
                <button className="admin-qa-btn" onClick={() => navigate('/admin/users', { state: { openAdd: true } })}>
                  <div className="admin-qa-icon"><UserPlus size={22} color="#14b8a6" /></div>
                  <span>Add New User</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="admin-dash-right">
            {/* Alert Overview — wired to real stats */}
            <div className="admin-alert-overview">
              <h3 className="admin-alert-title">Alert Overview</h3>

              <div className="admin-alert-critical">
                <p className="admin-alert-level critical">CRITICAL</p>
                <h2 className="admin-alert-count">
                  {stats.critical_alerts !== '—' ? `${stats.critical_alerts} medical alert${stats.critical_alerts !== 1 ? 's' : ''}` : '—'}
                </h2>
              </div>

              <div className="admin-alert-warning">
                <p className="admin-alert-level warning">WARNINGS</p>
                <h2 className="admin-alert-count warning-text">
                  {stats.active_alerts !== '—' && stats.critical_alerts !== '—'
                    ? `${Math.max(0, stats.active_alerts - stats.critical_alerts)} irregular pattern${(stats.active_alerts - stats.critical_alerts) !== 1 ? 's' : ''}`
                    : '—'}
                </h2>
              </div>

              <button
                className="admin-view-alerts-btn"
                onClick={() => navigate('/admin/alerts')}
              >
                <Eye size={14} /> View All Alerts
              </button>
            </div>

            {/* Recent Activity — real data */}
            <div className="admin-activity-card">
              <div className="admin-activity-header">
                <h3 className="admin-section-title">Recent Activity</h3>
                <button
                  className="admin-view-all-btn"
                  onClick={() => navigate('/admin/health-logs')}
                >
                  View All
                </button>
              </div>

              <div className="admin-activity-list">
                {activityLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
                    <Loader2 size={22} style={{ animation: 'dash-spin 1s linear infinite', color: '#0d9488' }} />
                  </div>
                ) : activity.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>
                    No recent activity yet.
                  </p>
                ) : (
                  activity.map((item, i) => {
                    const meta = ACTIVITY_ICONS[item.icon] || ACTIVITY_ICONS.Activity;
                    const Icon = meta.icon;
                    return (
                      <div key={i} className="admin-activity-item">
                        <div
                          className="admin-activity-icon"
                          style={{ background: meta.bg }}
                        >
                          <Icon size={15} color={meta.color} />
                        </div>
                        <div className="admin-activity-info">
                          <p className="admin-activity-title">{item.title}</p>
                          <p className="admin-activity-desc">{item.desc}</p>
                          <p className="admin-activity-time">{formatActivityTime(item.ts).toUpperCase()}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes dash-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
