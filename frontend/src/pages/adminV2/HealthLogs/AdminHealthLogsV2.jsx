import React, { useState } from 'react';
import { Search, Activity, Heart, Thermometer, User, Clock, ChevronRight, CheckCircle, FileText, Info, X } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import './AdminHealthLogsV2.css';

const initialHealthLogs = [
  { id: 1, parentName: 'Eleanor Vance', bp: '135/88', hr: 78, temp: 98.6, meal: 'Full Breakfast', notes: 'Normal morning reading. Patient rested and took hypertension medication.', caregiver: 'Ravi Kumar', date: 'Today, 09:30 AM', mood: 'Cheerful', condition: 'Stable' },
  { id: 2, parentName: 'Robert Sterling', bp: '120/80', hr: 72, temp: 98.4, meal: 'Partial Lunch', notes: 'Took post-stroke recovery medication as scheduled. Patient walked 15 mins.', caregiver: 'Ravi Kumar', date: 'Today, 01:15 PM', mood: 'Calm', condition: 'Stable' },
  { id: 3, parentName: 'Clara Oswald', bp: '158/92', hr: 88, temp: 99.2, meal: 'Full Lunch', notes: 'Blood pressure is slightly elevated. Advised bed rest and monitored glucose level.', caregiver: 'Clara Oswald', date: 'Yesterday, 02:40 PM', mood: 'Tired', condition: 'Needs Attention' },
  { id: 4, parentName: 'Arthur Jenkins', bp: '145/95', hr: 102, temp: 99.5, meal: 'Refused Meal', notes: 'Heart rate is high. Patient refused afternoon meal. Heavy breathing noted.', caregiver: 'Unassigned', date: 'Yesterday, 04:00 PM', mood: 'Agitated', condition: 'Critical' }
];

const AdminHealthLogsV2 = () => {
  const [logs] = useState(initialHealthLogs);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = logs.filter(l => 
    l.parentName.toLowerCase().includes(search.toLowerCase()) || 
    l.caregiver.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayoutV2 title="System Health Logs">
      <div className="health-v2-container">
        
        {/* Search bar */}
        <div className="health-v2-header-actions">
          <div className="health-v2-search-input">
            <Search size={18} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Search health logs by elder name or caregiver..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Logs Feed */}
        <div className="health-v2-feed">
          {filteredLogs.length === 0 ? (
            <div className="health-v2-empty">No health logs found.</div>
          ) : (
            filteredLogs.map(l => (
              <div key={l.id} className="health-v2-log-card" onClick={() => setSelectedLog(l)}>
                <div className="health-v2-log-header">
                  <div className="log-elder-profile">
                    <div className="log-avatar">
                      {l.parentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4>{l.parentName}</h4>
                      <div className="log-time-caregiver">
                        <Clock size={12} /> <span>{l.date}</span>
                        <span className="dot-sep" />
                        <User size={12} /> <span>By: {l.caregiver}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`log-severity status-${l.condition.toLowerCase().replace(' ', '-')}`}>
                    {l.condition}
                  </span>
                </div>

                {/* Vitals summary bar */}
                <div className="health-v2-vitals-row">
                  <div className="vital-indicator">
                    <Activity size={14} color="#00A896" />
                    <span className="label">BP:</span>
                    <span className="value">{l.bp}</span>
                  </div>
                  <div className="vital-indicator">
                    <Heart size={14} color="#EF4444" />
                    <span className="label">Heart Rate:</span>
                    <span className="value">{l.hr} bpm</span>
                  </div>
                  <div className="vital-indicator">
                    <Thermometer size={14} color="#EA580C" />
                    <span className="label">Temp:</span>
                    <span className="value">{l.temp} °F</span>
                  </div>
                </div>

                <div className="health-v2-notes-preview">
                  <p>{l.notes.substring(0, 95)}...</p>
                </div>

                <div className="health-v2-log-footer">
                  <span className="click-detail">Click to view complete clinical chart</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Health Log Detail Modal */}
        {selectedLog && (
          <div className="health-v2-modal-overlay" onClick={() => setSelectedLog(null)}>
            <div className="health-v2-modal" onClick={e => e.stopPropagation()}>
              <button className="health-v2-modal-close" onClick={() => setSelectedLog(null)}>
                <X size={18} />
              </button>

              <div className="health-v2-modal-header">
                <div className="health-v2-modal-icon">
                  <FileText size={24} color="#00A896" />
                </div>
                <div>
                  <h2 className="health-v2-modal-title">{selectedLog.parentName} &mdash; Detailed Log</h2>
                  <p className="health-v2-modal-desc">{selectedLog.date} &nbsp;·&nbsp; Logged by {selectedLog.caregiver}</p>
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

                <div className="detailed-info-list">
                  <div className="info-item">
                    <span className="label">Meal Consumption:</span>
                    <span className="value text-dark">{selectedLog.meal}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Mood/Behavior:</span>
                    <span className="value text-dark">{selectedLog.mood}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Vitals Alert Classification:</span>
                    <span className={`value-badge status-${selectedLog.condition.toLowerCase().replace(' ', '-')}`}>
                      {selectedLog.condition}
                    </span>
                  </div>
                </div>

                <div className="clinical-notes-box">
                  <h5>Clinical Caregiver Notes:</h5>
                  <p>{selectedLog.notes}</p>
                </div>
              </div>

              <div className="health-v2-modal-actions">
                <button className="health-v2-modal-close-btn" onClick={() => setSelectedLog(null)}>
                  Close Log
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
