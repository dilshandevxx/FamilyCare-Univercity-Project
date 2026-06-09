import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../../services/api';

const TEAL = '#00A896';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const error = searchParams.get('error');

    if (error || !token) {
      navigate('/login?error=oauth_failed');
      return;
    }

    localStorage.setItem('token', token);

    // Fetch full profile then redirect
    api.get('/users/profile')
      .then(() => {
        if (role === 'admin') navigate('/admin-v2/dashboard');
        else if (role === 'caregiver') navigate('/caregiver/dashboard');
        else navigate('/dashboard');
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login?error=oauth_failed');
      });
  }, []);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', fontFamily: "'Inter', sans-serif", flexDirection: 'column', gap: '1rem',
    }}>
      <div style={{
        width: '40px', height: '40px', border: `3px solid ${TEAL}`,
        borderTop: '3px solid transparent', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Signing you in...</p>
    </div>
  );
};

export default OAuthCallback;
