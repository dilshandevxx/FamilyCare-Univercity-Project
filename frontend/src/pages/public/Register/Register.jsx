import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, Users, Briefcase, Heart } from 'lucide-react';

const FAMILY_OPTIONS   = ['Son / Daughter', 'Spouse / Partner', 'Grandchild', 'Relative'];
const CAREGIVER_OPTIONS = ['1 – 3 years', '3 – 5 years', '5+ years', 'Certified Nurse'];

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole]     = useState('family');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', relationship: '' });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/dashboard'); }, 1000);
  };

  const selectOptions = role === 'family' ? FAMILY_OPTIONS : CAREGIVER_OPTIONS;

  return (
    <>
      <style>{`
        /* ── Strict viewport lock ── */
        html, body { margin: 0; padding: 0; height: 100vh; overflow: hidden; }
        
        .rp-page {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          height: calc(100vh - 72px);
          padding-top: 72px;
          margin: 0;
          width: 100vw;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          background: #FFF;
          box-sizing: border-box;
        }

        /* ── Photo Section ── */
        .rp-photo {
          position: relative;
          overflow: hidden;
          background: #111;
        }
        .rp-photo__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: brightness(0.85);
        }
        .rp-photo__grad {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,20,15,0.9), transparent 70%);
        }
        .rp-photo__content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 2rem; z-index: 5;
        }
        .rp-logo {
          display: flex; align-items: center; gap: 0.5rem;
          color: white; font-size: 1rem; font-weight: 800; text-decoration: none;
        }
        .rp-logo__icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: #00A896; display: flex; align-items: center; justify-content: center;
        }
        .rp-photo__text { color: white; }
        .rp-headline { font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 800; line-height: 1.1; margin: 0 0 0.5rem 0; }
        .rp-sub { font-size: 0.9rem; color: rgba(255,255,255,0.8); line-height: 1.5; margin: 0 0 1.2rem 0; max-width: 350px; }
        
        .rp-social { display: flex; align-items: center; gap: 0.6rem; font-size: 0.8rem; }
        .rp-avs { display: flex; align-items: center; }
        .rp-av { width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; margin-left: -10px; background-size: cover; }
        .rp-av:first-child { margin-left: 0; }

        /* ── Form Section ── */
        .rp-panel {
          height: calc(100vh - 72px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 2.5rem;
          background: #FAFAFA;
          border-left: 1px solid #F3F4F6;
          box-sizing: border-box;
          overflow-y: auto;
        }
        .rp-form-wrap { width: 100%; max-width: 380px; margin: 0 auto; }

        .rp-title { font-size: 1.7rem; font-weight: 800; color: #111827; margin: 0 0 0.2rem 0; }
        .rp-subtitle { font-size: 0.85rem; color: #6B7280; margin: 0 0 1.2rem 0; }

        .rp-role-label { font-size: 0.65rem; font-weight: 700; color: #9CA3AF; text-transform: uppercase; margin-bottom: 0.6rem; }
        .rp-roles { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1.2rem; }
        
        .rp-role-btn {
          border: 1.5px solid #E5E7EB; background: white; border-radius: 10px;
          padding: 0.75rem; cursor: pointer; transition: all 0.2s;
          display: flex; flex-direction: column; gap: 0.2rem; position: relative;
        }
        .rp-role-btn.active { border-color: #00A896; background: #F0FDFA; }
        .rp-role-icon { width: 30px; height: 30px; border-radius: 7px; background: #F3F4F6; display: flex; align-items: center; justify-content: center; }
        .rp-role-btn.active .rp-role-icon { background: #CCF2EE; }
        .rp-role-name { font-weight: 700; font-size: 0.85rem; color: #111827; }
        .rp-role-desc { font-size: 0.68rem; color: #6B7280; line-height: 1.2; }

        .rp-form { display: flex; flex-direction: column; gap: 0.7rem; }
        .rp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
        .rp-field { display: flex; flex-direction: column; gap: 0.25rem; }
        .rp-label { font-size: 0.75rem; font-weight: 600; color: #374151; }
        
        .rp-input {
          padding: 0.6rem 0.8rem; border: 1.5px solid #E5E7EB; border-radius: 8px;
          font-size: 0.85rem; outline: none; background: #FFF; width: 100%; box-sizing: border-box;
        }
        .rp-input:focus { border-color: #00A896; box-shadow: 0 0 0 3px rgba(0,168,150,0.08); }

        .rp-pw-wrap { position: relative; }
        .rp-pw-eye { position: absolute; right: 0.7rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9CA3AF; }

        .rp-sel-wrap { position: relative; }
        .rp-sel { appearance: none; padding-right: 2rem; cursor: pointer; }
        .rp-sel-arr { position: absolute; right: 0.7rem; top: 50%; transform: translateY(-50%); color: #9CA3AF; font-size: 0.75rem; }

        .rp-terms { display: flex; gap: 0.5rem; font-size: 0.75rem; color: #6B7280; align-items: flex-start; cursor: pointer; margin-top: 0.1rem; }
        .rp-terms input { margin-top: 2px; accent-color: #00A896; width: 14px; height: 14px; }

        .rp-submit {
          background: #00A896; color: white; border: none; padding: 0.8rem;
          border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer;
          margin-top: 0.4rem; width: 100%;
        }
        .rp-submit:hover:not(:disabled) { background: #008F80; }
        .rp-submit:disabled { opacity: 0.5; }

        .rp-login { text-align: center; margin-top: 0.8rem; font-size: 0.85rem; color: #6B7280; }
        .rp-login a { color: #00A896; font-weight: 700; text-decoration: none; }
        
        .rp-foot { text-align: center; font-size: 0.65rem; color: #9CA3AF; margin-top: 1rem; }

        /* ── Responsive ── */
        @media (max-width: 950px) {
          .rp-page { grid-template-columns: 1fr; overflow: auto; height: auto; }
          html, body { overflow: auto; height: auto; }
          .rp-photo { display: none; }
          .rp-panel { height: auto; padding: 3rem 1.5rem; }
        }
      `}</style>

      <div className="rp-page">
        <div className="rp-photo">
          <img className="rp-photo__img" src="/assets/images/register_hero.png" alt="Caregiver with senior" />
          <div className="rp-photo__grad" />
          <div className="rp-photo__content">
            <Link to="/" className="rp-logo">
              <div className="rp-logo__icon"><Heart size={18} color="white" fill="white" /></div>
              FamilyCare
            </Link>
            <div className="rp-photo__text">
              <h2 className="rp-headline">Start Caring Smarter.</h2>
              <p className="rp-sub">Join a community dedicated to providing tech-enabled care for your loved ones.</p>
              <div className="rp-social">
                <div className="rp-avs">
                  <div className="rp-av" style={{backgroundImage: "url(https://i.pravatar.cc/100?img=32)"}}/>
                  <div className="rp-av" style={{backgroundImage: "url(https://i.pravatar.cc/100?img=12)"}}/>
                  <div className="rp-av" style={{backgroundImage: "url(https://i.pravatar.cc/100?img=44)"}}/>
                </div>
                <span><strong>2,000+</strong> families trust us daily</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rp-panel">
          <div className="rp-form-wrap">
            <h1 className="rp-title">Create Account</h1>
            <p className="rp-subtitle">Select your role to get started.</p>
            
            <p className="rp-role-label">Your Role</p>
            <div className="rp-roles">
              <button type="button" className={`rp-role-btn ${role === 'family' ? 'active' : ''}`} onClick={() => setRole('family')}>
                {role === 'family' && <CheckCircle style={{position:'absolute', top:'8px', right:'8px'}} size={14} color="#00A896" />}
                <div className="rp-role-icon"><Users size={18} color={role === 'family' ? '#00A896' : '#9CA3AF'} /></div>
                <span className="rp-role-name">Family</span>
                <span className="rp-role-desc">Monitor parents.</span>
              </button>
              <button type="button" className={`rp-role-btn ${role === 'caregiver' ? 'active' : ''}`} onClick={() => setRole('caregiver')}>
                {role === 'caregiver' && <CheckCircle style={{position:'absolute', top:'8px', right:'8px'}} size={14} color="#00A896" />}
                <div className="rp-role-icon"><Briefcase size={18} color={role === 'caregiver' ? '#00A896' : '#9CA3AF'} /></div>
                <span className="rp-role-name">Caregiver</span>
                <span className="rp-role-desc">Provide care.</span>
              </button>
            </div>

            <form className="rp-form" onSubmit={handleSubmit}>
              <div className="rp-grid">
                <div className="rp-field"><label className="rp-label">Name</label><input className="rp-input" placeholder="Jane Doe" onChange={handleChange} required /></div>
                <div className="rp-field"><label className="rp-label">Email</label><input className="rp-input" placeholder="jane@mail.com" onChange={handleChange} required /></div>
              </div>
              <div className="rp-grid">
                <div className="rp-field"><label className="rp-label">Phone</label><input className="rp-input" placeholder="+1..." onChange={handleChange} /></div>
                <div className="rp-field">
                  <label className="rp-label">Password</label>
                  <div className="rp-pw-wrap">
                    <input className="rp-input" type={showPw ? 'text' : 'password'} placeholder="••••••••" onChange={handleChange} required />
                    <button type="button" className="rp-pw-eye" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                </div>
              </div>
              <div className="rp-field">
                <label className="rp-label">{role === 'family' ? 'Relationship' : 'Experience'}</label>
                <div className="rp-sel-wrap">
                  <select className="rp-input rp-sel" onChange={handleChange}>
                    <option value="">Choose...</option>
                    {selectOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="rp-sel-arr">▾</span>
                </div>
              </div>
              <label className="rp-terms">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>I agree to the <a href="#" className="rp-link">Terms</a> and <a href="#" className="rp-link">Privacy</a>.</span>
              </label>
              <button type="submit" className="rp-submit" disabled={!agreed || loading}>
                {loading ? 'Working...' : 'Create Account'}
              </button>
            </form>
            <p className="rp-login">Joined before? <Link to="/login">Login</Link></p>
            <p className="rp-foot">©2024 FAMILYCARE. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
