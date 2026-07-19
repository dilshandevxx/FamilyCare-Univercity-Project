import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../../../services/api';
import nurseImage from '../../../assets/about/nurse_holding_hands.png';
import './Login.css';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('family');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        
        {/* ── LEFT PANEL (FORM) ── */}
        <div className="login-left">
          
          <h2 className="login-header-text">SIGN IN</h2>

          {error && <div className="login-error">{error}</div>}

          {tfaRequired ? (
            <form onSubmit={handleTfaSubmit}>
              <div className="login-form-group">
                <label className="login-label">Authenticator Code</label>
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
                {isLoading ? 'VERIFYING...' : 'VERIFY'}
              </button>
              <button type="button" className="tfa-back-btn" onClick={() => { setTfaRequired(false); setTfaOtp(''); setError(''); }}>
                Back to login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              
              <div className="role-tabs">
                {[
                  { id: 'family', label: 'Family' },
                  { id: 'caregiver', label: 'Caregiver' }
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

              <div className="login-form-group">
                <label className="login-label">Email Address</label>
                <div className="login-input-wrapper">
                  <Mail size={16} className="login-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="john123@gmail.com"
                    required
                    className="login-input"
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label className="login-label">Password</label>
                <div className="login-input-wrapper">
                  <Lock size={16} className="login-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    className="login-input"
                  />
                  <button
                    type="button"
                    className="login-pwd-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="login-forgot-container">
                <Link to="/forgot-password" className="login-forgot">Forget Password?</Link>
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </button>

              <div className="login-divider">Or you can join with</div>

              <div className="login-social-group">
                <a href="http://localhost:5000/api/auth/facebook" className="login-social-btn bg-facebook">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
                </a>
                <a href="http://localhost:5000/api/auth/twitter" className="login-social-btn bg-twitter">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="http://localhost:5000/api/auth/google" className="login-social-btn bg-google">
                  <span style={{ fontWeight: 'bold', fontSize: '1rem', marginTop: '-2px' }}>G+</span>
                </a>
              </div>
            </form>
          )}

          <p className="login-footer" style={{ marginTop: '0.75rem' }}>
            Don't have an account yet? <Link to="/register">Sign Up</Link>
          </p>
        </div>

        {/* ── RIGHT PANEL (BANNER) ── */}
        <div className="login-right">
          <div className="login-right-title">HELLO,</div>
          <div className="login-right-subtitle">WELCOME BACK</div>
          
          <img src={nurseImage} alt="Welcome illustration" className="login-right-image" />

          <div className="login-signup-footer">
            <span className="login-signup-text">Don't have an account yet?</span>
            <Link to="/register" className="login-signup-link">Sign Up</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
