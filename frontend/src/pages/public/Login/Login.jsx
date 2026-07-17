import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Home, Contact, Shield, Lock, Mail, Info, ShieldCheck, Check, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import api from '../../../services/api';
import nurseImage from '../../../assets/about/nurse_holding_hands.png';
import './Login.css';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('family');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="login-page-container">
      {/* ── LEFT PANEL (HERO) ── */}
      <div className="login-hero-panel">
        <div className="login-hero-bg" style={{ backgroundImage: `url(${nurseImage})` }} />
        <div className="login-hero-overlay" />
        
        <div className="login-hero-content">
          <Link to="/" className="login-logo">
            <div className="login-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 21C12 21 3 14 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14 14 21 12 21Z" fill="white"/>
              </svg>
            </div>
            <span className="login-logo-text">FamilyCare</span>
          </Link>
          
          <h1 className="login-hero-title">
            Welcome <br />
            <span className="accent">Back.</span>
          </h1>
          <p className="login-hero-desc">
            Continue your journey of mindful care. Monitor, connect, and support your loved ones securely from anywhere.
          </p>

          <div className="login-glass-card">
            <div className="login-avatars">
              {['#4CAF50', '#2196F3', '#FF9800'].map((color, i) => (
                <div key={i} className="login-avatar" style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="login-glass-text">
              <strong>2,000+</strong>
              Families trust us daily
            </div>
          </div>
        </div>

        <div className="login-footer-text">
          © {new Date().getFullYear()} FamilyCare. Your sanctuary for health.
        </div>
      </div>

      {/* ── RIGHT PANEL (FORM) ── */}
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          
          <Link to="/" className="login-back-link">
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to home
          </Link>

          <h2 className="login-form-title">Sign in</h2>
          <p className="login-form-subtitle">Choose your role and enter your credentials.</p>

          {error && (
            <div className="login-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <p>{error}</p>
            </div>
          )}

          {tfaRequired ? (
            /* ── 2FA FORM ── */
            <form onSubmit={handleTfaSubmit}>
              <div className="login-info-banner">
                <ShieldCheck size={20} className="shrink-0" />
                <div>
                  <strong>Two-Factor Authentication</strong>
                  <p>Open your authenticator app and enter the 6-digit code.</p>
                </div>
              </div>

              <div className="login-input-group">
                <label className="login-label">Authenticator Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={7}
                  value={tfaOtp}
                  onChange={e => setTfaOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  className="tfa-otp-input"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={isLoading || tfaOtp.length < 6}
              >
                {isLoading ? 'Verifying…' : 'Confirm & Sign In'}
              </button>
              
              <button
                type="button"
                className="tfa-back-btn"
                onClick={() => { setTfaRequired(false); setTfaOtp(''); setError(''); }}
              >
                ← Back to login
              </button>
            </form>
          ) : (
            /* ── STANDARD LOGIN FORM ── */
            <form onSubmit={handleSubmit}>
              
              <div className="role-selector">
                {[
                  { id: 'family', label: 'Family', desc: 'Monitor your loved ones', icon: <Home size={20} /> },
                  { id: 'caregiver', label: 'Caregiver', desc: 'Access care schedules', icon: <Contact size={20} /> },
                  { id: 'admin', label: 'Admin', desc: 'Manage platform users', icon: <Shield size={20} /> }
                ].map((role) => (
                  <div
                    key={role.id}
                    className={`role-card ${selectedRole === role.id ? 'active' : ''}`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    {selectedRole === role.id && (
                      <div className="role-active-indicator">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                    <div className="role-card-icon">{role.icon}</div>
                    <div className="role-card-label">{role.label}</div>
                    <div className="role-card-desc">{role.desc}</div>
                  </div>
                ))}
              </div>

              <div className="login-input-group">
                <label className="login-label">Email Address</label>
                <div className="login-input-wrapper">
                  <Mail size={18} className="login-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRole === 'caregiver' ? 'caregiver@example.com' : 'name@example.com'}
                    required
                    className="login-input"
                  />
                </div>
              </div>

              <div className="login-input-group">
                <div className="login-label">
                  <span>Password</span>
                  <Link to="/forgot-password" className="login-forgot-link">Forgot password?</Link>
                </div>
                <div className="login-input-wrapper">
                  <Lock size={18} className="login-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="login-input"
                  />
                  <button
                    type="button"
                    className="login-pwd-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {selectedRole === 'caregiver' && (
                <div className="login-info-banner">
                  <Info size={18} className="shrink-0 mt-1" />
                  <p>
                    Signing in as a Caregiver gives you access to care logs, schedules, and patient updates.
                  </p>
                </div>
              )}

              <div className="login-remember">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me for 30 days</label>
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : `Sign in as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
              </button>
            </form>
          )}

          {!tfaRequired && (
            <>
              <div className="login-divider">
                <span>or continue with</span>
              </div>

              <div className="social-login-grid">
                <a href="http://localhost:5000/api/auth/google" className="social-btn">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="16" height="16" />
                  Google
                </a>
                <a href="http://localhost:5000/api/auth/github" className="social-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#374151"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
                <a href="#" className="social-btn disabled" onClick={e => e.preventDefault()} title="Apple Sign In coming soon">
                  <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" width="16" height="16" style={{ opacity: 0.4 }} />
                  Apple
                </a>
              </div>

              <div className="login-signup-text">
                Don&apos;t have an account? 
                <Link to="/register" className="login-signup-link">Create account</Link>
              </div>

              <div className="login-quick-nav">
                <Link to="/">Home</Link>
                <Link to="/features">Features</Link>
                <Link to="/about">About</Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
