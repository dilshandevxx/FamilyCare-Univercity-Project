import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Activity, Heart, Thermometer, Phone, MapPin, 
  UserCheck, Sparkles, Filter, Calendar, 
  MessageSquare, Plus, CheckCircle2, Clock, 
  AlertTriangle, FileText, Download, Smile, 
  Meh, Frown, Coffee, Utensils, Moon, Check, 
  ShieldCheck, RefreshCw, User, Eye
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './HealthFeed.css';

const residentAvatar = (name) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'elder')}`;

const getConditionClass = (cond) => {
  const c = (cond || '').toUpperCase();
  if (c === 'CRITICAL') return 'hf-badge-critical';
  if (c === 'NEEDS ATTENTION' || c === 'WARNING') return 'hf-badge-warning';
  return 'hf-badge-stable';
};

const HealthFeed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialParentId = searchParams.get('parent_id') || '';

  const [parents, setParents] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(initialParentId);
  const [feedData, setFeedData] = useState({ parent: null, logs: [] });
  const [filterType, setFilterType] = useState('All'); // All, Vitals, Medication, Meals, Attachments
  const [loading, setLoading] = useState(true);
  const [parentsLoading, setParentsLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch all parents for the logged-in child
  useEffect(() => {
    const fetchParents = async () => {
      try {
        setParentsLoading(true);
        const { data } = await api.get('/parents');
        const list = Array.isArray(data) ? data : [];
        setParents(list);
        if (list.length > 0) {
          // If no initial parent or initial parent not in list, select first
          const exists = list.some(p => String(p.id) === String(initialParentId));
          const targetId = exists ? initialParentId : String(list[0].id);
          setSelectedParentId(targetId);
          setSearchParams({ parent_id: targetId });
        }
      } catch (err) {
        console.error('Error fetching parents:', err);
        setError('Failed to fetch parents list.');
      } finally {
        setParentsLoading(false);
      }
    };
    fetchParents();
  }, []);

  // 2. Fetch unified health feed logs when selected parent changes
  const fetchFeed = async (parentId) => {
    if (!parentId) return;
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/health/feed?parent_id=${parentId}`);
      if (data && data.logs) {
        setFeedData(data);
      } else if (Array.isArray(data)) {
        setFeedData({ parent: null, logs: data });
      } else {
        setFeedData({ parent: null, logs: [] });
      }
    } catch (err) {
      console.error('Error fetching health feed:', err);
      setError('Failed to load health feed logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedParentId) {
      fetchFeed(selectedParentId);
    }
  }, [selectedParentId]);

  // Handle parent card click
  const handleSelectParent = (id) => {
    setSelectedParentId(String(id));
    setSearchParams({ parent_id: String(id) });
  };

  // Active parent object from parents list or backend metadata
  const activeParent = parents.find(p => String(p.id) === String(selectedParentId)) || feedData.parent || {};

  // Filter logs based on filter chips
  const logsList = feedData.logs || [];
  const filteredLogs = logsList.filter(log => {
    if (filterType === 'All') return true;
    if (filterType === 'Vitals') return log.type === 'vitals' && (log.blood_pressure || log.heart_rate || log.temperature);
    if (filterType === 'Medication') return log.meds_taken !== null && log.meds_taken !== undefined;
    if (filterType === 'Meals') return log.breakfast_status || log.lunch_status || log.dinner_status || log.category === 'Meals';
    if (filterType === 'Attachments') return !!log.attachment_url;
    return true;
  });

  // Latest vital readings
  const latestVitals = logsList.find(log => log.type === 'vitals' && (log.blood_pressure || log.heart_rate)) || {};

  return (
    <ChildLayout title="Health Logs">
      <div className="hf-container">

        {/* TOP BAR / BREADCRUMB */}
        <div className="hf-top-header">
          <div className="hf-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span className="hf-bc-separator">&gt;</span>
            <span className="hf-bc-active">Health Feed</span>
          </div>
          {activeParent?.emergency_contact && (
            <a href={`tel:${activeParent.emergency_contact}`} className="hf-emergency-btn">
              <Phone size={15} /> Emergency Call: {activeParent.emergency_contact}
            </a>
          )}
        </div>

        {/* ── 1. CLEAN PARENT SELECTOR TABS ── */}
        <div className="hf-parent-selector-section">
          <div className="hf-section-header">
            <div>
              <h2 className="hf-main-title">Parent Health Feeds</h2>
              <p className="hf-sub-title">Select an elderly parent to view their clinical vitals timeline, caregiver logs, and meal records</p>
            </div>
            <button 
              className="hf-refresh-btn"
              onClick={() => fetchFeed(selectedParentId)}
              title="Refresh feed"
            >
              <RefreshCw size={15} className={loading ? 'hf-spin' : ''} /> Refresh
            </button>
          </div>

          {parentsLoading ? (
            <div className="hf-parents-skeleton">
              <div className="hf-skeleton-card"></div>
              <div className="hf-skeleton-card"></div>
            </div>
          ) : parents.length === 0 ? (
            <div className="hf-no-parents-box">
              <User size={32} />
              <p>No parents added to your account yet.</p>
              <Link to="/add-parent" className="hf-add-parent-btn">+ Add Parent</Link>
            </div>
          ) : (
            <div className="hf-parent-cards-grid">
              {parents.map(p => {
                const isSelected = String(p.id) === String(selectedParentId);
                const condition = p.care_status || 'STABLE';
                return (
                  <div
                    key={p.id}
                    className={`hf-parent-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectParent(p.id)}
                  >
                    <div className="hf-pc-left">
                      <img 
                        src={residentAvatar(p.name)} 
                        alt={p.name} 
                        className="hf-pc-avatar"
                      />
                      <div>
                        <h4 className="hf-pc-name">{p.name}</h4>
                        <p className="hf-pc-meta">
                          {p.relationship ? `${p.relationship} • ` : ''}{p.age ? `${p.age} yrs` : 'Senior'}
                        </p>
                      </div>
                    </div>

                    <div className="hf-pc-right">
                      <span className={`hf-condition-badge ${getConditionClass(condition)}`}>
                        {condition}
                      </span>
                      <span className="hf-pc-caregiver">
                        {p.assigned_caregiver_id ? '👨‍⚕️ Caregiver Assigned' : '⚠️ No Caregiver'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── 2. FEED & SIDEBAR GRID ── */}
        <div className="hf-grid">
          
          {/* LEFT PANEL - TIMELINE FEED */}
          <div className="hf-feed-panel">
            
            {/* FILTER CHIPS & STATS BAR */}
            <div className="hf-filter-bar">
              <div className="hf-filter-chips">
                <span className="hf-filter-label"><Filter size={14} /> Filter:</span>
                {['All', 'Vitals', 'Medication', 'Meals', 'Attachments'].map(tag => (
                  <button 
                    key={tag} 
                    className={`hf-chip-btn ${filterType === tag ? 'active' : ''}`}
                    onClick={() => setFilterType(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <span className="hf-logs-count">{filteredLogs.length} updates</span>
            </div>

            {/* TIMELINE SECTION */}
            <div className="hf-timeline-container">
              {loading ? (
                <div className="hf-feed-loader">
                  <div className="hf-spinner"></div>
                  <p>Loading real-time health logs for {activeParent.name || 'parent'}...</p>
                </div>
              ) : error ? (
                <div className="hf-feed-error">
                  <AlertTriangle size={24} />
                  <p>{error}</p>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="hf-feed-empty-state">
                  <div className="hf-empty-icon-wrap">
                    <Activity size={36} />
                  </div>
                  <h3>No Health Logs for {activeParent.name || 'this parent'}</h3>
                  <p>
                    {activeParent.assigned_caregiver_id 
                      ? 'The assigned caregiver has not logged vitals for this parent yet today. When logs are entered, they will appear here instantly.'
                      : 'Assign a certified caregiver to start receiving daily clinical vital checks, meal tracking, and health updates.'}
                  </p>
                  {!activeParent.assigned_caregiver_id && (
                    <Link to="/caregivers-list" className="hf-assign-cta-btn">
                      Browse & Assign Caregivers
                    </Link>
                  )}
                </div>
              ) : (
                filteredLogs.map((log, index) => {
                  const logDate = new Date(log.timestamp);
                  const timeFormatted = isNaN(logDate.getTime()) 
                    ? 'Recent' 
                    : logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateFormatted = isNaN(logDate.getTime()) 
                    ? 'Today' 
                    : logDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                  const isVitals = log.type === 'vitals';
                  const condition = log.overall_condition || 'STABLE';

                  return (
                    <div key={log.id || index} className="hf-timeline-entry">
                      
                      {/* Timeline side dot & connector line */}
                      <div className="hf-timeline-stem">
                        <div className={`hf-stem-dot ${condition === 'CRITICAL' ? 'critical' : condition === 'NEEDS ATTENTION' ? 'warning' : 'stable'}`}></div>
                        {index < filteredLogs.length - 1 && <div className="hf-stem-line"></div>}
                      </div>

                      {/* Card Content */}
                      <div className="hf-log-card">
                        
                        {/* Header: Title, Timestamp, Logged By */}
                        <div className="hf-log-card-header">
                          <div>
                            <div className="hf-log-title-row">
                              <h4 className="hf-log-title">
                                {isVitals ? 'Daily Clinical Health & Vitals Check' : log.title || 'Health Activity Log'}
                              </h4>
                              <span className={`hf-condition-badge ${getConditionClass(condition)}`}>
                                {condition}
                              </span>
                            </div>
                            <p className="hf-log-meta-text">
                              <Clock size={12} /> {dateFormatted} at {timeFormatted} • Recorded by <strong>{log.logged_by || 'Caregiver'}</strong>
                            </p>
                          </div>

                          {log.mood && (
                            <div className="hf-mood-pill" title={`Mood: ${log.mood}`}>
                              {log.mood === 'happy' && <><Smile size={15} color="#16a34a"/> <span>Good Spirits</span></>}
                              {log.mood === 'neutral' && <><Meh size={15} color="#0284c7"/> <span>Calm / Neutral</span></>}
                              {log.mood === 'sad' && <><Frown size={15} color="#dc2626"/> <span>Distressed / Low</span></>}
                            </div>
                          )}
                        </div>

                        {/* Vitals Grid (If vitals exist) */}
                        {(log.blood_pressure || log.heart_rate || log.temperature) && (
                          <div className="hf-vitals-display-grid">
                            {log.blood_pressure && (
                              <div className="hf-vital-box">
                                <span className="hf-vb-label"><Activity size={13}/> Blood Pressure</span>
                                <div className="hf-vb-val-row">
                                  <span className="hf-vb-val">{log.blood_pressure}</span>
                                  <span className="hf-vb-unit">mmHg</span>
                                </div>
                              </div>
                            )}

                            {log.heart_rate && (
                              <div className="hf-vital-box">
                                <span className="hf-vb-label"><Heart size={13}/> Heart Rate</span>
                                <div className="hf-vb-val-row">
                                  <span className="hf-vb-val">{log.heart_rate}</span>
                                  <span className="hf-vb-unit">bpm</span>
                                </div>
                              </div>
                            )}

                            {log.temperature && (
                              <div className="hf-vital-box">
                                <span className="hf-vb-label"><Thermometer size={13}/> Temperature</span>
                                <div className="hf-vb-val-row">
                                  <span className="hf-vb-val">{log.temperature}</span>
                                  <span className="hf-vb-unit">°F</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Meals & Medication Row */}
                        {(log.breakfast_status || log.lunch_status || log.dinner_status || log.meds_taken !== null) && (
                          <div className="hf-nutrition-meds-row">
                            {/* Meals */}
                            {(log.breakfast_status || log.lunch_status || log.dinner_status) && (
                              <div className="hf-meals-badge-group">
                                <span className="hf-nm-title"><Utensils size={13}/> Meals:</span>
                                {log.breakfast_status && (
                                  <span className={`hf-meal-tag ${log.breakfast_status.toLowerCase()}`}>
                                    <Coffee size={11} /> B: {log.breakfast_status}
                                  </span>
                                )}
                                {log.lunch_status && (
                                  <span className={`hf-meal-tag ${log.lunch_status.toLowerCase()}`}>
                                    <Utensils size={11} /> L: {log.lunch_status}
                                  </span>
                                )}
                                {log.dinner_status && (
                                  <span className={`hf-meal-tag ${log.dinner_status.toLowerCase()}`}>
                                    <Moon size={11} /> D: {log.dinner_status}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Medication Adherence */}
                            {log.meds_taken !== null && log.meds_taken !== undefined && (
                              <div className="hf-meds-status-tag">
                                {log.meds_taken === 1 || log.meds_taken === true || log.meds_taken === '1' ? (
                                  <span className="hf-meds-taken"><Check size={12}/> Meds Administered</span>
                                ) : (
                                  <span className="hf-meds-pending"><Clock size={12}/> Meds Pending</span>
                                )}
                                {log.meds_notes && <span className="hf-meds-note">({log.meds_notes})</span>}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Clinical / Caregiver Notes */}
                        {log.description && (
                          <div className="hf-clinical-notes-box">
                            <p className="hf-cn-text">"{log.description}"</p>
                          </div>
                        )}

                        {/* Attachment Link */}
                        {log.attachment_url && (
                          <div className="hf-attachment-row">
                            <a 
                              href={log.attachment_url.startsWith('http') ? log.attachment_url : `${api.defaults.baseURL || ''}${log.attachment_url}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="hf-attachment-link"
                            >
                              <FileText size={14} /> View Attached Medical Record / Report <Eye size={13}/>
                            </a>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT PANEL - ACTIVE PARENT & CAREGIVER SIDEBAR */}
          <div className="hf-sidebar-panel">
            
            {/* Widget 1: Selected Parent Card */}
            <div className="hf-card hf-parent-profile-widget">
              <div className="hf-ppw-header">
                <img 
                  src={residentAvatar(activeParent.name)} 
                  alt={activeParent.name} 
                  className="hf-ppw-avatar"
                />
                <div>
                  <h3 className="hf-ppw-name">{activeParent.name || 'Selected Parent'}</h3>
                  <p className="hf-ppw-meta">
                    {activeParent.relationship ? `${activeParent.relationship} • ` : ''}
                    {activeParent.age ? `${activeParent.age} years old` : 'Elder Resident'}
                  </p>
                </div>
              </div>

              {activeParent.address && (
                <div className="hf-ppw-info-row">
                  <MapPin size={14} className="text-gray" />
                  <span>{activeParent.address}</span>
                </div>
              )}

              {activeParent.medical_conditions && (
                <div className="hf-ppw-conditions-box">
                  <span className="hf-widget-lbl">MEDICAL CONDITIONS</span>
                  <p>{activeParent.medical_conditions}</p>
                </div>
              )}

              {/* Latest Vitals Snapshot */}
              <div className="hf-pw-vitals-strip">
                <div className="hf-pw-vital-item">
                  <span className="hf-pw-lbl">Latest BP</span>
                  <span className="hf-pw-val">{latestVitals.blood_pressure || '—'}</span>
                </div>
                <div className="hf-pw-vital-item">
                  <span className="hf-pw-lbl">Heart Rate</span>
                  <span className="hf-pw-val">{latestVitals.heart_rate ? `${latestVitals.heart_rate} bpm` : '—'}</span>
                </div>
                <div className="hf-pw-vital-item">
                  <span className="hf-pw-lbl">Temp</span>
                  <span className="hf-pw-val">{latestVitals.temperature ? `${latestVitals.temperature}°F` : '—'}</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Assigned Caregiver Widget */}
            <div className="hf-card">
              <span className="hf-widget-lbl">ASSIGNED CAREGIVER</span>
              {activeParent.assigned_caregiver_id ? (
                <div className="hf-caregiver-widget">
                  <img 
                    src={residentAvatar(activeParent.caregiver_name || 'Caregiver')} 
                    alt="Caregiver avatar" 
                    className="hf-cg-avatar"
                  />
                  <div className="hf-cg-info">
                    <h4 className="hf-cg-name">{activeParent.caregiver_name || 'Certified Caregiver'}</h4>
                    <p className="hf-cg-duty">Assigned Health Attendant</p>
                  </div>
                  <div className="hf-cg-actions">
                    <Link 
                      to={`/messages?recipient=${activeParent.assigned_caregiver_id}`} 
                      className="hf-cg-icon-btn"
                      title="Send Message"
                    >
                      <MessageSquare size={16} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="hf-caregiver-widget unassigned">
                  <div className="hf-cg-info">
                    <h4 className="hf-cg-name text-gray">No Caregiver Assigned</h4>
                    <p className="hf-cg-duty">Assign a dedicated caregiver</p>
                  </div>
                  <div className="hf-cg-actions">
                    <Link to="/caregivers-list" className="hf-cg-assign-btn">Assign</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Widget 3: Health Status Card */}
            <div className="hf-card hf-vitality-card">
              <div className="hf-vitality-header">
                <span className="hf-widget-lbl">Care Status Summary</span>
                <ShieldCheck size={16} color="#0d9488" />
              </div>
              <div className="hf-status-summary-box">
                <div className={`hf-large-status ${getConditionClass(activeParent.care_status || 'STABLE')}`}>
                  {activeParent.care_status || 'STABLE'}
                </div>
                <p className="hf-status-desc">
                  {activeParent.care_status === 'CRITICAL' 
                    ? 'Attention required. Check the latest health log notes immediately.'
                    : activeParent.care_status === 'NEEDS ATTENTION'
                    ? 'Moderate observation required by assigned caregiver.'
                    : 'All recorded vital signs and nutrition indicators are within safe thresholds.'}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </ChildLayout>
  );
};

export default HealthFeed;
