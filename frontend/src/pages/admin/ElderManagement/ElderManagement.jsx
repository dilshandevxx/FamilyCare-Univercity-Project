import React, { useState, useEffect } from 'react';
import {
  Search, Heart, MapPin, User, Plus, X,
  CheckCircle, AlertTriangle, Loader2, UserCheck, Trash2,
} from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import api from '../../../services/api';
import './ElderManagement.css';

// ── helpers ───────────────────────────────────────────────────────
const avatarUrl = (name) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'elder')}`;

const statusStyle = (s) => {
  const v = (s || '').toUpperCase();
  if (v === 'CRITICAL')        return { bg: '#fef2f2', color: '#dc2626' };
  if (v === 'NEEDS ATTENTION') return { bg: '#fef3c7', color: '#b45309' };
  return                               { bg: '#f0fdf4', color: '#16a34a' };
};

const statusLabel = (s) => {
  const v = (s || '').toUpperCase();
  if (v === 'NEEDS ATTENTION') return 'Attention';
  if (v === 'CRITICAL')        return 'Critical';
  return 'Stable';
};

// ── Toast ─────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: ok ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${ok ? '#86efac' : '#fca5a5'}`,
      color: ok ? '#166534' : '#991b1b',
      padding: '12px 20px', borderRadius: 10,
      fontSize: '0.84rem', fontWeight: 600,
      boxShadow: '0 4px 20px rgba(0,0,0,.12)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {ok ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
      {toast.message}
    </div>
  );
};

