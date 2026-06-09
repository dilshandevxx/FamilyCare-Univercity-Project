import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, HelpCircle, ShieldAlert, AlertTriangle, Info, CheckCircle2,
  PhoneCall, MessageSquare, ChevronRight, MapPin, Radio, FileText,
  ShieldCheck, RefreshCw, Star
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './Alerts.css';

const Alerts = () => {
  const [parents, setParents] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parentsLoading, setParentsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Fetch parents list
  useEffect(() => {
    const fetchParents = async () => {
      try {
        setParentsLoading(true);
        const { data } = await api.get('/parents');
        setParents(data || []);
      } catch (err) {
        console.error('Error fetching parents:', err);
        setError('Failed to load parents list.');
      } finally {
        setParentsLoading(false);
      }
    };
    fetchParents();
  }, []);

  // 2. Fetch alerts based on selected filters
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      let url = '/alerts?';
      if (selectedParentId && selectedParentId !== 'All') {
        url += `parent_id=${selectedParentId}&`;
      }
      if (selectedType && selectedType !== 'All') {
        url += `type=${selectedType}&`;
      }
      
      const { data } = await api.get(url);
      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to fetch alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [selectedParentId, selectedType]);

  // Mark a single alert as resolved
  const handleResolveAlert = async (id) => {
    try {
      await api.put(`/alerts/${id}/resolve`);
      setSuccessMsg('Alert marked as resolved!');
      // Update local state by removing/resolving the alert
      setAlerts(prev => prev.filter(a => a.id !== id));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error resolving alert:', err);
      setError('Failed to resolve alert.');
    }
  };

  // Mark all as read (simulated)
  const handleMarkAllRead = () => {
    setAlerts([]);
    setSuccessMsg('All alerts marked as read.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Broadcast alert (simulated)
  const handleBroadcastAlert = () => {
    alert('📢 Broadcasting critical emergency alert to all registered caregivers and family members...');
  };

  // Call Emergency (simulated)
  const handleCallEmergency = () => {
    alert('🚨 Dialing Emergency Services (911) and notifying responders immediately...');
  };

  // Filtered lists for widgets
  const unresolvedAlerts = alerts.filter(a => !a.is_resolved);
  const criticalAlertsCount = unresolvedAlerts.filter(a => a.type === 'critical').length;

  return (
    <ChildLayout title="Alerts">
      <div className="al-container">

        {/* BREADCRUMB & HEADER */}
        <div className="al-header-row">
          <div className="al-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span className="al-bc-separator">&gt;</span>
            <span className="al-bc-active">Alerts</span>
          </div>
          
          <div className="al-header-search">
            <input type="text" placeholder="Search health logs..." />
            <div className="al-header-icons">
              <button className="al-h-icon-btn"><Bell size={18} /></button>
              <button className="al-h-icon-btn"><HelpCircle size={18} /></button>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Family" alt="avatar" className="al-user-avatar" />
            </div>
          </div>
        </div>

        {/* PAGE TITLE */}
        <h2 className="al-page-title">Alerts</h2>

        {/* SUCCESS / ERROR ALERTS */}
        {successMsg && (
          <div className="al-feedback-banner success">
            <CheckCircle2 size={16} /> <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="al-feedback-banner error">
            <ShieldAlert size={16} /> <span>{error}</span>
          </div>
        )}

        {/* FILTER BAR */}
        <div className="al-filter-bar">
          <div className="al-filters-left">
            <select value={selectedParentId} onChange={(e) => setSelectedParentId(e.target.value)}>
              <option value="All">All Parents</option>
              {parents.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="All">Type: All</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <button onClick={handleMarkAllRead} className="al-mark-read-btn">
            Mark All as Read
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="al-grid">
          
          {/* COLUMN 1 - ALERTS FEED */}
          <div className="al-feed-column">
            <h4 className="al-section-lbl">Today — Aug 24</h4>

            {loading ? (
              <div className="al-loader">
                <RefreshCw className="al-spinner" size={24} />
                <p>Fetching active alerts...</p>
              </div>
            ) : unresolvedAlerts.length === 0 ? (
              <div className="al-empty-state">
                <ShieldCheck size={48} className="al-shield-success" />
                <h3>No active alerts!</h3>
                <p>All parents are currently stable and no warning indicators are active.</p>
              </div>
            ) : (
              unresolvedAlerts.map(alert => {
                const isCritical = alert.type === 'critical';
                const isWarning = alert.type === 'warning';
                const timeStr = new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={alert.id} className={`al-card border-${alert.type}`}>
                    <div className="al-card-icon-wrapper">
                      {isCritical && <ShieldAlert size={20} className="icon-critical" />}
                      {isWarning && <AlertTriangle size={20} className="icon-warning" />}
                      {!isCritical && !isWarning && <Info size={20} className="icon-info" />}
                    </div>

                    <div className="al-card-content">
                      <div className="al-card-header">
                        <div>
                          <h3 className="al-alert-title">{alert.title}</h3>
                          <p className="al-alert-meta">
                            {alert.relation || 'Mother'} ({alert.parent_name || 'Eleanor'}) • {timeStr}
                          </p>
                        </div>
                        <span className={`al-badge badge-${alert.type}`}>
                          {alert.type.toUpperCase()}
                        </span>
                      </div>

                      <p className="al-alert-desc">{alert.description}</p>

                      <div className="al-card-actions">
                        {isCritical && (
                          <>
                            <button onClick={handleCallEmergency} className="al-action-btn emergency">
                              Call Emergency
                            </button>
                            <Link to="/messages" className="al-action-btn secondary">
                              Contact Caregiver
                            </Link>
                          </>
                        )}

                        {isWarning && (
                          <>
                            <button onClick={() => handleResolveAlert(alert.id)} className="al-action-btn resolve">
                              Mark Resolved
                            </button>
                            <button className="al-action-btn secondary">
                              Notify {alert.parent_name || 'Robert'}
                            </button>
                          </>
                        )}

                        {!isCritical && !isWarning && (
                          <Link to="/dashboard" className="al-action-btn text-link">
                            View Sleep Analytics
                          </Link>
                        )}
                        
                        <span className="al-details-link">Details</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* COLUMN 2 - SIDEBAR WIDGETS */}
          <div className="al-sidebar-column">
            
            {/* Active Alerts Widget */}
            <div className="al-widget">
              <span className="al-widget-lbl">Active Alerts</span>
              <div className="al-stat-row">
                <h2>{String(unresolvedAlerts.length).padStart(2, '0')}</h2>
                <p className="al-stat-trend">+2 from yesterday</p>
              </div>
            </div>

            {/* Critical Widget */}
            <div className="al-widget widget-critical-bg">
              <div className="al-widget-hdr-row">
                <span className="al-widget-lbl white-text">CRITICAL</span>
                <ShieldAlert size={16} className="white-text" />
              </div>
              <div className="al-stat-row">
                <h2 className="white-text">{String(criticalAlertsCount).padStart(2, '0')}</h2>
              </div>
              <p className="al-widget-desc white-text">
                High priority response required for Heart Rate event.
              </p>
            </div>

            {/* Caregiver On-Call Widget */}
            <div className="al-widget black-bg">
              <span className="al-widget-lbl opacity-light">Caregiver On-Call</span>
              <h3 className="al-cg-name">Dr. Sarah Jenkins</h3>
              
              <div className="al-cg-avatars-row">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="cg" />
                <span className="al-cg-plus-badge">+1</span>
              </div>

              <button onClick={handleBroadcastAlert} className="al-broadcast-btn">
                <Radio size={14} /> BROADCAST ALERT
              </button>
            </div>

            {/* Map Location Widget */}
            <div className="al-widget map-widget">
              <div className="al-map-placeholder">
                <MapPin size={24} className="al-map-pin" />
                <div className="al-map-labels">
                  <span className="al-map-title">LAST KNOWN LOCATION</span>
                  <span className="al-map-subtitle">Eleanor's Home, Austin</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="al-widget">
              <span className="al-widget-lbl">Quick Links</span>
              <ul className="al-quick-links">
                <li>
                  <a href="#records">
                    <FileText size={14} /> Hospital Records
                  </a>
                </li>
                <li>
                  <a href="#insurance">
                    <ShieldCheck size={14} /> Insurance Provider
                  </a>
                </li>
                <li>
                  <a href="#history">
                    <RefreshCw size={14} /> Alert History (30d)
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </ChildLayout>
  );
};

export default Alerts;
