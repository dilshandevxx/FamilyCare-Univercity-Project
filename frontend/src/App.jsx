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
import Register   from './pages/public/Register/Register';

// Child pages
import Dashboard  from './pages/child/Dashboard/Dashboard';
import Parents    from './pages/child/Parents/Parents';
import Alerts     from './pages/child/Alerts/Alerts';
import HealthFeed from './pages/child/HealthFeed/HealthFeed';
import Messages   from './pages/child/Messages/Messages';

// Caregiver pages
import CaregiverDashboard    from './pages/caregiver/Dashboard/CaregiverDashboard';
import AssignedElders        from './pages/caregiver/AssignedElders/AssignedElders';
import CaregiverMessage      from './pages/caregiver/CaregiverMessages/caregiverMessage';
import CaregiverSettings     from './pages/caregiver/CaregiverSettings/caregiversettings';
import AddHealthLog          from './pages/caregiver/HealthLog/AddHealthLog';
import CaregiverVisitHistory from './pages/caregiver/CaregiverVisitHistory/caregivervisithistor';

/* Routes where the public Navbar should NOT appear */
const DASHBOARD_PATHS = [
  '/dashboard', '/parents', '/alerts', '/health-feed', '/messages',
  '/caregivers-list', '/add-parent', '/analytics', '/settings',
];

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const hideNav = DASHBOARD_PATHS.some(p => location.pathname.startsWith(p))
    || location.pathname.startsWith('/caregiver/')
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
        <Route path="/register"  element={<Register />} />

        {/* Protected – Child */}
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/parents"    element={<PrivateRoute><Parents /></PrivateRoute>} />
        <Route path="/alerts"     element={<PrivateRoute><Alerts /></PrivateRoute>} />
        <Route path="/health-feed" element={<PrivateRoute><HealthFeed /></PrivateRoute>} />
        <Route path="/messages"   element={<PrivateRoute><Messages /></PrivateRoute>} />

        {/* Protected – Caregiver */}
        <Route path="/caregiver/dashboard"    element={<PrivateRoute><CaregiverDashboard /></PrivateRoute>} />
        <Route path="/caregiver/residents"    element={<PrivateRoute><AssignedElders /></PrivateRoute>} />
        <Route path="/caregiver/messages"     element={<PrivateRoute><CaregiverMessage /></PrivateRoute>} />
        <Route path="/caregiver/settings"     element={<PrivateRoute><CaregiverSettings /></PrivateRoute>} />
        <Route path="/caregiver/healthlog/add" element={<PrivateRoute><AddHealthLog /></PrivateRoute>} />
        <Route path="/caregiver/history"      element={<PrivateRoute><CaregiverVisitHistory /></PrivateRoute>} />

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
