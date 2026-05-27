import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Activity, Heart, HeartPulse, ShieldAlert, Phone, MapPin, 
  UserRoundCheck, ShieldCheck, Sparkles, Filter, Calendar, 
  MessageSquare, Video, Info, Plus, ChevronRight, CheckCircle2, Clock
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './HealthFeed.css';

const HealthFeed = () => {
  const [searchParams] = useSearchParams();
  const initialParentId = searchParams.get('parent_id') || '';

  const [parents, setParents] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(initialParentId);
  const [feedLogs, setFeedLogs] = useState([]);
  const [filterType, setFilterType] = useState('All'); // All, Vitals, Medication, Meals
  const [selectedDate, setSelectedDate] = useState('2023-10-24'); // Mock default date
  const [loading, setLoading] = useState(true);
  const [parentsLoading, setParentsLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch parents to populate dropdown
  useEffect(() => {
    const fetchParents = async () => {
      try {
        setParentsLoading(true);
        const { data } = await api.get('/parents');
        setParents(data || []);
        if (data && data.length > 0 && !selectedParentId) {
          setSelectedParentId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching parents:', err);
        setError('Failed to fetch parents list.');
      } finally {
        setParentsLoading(false);
      }
    };
    fetchParents();
  }, [selectedParentId]);

  // 2. Fetch unified health feed logs when selected parent changes
  useEffect(() => {
    const fetchFeed = async () => {
      if (!selectedParentId) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/health/feed?parent_id=${selectedParentId}`);
        setFeedLogs(data || []);
      } catch (err) {
        console.error('Error fetching health feed:', err);
        setError('Failed to load health feed logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [selectedParentId]);

  // Handle parent change
  const handleParentChange = (e) => {
    setSelectedParentId(e.target.value);
  };

  // Filter logs based on filter tags
  const filteredLogs = feedLogs.filter(log => {
    if (filterType === 'All') return true;
    if (filterType === 'Vitals') return log.type === 'vitals';
    if (filterType === 'Medication') {
      // Activity matches Medication Administered or Medication keyword
      return log.type === 'activity' && (log.category === 'Medication' || log.title?.toLowerCase().includes('medication'));
    }
    if (filterType === 'Meals') {
      // Activity matches Dinner/Lunch/Breakfast/Meals
      return log.type === 'activity' && (log.category === 'Meals' || log.title?.toLowerCase().includes('log') || log.title?.toLowerCase().includes('dinner') || log.title?.toLowerCase().includes('lunch') || log.title?.toLowerCase().includes('breakfast'));
    }
    return true;
  });

  // Find currently selected parent object
  const activeParentObj = parents.find(p => String(p.id) === String(selectedParentId)) || {
    name: 'Eleanor Vance',
    address: 'Kindred Hearth Residence',
    age: 82,
    gender: 'female',
    relationship: 'Mother',
    caregiver_name: 'Sarah Jenkins, RN'
  };

  // Retrieve latest vital readings from feed logs
  const latestVitals = feedLogs.find(log => log.type === 'vitals') || {
    blood_pressure: '124/82',
    temperature: '98.6'
  };

  return (
    <ChildLayout title="Health Logs">
      <div className="hf-container">

        {/* BREADCRUMB */}
        <div className="hf-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span className="hf-bc-separator">&gt;</span>
          <span className="hf-bc-active">Health Feed</span>
        </div>

        {/* TABS HEADER ROW */}
        <div className="hf-tabs-row">
          <div className="hf-tabs">
            <button className="hf-tab active">Overview</button>
            <button className="hf-tab">History</button>
            <button className="hf-tab">Analytics</button>
          </div>
          <div className="hf-tabs-right">
            <button className="hf-emergency-btn">
              🚨 Emergency Call
            </button>
          </div>
        </div>

        {/* FEED GRID */}
        <div className="hf-grid">
          
          {/* LEFT PANEL - TIMELINE FEED */}
          <div className="hf-feed-panel">
            
            {/* FILTER PANEL */}
            <div className="hf-filter-card">
              <div className="hf-filter-inputs">
                <div className="hf-input-box">
                  <label>PATIENT</label>
                  {parentsLoading ? (
                    <select disabled><option>Loading parents...</option></select>
                  ) : (
                    <select value={selectedParentId} onChange={handleParentChange}>
                      {parents.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                      {parents.length === 0 && (
                        <option value="">Eleanor Vance</option>
                      )}
                    </select>
                  )}
                </div>

                <div className="hf-input-box">
                  <label>DATE</label>
                  <div className="hf-date-wrapper">
                    <Calendar size={14} className="hf-date-icon" />
                    <input 
                      type="date" 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              {/* Tag filters */}
              <div className="hf-filter-tags">
                <span className="hf-filter-label">FILTER LOGS</span>
                <div className="hf-tags-list">
                  {['All', 'Vitals', 'Medication', 'Meals'].map(tag => (
                    <button 
                      key={tag} 
                      className={`hf-tag-btn ${filterType === tag ? 'active' : ''}`}
                      onClick={() => setFilterType(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* TIMELINE FEED SECTION */}
            <div className="hf-timeline">
              <h3 className="hf-timeline-group-title">Today</h3>

              {loading ? (
                <div className="hf-feed-loader">
                  <div className="hf-spinner"></div>
                  <p>Loading timeline updates...</p>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="hf-feed-empty">
                  <Info size={32} />
                  <p>No feed entries match your filter selection.</p>
                </div>
              ) : (
                filteredLogs.map((log, index) => {
                  const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div key={log.id || index} className="hf-timeline-item">
                      {/* Timeline side marker */}
                      <div className="hf-timeline-marker">
                        <div className={`hf-marker-dot ${log.type === 'vitals' ? 'teal' : 'orange'}`}></div>
                        {index < filteredLogs.length - 1 && <div className="hf-marker-line"></div>}
                      </div>

                      {/* Card Content */}
                      <div className="hf-timeline-card">
                        
                        {/* Title and meta */}
                        <div className="hf-timeline-card-header">
                          <div>
                            <h4 className="hf-log-title">{log.title || 'Morning Vitals Check'}</h4>
                            <p className="hf-log-meta">
                              {log.type === 'vitals' ? 'Live Update' : 'Activity'} • {logTime} by {log.logged_by}
                            </p>
                          </div>
                          {log.stability && (
                            <span className="hf-status-pill success">STABILITY: {log.stability}</span>
                          )}
                          {log.verified && (
                            <span className="hf-status-pill success">✓ Verified</span>
                          )}
                        </div>

                        {/* Description/Notes */}
                        {log.description && (
                          <p className="hf-log-desc">"{log.description}"</p>
                        )}

                        {/* Vitals Blocks Grid */}
                        {log.type === 'vitals' && (
                          <div className="hf-vitals-grid">
                            <div className="hf-vital-block">
                              <span className="hf-vital-label">BLOOD PRESSURE</span>
                              <div className="hf-vital-value-row">
                                <span className="hf-vital-number">{log.blood_pressure || '120/80'}</span>
                                <span className="hf-vital-unit">mmHg</span>
                              </div>
                            </div>
                            <div className="hf-vital-block">
                              <span className="hf-vital-label">TEMPERATURE</span>
                              <div className="hf-vital-value-row">
                                <span className="hf-vital-number">{log.temperature || '98.6'}</span>
                                <span className="hf-vital-unit">°F</span>
                              </div>
                            </div>
                            <div className="hf-vital-block">
                              <span className="hf-vital-label">HEART RATE</span>
                              <div className="hf-vital-value-row">
                                <span className="hf-vital-number">{log.heart_rate || '72'}</span>
                                <span className="hf-vital-unit">bpm</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* If it's a Food/Meal Log */}
                        {log.title === 'Dinner Log' && (
                          <div className="hf-meal-block">
                            <img 
                              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop" 
                              alt="Salmon dinner" 
                              className="hf-meal-img"
                            />
                            <div className="hf-meal-tags">
                              {log.tags && log.tags.map(tag => (
                                <span key={tag} className="hf-meal-tag">{tag}</span>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT PANEL - SIDEBAR WIDGETS */}
          <div className="hf-sidebar-panel">
            
            {/* Widget 1: Patient summary */}
            <div className="hf-patient-widget teal-bg">
              <div className="hf-pw-header">
                <div>
                  <h3 className="hf-pw-name">{activeParentObj.name}</h3>
                  <p className="hf-pw-location">{activeParentObj.address}</p>
                </div>
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeParentObj.name)}`} 
                  alt="avatar" 
                  className="hf-pw-avatar"
                />
              </div>

              <div className="hf-pw-vitals">
                <div className="hf-pw-vital-row">
                  <span className="hf-pw-vital-label">Latest BP</span>
                  <span className="hf-pw-vital-value">{latestVitals.blood_pressure || '124/82'}</span>
                </div>
                <div className="hf-pw-vital-row">
                  <span className="hf-pw-vital-label">Avg Temp</span>
                  <span className="hf-pw-vital-value">{latestVitals.temperature || '98.6'}°F</span>
                </div>
              </div>

              <div className="hf-pw-footer">
                <span className="hf-live-indicator">
                  <span className="hf-pulse-dot"></span> LIVE TRACKING
                </span>
                <span className="hf-update-time">LAST UPDATE: 12M AGO</span>
              </div>
            </div>

            {/* Widget 2: Caregiver widget */}
            <div className="hf-card">
              <span className="hf-widget-lbl">CURRENT CAREGIVER</span>
              <div className="hf-caregiver-widget">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeParentObj.caregiver_name || 'Sarah')}`} 
                  alt="Caregiver avatar" 
                  className="hf-cg-avatar"
                />
                <div className="hf-cg-info">
                  <h4 className="hf-cg-name">{activeParentObj.caregiver_name || 'Sarah Jenkins, RN'}</h4>
                  <p className="hf-cg-duty">On Duty: 08:00 AM - 04:00 PM</p>
                </div>
                <div className="hf-cg-actions">
                  <button className="hf-cg-icon-btn"><MessageSquare size={16} /></button>
                  <button className="hf-cg-icon-btn"><Video size={16} /></button>
                </div>
              </div>
            </div>

            {/* Widget 3: Vitality index dial */}
            <div className="hf-card hf-vitality-card">
              <div className="hf-vitality-header">
                <span className="hf-widget-lbl">Vitality Index</span>
                <Info size={14} className="hf-info-icon" />
              </div>
              <div className="hf-vitality-gauge">
                <div className="hf-gauge-circle">
                  <h2 className="hf-gauge-number">92</h2>
                  <p className="hf-gauge-lbl">HEALTH SCORE</p>
                </div>
              </div>
              <p className="hf-vitality-description">
                {activeParentObj.name}'s health score has increased by <span className="text-teal">4%</span> compared to last week.
              </p>
            </div>

          </div>

        </div>

        {/* Floating Action Button */}
        <Link to="/add-parent" className="hf-fab">
          <Plus size={24} />
        </Link>

      </div>
    </ChildLayout>
  );
};

export default HealthFeed;
