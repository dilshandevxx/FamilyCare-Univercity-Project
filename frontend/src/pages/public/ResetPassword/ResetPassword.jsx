import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../../services/api';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match.');
    if (password.length < 6)  return setError('Password must be at least 6 characters.');
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Reset link is invalid or expired. Please request a new one.');
    } finally {
      setIsLoading(false);
    }
  };

  const BrandBar = () => (
    <Link to="/" className="rp-brand">
      <div className="rp-brand-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <span className="rp-brand-name">FamilyCare</span>
    </Link>
  );

  if (!token) {
    return (
      <div className="rp-root">
        <div className="rp-card">
          <BrandBar />
          <div className="rp-heading">
            <h2>Invalid link</h2>
            <p>This reset link is missing or malformed. Please request a new one.</p>
          </div>
          <Link to="/forgot-password" className="rp-submit-btn">Request New Link</Link>
          <Link to="/login" className="rp-back-link">← Back to Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rp-root">
      <div className="rp-card">
        <BrandBar />

        {done ? (
          <div className="rp-success">
            <div className="rp-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2>Password updated!</h2>
            <p>Your password has been reset. Redirecting you to sign in…</p>
            <Link to="/login" className="rp-submit-btn">Go to Sign In</Link>
          </div>
        ) : (
          <>
            <div className="rp-heading">
              <h2>Set a new password</h2>
              <p>Choose a strong password for your account.</p>
            </div>

            {error && (
              <div className="rp-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="rp-form">

              <div className="rp-field">
                <label htmlFor="rp-pw">New Password</label>
                <div className="rp-input-wrap">
                  <svg className="rp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="rp-pw"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="rp-input"
                    required
                    autoFocus
                  />
                  <button type="button" className="rp-eye-btn" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                    {showPw ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="rp-field">
                <label htmlFor="rp-confirm">Confirm Password</label>
                <div className="rp-input-wrap">
                  <svg className="rp-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="rp-confirm"
                    type={showPw ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    className="rp-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="rp-submit-btn" disabled={isLoading}>
                {isLoading
                  ? <><span className="rp-spinner"></span> Updating…</>
                  : 'Reset Password'}
              </button>
            </form>

            <Link to="/login" className="rp-back-link">← Back to Sign In</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
