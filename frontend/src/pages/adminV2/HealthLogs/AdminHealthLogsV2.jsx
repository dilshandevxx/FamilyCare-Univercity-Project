import React, { useState, useEffect, useCallback } from 'react';
import { Search, Heart, User, Clock, ClipboardList, X, Activity, Thermometer, Info, FileText, Loader2 } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import api from '../../../services/api';
import './AdminHealthLogsV2.css';

const deriveFlag = (log) => {
  if (log.flag) return log.flag;
  const cond = (log.overall_condition || '').toLowerCase();
  if (cond.includes('critical') || cond.includes('poor')) return 'Critical';
  if (cond.includes('fair') || cond.includes('concern')) return 'Warning';
  return 'Normal';
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffD = Math.floor((now - d) / 86400000);
  if (diffD === 0) return `Today, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffD === 1) return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ` ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
};

const AdminHealthLogsV2 = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/health-logs', { params: { limit: 200 } });
      setLogs(data.map(l => {
        const flag = deriveFlag(l);
        const condition = flag === 'Critical' ? 'critical' : flag === 'Warning' ? 'needs-attention' : 'stable';
        
        return {
          id: l.id,
          parentName: l.elder_name || 'Unknown',
          caregiver: l.caregiver_name || 'Unknown',
          bp: l.blood_pressure || 'N/A',
          hr: l.heart_rate || 'N/A',
          temp: l.temperature || 'N/A',
          spo2: l.oxygen_level || 'N/A',
          bloodSugar: l.blood_sugar || 'N/A',
          hydration: l.hydration_level || 'N/A',
          sleep: l.sleep_quality || 'N/A',
          weight: l.weight || 'N/A',
          meds: l.medication_status || 'N/A',
          meal: l.meal_consumption || 'N/A',
          notes: l.notes || 'No notes provided.',
          date: formatDate(l.logged_at),
          mood: l.mood || 'N/A',
          condition
        };
      }));
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.parentName.toLowerCase().includes(search.toLowerCase()) || 
                          l.caregiver.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.condition === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayoutV2 title="System Health Logs">
      <div className="health-v2-container">
        
        {/* Header Section */}
        <div className="health-v2-header">
          <div className="health-v2-title">
            <h2>Health Records Directory</h2>
            <p>Review real-time health statuses, vitals, and caregiver clinical notes.</p>
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
              <div key={l.id} className={`health-v2-card status-${l.condition}`}>
                <div className="health-v2-card-glow"></div>
                
                <div className="health-v2-card-header">
                  <div className="health-v2-avatar-name">
                    <div className="health-v2-avatar">
                      {l.parentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <h4>{l.parentName}</h4>
                      <p className="health-v2-meta">
                        <Clock size={12} className="inline-icon" /> {l.date}
                      </p>
                    </div>
                  </div>
                  <span className={`health-v2-status-pill status-${l.condition}`}>
                    {l.condition === 'needs-attention' ? 'Attention' : l.condition}
                  </span>
                </div>

                <div className="health-v2-vitals-row">
                  <div className="vital-indicator">
                    <Activity size={14} color="#00A896" />
                    <span className="label">BP:</span>
                    <span className="value">{l.bp}</span>
                  </div>
                  <div className="vital-indicator">
                    <Heart size={14} color="#EF4444" />
                    <span className="label">HR:</span>
                    <span className="value">{l.hr}</span>
                  </div>
                  <div className="vital-indicator">
                    <Thermometer size={14} color="#EA580C" />
                    <span className="label">Temp:</span>
                    <span className="value">{l.temp !== 'N/A' ? `${l.temp}°` : 'N/A'}</span>
                  </div>
                </div>

                <div className="health-v2-caregiver-info">
                  <User size={14} />
                  <span>Logged by: <strong>{l.caregiver}</strong></span>
                </div>

                <div className="health-v2-card-footer">
                  <button className="view-log-btn" onClick={() => setSelectedLog(l)}>
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
          <div className="health-v2-modal-overlay" onClick={() => setSelectedLog(null)}>
            <div className="health-v2-modal" onClick={e => e.stopPropagation()}>
              <button className="health-v2-modal-close" onClick={() => setSelectedLog(null)}>
                <X size={20} />
              </button>

              <div className="health-v2-modal-header">
                <div className="health-v2-modal-icon">
                  <FileText size={28} color="white" />
                </div>
                <div>
                  <h2 className="health-v2-modal-title">{selectedLog.parentName}</h2>
                  <p className="health-v2-modal-desc">{selectedLog.date} &nbsp;•&nbsp; Logged by {selectedLog.caregiver}</p>
                </div>
              </div>

              <div className="health-v2-modal-body">
                <div className="v2-vitals-grid">
                  <div className="vital-box">
                    <span className="label">BP</span>
                    <span className="value">{selectedLog.bp}</span>
                  </div>
                  <div className="vital-box">
                    <span className="label">Heart Rate</span>
                    <span className="value">{selectedLog.hr !== 'N/A' ? `${selectedLog.hr} bpm` : 'N/A'}</span>
                  </div>
                  <div className="vital-box">
                    <span className="label">Temperature</span>
                    <span className="value">{selectedLog.temp !== 'N/A' ? `${selectedLog.temp} °F` : 'N/A'}</span>
                  </div>
                  <div className="vital-box">
                    <span className="label">SpO2</span>
                    <span className="value">{selectedLog.spo2 !== 'N/A' ? `${selectedLog.spo2}%` : 'N/A'}</span>
                  </div>
                  <div className="vital-box">
                    <span className="label">Blood Sugar</span>
                    <span className="value">{selectedLog.bloodSugar}</span>
                  </div>
                  <div className="vital-box">
                    <span className="label">Weight</span>
                    <span className="value">{selectedLog.weight}</span>
                  </div>
                </div>

                <div className="health-v2-tracking-grid">
                  <div className="chart-stat">
                    <span className="label">Condition Severity</span>
                    <span className={`value-pill status-${selectedLog.condition}`}>{selectedLog.condition.toUpperCase().replace('-', ' ')}</span>
                  </div>
                  
                  <div className="chart-stat">
                    <span className="label">Medication Status</span>
                    <span className={`value ${selectedLog.meds === 'Taken on time' ? 'text-teal' : selectedLog.meds === 'Refused' ? 'text-coral' : 'text-warning'}`}>
                      {selectedLog.meds}
                    </span>
                  </div>

                  <div className="chart-stat">
                    <span className="label">Hydration Intake</span>
                    <span className="value">{selectedLog.hydration}</span>
                  </div>

                  <div className="chart-stat">
                    <span className="label">Sleep Quality</span>
                    <span className="value">{selectedLog.sleep}</span>
                  </div>
                  
                  <div className="chart-stat">
                    <span className="label">Meal Consumption</span>
                    <span className="value">{selectedLog.meal}</span>
                  </div>
                  
                  <div className="chart-stat">
                    <span className="label">Mood/Behavior</span>
                    <span className="value">{selectedLog.mood}</span>
                  </div>
                </div>

                <div className="clinical-notes-box">
                  <h5>Clinical Caregiver Notes</h5>
                  <p>{selectedLog.notes}</p>
                </div>
              </div>

              <div className="health-v2-modal-actions">
                <button className="health-v2-modal-close-btn" onClick={() => setSelectedLog(null)}>
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
