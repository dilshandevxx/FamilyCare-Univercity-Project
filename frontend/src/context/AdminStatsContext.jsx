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
  refresh: () => {},
});

export const AdminStatsProvider = ({ children }) => {
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [activeAlerts, setActiveAlerts]         = useState(0);
  const [loading, setLoading]                   = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setPendingApprovals(data.pending_approvals ?? 0);
      setActiveAlerts(data.active_alerts ?? 0);
    } catch (err) {
      console.error('[AdminStatsContext] Failed to fetch /admin/stats:', err);
      // Leave counts at their current value on error — do not reset to 0
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ── 60-second polling — keeps badges fresh without page reload ────
  useEffect(() => {
    const POLL_MS = 60_000; // 1 minute
    const intervalId = setInterval(fetchStats, POLL_MS);
    return () => clearInterval(intervalId); // cleanup on unmount
  }, [fetchStats]);

  // ── Build the context value ───────────────────────────────────────
  // pendingApprovals: caregivers with status='pending' from /admin/stats
  // activeAlerts: unresolved alerts (is_resolved=0) from /admin/stats
  const contextValue = {
    pendingApprovals, // ← sourced from stats.pending_approvals
    activeAlerts,     // ← sourced from stats.active_alerts
    loading,
    refresh: () => {},
  };

  return (
    <AdminStatsContext.Provider value={contextValue}>
      {children}
    </AdminStatsContext.Provider>
  );
};

export default AdminStatsContext;
