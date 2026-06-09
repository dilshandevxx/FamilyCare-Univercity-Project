import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Activity, UserCheck, Loader2, RefreshCw } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import api from '../../../services/api';
import './AdminAnalytics.css';

const conditionLabel = (c) => {
  if (!c) return 'Unknown';
  const v = c.toUpperCase();
  if (v === 'STABLE')          return 'Stable';
  if (v === 'NEEDS ATTENTION') return 'Needs Attention';
  if (v === 'CRITICAL')        return 'Critical';
  return c;
};

const AdminAnalytics = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: d } = await api.get('/admin/analytics');
      setData(d);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  const kpis = data ? [
    {
      label: 'Monthly Growth',
      value: `${data.kpis.monthly_growth_pct >= 0 ? '+' : ''}${data.kpis.monthly_growth_pct}%`,
      icon: TrendingUp, color: '#14b8a6', bg: '#f0fdfa',
    },
    {
      label: 'Total Users',
      value: data.kpis.total_users.toLocaleString(),
      icon: Users, color: '#3b82f6', bg: '#eff6ff',
    },
    {
      label: 'Health Logs / Day',
      value: data.kpis.logs_today.toString(),
      icon: Activity, color: '#f59e0b', bg: '#fffbeb',
    },
    {
      label: 'Active Caregivers',
      value: data.kpis.active_caregivers.toLocaleString(),
      icon: UserCheck, color: '#8b5cf6', bg: '#f5f3ff',
    },
  ] : [];

  // Normalise monthly_users for chart (max pct)
  const maxUsers = data ? Math.max(...data.monthly_users.map(m => m.users), 1) : 1;
  const maxLogs  = data ? Math.max(...data.logs_by_condition.map(l => l.count), 1) : 1;

  return (
    <AdminLayout title="Analytics">
      <div className="an-page">
        <div className="an-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="an-title">Analytics</h1>
            <p className="an-subtitle">Platform insights and usage statistics.</p>
          </div>
          <button
            onClick={fetchAnalytics}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              border: '1px solid #e2e8f0', background: '#fff',
              cursor: 'pointer', fontSize: '0.83rem', color: '#64748b', fontWeight: 600,
            }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader2 size={32} style={{ animation: 'an-spin 1s linear infinite', color: '#0d9488' }} />
          </div>
        ) : !data ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            <p>Failed to load analytics. Check your connection.</p>
          </div>
        ) : (
          <>
            {/* KPI row */}
            <div className="an-kpi-row">
              {kpis.map(k => (
                <div key={k.label} className="an-kpi-card">
                  <div className="an-kpi-icon" style={{ background: k.bg, color: k.color }}>
                    <k.icon size={20} />
                  </div>
                  <div>
                    <p className="an-kpi-label">{k.label}</p>
                    <p className="an-kpi-value">{k.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="an-charts-row">
              {/* User Growth */}
              <div className="an-chart-card">
                <h3 className="an-chart-title">
                  User Growth (Last {data.monthly_users.length} Months)
                </h3>
                {data.monthly_users.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '20px 0' }}>
                    Not enough data yet.
                  </p>
                ) : (
                  <div className="an-bar-chart">
                    {data.monthly_users.map(d => (
                      <div key={d.month_key} className="an-bar-col">
                        <span className="an-bar-val">{d.users}</span>
                        <div className="an-bar-wrap">
                          <div
                            className="an-bar"
                            style={{ height: `${Math.round((d.users / maxUsers) * 100)}%` }}
                          />
                        </div>
                        <span className="an-bar-label">{d.month}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Logs by condition */}
              <div className="an-chart-card">
                <h3 className="an-chart-title">Health Log Breakdown by Condition</h3>
                {data.logs_by_condition.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '20px 0' }}>
                    No health logs recorded yet.
                  </p>
                ) : (
                  <div className="an-hbar-list">
                    {data.logs_by_condition.map(d => (
                      <div key={d.type} className="an-hbar-row">
                        <span className="an-hbar-type">{conditionLabel(d.type)}</span>
                        <div className="an-hbar-track">
                          <div
                            className="an-hbar-fill"
                            style={{ width: `${Math.round((d.count / maxLogs) * 100)}%` }}
                          />
                        </div>
                        <span className="an-hbar-count">{d.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Extra summary row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16, marginTop: 4,
            }}>
              {[
                { label: 'Logs This Month', value: data.kpis.logs_this_month },
                { label: 'Logs Last Month', value: data.kpis.logs_last_month },
              ].map(item => (
                <div key={item.label} style={{
                  background: '#f8fafc', borderRadius: 12,
                  padding: '16px 20px', border: '1px solid #e2e8f0',
                }}>
                  <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </p>
                  <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes an-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
};

export default AdminAnalytics;
