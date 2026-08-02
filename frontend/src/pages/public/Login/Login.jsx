import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ShieldCheck, Heart, Stethoscope, 
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, AlertCircle, Home
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import GoogleSignInButton from '../../../components/auth/GoogleSignInButton';
import familyHeroImg from '../../../assets/auth_family_hero.png';
import caregiverHeroImg from '../../../assets/auth_caregiver_hero.png';
import api from '../../../services/api';
import BrandLogo from '../../../components/common/BrandLogo';
import './Login.css';

const Login = () => {
  const [searchParams] = useSearchParams();
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

  useEffect(() => {
    const oauthErr = searchParams.get('error');
    if (oauthErr === 'oauth_failed') {
      setError('Google Sign-in was cancelled or encountered an authorization issue. Please try again or use email sign-in.');
    }
  }, [searchParams]);

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
        <BrandLogo to="/" size="md" />

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
            <div className="login-hero-img-container">
              <img 
                src={selectedRole === 'family' ? familyHeroImg : caregiverHeroImg} 
                alt={selectedRole === 'family' ? "Family Member" : "Caregiver"} 
                className="login-hero-bg-img"
              />
              <div className="login-hero-overlay"></div>
            </div>
            
            <div className="login-hero-top">
              <div className="login-hero-pill">
                <span className="login-tag-dot"></span>
                <span>{selectedRole === 'family' ? 'Family Care Portal' : 'Caregiver Network'}</span>
              </div>
            </div>

            <div className="login-hero-center-content">
              <h2 className="login-hero-heading">
                {selectedRole === 'family' ? (
                  <>Peace of mind for <br/><span className="text-teal-accent">your loved ones.</span></>
                ) : (
                  <>Empowering <br/><span className="text-teal-accent">compassionate care.</span></>
                )}
              </h2>

              {/* The One Meaningful Modern Thing: Live Health & Care Snapshot Card */}
              {selectedRole === 'family' ? (
                <div className="auth-live-card">
                  <div className="auth-live-card-header">
                    <div className="auth-live-avatar-wrap">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor"
                        alt="Eleanor Vance"
                        className="auth-live-avatar"
                      />
                      <span className="auth-live-pulse-dot" />
                    </div>
                    <div className="auth-live-info">
                      <h4 className="auth-live-name">Eleanor Vance</h4>
                      <span className="auth-live-role">Mother • Vitals Logged 5m ago</span>
                    </div>
                    <span className="auth-live-status-pill">● Normal</span>
                  </div>

                  <div className="auth-live-metrics-grid">
                    <div className="auth-live-metric">
                      <span className="auth-metric-lbl">Blood Pressure</span>
                      <span className="auth-metric-num">120/80 <small>mmHg</small></span>
                    </div>
                    <div className="auth-live-metric">
                      <span className="auth-metric-lbl">Heart Rate</span>
                      <span className="auth-metric-num">72 <small>bpm</small></span>
                    </div>
                    <div className="auth-live-metric">
                      <span className="auth-metric-lbl">Blood Sugar</span>
                      <span className="auth-metric-num">98 <small>mg/dL</small></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="auth-live-card">
                  <div className="auth-live-card-header">
                    <div className="auth-live-avatar-wrap">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=SarahChen"
                        alt="Nurse Sarah"
                        className="auth-live-avatar"
                      />
                      <span className="auth-live-pulse-dot" />
                    </div>
                    <div className="auth-live-info">
                      <h4 className="auth-live-name">Nurse Sarah Chen</h4>
                      <span className="auth-live-role">Registered Geriatric Nurse</span>
                    </div>
                    <span className="auth-live-status-pill">● Active Duty</span>
                  </div>

                  <div className="auth-live-metrics-grid">
                    <div className="auth-live-metric">
                      <span className="auth-metric-lbl">Assigned Elders</span>
                      <span className="auth-metric-num">4 Residents</span>
                    </div>
                    <div className="auth-live-metric">
                      <span className="auth-metric-lbl">Today's Visits</span>
                      <span className="auth-metric-num">3 / 4 Done</span>
                    </div>
                    <div className="auth-live-metric">
                      <span className="auth-metric-lbl">Care Rating</span>
                      <span className="auth-metric-num">4.98 ★</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="login-hero-footer-trust">
              <ShieldCheck size={14} className="login-trust-icon" />
              <span>HIPAA Compliant &amp; 256-Bit Encrypted Healthcare Network</span>
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
