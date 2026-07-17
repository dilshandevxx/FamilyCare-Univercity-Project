import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import './Login.css';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('family');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [rememberMe, setRememberMe]     = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState('');

  // ── 2FA state ──────────────────────────────────────────────
  const [tfaRequired, setTfaRequired]         = useState(false);
  const [tfaPartialToken, setTfaPartialToken] = useState('');
  const [tfaOtp, setTfaOtp]                   = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const redirectByRole = (role) => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'caregiver') navigate('/caregiver/dashboard');
    else navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await login(email, password, selectedRole);
      redirectByRole(data.role);
    } catch (err) {
      const resp = err?.response?.data;
      if (resp?.tfa_required) {
        setTfaPartialToken(resp.partial_token);
        setTfaRequired(true);
        setIsLoading(false);
        return;
      }
      setError(resp?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTfaSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/2fa/validate', {
        partial_token: tfaPartialToken,
        token: tfaOtp,
      });
      localStorage.setItem('token', data.token);
      redirectByRole(data.role);
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid code — please try again');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for the segmented control indicator position
  const getIndicatorStyle = () => {
    if (selectedRole === 'family') return { transform: 'translateX(0%)', width: '33.33%' };
    if (selectedRole === 'caregiver') return { transform: 'translateX(100%)', width: '33.33%' };
    return { transform: 'translateX(200%)', width: '33.33%' }; // admin
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        
        <div className="login-header">
          <Link to="/" className="login-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ background: '#111827', borderRadius: '6px', padding: '4px' }}>
              <path d="M12 21C12 21 3 14 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14 14 21 12 21Z" fill="white"/>
            </svg>
            <span className="login-logo-text">FamilyCare</span>
          </Link>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Please enter your details to sign in.</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        {tfaRequired ? (
          <form onSubmit={handleTfaSubmit}>
            <div className="login-form-group">
              <div className="login-label-row">
                <label className="login-label">Authenticator Code</label>
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={7}
                value={tfaOtp}
                onChange={e => setTfaOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000 000"
                className="tfa-otp-input"
                autoFocus
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={isLoading || tfaOtp.length < 6}>
              {isLoading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
            <button type="button" className="tfa-back-btn" onClick={() => { setTfaRequired(false); setTfaOtp(''); setError(''); }}>
              Back to login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            
            <div className="login-segment-control">
              <div className="login-segment-indicator" style={getIndicatorStyle()} />
              <button type="button" className={`login-segment-btn ${selectedRole === 'family' ? 'active' : ''}`} onClick={() => setSelectedRole('family')}>
                Family
              </button>
              <button type="button" className={`login-segment-btn ${selectedRole === 'caregiver' ? 'active' : ''}`} onClick={() => setSelectedRole('caregiver')}>
                Caregiver
              </button>
              <button type="button" className={`login-segment-btn ${selectedRole === 'admin' ? 'active' : ''}`} onClick={() => setSelectedRole('admin')}>
                Admin
              </button>
            </div>

            <div className="login-form-group">
              <div className="login-label-row">
                <label className="login-label">Email</label>
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="login-input"
              />
            </div>

            <div className="login-form-group">
              <div className="login-label-row">
                <label className="login-label">Password</label>
                <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="login-input"
              />
            </div>

            <div className="login-remember">
              <input 
                type="checkbox" 
                id="remember" 
                className="login-checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember for 30 days</label>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="login-divider">Or continue with</div>

            <div className="login-social-group">
              <a href="http://localhost:5000/api/auth/google" className="login-social-btn">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="16" height="16" />
                Google
              </a>
              <a href="http://localhost:5000/api/auth/github" className="login-social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#111827"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
            </div>

            <div className="login-footer-links">
              Don't have an account? <Link to="/register">Sign up</Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
