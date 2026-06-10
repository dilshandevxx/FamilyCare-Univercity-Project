import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();
  const [showReassurance, setShowReassurance] = useState(false);

  const reassuranceItems = [
    { icon: '🔍', title: 'Explore features first', desc: 'See everything FamilyCare offers before signing up.', action: () => navigate('/features'), label: 'View Features' },
    { icon: '👥', title: 'Meet our caregivers', desc: 'Browse verified caregivers and understand how we vet them.', action: () => navigate('/caregivers'), label: 'Browse Caregivers' },
    { icon: '📖', title: 'Learn about us', desc: 'Find out who we are and why families trust us.', action: () => navigate('/about'), label: 'About FamilyCare' },
  ];

  return (
    <section className="cta-section" style={{ padding: '80px 0' }}>
      <div className="container">
        <div className="cta-inner" style={{
          background: 'radial-gradient(circle at 30% 50%, #1a2f3e 0%, #0a0f14 100%)',
          padding: '5rem 2rem',
          borderRadius: '32px',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 30px 60px -10px rgba(0,0,0,0.35)',
          transition: 'padding 0.4s ease',
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: '-60px', left: '-60px',
            width: '280px', height: '280px', borderRadius: '50%',
            border: '1.5px solid rgba(0,168,150,0.2)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', top: '-20px', left: '-20px',
            width: '180px', height: '180px', borderRadius: '50%',
            border: '1.5px solid rgba(0,168,150,0.12)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '-80px', right: '-80px',
            width: '340px', height: '340px', borderRadius: '50%',
            border: '1.5px solid rgba(0,168,150,0.18)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '-30px', right: '-30px',
            width: '200px', height: '200px', borderRadius: '50%',
            border: '1.5px solid rgba(0,168,150,0.1)',
            pointerEvents: 'none'
          }} />
          {/* Teal glow blob */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '500px', height: '200px',
            background: 'radial-gradient(ellipse, rgba(0,168,150,0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem', lineHeight: 1.2 }}>
              Start caring for your loved ones today.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
              Join our community of over 100k users. Take control of your family's health with our easy-to-use platform.
            </p>
            <div className="cta-btn-row" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary cta-btn-primary"
                style={{ padding: '15px 40px' }}
                onClick={() => navigate('/register')}
              >
                Get Started
              </button>
              <button
                className="btn cta-btn-ghost"
                style={{
                  background: showReassurance ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: 'white',
                  border: `1.5px solid ${showReassurance ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)'}`,
                  padding: '15px 40px',
                }}
                onClick={() => setShowReassurance(prev => !prev)}
              >
                {showReassurance ? 'Never mind ↑' : 'Not yet ready?'}
              </button>
            </div>

            {/* Reassurance panel */}
            <div className={`cta-reassurance ${showReassurance ? 'open' : ''}`}>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                No pressure — here are some ways to learn more first:
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {reassuranceItems.map(item => (
                  <div key={item.title} className="cta-card" onClick={item.action} style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px', padding: '1.25rem 1.5rem',
                    flex: '1 1 160px', maxWidth: '200px',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.2s ease, transform 0.2s ease',
                  }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{item.icon}</div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.35rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{item.desc}</div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: '600' }}>{item.label} →</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .cta-btn-primary {
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
          box-shadow: 0 4px 16px rgba(0,168,150,0.4) !important;
        }
        .cta-btn-primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 28px rgba(0,168,150,0.55) !important;
        }
        .cta-btn-ghost {
          transition: background 0.2s ease, border-color 0.2s ease !important;
        }
        .cta-btn-ghost:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(255,255,255,0.5) !important;
        }
        .cta-reassurance {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          margin-top: 0;
          transition: max-height 0.45s ease, opacity 0.35s ease, margin-top 0.35s ease;
        }
        .cta-reassurance.open {
          max-height: 400px;
          opacity: 1;
          margin-top: 2.5rem;
        }
        .cta-card:hover {
          background: rgba(255,255,255,0.13) !important;
          transform: translateY(-3px) !important;
        }
        @media (max-width: 640px) {
          .cta-section { padding: 48px 0 !important; }
          .cta-inner   { padding: 3rem 1.5rem !important; border-radius: 20px !important; }
          .cta-inner h2 { font-size: 2rem !important; }
          .cta-btn-row { flex-direction: column !important; align-items: center !important; }
          .cta-btn-primary, .cta-btn-ghost { width: 100% !important; max-width: 320px !important; }
          .cta-card { max-width: 100% !important; }
        }
      `}</style>
    </section>
  );
};

export default CallToAction;
