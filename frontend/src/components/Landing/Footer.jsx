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
      <span style={{ color: '#10b981', fontSize: '1rem' }}>🚧</span>
      {message}
    </div>
  );
};

const FooterLink = ({ label, to, onClick }) => {
  return (
    <li>
      <a href={to || "#"} onClick={(e) => {
        e.preventDefault();
        onClick();
      }}>
        {label}
      </a>
    </li>
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
    { label: 'Careers',  action: () => navigate('/careers') },
    { label: 'Blog',     action: () => navigate('/blog') },
  ];
  const support = [
    { label: 'Help Center',    action: () => navigate('/help-center') },
    { label: 'Tours & Safety', action: () => navigate('/tours-and-safety') },
    { label: 'Privacy Policy', action: () => navigate('/privacy-policy') },
  ];

  return (
    <footer className="landing-footer">
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div className="container">
        <div className="footer-grid">

          <div>
            <h4
              onClick={() => navigate('/')}
              className="footer-logo"
              style={{ cursor: 'pointer' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                FC
              </div>
              FamilyCare
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Building the future of eldercare management for families abroad. Because distance shouldn't mean disconnected.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {['𝕏', 'in', 'f'].map((icon, i) => (
                <div
                  key={i}
                  onClick={() => soon('Social Media')}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#94a3b8', transition: 'background 0.2s', fontSize: '0.9rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="footer-heading">Platform</h5>
            <ul className="footer-links">
              {platform.map((item, i) => <FooterLink key={i} label={item.label} onClick={item.action} />)}
            </ul>
          </div>

          <div>
            <h5 className="footer-heading">Company</h5>
            <ul className="footer-links">
              {company.map((item, i) => <FooterLink key={i} label={item.label} onClick={item.action} />)}
            </ul>
          </div>

          <div>
            <h5 className="footer-heading">Support</h5>
            <ul className="footer-links">
              {support.map((item, i) => <FooterLink key={i} label={item.label} onClick={item.action} />)}
            </ul>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
            © {new Date().getFullYear()} FamilyCare Inc. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span onClick={() => navigate('/terms')} style={{ fontSize: '0.85rem', color: '#94a3b8', cursor: 'pointer' }}>Terms of Service</span>
            <span onClick={() => navigate('/privacy-policy')} style={{ fontSize: '0.85rem', color: '#94a3b8', cursor: 'pointer' }}>Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
