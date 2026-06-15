import React, { useState, useEffect } from 'react';
import { Users, HeartPulse, Clock, TrendingUp, UserCheck, Loader2 } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import api from '../../../services/api';
import './AdminAnalyticsV2.css';

const AdminAnalyticsV2 = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const { data: d } = await api.get('/admin/analytics');
        setData(d);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <AdminLayoutV2 title="System Performance Analytics">
        <div className="analytics-v2-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Loader2 className="animate-spin" size={40} color="#00A896" />
        </div>
      </AdminLayoutV2>
    );
  }

  const { kpis, monthly_users, logs_by_condition } = data;

  // Chart 1 Logic
  const maxUsers = Math.max(...monthly_users.map(m => m.users), 1);
  const maxBarHeight = 160;

  // Chart 2 Logic (Donut)
  const totalLogs = logs_by_condition.reduce((sum, item) => sum + item.count, 0) || 1;
  let currentOffset = 0;
  
  const getConditionColor = (type) => {
    const t = type?.toUpperCase() || '';
    if (t === 'CRITICAL') return '#DC2626'; // Red
    if (t === 'NEEDS ATTENTION') return '#EA580C'; // Orange
    return '#00A896'; // Teal (Stable)
  };

  const getConditionLabel = (type) => {
    const t = type?.toUpperCase() || '';
    if (t === 'CRITICAL') return 'Critical Vitals';
    if (t === 'NEEDS ATTENTION') return 'Irregular Vitals';
    return 'Regular Reports';
  };

  const getConditionClass = (type) => {
    const t = type?.toUpperCase() || '';
    if (t === 'CRITICAL') return 'dot-critical';
    if (t === 'NEEDS ATTENTION') return 'dot-warning';
    return 'dot-info';
  };

  return (
    <AdminLayoutV2 title="System Performance Analytics">
      <div className="analytics-v2-container">
        
        {/* Core metrics overview */}
        <div className="analytics-v2-metrics-grid">
          <div className="analytics-v2-metric-box">
            <div className="metric-header">
              <Users size={16} color="#00A896" />
              <span>Total System Users</span>
            </div>
            <div className="metric-body">
              <h3>{kpis.total_users.toLocaleString()} Users</h3>
              <p className={`trend ${kpis.monthly_growth_pct >= 0 ? 'positive' : 'negative'}`}>
                <TrendingUp size={14} /> {kpis.monthly_growth_pct >= 0 ? '+' : ''}{kpis.monthly_growth_pct}% vs last month
              </p>
            </div>
          </div>
          <div className="analytics-v2-metric-box">
            <div className="metric-header">
              <HeartPulse size={16} color="#4F46E5" />
              <span>Vitals Upload Count</span>
            </div>
            <div className="metric-body">
              <h3>{kpis.logs_today.toLocaleString()} Logs</h3>
              <p className="trend positive"><TrendingUp size={14} /> Today's submissions</p>
            </div>
          </div>
          <div className="analytics-v2-metric-box">
            <div className="metric-header">
              <UserCheck size={16} color="#EA580C" />
              <span>Active Caregivers</span>
            </div>
            <div className="metric-body">
              <h3>{kpis.active_caregivers.toLocaleString()} Caregivers</h3>
              <p className="trend positive"><TrendingUp size={14} /> Currently assigned</p>
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
              {monthly_users.length > 0 ? (
                <>
                  <svg viewBox="0 0 500 200" className="analytics-svg-graph">
                    {/* Horizontal Guide Lines */}
                    <line x1="20" y1="40" x2="480" y2="40" stroke="#f1f5f9" />
                    <line x1="20" y1="90" x2="480" y2="90" stroke="#f1f5f9" />
                    <line x1="20" y1="140" x2="480" y2="140" stroke="#f1f5f9" />
                    <line x1="20" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
                    
                    {/* Bar Graph Columns */}
                    {monthly_users.slice(-6).map((dataPoint, i) => {
                      const spacing = 80;
                      const startX = 40;
                      const xPos = startX + (i * spacing);
                      
                      const barHeight = Math.max((dataPoint.users / maxUsers) * maxBarHeight, 10);
                      const yPos = 180 - barHeight;

                      return (
                        <g key={dataPoint.month_key}>
                          <rect x={xPos} y={yPos} width="30" height={barHeight} rx="3" fill="#00A896" />
                        </g>
                      );
                    })}
                  </svg>
                  <div className="chart-legend-x" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px', marginTop: '10px' }}>
                    {monthly_users.slice(-6).map(m => (
                      <span key={m.month_key} style={{ fontSize: '12px', color: '#64748B', width: '30px', textAlign: 'center' }}>
                        {m.month.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                  No sufficient data for graph.
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Alert Severity breakdown */}
          <div className="analytics-v2-card">
            <div className="analytics-v2-card-header">
              <h4>System Vitals Alerts Distribution</h4>
              <p>Warning alerts categorized by type</p>
            </div>
            
            <div className="chart-wrapper flex-row">
              {logs_by_condition.length > 0 ? (
                <>
                  {/* SVG Donut Chart */}
                  <svg viewBox="0 0 200 200" className="donut-chart-svg" style={{ width: '130px', transform: 'rotate(-90deg)' }}>
                    {logs_by_condition.map((item, i) => {
                      const percentage = item.count / totalLogs;
                      const dashArrayLength = 2 * Math.PI * 70; // Circumference where r=70 is approx 439.8
                      const strokeLength = percentage * dashArrayLength;
                      
                      const strokeDasharray = `${strokeLength} ${dashArrayLength}`;
                      const strokeDashoffset = -currentOffset;
                      
                      currentOffset += strokeLength;

                      return (
                        <circle 
                          key={item.type}
                          cx="100" cy="100" r="70" 
                          fill="none" 
                          stroke={getConditionColor(item.type)} 
                          strokeWidth="20" 
                          strokeDasharray={strokeDasharray} 
                          strokeDashoffset={strokeDashoffset} 
                        />
                      );
                    })}
                  </svg>
                  
                  <div className="donut-legend-info">
                    {logs_by_condition.map(item => (
                      <div className="legend-item" key={item.type}>
                        <span className={`legend-color ${getConditionClass(item.type)}`} />
                        <span className="legend-label">{getConditionLabel(item.type)}</span>
                        <span className="legend-pct">{Math.round((item.count / totalLogs) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                  No log records found.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </AdminLayoutV2>
  );
};

export default AdminAnalyticsV2;
