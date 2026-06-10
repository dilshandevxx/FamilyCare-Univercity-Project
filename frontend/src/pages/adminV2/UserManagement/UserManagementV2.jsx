import React, { useState } from 'react';
import { Search, UserPlus, Trash2, Shield, ToggleLeft, ToggleRight, X, Mail, ShieldCheck, Users } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import './UserManagementV2.css';

const initialUsers = [
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

  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('child');

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

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayoutV2 title="User Management">
      <div className="user-v2-container">
        
        {/* Filter and Search Bar */}
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

        {/* Users Table */}
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
