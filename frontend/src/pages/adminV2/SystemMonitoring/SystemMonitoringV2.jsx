import React, { useState, useEffect } from 'react';
import { Server, Database, HardDrive, Cpu, Terminal, RefreshCw, Layers } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import './SystemMonitoringV2.css';

const initialConsoleLogs = [
  { time: '21:40:02', event: 'Database connection pool verified', type: 'info' },
  { time: '21:41:12', event: 'GET /api/admin/stats - 200 OK - 8ms', type: 'request' },
  { time: '21:42:30', event: 'GET /api/messages/contacts - 200 OK - 15ms', type: 'request' },
  { time: '21:43:05', event: 'Auto-migration checked - schema matches version 1.0.4', type: 'info' }
];

const mockEvents = [
  { event: 'GET /api/admin/activity - 200 OK - 12ms', type: 'request' },
  { time: '21:44:00', event: 'Session token verified for user_id=4', type: 'info' },
  { event: 'POST /api/auth/login - 200 OK - 145ms', type: 'request' },
  { event: 'GET /api/caregiver/residents - 200 OK - 22ms', type: 'request' },
  { event: 'Database cleanup routine executed successfully', type: 'info' }
];

const SystemMonitoringV2 = () => {
  const [cpu, setCpu] = useState(24);
  const [ram, setRam] = useState(58);
  const [dbStatus, setDbStatus] = useState('Healthy');
  const [logs, setLogs] = useState(initialConsoleLogs);

  useEffect(() => {
    // Fluctuating hardware stats
    const statsInterval = setInterval(() => {
      setCpu(prev => {
        const change = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(10, Math.min(90, prev + change));
      });
      setRam(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1 to +1
        return Math.max(45, Math.min(85, prev + change));
      });
    }, 2000);

    // Live terminal logger
    const logInterval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      
      const newLog = {
        time: timeStr,
        event: randomEvent.event,
        type: randomEvent.type
      };

      setLogs(prev => [...prev.slice(-9), newLog]); // Keep last 10 logs
    }, 4000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <AdminLayoutV2 title="System Infrastructure Health">
      <div className="monitor-v2-container">
        
        {/* Hardware meters */}
        <div className="monitor-v2-gauges-grid">
          
          <div className="monitor-v2-gauge-card">
            <div className="gauge-header">
              <Cpu size={18} color="#00A896" />
              <span>Simulated CPU Allocation</span>
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
              <p className="gauge-sub">4.8 GB of 8 GB currently assigned</p>
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
                <span className="value text-teal">Active</span>
              </div>
              <div className="db-stat-item">
                <span className="label">Active Connections:</span>
                <span className="value">4 / 10 limit</span>
              </div>
              <div className="db-stat-item">
                <span className="label">Response Latency:</span>
                <span className="value">4 ms</span>
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

          <div className="terminal-body-log-display">
            {logs.map((log, index) => (
              <div key={index} className="terminal-log-line">
                <span className="log-timestamp">[{log.time}]</span>
                <span className={`log-event-badge type-${log.type}`}>
                  {log.type.toUpperCase()}
                </span>
                <span className="log-event-text">{log.event}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayoutV2>
  );
};

export default SystemMonitoringV2;
