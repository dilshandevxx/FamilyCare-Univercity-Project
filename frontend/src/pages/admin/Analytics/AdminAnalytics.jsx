import React from 'react';
import { TrendingUp, Users, Activity, UserCheck } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import './AdminAnalytics.css';

const monthlyUsers = [
  { month: 'Jan', users: 980,  pct: 68 },
  { month: 'Feb', users: 1050, pct: 73 },
  { month: 'Mar', users: 1100, pct: 76 },
  { month: 'Apr', users: 1180, pct: 82 },
  { month: 'May', users: 1284, pct: 100 },
];

const logsByType = [
  { type: 'Blood Pressure', count: 540, pct: 85 },
  { type: 'Blood Glucose',  count: 380, pct: 60 },
  { type: 'Vitals Check',   count: 310, pct: 49 },
  { type: 'Heart Rate',     count: 250, pct: 40 },
  { type: 'Oxygen Level',   count: 180, pct: 28 },
];

const AdminAnalytics = () => (
  <AdminLayout title="Analytics">
    <div className="an-page">
      <div className="an-header">
        <h1 className="an-title">Analytics</h1>
        <p className="an-subtitle">Platform insights and usage statistics.</p>
      </div>

      {/* KPI row */}
      <div className="an-kpi-row">
        {[
          { label: 'Monthly Growth',    value: '+17%',  icon: TrendingUp, color: '#14b8a6', bg: '#f0fdfa' },
          { label: 'Total Users',       value: '1,284', icon: Users,      color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Health Logs / Day', value: '185',   icon: Activity,   color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Active Caregivers', value: '452',   icon: UserCheck,  color: '#8b5cf6', bg: '#f5f3ff' },
        ].map(k => (
          <div key={k.label} className="an-kpi-card">
            <div className="an-kpi-icon" style={{ background: k.bg, color: k.color }}>
              <k.icon size={20} />
            </div>
            <div>
              <p className="an-kpi-label">{k.label}</p>
              <p className="an-kpi-value">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="an-charts-row">
        {/* User Growth */}
        <div className="an-chart-card">
          <h3 className="an-chart-title">User Growth (Last 5 Months)</h3>
          <div className="an-bar-chart">
            {monthlyUsers.map(d => (
              <div key={d.month} className="an-bar-col">
                <span className="an-bar-val">{d.users}</span>
                <div className="an-bar-wrap">
                  <div className="an-bar" style={{ height: `${d.pct}%` }} />
                </div>
                <span className="an-bar-label">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logs by type */}
        <div className="an-chart-card">
          <h3 className="an-chart-title">Health Log Breakdown</h3>
          <div className="an-hbar-list">
            {logsByType.map(d => (
              <div key={d.type} className="an-hbar-row">
                <span className="an-hbar-type">{d.type}</span>
                <div className="an-hbar-track">
                  <div className="an-hbar-fill" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="an-hbar-count">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default AdminAnalytics;