// ── Assign Modal ──────────────────────────────────────────────────
const AssignModal = ({ resident, caregivers, onClose, onSave }) => {
  const [selected, setSelected] = useState(
    resident.caregiver_id ? String(resident.caregiver_id) : ''
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(resident.id, selected || null);
    setSaving(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 28,
        width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Assign Caregiver
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ margin: '0 0 16px', fontSize: '0.875rem', color: '#64748b' }}>
          Resident: <strong style={{ color: '#0f172a' }}>{resident.name}</strong>
        </p>

        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
          Select Caregiver
        </label>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            border: '1px solid #e2e8f0', fontSize: '0.875rem',
            color: '#0f172a', background: '#f8fafc',
            outline: 'none', marginBottom: 20,
          }}
        >
          <option value="">— Unassigned —</option>
          {caregivers.map(c => (
            <option key={c.id} value={String(c.id)}>
              {c.name || c.user_name} ({c.resident_count} resident{c.resident_count !== 1 ? 's' : ''})
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '9px 18px', background: 'transparent', border: '1px solid #e2e8f0',
            borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, color: '#64748b', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '9px 20px', background: '#0d9488', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <UserCheck size={14} />}
            {saving ? 'Saving…' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Add Resident Modal ────────────────────────────────────────────
const AddResidentModal = ({ caregivers, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '', age: '', medical_conditions: '',
    room_number: '', care_status: 'STABLE', assigned_caregiver_id: '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '1px solid #e2e8f0', fontSize: '0.875rem',
    color: '#0f172a', background: '#f8fafc', outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle = {
    fontSize: '0.78rem', fontWeight: 600, color: '#475569',
    display: 'block', marginBottom: 4,
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 28,
        width: '100%', maxWidth: 480,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Add New Resident
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input style={inputStyle} placeholder="e.g. Eleanor Vance"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Age</label>
              <input style={inputStyle} type="number" placeholder="e.g. 78"
                value={form.age} onChange={e => set('age', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Room Number</label>
              <input style={inputStyle} placeholder="e.g. 402"
                value={form.room_number} onChange={e => set('room_number', e.target.value)} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Medical Conditions</label>
            <input style={inputStyle} placeholder="e.g. Hypertension, Type 2 Diabetes"
              value={form.medical_conditions} onChange={e => set('medical_conditions', e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Care Status</label>
            <select style={inputStyle} value={form.care_status} onChange={e => set('care_status', e.target.value)}>
              <option value="STABLE">Stable</option>
              <option value="NEEDS ATTENTION">Needs Attention</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Assign Caregiver</label>
            <select style={inputStyle} value={form.assigned_caregiver_id}
              onChange={e => set('assigned_caregiver_id', e.target.value)}>
              <option value="">— Unassigned —</option>
              {caregivers.map(c => (
                <option key={c.id} value={String(c.id)}>
                  {c.name || c.user_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 22 }}>
          <button onClick={onClose} style={{
            padding: '9px 18px', background: 'transparent', border: '1px solid #e2e8f0',
            borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, color: '#64748b', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.name.trim()} style={{
            padding: '9px 20px', background: '#0d9488', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
            {saving ? 'Adding…' : 'Add Resident'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const ElderManagement = () => {
  const [residents,   setResidents]   = useState([]);
  const [caregivers,  setCaregivers]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [assignModal, setAssignModal] = useState(null);   // resident object
  const [addModal,    setAddModal]    = useState(false);
  const [toast,       setToast]       = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      const [{ data: res }, { data: cgs }] = await Promise.all([
        api.get('/admin/residents'),
        api.get('/admin/caregivers'),
      ]);
      setResidents(res);
      setCaregivers(cgs);
    } catch (err) {
      showToast('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ── handlers ─────────────────────────────────────────────────
  const handleAssign = async (residentId, caregiverId) => {
    try {
      await api.put(`/admin/residents/${residentId}/assign`, {
        caregiver_id: caregiverId ? Number(caregiverId) : null,
      });
      showToast('success', 'Caregiver assigned successfully!');
      setAssignModal(null);
      loadData();
    } catch {
      showToast('error', 'Failed to assign caregiver');
    }
  };

  const handleAddResident = async (form) => {
    try {
      await api.post('/admin/residents', {
        ...form,
        age: form.age ? Number(form.age) : null,
        assigned_caregiver_id: form.assigned_caregiver_id
          ? Number(form.assigned_caregiver_id) : null,
      });
      showToast('success', 'Resident added successfully!');
      setAddModal(false);
      loadData();
    } catch {
      showToast('error', 'Failed to add resident');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/residents/${id}`);
      showToast('success', `${name} removed`);
      loadData();
    } catch {
      showToast('error', 'Failed to delete resident');
    }
  };

  // ── filter ────────────────────────────────────────────────────
  const filtered = residents.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.caregiver_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.room_number    || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Elder Management">
      <Toast toast={toast} />
      {assignModal && (
        <AssignModal
          resident={assignModal}
          caregivers={caregivers}
          onClose={() => setAssignModal(null)}
          onSave={handleAssign}
        />
      )}
      {addModal && (
        <AddResidentModal
          caregivers={caregivers}
          onClose={() => setAddModal(false)}
          onSave={handleAddResident}
        />
      )}

      <div className="em-page">

        {/* Header */}
        <div className="em-header">
          <div>
            <h1 className="em-title">Elder Management</h1>
            <p className="em-subtitle">Manage residents and assign caregivers.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="em-total-badge">
              <Heart size={14} /> {residents.length} Active Elders
            </div>
            <button
              onClick={() => setAddModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', background: '#0d9488', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: '13px',
                fontWeight: 700, cursor: 'pointer',
              }}
            >
              <Plus size={14} /> Add Resident
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="em-search-wrap">
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by name, caregiver, or room..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#0d9488' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: '#94a3b8', fontSize: '0.9rem',
          }}>
            <Heart size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ margin: 0 }}>
              {residents.length === 0
                ? 'No residents added yet. Click "Add Resident" to get started.'
                : 'No residents match your search.'}
            </p>
          </div>
        ) : (
          <div className="em-grid">
            {filtered.map(r => {
              const s = statusStyle(r.care_status);
              return (
                <div key={r.id} className="em-card">
                  <div className="em-card-head">
                    <div className="em-avatar">
                      <img src={avatarUrl(r.name)} alt={r.name} />
                    </div>
                    <div className="em-info">
                      <p className="em-name">{r.name}</p>
                      <p className="em-age">Age {r.age || '—'}</p>
                    </div>
                    <span className="em-status" style={{ background: s.bg, color: s.color }}>
                      {statusLabel(r.care_status)}
                    </span>
                  </div>

                  <div className="em-details">
                    {r.room_number && (
                      <div className="em-detail-row">
                        <MapPin size={12} />
                        <span>Room {r.room_number}</span>
                      </div>
                    )}
                    <div className="em-detail-row">
                      <User size={12} />
                      <span style={{ color: r.caregiver_name ? '#0d9488' : '#94a3b8' }}>
                        {r.caregiver_name || 'Unassigned'}
                      </span>
                    </div>
                    {r.medical_conditions && (
                      <div className="em-detail-row">
                        <Heart size={12} />
                        <span style={{
                          whiteSpace: 'nowrap', overflow: 'hidden',
                          textOverflow: 'ellipsis', maxWidth: 180,
                        }}>
                          {r.medical_conditions}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="em-view-btn"
                      style={{ flex: 1 }}
                      onClick={() => setAssignModal(r)}
                    >
                      <UserCheck size={12} style={{ marginRight: 4 }} />
                      {r.caregiver_name ? 'Reassign' : 'Assign Caregiver'}
                    </button>
                    <button
                      onClick={() => handleDelete(r.id, r.name)}
                      style={{
                        padding: '9px 10px', background: '#fef2f2',
                        border: '1px solid #fecaca', borderRadius: 8,
                        cursor: 'pointer', color: '#dc2626',
                        display: 'flex', alignItems: 'center',
                      }}
                      title="Delete resident"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
};

export default ElderManagement;
