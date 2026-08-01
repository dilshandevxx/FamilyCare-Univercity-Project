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

  return (
    <AdminStatsContext.Provider
      value={{ pendingApprovals, activeAlerts, loading, refresh: () => {} }}
    >
      {children}
    </AdminStatsContext.Provider>
  );
};

export default AdminStatsContext;
