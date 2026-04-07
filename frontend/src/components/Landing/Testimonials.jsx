import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ quote, name, role, stars }) => (
  <div style={{
    padding: '2.5rem',
    borderRadius: '24px',
    backgroundColor: '#fff',
    border: '1px solid #edf2f7',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  }}>
    <div style={{ display: 'flex', gap: '2px' }}>
      {[...Array(stars)].map((_, i) => (
        <Star key={i} size={16} fill="#F6AD55" color="#F6AD55" />
      ))}
    </div>
    <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--color-text-main)', lineHeight: '1.6' }}>
      "{quote}"
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E2E8F0' }} />
      <div>
        <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{name}</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{role}</p>
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
          {reviews.map((r, i) => <TestimonialCard key={i} {...r} />)}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
