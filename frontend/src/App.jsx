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

// Protected pages
import Dashboard  from './pages/child/Dashboard/Dashboard';
import CaregiverDashboard from './pages/caregiver/Dashboard/CaregiverDashboard';
import AssignedElders from './pages/caregiver/AssignedElders/AssignedElders';
import CaregiverMessage from './pages/caregiver/CaregiverMessages/caregiverMessage';
import CaregiverSettings from './pages/caregiver/CaregiverSettings/caregiversettings';
import AddHealthLog from './pages/caregiver/HealthLog/AddHealthLog';
import CaregiverVisitHistory from './pages/caregiver/CaregiverVisitHistory/caregivervisithistor';

// Child placeholder pages
import MyParents from './pages/child/MyParents/MyParents';
import AddParent from './pages/child/AddParent/AddParent';
import CaregiversList from './pages/child/CaregiversList/CaregiversList';
import HealthFeed from './pages/child/HealthFeed/HealthFeed';
import Analytics from './pages/child/Analytics/Analytics';
import Alerts from './pages/child/Alerts/Alerts';
import ChildMessages from './pages/child/Messages/Messages';
import ChildSettings from './pages/child/Settings/Settings';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.includes('/dashboard') || 
                           location.pathname.includes('/caregiver') ||
                           ['/parents', '/add-parent', '/caregivers-list', '/health-feed', '/analytics', '/alerts', '/messages', '/settings'].includes(location.pathname);

  return (
    <div className="App">
      {!isDashboardRoute && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Home />} />
        <Route path="/features"  element={<FeaturesPage />} />
        <Route path="/caregivers" element={<Caregivers />} />
        <Route path="/about"     element={<About />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />

        {/* Protected - Caregiver */}
        <Route path="/caregiver/dashboard" element={<PrivateRoute><CaregiverDashboard /></PrivateRoute>} />
        <Route path="/caregiver/residents" element={<PrivateRoute><AssignedElders /></PrivateRoute>} />
        <Route path="/caregiver/messages" element={<PrivateRoute><CaregiverMessage /></PrivateRoute>} />
        <Route path="/caregiver/settings" element={<PrivateRoute><CaregiverSettings /></PrivateRoute>} />
        <Route path="/caregiver/healthlog/add" element={<PrivateRoute><AddHealthLog /></PrivateRoute>} />
        <Route path="/caregiver/history" element={<PrivateRoute><CaregiverVisitHistory /></PrivateRoute>} />

        {/* Protected - Child/Family */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/parents" element={<PrivateRoute><MyParents /></PrivateRoute>} />
        <Route path="/add-parent" element={<PrivateRoute><AddParent /></PrivateRoute>} />
        <Route path="/caregivers-list" element={<PrivateRoute><CaregiversList /></PrivateRoute>} />
        <Route path="/health-feed" element={<PrivateRoute><HealthFeed /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><ChildMessages /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><ChildSettings /></PrivateRoute>} />

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
