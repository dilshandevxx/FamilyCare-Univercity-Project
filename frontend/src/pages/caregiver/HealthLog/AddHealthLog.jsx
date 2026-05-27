import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import {
  Activity, Thermometer, Heart, ChevronDown, CheckCircle,
  Smile, Frown, Meh, UploadCloud, Clock, Lightbulb,
  Loader2, AlertTriangle, X,
} from 'lucide-react';
import api from '../../../services/api';
import './AddHealthLog.css';

// ── helpers ───────────────────────────────────────────────────────
const residentAvatar = (name) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'elder')}`;

const conditionTag = (c) => {
  const val = (c || '').toUpperCase();
  if (val === 'CRITICAL')        return 'critical';
  if (val === 'NEEDS ATTENTION') return 'elevated';
  return 'stable';
};

const formatRelative = (iso) => {
  if (!iso) return '—';
  const d   = new Date(iso);
  const now = new Date();
  const diffH = Math.round((now - d) / 36e5);
  if (diffH < 1)  return 'Just now';
  if (diffH < 24) return `${diffH} hour${diffH > 1 ? 's' : ''} ago`;
  return d.toLocaleDateString();
};

const nowLocalIso = () => {
  const d   = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// ── Toast ─────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div style={{
      position:'fixed', top:24, right:24, zIndex:9999,
      background: ok ? '#f0fdf4' : '#fef2f2',
      border:`1px solid ${ok ? '#86efac' : '#fca5a5'}`,
      color: ok ? '#166534' : '#991b1b',
      padding:'12px 20px', borderRadius:10,
      fontSize:'0.84rem', fontWeight:600,
      boxShadow:'0 4px 20px rgba(0,0,0,.12)',
      display:'flex', alignItems:'center', gap:8,
    }}>
      {ok ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
      {toast.message}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const AddHealthLog = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ── form state ────────────────────────────────────────────────
  const [residents,       setResidents]       = useState([]);
  const [selectedId,      setSelectedId]      = useState('');
  const [loggedAt,        setLoggedAt]        = useState(nowLocalIso());
  const [bp,              setBp]              = useState('');
  const [temp,            setTemp]            = useState('');
  const [heartRate,       setHeartRate]       = useState('');
  const [mealStatus,      setMealStatus]      = useState({ breakfast: 'Completed', lunch: 'Completed', dinner: 'Pending' });
  const [medsTaken,       setMedsTaken]       = useState(false);
  const [medsNotes,       setMedsNotes]       = useState('');
  const [clinicalNotes,   setClinicalNotes]   = useState('');
  const [mood,            setMood]            = useState('neutral');
  const [condition,       setCondition]       = useState('STABLE');
  const [attachment,      setAttachment]      = useState(null);   // File object

  // ── sidebar state ─────────────────────────────────────────────
  const [sidebarLoading,  setSidebarLoading]  = useState(false);
  const [residentInfo,    setResidentInfo]    = useState(null);   // { resident, lastLog, history }

  // ── submit / loading state ────────────────────────────────────
  const [loading,         setLoading]         = useState(true);
  const [submitting,      setSubmitting]      = useState(false);
  const [toast,           setToast]           = useState(null);

  // ── load residents on mount ───────────────────────────────────
  useEffect(() => {
    api.get('/users/my-residents')
      .then(({ data }) => {
        setResidents(data);
        if (data.length > 0) setSelectedId(String(data[0].id));
      })
      .catch(() => showToast('error', 'Could not load residents'))
      .finally(() => setLoading(false));
  }, []);

  // ── load sidebar when resident changes ────────────────────────
  useEffect(() => {
    if (!selectedId) return;
    setSidebarLoading(true);
    setResidentInfo(null);
    api.get(`/health/resident/${selectedId}/summary`)
      .then(({ data }) => setResidentInfo(data))
      .catch(() => {/* sidebar failure is non-critical */})
      .finally(() => setSidebarLoading(false));
  }, [selectedId]);

  // ── helpers ───────────────────────────────────────────────────
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleMeal = (meal, status) =>
    setMealStatus(prev => ({ ...prev, [meal]: status }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAttachment(file);
  };

  // ── submit ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedId) { showToast('error', 'Please select a resident'); return; }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('parent_id',         selectedId);
      form.append('logged_at',         loggedAt || '');
      form.append('blood_pressure',    bp);
      form.append('temperature',       temp);
      form.append('heart_rate',        heartRate);
      form.append('breakfast_status',  mealStatus.breakfast);
      form.append('lunch_status',      mealStatus.lunch);
      form.append('dinner_status',     mealStatus.dinner);
      form.append('meds_taken',        String(medsTaken));
      form.append('meds_notes',        medsNotes);
      form.append('clinical_notes',    clinicalNotes);
      form.append('mood',              mood);
      form.append('overall_condition', condition);
      if (attachment) form.append('attachment', attachment);

      // Do NOT manually set Content-Type — axios auto-sets multipart/form-data
      // WITH the correct boundary when it detects a FormData object.
      // Overriding it strips the boundary and breaks multer on the backend.
      await api.post('/health', form);

      showToast('success', 'Health log submitted successfully!');
      // reset form
      setBp(''); setTemp(''); setHeartRate('');
      setMealStatus({ breakfast: 'Completed', lunch: 'Completed', dinner: 'Pending' });
      setMedsTaken(false); setMedsNotes('');
      setClinicalNotes(''); setMood('neutral');
      setCondition('STABLE'); setAttachment(null);
      setLoggedAt(nowLocalIso());
      if (fileInputRef.current) fileInputRef.current.value = '';

      // refresh sidebar
      if (selectedId) {
        api.get(`/health/resident/${selectedId}/summary`)
          .then(({ data }) => setResidentInfo(data))
          .catch(() => {});
      }
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to submit log');
    } finally {
      setSubmitting(false);
    }
  };

  // ── shorthand sidebar data ────────────────────────────────────
  const sr = residentInfo?.resident;
  const lastLog = residentInfo?.lastLog;
  const history = residentInfo?.history || [];

  // ── render ────────────────────────────────────────────────────
  return (
    <CaregiverLayout title="Add Health Log">
      <Toast toast={toast} />

      <div className="health-log-container">

        {/* Header */}
        <div className="health-log-header">
          <div className="breadcrumb">
            <span
              style={{ cursor:'pointer', color:'#0d9488' }}
              onClick={() => navigate('/caregiver/dashboard')}
            >Dashboard</span>
            <span>/</span>
            <span className="active">Add Health Log</span>
          </div>
          <h1>Add Health Log</h1>
        </div>

        <div className="health-log-content">

          {/* ══ Main Form ══ */}
          <div className="main-form-section">

            {/* Resident + Date row */}
            <div className="hl-row">
              <div className="hl-group">
                <label className="hl-label">Select Elder</label>
                <div className="hl-select-wrapper">
                  <select
                    className="hl-select"
                    value={selectedId}
                    onChange={e => setSelectedId(e.target.value)}
                  >
                    {residents.length === 0 && (
                      <option value="">— No residents assigned —</option>
                    )}
                    {residents.map(r => (
                      <option key={r.id} value={String(r.id)}>{r.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="hl-select-icon" size={18} />
                </div>
              </div>

              <div className="hl-group">
                <label className="hl-label">Date &amp; Time</label>
                <div className="hl-select-wrapper">
                  <input
                    type="datetime-local"
                    className="hl-input"
                    value={loggedAt}
                    onChange={e => setLoggedAt(e.target.value)}
                  />
                  <Clock className="hl-select-icon" size={16} />
                </div>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="hl-card">
              <h2 className="hl-card-title">
                <Activity className="icon" size={20} />
                Vital Signs
              </h2>
              <div className="vitals-grid">
                <div className="vital-input-box">
                  <label>BP (mmHg)</label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={bp}
                    onChange={e => setBp(e.target.value)}
                  />
                </div>
                <div className="vital-input-box">
                  <label>Temperature (°F)</label>
                  <input
                    type="text"
                    placeholder="98.6"
                    value={temp}
                    onChange={e => setTemp(e.target.value)}
                  />
                </div>
                <div className="vital-input-box">
                  <label>Heart Rate (BPM)</label>
                  <input
                    type="text"
                    placeholder="72"
                    value={heartRate}
                    onChange={e => setHeartRate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Meals + Medication row */}
            <div className="hl-row">

              {/* Meals Log */}
              <div className="hl-card hl-group">
                <h2 className="hl-card-title">Meals Log</h2>
                <div className="meals-log">
                  {['breakfast', 'lunch', 'dinner'].map(meal => (
                    <div className="meal-row" key={meal}>
                      <span className="meal-name" style={{ textTransform:'capitalize' }}>{meal}</span>
                      <div className="meal-toggles">
                        <button
                          className={`meal-toggle-btn completed ${mealStatus[meal] === 'Completed' ? 'active' : ''}`}
                          onClick={() => toggleMeal(meal, 'Completed')}
                        >Completed</button>
                        <button
                          className={`meal-toggle-btn skipped ${mealStatus[meal] === 'Skipped' ? 'active' : ''}`}
                          onClick={() => toggleMeal(meal, 'Skipped')}
                        >Skipped</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medication */}
              <div className="hl-card hl-group">
                <div className="medication-header">
                  <h3>Medication</h3>
                  <div className="meds-toggle">
                    <span className="meds-toggle-label">Meds Taken?</span>
                    <div
                      className={`custom-switch ${medsTaken ? 'active' : ''}`}
                      onClick={() => setMedsTaken(!medsTaken)}
                    >
                      <div className="knob"></div>
                    </div>
                  </div>
                </div>
                <textarea
                  className="hl-textarea"
                  placeholder="Dosage details or changes..."
                  value={medsNotes}
                  onChange={e => setMedsNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Clinical Notes & Mood */}
            <div className="hl-card">
              <div className="mood-header">
                <h2 className="hl-card-title" style={{ margin:0 }}>Clinical Notes &amp; Mood</h2>
                <div className="mood-icons">
                  <button
                    className={`mood-btn ${mood === 'happy' ? 'active' : ''}`}
                    onClick={() => setMood('happy')}
                    title="Happy"
                  ><Smile size={20}/></button>
                  <button
                    className={`mood-btn neutral ${mood === 'neutral' ? 'active neutral' : ''}`}
                    onClick={() => setMood('neutral')}
                    title="Neutral"
                  ><Meh size={20}/></button>
                  <button
                    className={`mood-btn sad ${mood === 'sad' ? 'active sad' : ''}`}
                    onClick={() => setMood('sad')}
                    title="Sad"
                  ><Frown size={20}/></button>
                </div>
              </div>
              <textarea
                className="hl-textarea"
                placeholder="Observation about mood, physical complaints, or social interaction..."
                style={{ minHeight:'120px' }}
                value={clinicalNotes}
                onChange={e => setClinicalNotes(e.target.value)}
              />
            </div>

            {/* Overall Condition + Upload */}
            <div className="hl-row mb-4">

              {/* Overall Condition */}
              <div className="hl-card hl-group">
                <h2 className="hl-card-title">Overall Condition</h2>
                <div className="condition-options">
                  {[
                    { value:'STABLE',           label:'Stable',          cls:'stable' },
                    { value:'NEEDS ATTENTION',  label:'Needs Attention', cls:'needs-attention' },
                    { value:'CRITICAL',         label:'Critical',        cls:'critical' },
                  ].map(opt => (
                    <div
                      key={opt.value}
                      className={`condition-radio ${opt.cls} ${condition === opt.value ? 'active' : ''}`}
                      onClick={() => setCondition(opt.value)}
                    >
                      <div className="radio-circle"><div className="radio-inner" /></div>
                      <span className="condition-label">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Attachment */}
              <div className="hl-card hl-group" style={{ display:'flex', flexDirection:'column' }}>
                <h2 className="hl-card-title">Upload Attachment</h2>
                <div
                  className="file-upload-box"
                  style={{ flex:1, justifyContent:'center', cursor:'pointer' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {attachment ? (
                    <>
                      <CheckCircle className="upload-icon" size={32} color="#0d9488" />
                      <span className="upload-text" style={{ color:'#0d9488' }}>{attachment.name}</span>
                      <button
                        className="browse-btn"
                        style={{ marginTop:8 }}
                        onClick={e => { e.stopPropagation(); setAttachment(null); if (fileInputRef.current) fileInputRef.current.value=''; }}
                      >Remove</button>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="upload-icon" size={32} />
                      <span className="upload-text">Upload Attachment</span>
                      <span className="upload-subtext">Photos, meal charts, or prescriptions</span>
                      <button className="browse-btn" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                        Browse Files
                      </button>
                    </>
                  )}
                </div>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  style={{ display:'none' }}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* No residents warning */}
            {residents.length === 0 && !loading && (
              <div style={{
                background: '#fef9c3', border: '1px solid #fde047',
                borderRadius: 10, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                color: '#854d0e', fontSize: '0.875rem', fontWeight: 500,
              }}>
                <AlertTriangle size={16} />
                No residents are assigned to your account yet. Please contact your admin to assign residents before submitting a log.
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-area" style={{ marginBottom:'2rem' }}>
              <button className="btn-cancel" onClick={() => navigate('/caregiver/dashboard')}>
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={submitting || residents.length === 0}
                title={residents.length === 0 ? 'No residents assigned — contact your admin' : ''}
              >
                {submitting
                  ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite', marginRight:6 }}/>Submitting…</>
                  : 'Submit Log'
                }
              </button>
            </div>

          </div>

          {/* ══ Right Sidebar ══ */}
          <div className="sidebar-section">

            {/* Profile Card */}
            <div className="hl-card" style={{ padding:0, overflow:'hidden' }}>
              {sidebarLoading ? (
                <div style={{ display:'flex', justifyContent:'center', padding:32 }}>
                  <Loader2 size={28} style={{ animation:'spin 1s linear infinite', color:'#0d9488' }}/>
                </div>
              ) : sr ? (
                <div className="profile-summary">
                  <div className="profile-avatar-wrapper">
                    <img src={residentAvatar(sr.name)} alt={sr.name} />
                  </div>
                  <h3 className="profile-name">{sr.name}</h3>
                  <p className="profile-meta">
                    {sr.age} Years{sr.room_number ? ` • Room ${sr.room_number}` : ''}
                  </p>
                  {sr.medical_conditions && (
                    <div className="profile-badges">
                      {sr.medical_conditions.split(',').map((c, i) => (
                        <span key={i} className={`badge ${i % 2 === 0 ? 'orange' : 'teal'}`}>
                          {c.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="profile-summary">
                  <p style={{ color:'#94a3b8', padding:'1rem', textAlign:'center' }}>Select a resident</p>
                </div>
              )}
            </div>

            {/* Last Log Summary */}
            <div className="hl-card">
              <h2 className="hl-card-title" style={{ fontSize:'0.85rem', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1.5rem' }}>
                Last Log Summary
              </h2>
              {lastLog ? (
                <>
                  <div className="log-summary-item">
                    <div className="log-icon-wrapper teal"><Activity size={16}/></div>
                    <div className="log-content">
                      <span className="log-time">{formatRelative(lastLog.logged_at)}</span>
                      {lastLog.blood_pressure && <h4 className="log-title">BP: {lastLog.blood_pressure} mmHg</h4>}
                      {lastLog.temperature    && <h4 className="log-title">Temp: {lastLog.temperature}°F</h4>}
                      {lastLog.clinical_notes && <p className="log-desc">"{lastLog.clinical_notes}"</p>}
                      {!lastLog.blood_pressure && !lastLog.temperature && !lastLog.clinical_notes && (
                        <p className="log-desc">No vitals recorded</p>
                      )}
                    </div>
                  </div>
                  {(lastLog.breakfast_status || lastLog.lunch_status || lastLog.dinner_status) && (
                    <div className="log-summary-item">
                      <div className="log-icon-wrapper orange"><Activity size={16}/></div>
                      <div className="log-content">
                        <span className="log-time">Meals Status</span>
                        <h4 className="log-title">
                          {[
                            lastLog.breakfast_status === 'Completed' && 'Breakfast',
                            lastLog.lunch_status     === 'Completed' && 'Lunch',
                            lastLog.dinner_status    === 'Completed' && 'Dinner',
                          ].filter(Boolean).join(' & ') || 'No meals completed'}
                          {' Completed'}
                        </h4>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ color:'#94a3b8', fontSize:'0.85rem' }}>No previous logs found</p>
              )}
            </div>

            {/* Recent Condition History */}
            <div className="hl-card">
              <h2 className="hl-card-title" style={{ fontSize:'0.85rem', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1.5rem' }}>
                Recent Condition
              </h2>
              {history.length > 0 ? (
                <div className="recent-condition-list">
                  {history.map(h => (
                    <div className="condition-item" key={h.id}>
                      <span className="condition-time">{formatRelative(h.logged_at)}</span>
                      <span className={`status-tag ${conditionTag(h.overall_condition)}`}>
                        {h.overall_condition || 'STABLE'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color:'#94a3b8', fontSize:'0.85rem' }}>No condition history yet</p>
              )}
              <button className="view-history-btn">View Full History</button>
            </div>

            {/* Caregiver Tip */}
            <div className="hl-card tip-card">
              <div className="tip-title">
                <Lightbulb size={18}/>
                Caregiver Tip
              </div>
              <p className="tip-content">
                {sr
                  ? `Regular hydration checks are crucial for ${sr.name.split(' ')[0]} — especially when vital signs show elevated temperature.`
                  : 'Select a resident to see personalized care tips.'
                }
              </p>
            </div>

          </div>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </CaregiverLayout>
  );
};

export default AddHealthLog;
