import React, { useState } from 'react';

const Step = ({ number, title, description, isLast }) => (
  <div style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
    {/* Number + vertical connector */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div className="step-number" style={{
        width: '42px', height: '42px', borderRadius: '50%',
        background: 'var(--color-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '700', fontSize: '0.95rem', color: 'white',
        boxShadow: '0 4px 12px rgba(0,168,150,0.35)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        zIndex: 1,
      }}>
        {number}
      </div>
      {!isLast && (
        <div style={{
          width: '2px', flex: 1, minHeight: '28px',
          background: 'linear-gradient(to bottom, rgba(0,168,150,0.35), rgba(0,168,150,0.08))',
          margin: '6px 0'
        }} />
      )}
    </div>

    <div style={{ paddingBottom: isLast ? '0' : '2rem' }}>
      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', fontWeight: '700', color: '#1a202c' }}>{title}</h4>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '400px', lineHeight: 1.65, marginTop: 0 }}>{description}</p>
    </div>
  </div>
);

const ContactModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Support Request from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:support@familycare.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '460px', position: 'relative',
        boxShadow: '0 25px 60px rgba(0,0,0,0.2)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.2rem', right: '1.2rem',
          background: 'none', border: 'none', fontSize: '1.4rem',
          cursor: 'pointer', color: '#718096', lineHeight: 1
        }}>×</button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Message Sent!</h3>
            <p style={{ color: '#718096', fontSize: '0.95rem' }}>
              Your email client should open shortly. Our team will get back to you within 24 hours.
            </p>
            <button onClick={onClose} className="btn" style={{ marginTop: '1.5rem', background: 'var(--color-primary)', color: 'white', width: '100%' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1a202c' }}>Contact Support</h3>
            <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Our team is available 24/7. We'll respond within 24 hours.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#4a5568' }}>Name</label>
                <input
                  type="text" required placeholder="Your full name"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
                    border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#4a5568' }}>Email</label>
                <input
                  type="email" required placeholder="your@email.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
                    border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#4a5568' }}>Message</label>
                <textarea
                  required placeholder="How can we help you?" rows={4}
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{
                    width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
                    border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none',
                    boxSizing: 'border-box', resize: 'vertical', transition: 'border-color 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <button type="submit" className="btn" style={{
                background: 'var(--color-primary)', color: 'white',
                width: '100%', fontWeight: '600', marginTop: '0.5rem'
              }}>
                Send Message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const ProcessSteps = () => {
  const [showModal, setShowModal] = useState(false);

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
          {/* Decorative circle background */}
          <div style={{
            position: 'absolute', top: '-40px', left: '-40px',
            width: '200px', height: '200px',
            background: 'rgba(0,168,150,0.06)', borderRadius: '50%', zIndex: 1
          }} />
          <div style={{
            background: 'var(--color-primary)',
            padding: '3rem',
            borderRadius: '24px',
            color: 'white',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 25px 50px -10px rgba(0,168,150,0.35)',
            overflow: 'hidden'
          }}>
            {/* Decorative inner circles */}
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '180px', height: '180px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)', pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute', bottom: '-30px', left: '30px',
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
            }} />

            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1, lineHeight: 1.2 }}>The Journey to Peace of Mind</h2>
            <p style={{ marginBottom: '2rem', opacity: 0.9, position: 'relative', zIndex: 1, lineHeight: 1.7 }}>
              Getting started with FamilyCare is simple. We guide you through every step to ensure your parents get the best care.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '1.5rem', borderRadius: '16px', position: 'relative', zIndex: 1, backdropFilter: 'blur(4px)' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Need Help?</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem', opacity: 0.9 }}>Our support team is available 24/7 to assist you.</p>
              <button className="btn" onClick={() => setShowModal(true)} style={{ background: 'white', color: 'var(--color-primary)', width: '100%', fontWeight: '600', transition: 'opacity 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.opacity = '0.9'}
                onMouseLeave={e => e.target.style.opacity = '1'}>
                Contact Support
              </button>
            </div>
          </div>
        </div>

        <div className="process-right">
          {steps.map((s, i) => (
            <Step key={s.number} {...s} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
      <style>{`
        .step-number:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 18px rgba(0,168,150,0.5) !important;
        }
        @media (max-width: 768px) {
          #process { padding: 64px 0 !important; }
          #process .container {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          #process h2 { font-size: 1.9rem !important; }
        }
      `}</style>
    </section>
  );
};

export default ProcessSteps;
