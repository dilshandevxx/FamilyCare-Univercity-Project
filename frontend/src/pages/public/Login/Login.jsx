import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import nurseImage from '../../../assets/about/nurse_holding_hands.png';

const TEAL = '#00A896';
const TEAL_DARK = '#008f80';
const TEAL_LIGHT = '#E6F7F5';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('family');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password, selectedRole);
      if (selectedRole === 'caregiver') {
        navigate('/caregiver/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err?.response?.data?.error || 'Login failed. Please try again.';
      setError(msg);
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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* Left panel — hero image */}
      <div style={{
        flex: 1,
        backgroundImage: `url(${nurseImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem',
        minHeight: '100vh',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,50,40,0.45), rgba(0,30,25,0.7))' }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21C12 21 3 14 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14 14 21 12 21Z" fill="white"/>
            </svg>
          </div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '1.2rem', letterSpacing: '-0.3px' }}>FamilyCare</span>
        </div>

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
          © 2024 FamilyCare. Your sanctuary for health.
        </p>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: '480px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 2.8rem',
        backgroundColor: 'white',
        overflowY: 'auto',
      }}>
        <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>

          <h2 style={{ fontSize: '1.55rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.3rem' }}>
            Sign in to your account
          </h2>
          <p style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '1.8rem' }}>
            Choose your role and enter your credentials.
          </p>

          {/* Role selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.8rem' }}>
            <RoleCard
              role="family"
              label="Family Member"
              description="Monitor your loved ones remotely"
              icon="👤"
            />
            <RoleCard
              role="caregiver"
              label="Caregiver"
              description="Access care logs and schedules"
              icon="🩺"
            />
          </div>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.83rem', fontWeight: '500', color: '#374151' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '0.9rem' }}>
                  ✉
                </span>
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
                <a href="#" style={{ fontSize: '0.78rem', color: TEAL, textDecoration: 'none', fontWeight: '500' }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '0.9rem' }}>
                  🔒
                </span>
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
                <span style={{ color: '#16A34A', fontSize: '0.85rem', flexShrink: 0, marginTop: '1px' }}>✓</span>
                <p style={{ fontSize: '0.78rem', color: '#15803D', margin: 0, lineHeight: 1.5 }}>
                  Signing in as a Caregiver gives you access to care logs, schedules, and patient updates.
                </p>
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
              }}
              onMouseEnter={e => { if (!isLoading) e.target.style.backgroundColor = TEAL_DARK; }}
              onMouseLeave={e => { if (!isLoading) e.target.style.backgroundColor = TEAL; }}
            >
              {isLoading ? 'Signing in...' : `Sign in as ${selectedRole === 'caregiver' ? 'Caregiver' : 'Family Member'}`}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.4rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.4rem' }}>
            <button style={{
              padding: '0.7rem', border: '1.5px solid #E2E8F0', borderRadius: '10px',
              backgroundColor: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', color: '#374151',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              transition: 'border-color 0.2s',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button style={{
              padding: '0.7rem', border: '1.5px solid #E2E8F0', borderRadius: '10px',
              backgroundColor: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', color: '#374151',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
            }}>
              <svg width="15" height="15" viewBox="0 0 814 1000" fill="#1a202c">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.3-57.9-155.8-127.5C98 411.3 68 260.8 68 219.7c0-23.5 0-236.9 142.6-280.5 37.2-12.2 74.9-14.8 111.1-14.8 47.1 0 91.6 9.6 131.8 9.6 39 0 84.5-9.6 132.8-9.6 39 0 78.5 3.2 117.4 19.2 39.5 16 71.3 42.8 95.1 92.3l-136.8 113.2z"/>
              </svg>
              Apple
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.83rem', color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: TEAL, fontWeight: '600', textDecoration: 'none' }}>
              Create account
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9CA3AF', marginTop: '1.5rem' }}>
            © 2024 FamilyCare. Your sanctuary for health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
