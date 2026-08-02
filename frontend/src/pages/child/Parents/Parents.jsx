import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, User, HeartPulse, Phone, MapPin,
  Trash2, Edit2, X, MessageSquare, UserCheck,
  Clock, AlertTriangle, CheckCircle2, Shield,
  Search, Pill, Stethoscope, Heart, Activity,
  PhoneCall, ChevronRight, UserPlus, Filter
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
    <ChildLayout title="My Parents & Family">
      <div className="pm-wrap">

        {/* ── Top Hero Header ───────────────────────────────────────── */}
        <div className="pm-hero-bar">
          <div className="pm-hero-left">
            <h1 className="pm-hero-title">
              <span className="pm-hero-emoji">👨‍👩‍👧‍👦</span>
              My Parents & Family Members
            </h1>
            <p className="pm-hero-sub">
              Manage clinical profiles, care schedules, and direct caregiver connections
            </p>
          </div>

          <div className="pm-hero-stats">
            <div className="pm-stat-chip">
              <span className="pm-stat-chip-num">{parents.length}</span>
              <span className="pm-stat-chip-lbl">Registered</span>
            </div>
            <div className="pm-stat-chip active">
              <span className="pm-stat-chip-num">{totalAssigned}</span>
              <span className="pm-stat-chip-lbl">Active In-Care</span>
            </div>
            <Link to="/add-parent" className="pm-add-main-btn">
              <Plus size={16} /> Add Family Member
            </Link>
          </div>
        </div>

        {/* ── Filter & Search Toolbar ──────────────────────────────── */}
        <div className="pm-toolbar">
          <div className="pm-search-wrap">
            <Search size={16} className="pm-search-icon" />
            <input
              type="text"
              placeholder="Search by name, relationship, condition, or caregiver..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pm-search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="pm-clear-btn">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="pm-filter-tabs">
            <button
              className={`pm-filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({parents.length})
            </button>
            <button
              className={`pm-filter-tab ${statusFilter === 'assigned' ? 'active' : ''}`}
              onClick={() => setStatusFilter('assigned')}
            >
              Active Care ({totalAssigned})
            </button>
            <button
              className={`pm-filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending ({parents.filter(p => p.assignment_status === 'pending').length})
            </button>
            <button
              className={`pm-filter-tab ${statusFilter === 'unassigned' ? 'active' : ''}`}
              onClick={() => setStatusFilter('unassigned')}
            >
              Unassigned ({parents.filter(p => !p.assigned_caregiver_id).length})
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="pm-error-banner">
            <AlertTriangle size={16} />
            <span>{error}</span>
            <button onClick={() => setError('')} className="pm-error-close"><X size={14} /></button>
          </div>
        )}

        {/* ── Content Area ─────────────────────────────────────────── */}
        {loading ? (
          <div className="pm-loading-state">
            <div className="pm-spinner"></div>
            <p>Loading family profiles...</p>
          </div>
        ) : parents.length === 0 ? (
          <div className="pm-empty-state">
            <div className="pm-empty-icon-wrap">
              <UserPlus size={44} className="pm-empty-icon" />
            </div>
            <h3 className="pm-empty-title">No Family Members Added Yet</h3>
            <p className="pm-empty-desc">
              Add your parents or loved ones to track their daily vitals, assign professional caregivers, and view real-time health updates.
            </p>
            <Link to="/add-parent" className="pm-empty-btn">
              <Plus size={16} /> Add Your First Parent
            </Link>
          </div>
        ) : filteredParents.length === 0 ? (
          <div className="pm-empty-search">
            <Search size={32} />
            <h4>No matching profiles found</h4>
            <p>Try refining your search terms or filter selection.</p>
            <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="pm-reset-btn">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="pm-grid">
            {filteredParents.map(parent => {
              const seed = parent.name || 'avatar';
              const hasCaregiver = !!parent.assigned_caregiver_id;
              const isPending = parent.assignment_status === 'pending';
              const isRejected = parent.assignment_status === 'rejected';
              const isApproved = hasCaregiver && !isPending && !isRejected;

              return (
                <div key={parent.id} className="pm-card">

                  {/* ── Card Top Header ── */}
                  <div className="pm-card-top">
                    <div className="pm-avatar-wrap">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`}
                        alt={parent.name}
                        className="pm-avatar"
                      />
                      <span className={`pm-avatar-badge ${isApproved ? 'active' : isPending ? 'pending' : 'idle'}`} />
                    </div>

                    <div className="pm-name-section">
                      <div className="pm-name-row">
                        <h3 className="pm-name">{parent.name}</h3>
                        <div className="pm-card-actions-quick">
                          <button
                            onClick={() => startEdit(parent)}
                            className="pm-icon-btn edit"
                            title="Edit Profile"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(parent.id, parent.name)}
                            className="pm-icon-btn delete"
                            title="Delete Profile"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="pm-meta-tags">
                        <span className="pm-meta-pill primary">
                          {parent.relationship || 'Family Member'}
                        </span>
                        {parent.age && (
                          <span className="pm-meta-pill neutral">
                            {parent.age} yrs old
                          </span>
                        )}
                        {parent.gender && (
                          <span className="pm-meta-pill neutral capitalize">
                            {parent.gender}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Contact Details ── */}
                  <div className="pm-card-contact-strip">
                    <div className="pm-contact-item">
                      <Phone size={13} className="pm-c-icon" />
                      {parent.phone ? (
                        <a href={`tel:${parent.phone}`} className="pm-contact-link">
                          {parent.phone}
                        </a>
                      ) : (
                        <span className="pm-contact-muted">No phone added</span>
                      )}
                    </div>
                    <div className="pm-contact-item">
                      <MapPin size={13} className="pm-c-icon" />
                      <span className="pm-contact-text" title={parent.address}>
                        {parent.address || 'No address on file'}
                      </span>
                    </div>
                  </div>

                  {/* ── Caregiver Assignment Strip ── */}
                  <div className="pm-card-section caregiver-section">
                    <div className="pm-sec-head">
                      <span className="pm-sec-label">ASSIGNED CAREGIVER</span>
                      {isApproved && (
                        <span className="pm-status-pill approved">
                          <CheckCircle2 size={11} /> Active In-Care
                        </span>
                      )}
                      {isPending && (
                        <span className="pm-status-pill pending">
                          <Clock size={11} /> Request Pending
                        </span>
                      )}
                      {isRejected && (
                        <span className="pm-status-pill rejected">
                          <AlertTriangle size={11} /> Declined
                        </span>
                      )}
                      {!hasCaregiver && (
                        <span className="pm-status-pill unassigned">
                          Unassigned
                        </span>
                      )}
                    </div>

                    {parent.caregiver_name ? (
                      <div className="pm-caregiver-card">
                        <div className="pm-cg-avatar-wrap">
                          <img
                            src={parent.caregiver_avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(parent.caregiver_name)}`}
                            alt={parent.caregiver_name}
                            className="pm-cg-avatar"
                          />
                        </div>
                        <div className="pm-cg-info">
                          <span className="pm-cg-name">{parent.caregiver_name}</span>
                          <span className="pm-cg-spec">
                            {parent.caregiver_specialization || 'General Eldercare Specialist'}
                          </span>
                        </div>
                        <button
                          onClick={() => startEdit(parent)}
                          className="pm-cg-change-btn"
                          title="Change Assigned Caregiver"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="pm-no-caregiver-box">
                        <span>No caregiver assigned yet</span>
                        <button
                          onClick={() => startEdit(parent)}
                          className="pm-assign-btn"
                        >
                          <Plus size={12} /> Assign Caregiver
                        </button>
                      </div>
                    )}

                    {isRejected && (
                      <div className="pm-decline-reason">
                        <strong>Decline Note:</strong> {parent.rejection_reason || 'Caregiver currently at maximum patient capacity.'}
                      </div>
                    )}
                  </div>

                  {/* ── Medical Profile & Conditions ── */}
                  <div className="pm-card-section medical-section">
                    <div className="pm-sec-head">
                      <span className="pm-sec-label">
                        <HeartPulse size={13} className="pm-sec-icon" />
                        CLINICAL PROFILE
                      </span>
                    </div>

                    <div className="pm-med-grid">
                      <div className="pm-med-box">
                        <span className="pm-med-box-title">Conditions</span>
                        <p className="pm-med-box-val">
                          {parent.medical_conditions || 'None documented'}
                        </p>
                      </div>
                      <div className="pm-med-box allergies">
                        <span className="pm-med-box-title">Allergies</span>
                        <p className="pm-med-box-val red">
                          {parent.allergies || 'No known allergies'}
                        </p>
                      </div>
                    </div>

                    {parent.current_medications && (
                      <div className="pm-meds-strip">
                        <Pill size={12} className="pm-pill-icon" />
                        <span className="pm-meds-text">
                          <strong>Meds:</strong> {parent.current_medications}
                        </span>
                      </div>
                    )}

                    {parent.emergency_contact_phone && (
                      <div className="pm-emergency-strip">
                        <PhoneCall size={12} />
                        <span>
                          Emergency: <strong>{parent.emergency_contact_name || 'Contact'}</strong> ({parent.emergency_contact_phone})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── Card Action Links ── */}
                  <div className="pm-card-footer">
                    <Link
                      to={`/health-feed?parent_id=${parent.id}`}
                      className="pm-action-link primary"
                    >
                      <Activity size={14} /> Health Feed
                    </Link>

                    <Link
                      to={`/analytics?parent_id=${parent.id}`}
                      className="pm-action-link secondary"
                    >
                      <HeartPulse size={14} /> Analytics
                    </Link>

                    {parent.caregiver_user_id ? (
                      <Link
                        to={`/messages?recipient=${parent.caregiver_user_id}&regardingName=${encodeURIComponent(parent.name)}`}
                        className="pm-action-link chat"
                        title={`Chat with ${parent.caregiver_name}`}
                      >
                        <MessageSquare size={14} /> Chat
                      </Link>
                    ) : (
                      <Link
                        to="/caregivers-list"
                        className="pm-action-link browse"
                        title="Browse Available Caregivers"
                      >
                        <UserCheck size={14} /> Browse
                      </Link>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ── Edit Parent Profile Modal ───────────────────────────────── */}
        {editingParent && (
          <div className="pm-modal-overlay">
            <div className="pm-modal-box">
              <div className="pm-modal-header">
                <div>
                  <h3 className="pm-modal-title">Edit Parent Profile</h3>
                  <p className="pm-modal-sub">Update contact info, medical details, or assigned caregiver</p>
                </div>
                <button
                  onClick={() => setEditingParent(null)}
                  className="pm-modal-close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="pm-edit-form">
                
                {/* Personal Information */}
                <div className="pm-form-group-title">Personal & Contact</div>
                
                <div className="pm-form-row">
                  <div className="pm-field full">
                    <label>Full Legal Name *</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="pm-form-row">
                  <div className="pm-field">
                    <label>Age</label>
                    <input
                      type="number"
                      value={editForm.age || ''}
                      onChange={e => setEditForm({ ...editForm, age: e.target.value })}
                      placeholder="e.g. 72"
                    />
                  </div>
                  <div className="pm-field">
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
                  <div className="pm-field">
                    <label>Relationship</label>
                    <input
                      type="text"
                      value={editForm.relationship || ''}
                      onChange={e => setEditForm({ ...editForm, relationship: e.target.value })}
                      placeholder="Mother, Father..."
                    />
                  </div>
                </div>

                <div className="pm-form-row">
                  <div className="pm-field">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={editForm.phone || ''}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="pm-field full">
                    <label>Residential Address</label>
                    <input
                      type="text"
                      value={editForm.address || ''}
                      onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                      placeholder="Street address, city, state"
                    />
                  </div>
                </div>

                {/* Caregiver Assignment */}
                <div className="pm-form-group-title">Caregiver Assignment</div>
                <div className="pm-field full pm-caregiver-select-box">
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
                  <p className="pm-select-hint">
                    Caregivers will receive a care assignment request upon selecting them.
                  </p>
                </div>

                {/* Clinical & Medical Details */}
                <div className="pm-form-group-title">Clinical Profile</div>

                <div className="pm-field full">
                  <label>Medical Conditions</label>
                  <textarea
                    rows="2"
                    value={editForm.medical_conditions || ''}
                    onChange={e => setEditForm({ ...editForm, medical_conditions: e.target.value })}
                    placeholder="e.g. Hypertension, Type 2 Diabetes, Mild Arthritis"
                  />
                </div>

                <div className="pm-form-row">
                  <div className="pm-field">
                    <label>Allergies</label>
                    <input
                      type="text"
                      value={editForm.allergies || ''}
                      onChange={e => setEditForm({ ...editForm, allergies: e.target.value })}
                      placeholder="e.g. Penicillin, Peanuts"
                    />
                  </div>
                  <div className="pm-field">
                    <label>Current Medications</label>
                    <input
                      type="text"
                      value={editForm.current_medications || ''}
                      onChange={e => setEditForm({ ...editForm, current_medications: e.target.value })}
                      placeholder="e.g. Lisinopril 10mg, Metformin 500mg"
                    />
                  </div>
                </div>

                <div className="pm-form-row">
                  <div className="pm-field">
                    <label>Emergency Contact Name</label>
                    <input
                      type="text"
                      value={editForm.emergency_contact_name || ''}
                      onChange={e => setEditForm({ ...editForm, emergency_contact_name: e.target.value })}
                      placeholder="e.g. Dr. Robert Vance"
                    />
                  </div>
                  <div className="pm-field">
                    <label>Emergency Contact Phone</label>
                    <input
                      type="text"
                      value={editForm.emergency_contact_phone || ''}
                      onChange={e => setEditForm({ ...editForm, emergency_contact_phone: e.target.value })}
                      placeholder="+1 (555) 999-8888"
                    />
                  </div>
                </div>

                <div className="pm-modal-actions">
                  <button
                    type="button"
                    onClick={() => setEditingParent(null)}
                    className="pm-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="pm-btn-save"
                    disabled={saving}
                  >
                    {saving ? 'Saving Changes...' : 'Save Changes'}
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
