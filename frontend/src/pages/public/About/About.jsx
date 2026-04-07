import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/Landing/Footer';

const About = () => (
  <div style={{ paddingTop: '72px' }}>
    <section style={{
      padding: '100px 0 80px',
      background: 'linear-gradient(135deg, #f0fdf9 0%, #e6f7f5 100%)',
      textAlign: 'center'
    }}>
      <div className="container">
        <span style={{
          display: 'inline-block', background: '#e0f2f1', color: '#00796b',
          fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1.2px',
          padding: '5px 12px', borderRadius: '20px', marginBottom: '1.25rem'
        }}>
          OUR STORY
        </span>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: '800', marginBottom: '1.5rem', color: '#1A202C' }}>
          Built with Compassion,<br />
          <span style={{ color: '#00A896' }}>Driven by Technology</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#718096', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
          FamilyCare was born from a simple question — how can children working abroad truly stay connected
          with their elderly parents? We built a platform that bridges distance with care.
        </p>
        <Link to="/register" style={{
          display: 'inline-block', background: '#00A896', color: 'white',
          padding: '0.9rem 2rem', borderRadius: '10px', fontWeight: '600',
          textDecoration: 'none', fontSize: '1rem', transition: 'background 0.2s'
        }}>
          Join FamilyCare
        </Link>
      </div>
    </section>

    <section style={{ padding: '80px 0', background: '#fff' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {[
            { stat: '100k+', label: 'Families Served' },
            { stat: '50+',   label: 'Countries Reached' },
            { stat: '98%',   label: 'Satisfaction Rate' },
            { stat: '24/7',  label: 'Monitoring Active' },
          ].map(({ stat, label }) => (
            <div key={label} style={{ padding: '2rem', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #EDF2F7' }}>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#00A896', marginBottom: '0.5rem' }}>{stat}</div>
              <div style={{ color: '#718096', fontWeight: '500' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
