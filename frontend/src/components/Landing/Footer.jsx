import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Toast = ({ message, onDone }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
      background: '#1a202c', color: 'white', padding: '0.75rem 1.5rem',
      borderRadius: '50px', fontSize: '0.88rem', fontWeight: '500',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      animation: 'toastIn 0.3s ease',
    }}>
      <span style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>🚧</span>
      {message}
    </div>
  );
};

const FooterLink = ({ label, to, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        color: hovered ? 'var(--color-primary)' : 'var(--color-text-muted)',
        fontSize: '0.9rem',
        transition: 'color 0.2s ease',
        display: 'flex', alignItems: 'center', gap: '0.3rem',
        userSelect: 'none',
      }}
    >
      {label}
      {hovered && <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>→</span>}
    </span>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const soon = (name) => setToast(`${name} is coming soon!`);

  const platform = [
    { label: 'Features',   action: () => navigate('/features') },
    { label: 'Dashboard',  action: () => navigate('/dashboard') },
    { label: 'Caregivers', action: () => navigate('/caregivers') },
  ];
  const company = [
    { label: 'About Us', action: () => navigate('/about') },
    { label: 'Careers',  action: () => soon('Careers') },
    { label: 'Blog',     action: () => soon('Blog') },
  ];
  const support = [
    { label: 'Help Center',    action: () => soon('Help Center') },
    { label: 'Tours & Safety', action: () => soon('Tours & Safety') },
    { label: 'Privacy Policy', action: () => soon('Privacy Policy') },
  ];

  return (
    <footer style={{ padding: '80px 0', backgroundColor: '#fff', borderTop: '1px solid #edf2f7' }}>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          footer { padding: 48px 0 !important; }
        }
      `}</style>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem' }}>

          <div>
            <h4
              onClick={() => navigate('/')}
              style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '1.5rem', cursor: 'pointer', display: 'inline-block' }}
            >
              FamilyCare
            </h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Building the future of eldercare management for families abroad. Because distance shouldn't mean disconnected.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {['𝕏', 'in', 'f'].map((icon, i) => (
                <button key={i} onClick={() => soon('Social media')} style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1.5px solid #e2e8f0', background: 'none',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700',
                  color: '#718096', transition: 'border-color 0.2s, color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#718096'; }}
                >{icon}</button>
              ))}
            </div>
          </div>

          <div>
            <h5 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Platform</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {platform.map(l => <FooterLink key={l.label} label={l.label} onClick={l.action} />)}
            </div>
          </div>

          <div>
            <h5 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Company</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {company.map(l => <FooterLink key={l.label} label={l.label} onClick={l.action} />)}
            </div>
          </div>

          <div>
            <h5 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Support</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {support.map(l => <FooterLink key={l.label} label={l.label} onClick={l.action} />)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #edf2f7', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          © 2026 FamilyCare Team. All rights reserved. Registered under Universal Project Guidelines.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
