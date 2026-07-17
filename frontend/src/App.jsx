import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Public pages
import Home       from './pages/public/Landing/Landing';
import FeaturesPage from './pages/public/Features/Features';
import Caregivers        from './pages/public/Caregivers/Caregivers';
import CaregiverProfile  from './pages/public/Caregivers/CaregiverProfile';
import About      from './pages/public/About/About';
import Login      from './pages/public/Login/Login';
import Register      from './pages/public/Register/Register';
import OAuthCallback from './pages/public/OAuthCallback/OAuthCallback';
import Careers      from './pages/public/Careers/Careers';
import Blog         from './pages/public/Blog/Blog';
import HelpCenter   from './pages/public/HelpCenter/HelpCenter';
import ToursAndSafety from './pages/public/ToursAndSafety/ToursAndSafety';
import PrivacyPolicy  from './pages/public/PrivacyPolicy/PrivacyPolicy';

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

// Admin V2 pages (Now default for /admin/*)
import AdminLogin          from './pages/adminV2/Login/AdminLogin';
import AdminDashboardV2    from './pages/adminV2/Dashboard/AdminDashboardV2';
import UserManagementV2    from './pages/adminV2/UserManagement/UserManagementV2';
import CaregiverApprovalV2 from './pages/adminV2/CaregiverApproval/CaregiverApprovalV2';
import ElderManagementV2   from './pages/adminV2/ElderManagement/ElderManagementV2';
import AdminHealthLogsV2   from './pages/adminV2/HealthLogs/AdminHealthLogsV2';
import AdminAlertsV2       from './pages/adminV2/Alerts/AdminAlertsV2';
import AdminAnalyticsV2    from './pages/adminV2/Analytics/AdminAnalyticsV2';
import SystemMonitoringV2  from './pages/adminV2/SystemMonitoring/SystemMonitoringV2';
import AdminSettingsV2     from './pages/adminV2/Settings/AdminSettingsV2';

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
    || location.pathname === '/admin/login'
    || location.pathname === '/register';

  return (
    <div className="App">
      {!hideNav && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Home />} />
        <Route path="/features"  element={<FeaturesPage />} />
        <Route path="/caregivers"     element={<Caregivers />} />
        <Route path="/caregivers/:id" element={<CaregiverProfile />} />
        <Route path="/about"     element={<About />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/careers"        element={<Careers />} />
        <Route path="/blog"           element={<Blog />} />
        <Route path="/help-center"    element={<HelpCenter />} />
        <Route path="/tours-and-safety" element={<ToursAndSafety />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

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

        {/* Protected – Admin V2 (role === 'admin' required) */}
        <Route path="/admin/dashboard"          element={<AdminRoute><AdminDashboardV2 /></AdminRoute>} />
        <Route path="/admin/users"              element={<AdminRoute><UserManagementV2 /></AdminRoute>} />
        <Route path="/admin/caregiver-approval" element={<AdminRoute><CaregiverApprovalV2 /></AdminRoute>} />
        <Route path="/admin/elders"             element={<AdminRoute><ElderManagementV2 /></AdminRoute>} />
        <Route path="/admin/health-logs"        element={<AdminRoute><AdminHealthLogsV2 /></AdminRoute>} />
        <Route path="/admin/alerts"             element={<AdminRoute><AdminAlertsV2 /></AdminRoute>} />
        <Route path="/admin/analytics"          element={<AdminRoute><AdminAnalyticsV2 /></AdminRoute>} />
        <Route path="/admin/monitoring"         element={<AdminRoute><SystemMonitoringV2 /></AdminRoute>} />
        <Route path="/admin/settings"           element={<AdminRoute><AdminSettingsV2 /></AdminRoute>} />

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
