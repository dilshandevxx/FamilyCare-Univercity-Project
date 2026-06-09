import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Heart, Activity, Bell, AlertTriangle,
  TrendingUp, Download, ArrowUpRight, UserPlus, Eye, ShieldAlert, HeartHandshake
} from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import './AdminDashboardV2.css';

const AdminDashboardV2 = () => {
  const navigate = useNavigate();

  const mockStats = {
    totalUsers: 1248,
    activeCaregivers: 38,
    monitoredSeniors: 82,
    healthLogsToday: 156,
    activeAlerts: 4,
    pendingApprovals: 3
  };

  const recentActivity = [
    { text: 'New Caregiver registered', desc: 'Ravi applied for caregiver credentials', type: 'approval', time: '5m ago' },
    { text: 'Critical Alert Resolved', desc: 'Robert Sterling blood pressure stabilized', type: 'alert', time: '18m ago' },
    { text: 'New Parent Profile Added', desc: 'Added Eleanor Vance (Room 402) by child user', type: 'parent', time: '1h ago' },
    { text: 'Daily Health Log Submitted', desc: 'Caregiver Clara Oswald logged vitals for Arthur Jenkins', type: 'log', time: '2h ago' }
  ];

  return (
    <AdminLayoutV2 title="Admin Dashboard">
      <div className="admin-v2-dashboard-grid">
        {/* Welcome Section */}
        <div className="admin-v2-welcome-hero">
          <div className="admin-v2-hero-content">
            <h2>Welcome Back, Admin!</h2>
            <p>Everything is running smoothly. There are <strong>{mockStats.activeAlerts} active alerts</strong> and <strong>{mockStats.pendingApprovals} pending caregiver approvals</strong> that require review.</p>
          </div>
          <div className="admin-v2-hero-icon-badge">
            <HeartHandshake size={48} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="admin-v2-stats-grid">
          <div className="admin-v2-stat-card card-teal">
            <div className="admin-v2-stat-header">
              <span>Total Users</span>
              <div className="admin-v2-stat-icon-wrapper"><Users size={20} /></div>
            </div>
            <div className="admin-v2-stat-body">
              <h3>{mockStats.totalUsers}</h3>
              <p className="positive"><ArrowUpRight size={14} /> +12% this month</p>
            </div>
          </div>

          <div className="admin-v2-stat-card card-indigo">
            <div className="admin-v2-stat-header">
              <span>Active Caregivers</span>
              <div className="admin-v2-stat-icon-wrapper"><UserCheck size={20} /></div>
            </div>
            <div className="admin-v2-stat-body">
              <h3>{mockStats.activeCaregivers}</h3>
              <p className="neutral">{mockStats.pendingApprovals} pending approval</p>
            </div>
          </div>

          <div className="admin-v2-stat-card card-orange">
            <div className="admin-v2-stat-header">
              <span>Seniors Monitored</span>
              <div className="admin-v2-stat-icon-wrapper"><Heart size={20} /></div>
            </div>
            <div className="admin-v2-stat-body">
              <h3>{mockStats.monitoredSeniors}</h3>
              <p className="positive"><ArrowUpRight size={14} /> +4 newly assigned</p>
            </div>
          </div>

          <div className="admin-v2-stat-card card-coral">
            <div className="admin-v2-stat-header">
              <span>Active Alerts</span>
              <div className="admin-v2-stat-icon-wrapper"><ShieldAlert size={20} /></div>
            </div>
            <div className="admin-v2-stat-body">
              <h3>{mockStats.activeAlerts}</h3>
              <p className="critical">Needs attention</p>
            </div>
          </div>
        </div>

        {/* Analytics and Activity Columns */}
        <div className="admin-v2-main-content-layout">
          {/* Chart Card */}
          <div className="admin-v2-card analytics-card">
            <div className="admin-v2-card-header">
              <div>
                <h3>Platform Activity Overview</h3>
                <p>Daily health logs & logins over the last week</p>
              </div>
              <button className="admin-v2-btn-icon-label" onClick={() => navigate('/admin-v2/analytics')}>
                <Eye size={14} /> View Analytics
              </button>
            </div>

            <div className="admin-v2-chart-container">
              {/* Dummy SVG Chart for Premium Visuals */}
              <svg viewBox="0 0 400 200" className="admin-v2-svg-chart">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00A896" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#00A896" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                
                {/* Grid Lines */}
                <line x1="10" y1="30" x2="390" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="10" y1="80" x2="390" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="10" y1="130" x2="390" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="10" y1="180" x2="390" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
                
                {/* Gradient Fill under Path */}
                <path d="M 20 160 Q 80 80, 140 110 T 260 50 T 380 70 L 380 180 L 20 180 Z" fill="url(#chartGrad)" />
                
                {/* Main Curve Line */}
                <path d="M 20 160 Q 80 80, 140 110 T 260 50 T 380 70" fill="none" stroke="#00A896" strokeWidth="3" />
                
                {/* Data Points */}
                <circle cx="20" cy="160" r="5" fill="#00A896" stroke="white" strokeWidth="1.5" />
                <circle cx="80" cy="95" r="5" fill="#00A896" stroke="white" strokeWidth="1.5" />
                <circle cx="140" cy="110" r="5" fill="#00A896" stroke="white" strokeWidth="1.5" />
                <circle cx="200" cy="78" r="5" fill="#00A896" stroke="white" strokeWidth="1.5" />
                <circle cx="260" cy="50" r="5" fill="#00A896" stroke="white" strokeWidth="1.5" />
                <circle cx="320" cy="62" r="5" fill="#00A896" stroke="white" strokeWidth="1.5" />
                <circle cx="380" cy="70" r="5" fill="#00A896" stroke="white" strokeWidth="1.5" />
              </svg>
              
              <div className="admin-v2-chart-labels">
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

          {/* Activity Logs Card */}
          <div className="admin-v2-card activity-card">
            <div className="admin-v2-card-header">
              <h3>Recent System Activity</h3>
              <button className="admin-v2-btn-link" onClick={() => navigate('/admin-v2/health-logs')}>View All Logs</button>
            </div>

            <div className="admin-v2-activity-list">
              {recentActivity.map((act, i) => (
                <div key={i} className="admin-v2-activity-item">
                  <div className={`admin-v2-activity-dot dot-${act.type}`} />
                  <div className="admin-v2-activity-details">
                    <h4>{act.text}</h4>
                    <p>{act.desc}</p>
                    <span className="admin-v2-activity-time">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Control Panel */}
        <div className="admin-v2-quick-actions-panel">
          <h3 className="admin-v2-panel-heading">Global Actions Control Panel</h3>
          <div className="admin-v2-actions-grid">
            <button className="admin-v2-action-btn" onClick={() => navigate('/admin-v2/caregiver-approval')}>
              <UserCheck size={20} />
              <span>Approve Pending Caregivers</span>
            </button>
            <button className="admin-v2-action-btn" onClick={() => navigate('/admin-v2/alerts')}>
              <Bell size={20} />
              <span>Inspect Vitals Alerts</span>
            </button>
            <button className="admin-v2-action-btn" onClick={() => navigate('/admin-v2/users')}>
              <UserPlus size={20} />
              <span>Manage User Directory</span>
            </button>
            <button className="admin-v2-action-btn" onClick={() => navigate('/admin-v2/monitoring')}>
              <Activity size={20} />
              <span>Run System Diagnosis</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayoutV2>
  );
};

export default AdminDashboardV2;
