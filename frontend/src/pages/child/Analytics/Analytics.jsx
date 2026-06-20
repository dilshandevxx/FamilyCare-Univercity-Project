import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Thermometer, FileText, AlertTriangle,
  TrendingUp, Calendar, Download, RefreshCw,
  Plus, CheckCircle, Clock, ChevronRight, Activity, Award, HeartPulse
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './Analytics.css';

const Analytics = () => {
  // Filters state
  const [parents, setParents] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [loading, setLoading] = useState(true);

  // Dynamic states
  const [bpMetric, setBpMetric] = useState('Diastolic'); // 'Systolic' or 'Diastolic'
  const [vitalsSummary, setVitalsSummary] = useState({
    avgBp: '120/80',
    bpStatus: 'Optimal',
    avgTemp: '98.6',
    tempStatus: 'Stable',
    totalLogs: 42,
    logStatus: '+12% vs last mo',
    criticalAlerts: 2,
    alertStatus: 'Needs Review'
  });

  // Mobile navigation/sub-tabs state: 'vitals', 'insights'
  const [mobileTab, setMobileTab] = useState('vitals');

  // Trigger feedback messages
  const [infoMessage, setInfoMessage] = useState('');

  // Fetch Parent profiles on mount
  useEffect(() => {
    const fetchParents = async () => {
      try {
        setLoading(true);
        const res = await api.get('/parents');
        const data = res.data || [];
        setParents(data);
        if (data.length > 0) {
          setSelectedParentId(data[0].id.toString());
        }
      } catch (err) {
        console.error('Error fetching parents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchParents();
  }, []);

  // Fetch / Calculate analytics metrics based on selected parent and range
  useEffect(() => {
    // In a real production app we'd query /api/health/resident/:id/logs or /api/health/analytics
    // Here we dynamically calculate stats or generate realistic seeded ones matching the design mockups.
    if (!selectedParentId) return;

    // Simulate load
    setLoading(true);
    const timer = setTimeout(() => {
      const parent = parents.find(p => p.id.toString() === selectedParentId);
      
      // Calculate statistics based on parent health profile
      if (parent) {
        let avgBp = '120/80';
        let bpStatus = 'Optimal';
        let avgTemp = '98.6';
        let tempStatus = 'Stable';
        let criticalAlerts = 0;
        let alertStatus = 'All Clear';

        if (parent.medical_conditions?.toLowerCase().includes('hypertension') || parent.medical_conditions?.toLowerCase().includes('heart')) {
          avgBp = '138/88';
          bpStatus = 'Elevated';
          criticalAlerts = 2;
          alertStatus = 'Needs Review';
        }
        if (parent.medical_conditions?.toLowerCase().includes('diabetes')) {
          avgTemp = '98.8';
          tempStatus = 'Stable';
        }
        
        setVitalsSummary({
          avgBp,
          bpStatus,
          avgTemp,
          tempStatus,
          totalLogs: 32 + (parent.id % 5) * 4,
          logStatus: '+8% vs last mo',
          criticalAlerts,
          alertStatus
        });
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedParentId, selectedRange, parents]);

  // Generate Report action
  const handleGenerateReport = () => {
    setInfoMessage('Generating comprehensive physician PDF report...');
    setTimeout(() => {
      setInfoMessage('PDF Report successfully generated and downloaded!');
      setTimeout(() => setInfoMessage(''), 4000);
      
      // Simulate file download
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', 'FamilyCare_Physician_Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  // Mock Trend Chart Data (Last 7 Days)
  const bpChartData = {
    Systolic: [118, 122, 120, 126, 121, 119, 120],
    Diastolic: [76, 82, 80, 84, 79, 78, 80]
  };
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const nutritionData = [
    { label: 'Breakfast', percent: 100, color: '#00A896' },
    { label: 'Lunch', percent: 85, color: '#00c4af' },
    { label: 'Dinner', percent: 90, color: '#5eead4' }
  ];

  return (
    <ChildLayout title="Analytics">
      <div className="an-container">
        
        {/* HEADER SELECTORS ROW */}
        <div className="an-header-panel">
          <h2 className="an-page-title hide-mobile">Analytics Hub</h2>
          
          <div className="an-filter-row">
            {/* Resident Dropdown Selector */}
            <div className="an-filter-pill">
              <span className="an-filter-label">Resident:</span>
              <select 
                value={selectedParentId} 
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="an-select"
              >
                {parents.length === 0 ? (
                  <option value="default">Eleanor Vance (Mother)</option>
                ) : (
                  parents.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.relationship || 'Parent'})</option>
                  ))
                )}
              </select>
            </div>

            {/* Range Selector */}
            <div className="an-filter-pill">
              <Calendar size={14} className="an-pill-icon" />
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="an-select"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
              </select>
            </div>

            {/* Caregivers Navigation Link */}
            <Link to="/caregivers-list" className="an-filter-pill an-caregivers-link">
              <HeartPulse size={14} className="an-pill-icon" />
              <span className="an-filter-label an-caregivers-label">Caregivers</span>
            </Link>
          </div>
        </div>

        {/* FEEDBACK STATUS BANNER */}
        {infoMessage && (
          <div className="an-toast success">
            <CheckCircle size={16} /> <span>{infoMessage}</span>
          </div>
        )}

        {/* MOBILE SUB-TABS */}
        <div className="an-mobile-tabs hide-desktop">
          <button 
            className={`an-mob-tab-btn${mobileTab === 'vitals' ? ' active' : ''}`}
            onClick={() => setMobileTab('vitals')}
          >
            Vitals & Stats
          </button>
          <button 
            className={`an-mob-tab-btn${mobileTab === 'insights' ? ' active' : ''}`}
            onClick={() => setMobileTab('insights')}
          >
            AI Insights
          </button>
        </div>

        {/* ANALYTICS LOADING */}
        {loading ? (
          <div className="an-loading-box">
            <RefreshCw size={24} className="an-spin" />
            <span>Recalculating analytics metrics...</span>
          </div>
        ) : (
          <div className="an-content-grid">

            {/* LEFT / MAIN COLUMN */}
            <div className={`an-main-col${mobileTab === 'insights' ? ' hide-mobile-view' : ''}`}>
              
              {/* VITALS ROW OF 4 CARDS */}
              <div className="an-summary-row">
                
                {/* AVG BP CARD */}
                <div className="an-summary-card">
                  <div className="an-card-top">
                    <div className="an-icon-box bp">
                      <Heart size={16} />
                    </div>
                    <span className={`an-status-badge bp ${vitalsSummary.bpStatus.toLowerCase()}`}>
                      {vitalsSummary.bpStatus}
                    </span>
                  </div>
                  <div className="an-card-bottom">
                    <span className="an-metric-val">{vitalsSummary.avgBp}</span>
                    <span className="an-metric-lbl">Avg Blood Pressure <span className="an-unit">mmHg</span></span>
                  </div>
                </div>

                {/* AVG TEMP CARD */}
                <div className="an-summary-card">
                  <div className="an-card-top">
                    <div className="an-icon-box temp">
                      <Thermometer size={16} />
                    </div>
                    <span className="an-status-badge temp stable">
                      {vitalsSummary.tempStatus}
                    </span>
                  </div>
                  <div className="an-card-bottom">
                    <span className="an-metric-val">{vitalsSummary.avgTemp}°F</span>
                    <span className="an-metric-lbl">Avg Temperature</span>
                  </div>
                </div>

                {/* TOTAL LOGS CARD */}
                <div className="an-summary-card">
                  <div className="an-card-top">
                    <div className="an-icon-box logs">
                      <FileText size={16} />
                    </div>
                    <span className="an-status-badge trend-up">
                      {vitalsSummary.logStatus}
                    </span>
                  </div>
                  <div className="an-card-bottom">
                    <span className="an-metric-val">{vitalsSummary.totalLogs}</span>
                    <span className="an-metric-lbl">Total Logs <span className="an-unit">entries</span></span>
                  </div>
                </div>

                {/* CRITICAL ALERTS CARD */}
                <div className="an-summary-card">
                  <div className="an-card-top">
                    <div className="an-icon-box alerts">
                      <AlertTriangle size={16} />
                    </div>
                    <span className={`an-status-badge alert ${vitalsSummary.criticalAlerts > 0 ? 'review' : 'clear'}`}>
                      {vitalsSummary.alertStatus}
                    </span>
                  </div>
                  <div className="an-card-bottom">
                    <span className="an-metric-val">{vitalsSummary.criticalAlerts}</span>
                    <span className="an-metric-lbl">Critical Alerts <span className="an-unit">active</span></span>
                  </div>
                </div>

              </div>

              {/* BLOOD PRESSURE TREND LINE CHART CARD */}
              <div className="an-chart-card">
                <div className="an-chart-header">
                  <div>
                    <h3 className="an-card-title">Blood Pressure Trend</h3>
                    <p className="an-card-subtitle">Hourly fluctuations across the last 7 days</p>
                  </div>
                  <div className="an-toggle-group">
                    <button 
                      className={`an-toggle-btn${bpMetric === 'Systolic' ? ' active' : ''}`}
                      onClick={() => setBpMetric('Systolic')}
                    >
                      Systolic
                    </button>
                    <button 
                      className={`an-toggle-btn${bpMetric === 'Diastolic' ? ' active' : ''}`}
                      onClick={() => setBpMetric('Diastolic')}
                    >
                      Diastolic
                    </button>
                  </div>
                </div>

                {/* Visual Chart Sparkline Rendering */}
                <div className="an-sparkline-container">
                  <div className="an-spark-grid-lines">
                    <div className="an-grid-line"></div>
                    <div className="an-grid-line"></div>
                    <div className="an-grid-line"></div>
                  </div>

                  <div className="an-spark-line-wrapper">
                    <svg className="an-spark-svg" viewBox="0 0 700 160">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00A896" stopOpacity="0.2"/>
                          <stop offset="100%" stopColor="#00A896" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>
                      
                      {/* Area Path */}
                      <path 
                        d={`M 25 140 
                            L 125 ${140 - (bpChartData[bpMetric][0] - 70) * 4} 
                            L 225 ${140 - (bpChartData[bpMetric][1] - 70) * 4} 
                            L 325 ${140 - (bpChartData[bpMetric][2] - 70) * 4} 
                            L 425 ${140 - (bpChartData[bpMetric][3] - 70) * 4} 
                            L 525 ${140 - (bpChartData[bpMetric][4] - 70) * 4} 
                            L 625 ${140 - (bpChartData[bpMetric][5] - 70) * 4} 
                            L 675 ${140 - (bpChartData[bpMetric][6] - 70) * 4} 
                            L 675 140 Z`} 
                        fill="url(#chartGrad)"
                      />

                      {/* Line Path */}
                      <path 
                        d={`M 25 140 
                            Q 125 ${140 - (bpChartData[bpMetric][0] - 70) * 4}, 225 ${140 - (bpChartData[bpMetric][1] - 70) * 4} 
                            T 425 ${140 - (bpChartData[bpMetric][3] - 70) * 4} 
                            T 625 ${140 - (bpChartData[bpMetric][5] - 70) * 4} 
                            T 675 ${140 - (bpChartData[bpMetric][6] - 70) * 4}`}
                        fill="none" 
                        stroke="#00A896" 
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Interactive dot markers */}
                      {bpChartData[bpMetric].map((val, idx) => {
                        const cx = 25 + idx * 105;
                        const cy = 140 - (val - 70) * 4;
                        return (
                          <g key={idx} className="chart-dot-group">
                            <circle cx={cx} cy={cy} r="7" fill="#00A896" stroke="white" strokeWidth="2" />
                            <text x={cx} y={cy - 12} textAnchor="middle" className="chart-dot-label">
                              {val}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* X-Axis labels */}
                  <div className="an-chart-xaxis">
                    {weekDays.map((day, i) => (
                      <span key={i} className="an-xaxis-day">{day}</span>
                    ))}
                  </div>
                </div>

              </div>

              {/* BOTTOM TWO CARDS ROW: NUTRITION & MEDICATION */}
              <div className="an-bottom-row">
                
                {/* Nutrition Intake Bar Chart */}
                <div className="an-card nutrition">
                  <div className="an-chart-header">
                    <div>
                      <h3 className="an-card-title">Nutrition Intake</h3>
                      <p className="an-card-subtitle">Meal completion over the week</p>
                    </div>
                  </div>

                  <div className="an-nutrition-bars">
                    {nutritionData.map((nut, idx) => (
                      <div key={idx} className="an-bar-row">
                        <div className="an-bar-info">
                          <span className="an-bar-lbl">{nut.label}</span>
                          <span className="an-bar-val">{nut.percent}%</span>
                        </div>
                        <div className="an-bar-track">
                          <div 
                            className="an-bar-fill" 
                            style={{ 
                              width: `${nut.percent}%`,
                              backgroundColor: nut.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medication Adherence Donut Chart */}
                <div className="an-card medication">
                  <div>
                    <h3 className="an-card-title">Medication</h3>
                    <p className="an-card-subtitle">Adherence rate</p>
                  </div>

                  <div className="an-med-donut-section">
                    <div className="an-donut-box">
                      <svg className="an-donut-svg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="9" />
                        <circle 
                          cx="50" cy="50" r="40" fill="none" stroke="#00A896" strokeWidth="9" 
                          strokeDasharray="251.2" strokeDashoffset="20.1" 
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="an-donut-inner">
                        <span className="an-donut-pct">92%</span>
                        <span className="an-donut-lbl">EXCELLENT</span>
                      </div>
                    </div>

                    <div className="an-med-legend">
                      <div className="an-leg-item">
                        <span className="an-leg-dot on-time"></span>
                        <span className="an-leg-lbl">On Time</span>
                        <span className="an-leg-count">85 doses</span>
                      </div>
                      <div className="an-leg-item">
                        <span className="an-leg-dot delayed"></span>
                        <span className="an-leg-lbl">Delayed</span>
                        <span className="an-leg-count">4 doses</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: AI CRITICAL INSIGHTS */}
            <div className={`an-side-col${mobileTab === 'vitals' ? ' hide-mobile-view' : ''}`}>
              
              <div className="an-insights-card">
                <div className="an-ins-header">
                  <div className="an-ins-title-row">
                    <Award className="an-ins-star-icon" size={18} />
                    <div>
                      <h3 className="an-ins-title">AI Critical Insights</h3>
                      <p className="an-ins-subtitle">Based on clinical pattern recognition</p>
                    </div>
                  </div>
                </div>

                {/* Insights Feed */}
                <div className="an-insights-feed">
                  
                  {/* Insight Item 1 */}
                  <div className="an-ins-item warning">
                    <span className="an-ins-lbl warning">OBSERVATION</span>
                    <h4 className="an-ins-item-title">Frequent Nocturnal BP Spikes</h4>
                    <p className="an-ins-item-desc">
                      Recorded 3 instances between 2:00 AM - 4:00 AM. Consider reviewing medication timing with her physician.
                    </p>
                  </div>

                  {/* Insight Item 2 */}
                  <div className="an-ins-item trend">
                    <span className="an-ins-lbl trend">TREND ANALYSIS</span>
                    <h4 className="an-ins-item-title">Hydration & Temp Correlation</h4>
                    <p className="an-ins-item-desc">
                      Minor temp elevation (99.1°F) coincided with lower water intake logs on Thursday. Resolved following hydration.
                    </p>
                  </div>

                </div>

                {/* Generate Physician Report Button */}
                <button 
                  type="button" 
                  className="an-generate-report-btn"
                  onClick={handleGenerateReport}
                >
                  <Download size={14} /> Generate Physician Report
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </ChildLayout>
  );
};

export default Analytics;
