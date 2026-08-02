import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import BrandLogo from '../../../components/common/BrandLogo';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fpw-root">
      <div className="fpw-card">

        {/* Brand — click to go home */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <BrandLogo to="/" size="lg" />
        </div>

        {sent ? (
          /* ── Success state ── */
          <div className="fpw-success">
            <div className="fpw-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2>Check your email</h2>
            <p>We sent a reset link to <strong>{email}</strong>. The link expires in 1 hour.</p>
            <p className="fpw-hint">
              Didn't receive it? Check your spam folder or{' '}
              <button className="fpw-retry-btn" onClick={() => setSent(false)}>try again</button>.
            </p>
            <Link to="/login" className="fpw-back-link">← Back to Sign In</Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className="fpw-heading">
              <h2>Forgot your password?</h2>
              <p>Enter your email and we'll send you a link to reset it.</p>
            </div>

            {error && (
              <div className="fpw-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="fpw-form">
              <div className="fpw-field">
                <label htmlFor="fpw-email">Email Address</label>
                <div className="fpw-input-wrap">
                  <svg className="fpw-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    id="fpw-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="fpw-input"
                    required
                    autoFocus
                    autoComplete="email"
                  />
                </div>
              </div>

              <button type="submit" className="fpw-submit-btn" disabled={isLoading}>
                {isLoading
                  ? <><span className="fpw-spinner"></span> Sending…</>
                  : 'Send Reset Link'}
              </button>
            </form>

            <Link to="/login" className="fpw-back-link">← Back to Sign In</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
