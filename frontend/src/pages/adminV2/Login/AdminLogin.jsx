import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Shield, Mail, Lock } from 'lucide-react';
import api from '../../../services/api';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 2FA state
  const [tfaRequired, setTfaRequired] = useState(false);
  const [tfaPartialToken, setTfaPartialToken] = useState('');
  const [tfaOtp, setTfaOtp] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Force 'admin' role
      const data = await login(email, password, 'admin');
      
      // Additional safety check just in case backend didn't enforce it
      if (data.role !== 'admin') {
        throw new Error('Unauthorized role access.');
      }
      
      navigate('/admin/dashboard');
    } catch (err) {
      const resp = err?.response?.data;
      if (resp?.tfa_required) {
        setTfaPartialToken(resp.partial_token);
        setTfaRequired(true);
        setIsLoading(false);
        return;
      }
      setError(resp?.error || err.message || 'Login failed. Please check credentials.');
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
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid code — please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <Shield size={24} />
          </div>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">Secure access required</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {tfaRequired ? (
          <form onSubmit={handleTfaSubmit}>
            <div className="admin-form-group">
              <label className="admin-label">Authenticator Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={7}
                value={tfaOtp}
                onChange={(e) => setTfaOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000 000"
                className="admin-tfa-otp-input"
                autoFocus
                required
              />
            </div>
            <button type="submit" className="admin-btn" disabled={isLoading || tfaOtp.length < 6}>
              {isLoading ? 'Verifying...' : 'Verify Access'}
            </button>
            <button type="button" className="admin-back-btn" onClick={() => { setTfaRequired(false); setTfaOtp(''); setError(''); }}>
              Back to credentials
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-label">Email Address</label>
              <div className="admin-input-wrapper">
                <Mail size={16} className="admin-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@familycare.com"
                  required
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Password</label>
              <div className="admin-input-wrapper">
                <Lock size={16} className="admin-input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="admin-input"
                />
              </div>
            </div>

            <button type="submit" className="admin-btn" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
