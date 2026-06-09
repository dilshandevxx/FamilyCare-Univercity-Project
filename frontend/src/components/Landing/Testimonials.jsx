import React from 'react';
import { Star } from 'lucide-react';

const avatarGradients = [
  'linear-gradient(135deg,#00A896,#00C9B5)',
  'linear-gradient(135deg,#F6AD55,#F06030)',
  'linear-gradient(135deg,#9F7AEA,#6B46C1)',
];

const initials = name => name.split(' ').map(w => w[0]).join('');

const TestimonialCard = ({ quote, name, role, stars, idx }) => (
  <div className="testimonial-card" style={{
    padding: '2.5rem',
    borderRadius: '24px',
    backgroundColor: '#fff',
    border: '1.5px solid #edf2f7',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Accent top bar */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
      background: 'linear-gradient(90deg, var(--color-primary), transparent)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    }} className="testimonial-accent" />

    <div style={{ display: 'flex', gap: '2px' }}>
      {[...Array(stars)].map((_, i) => (
        <Star key={i} size={16} fill="#F6AD55" color="#F6AD55" />
      ))}
    </div>
    <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--color-text-main)', lineHeight: '1.7', flexGrow: 1 }}>
      "{quote}"
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        background: avatarGradients[idx % avatarGradients.length],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '700', fontSize: '0.9rem', color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        flexShrink: 0,
      }}>
        {initials(name)}
      </div>
      <div>
        <p style={{ fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>{name}</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>{role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const reviews = [
    {
      stars: 5,
      quote: "FamilyCare has given me peace of mind knowing that my parents are safe and their health is being monitored daily.",
      name: "Dila Mendis",
      role: "Software Engineer"
    },
    {
      stars: 5,
      quote: "The interface is so simple to use. I can check my father's BP logs while I'm at work in Dubai without any issues.",
      name: "Sajid Khan",
      role: "Logistics Manager"
    },
    {
      stars: 5,
      quote: "Being a caregiver, I find it very easy to log daily activities. The family gets the updates instantly, which is perfect.",
      name: "Kasun Perera",
      role: "Professional Caregiver"
    }
  ];

  return (
    <section id="testimonials" style={{ padding: '100px 0', backgroundColor: '#FBFCFE' }}>
      <div className="container">
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '4rem' }}>Stories from the Sanctuary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {reviews.map((r, i) => <TestimonialCard key={i} idx={i} {...r} />)}
        </div>
      </div>
      <style>{`
        .testimonial-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -8px rgba(0,168,150,0.14);
          border-color: rgba(0,168,150,0.28) !important;
        }
        .testimonial-card:hover .testimonial-accent {
          opacity: 1 !important;
        }
        @media (max-width: 640px) {
          #testimonials { padding: 64px 0 !important; }
          #testimonials h2 { font-size: 1.9rem !important; margin-bottom: 2rem !important; }
          #testimonials .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
