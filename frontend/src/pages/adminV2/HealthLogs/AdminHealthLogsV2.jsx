import React, { useState } from 'react';
import { Search, Heart, User, Clock, ClipboardList, X, Activity, Thermometer, Info, FileText } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import './AdminHealthLogsV2.css';

const initialHealthLogs = [
  { id: 1, parentName: 'Eleanor Vance', bp: '135/88', hr: 78, temp: 98.6, meal: 'Full Breakfast', notes: 'Normal morning reading. Patient rested and took hypertension medication.', caregiver: 'Ravi Kumar', date: 'Today, 09:30 AM', mood: 'Cheerful', condition: 'stable' },
  { id: 2, parentName: 'Robert Sterling', bp: '120/80', hr: 72, temp: 98.4, meal: 'Partial Lunch', notes: 'Took post-stroke recovery medication as scheduled. Patient walked 15 mins.', caregiver: 'Ravi Kumar', date: 'Today, 01:15 PM', mood: 'Calm', condition: 'stable' },
  { id: 3, parentName: 'Clara Oswald', bp: '158/92', hr: 88, temp: 99.2, meal: 'Full Lunch', notes: 'Blood pressure is slightly elevated. Advised bed rest and monitored glucose level.', caregiver: 'Clara Oswald', date: 'Yesterday, 02:40 PM', mood: 'Tired', condition: 'needs-attention' },
  { id: 4, parentName: 'Arthur Jenkins', bp: '145/95', hr: 102, temp: 99.5, meal: 'Refused Meal', notes: 'Heart rate is high. Patient refused afternoon meal. Heavy breathing noted.', caregiver: 'Unassigned', date: 'Yesterday, 04:00 PM', mood: 'Agitated', condition: 'critical' }
];

const AdminHealthLogsV2 = () => {
  const [logs] = useState(initialHealthLogs);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);

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
          {filteredLogs.length === 0 ? (
            <div className="health-v2-empty">
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
                      {l.parentName.split(' ').map(n => n[0]).join('')}
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
                    <span className="value">{l.temp}°</span>
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
                    <span className="label">Blood Pressure</span>
                    <span className="value">{selectedLog.bp}</span>
                  </div>
                  <div className="vital-box">
                    <span className="label">Heart Rate</span>
                    <span className="value">{selectedLog.hr} bpm</span>
                  </div>
                  <div className="vital-box">
                    <span className="label">Temperature</span>
                    <span className="value">{selectedLog.temp} °F</span>
                  </div>
                </div>

                <div className="chart-stat">
                  <span className="label">Condition Severity</span>
                  <span className={`value-pill status-${selectedLog.condition}`}>{selectedLog.condition.toUpperCase().replace('-', ' ')}</span>
                </div>
                
                <div className="chart-stat">
                  <span className="label">Meal Consumption</span>
                  <span className="value">{selectedLog.meal}</span>
                </div>
                
                <div className="chart-stat">
                  <span className="label">Mood/Behavior</span>
                  <span className="value">{selectedLog.mood}</span>
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
