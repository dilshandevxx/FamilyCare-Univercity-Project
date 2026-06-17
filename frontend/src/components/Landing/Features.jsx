import React, { useRef, useState, useEffect } from 'react';
import { Activity, Bell, UserPlus, Users } from 'lucide-react';

const useInView = (threshold = 0.15) => {
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

const FeatureCard = ({ icon: Icon, title, description, color, index }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * 7;
    const ry = ((cx - x) / cx) * 7;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px) scale(1.02)`;
    card.style.boxShadow = color
      ? '0 28px 50px rgba(0,0,0,0.18)'
      : '0 28px 48px rgba(0,168,150,0.14)';
    card.style.borderColor = color ? 'transparent' : 'rgba(0,168,150,0.35)';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.transform = '';
    card.style.boxShadow = '';
    card.style.borderColor = '';
  };

  return (
    <div
      ref={cardRef}
      className="feature-card lnd-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: '2.5rem',
        borderRadius: '24px',
        backgroundColor: color || 'var(--color-white)',
        border: color ? 'none' : '1.5px solid #edf2f7',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s ease, border-color 0.25s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${index * 0.1}s`,
        willChange: 'transform',
      }}
    >
      {/* Animated bg blob */}
      <div className="lnd-card-blob" style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '130px', height: '130px', borderRadius: '50%',
        background: color
          ? 'rgba(255,255,255,0.1)'
          : 'radial-gradient(circle, rgba(0,168,150,0.08) 0%, transparent 70%)',
        transition: 'transform 0.4s ease',
        pointerEvents: 'none',
      }} />
      {/* Shine sweep */}
      <div className="lnd-card-shine" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
        backgroundSize: '200% 100%',
        pointerEvents: 'none',
      }} />

      <div className="feature-icon-box lnd-icon" style={{
        width: '52px', height: '52px', borderRadius: '14px',
        backgroundColor: color ? 'rgba(255,255,255,0.22)' : 'rgba(0,168,150,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color ? 'white' : 'var(--color-primary)',
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background-color 0.25s ease',
        flexShrink: 0,
      }}>
        <Icon size={24} />
      </div>
      <h3 style={{ fontSize: '1.2rem', color: color ? 'white' : 'var(--color-text-main)', fontWeight: '700', position: 'relative' }}>{title}</h3>
      <p style={{ fontSize: '0.95rem', color: color ? 'rgba(255,255,255,0.9)' : 'var(--color-text-muted)', lineHeight: 1.65, position: 'relative' }}>{description}</p>
    </div>
  );
};

const Features = () => {
  const [headRef, headInView] = useInView(0.2);
  const [gridRef, gridInView] = useInView(0.1);

  const features = [
    { icon: Activity, title: "Real-time health tracking", description: "Monitor vitals, activity levels, and daily routines with instant updates from professional caregivers." },
    { icon: Bell,     title: "Emergency Alerts",         description: "Get instant push notifications and alerts for critical health events or emergencies.", color: '#FFD29D' },
    { icon: UserPlus, title: "Caregiver Assignment",     description: "Find and assign verified professional caregivers based on your parents' specific needs." },
    { icon: Users,    title: "Multi-parent profiles",    description: "Manage health and logs for multiple parents through a single unified dashboard." },
  ];

  return (
    <section id="features" style={{ padding: '100px 0', backgroundColor: '#FBFCFE', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div className="lnd-feat-blob" />

      <div className="container">
        <div
          ref={headRef}
          className={`lnd-reveal ${headInView ? 'lnd-reveal--in' : ''}`}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 className="lnd-section-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Designed for Total Visibility
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            A modern suite of tools designed to help children abroad stay connected with their parents' daily lives.
          </p>
        </div>

        <div
          ref={gridRef}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className={`lnd-card-wrap ${gridInView ? 'lnd-card-wrap--in' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <FeatureCard {...f} index={i} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes lnd-fade-up {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes lnd-blob-drift {
          0%,100% { transform:scale(1) translate(0,0); }
          50%      { transform:scale(1.1) translate(20px,-15px); }
        }
        @keyframes lnd-shine {
          0%   { background-position:200% 0; }
          100% { background-position:-200% 0; }
        }

        .lnd-reveal {
          opacity:0; transform:translateY(24px);
          transition:opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1);
        }
        .lnd-reveal--in { opacity:1; transform:translateY(0); }

        .lnd-card-wrap {
          opacity:0; transform:translateY(30px);
          transition:opacity 0.55s ease, transform 0.55s cubic-bezier(0.23,1,0.32,1);
        }
        .lnd-card-wrap--in { opacity:1; transform:translateY(0); }

        .lnd-feat-blob {
          position:absolute; top:-200px; right:-200px;
          width:600px; height:600px; border-radius:50%;
          background:radial-gradient(circle,rgba(0,168,150,0.05) 0%,transparent 65%);
          pointer-events:none;
          animation:lnd-blob-drift 14s ease-in-out infinite;
        }

        /* Shine sweep on hover */
        .lnd-card:hover .lnd-card-shine {
          animation:lnd-shine 0.7s ease forwards;
        }
        .lnd-card:hover .lnd-card-blob {
          transform:scale(1.4);
        }
        .lnd-card:hover .lnd-icon {
          transform:scale(1.15) rotate(-8deg);
          background-color:rgba(0,168,150,0.18) !important;
        }

        .lnd-section-title {
          position:relative; display:inline-block;
        }
        .lnd-section-title::after {
          content:'';
          position:absolute; bottom:-10px; left:50%;
          transform:translateX(-50%);
          width:0; height:4px;
          background:linear-gradient(90deg,#00A896,#00d4bf);
          border-radius:2px;
          transition:width 0.8s cubic-bezier(0.34,1.56,0.64,1);
        }
        .lnd-reveal--in .lnd-section-title::after { width:60px; }

        @media(max-width:640px){
          #features { padding:64px 0 !important; }
          #features h2 { font-size:1.9rem !important; }
        }
      `}</style>
    </section>
  );
};

export default Features;
