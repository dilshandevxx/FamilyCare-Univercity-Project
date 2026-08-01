import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Database, HardDrive, Cpu, Terminal, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import api from '../../../services/api';
import './SystemMonitoringV2.css';

const POLL_INTERVAL_MS = 10_000; // 10 seconds

const SystemMonitoringV2 = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const terminalRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/system-status');
      setStatus(data);
      setError(null);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('[SystemMonitoring] Failed to fetch /admin/system-status:', err);
      setError(err?.response?.data?.error || 'Failed to reach system status endpoint.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const intervalId = setInterval(fetchStatus, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [fetchStatus]);

  // Auto-scroll terminal to bottom on new logs
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [status?.logs]);

  if (loading && !status) {
    return (
      <AdminLayoutV2 title="System Infrastructure Health">
        <div className="monitor-v2-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Loader2 className="animate-spin" size={40} color="#00A896" />
        </div>
      </AdminLayoutV2>
    );
  }

  const cpu         = status?.cpu            ?? 0;
  const ram         = status?.ram            ?? 0;
  const ramDetails  = status?.ramDetails     ?? '— GB of — GB assigned';
  const dbStatus    = status?.dbStatus       ?? 'Unknown';
  const activeConns = status?.activeConnections ?? '—';
  const poolLimit   = status?.poolLimit      ?? '—';
  const latencyMs   = status?.latencyMs      ?? '—';
  const logs        = status?.logs           ?? [];

  return (
    <AdminLayoutV2 title="System Infrastructure Health">
      <div className="monitor-v2-container">

        {/* Error Banner */}
        {error && (
          <div style={{
            background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '12px',
            padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px',
            color: '#BE123C', fontSize: '0.88rem', fontWeight: 600
          }}>
            <AlertCircle size={18} />
            {error} — Showing last known data.
          </div>
        )}

        {/* Auto-refresh indicator */}
        {lastRefreshed && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.78rem' }}>
            <RefreshCw size={12} />
            Last synced: {lastRefreshed.toLocaleTimeString()} · auto-refreshes every 10s
          </div>
        )}

        {/* Hardware meters */}
        <div className="monitor-v2-gauges-grid">

          <div className="monitor-v2-gauge-card">
            <div className="gauge-header">
              <Cpu size={18} color="#00A896" />
              <span>CPU Utilization</span>
            </div>
            <div className="gauge-body">
              <div className="gauge-radial-progress" style={{ '--progress-val': `${cpu}%` }}>
                <span className="gauge-num">{cpu}%</span>
              </div>
              <p className="gauge-sub">Multi-core processor utilization</p>
            </div>
          </div>

          <div className="monitor-v2-gauge-card">
            <div className="gauge-header">
              <HardDrive size={18} color="#4F46E5" />
              <span>System Memory Allocation</span>
            </div>
            <div className="gauge-body">
              <div className="gauge-radial-progress progress-indigo" style={{ '--progress-val': `${ram}%` }}>
                <span className="gauge-num">{ram}%</span>
              </div>
              <p className="gauge-sub">{ramDetails}</p>
            </div>
          </div>

          <div className="monitor-v2-gauge-card">
            <div className="gauge-header">
              <Database size={18} color="#EA580C" />
              <span>MySQL Connection Pool</span>
            </div>
            <div className="gauge-body stats-text-layout">
              <div className="db-stat-item">
                <span className="label">Database Pool:</span>
                <span className={`value ${dbStatus === 'Healthy' ? 'text-teal' : ''}`}>{dbStatus}</span>
              </div>
              <div className="db-stat-item">
                <span className="label">Active Connections:</span>
                <span className="value">{activeConns} / {poolLimit} limit</span>
              </div>
              <div className="db-stat-item">
                <span className="label">Response Latency:</span>
                <span className="value">{latencyMs} ms</span>
              </div>
            </div>
          </div>

        </div>

        {/* Live terminal logs console */}
        <div className="monitor-v2-terminal-card">
          <div className="terminal-card-header">
            <div className="terminal-title">
              <Terminal size={16} />
              <span>API Gateway Terminal Console Logs</span>
            </div>
            <div className="terminal-status-light">
              <span className="status-blink-dot" />
              <span>LIVE LOGGING ACTIVE</span>
            </div>
          </div>

          <div className="terminal-body-log-display" ref={terminalRef}>
            {logs.length === 0 ? (
              <span style={{ color: '#475569', fontStyle: 'italic' }}>No log entries available.</span>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="terminal-log-line">
                  <span className="log-timestamp">[{log.time}]</span>
                  <span className={`log-event-badge type-${log.type}`}>
                    {log.type.toUpperCase()}
                  </span>
                  <span className="log-event-text">{log.event}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </AdminLayoutV2>
  );
};

export default SystemMonitoringV2;
