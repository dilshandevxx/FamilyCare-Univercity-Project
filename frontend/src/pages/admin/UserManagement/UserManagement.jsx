import React, { useState } from 'react';
import { Search, UserPlus, MoreVertical, Shield } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import './UserManagement.css';

const mockUsers = [
  { id: 1, name: 'James Carter',   email: 'james.carter@email.com',  role: 'Family',    status: 'Active',   joined: 'Jan 12, 2025' },
  { id: 2, name: 'Maria Gonzalez', email: 'maria.g@email.com',       role: 'Caregiver', status: 'Active',   joined: 'Feb 3, 2025'  },
  { id: 3, name: 'Samuel Bright',  email: 'sam.bright@email.com',    role: 'Family',    status: 'Inactive', joined: 'Mar 18, 2025' },
  { id: 4, name: 'Nina Patel',     email: 'nina.patel@email.com',    role: 'Caregiver', status: 'Active',   joined: 'Apr 5, 2025'  },
  { id: 5, name: 'Tom Hughes',     email: 'tom.hughes@email.com',    role: 'Family',    status: 'Active',   joined: 'May 1, 2025'  },
];

const UserManagement = () => {
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter(
    u => u.name.toLowerCase().includes(search.toLowerCase()) ||
         u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="User Management">
      <div className="um-page">
        <div className="um-header">
          <div>
            <h1 className="um-title">User Management</h1>
            <p className="um-subtitle">Manage all registered users on the platform.</p>
          </div>
          <button className="um-add-btn">
            <UserPlus size={15} /> Add New User
          </button>
        </div>

        <div className="um-toolbar">
          <div className="um-search">
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="um-table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
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
                    <span className={`um-role-badge ${u.role.toLowerCase()}`}>
                      <Shield size={11} /> {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`um-status ${u.status.toLowerCase()}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="um-date">{u.joined}</td>
                  <td>
                    <button className="um-action-btn"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
