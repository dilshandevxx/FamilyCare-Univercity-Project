import React from 'react';
import { Activity, Bell, UserPlus, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="feature-card" style={{
    padding: '2.5rem',
    borderRadius: '24px',
    backgroundColor: color || 'var(--color-white)',
    border: color ? 'none' : '1px solid #edf2f7',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  }}>
    <div className="icon-box" style={{
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      backgroundColor: color ? 'rgba(255,255,255,0.2)' : 'rgba(0,168,150,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: color ? 'white' : 'var(--color-primary)'
    }}>
      <Icon size={24} />
    </div>
    <h3 style={{ fontSize: '1.25rem', color: color ? 'white' : 'var(--color-text-main)' }}>{title}</h3>
    <p style={{ fontSize: '0.95rem', color: color ? 'rgba(255,255,255,0.9)' : 'var(--color-text-muted)' }}>{description}</p>
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
      color: '#FFD29D' // Beige/Orange card from Figma
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
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
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
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </section>
  );
};

export default Features;
