import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/"          element={<Home />} />
            <Route path="/features"  element={<FeaturesPage />} />
            <Route path="/caregivers" element={<Caregivers />} />
            <Route path="/about"     element={<About />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />

            {/* Protected */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/caregiver/dashboard" element={
              <PrivateRoute>
                <CaregiverDashboard />
              </PrivateRoute>
            } />
            <Route path="/caregiver/residents" element={
              <PrivateRoute>
                <AssignedElders />
              </PrivateRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
