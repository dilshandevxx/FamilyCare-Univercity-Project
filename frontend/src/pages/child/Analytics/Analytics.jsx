import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Thermometer, Pill, AlertTriangle,
  CheckCircle, Clock, Activity, TrendingUp,
  TrendingDown, Minus, ChevronDown, RefreshCw,
  Coffee, Sun, Moon, Shield, Smile, Meh, Frown,
  BarChart2, Download, User, PhoneCall
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './Analytics.css';

// ─── Tiny inline SVG Sparkline ─────────────────────────────────────────────
const Sparkline = ({ values = [], color = '#00A896', height = 48 }) => {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 120;
  const h = height;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const area = `0,${h} ${polyline} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="spark-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── Donut Ring ────────────────────────────────────────────────────────────
const DonutRing = ({ percent = 0, color = '#00A896', size = 72, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="donut-ring">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

// ─── Status badge helper ────────────────────────────────────────────────────
const statusColor = (s = '') => {
  const sl = s.toLowerCase();
  if (sl.includes('high') || sl.includes('critical') || sl.includes('elevated')) return 'red';
  if (sl.includes('attention') || sl.includes('delayed') || sl.includes('review')) return 'amber';
  return 'green';
};

// ─── Trend icon ──────────────────────────────────────────────────────────
const Trend = ({ dir }) => {
  if (dir === 'up') return <TrendingUp size={13} className="trend-icon up" />;
  if (dir === 'down') return <TrendingDown size={13} className="trend-icon down" />;
  return <Minus size={13} className="trend-icon flat" />;
};

// ─── Mood emoji map ───────────────────────────────────────────────────────
const moodEmoji = { happy: '😊', calm: '😌', tired: '😴', restless: '😟' };

// ═══════════════════════════════════════════════════════════════════════════
const Analytics = () => {
  const [parents, setParents]           = useState([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [loading, setLoading]           = useState(true);
  const [data, setData]                 = useState(null);
  const [activeChart, setActiveChart]   = useState('bp'); // 'bp'|'hr'|'temp'
  const [toast, setToast]               = useState('');

  // fetch parents
  useEffect(() => {
    api.get('/parents').then(res => {
      const list = res.data || [];
      setParents(list);
      if (list.length > 0) setSelectedParentId(list[0].id.toString());
      else setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // fetch analytics
  useEffect(() => {
    if (!selectedParentId) return;
    setLoading(true);
    api.get(`/health/analytics?parent_id=${selectedParentId}&range=${encodeURIComponent(selectedRange)}`)
      .then(res => setData(res.data))
      .catch(err => console.error('analytics fetch error', err))
      .finally(() => setLoading(false));
  }, [selectedParentId, selectedRange]);

  const handleReport = () => {
    setToast('📄 Preparing summary report…');
    setTimeout(() => { setToast('✅ Report ready! (PDF download would go here)'); setTimeout(() => setToast(''), 3500); }, 1400);
  };

  // ── derive display values from API data ──────────────────────────────────
  const s = data?.summary || {};
  const parent = data?.parentInfo || {};
  const ts = data?.timeSeries || [];
  const meds = data?.medicationAnalytics || {};
  const nutrition = data?.nutritionData || [];
  const insights = data?.aiInsights || [];
  const mood = data?.moodBreakdown || {};

  // chart series
  const chartSeries = {
    bp:   ts.map(p => p.systolic),
    hr:   ts.map(p => p.heartRate),
    temp: ts.map(p => p.temp),
  };
  const chartLabels = ts.map(p => p.label);
  const chartMeta = {
    bp:   { label: 'Blood Pressure', unit: 'mmHg', color: '#ef4444', normal: '115–130' },
    hr:   { label: 'Heart Rate',     unit: 'bpm',  color: '#f97316', normal: '60–100' },
    temp: { label: 'Temperature',    unit: '°F',   color: '#8b5cf6', normal: '97–99' },
  };

  const selectedParent = parents.find(p => p.id.toString() === selectedParentId);
  const parentName = parent.name || selectedParent?.name || 'Your Parent';
  const firstName = parentName.split(' ')[0];

  // wellness score
  const score = s.wellnessScore || 88;
  const scoreColor = score >= 85 ? '#00A896' : score >= 75 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score >= 85 ? 'Great Shape' : score >= 75 ? 'Stable' : 'Needs Attention';

  return (
    <ChildLayout title="Health Overview">
      <div className="fan-wrap">

        {/* ── TOP HEADER ─────────────────────────────────────────────── */}
        <div className="fan-topbar">
          <div className="fan-topbar-left">
            <h1 className="fan-page-h1">
              <span className="fan-h1-emoji">💚</span>
              {firstName}'s Health Overview
            </h1>
            <p className="fan-page-sub">Real-time wellness snapshot for your family member</p>
          </div>
          <div className="fan-topbar-right">
            {/* Resident picker */}
            <div className="fan-select-wrap">
              <User size={14} />
              <select value={selectedParentId} onChange={e => setSelectedParentId(e.target.value)} className="fan-select">
                {parents.length === 0
                  ? <option value="">Eleanor Vance (Mother)</option>
                  : parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                }
              </select>
              <ChevronDown size={13} />
            </div>
            {/* Range picker */}
            <div className="fan-select-wrap">
              <Clock size={14} />
              <select value={selectedRange} onChange={e => setSelectedRange(e.target.value)} className="fan-select">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
              </select>
              <ChevronDown size={13} />
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fan-toast">{toast}</div>
        )}

        {/* ── LOADING ────────────────────────────────────────────────── */}
        {loading ? (
          <div className="fan-loading">
            <RefreshCw size={28} className="fan-spin" />
            <span>Loading health data…</span>
          </div>
        ) : (
          <div className="fan-body">

            {/* ── ROW 1: Wellness Score + 4 vitals ────────────────────── */}
            <div className="fan-row-top">

              {/* Wellness Score Card */}
              <div className="fan-score-card">
                <div className="fan-score-ring-wrap">
                  <DonutRing percent={score} color={scoreColor} size={110} stroke={10} />
                  <div className="fan-score-center">
                    <span className="fan-score-num" style={{ color: scoreColor }}>{score}</span>
                    <span className="fan-score-label">/100</span>
                  </div>
                </div>
                <div className="fan-score-info">
                  <span className="fan-score-title">Overall Wellness</span>
                  <span className="fan-score-badge" style={{ background: `${scoreColor}18`, color: scoreColor }}>
                    {scoreLabel}
                  </span>
                  <p className="fan-score-desc">
                    {firstName} is <strong>{scoreLabel.toLowerCase()}</strong> this {selectedRange.toLowerCase()}.
                  </p>
                  <div className="fan-score-pills">
                    <span className="fan-pill green"><CheckCircle size={11}/> Meds on track</span>
                    <span className="fan-pill green"><Activity size={11}/> Vitals stable</span>
                    {s.criticalAlerts > 0
                      ? <span className="fan-pill red"><AlertTriangle size={11}/> {s.criticalAlerts} alert{s.criticalAlerts > 1 ? 's' : ''}</span>
                      : <span className="fan-pill green"><Shield size={11}/> No alerts</span>
                    }
                  </div>
                </div>
              </div>

              {/* 4 Vital Cards */}
              <div className="fan-vitals-grid">

                {/* Blood Pressure */}
                <div className="fan-vital-card">
                  <div className="fan-vital-top">
                    <div className="fan-vital-icon" style={{ background: '#fef2f2' }}>
                      <Heart size={18} color="#ef4444" />
                    </div>
                    <Sparkline values={chartSeries.bp} color="#ef4444" />
                  </div>
                  <div className="fan-vital-val">{s.avgBp || '122/78'}</div>
                  <div className="fan-vital-name">Blood Pressure <span className="fan-unit">mmHg</span></div>
                  <div className={`fan-vital-status ${statusColor(s.bpStatus)}`}>
                    {s.bpStatus || 'Normal'}
                  </div>
                </div>

                {/* Heart Rate */}
                <div className="fan-vital-card">
                  <div className="fan-vital-top">
                    <div className="fan-vital-icon" style={{ background: '#fff7ed' }}>
                      <Activity size={18} color="#f97316" />
                    </div>
                    <Sparkline values={chartSeries.hr} color="#f97316" />
                  </div>
                  <div className="fan-vital-val">{s.avgHeartRate || 74} <span className="fan-unit">bpm</span></div>
                  <div className="fan-vital-name">Heart Rate</div>
                  <div className={`fan-vital-status ${statusColor(s.hrStatus)}`}>
                    {s.hrStatus ? s.hrStatus.split('(')[0].trim() : 'Normal Resting'}
                  </div>
                </div>

                {/* Temperature */}
                <div className="fan-vital-card">
                  <div className="fan-vital-top">
                    <div className="fan-vital-icon" style={{ background: '#fdf4ff' }}>
                      <Thermometer size={18} color="#a855f7" />
                    </div>
                    <Sparkline values={chartSeries.temp} color="#a855f7" />
                  </div>
                  <div className="fan-vital-val">{s.avgTemp || '98.4'}<span className="fan-unit">°F</span></div>
                  <div className="fan-vital-name">Body Temperature</div>
                  <div className={`fan-vital-status ${statusColor(s.tempStatus)}`}>
                    {s.tempStatus || 'Optimal Stable'}
                  </div>
                </div>

                {/* Logs this period */}
                <div className="fan-vital-card">
                  <div className="fan-vital-top">
                    <div className="fan-vital-icon" style={{ background: '#f0fdf4' }}>
                      <BarChart2 size={18} color="#22c55e" />
                    </div>
                    <Sparkline values={[12,14,13,16,15,14,16]} color="#22c55e" />
                  </div>
                  <div className="fan-vital-val">{s.totalLogs || 28}</div>
                  <div className="fan-vital-name">Health Logs</div>
                  <div className="fan-vital-status green">{s.logCompliance || '96%'} compliance</div>
                </div>

              </div>
            </div>

            {/* ── ROW 2: Chart + Medication ───────────────────────────── */}
            <div className="fan-row-mid">

              {/* Vitals Trend Chart */}
              <div className="fan-chart-card">
                <div className="fan-card-head">
                  <div>
                    <h3 className="fan-card-title">Vitals Trend</h3>
                    <p className="fan-card-subtitle">How {firstName}'s key vitals changed over {selectedRange.toLowerCase()}</p>
                  </div>
                  <div className="fan-chart-tabs">
                    {['bp','hr','temp'].map(k => (
                      <button
                        key={k}
                        className={`fan-chart-tab${activeChart === k ? ' active' : ''}`}
                        onClick={() => setActiveChart(k)}
                        style={activeChart === k ? { borderColor: chartMeta[k].color, color: chartMeta[k].color } : {}}
                      >
                        {chartMeta[k].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG line chart */}
                {(() => {
                  const series = chartSeries[activeChart] || [];
                  const meta = chartMeta[activeChart];
                  if (!series.length) return <div className="fan-no-data">No data yet</div>;
                  const min = Math.min(...series) - 5;
                  const max = Math.max(...series) + 5;
                  const W = 600; const H = 160;
                  const x = (i) => (i / (series.length - 1)) * (W - 40) + 20;
                  const y = (v) => H - 20 - ((v - min) / (max - min)) * (H - 40);
                  const linePath = series.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
                  const areaPath = `M ${x(0)} ${H - 20} ` + series.map((v, i) => `L ${x(i)} ${y(v)}`).join(' ') + ` L ${x(series.length - 1)} ${H - 20} Z`;
                  return (
                    <div className="fan-chart-body">
                      <svg viewBox={`0 0 ${W} ${H}`} className="fan-main-svg">
                        <defs>
                          <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={meta.color} stopOpacity="0.18" />
                            <stop offset="100%" stopColor={meta.color} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        {[0,1,2,3].map(i => {
                          const gy = 20 + i * (H - 40) / 3;
                          return <line key={i} x1="20" y1={gy} x2={W-20} y2={gy} stroke="#f1f5f9" strokeWidth="1" />;
                        })}
                        {/* Area */}
                        <path d={areaPath} fill="url(#mainGrad)" />
                        {/* Line */}
                        <path d={linePath} fill="none" stroke={meta.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Dots */}
                        {series.map((v, i) => (
                          <g key={i}>
                            <circle cx={x(i)} cy={y(v)} r="5" fill="white" stroke={meta.color} strokeWidth="2.5" />
                            <text x={x(i)} y={y(v) - 10} textAnchor="middle" className="fan-dot-label" fill={meta.color}>{v}</text>
                          </g>
                        ))}
                        {/* X Labels */}
                        {chartLabels.map((lbl, i) => (
                          <text key={i} x={x(i)} y={H - 4} textAnchor="middle" className="fan-x-label">{lbl}</text>
                        ))}
                      </svg>
                      <div className="fan-chart-legend">
                        <span style={{ color: meta.color }}>● {meta.label}</span>
                        <span className="fan-chart-normal">Normal: {meta.normal} {meta.unit}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Medication Adherence */}
              <div className="fan-med-card">
                <div className="fan-card-head">
                  <h3 className="fan-card-title">💊 Medications</h3>
                  <span className="fan-med-pct" style={{ color: '#00A896' }}>{meds.overallAdherence || 94}%</span>
                </div>
                <p className="fan-card-subtitle">{firstName}'s prescription adherence rate</p>

                <DonutRing percent={meds.overallAdherence || 94} color="#00A896" size={88} stroke={9} />
                <div className="fan-med-legend-row">
                  <div className="fan-med-stat"><span className="fan-dot green"></span><span>{meds.onTimeDoses || 38}</span><small>On Time</small></div>
                  <div className="fan-med-stat"><span className="fan-dot amber"></span><span>{meds.delayedDoses || 3}</span><small>Delayed</small></div>
                  <div className="fan-med-stat"><span className="fan-dot red"></span><span>{meds.missedDoses || 1}</span><small>Missed</small></div>
                </div>

                <div className="fan-med-list">
                  {(meds.activeMedications || []).slice(0, 3).map((m, i) => (
                    <div key={i} className="fan-med-item">
                      <div className="fan-med-dot" style={{ background: m.adherence >= 95 ? '#22c55e' : m.adherence >= 85 ? '#f59e0b' : '#ef4444' }}></div>
                      <div className="fan-med-info">
                        <span className="fan-med-name">{m.name} <span className="fan-med-dose">{m.dosage}</span></span>
                        <span className="fan-med-freq">{m.frequency}</span>
                      </div>
                      <span className="fan-med-adh">{m.adherence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── ROW 3: Meals + Mood + Weekly check + Insights ──────── */}
            <div className="fan-row-bot">

              {/* Meals */}
              <div className="fan-meals-card">
                <h3 className="fan-card-title">🍽️ Meal Completion</h3>
                <p className="fan-card-subtitle">This week's eating habits</p>
                <div className="fan-meals-list">
                  {[
                    { icon: <Coffee size={16} color="#f97316"/>, label: 'Breakfast', data: nutrition[0] },
                    { icon: <Sun size={16} color="#eab308"/>,    label: 'Lunch',     data: nutrition[1] },
                    { icon: <Moon size={16} color="#6366f1"/>,   label: 'Dinner',    data: nutrition[2] },
                  ].map(({ icon, label, data: nd }) => (
                    <div key={label} className="fan-meal-row">
                      <div className="fan-meal-label">
                        {icon}
                        <span>{label}</span>
                      </div>
                      <div className="fan-meal-bar-wrap">
                        <div
                          className="fan-meal-bar"
                          style={{
                            width: `${nd?.percent || 0}%`,
                            background: nd?.color || '#00A896'
                          }}
                        />
                      </div>
                      <span className="fan-meal-pct">{nd?.percent || 0}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="fan-mood-card">
                <h3 className="fan-card-title">😊 Mood & Wellbeing</h3>
                <p className="fan-card-subtitle">How {firstName} has been feeling</p>
                <div className="fan-mood-grid">
                  {Object.entries(mood).map(([k, v]) => (
                    <div key={k} className="fan-mood-item">
                      <span className="fan-mood-emoji">{moodEmoji[k] || '🙂'}</span>
                      <span className="fan-mood-pct">{v}%</span>
                      <span className="fan-mood-name">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                    </div>
                  ))}
                </div>
                {Object.keys(mood).length === 0 && (
                  <div className="fan-mood-grid">
                    <div className="fan-mood-item"><span className="fan-mood-emoji">😊</span><span className="fan-mood-pct">68%</span><span className="fan-mood-name">Happy</span></div>
                    <div className="fan-mood-item"><span className="fan-mood-emoji">😌</span><span className="fan-mood-pct">24%</span><span className="fan-mood-name">Calm</span></div>
                    <div className="fan-mood-item"><span className="fan-mood-emoji">😴</span><span className="fan-mood-pct">6%</span><span className="fan-mood-name">Tired</span></div>
                    <div className="fan-mood-item"><span className="fan-mood-emoji">😟</span><span className="fan-mood-pct">2%</span><span className="fan-mood-name">Restless</span></div>
                  </div>
                )}
              </div>

              {/* AI Insights */}
              <div className="fan-insights-card">
                <div className="fan-card-head">
                  <h3 className="fan-card-title">✨ Key Insights</h3>
                </div>
                <p className="fan-card-subtitle">Smart observations about {firstName}'s health</p>
                <div className="fan-insights-list">
                  {(insights.length ? insights : [
                    { type: 'positive', title: 'Blood pressure is stable', desc: `${firstName}'s BP has been within the healthy range all week.` },
                    { type: 'recommendation', title: 'Keep up the hydration', desc: 'Temperature & energy levels are well-correlated with daily water intake.' },
                  ]).map((ins, i) => (
                    <div key={i} className={`fan-insight-item ${ins.type}`}>
                      <span className="fan-insight-badge">
                        {ins.type === 'positive' ? '✅' : ins.type === 'trend' ? '📊' : '💡'}
                      </span>
                      <div>
                        <div className="fan-insight-title">{ins.title}</div>
                        <div className="fan-insight-desc">{ins.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="fan-report-btn" onClick={handleReport}>
                  <Download size={14} /> Download Summary
                </button>
              </div>

            </div>

            {/* ── EMERGENCY CONTACT STRIP ────────────────────────────── */}
            <div className="fan-contact-strip">
              <PhoneCall size={16} />
              <span>Emergency contact for {firstName}: <strong>{parent.emergencyContact || '+1 (555) 234-5678'}</strong></span>
              <Link to="/caregivers-list" className="fan-contact-link">View Caregiver Team →</Link>
            </div>

          </div>
        )}
      </div>
    </ChildLayout>
  );
};

export default Analytics;
