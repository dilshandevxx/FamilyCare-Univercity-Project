import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Thermometer, Pill, AlertTriangle,
  CheckCircle, Clock, Activity, TrendingUp,
  TrendingDown, Minus, ChevronDown, RefreshCw,
  Coffee, Sun, Moon, Shield, Smile, Meh, Frown,
  BarChart2, Download, User, PhoneCall, PieChart as PieIcon,
  Sparkles
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import ColorfulPieChart from '../../../components/common/ColorfulPieChart';
import api from '../../../services/api';
import './Analytics.css';

// ─── Flat SVG Sparkline (No gradients) ───────────────────────────────────
const Sparkline = ({ values = [], color = '#00A896', height = 36 }) => {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 100;
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
      <polygon points={area} fill={color} fillOpacity="0.08" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── Status badge helper ──────────────────────────────────────────────────
const statusColor = (s = '') => {
  const sl = s.toLowerCase();
  if (sl.includes('high') || sl.includes('critical') || sl.includes('elevated')) return 'red';
  if (sl.includes('attention') || sl.includes('delayed') || sl.includes('review')) return 'amber';
  return 'green';
};

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
    setTimeout(() => { setToast('✅ Report ready! Summary generated.'); setTimeout(() => setToast(''), 3500); }, 1400);
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

  // wellness score & breakdown
  const score = s.wellnessScore || 88;
  const scoreColor = score >= 85 ? '#00A896' : score >= 75 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score >= 85 ? 'Great Shape' : score >= 75 ? 'Stable' : 'Needs Attention';

  // Colorful Pie Chart Data for Medication Status
  const medChartData = [
    { label: 'On Time', value: meds.onTimeDoses || 38, color: '#00A896' },
    { label: 'Delayed', value: meds.delayedDoses || 3, color: '#F59E0B' },
    { label: 'Missed',  value: meds.missedDoses || 1,  color: '#EF4444' },
  ];

  // Colorful Pie Chart Data for Mood & Wellbeing
  const moodEntries = Object.entries(mood);
  const moodChartData = moodEntries.length > 0
    ? moodEntries.map(([k, v]) => ({
        label: k.charAt(0).toUpperCase() + k.slice(1),
        value: Number(v) || 1,
        color: k === 'happy' ? '#10B981' : k === 'calm' ? '#3B82F6' : k === 'tired' ? '#F59E0B' : '#8B5CF6'
      }))
    : [
        { label: 'Happy',    value: 68, color: '#10B981' },
        { label: 'Calm',     value: 24, color: '#3B82F6' },
        { label: 'Tired',    value: 6,  color: '#F59E0B' },
        { label: 'Restless', value: 2,  color: '#EF4444' },
      ];

  // Wellness score donut data
  const wellnessDonutData = [
    { label: 'Score',     value: score,       color: '#00A896' },
    { label: 'Remainder', value: 100 - score, color: '#e2e8f0' },
  ];

  return (
    <ChildLayout title="Analytics & Health Insights">
      <div className="fan-wrap">

        {/* ── TOP HEADER ─────────────────────────────────────────────── */}
        <div className="fan-topbar">
          <div className="fan-topbar-left">
            <h1 className="fan-page-h1">
              <span className="fan-h1-emoji">📊</span>
              {firstName}'s Health Analytics
            </h1>
            <p className="fan-page-sub">Comprehensive clinical and daily care tracking metrics</p>
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
            <span>Loading health analytics…</span>
          </div>
        ) : (
          <div className="fan-body">

            {/* ── ROW 1: Wellness Score + 4 vitals ────────────────────── */}
            <div className="fan-row-top">

              {/* Wellness Score Card with Colorful Pie / Donut */}
              <div className="fan-score-card">
                <div className="fan-score-ring-wrap">
                  <ColorfulPieChart
                    data={wellnessDonutData}
                    size={135}
                    innerRadius={46}
                    outerRadius={62}
                    showLegend={false}
                    centerLabel="Score"
                    centerValue={`${score}%`}
                  />
                </div>
                <div className="fan-score-info">
                  <span className="fan-score-title">Overall Health Index</span>
                  <span className="fan-score-badge" style={{ background: `${scoreColor}18`, color: scoreColor }}>
                    {scoreLabel}
                  </span>
                  <p className="fan-score-desc">
                    {firstName} is maintaining <strong>{scoreLabel.toLowerCase()}</strong> status this {selectedRange.toLowerCase()}.
                  </p>
                  <div className="fan-score-pills">
                    <span className="fan-pill green"><CheckCircle size={11}/> Meds on track</span>
                    <span className="fan-pill green"><Activity size={11}/> Vitals stable</span>
                    {s.criticalAlerts > 0
                      ? <span className="fan-pill red"><AlertTriangle size={11}/> {s.criticalAlerts} alerts</span>
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
                  <div className="fan-vital-val">{s.avgBp || '122/78'} <span className="fan-unit">mmHg</span></div>
                  <div className="fan-vital-name">Blood Pressure</div>
                  <div className={`fan-vital-status ${statusColor(s.bpStatus)}`}>
                    {s.bpStatus || 'Optimal Range'}
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
                  <div className="fan-vital-name">Resting Heart Rate</div>
                  <div className={`fan-vital-status ${statusColor(s.hrStatus)}`}>
                    {s.hrStatus ? s.hrStatus.split('(')[0].trim() : 'Normal Resting'}
                  </div>
                </div>

                {/* Temperature */}
                <div className="fan-vital-card">
                  <div className="fan-vital-top">
                    <div className="fan-vital-icon" style={{ background: '#fdf4ff' }}>
                      <Thermometer size={18} color="#8b5cf6" />
                    </div>
                    <Sparkline values={chartSeries.temp} color="#8b5cf6" />
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
                      <BarChart2 size={18} color="#10B981" />
                    </div>
                    <Sparkline values={[12,14,13,16,15,14,16]} color="#10B981" />
                  </div>
                  <div className="fan-vital-val">{s.totalLogs || 28} <span className="fan-unit">logs</span></div>
                  <div className="fan-vital-name">Care Health Logs</div>
                  <div className="fan-vital-status green">{s.logCompliance || '96%'} compliance</div>
                </div>

              </div>
            </div>

            {/* ── ROW 2: Vitals Trend Chart + Medication Colorful Pie Chart */}
            <div className="fan-row-mid">

              {/* Vitals Trend Chart */}
              <div className="fan-chart-card">
                <div className="fan-card-head">
                  <div>
                    <h3 className="fan-card-title">Vitals Historical Trend</h3>
                    <p className="fan-card-subtitle">Trajectory of key vitals across {selectedRange.toLowerCase()}</p>
                  </div>
                  <div className="fan-chart-tabs">
                    {['bp','hr','temp'].map(k => (
                      <button
                        key={k}
                        className={`fan-chart-tab${activeChart === k ? ' active' : ''}`}
                        onClick={() => setActiveChart(k)}
                        style={activeChart === k ? { borderColor: chartMeta[k].color, color: chartMeta[k].color, background: `${chartMeta[k].color}12` } : {}}
                      >
                        {chartMeta[k].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG line chart (Clean flat solid fills) */}
                {(() => {
                  const series = chartSeries[activeChart] || [];
                  const meta = chartMeta[activeChart];
                  if (!series.length) return <div className="fan-no-data">No recorded data for this timeframe</div>;
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
                        {/* Grid lines */}
                        {[0,1,2,3].map(i => {
                          const gy = 20 + i * (H - 40) / 3;
                          return <line key={i} x1="20" y1={gy} x2={W-20} y2={gy} stroke="#f1f5f9" strokeWidth="1" />;
                        })}
                        {/* Area (flat color opacity) */}
                        <path d={areaPath} fill={meta.color} fillOpacity="0.08" />
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
                        <span className="fan-chart-normal">Target Range: {meta.normal} {meta.unit}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Medication Colorful Pie Chart Card */}
              <div className="fan-med-card">
                <div className="fan-card-head">
                  <div>
                    <h3 className="fan-card-title">💊 Medication Adherence</h3>
                    <p className="fan-card-subtitle">{firstName}'s dose compliance distribution</p>
                  </div>
                  <span className="fan-med-pct" style={{ color: '#00A896' }}>{meds.overallAdherence || 94}%</span>
                </div>

                <div className="fan-chart-inner-wrap">
                  <ColorfulPieChart
                    data={medChartData}
                    size={160}
                    innerRadius={46}
                    outerRadius={72}
                    centerLabel="Adherence"
                    centerValue={`${meds.overallAdherence || 94}%`}
                  />
                </div>

                <div className="fan-med-list">
                  {(meds.activeMedications || []).slice(0, 3).map((m, i) => (
                    <div key={i} className="fan-med-item">
                      <div className="fan-med-dot" style={{ background: m.adherence >= 95 ? '#10B981' : m.adherence >= 85 ? '#F59E0B' : '#EF4444' }} />
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

            {/* ── ROW 3: Meals + Mood Pie Chart + Insights ────────── */}
            <div className="fan-row-bot">

              {/* Meals Completion */}
              <div className="fan-meals-card">
                <h3 className="fan-card-title">🍽️ Meal Completion</h3>
                <p className="fan-card-subtitle">Weekly nutritional habits</p>
                <div className="fan-meals-list">
                  {[
                    { icon: <Coffee size={16} color="#f97316"/>, label: 'Breakfast', data: nutrition[0] },
                    { icon: <Sun size={16} color="#eab308"/>,    label: 'Lunch',     data: nutrition[1] },
                    { icon: <Moon size={16} color="#8b5cf6"/>,   label: 'Dinner',    data: nutrition[2] },
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

              {/* Mood & Emotional Wellbeing Colorful Pie Chart */}
              <div className="fan-mood-card">
                <h3 className="fan-card-title">😊 Mood & Wellbeing</h3>
                <p className="fan-card-subtitle">Emotional distribution for {firstName}</p>
                <div className="fan-chart-inner-wrap">
                  <ColorfulPieChart
                    data={moodChartData}
                    size={160}
                    innerRadius={46}
                    outerRadius={72}
                    centerLabel="Dominant"
                    centerValue="Happy"
                  />
                </div>
              </div>

              {/* AI Insights */}
              <div className="fan-insights-card">
                <div className="fan-card-head">
                  <h3 className="fan-card-title">✨ Key Health Insights</h3>
                </div>
                <p className="fan-card-subtitle">Automated observations regarding {firstName}'s care</p>
                <div className="fan-insights-list">
                  {(insights.length ? insights : [
                    { type: 'positive', title: 'Blood pressure is stable', desc: `${firstName}'s BP has remained well within the target range all week.` },
                    { type: 'recommendation', title: 'Hydration & routine', desc: 'Energy levels are strongly correlated with morning hydration.' },
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
                  <Download size={15} /> Download Summary Report
                </button>
              </div>

            </div>

            {/* ── EMERGENCY CONTACT STRIP ────────────────────────────── */}
            <div className="fan-contact-strip">
              <PhoneCall size={16} />
              <span>Primary emergency contact for {firstName}: <strong>{parent.emergencyContact || '+1 (555) 234-5678'}</strong></span>
              <Link to="/caregivers-list" className="fan-contact-link">Caregiver Team →</Link>
            </div>

          </div>
        )}
      </div>
    </ChildLayout>
  );
};

export default Analytics;

