import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ShieldCheck, Heart, Stethoscope, 
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, AlertCircle, Home
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import GoogleSignInButton from '../../../components/auth/GoogleSignInButton';
import api from '../../../services/api';
import './Login.css';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('family');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 2FA state
  const [tfaRequired, setTfaRequired] = useState(false);
  const [tfaPartialToken, setTfaPartialToken] = useState('');
  const [tfaOtp, setTfaOtp] = useState('');

  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const redirectByRole = (role) => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'caregiver') navigate('/caregiver/dashboard');
    else navigate('/dashboard');
  };

  const handleGoogleSuccess = async (googlePayload) => {
    setError('');
    setIsLoading(true);
    try {
      const data = await googleLogin(googlePayload);
      redirectByRole(data.role);
    } catch (err) {
      setError(err?.response?.data?.error || 'Google sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      setError(resp?.error || 'Invalid email or password. Please check your credentials.');
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
    <div className="login-page-root">
      
      {/* Background Animated Lights */}
      <div className="login-bg-glow login-bg-glow--1"></div>
      <div className="login-bg-glow login-bg-glow--2"></div>
      <div className="login-bg-glow login-bg-glow--3"></div>

      {/* Top Navbar Brand */}
      <header className="login-topbar">
        <Link to="/" className="login-topbar-brand">
          <div className="login-brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 21C12 21 3 14 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14 14 21 12 21Z" fill="#00C9B5"/>
            </svg>
          </div>
          <span className="login-brand-title">FamilyCare</span>
        </Link>

        <Link to="/" className="login-home-btn">
          <Home size={15} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Centered Auth Container */}
      <main className="login-container">
        <div className="login-card">

          {/* ── Left Hero Side ── */}
          <div className="login-card-hero">
            <div className="login-hero-glow"></div>
            
            <div className="login-hero-tag">
              <span className="login-tag-dot"></span>
              {selectedRole === 'family' ? 'Family Member Portal' : 'Caregiver Portal'}
            </div>

            <h1 className="login-hero-heading">
              {selectedRole === 'family' ? (
                <>Welcome back to <br/><span className="text-teal-gradient">peace of mind.</span></>
              ) : (
                <>Welcome back to <br/><span className="text-teal-gradient">care coordination.</span></>
              )}
            </h1>

            <p className="login-hero-description">
              {selectedRole === 'family'
                ? 'Stay connected to your elderly loved ones with live health updates, verified caregivers, and instant care logs.'
                : 'Access your assigned residents, record vital metrics, review schedules, and coordinate with families effortlessly.'}
            </p>

            <div className="login-value-props">
              <div className="login-prop-item">
                <div className="login-prop-icon">
                  <ShieldCheck size={16} />
                </div>
                <span>End-to-End Encrypted Health Records</span>
              </div>
              <div className="login-prop-item">
                <div className="login-prop-icon">
                  <CheckCircle2 size={16} />
                </div>
                <span>Real-Time Notifications & Care Alerts</span>
              </div>
              <div className="login-prop-item">
                <div className="login-prop-icon">
                  <Sparkles size={16} />
                </div>
                <span>Seamless Global Family Coordination</span>
              </div>
            </div>

            <div className="login-hero-stats">
              <div className="login-stat">
                <strong>100+</strong>
                <span>Active Families</span>
              </div>
              <div className="login-stat-sep"></div>
              <div className="login-stat">
                <strong>4.9★</strong>
                <span>Satisfaction</span>
              </div>
              <div className="login-stat-sep"></div>
              <div className="login-stat">
                <strong>24/7</strong>
                <span>Monitoring</span>
              </div>
            </div>
          </div>

          {/* ── Right Form Side ── */}
          <div className="login-card-form">

            {/* Mode Switcher (Sign In / Register Link) */}
            <div className="login-mode-tabs">
              <button type="button" className="login-mode-tab active">
                Sign In
              </button>
              <Link to="/register" className="login-mode-tab">
                Create Account
              </Link>
            </div>

            {/* Role Switcher */}
            <div className="login-role-switch">
              <button
                type="button"
                className={`login-role-btn ${selectedRole === 'family' ? 'active' : ''}`}
                onClick={() => { setSelectedRole('family'); setError(''); }}
              >
                <Heart size={15} />
                <span>Family Member</span>
              </button>
              <button
                type="button"
                className={`login-role-btn ${selectedRole === 'caregiver' ? 'active' : ''}`}
                onClick={() => { setSelectedRole('caregiver'); setError(''); }}
              >
                <Stethoscope size={15} />
                <span>Caregiver</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="login-alert-box">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 2FA Mode */}
            {tfaRequired ? (
              <form onSubmit={handleTfaSubmit} className="login-form-inner">
                <div className="login-form-title">
                  <h2>Two-Factor Authentication</h2>
                  <p>Enter the 6-digit verification code from your authenticator application.</p>
                </div>

                <div className="login-form-group">
                  <label>Authenticator Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={tfaOtp}
                    onChange={e => setTfaOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    className="login-input-field login-otp-input"
                    autoFocus
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="login-submit-button"
                  disabled={isLoading || tfaOtp.length < 6}
                >
                  {isLoading ? <span className="login-spinner" /> : 'Verify Code & Sign In'}
                </button>

                <button 
                  type="button" 
                  className="login-back-button"
                  onClick={() => { setTfaRequired(false); setTfaOtp(''); setError(''); }}
                >
                  <ArrowLeft size={15} /> Back to standard login
                </button>
              </form>
            ) : (
              /* Standard Login Form */
              <form onSubmit={handleSubmit} className="login-form-inner">

                {/* Google Sign In */}
                <GoogleSignInButton 
                  mode="login"
                  role={selectedRole}
                  onSuccess={handleGoogleSuccess}
                  onError={(msg) => setError(msg)}
                />

                <div className="login-sep-line">
                  <span>or sign in with email</span>
                </div>

                {/* Email Address */}
                <div className="login-form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <div className="login-input-container">
                    <Mail size={17} className="login-input-svg" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="login-input-field"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="login-form-group">
                  <div className="login-field-header">
                    <label htmlFor="login-pass">Password</label>
                    <Link to="/forgot-password" className="login-forgot-btn">Forgot Password?</Link>
                  </div>
                  <div className="login-input-container">
                    <Lock size={17} className="login-input-svg" />
                    <input
                      id="login-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="login-input-field"
                      required
                      autoComplete="current-password"
                    />
                    <button 
                      type="button" 
                      className="login-eye-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="login-checkbox-row">
                  <label className="login-check-item">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={e => setRememberMe(e.target.checked)} 
                    />
                    <span>Keep me logged in on this device</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="login-submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? <span className="login-spinner" /> : (
                    <>Sign In as {selectedRole === 'family' ? 'Family Member' : 'Caregiver'} <ArrowRight size={17} /></>
                  )}
                </button>

                <div className="login-footer-text">
                  <span>Don't have an account yet?</span>
                  <Link to="/register" className="login-footer-link">
                    Create account
                  </Link>
                </div>

              </form>
            )}

          </div>

        </div>
      </main>

    </div>
  );
};

export default Login;
