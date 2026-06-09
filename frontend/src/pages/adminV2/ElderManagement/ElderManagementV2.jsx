import React, { useState } from 'react';
import { Search, Heart, User, ShieldAlert, Phone, Eye, Clipboard, X } from 'lucide-react';
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
        
        {/* Actions Bar */}
        <div className="elder-v2-header-actions">
          <div className="elder-v2-search-group">
            <div className="elder-v2-search-input">
              <Search size={18} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search elder by name or medical conditions..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="elder-v2-filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Conditions</option>
              <option value="stable">Stable</option>
              <option value="needs-attention">Needs Attention</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Elders Grid Layout */}
        <div className="elder-v2-grid">
          {filteredElders.length === 0 ? (
            <div className="elder-v2-empty">No elder profiles found.</div>
          ) : (
            filteredElders.map(e => (
              <div key={e.id} className={`elder-v2-card status-${e.status}`}>
                <div className="elder-v2-card-header">
                  <div className="elder-v2-avatar-name">
                    <div className="elder-v2-avatar">
                      {e.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4>{e.name}</h4>
                      <p className="elder-v2-meta">Age: {e.age} &nbsp;·&nbsp; Room {e.room}</p>
                    </div>
                  </div>
                  <span className={`elder-v2-status-pill status-${e.status}`}>
                    {e.status.replace('-', ' ')}
                  </span>
                </div>

                <div className="elder-v2-medical-conditions">
                  <h5>Medical Conditions:</h5>
                  <p>{e.conditions}</p>
                </div>

                <div className="elder-v2-assignment-row">
                  <span className="label">Assigned Caregiver:</span>
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

                <div className="elder-v2-contact-section">
                  <div className="contact-info">
                    <User size={13} />
                    <span>{e.contact}</span>
                  </div>
                  <div className="contact-info">
                    <Phone size={13} />
                    <a href={`tel:${e.phone}`}>{e.phone}</a>
                  </div>
                </div>

                <div className="elder-v2-card-footer">
                  <button className="view-log-btn" onClick={() => setSelectedElder(e)}>
                    <Clipboard size={14} />
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
                <X size={18} />
              </button>

              <div className="elder-v2-modal-header">
                <div className="elder-v2-modal-icon">
                  <Heart size={24} color="#00A896" />
                </div>
                <div>
                  <h2 className="elder-v2-modal-title">{selectedElder.name} &mdash; Medical Chart</h2>
                  <p className="elder-v2-modal-desc">Age: {selectedElder.age} &nbsp;·&nbsp; Room {selectedElder.room}</p>
                </div>
              </div>

              <div className="elder-v2-modal-chart">
                <div className="chart-stat">
                  <span className="label">Care Severity</span>
                  <span className={`value-pill status-${selectedElder.status}`}>{selectedElder.status.toUpperCase()}</span>
                </div>
                <div className="chart-stat">
                  <span className="label">Assigned Caregiver</span>
                  <span className="value">{selectedElder.caregiver}</span>
                </div>
                <div className="chart-stat">
                  <span className="label">Diagnosed Conditions</span>
                  <span className="value text-dark font-medium">{selectedElder.conditions}</span>
                </div>
                <div className="chart-stat">
                  <span className="label">Allergies</span>
                  <span className="value text-coral">None Reported</span>
                </div>
                <div className="chart-stat">
                  <span className="label">Emergency Contact</span>
                  <span className="value">{selectedElder.contact} ({selectedElder.phone})</span>
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
