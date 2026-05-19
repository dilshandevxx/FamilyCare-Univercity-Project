import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Home, Contact, CheckCircle2, Lock, Mail, Info } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('family');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    if (role === 'caregiver' || email.includes('caregiver')) {
      navigate('/caregiver/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Left Side Hero (Visible on larger screens) */}
      <div style={{ 
        flex: 1, 
        display: window.innerWidth > 768 ? 'flex' : 'none',
        backgroundImage: 'linear-gradient(to right, rgba(2, 60, 55, 0.8), rgba(2, 60, 55, 0.6)), url("https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        color: 'white'
      }}>
        <div style={{ maxWidth: '400px', position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.2' }}>
            Welcome<br/>Back.
          </h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6', opacity: 0.9 }}>
            Continue your journey of mindful care. Monitor, connect, and support your loved ones from anywhere.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '-10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', border: '2px solid #047857' }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#cbd5e1', border: '2px solid #047857', marginLeft: '-12px' }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#94a3b8', border: '2px solid #047857', marginLeft: '-12px' }}></div>
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>2,000+ families trust us daily</p>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '2rem', left: '4rem', fontSize: '0.8rem', opacity: 0.7, zIndex: 10 }}>
          © 2026 FamilyCare. Your sanctuary for health.
        </div>
      </div>

      {/* Right Side Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#fff', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #edf2f7' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 'bold', color: '#0f172a' }}>Sign in to your account</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem' }}>Choose your role and enter your credentials.</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            {/* Family Member Card */}
            <div 
              onClick={() => setRole('family')}
              style={{
                flex: 1,
                border: role === 'family' ? '2px solid #059669' : '1px solid #e2e8f0',
                backgroundColor: role === 'family' ? '#f0fdf4' : '#fff',
                borderRadius: '12px',
                padding: '1.25rem',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                boxShadow: role === 'family' ? '0 4px 6px -1px rgba(5, 150, 105, 0.1)' : 'none'
              }}
            >
              {role === 'family' && (
                <CheckCircle2 size={18} color="#059669" style={{ position: 'absolute', top: '12px', right: '12px' }} />
              )}
              <div style={{ 
                backgroundColor: role === 'family' ? '#d1fae5' : '#f1f5f9', 
                width: '40px', height: '40px', borderRadius: '8px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' 
              }}>
                <Home size={20} color={role === 'family' ? '#059669' : '#64748b'} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.25rem', color: '#0f172a' }}>Family Member</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>Monitor your loved ones remotely</p>
            </div>

            {/* Caregiver Card */}
            <div 
              onClick={() => setRole('caregiver')}
              style={{
                flex: 1,
                border: role === 'caregiver' ? '2px solid #059669' : '1px solid #e2e8f0',
                backgroundColor: role === 'caregiver' ? '#f0fdf4' : '#fff',
                borderRadius: '12px',
                padding: '1.25rem',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                boxShadow: role === 'caregiver' ? '0 4px 6px -1px rgba(5, 150, 105, 0.1)' : 'none'
              }}
            >
              {role === 'caregiver' && (
                <CheckCircle2 size={18} color="#059669" style={{ position: 'absolute', top: '12px', right: '12px' }} />
              )}
              <div style={{ 
                backgroundColor: role === 'caregiver' ? '#d1fae5' : '#f1f5f9', 
                width: '40px', height: '40px', borderRadius: '8px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' 
              }}>
                <Contact size={20} color={role === 'caregiver' ? '#059669' : '#64748b'} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.25rem', color: '#0f172a' }}>Caregiver</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>Access care logs and schedules</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder={role === 'caregiver' ? "caregiver@example.com" : "sara@example.com"}
                  required 
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }} 
                />
              </div>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#059669', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                  required 
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }} 
                />
              </div>
            </div>
            
            {role === 'caregiver' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #bbf7d0' }}>
                <Info size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: '#047857', margin: 0, lineHeight: '1.4' }}>
                  Signing in as a Caregiver gives you access to care logs, schedules, and patient updates.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <input type="checkbox" id="remember" style={{ marginRight: '0.5rem', width: '16px', height: '16px', accentColor: '#059669' }} />
              <label htmlFor="remember" style={{ fontSize: '0.9rem', color: '#64748b' }}>Remember me for 30 days</label>
            </div>

            <button type="submit" style={{ 
              width: '100%', padding: '0.875rem', fontSize: '1rem', 
              backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', 
              fontWeight: '600', cursor: 'pointer', marginBottom: '1.5rem', transition: 'background-color 0.2s'
            }}>
              Sign in as {role === 'caregiver' ? 'Caregiver' : 'Family Member'}
            </button>
          </form>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{ padding: '0 1rem', fontSize: '0.85rem', color: '#94a3b8' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button style={{ 
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.75rem', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px',
              fontSize: '0.9rem', fontWeight: '500', color: '#334155', cursor: 'pointer'
            }}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
              Google
            </button>
            <button style={{ 
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.75rem', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px',
              fontSize: '0.9rem', fontWeight: '500', color: '#334155', cursor: 'pointer'
            }}>
              <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" style={{ width: '20px', height: '20px' }} />
              Apple
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
            Don't have an account? <Link to="/register" style={{ color: '#059669', fontWeight: '600', textDecoration: 'none' }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
