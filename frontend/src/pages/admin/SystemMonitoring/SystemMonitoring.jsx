import React from 'react';
import { Monitor, Server, Cpu, HardDrive, Wifi, CheckCircle, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import './SystemMonitoring.css';

const services = [
  { name: 'API Server',       status: 'Operational', uptime: '99.98%', latency: '45ms'  },
  { name: 'Database',         status: 'Operational', uptime: '99.95%', latency: '12ms'  },
  { name: 'Auth Service',     status: 'Operational', uptime: '100%',   latency: '8ms'   },
  { name: 'Notification Svc', status: 'Degraded',    uptime: '97.2%',  latency: '210ms' },
  { name: 'File Storage',     status: 'Operational', uptime: '99.9%',  latency: '55ms'  },
];

const resources = [
  { label: 'CPU Usage',    value: 38, icon: Cpu,       color: '#14b8a6' },
  { label: 'Memory',       value: 62, icon: Server,    color: '#3b82f6' },
  { label: 'Disk',         value: 47, icon: HardDrive, color: '#8b5cf6' },
  { label: 'Network I/O',  value: 25, icon: Wifi,      color: '#f59e0b' },
];

const SystemMonitoring = () => (
  <AdminLayout title="System Monitoring">
    <div className="sm-page">
      <div className="sm-header">
        <h1 className="sm-title">System Monitoring</h1>
        <p className="sm-subtitle">Real-time health of platform infrastructure.</p>
        <div className="sm-overall-status">
          <CheckCircle size={16} color="#16a34a" />
          Overall system status: <strong>Healthy</strong>
        </div>
      </div>

      {/* Resource meters */}
      <div className="sm-resources">
        {resources.map(r => (
          <div key={r.label} className="sm-resource-card">
            <div className="sm-res-top">
              <div className="sm-res-icon" style={{ background: `${r.color}18` }}>
                <r.icon size={18} color={r.color} />
              </div>
              <div>
                <p className="sm-res-label">{r.label}</p>
                <p className="sm-res-value" style={{ color: r.color }}>{r.value}%</p>
              </div>
            </div>
            <div className="sm-res-bar-track">
              <div
                className="sm-res-bar-fill"
                style={{ width: `${r.value}%`, background: r.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Services table */}
      <div className="sm-services-card">
        <h3 className="sm-services-title">Service Status</h3>
        <table className="sm-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Status</th>
              <th>Uptime</th>
              <th>Avg Latency</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.name}>
                <td className="sm-td-name">
                  <Monitor size={13} /> {s.name}
                </td>
                <td>
                  <span className={`sm-status ${s.status === 'Operational' ? 'ok' : 'warn'}`}>
                    {s.status === 'Operational'
                      ? <CheckCircle size={11} />
                      : <AlertTriangle size={11} />}
                    {s.status}
                  </span>
                </td>
                <td className="sm-td-sub">{s.uptime}</td>
                <td className="sm-td-sub">{s.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
);

export default SystemMonitoring;
