import React, { useState } from 'react';
import { Search, Activity, Heart, Thermometer, User, Clock, ChevronDown, ChevronUp, FileText, Filter } from 'lucide-react';
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
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedRowId, setExpandedRowId] = useState(null);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.parentName.toLowerCase().includes(search.toLowerCase()) || 
                          l.caregiver.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.condition === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <AdminLayoutV2 title="System Health Logs">
      <div className="health-v2-container">
        
        {/* Header Controls */}
        <div className="health-v2-controls">
          <div className="health-v2-search-input">
            <Search size={18} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search health logs by elder name or caregiver..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div className="health-v2-filter-input">
            <Filter size={18} color="#64748B" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Stable">Stable</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="health-v2-table-container">
          <table className="health-v2-table">
            <thead>
              <tr>
                <th>Resident</th>
                <th>Caregiver</th>
                <th>Date & Time</th>
                <th>Vitals (BP | HR | Temp)</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="health-v2-empty">No health logs found.</div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(l => (
                  <React.Fragment key={l.id}>
                    <tr 
                      className={`health-v2-row ${expandedRowId === l.id ? 'expanded' : ''}`}
                      onClick={() => toggleRow(l.id)}
                    >
                      <td>
                        <div className="log-elder-profile">
                          <div className="log-avatar">
                            {l.parentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-semibold text-slate-800">{l.parentName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="log-caregiver">
                          <User size={14} color="#64748B" />
                          <span>{l.caregiver}</span>
                        </div>
                      </td>
                      <td>
                        <div className="log-time">
                          <Clock size={14} color="#64748B" />
                          <span>{l.date}</span>
                        </div>
                      </td>
                      <td>
                        <div className="log-vitals-mini">
                          <span title="Blood Pressure">{l.bp}</span>
                          <span className="sep">|</span>
                          <span title="Heart Rate" className={l.hr > 100 ? 'text-red-500 font-bold' : ''}>{l.hr}</span>
                          <span className="sep">|</span>
                          <span title="Temperature" className={l.temp > 99 ? 'text-orange-500 font-bold' : ''}>{l.temp}°</span>
                        </div>
                      </td>
                      <td>
                        <span className={`log-severity status-${l.condition.toLowerCase().replace(' ', '-')}`}>
                          {l.condition}
                        </span>
                      </td>
                      <td>
                        <button className="expand-btn">
                          {expandedRowId === l.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {expandedRowId === l.id && (
                      <tr className="health-v2-expanded-row">
                        <td colSpan="6">
                          <div className="expanded-content">
                            <div className="expanded-grid">
                              <div className="expanded-section">
                                <h5><Activity size={16}/> Detailed Vitals</h5>
                                <div className="v2-vitals-grid">
                                  <div className="vital-box">
                                    <span className="label">Blood Pressure</span>
                                    <span className="value">{l.bp}</span>
                                  </div>
                                  <div className="vital-box">
                                    <span className="label">Heart Rate</span>
                                    <span className="value">{l.hr} bpm</span>
                                  </div>
                                  <div className="vital-box">
                                    <span className="label">Temperature</span>
                                    <span className="value">{l.temp} °F</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="expanded-section">
                                <h5><FileText size={16}/> Observation Details</h5>
                                <div className="detailed-info-list">
                                  <div className="info-item">
                                    <span className="label">Meal Consumption:</span>
                                    <span className="value">{l.meal}</span>
                                  </div>
                                  <div className="info-item">
                                    <span className="label">Mood/Behavior:</span>
                                    <span className="value">{l.mood}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="expanded-section col-span-2">
                                <h5>Clinical Notes</h5>
                                <div className="clinical-notes-box">
                                  <p>{l.notes}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayoutV2>
  );
};

export default AdminHealthLogsV2;
