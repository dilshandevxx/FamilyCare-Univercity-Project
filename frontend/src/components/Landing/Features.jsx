import React from 'react';
import { Activity, Bell, UserPlus, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="feature-card" style={{
    padding: '2.5rem',
    borderRadius: '24px',
    backgroundColor: color || 'var(--color-white)',
    border: color ? 'none' : '1.5px solid #edf2f7',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Subtle top-right accent blob */}
    {!color && (
      <div style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '100px', height: '100px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,168,150,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
    )}
    <div className="feature-icon-box" style={{
      width: '52px',
      height: '52px',
      borderRadius: '14px',
      backgroundColor: color ? 'rgba(255,255,255,0.22)' : 'rgba(0,168,150,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: color ? 'white' : 'var(--color-primary)',
      transition: 'transform 0.25s ease, background-color 0.25s ease',
      flexShrink: 0,
    }}>
      <Icon size={24} />
    </div>
    <h3 style={{ fontSize: '1.2rem', color: color ? 'white' : 'var(--color-text-main)', fontWeight: '700' }}>{title}</h3>
    <p style={{ fontSize: '0.95rem', color: color ? 'rgba(255,255,255,0.9)' : 'var(--color-text-muted)', lineHeight: 1.65 }}>{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: Activity,
      title: "Real-time health tracking",
      description: "Monitor vitals, activity levels, and daily routines with instant updates from professional caregivers."
    },
    {
      icon: Bell,
      title: "Emergency Alerts",
      description: "Get instant push notifications and alerts for critical health events or emergencies.",
      color: '#FFD29D'
    },
    {
      icon: UserPlus,
      title: "Caregiver Assignment",
      description: "Find and assign verified professional caregivers based on your parents' specific needs."
    },
    {
      icon: Users,
      title: "Multi-parent profiles",
      description: "Manage health and logs for multiple parents through a single unified dashboard."
    }
  ];

  return (
    <section id="features" style={{ padding: '100px 0', backgroundColor: '#FBFCFE' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Designed for Total Visibility</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            A modern suite of tools designed to help children abroad stay connected with their parents' daily lives.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
      <style>{`
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 24px 40px -8px rgba(0,168,150,0.12);
          border-color: rgba(0,168,150,0.3) !important;
        }
        .feature-card:hover .feature-icon-box {
          transform: scale(1.12);
          background-color: rgba(0,168,150,0.18) !important;
        }
        @media (max-width: 640px) {
          #features { padding: 64px 0 !important; }
          #features h2 { font-size: 1.9rem !important; }
          #features .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Features;
