import React, { useState, useEffect, useCallback } from 'react';
import { Search, Heart, User, Clock, ClipboardList, X, Activity, Thermometer, Info, FileText, Loader2, Paperclip, AlertCircle, Utensils, Pill, Smile } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import adminService from '../../../services/adminService';
import { mapHealthLogToUIModel } from '../../../utils/healthDataMapper';
import { INITIAL_HEALTH_LOG_STATE } from '../../../types/healthLog';
import './AdminHealthLogsV2.css';

const AdminHealthLogsV2 = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal state
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getHealthLogs({ limit: 200 });
      const mapped = Array.isArray(data) ? data.map(mapHealthLogToUIModel) : [];
      setLogs(mapped);
    } catch (err) {
      console.error('Failed to fetch health logs:', err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Trigger modal and fetch comprehensive record by ID
  const handleOpenRecord = async (logItem) => {
    setSelectedLog(logItem);
    setModalLoading(true);
    setModalError(null);

    try {
      const { data } = await adminService.getHealthLogById(logItem.id);
      if (data) {
        setSelectedLog(mapHealthLogToUIModel(data));
      }
    } catch (err) {
      console.warn('Could not load extended log details from server, using cached row:', err);
      // Keep optimistic logItem mapped state as graceful fallback
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = useCallback(() => {
    setSelectedLog(null);
    setModalLoading(false);
    setModalError(null);
  }, []);

  // Handle escape key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedLog) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLog, handleCloseModal]);

  const filteredLogs = logs.filter(l => {
    const term = search.toLowerCase().trim();
    const matchesSearch = !term || 
      (l.elderName && l.elderName.toLowerCase().includes(term)) || 
      (l.caregiverName && l.caregiverName.toLowerCase().includes(term)) ||
      (l.clinicalNotes && l.clinicalNotes.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'all' || l.conditionBadge === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayoutV2 title="System Health Logs">
      <div className="health-v2-container">
        
        {/* Header Section */}
        <div className="health-v2-header">
          <div className="health-v2-title">
            <h2>Health Records Directory</h2>
            <p>Review real-time health statuses, vitals, and caregiver clinical observations.</p>
          </div>
          
          <div className="health-v2-header-actions">
            <div className="health-v2-search">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by elder or caregiver..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <select 
              className="health-v2-filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="stable">Stable</option>
              <option value="needs-attention">Needs Attention</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Logs Grid Layout */}
        <div className="health-v2-grid">
          {loading ? (
             <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
               <Loader2 className="animate-spin" size={32} color="#00A896" />
             </div>
          ) : filteredLogs.length === 0 ? (
            <div className="health-v2-empty" style={{ gridColumn: '1 / -1' }}>
              <Info size={48} />
              <p>No health logs match your search criteria.</p>
            </div>
          ) : (
            filteredLogs.map(l => (
              <div key={l.id} className={`health-v2-card status-${l.conditionBadge}`}>
                <div className="health-v2-card-glow"></div>
                
                <div className="health-v2-card-header">
                  <div className="health-v2-avatar-name">
                    <div className="health-v2-avatar">
                      {(l.elderName || 'FC').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4>{l.elderName}</h4>
                      <p className="health-v2-meta">
                        <Clock size={12} className="inline-icon" /> {l.formattedDate}
                      </p>
                    </div>
                  </div>
                  <span className={`health-v2-status-pill status-${l.conditionBadge}`}>
                    {l.conditionBadge === 'needs-attention' ? 'Attention' : l.conditionBadge}
                  </span>
                </div>

                <div className="health-v2-vitals-row">
                  <div className="vital-indicator">
                    <Activity size={14} color="#00A896" />
                    <span className="label">BP:</span>
                    <span className="value">{l.bloodPressure || '—'}</span>
                  </div>
                  <div className="vital-indicator">
                    <Heart size={14} color="#EF4444" />
                    <span className="label">HR:</span>
                    <span className="value">{l.heartRate ? `${l.heartRate} bpm` : '—'}</span>
                  </div>
                  <div className="vital-indicator">
                    <Thermometer size={14} color="#EA580C" />
                    <span className="label">Temp:</span>
                    <span className="value">{l.temperature ? `${l.temperature}°` : '—'}</span>
                  </div>
                </div>

                <div className="health-v2-caregiver-info">
                  <User size={14} />
                  <span>Logged by: <strong>{l.caregiverName}</strong></span>
                </div>

                <div className="health-v2-card-footer">
                  <button className="view-log-btn" onClick={() => handleOpenRecord(l)}>
                    <ClipboardList size={16} />
                    View Health Record
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Health Record Details Modal */}
        {selectedLog && (
          <div className="health-v2-modal-overlay" onClick={handleCloseModal}>
            <div className="health-v2-modal" onClick={e => e.stopPropagation()}>
              <button className="health-v2-modal-close" onClick={handleCloseModal} aria-label="Close modal">
                <X size={20} />
              </button>

              <div className="health-v2-modal-header">
                <div className="health-v2-modal-icon">
                  <FileText size={28} color="white" />
                </div>
                <div>
                  <h2 className="health-v2-modal-title">{selectedLog.elderName}</h2>
                  <p className="health-v2-modal-desc">
                    {selectedLog.formattedDate} &nbsp;•&nbsp; Logged by {selectedLog.caregiverName}
                  </p>
                </div>
              </div>

              <div className="health-v2-modal-body">
                {modalLoading && (
                  <div className="modal-loading-banner">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Syncing latest record details...</span>
                  </div>
                )}

                {/* Primary Vitals Grid */}
                <div className="v2-vitals-grid">
                  <div className="vital-box">
                    <span className="label">Blood Pressure</span>
                    <span className="value">{selectedLog.bloodPressure || '—'}</span>
                  </div>
                  <div className="vital-box">
                    <span className="label">Heart Rate</span>
                    <span className="value">{selectedLog.heartRate ? `${selectedLog.heartRate} bpm` : '—'}</span>
                  </div>
                  <div className="vital-box">
                    <span className="label">Temperature</span>
                    <span className="value">{selectedLog.temperature ? `${selectedLog.temperature} °F` : '—'}</span>
                  </div>
                </div>

                {/* Tracking & Observation Stats */}
                <div className="health-v2-tracking-grid">
                  <div className="chart-stat">
                    <span className="label">Condition Severity</span>
                    <span className={`value-pill status-${selectedLog.conditionBadge}`}>
                      {selectedLog.overallCondition}
                    </span>
                  </div>
                  
                  <div className="chart-stat">
                    <span className="label">Medication Administration</span>
                    <span className="value">{selectedLog.medicationDisplay || '—'}</span>
                  </div>

                  <div className="chart-stat">
                    <span className="label">Mood / Demeanor</span>
                    <span className="value">{selectedLog.mood || '—'}</span>
                  </div>

                  <div className="chart-stat">
                    <span className="label">Meals Logged</span>
                    <span className="value">{selectedLog.mealsSummary || '—'}</span>
                  </div>
                </div>

                {/* Clinical Notes Section */}
                <div className="clinical-notes-box">
                  <h5>Clinical Caregiver Notes</h5>
                  <p>{selectedLog.clinicalNotes || 'No notes provided for this record.'}</p>
                </div>

                {/* Optional Attachment View */}
                {selectedLog.attachmentUrl && (
                  <div className="health-attachment-box">
                    <Paperclip size={16} color="#00A896" />
                    <span>Attached Document / Report:</span>
                    <a 
                      href={selectedLog.attachmentUrl.startsWith('http') ? selectedLog.attachmentUrl : `${import.meta.env.VITE_API_URL || ''}${selectedLog.attachmentUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="attachment-link"
                    >
                      View Attachment
                    </a>
                  </div>
                )}
              </div>

              <div className="health-v2-modal-actions">
                <button className="health-v2-modal-close-btn" onClick={handleCloseModal}>
                  Close Record
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayoutV2>
  );
};

export default AdminHealthLogsV2;

