import React, { useState } from 'react';
import { Search, Heart, User, Phone, Eye, ClipboardList, X, Activity, Thermometer, Info } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import './ElderManagementV2.css';

const initialElders = [
  { id: 1, name: 'Eleanor Vance', age: 82, room: '402', status: 'stable', caregiver: 'Ravi Kumar', contact: 'Alice Vance (Daughter)', phone: '+1 555-0199', conditions: 'Hypertension, Type 2 DM' },
  { id: 2, name: 'Robert Sterling', age: 78, room: '215', status: 'stable', caregiver: 'Ravi Kumar', contact: 'John Sterling (Son)', phone: '+1 555-0144', conditions: 'Post-Stroke Recovery' },
  { id: 3, name: 'Clara Oswald', age: 74, room: '318', status: 'needs-attention', caregiver: 'Clara Oswald', contact: 'Danny Pink (Spouse)', phone: '+1 555-0182', conditions: 'Type 2 Diabetes' },
  { id: 4, name: 'Arthur Jenkins', age: 80, room: '101', status: 'critical', caregiver: 'Unassigned', contact: 'Marta Jenkins (Sibling)', phone: '+1 555-0155', conditions: 'Congestive Heart Failure' }
];

const caregiversList = ['Ravi Kumar', 'Clara Oswald', 'Arthur Jenkins', 'Unassigned'];

const ElderManagementV2 = () => {
  const [elders, setElders] = useState(initialElders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedElder, setSelectedElder] = useState(null);

  const handleAssignCaregiver = (id, caregiverName) => {
    setElders(elders.map(e => {
      if (e.id === id) {
        return { ...e, caregiver: caregiverName };
      }
      return e;
    }));
  };

  const filteredElders = elders.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                          e.conditions.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayoutV2 title="Elder Management">
      <div className="elder-v2-container">
        
        {/* Header Section */}
        <div className="elder-v2-header">
          <div className="elder-v2-title">
            <h2>Elder Resident Directory</h2>
            <p>Manage resident assignments, monitor real-time health statuses, and review medical charts.</p>
          </div>
          
          <div className="elder-v2-header-actions">
            <div className="elder-v2-search">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by name or condition..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <select 
              className="elder-v2-filter-select"
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

        {/* Elders Grid Layout */}
        <div className="elder-v2-grid">
          {filteredElders.length === 0 ? (
            <div className="elder-v2-empty">
              <Info size={48} />
              <p>No elder profiles match your search criteria.</p>
            </div>
          ) : (
            filteredElders.map(e => (
              <div key={e.id} className={`elder-v2-card status-${e.status}`}>
                <div className="elder-v2-card-glow"></div>
                
                <div className="elder-v2-card-header">
                  <div className="elder-v2-avatar-name">
                    <div className="elder-v2-avatar">
                      {e.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4>{e.name}</h4>
                      <p className="elder-v2-meta">Age: {e.age} <span className="dot">•</span> Room {e.room}</p>
                    </div>
                  </div>
                  <span className={`elder-v2-status-pill status-${e.status}`}>
                    {e.status === 'needs-attention' ? 'Attention' : e.status}
                  </span>
                </div>

                <div className="elder-v2-medical-conditions">
                  <div className="conditions-header">
                    <Activity size={14} /> 
                    <h5>Diagnosed Conditions</h5>
                  </div>
                  <p>{e.conditions}</p>
                </div>

                <div className="elder-v2-assignment-row">
                  <span className="label">Assigned Caregiver</span>
                  <div className="select-wrapper">
                    <select 
                      value={e.caregiver} 
                      onChange={eOpt => handleAssignCaregiver(e.id, eOpt.target.value)}
                      className={`caregiver-select ${e.caregiver === 'Unassigned' ? 'unassigned' : ''}`}
                    >
                      {caregiversList.map(cg => (
                        <option key={cg} value={cg}>{cg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="elder-v2-contact-section">
                  <div className="contact-info">
                    <User size={14} />
                    <span>{e.contact}</span>
                  </div>
                  <div className="contact-info">
                    <Phone size={14} />
                    <a href={`tel:${e.phone}`}>{e.phone}</a>
                  </div>
                </div>

                <div className="elder-v2-card-footer">
                  <button className="view-log-btn" onClick={() => setSelectedElder(e)}>
                    <ClipboardList size={16} />
                    View Health Record
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Health Record Details Modal */}
        {selectedElder && (
          <div className="elder-v2-modal-overlay" onClick={() => setSelectedElder(null)}>
            <div className="elder-v2-modal" onClick={e => e.stopPropagation()}>
              <button className="elder-v2-modal-close" onClick={() => setSelectedElder(null)}>
                <X size={20} />
              </button>

              <div className="elder-v2-modal-header">
                <div className="elder-v2-modal-icon">
                  <Heart size={28} color="white" />
                </div>
                <div>
                  <h2 className="elder-v2-modal-title">{selectedElder.name}</h2>
                  <p className="elder-v2-modal-desc">Medical Chart &nbsp;•&nbsp; Room {selectedElder.room}</p>
                </div>
              </div>

              <div className="elder-v2-modal-body">
                <div className="chart-stat">
                  <span className="label">Care Severity</span>
                  <span className={`value-pill status-${selectedElder.status}`}>{selectedElder.status.toUpperCase()}</span>
                </div>
                <div className="chart-stat">
                  <span className="label">Assigned Caregiver</span>
                  <span className="value font-bold text-teal">{selectedElder.caregiver}</span>
                </div>
                <div className="chart-stat">
                  <span className="label">Diagnosed Conditions</span>
                  <span className="value">{selectedElder.conditions}</span>
                </div>
                <div className="chart-stat">
                  <span className="label">Allergies</span>
                  <span className="value text-coral">None Reported</span>
                </div>
                <div className="chart-stat">
                  <span className="label">Emergency Contact</span>
                  <div className="value-contact">
                    <span>{selectedElder.contact}</span>
                    <span className="font-mono">{selectedElder.phone}</span>
                  </div>
                </div>
              </div>

              <div className="elder-v2-modal-actions">
                <button className="elder-v2-modal-close-btn" onClick={() => setSelectedElder(null)}>
                  Close Chart
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayoutV2>
  );
};

export default ElderManagementV2;
