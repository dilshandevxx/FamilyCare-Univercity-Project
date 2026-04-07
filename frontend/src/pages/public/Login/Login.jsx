import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Heart, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <>
      <style>{`
        /* ── Strict viewport lock ── */
        html, body { margin: 0; padding: 0; height: 100vh; overflow: hidden; }
        
        .lp-page {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          height: 100vh;
          padding-top: 72px;
          width: 100vw;
          font-family: 'Inter', sans-serif;
          background: #FFF;
          box-sizing: border-box;
        }

        /* ── Photo Section (Matching Register) ── */
        .lp-photo {
          position: relative;
          overflow: hidden;
          background: #000;
        }
        .lp-photo__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: brightness(0.7);
        }
        .lp-photo__grad {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%);
        }
        .lp-photo__content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 3rem; z-index: 5;
        }
        .lp-logo {
          display: flex; align-items: center; gap: 0.6rem;
          color: white; font-size: 1.1rem; font-weight: 800; text-decoration: none;
        }
        .lp-logo__icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: #00A896; display: flex; align-items: center; justify-content: center;
        }
        .lp-quote {
          color: white;
          max-width: 400px;
        }
        .lp-quote__text {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .lp-quote__author {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }

        /* ── Login Panel ── */
        .lp-panel {
          height: calc(100vh - 72px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 4rem;
          background: #fff;
          border-left: 1px solid #F3F4F6;
        }
        .lp-form-wrap {
          width: 100%;
          max-width: 360px;
          margin: 0 auto;
        }
        .lp-title {
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }
        .lp-subtitle {
          font-size: 0.95rem;
          color: #6B7280;
          margin: 0 0 2.5rem 0;
        }

        .lp-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .lp-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .lp-label { font-size: 0.85rem; font-weight: 600; color: #374151; }
        
        .lp-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .lp-input-icon {
          position: absolute;
          left: 1rem;
          color: #9CA3AF;
        }
        .lp-input {
          padding: 0.85rem 1rem 0.85rem 2.8rem;
          border: 1.5px solid #E5E7EB;
          border-radius: 12px;
          font-size: 0.95rem;
          outline: none;
          background: #F9FAFB;
          width: 100%;
          box-sizing: border-box;
          transition: all 0.2s;
        }
        .lp-input:focus {
          border-color: #00A896;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(0,168,150,0.1);
        }

        .lp-pw-eye {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #9CA3AF;
          display: flex;
          align-items: center;
        }

        .lp-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          margin-top: 0.2rem;
        }
        .lp-remember { display: flex; align-items: center; gap: 0.5rem; color: #4B5563; cursor: pointer; }
        .lp-remember input { accent-color: #00A896; }
        .lp-forgot { color: #00A896; text-decoration: none; font-weight: 600; }

        .lp-submit {
          background: #111827;
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: all 0.2s;
        }
        .lp-submit:hover:not(:disabled) { background: #1F2937; transform: translateY(-1px); }
        .lp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .lp-register {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.95rem;
          color: #6B7280;
        }
        .lp-register a { color: #00A896; font-weight: 700; text-decoration: none; }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .lp-panel { padding: 0 2rem; }
        }
        @media (max-width: 850px) {
          .lp-page { grid-template-columns: 1fr; }
          .lp-photo { display: none; }
          .lp-panel { padding: 0 1.5rem; }
          html, body { overflow: auto; height: auto; }
        }
      `}</style>

      <div className="lp-page">
        <div className="lp-photo">
          <img src="/assets/images/login_hero.png" alt="Clinical Precision" className="lp-photo__img" />
          <div className="lp-photo__grad" />
          <div className="lp-photo__content">
            <Link to="/" className="lp-logo">
              <div className="lp-logo__icon"><Heart size={20} color="white" fill="white" /></div>
              FamilyCare
            </Link>
            <div className="lp-quote">
              <h2 className="lp-quote__text">Clinical Precision.<br/>Family Warmth.</h2>
              <p className="lp-quote__author">Back to your private sanctuary</p>
            </div>
          </div>
        </div>

        <div className="lp-panel">
          <div className="lp-form-wrap">
            <h1 className="lp-title">Welcome Back</h1>
            <p className="lp-subtitle">Please enter your details to sign in.</p>

            <form className="lp-form" onSubmit={handleSubmit}>
              <div className="lp-field">
                <label className="lp-label">Email Address</label>
                <div className="lp-input-wrap">
                  <Mail className="lp-input-icon" size={18} />
                  <input 
                    name="email"
                    type="email" 
                    className="lp-input" 
                    placeholder="name@email.com" 
                    value={form.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <div className="lp-field">
                <label className="lp-label">Password</label>
                <div className="lp-input-wrap">
                  <Lock className="lp-input-icon" size={18} />
                  <input 
                    name="password"
                    type={showPw ? 'text' : 'password'} 
                    className="lp-input" 
                    placeholder="••••••••" 
                    value={form.password}
                    onChange={handleChange}
                    required 
                  />
                  <button type="button" className="lp-pw-eye" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="lp-options">
                <label className="lp-remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="lp-forgot">Forgot password?</a>
              </div>

              <button type="submit" className="lp-submit" disabled={loading}>
                {loading ? 'Signing in...' : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="lp-register">
              New here? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
