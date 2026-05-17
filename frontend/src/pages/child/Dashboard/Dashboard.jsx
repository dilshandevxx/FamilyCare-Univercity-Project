import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserPlus, Bell, ThumbsUp,
  Activity, Thermometer, UserSearch,
  Calendar, AlertTriangle, CheckCircle,
  Plus, Heart
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import './Dashboard.css';

/* ─── mock data ─── */
const parents = [
  {
    id: 1, name: 'Eleanor Johnson', age: 82,
    location: 'At Home', vitality: 94,
    meds: '4/6', heartRate: '72 bpm',
    status: 'stable', img: 'Eleanor',
  },
];

const activityFeed = [
  { time: '2 HOURS AGO', title: 'Lunch Completed', desc: 'Eleanor had a full meal with Nurse Sarah. Mood was described as "cheerful".', dot: '#00a896' },
  { time: '4 HOURS AGO', title: 'Physical Therapy', desc: 'Arthur completed his 30-minute mobility session at the rehab centre.', dot: '#94a3b8' },
  { time: '6 HOURS AGO', title: 'Morning Vitals', desc: "Both parents' morning readings were within normal ranges.", dot: '#94a3b8' },
];

const barHeights = [30, 50, 38, 65, 85, 55, 70];
const barDays    = ['M','T','W','T','F','S','S'];

