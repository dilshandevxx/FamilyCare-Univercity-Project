import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('child');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Functional logic removed as per project requirements
    console.log('Registration details:', { name, email, password, role });
    navigate('/dashboard');
  };

  return (
    <div className="container" style={{ maxWidth: '450px', margin: '140px auto', padding: '2.5rem', backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #edf2f7' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="John Doe"
            required 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="name@company.com"
            required 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} 
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: '500' }}>I am a...</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: 'white' }}
          >
            <option value="child">Child (Family Member)</option>
            <option value="caregiver">Professional Caregiver</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
      </p>
    </div>
  );
};

export default Register;
