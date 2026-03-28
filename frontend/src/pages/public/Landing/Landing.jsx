import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h1>Welcome to FamilyCare</h1>
      <p>Helping you manage the care of your elderly parents from anywhere in the world.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/register" style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px', marginRight: '1rem' }}>Get Started</Link>
        <Link to="/login" style={{ padding: '0.75rem 1.5rem', border: '1px solid #007bff', textDecoration: 'none', borderRadius: '4px' }}>Login</Link>
      </div>
    </div>
  );
};

export default Home;
