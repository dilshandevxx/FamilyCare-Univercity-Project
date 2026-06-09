import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, UserPlus, MoreVertical, Shield, Trash2, RefreshCw, X, Loader2 } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import api from '../../../services/api';
import './UserManagement.css';

const ROLE_LABELS = { child: 'Family', caregiver: 'Caregiver', admin: 'Admin' };

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

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

const EMPTY_FORM = { name: '', email: '', password: '', role: 'child' };

const UserManagement = () => {
  const location = useLocation();
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [toast, setToast]       = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm]   = useState(EMPTY_FORM);
  const [addLoading, setAddLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = async (q = '') => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: { search: q } });
      setUsers(data);
    } catch {
      showToast('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (location.state?.openAdd) setShowAddModal(true);
  }, [location.state]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(handleSearch._t);
    handleSearch._t = setTimeout(() => fetchUsers(val), 400);
  };

  const handleRoleChange = async (userId, newRole) => {
    setMenuOpen(null);
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      showToast('success', 'Role updated');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch {
      showToast('error', 'Failed to update role');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await api.post('/admin/users', addForm);
      showToast('success', `${addForm.name} added successfully`);
      setShowAddModal(false);
      setAddForm(EMPTY_FORM);
      fetchUsers(search);
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to create user');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/admin/users/${confirmDelete.id}`);
      showToast('success', `${confirmDelete.name} deleted`);
      setUsers(prev => prev.filter(u => u.id !== confirmDelete.id));
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to delete user');
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <AdminLayout title="User Management">
      <Toast toast={toast} />

      {/* Add New User modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => { setShowAddModal(false); setAddForm(EMPTY_FORM); }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '2rem',
            width: '100%', maxWidth: 440, boxShadow: '0 20px 50px rgba(0,0,0,.2)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b', fontWeight: 700 }}>Add New User</h3>
              <button onClick={() => { setShowAddModal(false); setAddForm(EMPTY_FORM); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'e.g. John Smith' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'john@example.com' },
                { label: 'Password', key: 'password', type: 'password', placeholder: 'Temporary password' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>{label}</label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={addForm[key]}
                    onChange={e => setAddForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 8,
                      border: '1px solid #e2e8f0', fontSize: '0.88rem', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>Role</label>
                <select
                  value={addForm.role}
                  onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 8,
                    border: '1px solid #e2e8f0', fontSize: '0.88rem', outline: 'none',
                    background: '#fff', cursor: 'pointer',
                  }}
                >
                  <option value="child">Family Member</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                <button type="button"
                  onClick={() => { setShowAddModal(false); setAddForm(EMPTY_FORM); }}
                  style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#64748b', fontSize: '0.88rem' }}>
                  Cancel
                </button>
                <button type="submit" disabled={addLoading}
                  style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#14b8a6', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {addLoading ? <Loader2 size={14} style={{ animation: 'um-spin 1s linear infinite' }} /> : <UserPlus size={14} />}
                  {addLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '2rem',
            width: '100%', maxWidth: 380, boxShadow: '0 20px 50px rgba(0,0,0,.2)',
          }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: '#1e293b' }}>Delete User</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#64748b' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="um-page">
        <div className="um-header">
          <div>
            <h1 className="um-title">User Management</h1>
            <p className="um-subtitle">Manage all registered users on the platform.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="um-add-btn" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }} onClick={() => fetchUsers(search)}>
              <RefreshCw size={15} /> Refresh
            </button>
            <button className="um-add-btn" onClick={() => setShowAddModal(true)}>
              <UserPlus size={15} /> Add New User
            </button>
          </div>
        </div>

        <div className="um-toolbar">
          <div className="um-search">
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="um-table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                    <Loader2 size={24} style={{ animation: 'um-spin 1s linear infinite' }} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                    No users found.
                  </td>
                </tr>
              ) : users.map(u => (
                <tr key={u.id} style={{ position: 'relative' }}>
                  <td>
                    <div className="um-user-cell">
                      <div className="um-avatar">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`}
                          alt={u.name}
                        />
                      </div>
                      <div>
                        <p className="um-name">{u.name}</p>
                        <p className="um-email">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`um-role-badge ${u.role}`}>
                      <Shield size={11} /> {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </td>
                  <td className="um-date">{formatDate(u.created_at)}</td>
                  <td style={{ position: 'relative' }}>
                    <button
                      className="um-action-btn"
                      onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {menuOpen === u.id && (
                      <div style={{
                        position: 'absolute', right: 8, top: '100%', zIndex: 100,
                        background: '#fff', border: '1px solid #e2e8f0',
                        borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.12)',
                        minWidth: 160, overflow: 'hidden',
                      }}>
                        <div style={{ padding: '6px 0' }}>
                          <p style={{ fontSize: '0.72rem', color: '#94a3b8', padding: '4px 14px', fontWeight: 700, textTransform: 'uppercase' }}>Change Role</p>
                          {['child', 'caregiver', 'admin'].filter(r => r !== u.role).map(r => (
                            <button
                              key={r}
                              onClick={() => handleRoleChange(u.id, r)}
                              style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                padding: '8px 14px', background: 'none', border: 'none',
                                cursor: 'pointer', fontSize: '0.85rem', color: '#334155',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >
                              Set as {ROLE_LABELS[r]}
                            </button>
                          ))}
                          <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #f1f5f9' }} />
                          <button
                            onClick={() => { setMenuOpen(null); setConfirmDelete(u); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              width: '100%', textAlign: 'left',
                              padding: '8px 14px', background: 'none', border: 'none',
                              cursor: 'pointer', fontSize: '0.85rem', color: '#ef4444',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <Trash2 size={13} /> Delete User
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Close menu when clicking outside */}
      {menuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => setMenuOpen(null)}
        />
      )}

      <style>{`@keyframes um-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
};

export default UserManagement;
