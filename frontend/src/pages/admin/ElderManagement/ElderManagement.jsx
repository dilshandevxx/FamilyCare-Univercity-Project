import React, { useState } from 'react';
import { Search, Heart, MapPin, User } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import './ElderManagement.css';

const mockElders = [
  { id: 1, name: 'Martha K.',    age: 82, zone: 'Zone 4', caregiver: 'Elena Rossi',    condition: 'High BP',       status: 'Critical' },
  { id: 2, name: 'George P.',    age: 78, zone: 'Zone 1', caregiver: 'David Kim',      condition: 'Diabetes',      status: 'Stable'   },
  { id: 3, name: 'Alice W.',     age: 90, zone: 'Zone 2', caregiver: 'Amara Johnson',  condition: 'Dementia',      status: 'Stable'   },
  { id: 4, name: 'Robert H.',    age: 75, zone: 'Zone 3', caregiver: 'Luis Morales',   condition: 'Heart Disease', status: 'Warning'  },
  { id: 5, name: 'Dorothy M.',   age: 88, zone: 'Zone 1', caregiver: 'Priya Sharma',   condition: 'Arthritis',     status: 'Stable'   },
  { id: 6, name: 'Frank L.',     age: 83, zone: 'Zone 2', caregiver: 'Fatima Al-Saud', condition: 'COPD',          status: 'Warning'  },
];

const statusColors = {
  Stable:   { bg: '#f0fdf4', color: '#16a34a' },
  Warning:  { bg: '#fef3c7', color: '#b45309' },
  Critical: { bg: '#fef2f2', color: '#dc2626' },
};

const ElderManagement = () => {
  const [search, setSearch] = useState('');

  const filtered = mockElders.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.caregiver.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Elder Management">
      <div className="em-page">
        <div className="em-header">
          <div>
            <h1 className="em-title">Elder Management</h1>
            <p className="em-subtitle">Overview of all registered elders and their care status.</p>
          </div>
          <div className="em-total-badge">
            <Heart size={14} /> {mockElders.length} Active Elders
          </div>
        </div>

        <div className="em-search-wrap">
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search elders or caregivers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="em-grid">
          {filtered.map(e => {
            const s = statusColors[e.status];
            return (
              <div key={e.id} className="em-card">
                <div className="em-card-head">
                  <div className="em-avatar">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(e.name)}&hair=short`}
                      alt={e.name}
                    />
                  </div>
                  <div className="em-info">
                    <p className="em-name">{e.name}</p>
                    <p className="em-age">Age {e.age}</p>
                  </div>
                  <span
                    className="em-status"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {e.status}
                  </span>
                </div>

                <div className="em-details">
                  <div className="em-detail-row">
                    <MapPin size={12} />
                    <span>{e.zone}</span>
                  </div>
                  <div className="em-detail-row">
                    <User size={12} />
                    <span>{e.caregiver}</span>
                  </div>
                  <div className="em-detail-row">
                    <Heart size={12} />
                    <span>{e.condition}</span>
                  </div>
                </div>

                <button className="em-view-btn">View Full Profile</button>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ElderManagement;
