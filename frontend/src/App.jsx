import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Public pages
import Home       from './pages/public/Landing/Landing';
import FeaturesPage from './pages/public/Features/Features';
import Caregivers from './pages/public/Caregivers/Caregivers';
import About      from './pages/public/About/About';
import Login      from './pages/public/Login/Login';
import Register      from './pages/public/Register/Register';
import OAuthCallback from './pages/public/OAuthCallback/OAuthCallback';

// Child pages
import Dashboard  from './pages/child/Dashboard/Dashboard';
import Parents    from './pages/child/Parents/Parents';
import Alerts     from './pages/child/Alerts/Alerts';
import HealthFeed from './pages/child/HealthFeed/HealthFeed';
import Messages   from './pages/child/Messages/Messages';
import AddParent  from './pages/child/AddParent/AddParent';
import Settings   from './pages/child/Settings/Settings';
import CaregiversList from './pages/child/Caregivers/Caregivers';
import Analytics  from './pages/child/Analytics/Analytics';

// Caregiver pages
import CaregiverDashboard    from './pages/caregiver/Dashboard/CaregiverDashboard';
import AssignedElders        from './pages/caregiver/AssignedElders/AssignedElders';
import CaregiverMessage      from './pages/caregiver/CaregiverMessages/caregiverMessage';
import CaregiverSettings     from './pages/caregiver/CaregiverSettings/caregiversettings';
import AddHealthLog          from './pages/caregiver/HealthLog/AddHealthLog';
import CaregiverVisitHistory from './pages/caregiver/CaregiverVisitHistory/caregivervisithistor';

// Admin pages
import AdminDashboard    from './pages/admin/Dashboard/AdminDashboard';
import UserManagement    from './pages/admin/UserManagement/UserManagement';
import CaregiverApproval from './pages/admin/CaregiverApproval/CaregiverApproval';
import ElderManagement   from './pages/admin/ElderManagement/ElderManagement';
import AdminHealthLogs   from './pages/admin/HealthLogs/AdminHealthLogs';
import AdminAlerts       from './pages/admin/Alerts/AdminAlerts';
import AdminAnalytics    from './pages/admin/Analytics/AdminAnalytics';
import SystemMonitoring  from './pages/admin/SystemMonitoring/SystemMonitoring';
import AdminSettings     from './pages/admin/Settings/AdminSettings';

/* Routes where the public Navbar should NOT appear */
const DASHBOARD_PATHS = [
  '/dashboard', '/parents', '/alerts', '/health-feed', '/messages',
  '/caregivers-list', '/add-parent', '/analytics', '/settings',
];

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

/* Admin-only route — user must be authenticated AND have role === 'admin' */
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const hideNav = DASHBOARD_PATHS.some(p => location.pathname.startsWith(p))
    || location.pathname.startsWith('/caregiver/')
    || location.pathname.startsWith('/admin/')
    || location.pathname === '/login'
    || location.pathname === '/register';

  return (
    <div className="App">
      {!hideNav && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Home />} />
        <Route path="/features"  element={<FeaturesPage />} />
        <Route path="/caregivers" element={<Caregivers />} />
        <Route path="/about"     element={<About />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Protected – Child */}
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/parents"    element={<PrivateRoute><Parents /></PrivateRoute>} />
        <Route path="/alerts"     element={<PrivateRoute><Alerts /></PrivateRoute>} />
        <Route path="/health-feed" element={<PrivateRoute><HealthFeed /></PrivateRoute>} />
        <Route path="/messages"   element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/add-parent" element={<PrivateRoute><AddParent /></PrivateRoute>} />
        <Route path="/settings"   element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/caregivers-list" element={<PrivateRoute><CaregiversList /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />

        {/* Protected – Caregiver */}
        <Route path="/caregiver/dashboard"    element={<PrivateRoute><CaregiverDashboard /></PrivateRoute>} />
        <Route path="/caregiver/residents"    element={<PrivateRoute><AssignedElders /></PrivateRoute>} />
        <Route path="/caregiver/messages"     element={<PrivateRoute><CaregiverMessage /></PrivateRoute>} />
        <Route path="/caregiver/settings"     element={<PrivateRoute><CaregiverSettings /></PrivateRoute>} />
        <Route path="/caregiver/healthlog/add" element={<PrivateRoute><AddHealthLog /></PrivateRoute>} />
        <Route path="/caregiver/history"      element={<PrivateRoute><CaregiverVisitHistory /></PrivateRoute>} />

        {/* Protected – Admin (role === 'admin' required) */}
        <Route path="/admin/dashboard"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users"              element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="/admin/caregiver-approval" element={<AdminRoute><CaregiverApproval /></AdminRoute>} />
        <Route path="/admin/elders"             element={<AdminRoute><ElderManagement /></AdminRoute>} />
        <Route path="/admin/health-logs"        element={<AdminRoute><AdminHealthLogs /></AdminRoute>} />
        <Route path="/admin/alerts"             element={<AdminRoute><AdminAlerts /></AdminRoute>} />
        <Route path="/admin/analytics"          element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
        <Route path="/admin/monitoring"         element={<AdminRoute><SystemMonitoring /></AdminRoute>} />
        <Route path="/admin/settings"           element={<AdminRoute><AdminSettings /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
