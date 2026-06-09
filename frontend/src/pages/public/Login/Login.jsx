import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Home, Contact, Shield, Lock, Mail, Info, ShieldCheck } from 'lucide-react';
import api from '../../../services/api';
import nurseImage from '../../../assets/about/nurse_holding_hands.png';

const TEAL = '#00A896';
const TEAL_DARK = '#008f80';
const TEAL_LIGHT = '#E6F7F5';

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

  const RoleCard = ({ role, label, description, icon }) => {
    const active = selectedRole === role;
    return (
      <button
        type="button"
        onClick={() => setSelectedRole(role)}
        style={{
          padding: '0.9rem',
          borderRadius: '12px',
          border: `2px solid ${active ? TEAL : '#E2E8F0'}`,
          backgroundColor: active ? TEAL_LIGHT : 'white',
          cursor: 'pointer',
          textAlign: 'left',
          position: 'relative',
          transition: 'all 0.2s',
        }}
      >
        {active && (
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '18px', height: '18px', borderRadius: '50%',
            backgroundColor: TEAL,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{icon}</div>
        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1a202c', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: '#718096', lineHeight: 1.4 }}>{description}</div>
      </button>
    );
  };

  return (
    <>
    <style>{`
      @media (max-width: 768px) {
        .login-hero-panel { display: none !important; }
        .login-form-panel { flex: unset !important; width: 100% !important; }
      }
    `}</style>
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc' }}>

      {/* Left panel — hero image */}
      <div className="login-hero-panel" style={{
        flex: 1,
        backgroundImage: `url(${nurseImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        minHeight: '100vh',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,50,40,0.55), rgba(0,30,25,0.8))' }} />

        {/* Logo */}
        <Link to="/" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21C12 21 3 14 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14 14 21 12 21Z" fill="white"/>
            </svg>
          </div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '1.2rem', letterSpacing: '-0.3px' }}>FamilyCare</span>
        </Link>

        {/* Welcome text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-1px' }}>
            Welcome<br />Back.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '320px' }}>
            Continue your journey of mindful care.<br />
            Monitor, connect, and support your loved ones from anywhere.
          </p>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex' }}>
              {['#4CAF50', '#2196F3', '#FF9800'].map((color, i) => (
                <div key={i} style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  backgroundColor: color, border: '2px solid white',
                  marginLeft: i > 0 ? '-8px' : 0,
                }} />
              ))}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem' }}>
              <strong>2,000+</strong> families trust us daily
            </span>
          </div>
        </div>

        {/* Bottom copyright */}
        <p style={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>
          © 2026 FamilyCare. Your sanctuary for health.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="login-form-panel" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: 'white',
      }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          {/* Back to home */}
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#6B7280', fontSize: '0.82rem', textDecoration: 'none',
            marginBottom: '1.4rem', fontWeight: '500',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to home
          </Link>

          <h2 style={{ fontSize: '1.65rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.3rem' }}>
            Sign in to your account
          </h2>
          <p style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '1.8rem' }}>
            Choose your role and enter your credentials.
          </p>

          {/* Role selector — hidden during 2FA step */}
          {!tfaRequired && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '1.8rem' }}>
              <RoleCard
                role="family"
                label="Family Member"
                description="Monitor your loved ones remotely"
                icon={<Home size={20} color={selectedRole === 'family' ? TEAL : '#64748b'} />}
              />
              <RoleCard
                role="caregiver"
                label="Caregiver"
                description="Access care logs and schedules"
                icon={<Contact size={20} color={selectedRole === 'caregiver' ? TEAL : '#64748b'} />}
              />
              <RoleCard
                role="admin"
                label="Admin"
                description="Manage platform & users"
                icon={<Shield size={20} color={selectedRole === 'admin' ? TEAL : '#64748b'} />}
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5',
              borderRadius: '8px', padding: '10px 12px', marginBottom: '1rem',
            }}>
              <span style={{ color: '#DC2626', fontSize: '0.85rem', flexShrink: 0 }}>✕</span>
              <p style={{ fontSize: '0.78rem', color: '#B91C1C', margin: 0, lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          {/* ── 2FA verification step ── */}
          {tfaRequired ? (
            <form onSubmit={handleTfaSubmit}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: '#f0fdf4', border: '1px solid #86efac',
                borderRadius: '10px', padding: '12px 14px', marginBottom: '1.4rem',
              }}>
                <ShieldCheck size={20} color="#16a34a" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '0.85rem', color: '#166534' }}>
                    Two-Factor Authentication
                  </p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#15803d', lineHeight: 1.4 }}>
                    Open your authenticator app and enter the 6-digit code.
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.83rem', fontWeight: '500', color: '#374151' }}>
                  Authenticator Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={7}
                  value={tfaOtp}
                  onChange={e => setTfaOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  autoFocus
                  required
                  style={{
                    width: '100%', padding: '0.72rem 0.75rem',
                    borderRadius: '10px', border: '1.5px solid #E2E8F0',
                    fontSize: '1.8rem', fontWeight: '700', letterSpacing: '0.4em',
                    textAlign: 'center', outline: 'none', boxSizing: 'border-box', color: '#1a202c',
                  }}
                  onFocus={e => e.target.style.borderColor = TEAL}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || tfaOtp.length < 6}
                style={{
                  width: '100%', padding: '0.85rem',
                  backgroundColor: TEAL, color: 'white', border: 'none',
                  borderRadius: '10px', fontSize: '0.9rem', fontWeight: '600',
                  cursor: isLoading || tfaOtp.length < 6 ? 'not-allowed' : 'pointer',
                  opacity: isLoading || tfaOtp.length < 6 ? 0.7 : 1,
                  marginBottom: '1rem',
                }}
              >
                {isLoading ? 'Verifying…' : 'Confirm & Sign In'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#6B7280' }}>
                <button
                  type="button"
                  onClick={() => { setTfaRequired(false); setTfaOtp(''); setError(''); }}
                  style={{ background: 'none', border: 'none', color: TEAL, cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                >
                  ← Back to login
                </button>
              </p>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.83rem', fontWeight: '500', color: '#374151' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === 'caregiver' ? 'caregiver@example.com' : 'name@example.com'}
                      required
                      style={{
                        width: '100%', padding: '0.72rem 0.75rem 0.72rem 2.2rem',
                        borderRadius: '10px', border: '1.5px solid #E2E8F0',
                        fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', color: '#1a202c',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = TEAL}
                      onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.83rem', fontWeight: '500', color: '#374151' }}>Password</label>
                    <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: TEAL, textDecoration: 'none', fontWeight: '500' }}>
                      Forgot password?
                    </Link>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{
                        width: '100%', padding: '0.72rem 2.5rem 0.72rem 2.2rem',
                        borderRadius: '10px', border: '1.5px solid #E2E8F0',
                        fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', color: '#1a202c',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = TEAL}
                      onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#9CA3AF', padding: 0,
                      }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Caregiver info banner */}
                {selectedRole === 'caregiver' && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    backgroundColor: '#F0FDF4', border: '1px solid #86EFAC',
                    borderRadius: '8px', padding: '10px 12px', marginBottom: '1rem',
                  }}>
                    <Info size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '0.78rem', color: '#15803D', margin: 0, lineHeight: 1.5 }}>
                      Signing in as a Caregiver gives you access to care logs, schedules, and patient updates.
                    </p>
                  </div>
                )}

                {/* Remember me */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.4rem' }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: TEAL }}
                  />
                  <label htmlFor="rememberMe" style={{ fontSize: '0.83rem', color: '#4A5568', cursor: 'pointer' }}>
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%', padding: '0.85rem',
                    backgroundColor: isLoading ? TEAL_DARK : TEAL,
                    color: 'white', border: 'none', borderRadius: '10px',
                    fontSize: '0.9rem', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.8 : 1, transition: 'all 0.2s',
                    marginBottom: '1.4rem'
                  }}
                >
                  {isLoading ? 'Signing in...' : `Sign in as ${selectedRole === 'caregiver' ? 'Caregiver' : selectedRole === 'admin' ? 'Admin' : 'Family Member'}`}
                </button>
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.4rem 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                <span style={{ fontSize: '0.78rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>or continue with</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              </div>

              {/* Social buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '1.4rem' }}>
                <a href="http://localhost:5000/api/auth/google" style={{
                  padding: '0.7rem', border: '1.5px solid #E2E8F0', borderRadius: '10px',
                  backgroundColor: 'white', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '500', color: '#374151',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  textDecoration: 'none',
                }}>
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '16px', height: '16px' }} />
                  Google
                </a>
                <a href="http://localhost:5000/api/auth/github" style={{
                  padding: '0.7rem', border: '1.5px solid #E2E8F0', borderRadius: '10px',
                  backgroundColor: 'white', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '500', color: '#374151',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  textDecoration: 'none',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#374151"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
                <a href="#" onClick={e => e.preventDefault()} title="Apple Sign In coming soon" style={{
                  padding: '0.7rem', border: '1.5px solid #E2E8F0', borderRadius: '10px',
                  backgroundColor: '#f9fafb', cursor: 'not-allowed', fontSize: '0.82rem', fontWeight: '500', color: '#9CA3AF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  textDecoration: 'none',
                }}>
                  <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" style={{ width: '16px', height: '16px', opacity: 0.4 }} />
                  Apple
                </a>
              </div>

              <p style={{ textAlign: 'center', fontSize: '0.83rem', color: '#6B7280' }}>
                Don&apos;t have an account?{' '}
                <Link to="/register" style={{ color: TEAL, fontWeight: '600', textDecoration: 'none' }}>
                  Create account
                </Link>
              </p>

              {/* Quick nav links */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '1.4rem', paddingTop: '1.2rem', borderTop: '1px solid #F1F5F9' }}>
                {[{ label: 'Home', to: '/' }, { label: 'Features', to: '/features' }, { label: 'About', to: '/about' }].map(({ label, to }) => (
                  <Link key={to} to={to} style={{ fontSize: '0.78rem', color: '#9CA3AF', textDecoration: 'none', fontWeight: '500' }}>
                    {label}
                  </Link>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
