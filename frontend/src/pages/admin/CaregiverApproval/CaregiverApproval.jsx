import React, { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, Clock, FileText,
  Loader2, RefreshCw, X, Mail, Briefcase,
  Award, CreditCard, Star, DollarSign, Calendar,
} from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import api from '../../../services/api';
import './CaregiverApproval.css';

const formatApplied = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffH < 1)  return 'Just now';
  if (diffH < 24) return `${diffH} hour${diffH > 1 ? 's' : ''} ago`;
  if (diffD === 1) return 'Yesterday';
  if (diffD < 7)  return `${diffD} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ── Toast ────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: ok ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${ok ? '#86efac' : '#fca5a5'}`,
      color: ok ? '#166534' : '#991b1b',
      padding: '12px 18px', borderRadius: 10,
      fontSize: '0.83rem', fontWeight: 600,
      boxShadow: '0 4px 16px rgba(0,0,0,.1)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {toast.message}
    </div>
  );
};

// ── View Docs Modal ──────────────────────────────────────────────
const ViewDocsModal = ({ caregiver, onClose, onApprove, onReject, acting }) => {
  const displayName = caregiver.user_name || caregiver.name || 'Caregiver';

  const field = (icon, label, value) => {
    if (!value && value !== 0) return null;
    const Icon = icon;
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={15} color="#0d9488" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
          <p style={{ margin: '2px 0 0', fontSize: '0.9rem', color: '#0f172a', fontWeight: 500 }}>{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 18, width: '100%', maxWidth: 500,
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Modal header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
        }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Caregiver Profile
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Profile hero */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '3px solid #f0fdfa', flexShrink: 0 }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`}
              alt={displayName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{displayName}</p>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              {caregiver.specialization || 'General Care'}
            </p>
            <span style={{
              display: 'inline-block', marginTop: 6, padding: '2px 10px',
              background: '#fef3c7', color: '#b45309', borderRadius: 20,
              fontSize: '0.72rem', fontWeight: 700,
            }}>
              PENDING APPROVAL
            </span>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '4px 24px', overflowY: 'auto', flex: 1 }}>
          {field(Mail,       'Email Address',      caregiver.email)}
          {field(Briefcase,  'Specialization',     caregiver.specialization || 'General Care')}
          {field(Star,       'Experience',         caregiver.experience_years ? `${caregiver.experience_years} year${caregiver.experience_years !== '1' ? 's' : ''}` : null)}
          {field(Award,      'Certification',      caregiver.certification)}
          {field(CreditCard, 'License / ID',       caregiver.license_id)}
          {field(DollarSign, 'Hourly Rate',        caregiver.hourly_rate > 0 ? `$${caregiver.hourly_rate}/hr` : null)}
          {field(Calendar,   'Applied',            formatApplied(caregiver.created_at))}

          {caregiver.bio && (
            <div style={{ padding: '12px 0' }}>
              <p style={{ margin: '0 0 6px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bio</p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>{caregiver.bio}</p>
            </div>
          )}

          {!caregiver.certification && !caregiver.license_id && !caregiver.experience_years && !caregiver.bio && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              <FileText size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
              <p style={{ margin: 0 }}>No additional credentials submitted yet.</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>The caregiver can update their profile after approval.</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{
          display: 'flex', gap: 10, padding: '16px 24px',
          borderTop: '1px solid #f1f5f9',
        }}>
          <button
            onClick={() => onReject(caregiver.id, displayName)}
            disabled={acting}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px', borderRadius: 10,
              border: '1.5px solid #fecaca', background: '#fef2f2',
              color: '#dc2626', fontSize: '0.875rem', fontWeight: 700,
              cursor: acting ? 'not-allowed' : 'pointer', opacity: acting ? 0.6 : 1,
            }}
          >
            {acting ? <Loader2 size={14} style={{ animation: 'ca-spin 1s linear infinite' }} /> : <XCircle size={15} />}
            Reject
          </button>
          <button
            onClick={() => onApprove(caregiver.id, displayName)}
            disabled={acting}
            style={{
              flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px', borderRadius: 10,
              border: 'none', background: '#0d9488',
              color: '#fff', fontSize: '0.875rem', fontWeight: 700,
              cursor: acting ? 'not-allowed' : 'pointer', opacity: acting ? 0.6 : 1,
            }}
          >
            {acting ? <Loader2 size={14} style={{ animation: 'ca-spin 1s linear infinite' }} /> : <CheckCircle size={15} />}
            Approve Caregiver
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────
const CaregiverApproval = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState(null);
  const [toast, setToast]       = useState(null);
  const [viewDocs, setViewDocs] = useState(null); // caregiver object for modal

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/caregivers/pending');
      setItems(data);
    } catch {
      showToast('error', 'Failed to load pending caregivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (id, name) => {
    setActing(id);
    try {
      await api.put(`/admin/caregivers/${id}/approve`);
      showToast('success', `${name} approved successfully`);
      setItems(prev => prev.filter(c => c.id !== id));
      setViewDocs(null);
    } catch {
      showToast('error', 'Failed to approve');
    } finally {
      setActing(null);
    }
  };

  const handleReject = async (id, name) => {
    setActing(id);
    try {
      await api.put(`/admin/caregivers/${id}/reject`);
      showToast('success', `${name} rejected`);
      setItems(prev => prev.filter(c => c.id !== id));
      setViewDocs(null);
    } catch {
      showToast('error', 'Failed to reject');
    } finally {
      setActing(null);
    }
  };

  return (
    <AdminLayout title="Caregiver Approval">
      <Toast toast={toast} />

      {viewDocs && (
        <ViewDocsModal
          caregiver={viewDocs}
          onClose={() => setViewDocs(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          acting={acting === viewDocs.id}
        />
      )}

      <div className="ca-page">
        <div className="ca-header">
          <div>
            <h1 className="ca-title">Caregiver Approval</h1>
            <p className="ca-subtitle">Review and approve pending caregiver applications.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={fetchPending}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8,
                border: '1px solid #e2e8f0', background: '#fff',
                cursor: 'pointer', fontSize: '0.83rem', color: '#64748b', fontWeight: 600,
              }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <div className="ca-pending-count">
              <Clock size={15} />
              {loading ? '…' : items.length} Pending
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 size={32} style={{ animation: 'ca-spin 1s linear infinite', color: '#0d9488' }} />
          </div>
        ) : items.length === 0 ? (
          <div className="ca-empty">
            <CheckCircle size={48} color="#14b8a6" />
            <p>All applications reviewed. No pending approvals.</p>
          </div>
        ) : (
          <div className="ca-grid">
            {items.map(c => {
              const displayName = c.user_name || c.name || 'Caregiver';
              const isActing = acting === c.id;
              return (
                <div key={c.id} className="ca-card">
                  <div className="ca-card-top">
                    <div className="ca-avatar">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`}
                        alt={displayName}
                      />
                    </div>
                    <div className="ca-info">
                      <p className="ca-name">{displayName}</p>
                      <p className="ca-specialty">{c.specialization || 'General Care'}</p>
                      {c.experience_years && (
                        <p className="ca-exp">{c.experience_years} yr{c.experience_years !== '1' ? 's' : ''} experience</p>
                      )}
                      {c.email && (
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>{c.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="ca-meta">
                    <Clock size={12} /> Applied {formatApplied(c.created_at)}
                  </div>
                  <div className="ca-actions">
                    <button
                      className="ca-btn reject"
                      onClick={() => handleReject(c.id, displayName)}
                      disabled={isActing}
                    >
                      {isActing
                        ? <Loader2 size={14} style={{ animation: 'ca-spin 1s linear infinite' }} />
                        : <XCircle size={14} />}
                      Reject
                    </button>
                    <button
                      className="ca-btn view"
                      onClick={() => setViewDocs(c)}
                    >
                      <FileText size={14} /> View Docs
                    </button>
                    <button
                      className="ca-btn approve"
                      onClick={() => handleApprove(c.id, displayName)}
                      disabled={isActing}
                    >
                      {isActing
                        ? <Loader2 size={14} style={{ animation: 'ca-spin 1s linear infinite' }} />
                        : <CheckCircle size={14} />}
                      Approve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`@keyframes ca-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
};

export default CaregiverApproval;
