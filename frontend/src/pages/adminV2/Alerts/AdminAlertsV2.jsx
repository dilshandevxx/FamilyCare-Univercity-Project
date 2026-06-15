import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Bell, CheckCircle, Activity, X, Heart, Shield, Loader2 } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import api from '../../../services/api';
import './AdminAlertsV2.css';

const formatTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffM = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffM < 1)  return 'Just now';
  if (diffM < 60) return `${diffM}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD === 1) return 'Yesterday';
  if (diffD < 7)  return `${diffD}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const AdminAlertsV2 = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvedIds, setResolvedIds] = useState([]);
  const [category, setCategory] = useState('all');

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/alerts');
      // Map data to match V2 format
      setAlerts(data.map(a => ({
        id: a.id,
        type: (a.type || 'info').toLowerCase(),
        title: a.title || 'Health Alert',
        desc: a.description || 'No description provided.',
        time: formatTime(a.created_at),
        resident: a.elder_name || a.parent_name || 'System',
        is_resolved: a.is_resolved
      })).filter(a => !a.is_resolved)); // Only show unresolved in this V2 feed
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleResolve = async (id) => {
    setResolvedIds([...resolvedIds, id]);
    try {
      await api.put(`/admin/alerts/${id}/resolve`);
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== id));
        setResolvedIds(prev => prev.filter(x => x !== id));
      }, 800);
    } catch (err) {
      alert('Failed to resolve alert.');
      setResolvedIds(prev => prev.filter(x => x !== id));
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (category === 'all') return true;
    return a.type === category;
  });

  return (
    <AdminLayoutV2 title="System Alerts Registry">
      <div className="alerts-v2-container">
        
        {/* Category Tabs */}
        <div className="alerts-v2-tabs-bar">
          <div className="alerts-v2-tabs">
            <button 
              className={`tab-btn ${category === 'all' ? 'active' : ''}`}
              onClick={() => setCategory('all')}
            >
              All Alerts ({alerts.length})
            </button>
            <button 
              className={`tab-btn tab-critical ${category === 'critical' ? 'active' : ''}`}
              onClick={() => setCategory('critical')}
            >
              Critical ({alerts.filter(a => a.type === 'critical').length})
            </button>
            <button 
              className={`tab-btn tab-warning ${category === 'warning' ? 'active' : ''}`}
              onClick={() => setCategory('warning')}
            >
              Warnings ({alerts.filter(a => a.type === 'warning').length})
            </button>
            <button 
              className={`tab-btn tab-info ${category === 'info' ? 'active' : ''}`}
              onClick={() => setCategory('info')}
            >
              Info
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="alerts-v2-feed">
          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0', width: '100%' }}>
               <Loader2 className="animate-spin" size={32} color="#00A896" />
             </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="alerts-v2-empty">
              <CheckCircle size={48} color="#00A896" />
              <h3>All Alerts Resolved</h3>
              <p>Great job! There are no unresolved active alerts in this category.</p>
            </div>
          ) : (
            filteredAlerts.map(a => {
              const isResolving = resolvedIds.includes(a.id);
              return (
                <div 
                  key={a.id} 
                  className={`alerts-v2-card alert-${a.type} ${isResolving ? 'resolving-out' : ''}`}
                >
                  <div className="alerts-v2-header">
                    <div className="alert-title-desc">
                      <div className="alert-icon-wrapper">
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <h4>{a.title}</h4>
                        <p className="alert-desc">{a.desc}</p>
                        <p className="alert-time">
                          <span>Resident: <strong>{a.resident}</strong></span>
                          <span className="dot-sep" />
                          <span>{a.time}</span>
                        </p>
                      </div>
                    </div>

                    <button 
                      className="resolve-alert-btn"
                      onClick={() => handleResolve(a.id)}
                      disabled={isResolving}
                    >
                      {isResolving ? 'Resolving...' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </AdminLayoutV2>
  );
};

export default AdminAlertsV2;
