import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const CallToAction = () => {
  const navigate = useNavigate();
  const [showReassurance, setShowReassurance] = useState(false);
  const [sectionRef, inView] = useInView(0.15);

  const reassuranceItems = [
    { icon: '🔍', title: 'Explore features first', desc: 'See everything FamilyCare offers before signing up.', action: () => navigate('/features'), label: 'View Features' },
    { icon: '👥', title: 'Meet our caregivers', desc: 'Browse verified caregivers and understand how we vet them.', action: () => navigate('/caregivers'), label: 'Browse Caregivers' },
    { icon: '📖', title: 'Learn about us', desc: 'Find out who we are and why families trust us.', action: () => navigate('/about'), label: 'About FamilyCare' },
  ];

  return (
    <section
      ref={sectionRef}
      className={`cta-section cta-reveal ${inView ? 'cta-reveal--in' : ''}`}
      style={{ padding: '80px 0' }}
    >
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
          transition: 'padding 0.4s ease, box-shadow 0.4s ease',
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 40px 70px -10px rgba(0,0,0,0.45)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 30px 60px -10px rgba(0,0,0,0.35)'}
        >
          {/* Animated ring decorations */}
          <div className="cta-ring cta-ring--1" />
          <div className="cta-ring cta-ring--2" />
          <div className="cta-ring cta-ring--3" />
          <div className="cta-ring cta-ring--4" />

          {/* Animated teal glow */}
          <div className="cta-glow" />

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="cta-particle" style={{ '--i': i }} />
          ))}

          {/* Moving gradient sweep */}
          <div className="cta-sweep" />

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
                style={{ padding: '15px 40px', position: 'relative', overflow: 'hidden' }}
                onClick={() => navigate('/register')}
              >
                <span className="cta-btn-shine" />
                Get Started
              </button>
              <button
                className="btn cta-btn-ghost"
                style={{
                  background: showReassurance ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: 'white',
                  border: `1.5px solid ${showReassurance ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)'}`,
                  padding: '15px 40px',
                  transition: 'all 0.25s ease',
                }}
                onClick={() => setShowReassurance(prev => !prev)}
              >
                {showReassurance ? 'Never mind ↑' : 'Not yet ready?'}
              </button>
            </div>

            <div className={`cta-reassurance ${showReassurance ? 'open' : ''}`}>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                No pressure — here are some ways to learn more first:
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {reassuranceItems.map((item, i) => (
                  <div key={item.title} className="cta-card" onClick={item.action}
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '16px', padding: '1.25rem 1.5rem',
                      flex: '1 1 160px', maxWidth: '200px',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.25s ease, transform 0.25s ease, border-color 0.25s ease',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    <div className="cta-card-icon" style={{ fontSize: '1.6rem', marginBottom: '0.6rem', transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>{item.icon}</div>
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
        @keyframes cta-ring-pulse {
          0%,100% { transform:scale(1); opacity:0.6; }
          50%      { transform:scale(1.04); opacity:1; }
        }
        @keyframes cta-ring-rotate {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes cta-glow-pulse {
          0%,100% { opacity:0.6; transform:translate(-50%,-50%) scale(1); }
          50%      { opacity:1;   transform:translate(-50%,-50%) scale(1.12); }
        }
        @keyframes cta-particle {
          0%   { transform:translateY(0) scale(1); opacity:0.6; }
          100% { transform:translateY(-100px) scale(0); opacity:0; }
        }
        @keyframes cta-sweep {
          0%   { transform:translateX(-100%) skewX(-15deg); }
          100% { transform:translateX(300%) skewX(-15deg); }
        }
        @keyframes cta-reveal {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes cta-shine {
          0%   { left:-80%; }
          100% { left:120%; }
        }

        .cta-reveal {
          opacity:0; transform:translateY(30px);
          transition:opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1);
        }
        .cta-reveal--in { opacity:1; transform:translateY(0); }

        /* Rings */
        .cta-ring {
          position:absolute; border-radius:50%; pointer-events:none;
        }
        .cta-ring--1 { width:280px; height:280px; top:-60px; left:-60px; border:1.5px solid rgba(0,168,150,0.2); animation:cta-ring-pulse 5s ease-in-out infinite; }
        .cta-ring--2 { width:180px; height:180px; top:-20px; left:-20px; border:1.5px solid rgba(0,168,150,0.12); animation:cta-ring-pulse 6s ease-in-out infinite 1s; }
        .cta-ring--3 { width:340px; height:340px; bottom:-80px; right:-80px; border:1.5px solid rgba(0,168,150,0.18); animation:cta-ring-pulse 7s ease-in-out infinite 0.5s; }
        .cta-ring--4 { width:200px; height:200px; bottom:-30px; right:-30px; border:1.5px solid rgba(0,168,150,0.1); animation:cta-ring-pulse 4s ease-in-out infinite 2s; }

        /* Glow */
        .cta-glow {
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          width:500px; height:200px; border-radius:50%;
          background:radial-gradient(ellipse,rgba(0,168,150,0.14) 0%,transparent 70%);
          pointer-events:none;
          animation:cta-glow-pulse 4s ease-in-out infinite;
        }

        /* Particles */
        .cta-particle {
          position:absolute; width:5px; height:5px; border-radius:50%;
          background:rgba(0,168,150,0.4);
          bottom:20%; left:calc(8% + var(--i,0) * 16%);
          pointer-events:none;
          animation:cta-particle calc(2.5s + var(--i,0) * 0.4s) ease-in-out infinite;
          animation-delay:calc(var(--i,0) * 0.6s);
        }

        /* Sweep */
        .cta-sweep {
          position:absolute; top:0; left:0; width:40%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.03),transparent);
          pointer-events:none; skewX:-15deg;
          animation:cta-sweep 5s ease-in-out infinite 2s;
        }

        /* Buttons */
        .cta-btn-primary {
          transition:transform 0.2s ease, box-shadow 0.2s ease !important;
          box-shadow:0 4px 16px rgba(0,168,150,0.4) !important;
        }
        .cta-btn-primary:hover {
          transform:translateY(-3px) !important;
          box-shadow:0 12px 30px rgba(0,168,150,0.55) !important;
        }
        .cta-btn-primary:active { transform:translateY(-1px) !important; }
        .cta-btn-shine {
          position:absolute; top:0; left:-80%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
          pointer-events:none;
        }
        .cta-btn-primary:hover .cta-btn-shine { animation:cta-shine 0.55s ease forwards; }

        .cta-btn-ghost { transition:background 0.25s ease, border-color 0.25s ease, transform 0.2s ease !important; }
        .cta-btn-ghost:hover {
          background:rgba(255,255,255,0.1) !important;
          border-color:rgba(255,255,255,0.5) !important;
          transform:translateY(-2px) !important;
        }

        /* Reassurance */
        .cta-reassurance {
          max-height:0; overflow:hidden; opacity:0; margin-top:0;
          transition:max-height 0.5s ease, opacity 0.4s ease, margin-top 0.4s ease;
        }
        .cta-reassurance.open { max-height:400px; opacity:1; margin-top:2.5rem; }

        .cta-card:hover {
          background:rgba(255,255,255,0.14) !important;
          transform:translateY(-5px) !important;
          border-color:rgba(0,168,150,0.3) !important;
        }
        .cta-card:hover .cta-card-icon { transform:scale(1.2) rotate(-5deg) !important; }

        @media(max-width:640px){
          .cta-section { padding:48px 0 !important; }
          .cta-inner   { padding:3rem 1.5rem !important; border-radius:20px !important; }
          .cta-inner h2 { font-size:2rem !important; }
          .cta-btn-row  { flex-direction:column !important; align-items:center !important; }
          .cta-btn-primary, .cta-btn-ghost { width:100% !important; max-width:320px !important; }
          .cta-card { max-width:100% !important; }
        }
      `}</style>
    </section>
  );
};

export default CallToAction;