const Dashboard = () => {
  const [pulse] = useState('Stable');

  return (
    <ChildLayout title="Dashboard">
      <div className="cd-root">

        {/* ── Top stats ── */}
        <div className="cd-stats-row">
          <div className="cd-stat-card">
            <div>
              <p className="cd-stat-label">TOTAL PARENTS</p>
              <h2 className="cd-stat-val">02</h2>
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
              <h2 className="cd-stat-val">03</h2>
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

            {/* My Parents */}
            <div className="cd-card">
              <div className="cd-section-hd">
                <h3 className="cd-card-title" style={{margin:0}}>My Parents</h3>
                <Link to="/parents" className="cd-view-all">View All</Link>
              </div>

              {parents.map(p => (
                <div key={p.id} className="cd-parent-row">
                  <div className="cd-parent-avatar">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.img}`} alt={p.name} />
                  </div>
                  <div className="cd-parent-info">
                    <p className="cd-parent-name">{p.name}</p>
                    <p className="cd-parent-meta">{p.location} • {p.age} yrs old</p>
                    <div className="cd-vitality-row">
                      <span className="cd-vitality-label">Vitality</span>
                      <div className="cd-vitality-bar">
                        <div className="cd-vitality-fill" style={{width:`${p.vitality}%`}} />
                      </div>
                      <span className="cd-vitality-pct">{p.vitality}%</span>
                    </div>
                    <div className="cd-parent-actions">
                      <span className="cd-pill">Mut</span>
                      <span className="cd-pill">Cl</span>
                      <Link to="/parents" className="cd-details-btn">Details</Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Family Overview */}
              <div style={{marginTop:'20px'}}>
                <div className="cd-section-hd" style={{marginBottom:'14px'}}>
                  <span className="cd-card-title" style={{margin:0}}>Family Overview</span>
                  <Link to="/parents" className="cd-view-all">View All Family</Link>
                </div>
                <div className="cd-family-grid">
                  {/* Arthur */}
                  <div className="cd-family-card teal-top">
                    <div className="cd-family-head">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arthur" alt="Arthur" className="cd-family-img"/>
                      <div>
                        <p className="cd-family-name">Arthur Miller</p>
                        <p className="cd-family-detail">Age: 78 • Heart Condition</p>
                      </div>
                      <span className="cd-badge good">GOOD</span>
                    </div>
                    <div className="cd-family-meta">
                      <div className="cd-meta-row"><span className="cd-ml">Primary Caregiver</span><span className="cd-mv">Sarah Jenkins</span></div>
                      <div className="cd-meta-row"><span className="cd-ml">Last Update</span><span className="cd-mv">15 mins ago</span></div>
                    </div>
                    <div className="cd-family-btns">
                      <button className="cd-fbtn">Vitals</button>
                      <button className="cd-fbtn">Call</button>
                    </div>
                  </div>
                  {/* Martha */}
                  <div className="cd-family-card amber-top">
                    <div className="cd-family-head">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Martha" alt="Martha" className="cd-family-img"/>
                      <div>
                        <p className="cd-family-name">Martha Miller</p>
                        <p className="cd-family-detail">Age: 75 • Type 2 Diabetes</p>
                      </div>
                      <span className="cd-badge warning">WARNING</span>
                    </div>
                    <div className="cd-family-meta">
                      <div className="cd-meta-row"><span className="cd-ml">Primary Caregiver</span><span className="cd-mv">David Chan</span></div>
                      <div className="cd-meta-row"><span className="cd-ml">Last Update</span><span className="cd-mv">2 hours ago</span></div>
                    </div>
                    <div className="cd-family-btns">
                      <button className="cd-fbtn">Vitals</button>
                      <button className="cd-fbtn">Call</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="cd-card">
              <h3 className="cd-card-title">Active Alerts</h3>
              <div className="cd-alert-box">
                <div className="cd-alert-icon-wrap">
                  <AlertTriangle size={18} className="cd-alert-icon" />
                </div>
                <div className="cd-alert-body">
                  <p className="cd-alert-title">Missed Medication: <strong>Arthur</strong></p>
                  <p className="cd-alert-desc">The evening dosage for blood pressure was not marked as taken by 8:00 PM.</p>
                  <div className="cd-alert-actions">
                    <button className="cd-alert-btn-primary">CONTACT NURSE</button>
                    <button className="cd-alert-btn-ghost">DISMISS</button>
                  </div>
                </div>
              </div>
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
              <div className="cd-feed">
                {activityFeed.map((a, i) => (
                  <div key={i} className="cd-feed-item">
                    <div className="cd-feed-dot" style={{ background: a.dot }} />
                    <div className="cd-feed-body">
                      <p className="cd-feed-time">{a.time}</p>
                      <p className="cd-feed-title">{a.title}</p>
                      <p className="cd-feed-desc">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                <button className="cd-qa-btn emergency">
                  <AlertTriangle size={20} />
                  <span>Emergency</span>
                </button>
              </div>
            </div>

            {/* Active Alerts Right */}
            <div className="cd-card">
              <div className="cd-alert-hd">
                <AlertTriangle size={16} className="cd-alert-hd-icon" />
                <h3 className="cd-card-title" style={{margin:0}}>Active Alerts</h3>
              </div>
              <div className="cd-alert-list">
                <div className="cd-alert-item amber">
                  <div className="cd-alert-item-icon">
                    <AlertTriangle size={14} />
                  </div>
                  <div>
                    <p className="cd-ali-title">Missed medication</p>
                    <p className="cd-ali-desc">Martha • Metformin (500mg)</p>
                    <p className="cd-ali-time amber-text">45 MINS OVERDUE</p>
                  </div>
                </div>
                <div className="cd-alert-item white">
                  <div className="cd-alert-item-icon grey">
                    <Activity size={14} />
                  </div>
                  <div>
                    <p className="cd-ali-title">Abnormal BP Reading</p>
                    <p className="cd-ali-desc">Arthur • 142/95 mmHg</p>
                    <p className="cd-ali-time grey-text">LOGGED AT 09:30 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed Right */}
            <div className="cd-card">
              <h3 className="cd-card-title">Recent Activity Feed</h3>
              <div className="cd-rfeed">
                {[
                  { title: 'BP checked & normal', desc: 'Arthur • 120/80 mmHg', time: '10:45 AM' },
                  { title: 'Medicine taken', desc: 'Martha • Morning Vitamin Pack', time: '09:15 AM' },
                  { title: 'Meal completed', desc: 'Arthur • Low-sodium breakfast', time: '08:30 AM' },
                ].map((r, i) => (
                  <div key={i} className="cd-rfeed-item">
                    <div className="cd-rfeed-dot" />
                    <div className="cd-rfeed-body">
                      <p className="cd-rfeed-title">{r.title}</p>
                      <p className="cd-rfeed-desc">{r.desc}</p>
                      <span className="cd-rfeed-time">{r.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </ChildLayout>
  );
};

export default Dashboard;
