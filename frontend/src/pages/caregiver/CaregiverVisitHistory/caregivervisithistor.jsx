import React, { useState, useEffect, useRef } from 'react';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import {
  Search, Download, Calendar, ChevronDown, Settings2, Eye,
  TrendingUp, TrendingDown, FileText, ChevronLeft, ChevronRight,
  ShieldAlert, X, Activity, Thermometer, Heart, ClipboardList,
  AlertCircle, RefreshCw,
} from 'lucide-react';
import api from '../../../services/api';
import './CaregiverVisitHistory.css';

const ITEMS_PER_PAGE = 3;

const AVATAR_COLORS = [
  { bg: '#E0F2FE', color: '#0284C7' },
  { bg: '#FFEDD5', color: '#C2410C' },
  { bg: '#DCFCE7', color: '#15803D' },
  { bg: '#F3E8FF', color: '#7E22CE' },
  { bg: '#FEF9C3', color: '#854D0E' },
  { bg: '#FCE7F3', color: '#9D174D' },
];

const getAvatarStyle = (name) => {
  const idx = name ? name.charCodeAt(0) % AVATAR_COLORS.length : 0;
  return AVATAR_COLORS[idx];
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

const normalizeCondition = (raw) => {
  if (!raw) return 'Stable';
  const c = raw.toUpperCase().replace(/_/g, ' ');
  if (c === 'STABLE') return 'Stable';
  if (c === 'CRITICAL') return 'Critical';
  return 'Needs Attention';
};

const conditionClass = (raw) => {
  const n = normalizeCondition(raw);
  if (n === 'Stable') return 'stable';
  if (n === 'Critical') return 'critical';
  return 'needs-attention';
};

// ── Visit Detail Modal ────────────────────────────────────────────
const VisitDetailModal = ({ visit, onClose }) => {
  const avatarStyle = getAvatarStyle(visit.elder_name);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-elder-info">
            <div
              className="elder-avatar modal-avatar"
              style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.color }}
            >
              {getInitials(visit.elder_name)}
            </div>
            <div>
              <h2 className="modal-elder-name">{visit.elder_name}</h2>
              <span className="modal-date">
                {formatDate(visit.logged_at)} at {formatTime(visit.logged_at)}
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-status-row">
            <span className={`condition-pill ${conditionClass(visit.overall_condition)}`}>
              {normalizeCondition(visit.overall_condition)}
            </span>
          </div>

          <div className="modal-vitals-grid">
            <div className="modal-vital-card">
              <Activity size={18} className="vital-icon vital-bp" />
              <span className="vital-label">Blood Pressure</span>
              <span className="vital-value">{visit.blood_pressure || '—'}</span>
            </div>
            <div className="modal-vital-card">
              <Thermometer size={18} className="vital-icon vital-temp" />
              <span className="vital-label">Temperature</span>
              <span className="vital-value">
                {visit.temperature ? `${visit.temperature}°F` : '—'}
              </span>
            </div>
            <div className="modal-vital-card">
              <Heart size={18} className="vital-icon vital-hr" />
              <span className="vital-label">Heart Rate</span>
              <span className="vital-value">
                {visit.heart_rate ? `${visit.heart_rate} bpm` : '—'}
              </span>
            </div>
          </div>

          {(visit.notes || visit.clinical_notes) && (
            <div className="modal-notes-section">
              <div className="modal-section-title">
                <ClipboardList size={15} />
                Clinical Notes
              </div>
              <p className="modal-notes-text">{visit.clinical_notes || visit.notes}</p>
            </div>
          )}

          {visit.mood && (
            <div className="modal-info-row">
              <span className="modal-info-label">Mood</span>
              <span className="modal-info-value">{visit.mood}</span>
            </div>
          )}

          {visit.meds_taken !== null && visit.meds_taken !== undefined && (
            <div className="modal-info-row">
              <span className="modal-info-label">Medications Taken</span>
              <span className={`modal-info-value ${visit.meds_taken ? 'text-green' : 'text-red'}`}>
                {visit.meds_taken ? 'Yes' : 'No'}
              </span>
            </div>
          )}

          {visit.meds_notes && (
            <div className="modal-info-row">
              <span className="modal-info-label">Medication Notes</span>
              <span className="modal-info-value">{visit.meds_notes}</span>
            </div>
          )}

          {visit.meal_status && (
            <div className="modal-info-row">
              <span className="modal-info-label">Meal Status</span>
              <span className="modal-info-value">{visit.meal_status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Skeleton row ──────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr>
    <td><div className="skeleton sk-text" /></td>
    <td>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="skeleton sk-avatar" />
        <div className="skeleton sk-text" style={{ width: 120 }} />
      </div>
    </td>
    <td><div className="skeleton sk-text" style={{ width: 80 }} /></td>
    <td><div className="skeleton sk-pill" /></td>
    <td><div className="skeleton sk-text" style={{ width: 200 }} /></td>
    <td><div className="skeleton sk-icon" /></td>
  </tr>
);

// ── Main component ────────────────────────────────────────────────
const CaregiverVisitHistory = () => {
  const [visits, setVisits]         = useState([]);
  const [total, setTotal]           = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const [search, setSearch]         = useState('');
  const [dateRange, setDateRange]   = useState('last30');
  const [elderId, setElderId]       = useState('all');
  const [condition, setCondition]   = useState('all');

  const [applied, setApplied] = useState({
    dateRange: 'last30', elderId: 'all', condition: 'all', search: '',
  });

  const [eldersList, setEldersList] = useState([]);
  const [trends, setTrends]         = useState({ trends: [], changePercent: 0, currMonth: 0 });
  const [selectedVisit, setSelectedVisit] = useState(null);

  const searchTimer = useRef(null);
  const totalPages  = Math.ceil(total / ITEMS_PER_PAGE);

  // Load elders & trends once
  useEffect(() => {
    api.get('/health/elders-list').then((r) => setEldersList(r.data)).catch(() => {});
    api.get('/health/visit-trends').then((r) => setTrends(r.data)).catch(() => {});
  }, []);

  // Fetch visits on page / filter change
  useEffect(() => { fetchVisits(); }, [currentPage, applied]);

  const fetchVisits = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/health/visit-history', {
        params: {
          page:      currentPage,
          limit:     ITEMS_PER_PAGE,
          dateRange: applied.dateRange,
          elderId:   applied.elderId,
          condition: applied.condition,
          search:    applied.search,
        },
      });
      setVisits(data.visits);
      setTotal(data.total);
    } catch {
      setError('Failed to load visit history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setApplied({ dateRange, elderId, condition, search });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1);
      setApplied((prev) => ({ ...prev, search: val }));
    }, 400);
  };

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  // Build smart pagination pages array
  const getPaginationPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push('...');
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const exportCSV = () => {
    const headers = ['Date', 'Time', 'Elder Name', 'Blood Pressure', 'Temperature', 'Heart Rate', 'Condition', 'Notes'];
    const rows = visits.map((v) => [
      formatDate(v.logged_at),
      formatTime(v.logged_at),
      v.elder_name,
      v.blood_pressure || '',
      v.temperature ? `${v.temperature}F` : '',
      v.heart_rate   ? `${v.heart_rate} bpm` : '',
      normalizeCondition(v.overall_condition),
      (v.notes || v.clinical_notes || '').replace(/,/g, ';'),
    ]);
    const csv  = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `visit-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const rows = visits
      .map(
        (v) => `
      <tr>
        <td>${formatDate(v.logged_at)} ${formatTime(v.logged_at)}</td>
        <td>${v.elder_name}</td>
        <td>${v.blood_pressure || '—'} / ${v.temperature ? v.temperature + '°F' : '—'}</td>
        <td>${normalizeCondition(v.overall_condition)}</td>
        <td>${v.notes || v.clinical_notes || '—'}</td>
      </tr>`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html><head><title>FamilyCare Visit History Report</title>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; color: #334155; }
  h1   { color: #0d9488; }
  table{ width: 100%; border-collapse: collapse; margin-top: 20px; }
  th   { background: #0d9488; color: #fff; padding: 10px; text-align: left; }
  td   { padding: 10px; border-bottom: 1px solid #e2e8f0; }
  tr:nth-child(even) { background: #f8fafc; }
  .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; }
</style>
</head><body>
  <h1>FamilyCare Visit History Report</h1>
  <p>Generated: ${new Date().toLocaleString()} &nbsp;|&nbsp; Total records: ${total}</p>
  <table>
    <thead><tr>
      <th>Date &amp; Time</th><th>Elder Name</th><th>Vitals</th><th>Condition</th><th>Notes</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">FamilyCare Portal — Confidential Health Report</div>
</body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
  };

  const maxTrend = Math.max(...(trends.trends || []).map((t) => Number(t.visits)), 1);

  return (
    <CaregiverLayout title="Visit History">
      <div className="visit-history-container">

        {/* Topbar */}
        <div className="visit-history-topbar">
          <div className="visit-history-search">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by elder name..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="topbar-actions">
            <button className="export-btn" onClick={exportCSV}>
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>

        <div className="visit-history-content">
          {/* Header */}
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
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option value="last7">Last 7 Days</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="last90">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
                <Calendar size={16} className="filter-icon-right" />
              </div>
            </div>

            <div className="filter-group">
              <label>ELDER SELECTION</label>
              <div className="filter-input-wrapper">
                <select value={elderId} onChange={(e) => setElderId(e.target.value)}>
                  <option value="all">All Residents</option>
                  {eldersList.map((el) => (
                    <option key={el.id} value={el.id}>{el.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="filter-icon-right" />
              </div>
            </div>

            <div className="filter-group">
              <label>CONDITION</label>
              <div className="filter-input-wrapper">
                <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option value="all">All Conditions</option>
                  <option value="stable">Stable</option>
                  <option value="needs_attention">Needs Attention / Critical</option>
                </select>
                <Settings2 size={16} className="filter-icon-right" />
              </div>
            </div>

            <button className="apply-btn" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="visit-error-banner">
              <AlertCircle size={16} />
              {error}
              <button className="retry-btn" onClick={fetchVisits}>
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {/* Table */}
          <div className="visit-history-table-wrapper">
            <table className="visit-history-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>ELDER NAME</th>
                  <th>
                    VITALS
                    <br />
                    <span style={{ fontSize: 10 }}>(BP / TEMP)</span>
                  </th>
                  <th>CONDITION</th>
                  <th>NOTES</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonRow key={i} />)
                ) : visits.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <ClipboardList size={40} className="empty-icon" />
                        <p>No visit records found</p>
                        <span>Try adjusting your filters or date range</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visits.map((visit) => {
                    const avatarStyle = getAvatarStyle(visit.elder_name);
                    const noteText    = visit.clinical_notes || visit.notes || '';
                    return (
                      <tr key={visit.id}>
                        <td>
                          <div className="date-cell">
                            <span className="date-main">{formatDate(visit.logged_at)}</span>
                            <span className="date-sub">{formatTime(visit.logged_at)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="elder-cell">
                            <div
                              className="elder-avatar"
                              style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.color }}
                            >
                              {getInitials(visit.elder_name)}
                            </div>
                            <span className="elder-name">{visit.elder_name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="vitals-cell">
                            <div className="vitals-main">
                              <span>BP</span> {visit.blood_pressure || '—'}
                            </div>
                            <div className="vitals-sub">
                              <span>TEMP</span>{' '}
                              {visit.temperature ? `${visit.temperature}°F` : '—'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`condition-pill ${conditionClass(visit.overall_condition)}`}>
                            {normalizeCondition(visit.overall_condition)}
                          </span>
                        </td>
                        <td>
                          <div className="notes-cell">
                            {noteText
                              ? noteText.length > 60
                                ? noteText.slice(0, 60) + '...'
                                : noteText
                              : '—'}
                          </div>
                        </td>
                        <td className="actions-cell">
                          <button
                            className="view-btn"
                            onClick={() => setSelectedVisit(visit)}
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && total > 0 && (
            <div className="visit-history-pagination">
              <div className="pagination-info">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} entries
              </div>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft size={16} />
                </button>

                {getPaginationPages().map((page, i) =>
                  page === '...' ? (
                    <span key={`dots-${i}`} className="page-dots">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Bottom cards */}
          <div className="bottom-cards-container">
            {/* Visit Trends */}
            <div className="visit-trends-card">
              <div className="card-header">
                {trends.changePercent >= 0 ? (
                  <TrendingUp size={20} className="trend-icon" />
                ) : (
                  <TrendingDown size={20} className="trend-icon trend-icon-down" />
                )}
                <h3>Visit Trends</h3>
              </div>
              <p>
                {trends.currMonth > 0 || trends.changePercent !== 0
                  ? `Your visit frequency has ${trends.changePercent >= 0 ? 'increased' : 'decreased'} by ${Math.abs(trends.changePercent)}% this month compared to last month.`
                  : 'No visits recorded this month yet.'}
              </p>
              <div className="trend-bars">
                {trends.trends && trends.trends.length > 0
                  ? trends.trends.slice(-5).map((t, i) => (
                      <div
                        key={i}
                        className="trend-bar"
                        style={{ height: `${Math.max(15, (Number(t.visits) / maxTrend) * 100)}%` }}
                        title={`${t.month}: ${t.visits} visits`}
                      />
                    ))
                  : [30, 40, 20, 60, 100].map((h, i) => (
                      <div key={i} className="trend-bar trend-bar-placeholder" style={{ height: `${h}%` }} />
                    ))}
              </div>
            </div>

            {/* Generate Report */}
            <div className="full-report-card">
              <div className="report-content">
                <h3>Need a full health report?</h3>
                <p>
                  Generate comprehensive history reports for family members or insurance providers
                  in one click.
                </p>
                <button className="generate-btn" onClick={generateReport}>
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

      {/* Visit Detail Modal */}
      {selectedVisit && (
        <VisitDetailModal visit={selectedVisit} onClose={() => setSelectedVisit(null)} />
      )}
    </CaregiverLayout>
  );
};

export default CaregiverVisitHistory;
