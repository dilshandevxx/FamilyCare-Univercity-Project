import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Heart, Activity, Bell, AlertTriangle,
  TrendingUp, Download, ArrowUpRight, UserPlus, Eye,
} from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import './AdminDashboard.css';

const weeklyData = [
  { label: 'Week 1', value: 180, pct: 50 },
  { label: 'Week 2', value: 245, pct: 68 },
  { label: 'Week 3', value: 312, pct: 86 },
  { label: 'Week 4', value: 360, pct: 100 },
];

const recentActivity = [
  {
    id: 1,
    icon: UserPlus,
    iconColor: '#14b8a6',
    iconBg: '#f0fdfa',
    title: 'New caregiver registered',
    desc: 'Elena Rossi joined the medical team',
    time: '3 MINS AGO',
  },
  {
    id: 2,
    icon: AlertTriangle,
    iconColor: '#ef4444',
    iconBg: '#fef2f2',
    title: 'Critical alert: High BP',
    desc: 'Martha K. monitored in Zone 4',
    time: '16 MINS AGO',
  },
  {
    id: 3,
    icon: Activity,
    iconColor: '#3b82f6',
    iconBg: '#eff6ff',
    title: 'Health log submitted',
    desc: 'Nurse Sarah completed routine check',
    time: '43 MINS AGO',
  },
  {
    id: 4,
    icon: TrendingUp,
    iconColor: '#10b981',
    iconBg: '#f0fdf4',
    title: 'System Update Completed',
    desc: 'Successfully updated DeployK v2.4.1',
    time: '1 HOUR AGO',
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="admin-dash">
        {/* Page heading */}
        <div className="admin-dash-heading">
          <h1 className="admin-dash-title">Admin Dashboard</h1>
          <p className="admin-dash-subtitle">
            Monitoring the sanctuary. 12 active events require attention.
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
                    <h2 className="admin-stat-value">1,284</h2>
                    <p className="admin-stat-change positive">
                      <ArrowUpRight size={13} /> +17% vs last month
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
                    <h2 className="admin-stat-value">452</h2>
                    <p className="admin-stat-change neutral">+1 today</p>
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
                    <h2 className="admin-stat-value">320</h2>
                    <p className="admin-stat-change neutral">Stable</p>
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
                <h2 className="admin-stat-value">185</h2>
                <div className="admin-stat-bar">
                  <div className="admin-stat-bar-fill" style={{ width: '72%' }} />
                </div>
              </div>

              <div className="admin-stat-card">
                <p className="admin-stat-label">Active Alerts</p>
                <h2 className="admin-stat-value">12</h2>
                <span className="admin-badge-critical">4 Critical Emergencies</span>
              </div>

              <div className="admin-stat-card">
                <p className="admin-stat-label">Pending Approvals</p>
                <h2 className="admin-stat-value">8</h2>
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
                  <button className="admin-chart-btn outline">
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
                <button className="admin-qa-btn" onClick={() => navigate('/admin/users')}>
                  <div className="admin-qa-icon"><UserPlus size={22} color="#14b8a6" /></div>
                  <span>Add New User</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="admin-dash-right">
            {/* Alert Overview */}
            <div className="admin-alert-overview">
              <h3 className="admin-alert-title">Alert Overview</h3>

              <div className="admin-alert-critical">
                <p className="admin-alert-level critical">CRITICAL</p>
                <h2 className="admin-alert-count">4 medical emergencies</h2>
              </div>

              <div className="admin-alert-warning">
                <p className="admin-alert-level warning">WARNINGS</p>
                <h2 className="admin-alert-count warning-text">8 irregular patterns</h2>
              </div>

              <button
                className="admin-view-alerts-btn"
                onClick={() => navigate('/admin/alerts')}
              >
                <Eye size={14} /> View All Alerts
              </button>
            </div>

            {/* Recent Activity */}
            <div className="admin-activity-card">
              <div className="admin-activity-header">
                <h3 className="admin-section-title">Recent Activity</h3>
                <button className="admin-view-all-btn">View All</button>
              </div>

              <div className="admin-activity-list">
                {recentActivity.map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="admin-activity-item">
                      <div
                        className="admin-activity-icon"
                        style={{ background: item.iconBg }}
                      >
                        <Icon size={15} color={item.iconColor} />
                      </div>
                      <div className="admin-activity-info">
                        <p className="admin-activity-title">{item.title}</p>
                        <p className="admin-activity-desc">{item.desc}</p>
                        <p className="admin-activity-time">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* On Duty Spotlight */}
            <div className="admin-spotlight-card">
              <p className="admin-spotlight-label">ON DUTY SPOTLIGHT</p>
              <div className="admin-spotlight-body">
                <div className="admin-spotlight-avatar">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRossi"
                    alt="Elena Rossi"
                  />
                </div>
                <div className="admin-spotlight-info">
                  <p className="admin-spotlight-name">Elena Rossi</p>
                  <p className="admin-spotlight-role">Registered Nurse (RN)</p>
                  <span className="admin-spotlight-badge">Top Rated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
