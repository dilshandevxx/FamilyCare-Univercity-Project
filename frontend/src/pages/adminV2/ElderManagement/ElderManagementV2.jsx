import React, { useState, useEffect, useCallback } from 'react';
import { Search, Heart, User, Phone, Eye, ClipboardList, X, Activity, Thermometer, Info, Plus, Loader2, UserPlus } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import api from '../../../services/api';
import './ElderManagementV2.css';

const ElderManagementV2 = () => {
  const [elders, setElders] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedElder, setSelectedElder] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '', age: '', room_number: '', medical_conditions: '', care_status: 'STABLE', assigned_caregiver_id: ''
  });
  const [adding, setAdding] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: res }, { data: cgs }] = await Promise.all([
        api.get('/admin/residents'),
        api.get('/admin/caregivers')
      ]);
      setElders(res.map(r => {
        let mappedStatus = 'stable';
        if (r.care_status === 'NEEDS ATTENTION') mappedStatus = 'needs-attention';
        else if (r.care_status === 'CRITICAL') mappedStatus = 'critical';

        return {
          id: r.id,
          name: r.name,
          age: r.age || '—',
          room: r.room_number || 'N/A',
          status: mappedStatus,
          caregiver: r.caregiver_name || 'Unassigned',
          caregiver_id: r.caregiver_id,
          contact: 'Family Contact (N/A)',
          phone: 'N/A',
          conditions: r.medical_conditions || 'None reported'
        };
      }));
      setCaregivers(cgs);
    } catch (err) {
      console.error('Failed to load elders/caregivers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssignCaregiver = async (residentId, caregiverId) => {
    try {
      await api.put(`/admin/residents/${residentId}/assign`, {
        caregiver_id: caregiverId ? Number(caregiverId) : null,
      });
      fetchData();
    } catch (err) {
      alert('Failed to assign caregiver.');
    }
  };

  const handleAddResident = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    setAdding(true);
    try {
      await api.post('/admin/residents', {
        ...addForm,
        age: addForm.age ? Number(addForm.age) : null,
        assigned_caregiver_id: addForm.assigned_caregiver_id ? Number(addForm.assigned_caregiver_id) : null
      });
      setShowAddModal(false);
      setAddForm({ name: '', age: '', room_number: '', medical_conditions: '', care_status: 'STABLE', assigned_caregiver_id: '' });
      fetchData();
    } catch (err) {
      alert('Failed to add resident.');
    } finally {
      setAdding(false);
    }
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

            <button 
              className="user-v2-add-btn" 
              onClick={() => setShowAddModal(true)}
              style={{ marginLeft: '10px' }}
            >
              <Plus size={16} /> Add Resident
            </button>
          </div>
        </div>

        {/* Elders Grid Layout */}
        <div className="elder-v2-grid">
          {loading ? (
             <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
               <Loader2 className="animate-spin" size={32} color="#00A896" />
             </div>
          ) : filteredElders.length === 0 ? (
            <div className="elder-v2-empty" style={{ gridColumn: '1 / -1' }}>
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
                      {e.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
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
                      value={e.caregiver_id || ''} 
                      onChange={eOpt => handleAssignCaregiver(e.id, eOpt.target.value)}
                      className={`caregiver-select ${e.caregiver === 'Unassigned' ? 'unassigned' : ''}`}
                    >
                      <option value="">Unassigned</option>
                      {caregivers.map(cg => (
                        <option key={cg.id} value={cg.id}>{cg.name || cg.user_name}</option>
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
            <div className="elder-v2-modal" onClick={evt => evt.stopPropagation()}>
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

        {/* Add Resident Modal */}
        {showAddModal && (
          <div className="elder-v2-modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="elder-v2-modal" onClick={evt => evt.stopPropagation()} style={{ maxWidth: '500px' }}>
              <button className="elder-v2-modal-close" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>

              <form onSubmit={handleAddResident}>
                <div className="elder-v2-modal-header" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                  <div className="elder-v2-modal-icon">
                    <UserPlus size={28} color="white" />
                  </div>
                  <div>
                    <h2 className="elder-v2-modal-title">Add New Resident</h2>
                    <p className="elder-v2-modal-desc">Register a new elder to the system.</p>
                  </div>
                </div>

                <div className="elder-v2-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Full Name *</label>
                    <input 
                      type="text" required
                      value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Age</label>
                      <input 
                        type="number" 
                        value={addForm.age} onChange={e => setAddForm({...addForm, age: e.target.value})}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Room Number</label>
                      <input 
                        type="text" 
                        value={addForm.room_number} onChange={e => setAddForm({...addForm, room_number: e.target.value})}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Medical Conditions</label>
                    <input 
                      type="text" placeholder="e.g. Hypertension, Type 2 Diabetes"
                      value={addForm.medical_conditions} onChange={e => setAddForm({...addForm, medical_conditions: e.target.value})}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Care Status</label>
                    <select 
                      value={addForm.care_status} onChange={e => setAddForm({...addForm, care_status: e.target.value})}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}
                    >
                      <option value="STABLE">Stable</option>
                      <option value="NEEDS ATTENTION">Needs Attention</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Assign Caregiver</label>
                    <select 
                      value={addForm.assigned_caregiver_id} onChange={e => setAddForm({...addForm, assigned_caregiver_id: e.target.value})}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}
                    >
                      <option value="">— Unassigned —</option>
                      {caregivers.map(cg => (
                        <option key={cg.id} value={cg.id}>{cg.name || cg.user_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="elder-v2-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '20px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 20px', borderRadius: '10px', background: 'white', border: '1px solid #E2E8F0', fontWeight: 'bold' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={adding} style={{ padding: '10px 20px', borderRadius: '10px', background: '#D97706', color: 'white', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {adding ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} 
                    Add Resident
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayoutV2>
  );
};

export default ElderManagementV2;
