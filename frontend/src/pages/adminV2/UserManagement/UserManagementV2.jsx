import React, { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus, Trash2, X, Mail, ShieldCheck, Users, CheckCircle, XCircle, Clock, FileText, AlertCircle, Loader2 } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import api from '../../../services/api';
import './UserManagementV2.css';

const UserManagementV2 = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [reviewUser, setReviewUser] = useState(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('child');

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: 'active',
        joined: new Date(u.created_at || u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      })));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, []);

  const fetchPending = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/caregivers/pending');
      setPendingUsers(data.map(c => ({
        id: c.id,
        name: c.user_name || c.name || 'Unknown',
        email: c.email || '',
        role: 'caregiver',
        status: 'pending',
        joined: new Date(c.created_at || c.createdAt || Date.now()).toLocaleDateString(),
        associatedElder: 'N/A',
        relationship: 'Professional',
        phone: c.phone || 'N/A',
        backgroundCheck: 'Pending',
        certifications: c.certification || c.certifications?.join(', ') || 'None',
        notes: `Experience: ${c.experience_years || c.experienceYears} years.`
      })));
    } catch (error) {
      console.error('Failed to fetch pending caregivers:', error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchPending()]);
      setLoading(false);
    };
    loadData();
  }, [fetchUsers, fetchPending]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/caregivers/${id}/approve`);
      setReviewUser(null);
      fetchPending();
      fetchUsers();
    } catch (err) {
      alert('Failed to approve.');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/caregivers/${id}/reject`);
      setReviewUser(null);
      fetchPending();
    } catch (err) {
      alert('Failed to reject.');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    try {
      await api.post('/admin/users', {
        name: newName,
        email: newEmail,
        password: 'Password123!', 
        role: newRole
      });
      setShowAddModal(false);
      setNewName('');
      setNewEmail('');
      setNewRole('child');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <AdminLayoutV2 title="User Management">
      <div className="user-v2-container">
        
        {/* Pending Approvals Section */}
        {!loading && pendingUsers.length > 0 && (
          <div className="user-v2-pending-section">
            <div className="section-header">
              <AlertCircle size={20} color="#EA580C" />
              <h3>Action Required: Pending Approvals ({pendingUsers.length})</h3>
            </div>
            
            <div className="pending-grid">
              {pendingUsers.map(u => (
                <div key={u.id} className="pending-card">
                  <div className="pending-card-glow"></div>
                  <div className="pending-header">
                    <div className="pending-avatar">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4>{u.name}</h4>
                      <p className="pending-role">Requested Role: <span className={`role-text role-${u.role}`}>{u.role}</span></p>
                    </div>
                  </div>
                  
                  <div className="pending-quick-info">
                    <div className="info-row">
                      <Clock size={14} /> <span>Applied: {u.joined}</span>
                    </div>
                    <div className="info-row">
                      <Mail size={14} /> <span>{u.email}</span>
                    </div>
                  </div>

                  <button className="review-btn" onClick={() => setReviewUser(u)}>
                    <FileText size={16} />
                    Review Application
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter and Search Bar for Active Users */}
        <div className="user-v2-header-actions">
          <div className="user-v2-search-group">
            <div className="user-v2-search-input">
              <Search size={18} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search user by name or email..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="user-v2-filter-select"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="caregiver">Caregiver</option>
              <option value="child">Family Member (Child)</option>
            </select>
          </div>
          
          <button className="user-v2-add-btn" onClick={() => setShowAddModal(true)}>
            <UserPlus size={16} />
            Add User Account
          </button>
        </div>

        {/* Active/Suspended Users Table */}
        <div className="user-v2-table-wrapper">
          <table className="user-v2-table">
            <thead>
              <tr>
                <th>Name / Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                      <Loader2 className="animate-spin" size={32} color="#00A896" />
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="no-records-cell">
                      <div className="no-records-icon-wrapper">
                        <Users size={56} color="#94A3B8" />
                      </div>
                      <h3>No Users Found</h3>
                      <p>Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-v2-name-cell">
                        <div className="user-v2-avatar-circle">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="user-v2-name">{u.name}</p>
                          <p className="user-v2-email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`user-v2-role-pill role-${u.role}`}>
                        {u.role === 'child' ? 'Family Member' : u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`user-v2-status-pill status-${u.status}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>{u.joined}</td>
                    <td>
                      <div className="user-v2-actions-cell">
                        <button 
                          className="action-btn delete-btn" 
                          onClick={() => handleDelete(u.id)}
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Application Review Modal */}
        {reviewUser && (
          <div className="user-v2-modal-overlay" onClick={() => setReviewUser(null)}>
            <div className="user-v2-modal review-modal" onClick={e => e.stopPropagation()}>
              <button className="user-v2-modal-close" onClick={() => setReviewUser(null)}>
                <X size={20} />
              </button>

              <div className="user-v2-modal-header review-header">
                <div className="user-v2-modal-icon review-icon">
                  <UserPlus size={28} color="white" />
                </div>
                <div>
                  <h2 className="user-v2-modal-title">Review Application</h2>
                  <p className="user-v2-modal-desc">Submitted by {reviewUser.name} on {reviewUser.joined}</p>
                </div>
              </div>

              <div className="user-v2-modal-body">
                <div className="review-grid">
                  <div className="review-box">
                    <span className="label">Requested Role</span>
                    <span className={`value role-text role-${reviewUser.role}`}>{reviewUser.role.toUpperCase()}</span>
                  </div>
                  <div className="review-box">
                    <span className="label">Email Address</span>
                    <span className="value">{reviewUser.email}</span>
                  </div>
                  <div className="review-box">
                    <span className="label">Phone Number</span>
                    <span className="value">{reviewUser.phone}</span>
                  </div>
                  <div className="review-box">
                    <span className="label">Background Check</span>
                    <span className={`value ${reviewUser.backgroundCheck === 'Cleared' ? 'text-teal' : 'text-warning'}`}>{reviewUser.backgroundCheck}</span>
                  </div>
                </div>

                <div className="review-details-list">
                  <div className="review-item">
                    <span className="label">Associated Elder:</span>
                    <span className="value">{reviewUser.associatedElder}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Relationship:</span>
                    <span className="value">{reviewUser.relationship}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Certifications:</span>
                    <span className="value">{reviewUser.certifications}</span>
                  </div>
                </div>

                <div className="applicant-notes-box">
                  <h5>Applicant Notes</h5>
                  <p>{reviewUser.notes}</p>
                </div>
              </div>

              <div className="review-modal-actions">
                <button className="reject-btn" onClick={() => handleReject(reviewUser.id)}>
                  <XCircle size={18} /> Reject
                </button>
                <button className="approve-btn" onClick={() => handleApprove(reviewUser.id)}>
                  <CheckCircle size={18} /> Approve Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div className="user-v2-modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="user-v2-modal" onClick={e => e.stopPropagation()}>
              <button className="user-v2-modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>

              <form onSubmit={handleAddUser}>
                <div className="user-v2-modal-header">
                  <div className="user-v2-modal-icon">
                    <ShieldCheck size={24} color="#00A896" />
                  </div>
                  <div>
                    <h2 className="user-v2-modal-title">Create User Account</h2>
                    <p className="user-v2-modal-desc">Add a new account directly to the system registry.</p>
                  </div>
                </div>

                <div className="user-v2-modal-body">
                  <div className="user-v2-form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="user-v2-form-group">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-icon" />
                      <input 
                        type="email" 
                        placeholder="e.g. john@example.com"
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="user-v2-form-group">
                    <label>Account Role</label>
                    <select 
                      value={newRole}
                      onChange={e => setNewRole(e.target.value)}
                    >
                      <option value="child">Family Member (Child)</option>
                      <option value="caregiver">Professional Caregiver</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </div>

                  <div className="user-v2-modal-actions">
                    <button type="button" className="user-v2-modal-cancel" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="user-v2-modal-submit">
                      Create User
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutV2>
  );
};

export default UserManagementV2;
