import React, { createContext, useState, useContext } from 'react';

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

  return (
    <AdminStatsContext.Provider
      value={{ pendingApprovals, activeAlerts, loading, refresh: () => {} }}
    >
      {children}
    </AdminStatsContext.Provider>
  );
};

export default AdminStatsContext;
