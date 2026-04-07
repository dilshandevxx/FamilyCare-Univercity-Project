import React from 'react';

const Step = ({ number, title, description }) => (
  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
    <div style={{ 
      minWidth: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#EDF2F7',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
    }}>
      {number}
    </div>
    <div>
      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{title}</h4>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '400px' }}>{description}</p>
    </div>
  </div>
);

const ProcessSteps = () => {
  const steps = [
    { number: 1, title: "Create account", description: "Set up your child account and verify your identity in minutes." },
    { number: 2, title: "Add parent profile", description: "Create healthy profiles for your parents and upload their medical history." },
    { number: 3, title: "Assign caregiver", description: "Choose from our pool of verified caregivers to provide the best care." },
    { number: 4, title: "Monitor health", description: "Start receiving real-time updates and health logs directly on your phone." }
  ];

  return (
    <section id="process" style={{ padding: '100px 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '6rem', alignItems: 'center' }}>
        <div className="process-left" style={{ position: 'relative' }}>
          <div style={{ 
            background: 'var(--color-primary)', 
            padding: '3rem', 
            borderRadius: '24px', 
            color: 'white',
            position: 'relative',
            zIndex: 2
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>The Journey to Peace of Mind</h2>
            <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
              Getting started with FamilyCare is simple. We guide you through every step to ensure your parents get the best care.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '1.5rem', borderRadius: '16px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Need Help?</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Our support team is available 24/7 to assist you.</p>
              <button className="btn" style={{ background: 'white', color: 'var(--color-primary)', width: '100%' }}>Contact Support</button>
            </div>
          </div>
          {/* Decorative Circle Background */}
          <div style={{ 
            position: 'absolute', top: '-40px', left: '-40px', width: '200px', height: '200px',
            background: '#F0FFF4', borderRadius: '50%', zIndex: 1
          }} />
        </div>

        <div className="process-right">
          {steps.map(s => <Step key={s.number} {...s} />)}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
