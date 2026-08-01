import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, User, HeartPulse, ShieldAlert, Phone, MapPin, 
  UserSearch, Sparkles, Heart, Activity, Thermometer, Trash2, Edit2, X, MessageSquare, UserCheck,
  Clock, AlertTriangle, CheckCircle2
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './Parents.css';

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editingParent, setEditingParent] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchParents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/parents');
      setParents(data || []);
    } catch (err) {
      console.error('Error fetching parents:', err);
      setError('Could not retrieve parents list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCaregivers = async () => {
    try {
      const { data } = await api.get('/caregivers');
      if (Array.isArray(data) && data.length > 0) {
        setCaregivers(data);
        return;
      }
    } catch (e) {
      console.warn('Fallback to public caregivers in Parents:', e);
    }
    try {
      const { data } = await api.get('/caregivers/public');
      if (Array.isArray(data)) {
        setCaregivers(data);
      }
    } catch (e) {
      console.error('Error fetching public caregivers:', e);
    }
  };

  useEffect(() => {
    fetchParents();
    fetchCaregivers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this parent? This action cannot be undone.')) return;
    try {
      await api.delete('/parents/' + id);
      setParents(parents.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting parent:', err);
      setError('Failed to delete parent.');
    }
  };

  const startEdit = (parent) => {
    setEditingParent(parent.id);
    setEditForm({
      name: parent.name || '',
      age: parent.age || '',
      gender: parent.gender || '',
      relationship: parent.relationship || '',
      phone: parent.phone || '',
      address: parent.address || '',
      medical_conditions: parent.medical_conditions || '',
      allergies: parent.allergies || '',
      current_medications: parent.current_medications || '',
      assigned_caregiver_id: parent.assigned_caregiver_id ? String(parent.assigned_caregiver_id) : ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/parents/' + editingParent, {
        ...editForm,
        assigned_caregiver_id: editForm.assigned_caregiver_id ? parseInt(editForm.assigned_caregiver_id, 10) : null
      });
      setEditingParent(null);
      await fetchParents();
    } catch (err) {
      console.error('Error updating parent:', err);
      setError('Failed to update parent profile.');
    }
  };

  return (
    <ChildLayout title="My Parents">
      <div className="pm-container">
        
        <div className="pm-header-row">
          <div className="pm-header-left">
            <p className="pm-subtitle">Manage profiles and view real-time status of your loved ones.</p>
          </div>
          <Link to="/add-parent" className="pm-add-btn">
            <Plus size={16} /> Add Parent
          </Link>
        </div>

        {error && (
          <div className="pm-error-banner">
            <span>✕</span> {error}
            <button onClick={() => setError('')} style={{background:'none',border:'none',color:'white',float:'right',cursor:'pointer'}}>Close</button>
          </div>
        )}

        {loading ? (
          <div className="pm-loading-state">
            <div className="pm-spinner"></div>
            <p>Loading parent profiles...</p>
          </div>
        ) : parents.length === 0 ? (
          <div className="pm-empty-state">
            <div className="pm-empty-icon-wrap">
              <User size={48} className="pm-empty-icon" />
            </div>
            <h3>No Parents Registered</h3>
            <p>You haven't added any family members to your account yet. Let's create your first profile to start tracking their vitals and schedule.</p>
            <Link to="/add-parent" className="pm-empty-action-btn">
              <Plus size={16} /> Add Your First Parent
            </Link>
          </div>
        ) : (
          <div className="pm-grid">
            {parents.map(parent => {
              const seed = parent.name || 'avatar';
              return (
                <div key={parent.id} className="pm-card" style={{ position: 'relative' }}>
                  
                  {/* Edit/Delete Actions */}
                  <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => startEdit(parent)} style={{ background: 'rgba(13,148,136,0.1)', color: 'var(--color-primary)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title="Edit Profile">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(parent.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title="Delete Profile">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="pm-card-top">
                    <img 
                      src={"https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(seed)} 
                      alt={parent.name} 
                      className="pm-avatar"
                    />
                    <div className="pm-name-section">
                      <h3 className="pm-name">{parent.name}</h3>
                      <p className="pm-relationship">
                        {parent.relationship ? parent.relationship : 'Family Member'}
                        {parent.age ? ' • ' + parent.age + ' yrs old' : ''}
                      </p>
                    </div>
                    <span className="pm-status-badge good" style={{ marginTop: '30px' }}>ACTIVE</span>
                  </div>

                  <div className="pm-card-section">
                    <div className="pm-info-row">
                      <Phone size={14} className="pm-info-icon" />
                      <span>{parent.phone || 'No phone number added'}</span>
                    </div>
                    <div className="pm-info-row">
                      <MapPin size={14} className="pm-info-icon" />
                      <span className="pm-address-text">{parent.address || 'No address added'}</span>
                    </div>
                  </div>

                  <div className="pm-card-section bg-light">
                    <h4 className="pm-section-title">
                      <HeartPulse size={14} className="pm-section-icon teal" />
                      Medical Profile
                    </h4>
                    <div className="pm-medical-grid">
                      <div className="pm-med-col">
                        <span className="pm-med-lbl">CONDITIONS</span>
                        <p className="pm-med-val">{parent.medical_conditions || 'None listed'}</p>
                      </div>
                      <div className="pm-med-col">
                        <span className="pm-med-lbl">ALLERGIES</span>
                        <p className="pm-med-val text-red">{parent.allergies || 'None listed'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pm-card-section">
                    <div className="pm-split-row">
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span className="pm-med-lbl">ASSIGNED CAREGIVER</span>
                          {parent.assigned_caregiver_id && (
                            parent.assignment_status === 'pending' ? (
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={11} /> Request Pending
                              </span>
                            ) : parent.assignment_status === 'rejected' ? (
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b91c1c', background: '#fee2e2', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle size={11} /> Request Declined
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle2 size={11} /> Active
                              </span>
                            )
                          )}
                        </div>

                        {parent.caregiver_name ? (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                              <div>
                                <p className="pm-caregiver-name" style={{ margin: 0, fontWeight: '600', color: 'var(--color-primary)' }}>
                                  {parent.caregiver_name}
                                </p>
                                {parent.caregiver_specialization && (
                                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{parent.caregiver_specialization}</span>
                                )}
                              </div>
                              <button 
                                onClick={() => startEdit(parent)}
                                style={{ fontSize: '0.75rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                              >
                                Change
                              </button>
                            </div>

                            {parent.assignment_status === 'rejected' && (
                              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '8px 10px', borderRadius: '6px', marginTop: '8px', fontSize: '0.78rem', color: '#9f1239' }}>
                                <strong>Decline Reason:</strong> {parent.rejection_reason || 'Caregiver at maximum capacity.'}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                            <span className="pm-unassigned">None Assigned</span>
                            <button 
                              onClick={() => startEdit(parent)}
                              style={{ fontSize: '0.8rem', color: 'var(--color-primary)', background: 'rgba(13,148,136,0.1)', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Plus size={12} /> Assign Caregiver
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pm-card-actions" style={{ display: 'flex', gap: '8px' }}>
                    <Link to={"/health-feed?parent_id=" + parent.id} className="pm-card-btn primary" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <Activity size={14} /> Health Feed
                    </Link>
                    {parent.caregiver_user_id ? (
                      <Link 
                        to={`/messages?recipient=${parent.caregiver_user_id}&regardingName=${encodeURIComponent(parent.name)}`} 
                        className="pm-card-btn primary" 
                        style={{ flex: 1, background: '#0ea5e9', display: 'flex', justifyContent: 'center' }}
                        title={`Chat with ${parent.caregiver_name}`}
                      >
                        <MessageSquare size={14} style={{ marginRight: '6px' }} /> Chat with Caregiver
                      </Link>
                    ) : (
                      <Link 
                        to="/caregivers-list" 
                        className="pm-card-btn secondary" 
                        style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                      >
                        <UserCheck size={14} style={{ marginRight: '6px' }} /> Browse Caregivers
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Modal with Caregiver Assignment */}
        {editingParent && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: 'var(--color-text-main)' }}>Edit Parent Profile</h3>
                <button onClick={() => setEditingParent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#4b5563', fontWeight: '500' }}>Name</label>
                  <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} required />
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#4b5563', fontWeight: '500' }}>Age</label>
                    <input type="number" value={editForm.age || ''} onChange={e => setEditForm({...editForm, age: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#4b5563', fontWeight: '500' }}>Relationship</label>
                    <input type="text" value={editForm.relationship || ''} onChange={e => setEditForm({...editForm, relationship: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} placeholder="Mother, Father, etc." />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#4b5563', fontWeight: '500' }}>Phone</label>
                  <input type="text" value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#4b5563', fontWeight: '500' }}>Address</label>
                  <input type="text" value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                </div>

                {/* Caregiver Selection */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--color-primary)', fontWeight: '600' }}>
                    Assigned Caregiver
                  </label>
                  <select 
                    value={editForm.assigned_caregiver_id || ''} 
                    onChange={e => setEditForm({...editForm, assigned_caregiver_id: e.target.value})}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white' }}
                  >
                    <option value="">-- No Caregiver Assigned --</option>
                    {caregivers.map(cg => (
                      <option key={cg.id} value={cg.id}>
                        {cg.name} {cg.specialization ? `(${cg.specialization})` : ''} {cg.hourly_rate ? `- $${cg.hourly_rate}/hr` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#4b5563', fontWeight: '500' }}>Medical Conditions</label>
                  <textarea rows="2" value={editForm.medical_conditions || ''} onChange={e => setEditForm({...editForm, medical_conditions: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#4b5563', fontWeight: '500' }}>Allergies</label>
                  <input type="text" value={editForm.allergies || ''} onChange={e => setEditForm({...editForm, allergies: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setEditingParent(null)} style={{ padding: '8px 16px', border: '1px solid #d1d5db', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '8px 16px', border: 'none', background: 'var(--color-primary)', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </ChildLayout>
  );
};

export default Parents;
