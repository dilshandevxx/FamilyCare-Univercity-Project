import React from 'react';
import { BarChart, BarChart2, PieChart, TrendingUp, TrendingDown, Users, HeartPulse, Clock } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import './AdminAnalyticsV2.css';

const AdminAnalyticsV2 = () => {
  return (
    <AdminLayoutV2 title="System Performance Analytics">
      <div className="analytics-v2-container">
        
        {/* Core metrics overview */}
        <div className="analytics-v2-metrics-grid">
          <div className="analytics-v2-metric-box">
            <div className="metric-header">
              <Users size={16} color="#00A896" />
              <span>User Registration Rate</span>
            </div>
            <div className="metric-body">
              <h3>+42 New Users</h3>
              <p className="trend positive"><TrendingUp size={14} /> +8% increase vs last week</p>
            </div>
          </div>
          <div className="analytics-v2-metric-box">
            <div className="metric-header">
              <HeartPulse size={16} color="#4F46E5" />
              <span>Vitals Upload Count</span>
            </div>
            <div className="metric-body">
              <h3>1,092 Logs</h3>
              <p className="trend positive"><TrendingUp size={14} /> +15% increase in daily submissions</p>
            </div>
          </div>
          <div className="analytics-v2-metric-box">
            <div className="metric-header">
              <Clock size={16} color="#EA580C" />
              <span>Alert Resolution Speed</span>
            </div>
            <div className="metric-body">
              <h3>12.8 Minutes</h3>
              <p className="trend positive"><TrendingUp size={14} /> -3.2 mins average resolution delay</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="analytics-v2-row">
          
          {/* Chart 1: Registration Trajectory */}
          <div className="analytics-v2-card">
            <div className="analytics-v2-card-header">
              <h4>Monthly Account Registration Trajectory</h4>
              <p>Representing total active children and caregiver accounts</p>
            </div>
            <div className="chart-wrapper">
              <svg viewBox="0 0 500 200" className="analytics-svg-graph">
                {/* Horizontal Guide Lines */}
                <line x1="20" y1="40" x2="480" y2="40" stroke="#f1f5f9" />
                <line x1="20" y1="90" x2="480" y2="90" stroke="#f1f5f9" />
                <line x1="20" y1="140" x2="480" y2="140" stroke="#f1f5f9" />
                <line x1="20" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
                
                {/* Bar Graph Columns */}
                {/* Jan */}
                <rect x="40" y="100" width="30" height="80" rx="3" fill="#E6F7F5" />
                <rect x="40" y="120" width="30" height="60" rx="3" fill="#00A896" />
                
                {/* Feb */}
                <rect x="120" y="80" width="30" height="100" rx="3" fill="#E6F7F5" />
                <rect x="120" y="100" width="30" height="80" rx="3" fill="#00A896" />
                
                {/* Mar */}
                <rect x="200" y="50" width="30" height="130" rx="3" fill="#E6F7F5" />
                <rect x="200" y="80" width="30" height="100" rx="3" fill="#00A896" />
                
                {/* Apr */}
                <rect x="280" y="40" width="30" height="140" rx="3" fill="#E6F7F5" />
                <rect x="280" y="60" width="30" height="120" rx="3" fill="#00A896" />
                
                {/* May */}
                <rect x="360" y="30" width="30" height="150" rx="3" fill="#E6F7F5" />
                <rect x="360" y="45" width="30" height="135" rx="3" fill="#00A896" />
                
                {/* Jun (Current) */}
                <rect x="440" y="20" width="30" height="160" rx="3" fill="#E6F7F5" />
                <rect x="440" y="35" width="30" height="145" rx="3" fill="#00A896" />
              </svg>
              <div className="chart-legend-x">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
              <div className="chart-legend-indicator">
                <span className="dot dot-family" /> <span>Family Members</span>
                <span className="dot dot-caregiver" style={{ marginLeft: '12px' }} /> <span>Caregivers</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Alert Severity breakdown */}
          <div className="analytics-v2-card">
            <div className="analytics-v2-card-header">
              <h4>System Vitals Alerts Distribution</h4>
              <p>Warning alerts categorized by type</p>
            </div>
            
            <div className="chart-wrapper flex-row">
              {/* SVG Donut Chart */}
              <svg viewBox="0 0 200 200" className="donut-chart-svg" style={{ width: '130px' }}>
                {/* Critical - Red Segment */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#DC2626" strokeWidth="20" strokeDasharray="439" strokeDashoffset="120" />
                {/* Warning - Orange Segment */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#EA580C" strokeWidth="20" strokeDasharray="439" strokeDashoffset="310" transform="rotate(-60 100 100)" />
                {/* Info - Teal Segment */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#00A896" strokeWidth="20" strokeDasharray="439" strokeDashoffset="380" transform="rotate(120 100 100)" />
              </svg>
              
              <div className="donut-legend-info">
                <div className="legend-item">
                  <span className="legend-color dot-critical" />
                  <span className="legend-label">Critical Vitals</span>
                  <span className="legend-pct">35%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color dot-warning" />
                  <span className="legend-label">Irregular Vitals</span>
                  <span className="legend-pct">45%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color dot-info" />
                  <span className="legend-label">Regular Reports</span>
                  <span className="legend-pct">20%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AdminLayoutV2>
  );
};

export default AdminAnalyticsV2;
