import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import {
  Search, Filter, Eye, FilePlus, Heart, Activity, Thermometer,
  ChevronLeft, ChevronRight, HelpCircle, Plus, ChevronDown, Loader2, Users,
  UserPlus, Check, X, Phone, Mail, AlertCircle, CheckCircle
} from 'lucide-react';
import api from '../../../services/api';
import './AssignedElders.css';

const PAGE_SIZE = 6;

const residentAvatar = (name) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'elder')}`;

const getStatusClass = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'CRITICAL':         return 'status-critical';
    case 'NEEDS ATTENTION':  return 'status-needs-attention';
    case 'MODERATE CARE':    return 'status-moderate';
    default:                 return 'status-stable';
  }
};

const getMobileBorderClass = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'CRITICAL':         return 'status-border-critical';
    case 'NEEDS ATTENTION':  return 'status-border-needs-attention';
    case 'MODERATE CARE':    return 'status-border-moderate';
    default:                 return 'status-border-stable';
  }
};

const AssignedElders = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'pending'
  const [elders, setElders]       = useState([]);
  const [requests, setRequests]   = useState([]);
  const [capacity, setCapacity]   = useState({ active: 0, max: 4 });
  const [loading, setLoading]     = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage]           = useState(1);
  const [toast, setToast]         = useState(null);

  // Reject dialog state
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Reached maximum capacity (4/4 residents)');
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch residents & requests ───────────────────────
  const loadData = async () => {
    try {
      const [{ data: residentsData }, { data: requestsData }] = await Promise.all([
        api.get('/users/my-residents'),
        api.get('/users/caregiver-requests'),
      ]);
      setElders(residentsData);
      setRequests(requestsData?.requests || []);
      setCapacity({
        active: requestsData?.active_count || residentsData.length,
        max: requestsData?.max_capacity || 4
      });
    } catch {
      setElders([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Handle Accept Request ────────────────────────────
  const handleAccept = async (parentId, name) => {
    setActionLoading(true);
    try {
      await api.put(`/users/caregiver-requests/${parentId}/accept`);
      showToast('success', `Accepted care assignment for ${name}!`);
      await loadData();
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to accept request');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Handle Reject Request ────────────────────────────
  const handleReject = async (parentId, name) => {
    setActionLoading(true);
    try {
      await api.put(`/users/caregiver-requests/${parentId}/reject`, {
        reason: rejectReason
      });
      showToast('success', `Declined request for ${name}`);
      setRejectingId(null);
      await loadData();
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to decline request');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Filter + Search ──────────────────────────────────
  const filtered = elders.filter(e => {
    const matchSearch = (e.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      || (e.medical_conditions || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All'
      || (e.care_status || '').toUpperCase() === statusFilter.toUpperCase();
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ── Render ───────────────────────────────────────────
  return (
    <CaregiverLayout title="Assigned Elders">
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${toast.type === 'success' ? '#86efac' : '#fca5a5'}`,
          color: toast.type === 'success' ? '#166534' : '#991b1b',
          padding: '12px 18px', borderRadius: 10,
          fontSize: '0.83rem', fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,.1)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : '✕'} {toast.message}
        </div>
      )}

      <div className="assigned-elders-container">

        {/* Header Area */}
        <div className="ae-header-area">
          <div className="ae-header-left">
            <div className="ae-breadcrumbs">
              <span style={{ cursor: 'pointer' }} onClick={() => navigate('/caregiver/dashboard')}>Dashboard</span>
              <span>›</span>
              <span className="active">Assigned Elders</span>
            </div>
            <h1 className="ae-title">Assigned Elders & Care Requests</h1>
            <p className="ae-subtitle">
              Managing care for {elders.length} active resident{elders.length !== 1 ? 's' : ''} • Capacity: {elders.length}/{capacity.max} Max
            </p>
          </div>

          <div className="ae-header-actions">
            <button
              className="btn-primary-teal"
              onClick={() => navigate('/caregiver/healthlog/add')}
            >
              <Plus size={18} /> Add Health Log
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '24px',
          paddingBottom: '4px'
        }}>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '12px', border: 'none',
              background: activeTab === 'active' ? '#0d9488' : 'transparent',
              color: activeTab === 'active' ? 'white' : '#64748b',
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveTab('active')}
          >
            <Users size={18} /> Active Residents ({elders.length}/{capacity.max})
          </button>

          <button
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '12px', border: 'none',
              background: activeTab === 'pending' ? '#0284c7' : 'transparent',
              color: activeTab === 'pending' ? 'white' : '#64748b',
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveTab('pending')}
          >
            <UserPlus size={18} /> Pending Requests
            {requests.length > 0 && (
              <span style={{
                background: activeTab === 'pending' ? 'white' : '#0284c7',
                color: activeTab === 'pending' ? '#0284c7' : 'white',
                fontSize: '0.75rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 800
              }}>
                {requests.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: ACTIVE RESIDENTS */}
        {activeTab === 'active' && (
          <>
            {/* Filters Bar */}
            <div className="ae-filters-bar">
              <div className="ae-search-wrapper">
                <Search className="ae-search-icon" />
                <input
                  type="text"
                  className="ae-search-input"
                  placeholder="Search active elders by name or condition..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                />
              </div>

              <div className="ae-filters-right">
                <div className="ae-select-wrapper">
                  <select
                    className="ae-select"
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                  >
                    <option value="All">Status: All</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="NEEDS ATTENTION">Needs Attention</option>
                    <option value="MODERATE CARE">Moderate Care</option>
                    <option value="STABLE">Stable</option>
                  </select>
                  <ChevronDown className="ae-select-icon" />
                </div>

                <button className="btn-filter-dark">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#0d9488' }} />
              </div>
            ) : paginated.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '60px 24px', textAlign: 'center',
                background: '#f8fafc', borderRadius: 16,
                border: '1px dashed #e2e8f0', color: '#94a3b8',
              }}>
                <Users size={36} style={{ marginBottom: 12 }} />
                <p style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 4px' }}>
                  {searchTerm || statusFilter !== 'All' ? 'No residents match your search.' : 'No active residents assigned yet.'}
                </p>
                <small style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  {searchTerm || statusFilter !== 'All'
                    ? 'Try a different search or filter.'
                    : 'When family requests are accepted, they will appear here.'}
                </small>
              </div>
            ) : (
              /* Grid of Elders */
              <div className="ae-grid">
                {paginated.map((elder) => {
                  const isCritical  = (elder.care_status || '').toUpperCase() === 'CRITICAL';
                  const isAttention = (elder.care_status || '').toUpperCase() === 'NEEDS ATTENTION';
                  const bp = elder.blood_pressure || '—';
                  const bpParts = bp !== '—' ? bp.split('/') : ['—', '—'];

                  return (
                    <div key={elder.id} className={`elder-card ${getMobileBorderClass(elder.care_status)}`}>

                      {/* Header */}
                      <div className="elder-header">
                        <div className="elder-info-main">
                          <div className="elder-avatar">
                            <img src={residentAvatar(elder.name)} alt={elder.name} />
                          </div>
                          <div>
                            <h3 className="elder-name">{elder.name}</h3>
                            <p className="elder-meta">
                              {elder.age ? `${elder.age} years old` : 'Age unknown'}
                              {elder.room_number && <span className="desktop-id"> • Room {elder.room_number}</span>}
                              <span className="mobile-condition">{elder.medical_conditions}</span>
                            </p>
                          </div>
                        </div>
                        <div className={`status-pill ${getStatusClass(elder.care_status)}`}>
                          <div className="status-dot" />
                          <span>{elder.care_status || 'STABLE'}</span>
                        </div>
                      </div>

                      {/* Desktop Metrics */}
                      <div className="elder-metrics-desktop">
                        <div className="metric-box">
                          <p className="metric-label">Last BP</p>
                          <p className="metric-value">
                            <span className={isCritical ? 'critical-val' : ''}>{bpParts[0]}</span>
                            {bpParts[1] && <span className="metric-sub">/{bpParts[1]}</span>}
                            <span className="metric-unit">mmHg</span>
                          </p>
                        </div>
                        <div className="metric-box">
                          <p className="metric-label">Temperature</p>
                          <p className="metric-value">
                            {elder.temperature || '—'} <span className="metric-unit">°F</span>
                          </p>
                        </div>
                      </div>

                      {/* Mobile Metrics */}
                      <div className="elder-metrics-mobile">
                        <div className="mobile-metric">
                          <Heart className="mobile-metric-icon" />
                          <p className={`mobile-metric-val ${isCritical ? 'critical-val' : ''}`}>
                            {elder.heart_rate ? `${elder.heart_rate} bpm` : '—'}
                          </p>
                          <p className="mobile-metric-label">Heart Rate</p>
                        </div>
                        <div className="mobile-metric-divider" />
                        <div className="mobile-metric">
                          <Activity className="mobile-metric-icon" />
                          <p className={`mobile-metric-val ${isAttention ? 'attention-val' : ''}`}>{bp}</p>
                          <p className="mobile-metric-label">BP</p>
                        </div>
                        <div className="mobile-metric-divider" />
                        <div className="mobile-metric">
                          <Thermometer className="mobile-metric-icon" />
                          <p className="mobile-metric-val">{elder.temperature ? `${elder.temperature}°F` : '—'}</p>
                          <p className="mobile-metric-label">Temp</p>
                        </div>
                      </div>

                      {/* Condition / Update */}
                      <div className="elder-details-list">
                        <div className="detail-row">
                          <span className="detail-label">Condition</span>
                          <span className="detail-value">{elder.medical_conditions || '—'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Last Update</span>
                          <span className="detail-value">
                            {elder.last_update
                              ? new Date(elder.last_update).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                              : 'No logs yet'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="elder-actions">
                        <button
                          className="btn-primary-card"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                          onClick={() => navigate('/caregiver/healthlog/add')}
                        >
                          <FilePlus size={16} /> Add Health Log
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TAB 2: PENDING REQUESTS */}
        {activeTab === 'pending' && (
          <div>
            {capacity.active >= capacity.max && (
              <div style={{
                background: '#fff7ed', border: '1px solid #fdba74', color: '#c2410c',
                padding: '12px 18px', borderRadius: '12px', fontSize: '0.86rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'
              }}>
                <AlertCircle size={18} />
                <span>
                  <strong>Capacity Notice:</strong> You currently have {capacity.active} active resident{capacity.active > 1 ? 's' : ''} (Maximum capacity is {capacity.max}). Accepting new requests may overload your scheduled visits.
                </span>
              </div>
            )}

            {requests.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '60px 24px', textAlign: 'center',
                background: '#f8fafc', borderRadius: 16,
                border: '1px dashed #e2e8f0', color: '#94a3b8',
              }}>
                <CheckCircle size={40} style={{ color: '#10b981', marginBottom: 12 }} />
                <p style={{ fontWeight: 700, fontSize: '1.05rem', margin: '0 0 4px', color: '#1e293b' }}>
                  No pending care requests!
                </p>
                <small style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  All incoming elder assignment requests have been processed.
                </small>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {requests.map(req => (
                  <div key={req.id} style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={residentAvatar(req.name)}
                            alt={req.name}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9' }}
                          />
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{req.name}</h3>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                              {req.age ? `${req.age} yrs` : 'Age unknown'}{req.gender ? ` • ${req.gender}` : ''}{req.relationship ? ` • ${req.relationship}` : ''}
                            </span>
                          </div>
                        </div>
                        <span style={{
                          background: '#fef3c7', color: '#b45309', fontSize: '0.74rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px'
                        }}>
                          Pending
                        </span>
                      </div>

                      <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', fontSize: '0.84rem', marginBottom: '16px' }}>
                        <div style={{ color: '#334155', marginBottom: '6px' }}>
                          <strong>Family Contact:</strong> {req.child_name || 'Family Member'} {req.child_phone ? `• ${req.child_phone}` : ''}
                        </div>
                        {req.medical_conditions && (
                          <div style={{ color: '#334155', marginBottom: '6px' }}>
                            <strong>Medical Conditions:</strong> {req.medical_conditions}
                          </div>
                        )}
                        {req.medications && (
                          <div style={{ color: '#334155', marginBottom: '6px' }}>
                            <strong>Medications:</strong> {req.medications}
                          </div>
                        )}
                        {req.allergies && (
                          <div style={{ color: '#dc2626', marginBottom: '6px' }}>
                            <strong>Allergies:</strong> {req.allergies}
                          </div>
                        )}
                        {req.emergency_contact && (
                          <div style={{ color: '#64748b' }}>
                            <strong>Emergency Contact:</strong> {req.emergency_contact}
                          </div>
                        )}
                      </div>
                    </div>

                    {rejectingId === req.id ? (
                      <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '14px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9f1239', display: 'block', marginBottom: '8px' }}>
                          Reason for Declining Request:
                        </label>
                        <select
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fda4af', fontSize: '0.82rem', marginBottom: '10px', background: 'white' }}
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                        >
                          <option value="Reached maximum capacity (4/4 residents)">Reached maximum capacity (4/4 residents)</option>
                          <option value="Schedule or working hours conflict">Schedule or working hours conflict</option>
                          <option value="Specialized medical care required">Specialized medical care required</option>
                          <option value="Location / distance not serviceable">Location / distance not serviceable</option>
                        </select>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            style={{ flex: 1, padding: '8px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                            onClick={() => handleReject(req.id, req.name)}
                            disabled={actionLoading}
                          >
                            Confirm Decline
                          </button>
                          <button
                            style={{ padding: '8px 14px', background: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => setRejectingId(null)}
                            disabled={actionLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            background: '#0d9488',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '0.86rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(13,148,136,0.2)'
                          }}
                          onClick={() => handleAccept(req.id, req.name)}
                          disabled={actionLoading}
                        >
                          <Check size={18} /> Accept Assignment
                        </button>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            background: '#fff1f2',
                            color: '#e11d48',
                            border: '1px solid #fecdd3',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '0.86rem',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setRejectingId(req.id);
                            setRejectReason(capacity.active >= capacity.max
                              ? `Reached maximum capacity (${capacity.active}/${capacity.max} residents)`
                              : 'Reached maximum capacity (4/4 residents)');
                          }}
                          disabled={actionLoading}
                        >
                          <X size={18} /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pagination (Active tab only) */}
        {activeTab === 'active' && !loading && filtered.length > 0 && (
          <div className="ae-pagination">
            <p className="pagination-text">
              Showing <span>{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span> of <span>{filtered.length}</span> elders
            </p>
            <div className="pagination-controls">
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  className={`page-btn ${n === currentPage ? 'active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </CaregiverLayout>
  );
};

export default AssignedElders;
