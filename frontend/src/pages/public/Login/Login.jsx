import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import './Login.css';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('family');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState('');
  const [tfaRequired, setTfaRequired]   = useState(false);
  const [tfaPartialToken, setTfaPartialToken] = useState('');
  const [tfaOtp, setTfaOtp]             = useState('');

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
      setError(resp?.error || 'Invalid email or password. Please try again.');
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
      setError(err?.response?.data?.error || 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root">

      {/* ─── LEFT: Form Panel ─── */}
      <div className="login-form-panel">
        <div className="login-form-inner">

          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="login-brand-name">FamilyCare</span>
          </div>

          {/* Heading */}
          <div className="login-heading">
            <h1>Sign in to your account</h1>
            <p>Welcome back! Please enter your details below.</p>
          </div>

          {/* Role Toggle */}
          <div className="login-role-toggle">
            <button
              type="button"
              className={`login-role-btn ${selectedRole === 'family' ? 'active' : ''}`}
              onClick={() => setSelectedRole('family')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Family Member
            </button>
            <button
              type="button"
              className={`login-role-btn ${selectedRole === 'caregiver' ? 'active' : ''}`}
              onClick={() => setSelectedRole('caregiver')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Caregiver
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {tfaRequired ? (
            <form onSubmit={handleTfaSubmit} className="login-form">
              <div className="login-field">
                <label>Two-Factor Code</label>
                <p className="login-field-hint">Enter the 6-digit code from your authenticator app.</p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={7}
                  value={tfaOtp}
                  onChange={e => setTfaOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="0  0  0  0  0  0"
                  className="login-input tfa-input"
                  autoFocus
                  required
                />
              </div>
              <button type="submit" className="login-submit-btn" disabled={isLoading || tfaOtp.length < 6}>
                {isLoading ? 'Verifying…' : 'Verify Code'}
              </button>
              <button type="button" className="login-back-btn" onClick={() => { setTfaRequired(false); setTfaOtp(''); setError(''); }}>
                ← Back to login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="login-form">

              <div className="login-field">
                <label htmlFor="email">Email Address</label>
                <div className="login-input-wrap">
                  <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="login-input"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="login-forgot-link">Forgot password?</Link>
                </div>
                <div className="login-input-wrap">
                  <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="login-input"
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="login-eye-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1} aria-label="Toggle password">
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="login-remember">
                <label className="login-check-label">
                  <input type="checkbox" className="login-checkbox" />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              <button type="submit" className="login-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><span className="login-spinner"></span> Signing in…</>
                ) : 'Sign In'}
              </button>

              <div className="login-divider">
                <span>or continue with</span>
              </div>

              <div className="login-social-row">
                <a href="http://localhost:5000/api/auth/google" className="login-social-btn">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
                  <span>Google</span>
                </a>
                <a href="http://localhost:5000/api/auth/facebook" className="login-social-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span>Facebook</span>
                </a>
              </div>
            </form>
          )}

          <p className="login-signup-text">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>

      {/* ─── RIGHT: Hero Panel ─── */}
      <div className="login-hero-panel">
        <div className="login-hero-content">

          <div className="login-hero-badge">
            <span className="badge-dot"></span>
            Trusted by 10,000+ families
          </div>

          <h2 className="login-hero-title">
            Caring for your loved ones,<br/>
            <span>made effortless.</span>
          </h2>

          <p className="login-hero-desc">
            Connect with professional caregivers, monitor health in real time, and stay close to the people who matter most — all in one place.
          </p>

          <div className="login-stats">
            <div className="login-stat">
              <strong>10k+</strong>
              <span>Families</span>
            </div>
            <div className="login-stat-divider"></div>
            <div className="login-stat">
              <strong>3k+</strong>
              <span>Caregivers</span>
            </div>
            <div className="login-stat-divider"></div>
            <div className="login-stat">
              <strong>98%</strong>
              <span>Satisfaction</span>
            </div>
          </div>

          <div className="login-testimonial">
            <div className="testimonial-avatar">S</div>
            <div className="testimonial-body">
              <p>"FamilyCare completely transformed how we manage care for my mother. It gives us peace of mind every day."</p>
              <strong>Sarah Mitchell</strong>
              <span>Family Member, Chicago</span>
            </div>
          </div>

        </div>

        {/* Decorative circles */}
        <div className="hero-circle hero-circle-1"></div>
        <div className="hero-circle hero-circle-2"></div>
        <div className="hero-circle hero-circle-3"></div>
      </div>

    </div>
  );
};

export default Login;
