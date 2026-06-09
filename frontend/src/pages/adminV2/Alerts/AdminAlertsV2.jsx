import React, { useState } from 'react';
import { ShieldAlert, Bell, CheckCircle, Activity, X, Heart, Shield } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import './AdminAlertsV2.css';

const initialAlerts = [
  { id: 1, type: 'critical', title: 'Heart Rate Spike', desc: 'Arthur Jenkins recorded 102 bpm heart rate. Refused meal.', time: '5m ago', resident: 'Arthur Jenkins' },
  { id: 2, type: 'warning', title: 'Hypertension Warning', desc: 'Clara Oswald blood pressure recorded 158/92 (irregular high).', time: '18m ago', resident: 'Clara Oswald' },
  { id: 3, type: 'critical', title: 'Missing Vitals Log', desc: 'No morning vitals submitted for Robert Sterling by 11:00 AM.', time: '1h ago', resident: 'Robert Sterling' },
  { id: 4, type: 'info', title: 'Weekly Report Ready', desc: 'System generated analytics health summary reports.', time: '3h ago', resident: 'All Elders' }
];

const AdminAlertsV2 = () => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [resolvedIds, setResolvedIds] = useState([]);
  const [category, setCategory] = useState('all');

  const handleResolve = (id) => {
    setResolvedIds([...resolvedIds, id]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
      setResolvedIds(prev => prev.filter(x => x !== id));
    }, 800);
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
          {filteredAlerts.length === 0 ? (
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
