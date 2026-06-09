import React, { useState, useEffect, useCallback } from 'react';
import { Bell, AlertTriangle, CheckCircle, X, Loader2, RefreshCw } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import api from '../../../services/api';
import './AdminAlerts.css';

const levelStyle = {
  critical: { bg: '#fef2f2', color: '#dc2626', icon: AlertTriangle },
  warning:  { bg: '#fef3c7', color: '#b45309', icon: Bell },
  info:     { bg: '#eff6ff', color: '#3b82f6', icon: Bell },
};

const levelLabel = { critical: 'Critical', warning: 'Warning', info: 'Info' };

const formatTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffM = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffM < 1)  return 'Just now';
  if (diffM < 60) return `${diffM} min${diffM > 1 ? 's' : ''} ago`;
  if (diffH < 24) return `${diffH} hour${diffH > 1 ? 's' : ''} ago`;
  if (diffD === 1) return 'Yesterday';
  if (diffD < 7)  return `${diffD} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

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

const AdminAlerts = () => {
  const [alerts, setAlerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing]   = useState(null);
  const [tab, setTab]         = useState('Active');
  const [toast, setToast]     = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/alerts');
      setAlerts(data);
    } catch {
      showToast('error', 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const handleResolve = async (id) => {
    setActing(id);
    try {
      await api.put(`/admin/alerts/${id}/resolve`);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_resolved: 1 } : a));
      showToast('success', 'Alert resolved');
    } catch {
      showToast('error', 'Failed to resolve alert');
    } finally {
      setActing(null);
    }
  };

  const handleDismiss = async (id) => {
    setActing(id);
    try {
      await api.delete(`/admin/alerts/${id}`);
      setAlerts(prev => prev.filter(a => a.id !== id));
      showToast('success', 'Alert dismissed');
    } catch {
      showToast('error', 'Failed to dismiss alert');
    } finally {
      setActing(null);
    }
  };

  const active   = alerts.filter(a => !a.is_resolved);
  const resolved = alerts.filter(a =>  a.is_resolved);
  const shown    = tab === 'Active' ? active : resolved;

  return (
    <AdminLayout title="Alerts">
      <Toast toast={toast} />

      <div className="aa-page">
        <div className="aa-header">
          <div>
            <h1 className="aa-title">Alerts</h1>
            <p className="aa-subtitle">
              {loading ? '…' : `${active.length} active alert${active.length !== 1 ? 's' : ''} require attention.`}
            </p>
          </div>
          <div className="aa-counts" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="aa-count critical">
              {alerts.filter(a => !a.is_resolved && a.type === 'critical').length} Critical
            </span>
            <span className="aa-count warning">
              {alerts.filter(a => !a.is_resolved && a.type === 'warning').length} Warnings
            </span>
            <button
              onClick={fetchAlerts}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 8,
                border: '1px solid #e2e8f0', background: '#fff',
                cursor: 'pointer', fontSize: '0.8rem', color: '#64748b', fontWeight: 600,
              }}
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
        </div>

        <div className="aa-tabs">
          {['Active', 'Resolved'].map(t => (
            <button
              key={t}
              className={`aa-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 size={32} style={{ animation: 'aa-spin 1s linear infinite', color: '#0d9488' }} />
          </div>
        ) : (
          <div className="aa-list">
            {shown.map(a => {
              const type = (a.type || 'info').toLowerCase();
              const s    = levelStyle[type] || levelStyle.info;
              const Icon = s.icon;
              const isActing = acting === a.id;
              return (
                <div key={a.id} className="aa-item" style={{ borderLeftColor: s.color }}>
                  <div className="aa-icon" style={{ background: s.bg }}>
                    <Icon size={16} color={s.color} />
                  </div>
                  <div className="aa-info">
                    <div className="aa-info-top">
                      <span className="aa-level" style={{ color: s.color }}>
                        {levelLabel[type] || type}
                      </span>
                      <span className="aa-time">{formatTime(a.created_at)}</span>
                    </div>
                    <p className="aa-item-title">{a.title || 'Health Alert'}</p>
                    <p className="aa-item-meta">
                      {a.elder_name || a.parent_name || ''}
                      {a.description ? ` · ${a.description.slice(0, 80)}${a.description.length > 80 ? '…' : ''}` : ''}
                    </p>
                  </div>

                  {!a.is_resolved && (
                    <div className="aa-actions">
                      <button
                        className="aa-resolve-btn"
                        onClick={() => handleResolve(a.id)}
                        disabled={isActing}
                      >
                        {isActing
                          ? <Loader2 size={13} style={{ animation: 'aa-spin 1s linear infinite' }} />
                          : <CheckCircle size={14} />}
                        Resolve
                      </button>
                      <button
                        className="aa-dismiss-btn"
                        onClick={() => handleDismiss(a.id)}
                        disabled={isActing}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {a.is_resolved && (
                    <span className="aa-resolved-badge">
                      <CheckCircle size={12} /> Resolved
                    </span>
                  )}
                </div>
              );
            })}

            {shown.length === 0 && (
              <div className="aa-empty">
                <CheckCircle size={40} color="#14b8a6" />
                <p>No {tab.toLowerCase()} alerts.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes aa-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
};

export default AdminAlerts;
