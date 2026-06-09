import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Search, Filter, RefreshCw, Loader2 } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import api from '../../../services/api';
import './AdminHealthLogs.css';

const FLAG_COLORS = {
  Normal:   { bg: '#f0fdf4', color: '#16a34a' },
  Warning:  { bg: '#fef3c7', color: '#b45309' },
  Critical: { bg: '#fef2f2', color: '#dc2626' },
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffD = Math.floor((now - d) / 86400000);
  if (diffD === 0) return `Today, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffD === 1) return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const deriveFlag = (log) => {
  if (log.flag) return log.flag;
  const cond = (log.overall_condition || '').toLowerCase();
  if (cond.includes('critical') || cond.includes('poor')) return 'Critical';
  if (cond.includes('fair') || cond.includes('concern')) return 'Warning';
  return 'Normal';
};

const logSummary = (log) => {
  const parts = [];
  if (log.blood_pressure) parts.push(`BP: ${log.blood_pressure}`);
  if (log.heart_rate)     parts.push(`HR: ${log.heart_rate} bpm`);
  if (log.temperature)    parts.push(`Temp: ${log.temperature}°`);
  if (!parts.length && log.overall_condition) parts.push(log.overall_condition);
  if (!parts.length && log.notes) parts.push(log.notes.slice(0, 40));
  return parts.join(' · ') || '—';
};

const AdminHealthLogs = () => {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');

  const fetchLogs = useCallback(async (q = '', f = 'All') => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/health-logs', {
        params: { search: q, flag: f, limit: 150 },
      });
      setLogs(data);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(handleSearch._t);
    handleSearch._t = setTimeout(() => fetchLogs(val, filter), 400);
  };

  const handleFilter = (f) => {
    setFilter(f);
    fetchLogs(search, f);
  };

  const todayCount = logs.filter(l => {
    const d = new Date(l.logged_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <AdminLayout title="Health Logs">
      <div className="ahl-page">
        <div className="ahl-header">
          <div>
            <h1 className="ahl-title">Health Logs</h1>
            <p className="ahl-subtitle">
              {loading ? 'Loading…' : `${todayCount} log${todayCount !== 1 ? 's' : ''} recorded today across all residents.`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => fetchLogs(search, filter)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 13px', borderRadius: 8,
                border: '1px solid #e2e8f0', background: '#fff',
                cursor: 'pointer', fontSize: '0.8rem', color: '#64748b', fontWeight: 600,
              }}
            >
              <RefreshCw size={12} /> Refresh
            </button>
            <div className="ahl-stat-pill">
              <Activity size={14} /> {loading ? '…' : todayCount} Today
            </div>
          </div>
        </div>

        <div className="ahl-toolbar">
          <div className="ahl-search">
            <Search size={14} color="#94a3b8" />
            <input
              placeholder="Search by elder or caregiver..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="ahl-filters">
            {['All', 'Normal', 'Warning', 'Critical'].map(f => (
              <button
                key={f}
                className={`ahl-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => handleFilter(f)}
              >
                <Filter size={11} /> {f}
              </button>
            ))}
          </div>
        </div>

        <div className="ahl-table-wrap">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <Loader2 size={28} style={{ animation: 'ahl-spin 1s linear infinite', color: '#0d9488' }} />
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: '0.9rem' }}>
              <Activity size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ margin: 0 }}>No health logs found.</p>
            </div>
          ) : (
            <table className="ahl-table">
              <thead>
                <tr>
                  <th>Elder</th>
                  <th>Caregiver</th>
                  <th>Vitals / Summary</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Date &amp; Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(l => {
                  const flag = deriveFlag(l);
                  const f    = FLAG_COLORS[flag] || FLAG_COLORS.Normal;
                  return (
                    <tr key={l.id}>
                      <td className="ahl-td-name">{l.elder_name || '—'}</td>
                      <td className="ahl-td-sub">{l.caregiver_name || '—'}</td>
                      <td className="ahl-td-sub">{logSummary(l)}</td>
                      <td className="ahl-td-sub">{l.overall_condition || '—'}</td>
                      <td>
                        <span className="ahl-flag" style={{ background: f.bg, color: f.color }}>
                          {flag}
                        </span>
                      </td>
                      <td className="ahl-td-sub">{formatDate(l.logged_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`@keyframes ahl-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
};

export default AdminHealthLogs;
