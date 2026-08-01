import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';

// ── AdminStatsContext ─────────────────────────────────────────────
// Provides live sidebar badge counts (pending caregiver approvals and
// active alerts) to all consumers within the Admin V2 layout tree.
// ─────────────────────────────────────────────────────────────────

const AdminStatsContext = createContext({
  pendingApprovals: 0,
  activeAlerts: 0,
  loading: true,
  error: null,
  lastUpdated: null,
  refresh: () => {},
});

export const AdminStatsProvider = ({ children }) => {
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [activeAlerts, setActiveAlerts]         = useState(0);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);
  const [lastUpdated, setLastUpdated]           = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setPendingApprovals(data.pending_approvals ?? 0);
      setActiveAlerts(data.active_alerts ?? 0);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[AdminStatsContext] Failed to fetch /admin/stats:', err);
      setError(err?.response?.data?.error || err.message);
      // Leave counts at their current value on error — do not reset to 0
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ── Custom DOM event listener for instant cross-component updates ──
  useEffect(() => {
    const handleCustomUpdate = () => {
      fetchStats();
    };
    window.addEventListener('admin-stats-update', handleCustomUpdate);
    return () => window.removeEventListener('admin-stats-update', handleCustomUpdate);
  }, [fetchStats]);

  // ── 30-second polling — keeps badges fresh without page reload ────
  useEffect(() => {
    const POLL_MS = 30_000; // 30 seconds
    const intervalId = setInterval(fetchStats, POLL_MS);
    return () => clearInterval(intervalId); // cleanup on unmount
  }, [fetchStats]);

  // ── Build the context value ───────────────────────────────────────
  const contextValue = {
    pendingApprovals, // ← sourced from stats.pending_approvals
    activeAlerts,     // ← sourced from stats.active_alerts
    loading,
    error,
    lastUpdated,
    refresh: fetchStats, // ← consumers can manually trigger a re-fetch
  };

  return (
    <AdminStatsContext.Provider value={contextValue}>
      {children}
    </AdminStatsContext.Provider>
  );
};

// ── Helper to dispatch real-time update event across components ────
export const dispatchAdminStatsUpdate = () => {
  window.dispatchEvent(new CustomEvent('admin-stats-update'));
};

// ── useAdminStats — convenience hook for consumers ───────────────
// Usage: const { pendingApprovals, activeAlerts, refresh } = useAdminStats();
export const useAdminStats = () => useContext(AdminStatsContext);

export default AdminStatsContext;
