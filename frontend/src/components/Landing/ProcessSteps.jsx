import React, { useState, useRef, useEffect } from 'react';

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

const Step = ({ number, title, description, isLast, inView, index }) => (
  <div
    className={`ps-step ${inView ? 'ps-step--in' : ''}`}
    style={{
      display: 'flex', gap: '1.5rem', position: 'relative',
      animationDelay: `${index * 0.15}s`,
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div
        className="step-number ps-num"
        style={{
          width: '42px', height: '42px', borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '700', fontSize: '0.95rem', color: 'white',
          boxShadow: '0 4px 12px rgba(0,168,150,0.35)',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
          zIndex: 1, position: 'relative',
        }}
      >
        {number}
      </div>
      {!isLast && (
        <div className={`ps-connector ${inView ? 'ps-connector--in' : ''}`} style={{
          width: '2px', flex: 1, minHeight: '28px', margin: '6px 0',
          background: 'linear-gradient(to bottom,rgba(0,168,150,0.4),rgba(0,168,150,0.08))',
          transformOrigin: 'top',
          animationDelay: `${index * 0.15 + 0.25}s`,
        }} />
      )}
    </div>

    <div style={{ paddingBottom: isLast ? '0' : '2rem' }}>
      <h4 className="ps-step-title" style={{ fontSize: '1.1rem', marginBottom: '0.4rem', fontWeight: '700', color: '#1a202c', transition: 'color 0.2s ease' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '400px', lineHeight: 1.65, marginTop: 0 }}>
        {description}
      </p>
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
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
      animation: 'ps-modal-bg 0.25s ease',
      backdropFilter: 'blur(4px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '460px', position: 'relative',
        boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
        animation: 'ps-modal-in 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.2rem', right: '1.2rem',
          background: 'rgba(0,0,0,0.06)', border: 'none', fontSize: '1rem',
          cursor: 'pointer', color: '#718096', lineHeight: 1,
          width: '30px', height: '30px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s, transform 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.transform = ''; }}
        >✕</button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'ps-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>✓</div>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Message Sent!</h3>
            <p style={{ color: '#718096', fontSize: '0.95rem' }}>Your email client should open shortly. Our team will get back to you within 24 hours.</p>
            <button onClick={onClose} className="btn" style={{ marginTop: '1.5rem', background: 'var(--color-primary)', color: 'white', width: '100%' }}>Close</button>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1a202c' }}>Contact Support</h3>
            <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Our team is available 24/7. We'll respond within 24 hours.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Name', type: 'text', key: 'name', placeholder: 'Your full name' },
                { label: 'Email', type: 'email', key: 'email', placeholder: 'your@email.com' },
              ].map(({ label, type, key, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#4a5568' }}>{label}</label>
                  <input type={type} required placeholder={placeholder}
                    value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,168,150,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#4a5568' }}>Message</label>
                <textarea required placeholder="How can we help you?" rows={4}
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,168,150,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <button type="submit" className="btn ps-submit-btn" style={{ background: 'var(--color-primary)', color: 'white', width: '100%', fontWeight: '600', marginTop: '0.5rem', position: 'relative', overflow: 'hidden' }}>
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
  const [leftRef, leftInView] = useInView(0.2);
  const [rightRef, rightInView] = useInView(0.1);

  const steps = [
    { number: 1, title: "Create account",       description: "Set up your child account and verify your identity in minutes." },
    { number: 2, title: "Add parent profile",   description: "Create healthy profiles for your parents and upload their medical history." },
    { number: 3, title: "Assign caregiver",     description: "Choose from our pool of verified caregivers to provide the best care." },
    { number: 4, title: "Monitor health",       description: "Start receiving real-time updates and health logs directly on your phone." },
  ];

  return (
    <section id="process" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background blob */}
      <div className="ps-bg-blob" />

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '6rem', alignItems: 'center' }}>

        {/* Left panel */}
        <div
          ref={leftRef}
          className={`process-left ps-left-reveal ${leftInView ? 'ps-left-reveal--in' : ''}`}
          style={{ position: 'relative' }}
        >
          <div className="ps-deco-circle" style={{
            position: 'absolute', top: '-40px', left: '-40px',
            width: '200px', height: '200px',
            background: 'rgba(0,168,150,0.06)', borderRadius: '50%', zIndex: 0,
            animation: 'ps-circle-pulse 4s ease-in-out infinite',
          }} />

          <div className="ps-panel" style={{
            background: 'var(--color-primary)',
            padding: '3rem', borderRadius: '24px', color: 'white',
            position: 'relative', zIndex: 1,
            boxShadow: '0 25px 50px -10px rgba(0,168,150,0.35)',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 35px 60px -10px rgba(0,168,150,0.45)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 25px 50px -10px rgba(0,168,150,0.35)'; e.currentTarget.style.transform = ''; }}
          >
            {/* Animated inner circles */}
            <div className="ps-inner-circle ps-inner-circle--1" />
            <div className="ps-inner-circle ps-inner-circle--2" />
            {/* Animated shine */}
            <div className="ps-panel-shine" />

            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1, lineHeight: 1.2 }}>
              The Journey to Peace of Mind
            </h2>
            <p style={{ marginBottom: '2rem', opacity: 0.9, position: 'relative', zIndex: 1, lineHeight: 1.7 }}>
              Getting started with FamilyCare is simple. We guide you through every step to ensure your parents get the best care.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '1.5rem', borderRadius: '16px', position: 'relative', zIndex: 1, backdropFilter: 'blur(4px)', transition: 'background 0.25s ease' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Need Help?</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem', opacity: 0.9 }}>Our support team is available 24/7 to assist you.</p>
              <button className="btn ps-contact-btn" onClick={() => setShowModal(true)}
                style={{ background: 'white', color: 'var(--color-primary)', width: '100%', fontWeight: '600', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <span className="ps-btn-shine" />
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Right steps */}
        <div ref={rightRef} className="process-right">
          {steps.map((s, i) => (
            <Step key={s.number} {...s} isLast={i === steps.length - 1} inView={rightInView} index={i} />
          ))}
        </div>
      </div>

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}

      <style>{`
        @keyframes ps-fade-left {
          from { opacity:0; transform:translateX(-40px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes ps-step-in {
          from { opacity:0; transform:translateX(30px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes ps-connector-grow {
          from { transform:scaleY(0); }
          to   { transform:scaleY(1); }
        }
        @keyframes ps-circle-pulse {
          0%,100% { transform:scale(1); opacity:1; }
          50%      { transform:scale(1.08); opacity:0.7; }
        }
        @keyframes ps-shine-sweep {
          0%   { left:-80%; }
          100% { left:120%; }
        }
        @keyframes ps-modal-bg {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes ps-modal-in {
          from { opacity:0; transform:scale(0.9) translateY(20px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes ps-pop {
          0%   { transform:scale(0); }
          70%  { transform:scale(1.15); }
          100% { transform:scale(1); }
        }
        @keyframes ps-panel-rotate {
          0%,100% { transform:rotate(0deg) scale(1); }
          50%      { transform:rotate(180deg) scale(1.2); }
        }

        /* Left panel reveal */
        .ps-left-reveal {
          opacity:0; transform:translateX(-40px);
          transition:opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1);
        }
        .ps-left-reveal--in { opacity:1; transform:translateX(0); }

        /* Steps reveal */
        .ps-step {
          opacity:0; transform:translateX(30px);
          transition:opacity 0.55s ease, transform 0.55s cubic-bezier(0.23,1,0.32,1);
        }
        .ps-step--in { opacity:1; transform:translateX(0); }

        /* Connector line animate */
        .ps-connector {
          transform:scaleY(0); transform-origin:top;
          transition:transform 0.4s ease;
        }
        .ps-connector--in { transform:scaleY(1); }

        /* Step hover */
        .ps-step:hover .ps-num {
          transform:scale(1.12) !important;
          box-shadow:0 6px 20px rgba(0,168,150,0.5) !important;
        }
        .ps-step:hover .ps-step-title { color:var(--color-primary) !important; }

        /* Panel inner circles */
        .ps-inner-circle {
          position:absolute; border-radius:50%;
          background:rgba(255,255,255,0.07); pointer-events:none;
        }
        .ps-inner-circle--1 { width:180px; height:180px; top:-40px; right:-40px; animation:ps-panel-rotate 20s linear infinite; }
        .ps-inner-circle--2 { width:120px; height:120px; bottom:-30px; left:30px; animation:ps-panel-rotate 15s linear infinite reverse; }

        /* Panel shine sweep */
        .ps-panel-shine {
          position:absolute; top:0; left:-80%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);
          pointer-events:none;
          animation:ps-shine-sweep 3.5s ease-in-out infinite;
        }

        /* Contact button shine */
        .ps-btn-shine {
          position:absolute; top:0; left:-80%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent);
          pointer-events:none;
        }
        .ps-contact-btn:hover .ps-btn-shine { animation:ps-shine-sweep 0.55s ease forwards; }

        /* Submit button */
        .ps-submit-btn { transition:transform 0.2s ease, box-shadow 0.2s ease !important; }
        .ps-submit-btn:hover { transform:translateY(-2px) !important; box-shadow:0 8px 20px rgba(0,168,150,0.35) !important; }

        /* Background blob */
        .ps-bg-blob {
          position:absolute; bottom:-200px; right:-200px;
          width:600px; height:600px; border-radius:50%;
          background:radial-gradient(circle,rgba(0,168,150,0.05) 0%,transparent 65%);
          pointer-events:none; filter:blur(40px);
          animation:ps-circle-pulse 12s ease-in-out infinite;
        }

        @media(max-width:768px){
          #process { padding:64px 0 !important; }
          #process .container { grid-template-columns:1fr !important; gap:2.5rem !important; }
          #process h2 { font-size:1.9rem !important; }
          .ps-left-reveal { transform:translateY(24px) !important; }
          .ps-step { transform:translateY(20px) !important; }
        }
      `}</style>
    </section>
  );
};

export default ProcessSteps;
