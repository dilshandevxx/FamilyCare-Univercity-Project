import React, { useState } from 'react';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Download, 
  Calendar, 
  ChevronDown, 
  Settings2, 
  Eye, 
  TrendingUp, 
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import './CaregiverVisitHistory.css';

const CaregiverVisitHistory = () => {
  // Mock data based on the design
  const visits = [
    {
      id: 1,
      date: "Oct 24, 2023",
      time: "09:15 AM",
      elderName: "Albert Henderson",
      initials: "AH",
      avatarBg: "#E0F2FE", // light blue
      avatarColor: "#0284C7", // dark blue
      bp: "120/80",
      temp: "98.6°F",
      condition: "Stable",
      notes: "Patient was alert and communicative during..."
    },
    {
      id: 2,
      date: "Oct 23, 2023",
      time: "02:30 PM",
      elderName: "Margaret Rose",
      initials: "MR",
      avatarBg: "#FFEDD5", // light orange
      avatarColor: "#C2410C", // dark orange
      bp: "145/95",
      temp: "100.2°F",
      condition: "Needs Attention",
      notes: "Mild fever reported. BP elevated. Schedulec..."
    },
    {
      id: 3,
      date: "Oct 22, 2023",
      time: "11:00 AM",
      elderName: "Edward Thompson",
      initials: "ET",
      avatarBg: "#DCFCE7", // light green
      avatarColor: "#15803D", // dark green
      bp: "118/78",
      temp: "98.4°F",
      condition: "Stable",
      notes: "Physical therapy session completed succes..."
    }
  ];

  return (
    <CaregiverLayout title="Visit History">
      <div className="visit-history-container">
      {/* Top Navigation Bar */}
      <div className="visit-history-topbar">
        <div className="visit-history-search">
          <Search className="search-icon" />
          <input type="text" placeholder="Search by elder name..." />
        </div>
        <div className="topbar-actions">
          <button className="icon-btn">
            <Bell size={20} />
          </button>
          <button className="icon-btn">
            <HelpCircle size={20} />
          </button>
          <button className="export-btn">
            <Download size={16} />
            Export Data
          </button>
        </div>
      </div>

      <div className="visit-history-content">
        {/* Header Area */}
        <div className="visit-history-header">
          <div className="breadcrumbs">
            <span>DASHBOARD</span> &gt; VISIT HISTORY
          </div>
          <h1 className="visit-history-title">Visit History</h1>
        </div>

        {/* Filters */}
        <div className="visit-history-filters">
          <div className="filter-group">
            <label>DATE RANGE</label>
            <div className="filter-input-wrapper">
              <select defaultValue="last30">
                <option value="last30">Last 30 Days</option>
                <option value="last7">Last 7 Days</option>
                <option value="all">All Time</option>
              </select>
              <Calendar size={16} className="filter-icon-right" />
            </div>
          </div>
          
          <div className="filter-group">
            <label>ELDER SELECTION</label>
            <div className="filter-input-wrapper">
              <select defaultValue="all">
                <option value="all">All Residents</option>
                <option value="albert">Albert Henderson</option>
                <option value="margaret">Margaret Rose</option>
              </select>
              <ChevronDown size={16} className="filter-icon-right" />
            </div>
          </div>

          <div className="filter-group">
            <label>CONDITION</label>
            <div className="filter-input-wrapper">
              <select defaultValue="stable_critical">
                <option value="stable_critical">Stable & Critical</option>
                <option value="stable">Stable</option>
                <option value="critical">Critical / Needs Attention</option>
              </select>
              <Settings2 size={16} className="filter-icon-right" />
            </div>
          </div>

          <button className="apply-btn">
            Apply Filters
          </button>
        </div>

        {/* Table */}
        <div className="visit-history-table-wrapper">
          <table className="visit-history-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>ELDER NAME</th>
                <th>VITALS<br/><span style={{fontSize: '10px'}}>(BP/TEMP)</span></th>
                <th>CONDITION</th>
                <th>NOTES</th>
                <th style={{textAlign: 'right'}}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id}>
                  <td>
                    <div className="date-cell">
                      <span className="date-main">{visit.date}</span>
                      <span className="date-sub">{visit.time}</span>
                    </div>
                  </td>
                  <td>
                    <div className="elder-cell">
                      <div 
                        className="elder-avatar" 
                        style={{ backgroundColor: visit.avatarBg, color: visit.avatarColor }}
                      >
                        {visit.initials}
                      </div>
                      <span className="elder-name">{visit.elderName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="vitals-cell">
                      <div className="vitals-main">
                        <span>BP</span> {visit.bp}
                      </div>
                      <div className="vitals-sub">
                        <span>TEMP</span> {visit.temp}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`condition-pill ${visit.condition === 'Stable' ? 'stable' : 'needs-attention'}`}>
                      {visit.condition}
                    </span>
                  </td>
                  <td>
                    <div className="notes-cell">
                      {visit.notes}
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button className="view-btn">
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="visit-history-pagination">
          <div className="pagination-info">
            Showing 1 to 3 of 48 entries
          </div>
          <div className="pagination-controls">
            <button className="page-btn" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">...</span>
            <button className="page-btn">16</button>
            <button className="page-btn">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="bottom-cards-container">
          <div className="visit-trends-card">
            <div className="card-header">
              <TrendingUp size={20} className="trend-icon" />
              <h3>Visit Trends</h3>
            </div>
            <p>Your visit frequency has increased by 12% this month compared to September.</p>
            <div className="trend-bars">
              <div className="trend-bar"></div>
              <div className="trend-bar"></div>
              <div className="trend-bar"></div>
              <div className="trend-bar"></div>
              <div className="trend-bar"></div>
            </div>
          </div>

          <div className="full-report-card">
            <div className="report-content">
              <h3>Need a full health report?</h3>
              <p>Generate comprehensive history reports for family members or insurance providers in one click.</p>
              <button className="generate-btn">
                <FileText size={16} />
                Generate Master Report
              </button>
            </div>
            <div className="report-graphic">
              <div className="report-graphic-inner">
                <ShieldAlert className="report-graphic-icon" />
              </div>
            </div>
          </div>
        </div>
        
      </div>
      </div>
    </CaregiverLayout>
  );
};

export default CaregiverVisitHistory;
