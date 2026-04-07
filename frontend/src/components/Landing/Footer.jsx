import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '80px 0', backgroundColor: '#fff', borderTop: '1px solid #edf2f7' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem' }}>
          <div>
            <h4 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>FamilyCare</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Building the future of eldercare management for families abroad. Because distance shouldn't mean disconnected.
            </p>
          </div>
          <div>
            <h5 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Platform</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <span>Features</span>
              <span>Dashboard</span>
              <span>Caregivers</span>
            </div>
          </div>
          <div>
            <h5 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Company</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <span>About Us</span>
              <span>Careers</span>
              <span>Blog</span>
            </div>
          </div>
          <div>
            <h5 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Support</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <span>Help Center</span>
              <span>Tours & Safety</span>
              <span>Privacy Policy</span>
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
