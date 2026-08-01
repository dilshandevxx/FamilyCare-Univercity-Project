import React, { useRef, useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

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

const avatarGradients = [
  'linear-gradient(135deg,#00A896,#00C9B5)',
  'linear-gradient(135deg,#F6AD55,#F06030)',
  'linear-gradient(135deg,#9F7AEA,#6B46C1)',
];

const initials = name => name.split(' ').map(w => w[0]).join('');

const TestimonialCard = ({ quote, name, role, stars, idx, delay }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * 6;
    const ry = ((cx - x) / cx) * 6;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.02)`;
    card.style.boxShadow = '0 24px 48px rgba(0,168,150,0.15)';
    card.style.borderColor = 'rgba(0,168,150,0.3)';
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
      className="testimonial-card tm-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: '2.5rem',
        borderRadius: '24px',
        backgroundColor: '#fff',
        border: '1.5px solid #edf2f7',
        display: 'flex', flexDirection: 'column', gap: '1.2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        transition: 'transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s ease, border-color 0.25s ease',
        cursor: 'default',
        position: 'relative', overflow: 'hidden',
        animationDelay: delay,
        willChange: 'transform',
      }}
    >
      {/* Top accent bar */}
      <div className="testimonial-accent" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: 'linear-gradient(90deg,var(--color-primary),#00d4bf,transparent)',
        opacity: 0, transition: 'opacity 0.3s ease',
      }} />

      {/* Quote icon */}
      <div className="tm-quote-icon" style={{
        position: 'absolute', top: '1.5rem', right: '1.5rem',
        color: 'rgba(0,168,150,0.08)',
        transition: 'color 0.3s ease, transform 0.3s ease',
      }}>
        <Quote size={48} />
      </div>

      {/* Stars */}
      <div className="tm-stars" style={{ display: 'flex', gap: '3px' }}>
        {[...Array(stars)].map((_, i) => (
          <Star
            key={i} size={16} fill="#F6AD55" color="#F6AD55"
            style={{ transition: `transform 0.2s ease ${i * 0.05}s` }}
            className="tm-star"
          />
        ))}
      </div>

      <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--color-text-main)', lineHeight: '1.7', flexGrow: 1, position: 'relative' }}>
        "{quote}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', borderTop: '1px solid #f0f4f8', paddingTop: '1rem' }}>
        <div className="tm-avatar" style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: avatarGradients[idx % avatarGradients.length],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '700', fontSize: '0.9rem', color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)', flexShrink: 0,
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
        }}>
          {initials(name)}
        </div>
        <div>
          <p style={{ fontWeight: '700', fontSize: '0.95rem', margin: 0, color: '#1a202c' }}>{name}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [headRef, headInView] = useInView(0.2);
  const [gridRef, gridInView] = useInView(0.1);

  const reviews = [
    { stars: 5, quote: "FamilyCare has given me peace of mind knowing that my parents are safe and their health is being monitored daily.", name: "Dila Mendis", role: "Software Engineer" },
    { stars: 5, quote: "The interface is so simple to use. I can check my father's BP logs while I'm at work in Dubai without any issues.", name: "Sajid Khan", role: "Logistics Manager" },
    { stars: 5, quote: "Being a caregiver, I find it very easy to log daily activities. The family gets the updates instantly, which is perfect.", name: "Kasun Perera", role: "Professional Caregiver" },
  ];

  return (
    <section id="testimonials" style={{ padding: '100px 0', backgroundColor: '#FBFCFE', position: 'relative', overflow: 'hidden' }}>
      {/* Floating orbs */}
      <div className="tm-orb tm-orb--1" />
      <div className="tm-orb tm-orb--2" />

      <div className="container">
        <div
          ref={headRef}
          className={`tm-reveal ${headInView ? 'tm-reveal--in' : ''}`}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="tm-eyebrow">WHAT FAMILIES SAY</span>
          <h2 className="tm-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Stories from the Sanctuary
          </h2>
          <div className="tm-title-line" />
        </div>

        <div
          ref={gridRef}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
        >
          {reviews.map((r, i) => (
            <div
              key={i}
              className={`tm-card-wrap ${gridInView ? 'tm-card-wrap--in' : ''}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <TestimonialCard {...r} idx={i} delay={`${i * 0.12}s`} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tm-fade-up {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes tm-orb-float {
          0%,100% { transform:translateY(0) scale(1); }
          50%      { transform:translateY(-20px) scale(1.05); }
        }
        @keyframes tm-line-grow {
          from { width:0; }
          to   { width:60px; }
        }

        .tm-eyebrow {
          display:block; font-size:0.75rem; font-weight:700;
          letter-spacing:1.5px; color:#00A896; margin-bottom:0.75rem;
          text-transform:uppercase;
        }
        .tm-title { position:relative; display:block; }
        .tm-title-line {
          width:0; height:4px; margin:0.8rem auto 0;
          background:linear-gradient(90deg,#00A896,#00d4bf);
          border-radius:2px;
          transition:width 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.3s;
        }
        .tm-reveal--in .tm-title-line { width:60px; }

        .tm-reveal {
          opacity:0; transform:translateY(24px);
          transition:opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1);
        }
        .tm-reveal--in { opacity:1; transform:translateY(0); }

        .tm-card-wrap {
          opacity:0; transform:translateY(30px);
          transition:opacity 0.55s ease, transform 0.55s cubic-bezier(0.23,1,0.32,1);
        }
        .tm-card-wrap--in { opacity:1; transform:translateY(0); }

        /* Hover effects */
        .tm-card:hover .testimonial-accent { opacity:1 !important; }
        .tm-card:hover .tm-quote-icon { color:rgba(0,168,150,0.15) !important; transform:scale(1.1) rotate(-5deg) !important; }
        .tm-card:hover .tm-avatar { transform:scale(1.1) !important; box-shadow:0 6px 18px rgba(0,168,150,0.25) !important; }
        .tm-card:hover .tm-star { transform:scale(1.2) !important; }

        /* Background orbs */
        .tm-orb {
          position:absolute; border-radius:50%;
          pointer-events:none; filter:blur(60px);
        }
        .tm-orb--1 {
          width:400px; height:400px;
          background:radial-gradient(circle,rgba(0,168,150,0.07) 0%,transparent 70%);
          top:-100px; left:-100px;
          animation:tm-orb-float 10s ease-in-out infinite;
        }
        .tm-orb--2 {
          width:300px; height:300px;
          background:radial-gradient(circle,rgba(0,168,150,0.05) 0%,transparent 70%);
          bottom:-80px; right:-80px;
          animation:tm-orb-float 13s ease-in-out infinite reverse;
        }

        @media(max-width:640px){
          #testimonials { padding:64px 0 !important; }
          #testimonials h2 { font-size:1.9rem !important; margin-bottom:2rem !important; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
