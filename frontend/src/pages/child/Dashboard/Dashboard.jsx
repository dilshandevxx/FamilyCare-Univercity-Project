import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserPlus, Bell, ThumbsUp,
  Activity, Thermometer, UserSearch,
  Calendar, AlertTriangle, CheckCircle,
  Plus, Heart
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './Dashboard.css';

/* ─── Chart Data ─── */

const barHeights = [30, 50, 38, 65, 85, 55, 70];
const barDays    = ['M','T','W','T','F','S','S'];

const Dashboard = () => {
  const [pulse] = useState('Stable');
  const [dbParents, setDbParents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [parentsRes, alertsRes, healthRes] = await Promise.all([
          api.get('/parents'),
          api.get('/alerts'),
          api.get('/health')
        ]);
        setDbParents(parentsRes.data || []);
        setAlerts(alertsRes.data || []);
        setHealthLogs(healthRes.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const unreadAlertsCount = alerts.filter(a => !a.is_resolved).length;

  return (
    <ChildLayout title="Dashboard">
      <div className="cd-root">
        
        {/* ── Greeting Header ── */}
        <div className="cd-greeting-header">
          <h1 className="cd-greeting-title">{getGreeting()}, Alex.</h1>
          <p className="cd-greeting-subtitle">Here is your family's care summary for today.</p>
        </div>

        {/* ── Top stats ── */}
        <div className="cd-stats-row">
          <div className="cd-stat-card">
            <div>
              <p className="cd-stat-label">TOTAL PARENTS</p>
              <h2 className="cd-stat-val">
                {String(dbParents.length).padStart(2, '0')}
              </h2>
            </div>
            <div className="cd-stat-icon teal"><Users size={22}/></div>
          </div>
          <div className="cd-stat-card">
            <div>
              <p className="cd-stat-label">ACTIVE CAREGIVERS</p>
              <h2 className="cd-stat-val">04</h2>
            </div>
            <div className="cd-stat-icon teal"><UserPlus size={22}/></div>
          </div>
          <div className="cd-stat-card">
            <div>
              <p className="cd-stat-label">ALERTS TODAY</p>
              <h2 className="cd-stat-val">{String(unreadAlertsCount).padStart(2, '0')}</h2>
            </div>
            <div className="cd-stat-icon orange"><Bell size={22}/></div>
          </div>
          <div className="cd-stat-card">
            <div>
              <p className="cd-stat-label">HEALTH STATUS</p>
              <h2 className="cd-stat-val teal-text">Stable</h2>
            </div>
            <div className="cd-stat-icon teal"><ThumbsUp size={22}/></div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="cd-main-grid">

          {/* ── Left column ── */}
          <div className="cd-left">

            {/* Today's Pulse */}
            <div className="cd-card">
              <h3 className="cd-card-title">Today's Pulse</h3>
              <div className="cd-pulse-box">
                <div className="cd-pulse-left">
                  <p className="cd-pulse-label">OVERALL STATUS</p>
                  <div className="cd-pulse-status">
                    <span className="cd-pulse-text">{pulse}</span>
                    <CheckCircle size={22} className="cd-pulse-check" />
                  </div>
                </div>
                <div className="cd-pulse-right">
                  <div className="cd-metric">
                    <Heart size={14} className="cd-metric-icon orange" />
                    <div>
                      <p className="cd-metric-val">4 / 6</p>
                      <p className="cd-metric-label">MEDS TAKEN</p>
                    </div>
                  </div>
                  <div className="cd-metric">
                    <Activity size={14} className="cd-metric-icon pink" />
                    <div>
                      <p className="cd-metric-val">72 bpm</p>
                      <p className="cd-metric-label">AVG HEART RATE</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="cd-card">
              <div className="cd-section-hd">
                <h3 className="cd-card-title" style={{margin:0}}>Family Overview</h3>
                <Link to="/parents" className="cd-view-all">View All</Link>
              </div>

              {loading ? (
                <div className="cd-family-grid">
                  <div className="cd-skeleton cd-skeleton-box" style={{ height: '120px' }}></div>
                  <div className="cd-skeleton cd-skeleton-box" style={{ height: '120px' }}></div>
                </div>
              ) : dbParents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#64748b' }}>
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.8rem' }}>No parents registered yet.</p>
                  <Link to="/add-parent" className="pm-add-btn" style={{ display: 'inline-flex', textDecoration: 'none', margin: '0 auto', padding: '0.5rem 1rem' }}>
                    <Plus size={14} /> Add Parent
                  </Link>
                </div>
              ) : (
                <div className="cd-family-grid">
                  {dbParents.map(p => {
                    const seed = p.name || 'Parent';
                    const location = p.address || 'At Home';
                    const age = p.age || 'N/A';
                    const topColorClass = (p.id % 2 === 0) ? 'amber-top' : 'teal-top';
                    const badgeClass = (p.id % 2 === 0) ? 'warning' : 'good';
                    const badgeText = (p.id % 2 === 0) ? 'WARNING' : 'GOOD';

                    return (
                      <div key={p.id} className={`cd-family-card ${topColorClass}`}>
                        <div className="cd-family-head">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`} alt={p.name} className="cd-family-img"/>
                          <div>
                            <p className="cd-family-name">{p.name}</p>
                            <p className="cd-family-detail">Age: {age} • {location}</p>
                          </div>
                          <span className={`cd-badge ${badgeClass}`}>{badgeText}</span>
                        </div>
                        <div className="cd-family-meta">
                          <div className="cd-meta-row">
                            <span className="cd-ml">Primary Caregiver</span>
                            <span className="cd-mv">{p.caregiver_name || 'Unassigned'}</span>
                          </div>
                          <div className="cd-meta-row">
                            <span className="cd-ml">Relation</span>
                            <span className="cd-mv">{p.relationship || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="cd-family-btns">
                          <button className="cd-fbtn">Vitals</button>
                          <Link to="/parents" className="cd-fbtn" style={{ textAlign: 'center', textDecoration: 'none' }}>Details</Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="cd-card">
              <div className="cd-section-hd">
                <h3 className="cd-card-title" style={{margin:0}}>Active Alerts</h3>
                <Link to="/alerts" className="cd-view-all">View All Alerts</Link>
              </div>
              
              {loading ? (
                <div>
                  <div className="cd-skeleton cd-skeleton-box" style={{ height: '60px', marginBottom: '10px' }}></div>
                  <div className="cd-skeleton cd-skeleton-box" style={{ height: '60px' }}></div>
                </div>
              ) : alerts.filter(a => !a.is_resolved).length === 0 ? (
                <div className="cd-alert-box" style={{ background: '#f8fafc', borderColor: '#e2e8f0', alignItems: 'center' }}>
                  <CheckCircle size={20} color="#00a896" />
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>No active alerts. Everything is stable.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {alerts.filter(a => !a.is_resolved).slice(0, 3).map(alert => (
                    <div key={alert.id} className={`cd-alert-box ${alert.type || 'info'}`}>
                      <div className={`cd-alert-icon-wrap ${alert.type || 'info'}`}>
                        {alert.type === 'critical' ? <AlertTriangle size={18} className="cd-alert-icon" style={{color: '#ef4444'}} /> :
                         alert.type === 'warning' ? <AlertTriangle size={18} className="cd-alert-icon" style={{color: '#d97706'}} /> :
                         <CheckCircle size={18} className="cd-alert-icon" style={{color: '#3b82f6'}} />}
                      </div>
                      <div className="cd-alert-body">
                        <p className="cd-alert-title">{alert.title}</p>
                        <p className="cd-alert-desc">{alert.description}</p>
                        <div className="cd-alert-actions">
                          <button className={`cd-alert-btn-primary ${alert.type || 'info'}`}>VIEW DETAILS</button>
                          <button className="cd-alert-btn-ghost">DISMISS</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Health Trends – Sleep Quality */}
            <div className="cd-card">
              <div className="cd-section-hd">
                <h3 className="cd-card-title" style={{margin:0}}>Health Trends</h3>
              </div>
              <div className="cd-trend-hd">
                <span className="cd-trend-label">Sleep Quality (Weekly)</span>
                <span className="cd-trend-badge">+12% vs last week</span>
              </div>
              <div className="cd-bar-chart">
                {barHeights.map((h, i) => (
                  <div key={i} className="cd-bar-col">
                    <div
                      className={`cd-bar${i === 4 ? ' highlight' : ''}`}
                      style={{ height: `${h}%` }}
                    />
                    <span className="cd-bar-label">{barDays[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts row: BP + Temp */}
            <div className="cd-charts-row">
              <div className="cd-card cd-chart-card">
                <div className="cd-chart-hd">
                  <Activity size={16} className="cd-chart-icon" />
                  <span>Blood Pressure Trend</span>
                </div>
                <div className="cd-bp-bars">
                  {[40, 62, 50, 78, 70, 55, 60].map((h, i) => (
                    <div key={i} className="cd-bar-col">
                      <div className={`cd-bp-bar${i === 3 ? ' highlight' : ''}`} style={{ height: `${h}%` }} />
                      <span className="cd-bar-label">{barDays[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="cd-card cd-chart-card">
                <div className="cd-chart-hd">
                  <Thermometer size={16} className="cd-chart-icon" />
                  <span>Temperature Stability</span>
                </div>
                <div className="cd-temp-avg-row">
                  <span className="cd-temp-lbl">Today's Avg</span>
                  <span className="cd-temp-val">98.4°F</span>
                </div>
                <div className="cd-temp-bar"><div className="cd-temp-fill" /></div>
                <p className="cd-temp-desc">Temperature has remained within the normal range (97.8°F – 99.1°F) for the past 72 hours.</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="cd-card">
              <h3 className="cd-card-title">Recent Activity</h3>
              {loading ? (
                <div>
                  <div className="cd-skeleton cd-skeleton-box" style={{ height: '60px' }}></div>
                  <div className="cd-skeleton cd-skeleton-box" style={{ height: '60px' }}></div>
                  <div className="cd-skeleton cd-skeleton-box" style={{ height: '60px' }}></div>
                </div>
              ) : healthLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem 0', color: '#64748b', fontSize: '0.82rem' }}>
                  No recent health activity.
                </div>
              ) : (
                <div className="cd-feed">
                  {healthLogs.slice(0, 5).map((log, i) => {
                    const date = new Date(log.logged_at || log.created_at);
                    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div key={log.id || i} className="cd-feed-item">
                        <div className="cd-feed-dot" style={{ background: '#00a896' }} />
                        <div className="cd-feed-body">
                          <p className="cd-feed-time">{timeString} • {log.parent_name}</p>
                          <p className="cd-feed-title">Health Check-in</p>
                          <p className="cd-feed-desc">
                            Vitals: BP {log.blood_pressure || 'N/A'}, HR {log.heart_rate || 'N/A'} bpm.
                            {log.notes ? ` Notes: ${log.notes}` : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add New Member */}
            <Link to="/add-parent" className="cd-add-btn">
              <Plus size={18} /> Add New Member
            </Link>

          </div>

          {/* ── Right column ── */}
          <div className="cd-right">

            {/* Quick Actions */}
            <div className="cd-card">
              <h3 className="cd-card-title">Quick Actions</h3>
              <div className="cd-qa-grid">
                <Link to="/add-parent" className="cd-qa-btn">
                  <UserPlus size={20} className="cd-qa-icon" />
                  <span>Add Parent</span>
                </Link>
                <Link to="/caregivers-list" className="cd-qa-btn">
                  <UserSearch size={20} className="cd-qa-icon" />
                  <span>Find Carer</span>
                </Link>
                <button className="cd-qa-btn">
                  <Calendar size={20} className="cd-qa-icon" />
                  <span>Schedule</span>
                </button>
                <button className="cd-qa-btn emergency" onClick={() => setShowEmergency(true)}>
                  <AlertTriangle size={20} />
                  <span>Emergency</span>
                </button>
              </div>
            </div>





          </div>
        </div>

        {/* Emergency Modal Overlay */}
        {showEmergency && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <div style={{ background: '#fef2f2', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <AlertTriangle size={32} color="#ef4444" />
              </div>
              <h2 style={{ margin: '0 0 10px', fontSize: '20px', color: '#0f172a' }}>Emergency Contacts</h2>
              <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                Please select a service or primary caregiver to contact immediately.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button style={{ padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Call 911</button>
                <button style={{ padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Call Primary Nurse</button>
                <button onClick={() => setShowEmergency(false)} style={{ padding: '12px', background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ChildLayout>
  );
};

export default Dashboard;
