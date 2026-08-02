import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, User, HeartPulse, Phone, MapPin,
  Trash2, Edit2, X, MessageSquare, UserCheck,
  Clock, AlertTriangle, CheckCircle2, Shield,
  Search, Pill, Stethoscope, Heart, Activity,
  PhoneCall, ChevronRight, UserPlus, Filter,
  Sparkles, Check, MoreVertical
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './Parents.css';

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'assigned' | 'unassigned' | 'pending'

  // Modal edit states
  const [editingParent, setEditingParent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/parents');
      setParents(data || []);
    } catch (err) {
      console.error('Error fetching parents:', err);
      setError('Could not retrieve parent profiles. Please try again.');
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

  const handleDelete = async (id, parentName) => {
    if (!window.confirm(`Are you sure you want to remove ${parentName || 'this parent'}? This action cannot be undone.`)) return;
    try {
      await api.delete('/parents/' + id);
      setParents(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting parent:', err);
      setError('Failed to delete parent profile.');
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
      emergency_contact_name: parent.emergency_contact_name || '',
      emergency_contact_phone: parent.emergency_contact_phone || '',
      medical_conditions: parent.medical_conditions || '',
      allergies: parent.allergies || '',
      current_medications: parent.current_medications || '',
      assigned_caregiver_id: parent.assigned_caregiver_id ? String(parent.assigned_caregiver_id) : ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  // Filter & Search Logic
  const filteredParents = useMemo(() => {
    return parents.filter(p => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.relationship?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medical_conditions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.caregiver_name?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'assigned') return !!p.assigned_caregiver_id && p.assignment_status === 'approved';
      if (statusFilter === 'pending') return p.assignment_status === 'pending';
      if (statusFilter === 'unassigned') return !p.assigned_caregiver_id || p.assignment_status === 'rejected';

      return true;
    });
  }, [parents, searchTerm, statusFilter]);

  const totalAssigned = parents.filter(p => p.assigned_caregiver_id && p.assignment_status === 'approved').length;

  return (
    <ChildLayout title="My Parents">
      <div className="pc-page-wrapper">

        {/* ── Top Header Hero Section ──────────────────────────────── */}
        <div className="pc-header-hero">
          <div className="pc-hero-content">
            <div className="pc-hero-badge">
              <Sparkles size={13} className="pc-sparkle-icon" />
              <span>Family Wellness & Care Hub</span>
            </div>
            <h1 className="pc-hero-heading">My Parents & Loved Ones</h1>
            <p className="pc-hero-subheading">
              Monitor vital signs, daily care schedules, medications, and assigned certified caregivers in real-time.
            </p>
          </div>

          <div className="pc-hero-actions">
            <div className="pc-stats-pill-group">
              <div className="pc-stat-pill">
                <span className="pc-stat-pill-value">{parents.length}</span>
                <span className="pc-stat-pill-label">Total Parents</span>
              </div>
              <div className="pc-stat-pill active">
                <span className="pc-stat-pill-value">{totalAssigned}</span>
                <span className="pc-stat-pill-label">In Active Care</span>
              </div>
            </div>
            <Link to="/add-parent" className="pc-btn-add-parent">
              <Plus size={18} strokeWidth={2.5} />
              <span>Add New Parent</span>
            </Link>
          </div>
        </div>

        {/* ── Search & Filter Controls ─────────────────────────────── */}
        <div className="pc-control-bar">
          <div className="pc-search-box">
            <Search size={17} className="pc-search-icon" />
            <input
              type="text"
              placeholder="Search by name, condition, relationship, or caregiver..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pc-search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="pc-clear-search">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="pc-tab-filters">
            <button
              className={`pc-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Profiles ({parents.length})
            </button>
            <button
              className={`pc-tab-btn ${statusFilter === 'assigned' ? 'active' : ''}`}
              onClick={() => setStatusFilter('assigned')}
            >
              Active Care ({totalAssigned})
            </button>
            <button
              className={`pc-tab-btn ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending ({parents.filter(p => p.assignment_status === 'pending').length})
            </button>
            <button
              className={`pc-tab-btn ${statusFilter === 'unassigned' ? 'active' : ''}`}
              onClick={() => setStatusFilter('unassigned')}
            >
              Unassigned ({parents.filter(p => !p.assigned_caregiver_id).length})
            </button>
          </div>
        </div>

        {/* ── Error Banner ─────────────────────────────────────────── */}
        {error && (
          <div className="pc-alert-banner">
            <AlertTriangle size={17} />
            <span>{error}</span>
            <button onClick={() => setError('')} className="pc-alert-dismiss"><X size={14} /></button>
          </div>
        )}

        {/* ── Grid of Parents Cards ────────────────────────────────── */}
        {loading ? (
          <div className="pc-loading-container">
            <div className="pc-spinner-ring"></div>
            <p className="pc-loading-text">Loading parent profiles...</p>
          </div>
        ) : parents.length === 0 ? (
          <div className="pc-empty-state-card">
            <div className="pc-empty-icon-circle">
              <UserPlus size={44} strokeWidth={1.8} />
            </div>
            <h3 className="pc-empty-title">No Family Profiles Yet</h3>
            <p className="pc-empty-subtitle">
              Add your parents to track their daily vitals, assign professional nurses, and receive automated health alerts.
            </p>
            <Link to="/add-parent" className="pc-empty-cta-btn">
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Your First Parent</span>
            </Link>
          </div>
        ) : filteredParents.length === 0 ? (
          <div className="pc-empty-filter-state">
            <Search size={32} className="pc-empty-filter-icon" />
            <h4>No matching parent profiles found</h4>
            <p>Try refining your search keyword or selecting a different status filter tab.</p>
            <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="pc-reset-filters-btn">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="pc-cards-grid">
            {filteredParents.map(parent => {
              const seed = parent.name || 'avatar';
              const hasCaregiver = !!parent.assigned_caregiver_id;
              const isPending = parent.assignment_status === 'pending';
              const isRejected = parent.assignment_status === 'rejected';
              const isApproved = hasCaregiver && !isPending && !isRejected;

              return (
                <div key={parent.id} className="pc-parent-card">

                  {/* 1. Header Banner & Identity */}
                  <div className="pc-card-header">
                    <div className="pc-avatar-container">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`}
                        alt={parent.name}
                        className="pc-avatar-img"
                      />
                      <span className={`pc-avatar-status-dot ${isApproved ? 'active' : isPending ? 'pending' : 'neutral'}`} />
                    </div>

                    <div className="pc-identity-info">
                      <div className="pc-identity-name-row">
                        <h3 className="pc-parent-name">{parent.name}</h3>
                        <div className="pc-card-tool-actions">
                          <button
                            onClick={() => startEdit(parent)}
                            className="pc-tool-btn edit"
                            title="Edit Parent Profile"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(parent.id, parent.name)}
                            className="pc-tool-btn delete"
                            title="Delete Profile"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="pc-badge-chips-row">
                        <span className="pc-chip relationship">
                          {parent.relationship || 'Family Member'}
                        </span>
                        {parent.age && (
                          <span className="pc-chip age">
                            {parent.age} yrs old
                          </span>
                        )}
                        {parent.gender && (
                          <span className="pc-chip gender">
                            {parent.gender}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Contact & Location Quick Strip */}
                  <div className="pc-contact-strip">
                    <div className="pc-contact-pill">
                      <Phone size={12} className="pc-pill-icon" />
                      {parent.phone ? (
                        <a href={`tel:${parent.phone}`} className="pc-phone-link">
                          {parent.phone}
                        </a>
                      ) : (
                        <span className="pc-muted-text">No phone added</span>
                      )}
                    </div>

                    <div className="pc-contact-pill" title={parent.address || 'No address'}>
                      <MapPin size={12} className="pc-pill-icon" />
                      <span className="pc-address-truncate">
                        {parent.address || 'No residential address'}
                      </span>
                    </div>
                  </div>

                  {/* 3. Assigned Caregiver Section */}
                  <div className="pc-caregiver-section">
                    <div className="pc-section-header">
                      <span className="pc-sec-title">DEDICATED CAREGIVER</span>
                      {isApproved && (
                        <span className="pc-status-badge approved">
                          <CheckCircle2 size={11} /> Active In-Care
                        </span>
                      )}
                      {isPending && (
                        <span className="pc-status-badge pending">
                          <Clock size={11} /> Request Pending
                        </span>
                      )}
                      {isRejected && (
                        <span className="pc-status-badge rejected">
                          <AlertTriangle size={11} /> Declined
                        </span>
                      )}
                      {!hasCaregiver && (
                        <span className="pc-status-badge unassigned">
                          Unassigned
                        </span>
                      )}
                    </div>

                    {parent.caregiver_name ? (
                      <div className="pc-caregiver-box">
                        <div className="pc-cg-avatar-wrapper">
                          <img
                            src={parent.caregiver_avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(parent.caregiver_name)}`}
                            alt={parent.caregiver_name}
                            className="pc-cg-avatar"
                          />
                        </div>
                        <div className="pc-cg-details">
                          <div className="pc-cg-name-row">
                            <span className="pc-cg-name">{parent.caregiver_name}</span>
                            <button
                              onClick={() => startEdit(parent)}
                              className="pc-cg-change-link"
                            >
                              Change
                            </button>
                          </div>
                          <span className="pc-cg-specialty">
                            {parent.caregiver_specialization || 'Certified Eldercare Specialist'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="pc-unassigned-box">
                        <div className="pc-unassigned-text">
                          <span>No caregiver assigned yet</span>
                        </div>
                        <button
                          onClick={() => startEdit(parent)}
                          className="pc-btn-assign-now"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                          <span>Assign</span>
                        </button>
                      </div>
                    )}

                    {isRejected && (
                      <div className="pc-rejection-note">
                        <strong>Reason:</strong> {parent.rejection_reason || 'Caregiver currently at maximum capacity.'}
                      </div>
                    )}
                  </div>

                  {/* 4. Clinical & Health Highlights */}
                  <div className="pc-medical-section">
                    <div className="pc-section-header">
                      <span className="pc-sec-title">
                        <HeartPulse size={12} className="pc-sec-title-icon" />
                        CLINICAL PROFILE
                      </span>
                    </div>

                    <div className="pc-medical-tags-container">
                      <div className="pc-med-field">
                        <span className="pc-med-label">CONDITIONS:</span>
                        <div className="pc-chips-flow">
                          {parent.medical_conditions ? (
                            parent.medical_conditions.split(',').map((cond, idx) => (
                              <span key={idx} className="pc-tag condition">
                                {cond.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="pc-tag neutral">None listed</span>
                          )}
                        </div>
                      </div>

                      <div className="pc-med-field">
                        <span className="pc-med-label">ALLERGIES:</span>
                        <div className="pc-chips-flow">
                          {parent.allergies ? (
                            parent.allergies.split(',').map((alg, idx) => (
                              <span key={idx} className="pc-tag allergy">
                                {alg.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="pc-tag neutral">None listed</span>
                          )}
                        </div>
                      </div>

                      {parent.current_medications && (
                        <div className="pc-meds-bar">
                          <Pill size={13} className="pc-meds-icon" />
                          <span className="pc-meds-content">
                            <strong>Meds:</strong> {parent.current_medications}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 5. Card Bottom Action Buttons */}
                  <div className="pc-card-footer">
                    <Link
                      to={`/health-feed?parent_id=${parent.id}`}
                      className="pc-action-btn primary"
                    >
                      <Activity size={14} />
                      <span>Health Feed</span>
                    </Link>

                    {parent.caregiver_user_id ? (
                      <Link
                        to={`/messages?recipient=${parent.caregiver_user_id}&regardingName=${encodeURIComponent(parent.name)}`}
                        className="pc-action-btn chat"
                        title={`Chat with ${parent.caregiver_name}`}
                      >
                        <MessageSquare size={14} />
                        <span>Chat Caregiver</span>
                      </Link>
                    ) : (
                      <Link
                        to="/caregivers-list"
                        className="pc-action-btn browse"
                        title="Browse Caregivers"
                      >
                        <UserCheck size={14} />
                        <span>Browse Carers</span>
                      </Link>
                    )}

                    <Link
                      to={`/analytics?parent_id=${parent.id}`}
                      className="pc-action-btn icon-only"
                      title="View Health Analytics"
                    >
                      <HeartPulse size={15} />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ── Edit Parent Profile Modal ─────────────────────────────── */}
        {editingParent && (
          <div className="pc-modal-backdrop">
            <div className="pc-modal-card">
              <div className="pc-modal-head">
                <div>
                  <h3 className="pc-modal-title">Edit Parent Profile</h3>
                  <p className="pc-modal-desc">Update personal information, medical background, or assigned caregiver</p>
                </div>
                <button
                  onClick={() => setEditingParent(null)}
                  className="pc-modal-btn-close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="pc-modal-form">
                
                {/* Step 1: Personal Info */}
                <div className="pc-form-section-title">Personal & Contact</div>
                
                <div className="pc-form-group">
                  <label>Full Legal Name *</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="pc-form-row three-col">
                  <div className="pc-form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      value={editForm.age || ''}
                      onChange={e => setEditForm({ ...editForm, age: e.target.value })}
                      placeholder="e.g. 72"
                    />
                  </div>
                  <div className="pc-form-group">
                    <label>Gender</label>
                    <select
                      value={editForm.gender || ''}
                      onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                    >
                      <option value="">Select Gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="pc-form-group">
                    <label>Relationship</label>
                    <input
                      type="text"
                      value={editForm.relationship || ''}
                      onChange={e => setEditForm({ ...editForm, relationship: e.target.value })}
                      placeholder="Mother, Father..."
                    />
                  </div>
                </div>

                <div className="pc-form-row two-col">
                  <div className="pc-form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={editForm.phone || ''}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="pc-form-group">
                    <label>Residential Address</label>
                    <input
                      type="text"
                      value={editForm.address || ''}
                      onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                      placeholder="Street address, city"
                    />
                  </div>
                </div>

                {/* Step 2: Caregiver Assignment */}
                <div className="pc-form-section-title">Caregiver Assignment</div>
                <div className="pc-form-group pc-caregiver-select-card">
                  <label>Assign Dedicated Caregiver</label>
                  <select
                    value={editForm.assigned_caregiver_id || ''}
                    onChange={e => setEditForm({ ...editForm, assigned_caregiver_id: e.target.value })}
                  >
                    <option value="">-- No Caregiver Assigned --</option>
                    {caregivers.map(cg => (
                      <option key={cg.id} value={cg.id}>
                        {cg.name} {cg.specialization ? `(${cg.specialization})` : ''} {cg.hourly_rate ? `• $${cg.hourly_rate}/hr` : ''}
                      </option>
                    ))}
                  </select>
                  <span className="pc-select-subtext">
                    Selecting a caregiver sends an instant notification request for their approval.
                  </span>
                </div>

                {/* Step 3: Medical Background */}
                <div className="pc-form-section-title">Clinical Profile</div>

                <div className="pc-form-group">
                  <label>Medical Conditions (Comma separated)</label>
                  <textarea
                    rows="2"
                    value={editForm.medical_conditions || ''}
                    onChange={e => setEditForm({ ...editForm, medical_conditions: e.target.value })}
                    placeholder="e.g. Hypertension, Diabetes, Arthritis"
                  />
                </div>

                <div className="pc-form-row two-col">
                  <div className="pc-form-group">
                    <label>Allergies</label>
                    <input
                      type="text"
                      value={editForm.allergies || ''}
                      onChange={e => setEditForm({ ...editForm, allergies: e.target.value })}
                      placeholder="e.g. Penicillin, Peanuts"
                    />
                  </div>
                  <div className="pc-form-group">
                    <label>Current Medications</label>
                    <input
                      type="text"
                      value={editForm.current_medications || ''}
                      onChange={e => setEditForm({ ...editForm, current_medications: e.target.value })}
                      placeholder="e.g. Metformin 500mg, Lisinopril"
                    />
                  </div>
                </div>

                <div className="pc-form-row two-col">
                  <div className="pc-form-group">
                    <label>Emergency Contact Name</label>
                    <input
                      type="text"
                      value={editForm.emergency_contact_name || ''}
                      onChange={e => setEditForm({ ...editForm, emergency_contact_name: e.target.value })}
                      placeholder="e.g. Dr. Robert Vance"
                    />
                  </div>
                  <div className="pc-form-group">
                    <label>Emergency Contact Phone</label>
                    <input
                      type="text"
                      value={editForm.emergency_contact_phone || ''}
                      onChange={e => setEditForm({ ...editForm, emergency_contact_phone: e.target.value })}
                      placeholder="+1 (555) 999-8888"
                    />
                  </div>
                </div>

                <div className="pc-modal-foot">
                  <button
                    type="button"
                    onClick={() => setEditingParent(null)}
                    className="pc-btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="pc-btn-modal-save"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
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
