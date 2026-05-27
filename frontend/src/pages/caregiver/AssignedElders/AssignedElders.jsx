import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import {
  Search, Filter, Eye, FilePlus, Heart, Activity, Thermometer,
  ChevronLeft, ChevronRight, HelpCircle, Plus, ChevronDown, Loader2, Users,
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

  const [elders, setElders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage]           = useState(1);

  // ── Fetch residents ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users/my-residents');
        setElders(data);
      } catch {
        setElders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
      <div className="assigned-elders-container">

        {/* Header Area */}
        <div className="ae-header-area">
          <div className="ae-header-left">
            <div className="ae-breadcrumbs">
              <span style={{ cursor: 'pointer' }} onClick={() => navigate('/caregiver/dashboard')}>Dashboard</span>
              <span>›</span>
              <span className="active">Assigned Elders</span>
            </div>
            <h1 className="ae-title">Assigned Elders</h1>
            <p className="ae-subtitle">
              Managing care for {elders.length} individual{elders.length !== 1 ? 's' : ''}.
            </p>
          </div>

          <div className="ae-header-actions">
            <button className="btn-icon-only">
              <HelpCircle size={20} />
            </button>
            <button
              className="btn-primary-teal"
              onClick={() => navigate('/caregiver/healthlog/add')}
            >
              <Plus size={18} /> Add Health Log
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="ae-filters-bar">
          <div className="ae-search-wrapper">
            <Search className="ae-search-icon" />
            <input
              type="text"
              className="ae-search-input"
              placeholder="Search by name or condition..."
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
              {searchTerm || statusFilter !== 'All' ? 'No residents match your search.' : 'No residents assigned yet.'}
            </p>
            <small style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              {searchTerm || statusFilter !== 'All'
                ? 'Try a different search or filter.'
                : 'Ask your admin to assign residents to your account.'}
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
                          {elder.age} years old
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
                    <button className="btn-secondary">
                      <Eye size={16} /> View Details
                    </button>
                    <button
                      className="btn-primary-card"
                      onClick={() => navigate('/caregiver/healthlog/add')}
                    >
                      <FilePlus size={16} /> Add Log
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
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
