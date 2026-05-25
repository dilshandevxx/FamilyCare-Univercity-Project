import React, { useState } from 'react';
import { Activity, Search, Filter } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import './AdminHealthLogs.css';

const mockLogs = [
  { id: 1, elder: 'Martha K.',  caregiver: 'Elena Rossi',    type: 'Blood Pressure', value: '158/95 mmHg', flag: 'Critical', date: 'Today, 09:15 AM' },
  { id: 2, elder: 'George P.',  caregiver: 'David Kim',      type: 'Blood Glucose',  value: '126 mg/dL',   flag: 'Warning',  date: 'Today, 08:40 AM' },
  { id: 3, elder: 'Alice W.',   caregiver: 'Amara Johnson',  type: 'Vitals Check',   value: 'Normal',      flag: 'Normal',   date: 'Today, 08:00 AM' },
  { id: 4, elder: 'Robert H.',  caregiver: 'Luis Morales',   type: 'Heart Rate',     value: '98 bpm',      flag: 'Warning',  date: 'Yesterday, 7 PM' },
  { id: 5, elder: 'Dorothy M.', caregiver: 'Priya Sharma',   type: 'Vitals Check',   value: 'Normal',      flag: 'Normal',   date: 'Yesterday, 4 PM' },
  { id: 6, elder: 'Frank L.',   caregiver: 'Fatima Al-Saud', type: 'Oxygen Saturation', value: '91%',      flag: 'Critical', date: 'Yesterday, 2 PM' },
];

const flagColors = {
  Normal:   { bg: '#f0fdf4', color: '#16a34a' },
  Warning:  { bg: '#fef3c7', color: '#b45309' },
  Critical: { bg: '#fef2f2', color: '#dc2626' },
};

const AdminHealthLogs = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = mockLogs.filter(l => {
    const matchSearch = l.elder.toLowerCase().includes(search.toLowerCase()) ||
                        l.caregiver.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || l.flag === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout title="Health Logs">
      <div className="ahl-page">
        <div className="ahl-header">
          <div>
            <h1 className="ahl-title">Health Logs</h1>
            <p className="ahl-subtitle">185 logs recorded today across all zones.</p>
          </div>
          <div className="ahl-stat-pill">
            <Activity size={14} /> 185 Today
          </div>
        </div>

        <div className="ahl-toolbar">
          <div className="ahl-search">
            <Search size={14} color="#94a3b8" />
            <input
              placeholder="Search by elder or caregiver..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="ahl-filters">
            {['All', 'Normal', 'Warning', 'Critical'].map(f => (
              <button
                key={f}
                className={`ahl-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                <Filter size={11} /> {f}
              </button>
            ))}
          </div>
        </div>

        <div className="ahl-table-wrap">
          <table className="ahl-table">
            <thead>
              <tr>
                <th>Elder</th>
                <th>Caregiver</th>
                <th>Log Type</th>
                <th>Value</th>
                <th>Status</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => {
                const f = flagColors[l.flag];
                return (
                  <tr key={l.id}>
                    <td className="ahl-td-name">{l.elder}</td>
                    <td className="ahl-td-sub">{l.caregiver}</td>
                    <td className="ahl-td-sub">{l.type}</td>
                    <td className="ahl-td-val">{l.value}</td>
                    <td>
                      <span className="ahl-flag" style={{ background: f.bg, color: f.color }}>
                        {l.flag}
                      </span>
                    </td>
                    <td className="ahl-td-sub">{l.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHealthLogs;
