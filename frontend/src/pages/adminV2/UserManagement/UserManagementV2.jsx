import React, { useState } from 'react';
import { Search, UserPlus, Trash2, ToggleLeft, ToggleRight, X, Mail, ShieldCheck, Users, CheckCircle, XCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import './UserManagementV2.css';

const initialUsers = [
  // Pending users
  { id: 101, name: 'Emily Vance', email: 'emily.v@email.com', role: 'child', status: 'pending', joined: 'Just now', 
    associatedElder: 'Eleanor Vance', relationship: 'Granddaughter', phone: '+1 555-0128', backgroundCheck: 'N/A', certifications: 'None', notes: 'Would like access to grandmother\'s health updates.' },
  { id: 102, name: 'Marcus Johnson', email: 'marcus.j@care.com', role: 'caregiver', status: 'pending', joined: '2 hours ago', 
    associatedElder: 'Any Available', relationship: 'Professional', phone: '+1 555-0193', backgroundCheck: 'Cleared', certifications: 'CNA, CPR Certified', notes: 'Available for night shifts.' },
  
  // Existing users
  { id: 1, name: 'Clara Oswald', email: 'clara@care.com', role: 'caregiver', status: 'active', joined: 'Jan 10, 2026' },
  { id: 2, name: 'Rithwik Sen', email: 'rithwik@familycare.com', role: 'admin', status: 'active', joined: 'Dec 15, 2025' },
  { id: 3, name: 'Alice Smith', email: 'alice@family.com', role: 'child', status: 'active', joined: 'Mar 02, 2026' },
  { id: 4, name: 'Bob Johnson', email: 'bob@caregiver.com', role: 'caregiver', status: 'suspended', joined: 'Feb 18, 2026' },
  { id: 5, name: 'Sarah Connor', email: 'sarah@family.com', role: 'child', status: 'active', joined: 'Mar 08, 2026' }
];

const UserManagementV2 = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [reviewUser, setReviewUser] = useState(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('child');

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeOrSuspendedUsers = users.filter(u => u.status !== 'pending');

  const filteredUsers = activeOrSuspendedUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  const handleApprove = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'active', joined: 'Today' } : u));
    setReviewUser(null);
  };

  const handleReject = (id) => {
    setUsers(users.filter(u => u.id !== id));
    setReviewUser(null);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser = {
      id: Date.now(),
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'active',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setUsers([newUser, ...users]);
    setNewName('');
    setNewEmail('');
    setNewRole('child');
    setShowAddModal(false);
  };

  return (
    <AdminLayoutV2 title="User Management">
      <div className="user-v2-container">
        
        {/* Pending Approvals Section */}
        {pendingUsers.length > 0 && (
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
              {filteredUsers.length === 0 ? (
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
                        {u.status !== 'pending' && (
                          <button 
                            className="action-btn toggle-btn" 
                            onClick={() => toggleStatus(u.id)}
                            title={u.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                          >
                            {u.status === 'active' ? (
                              <ToggleRight size={22} color="#00A896" />
                            ) : (
                              <ToggleLeft size={22} color="#94A3B8" />
                            )}
                          </button>
                        )}
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
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutV2>
  );
};

export default UserManagementV2;
