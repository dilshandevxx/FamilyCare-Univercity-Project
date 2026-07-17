import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../../../services/api';
import abstractBg from '../../../assets/login_abstract_bg.png';
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
      <div className="login-card">
        
        {/* ── LEFT PANEL (IMAGE & TABS) ── */}
        <div className="login-left" style={{ backgroundImage: `url(${abstractBg})` }}>
          <div className="login-tabs">
            <div className="login-tab active">Log In</div>
            <Link to="/register" className="login-tab">Sign Up</Link>
          </div>
        </div>

        {/* ── RIGHT PANEL (FORM) ── */}
        <div className="login-right">
          
          <Link to="/" className="login-logo">
            <span className="login-logo-text">FamilyCare</span>
          </Link>

          {/* Role Tabs */}
          {!tfaRequired && (
            <div className="role-tabs">
              {[
                { id: 'family', label: 'Family' },
                { id: 'caregiver', label: 'Caregiver' },
                { id: 'admin', label: 'Admin' }
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`role-tab ${selectedRole === role.id ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  {role.label}
                </button>
              ))}
            </div>
          )}

          {error && <div className="login-error">{error}</div>}

          {tfaRequired ? (
            /* ── 2FA FORM ── */
            <form onSubmit={handleTfaSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="login-input-group" style={{ marginBottom: '2rem' }}>
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

              <button type="submit" className="login-submit-btn" disabled={isLoading || tfaOtp.length < 6}>
                {isLoading ? 'Verifying…' : 'Verify & Sign In'}
              </button>
              
              <button
                type="button"
                className="tfa-back-btn"
                onClick={() => { setTfaRequired(false); setTfaOtp(''); setError(''); }}
              >
                Back to login
              </button>
            </form>
          ) : (
            /* ── STANDARD LOGIN FORM ── */
            <form onSubmit={handleSubmit}>
              <div className="login-input-group">
                <div className="login-input-wrapper">
                  <User size={18} className="login-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="login-input"
                  />
                </div>
              </div>

              <div className="login-input-group">
                <div className="login-input-wrapper">
                  <Lock size={18} className="login-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="login-input"
                  />
                  <button
                    type="button"
                    className="login-pwd-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Get Started'}
              </button>

              <div className="login-actions">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="login-forgot-link">Forgot Password?</Link>
              </div>
            </form>
          )}

          <div className="login-bottom-note">
            <h4>Two-factor authentication</h4>
            <p>
              We recommend everyone who wants to protect their login credentials to activate at least one second factor.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
