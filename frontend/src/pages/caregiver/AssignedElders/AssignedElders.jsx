import React, { useState } from 'react';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import { Search, Filter, Eye, FilePlus, Heart, Activity, Thermometer, ChevronLeft, ChevronRight, HelpCircle, Plus, ChevronDown } from 'lucide-react';
import './AssignedElders.css';

const mockElders = [
  {
    id: 'FC-9021',
    name: 'Arthur Jenkins',
    age: 82,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arthur',
    status: 'CRITICAL',
    heartRate: '104',
    bp: '158/95',
    temp: '99.1',
    condition: 'Congestive Heart Failure',
    lastUpdate: '12 mins ago',
  },
  {
    id: 'FC-1154',
    name: 'Martha Stewart',
    age: 76,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Martha',
    status: 'NEEDS ATTENTION',
    heartRate: '78',
    bp: '132/84',
    temp: '98.6',
    condition: 'Type 2 Diabetes',
    lastUpdate: '2 hours ago',
  },
  {
    id: 'FC-2281',
    name: 'George Miller',
    age: 89,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=George',
    status: 'STABLE',
    heartRate: '72',
    bp: '120/80',
    temp: '98.4',
    condition: 'Post-Op Recovery',
    lastUpdate: '5 hours ago',
  }
];

const getStatusClass = (status) => {
  switch (status) {
    case 'CRITICAL': return 'status-critical';
    case 'NEEDS ATTENTION': return 'status-needs-attention';
    case 'STABLE': return 'status-stable';
    default: return '';
  }
};

const getMobileBorderClass = (status) => {
  switch (status) {
    case 'CRITICAL': return 'status-border-critical';
    case 'NEEDS ATTENTION': return 'status-border-needs-attention';
    case 'STABLE': return 'status-border-stable';
    default: return '';
  }
};

const AssignedElders = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <CaregiverLayout title="Assigned Elders">
      <div className="assigned-elders-container">
        
        {/* Header Area */}
        <div className="ae-header-area">
          <div className="ae-header-left">
            <div className="ae-breadcrumbs">
              <span>Dashboard</span>
              <span>›</span>
              <span className="active">Assigned Elders</span>
            </div>
            <h1 className="ae-title">Assigned Elders</h1>
            <p className="ae-subtitle">Managing care for 12 individuals across the district.</p>
          </div>
          
          <div className="ae-header-actions">
            <button className="btn-icon-only">
              <HelpCircle size={20} />
            </button>
            <button className="btn-primary-teal">
              <Plus size={18} /> Add Health Log
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="ae-filters-bar">
          <div className="ae-search-wrapper">
            <Search className="ae-search-icon" />
            <input
              type="text"
              className="ae-search-input"
              placeholder="Search by name or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="ae-filters-right">
            <div className="ae-select-wrapper">
              <select className="ae-select">
                <option>Status: All</option>
                <option>Critical</option>
                <option>Needs Attention</option>
                <option>Stable</option>
              </select>
              <ChevronDown className="ae-select-icon" />
            </div>
            
            <button className="btn-outline">
              Age Range
            </button>
            
            <button className="btn-filter-dark">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Grid of Elders */}
        <div className="ae-grid">
          {mockElders.map((elder) => {
            const isCritical = elder.status === 'CRITICAL';
            const isAttention = elder.status === 'NEEDS ATTENTION';
            
            return (
              <div key={elder.id} className={`elder-card ${getMobileBorderClass(elder.status)}`}>
                
                {/* Header */}
                <div className="elder-header">
                  <div className="elder-info-main">
                    <div className="elder-avatar">
                      <img src={elder.image} alt={elder.name} />
                    </div>
                    <div>
                      <h3 className="elder-name">{elder.name}</h3>
                      <p className="elder-meta">
                        {elder.age} years old <span className="desktop-id">• ID: {elder.id}</span>
                        <span className="mobile-condition">{elder.condition}</span>
                      </p>
                    </div>
                  </div>
                  <div className={`status-pill ${getStatusClass(elder.status)}`}>
                    <div className="status-dot"></div>
                    <span>{elder.status}</span>
                  </div>
                </div>

                {/* Desktop BP/Temp Info Boxes */}
                <div className="elder-metrics-desktop">
                  <div className="metric-box">
                    <p className="metric-label">Last BP</p>
                    <p className="metric-value">
                      <span className={isCritical ? 'critical-val' : ''}>{elder.bp.split('/')[0]}</span>
                      <span className="metric-sub">/{elder.bp.split('/')[1]}</span>
                      <span className="metric-unit">mmHg</span>
                    </p>
                  </div>
                  <div className="metric-box">
                    <p className="metric-label">Temperature</p>
                    <p className="metric-value">
                      {elder.temp} <span className="metric-unit">°F</span>
                    </p>
                  </div>
                </div>

                {/* Mobile Heart/BP/Temp Row */}
                <div className="elder-metrics-mobile">
                  <div className="mobile-metric">
                    <Heart className="mobile-metric-icon" />
                    <p className={`mobile-metric-val ${isCritical ? 'critical-val' : ''}`}>{elder.heartRate} bpm</p>
                    <p className="mobile-metric-label">Heart Rate</p>
                  </div>
                  <div className="mobile-metric-divider"></div>
                  <div className="mobile-metric">
                    <Activity className="mobile-metric-icon" />
                    <p className={`mobile-metric-val ${isAttention ? 'attention-val' : ''}`}>{elder.bp}</p>
                    <p className="mobile-metric-label">BP</p>
                  </div>
                  <div className="mobile-metric-divider"></div>
                  <div className="mobile-metric">
                    <Thermometer className="mobile-metric-icon" />
                    <p className="mobile-metric-val">{elder.temp}°F</p>
                    <p className="mobile-metric-label">Temp</p>
                  </div>
                </div>

                {/* Desktop Condition/Update */}
                <div className="elder-details-list">
                  <div className="detail-row">
                    <span className="detail-label">Condition</span>
                    <span className="detail-value">{elder.condition}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Update</span>
                    <span className="detail-value">{elder.lastUpdate}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="elder-actions">
                  <button className="btn-secondary">
                    <Eye size={16} /> View Details
                  </button>
                  <button className="btn-primary-card">
                    <FilePlus size={16} /> Add Log
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="ae-pagination">
          <p className="pagination-text">Showing <span>3</span> of <span>12</span> elders</p>
          
          <div className="pagination-controls">
            <button className="page-btn">
              <ChevronLeft size={16} />
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </CaregiverLayout>
  );
};

export default AssignedElders;
