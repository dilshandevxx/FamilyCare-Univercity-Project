import React from 'react';

const CallToAction = () => {
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="container">
        <div style={{
          background: 'radial-gradient(circle at center, #1A202C 0%, #000 100%)',
          padding: '5rem 2rem',
          borderRadius: '32px',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
            Start caring for your loved ones today.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Join our community of over 100k users. Take control of your family's health with our easy-to-use platform.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" style={{ padding: '15px 40px' }}>Get Started</button>
            <button className="btn" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '15px 40px' }}>Not yet ready?</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
