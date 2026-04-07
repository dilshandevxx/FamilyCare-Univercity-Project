import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero" style={{ paddingTop: '160px', paddingBottom: '100px', backgroundColor: '#fff' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div className="hero-content">
          <span className="badge" style={{ color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
            Powered by Compassion
          </span>
          <h1 style={{ fontSize: '4.5rem', marginTop: '1rem', marginBottom: '1.5rem', color: '#1A202C' }}>
            Stay connected with your loved ones, <span className="text-teal">anytime, anywhere.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '540px', marginBottom: '2.5rem' }}>
            FamilyCare is a web-based platform designed for children working abroad to monitor and manage the health and daily activities of their elderly parents back home.
          </p>
          
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Get Started <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary">
              Tell me more
            </button>
          </div>

          <div className="social-proof" style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="avatars" style={{ display: 'flex', marginLeft: '0.5rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', 
                  border: '2px solid white', marginLeft: i === 1 ? '0' : '-12px' 
                }} />
              ))}
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Trusted by 100k+ global users
            </span>
          </div>
        </div>

        <div className="hero-visual" style={{ position: 'relative' }}>
          <div className="image-wrapper" style={{ 
            borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' 
          }}>
            <img src="/hero-couple.png" alt="Elderly Couple" style={{ width: '100%', display: 'block' }} />
          </div>
          
          {/* Floating Health Card Placeholder */}
          <div className="floating-card" style={{
            position: 'absolute', top: '20%', right: '-30px', 
            background: 'white', padding: '1rem', borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            width: '180px', display: 'flex', flexDirection: 'column', gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#FFEDD5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ❤️
              </div>
              <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Health Status</span>
            </div>
            <div style={{ height: '40px', background: '#F8FAFC', borderRadius: '6px' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Last update: 5m ago</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
