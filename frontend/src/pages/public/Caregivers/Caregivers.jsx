import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../../components/Landing/Footer';
import './Caregivers.css';

/* ── Talk to a Specialist modal ── */
const TalkModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', time: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Specialist Request from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nPreferred Time: ${form.time}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:support@familycare.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
    border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s',
  };
  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.4rem', color: '#4a5568' };
  const focus = e => e.target.style.borderColor = 'var(--color-primary)';
  const blur  = e => e.target.style.borderColor = '#e2e8f0';

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()} 
        style={{
          background: 'white', borderRadius: '24px', padding: '2.5rem',
          width: '100%', maxWidth: '480px', position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto',
          border: '1px solid #e2e8f0'
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none',
          border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#718096',
        }}>×</button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Request Sent!</h3>
            <p style={{ color: '#718096', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Your email client should open shortly. A Family Concierge specialist will reach out within 24 hours.
            </p>
            <button onClick={onClose} style={{
              marginTop: '1.5rem', background: '#10b981', color: 'white',
              border: 'none', borderRadius: '12px', padding: '0.8rem 2rem',
              fontWeight: '600', cursor: 'pointer', width: '100%', fontSize: '0.95rem',
            }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.45rem', color: '#0f172a', marginBottom: '0.4rem', fontWeight: 800 }}>Talk to a Specialist</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Our Family Concierge team will help you find the perfect caregiver match.</p>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" required placeholder="Jane Smith" style={inputStyle}
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={labelStyle}>Phone (optional)</label>
                  <input type="tel" placeholder="+1 234 567 8900" style={inputStyle}
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    onFocus={focus} onBlur={blur} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" required placeholder="your@email.com" style={inputStyle}
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>Preferred Contact Time</label>
                <select style={{ ...inputStyle, background: 'white', cursor: 'pointer' }}
                  value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                  onFocus={focus} onBlur={blur}>
                  <option value="">Select a time window…</option>
                  <option>Morning (8am – 12pm)</option>
                  <option>Afternoon (12pm – 5pm)</option>
                  <option>Evening (5pm – 8pm)</option>
                  <option>Any time</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tell us about your needs</label>
                <textarea required rows={3} placeholder="E.g. looking for a nurse for my mother, 3 days a week…"
                  style={{ ...inputStyle, resize: 'vertical' }}
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={focus} onBlur={blur} />
              </div>
              <button type="submit" style={{
                background: '#10b981', color: 'white', border: 'none',
                borderRadius: '12px', padding: '0.85rem', fontWeight: '700',
                cursor: 'pointer', fontSize: '0.95rem', marginTop: '0.25rem',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                Send Request
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

/* ── How it Works modal ── */
const HowItWorksModal = ({ onClose }) => {
  const [active, setActive] = useState(0);
  const steps = [
    {
      icon: '🔍',
      title: 'Browse & Filter',
      desc: 'Explore our pool of verified, background-checked caregivers. Use filters like specialty, experience, price, and rating to narrow down the best candidates for your loved one.',
      detail: 'Every caregiver on FamilyCare is identity-verified, reference-checked, and holds valid certifications for their listed specialties.',
    },
    {
      icon: '📋',
      title: 'Review Profiles',
      desc: 'Read detailed profiles including qualifications, patient reviews, specialties, and personal care philosophy — so you know exactly who you\'re trusting with your family.',
      detail: 'Profiles include video introductions, verified credentials, response time, and availability calendars.',
    },
    {
      icon: '🤝',
      title: 'Schedule a Match Call',
      desc: 'Not sure who to choose? Our Family Concierge team will schedule a free consultation to understand your needs and personally recommend the best matches.',
      detail: 'Consultations are free, no-commitment, and typically last 20–30 minutes.',
    },
    {
      icon: '💚',
      title: 'Start Care',
      desc: 'Once you\'ve chosen, we handle the contracts, scheduling, and ongoing check-ins. Your dedicated care manager monitors health logs and keeps you updated in real time.',
      detail: 'Cancel or reschedule anytime. Our platform tracks health logs, visit history, and sends alerts directly to your phone.',
    },
  ];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()} 
        style={{
          background: 'white', borderRadius: '24px', width: '100%', maxWidth: '580px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.1)', overflow: 'hidden', maxHeight: '90vh',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Header */}
        <div style={{
          background: '#f8fafc', padding: '2rem 2.5rem',
          color: '#0f172a', position: 'relative', borderBottom: '1px solid #e2e8f0'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: '1.2rem', right: '1.2rem', background: '#e2e8f0',
            border: 'none', borderRadius: '50%', width: '32px', height: '32px',
            fontSize: '1.1rem', cursor: 'pointer', color: '#64748b', lineHeight: '32px',
          }}>×</button>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.4rem', fontWeight: 800 }}>How FamilyCare Works</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Four simple steps to the right care.</p>
        </div>

        {/* Step tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #edf2f7' }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              flex: 1, padding: '0.85rem 0.5rem', border: 'none', background: 'none',
              cursor: 'pointer', fontSize: '1.4rem',
              borderBottom: active === i ? '3px solid #10b981' : '3px solid transparent',
              transition: 'border-color 0.2s',
            }} title={s.title}>{s.icon}</button>
          ))}
        </div>

        {/* Step content */}
        <div style={{ padding: '2rem 2.5rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(16,185,129,0.1)', color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '0.9rem', flexShrink: 0,
            }}>{active + 1}</div>
            <h4 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>{steps[active].title}</h4>
          </div>
          <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.95rem' }}>
            {steps[active].desc}
          </p>
          <div style={{
            background: 'rgba(16,185,129,0.05)', borderLeft: '3px solid #10b981',
            padding: '0.9rem 1.1rem', borderRadius: '0 10px 10px 0',
            fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.6,
          }}>
            {steps[active].detail}
          </div>

          {/* Step navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', alignItems: 'center' }}>
            <button onClick={() => setActive(p => Math.max(0, p - 1))} disabled={active === 0}
              style={{
                padding: '0.6rem 1.2rem', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                background: 'none', cursor: active === 0 ? 'not-allowed' : 'pointer',
                color: active === 0 ? '#cbd5e0' : '#4a5568', fontWeight: '600', fontSize: '0.88rem',
              }}>← Previous</button>
            <span style={{ color: '#a0aec0', fontSize: '0.82rem' }}>Step {active + 1} of {steps.length}</span>
            {active < steps.length - 1 ? (
              <button onClick={() => setActive(p => p + 1)} style={{
                padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none',
                background: '#10b981', color: 'white',
                cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem',
              }}>Next →</button>
            ) : (
              <button onClick={onClose} style={{
                padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none',
                background: '#10b981', color: 'white',
                cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem',
              }}>Get Started ✓</button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AVATAR_POOL = [32, 44, 5, 11, 26, 68, 47, 57, 33, 16, 21, 43, 65, 23, 53, 36, 12, 51, 70, 3];
const CARD_ACCENTS = ['#10b981','#0ea5e9','#8b5cf6','#f59e0b','#10b981','#ef4444','#3b82f6','#ec4899'];

function mapCaregiver(c) {
  const tags = [];
  if (c.experience_years) tags.push({ label: `${c.experience_years} Exp.`, icon: '🗓' });
  if (c.certification)    tags.push({ label: c.certification, icon: '🏅' });
  if (c.license_id)       tags.push({ label: `Lic. ${c.license_id}`, icon: '📋' });
  if (c.languages)        tags.push({ label: c.languages, icon: '🌐' });

  const imgIdx = AVATAR_POOL[(c.id - 1) % AVATAR_POOL.length];
  return {
    id:           c.id,
    name:         c.name,
    title:        c.specialization ? c.specialization.toUpperCase() : 'CAREGIVER',
    price:        c.hourly_rate ? `$${Number(c.hourly_rate).toFixed(0)}` : null,
    hourlyRate:   c.hourly_rate != null ? Number(c.hourly_rate) : null,
    rating:       c.rating ? Number(c.rating).toFixed(1) : null,
    reviews:      c.total_reviews || 0,
    experienceYears: c.experience_years ? parseInt(c.experience_years, 10) : null,
    tags,
    bio:          c.bio || '',
    image:        c.avatar_url || `https://i.pravatar.cc/300?img=${imgIdx}`,
    available:    c.is_available,
    location:     c.location || 'In-home & Facility',
    accent:       CARD_ACCENTS[(c.id - 1) % CARD_ACCENTS.length],
  };
}

function StarRating({ value }) {
  const full  = Math.floor(value);
  const half  = value - full >= 0.5;
  return (
    <span className="cg-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= full ? '#f59e0b' : (i === full + 1 && half ? '#f59e0b' : '#e2e8f0') }}>
          {i <= full ? '★' : (i === full + 1 && half ? '⯨' : '★')}
        </span>
      ))}
    </span>
  );
}

const Caregivers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState('Rating: Any');
  const [experienceFilter, setExperienceFilter] = useState('Experience');
  const [priceFilter, setPriceFilter] = useState('Price Range');
  const [showTalkModal, setShowTalkModal] = useState(false);
  const [showHowModal, setShowHowModal] = useState(false);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/caregivers/public`)
      .then(res => { if (!res.ok) throw new Error('Failed to load caregivers'); return res.json(); })
      .then(data => {
        if (data && data.length > 0) {
          setCaregivers(data.map(mapCaregiver));
        } else {
          // Mock data fallback if DB is empty
          const mockData = [
            {
              id: 'mock-1',
              name: 'Elena Rodriguez',
              specialization: 'Dementia Care, Palliative Care, CNA Certified',
              hourly_rate: 32.00,
              rating: 4.9,
              total_reviews: 128,
              bio: 'Specialized in elderly dementia support with 8 years of certified nursing assistance experience.',
              avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
              is_available: 1,
              location: 'In-home & Facility'
            },
            {
              id: 'mock-2',
              name: 'Marcus Thorne',
              specialization: 'Mobility Support, Physical Therapy, Rehab',
              hourly_rate: 45.00,
              rating: 4.8,
              total_reviews: 94,
              bio: 'PT assistant focusing on senior mobility enhancement and post-injury rehabilitation.',
              avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
              is_available: 1,
              location: 'In-home Care'
            },
            {
              id: 'mock-3',
              name: 'Sarah Jenkins',
              specialization: 'Meal Prep, Medication Mgmt, Companion Care',
              hourly_rate: 28.00,
              rating: 5.0,
              total_reviews: 215,
              bio: 'Compassionate caregiver specializing in daily nutrition logs, scheduling, and medication tracking.',
              avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
              is_available: 1,
              location: 'Facility'
            }
          ];
          setCaregivers(mockData.map(mapCaregiver));
        }
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const filtered = caregivers.filter(c => {
    if (searchQuery &&
        !c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (ratingFilter === '4.5 & up' && !(c.rating && Number(c.rating) >= 4.5)) return false;
    if (ratingFilter === '4.0 & up' && !(c.rating && Number(c.rating) >= 4.0)) return false;
    if (experienceFilter === '5+ Years'  && !(c.experienceYears >= 5))  return false;
    if (experienceFilter === '10+ Years' && !(c.experienceYears >= 10)) return false;
    if (priceFilter === 'Under $30/hr' && !(c.hourlyRate != null && c.hourlyRate < 30)) return false;
    if (priceFilter === '$30 - $50/hr' && !(c.hourlyRate != null && c.hourlyRate >= 30 && c.hourlyRate <= 50)) return false;
    if (priceFilter === '$50+/hr'      && !(c.hourlyRate != null && c.hourlyRate > 50)) return false;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="caregivers-page" style={{ background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AnimatePresence>
        {showTalkModal && <TalkModal onClose={() => setShowTalkModal(false)} />}
        {showHowModal  && <HowItWorksModal onClose={() => setShowHowModal(false)} />}
      </AnimatePresence>
      
      <div className="container" style={{ flex: 1, paddingBottom: '80px' }}>
        {/* Header Section */}
        <motion.div 
          className="caregivers-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ color: '#0f172a', fontWeight: 800 }}>Find Your <span style={{ color: '#10b981' }}>Caregiver</span></h1>
          <p className="caregivers-subtitle" style={{ color: '#64748b' }}>
            We believe every family deserves a sanctuary of support. Connect with verified
            specialists who bring expertise, empathy, and warmth to your home.
          </p>
        </motion.div>

        {/* Filter Section Desktop */}
        <motion.div 
          className="filters-container desktop-filters glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
        >
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search by name, specialty, or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'white' }}
            />
          </div>
          <div className="dropdowns-group">
            <select className="filter-select" value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
              <option>Rating: Any</option>
              <option>4.5 &amp; up</option>
              <option>4.0 &amp; up</option>
            </select>
            <select className="filter-select" value={experienceFilter} onChange={e => setExperienceFilter(e.target.value)}>
              <option>Experience</option>
              <option>5+ Years</option>
              <option>10+ Years</option>
            </select>
            <select className="filter-select" value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
              <option>Price Range</option>
              <option>Under $30/hr</option>
              <option>$30 - $50/hr</option>
              <option>$50+/hr</option>
            </select>
            <button className="btn btn-primary update-btn" style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600 }}>Update Results</button>
          </div>
        </motion.div>

        {/* Caregiver Grid */}
        <motion.div 
          className="caregivers-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#718096', padding: '2rem' }}>
              Loading caregivers…
            </p>
          )}
          {error && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#ef4444', padding: '2rem' }}>
              {error}
            </p>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b', padding: '2rem' }}>
              No caregivers found.
            </p>
          )}
          
          <AnimatePresence>
            {filtered.map((cg) => (
              <motion.div 
                layout
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.9 }}
                className="caregiver-card cg-card-v2 glass-panel" 
                key={cg.id}
                style={{ background: 'white', border: '1px solid #e2e8f0', overflow: 'hidden' }}
                whileHover={{ y: -5 }}
              >
                <div className="cg-accent-strip" style={{ background: cg.accent, height: '4px' }} />
                
                <div className="cg-top-row">
                  <div className="cg-avatar-wrap">
                    <img src={cg.image} alt={cg.name} className="cg-avatar" onError={e => { e.target.src = `https://i.pravatar.cc/300?img=${cg.id + 10}`; }} />
                    <span className="cg-verified-dot" title="Verified" style={{ background: '#10b981' }}>
                      <svg viewBox="0 0 24 24" fill="white" width="10" height="10"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </span>
                  </div>

                  <div className="cg-price-block">
                    {cg.price
                      ? <><span className="cg-price" style={{ color: '#0f172a' }}>{cg.price}</span><span className="cg-unit" style={{ color: '#64748b' }}> /hr</span></>
                      : <span className="cg-price-na">Contact</span>
                    }
                    {cg.rating ? (
                      <div className="cg-rating-row">
                        <StarRating value={Number(cg.rating)} />
                        <span className="cg-rating-num" style={{ color: '#0f172a' }}>{cg.rating}</span>
                        {cg.reviews > 0 && <span className="cg-reviews" style={{ color: '#64748b' }}>({cg.reviews})</span>}
                      </div>
                    ) : (
                      <span className="cg-new-badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>New</span>
                    )}
                  </div>
                </div>

                <div className="cg-body">
                  <div className="cg-name-row">
                    <h3 className="cg-name" style={{ color: '#0f172a' }}>{cg.name}</h3>
                    <span className="cg-verified-pill" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>✓ Verified</span>
                  </div>
                  <p className="cg-specialty" style={{ color: cg.accent }}>{cg.title}</p>

                  <div className="cg-info-grid">
                    <div className="cg-info-item" style={{ color: '#64748b' }}>
                      <span className="cg-info-icon">📍</span>
                      <span>{cg.location}</span>
                    </div>
                    {cg.available !== undefined && (
                      <div className="cg-info-item">
                        <span className="cg-info-icon">{cg.available ? '✅' : '🕐'}</span>
                        <span style={{ color: cg.available ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                          {cg.available ? 'Available Now' : 'On Request'}
                        </span>
                      </div>
                    )}
                  </div>

                  {cg.tags.length > 0 && (
                    <div className="cg-tags">
                      {cg.tags.map((t, i) => (
                        <span className="cg-tag" key={i} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>{t.icon} {t.label}</span>
                      ))}
                    </div>
                  )}

                  {cg.bio && (
                    <p className="cg-bio" style={{ color: '#64748b' }}>
                      &ldquo;{cg.bio.length > 130 ? cg.bio.slice(0, 130) + '…' : cg.bio}&rdquo;
                    </p>
                  )}

                  <button 
                    className="cg-btn-profile" 
                    style={{ background: 'transparent', color: cg.accent, border: `1px solid ${cg.accent}`, borderRadius: '8px', padding: '10px', width: '100%', fontWeight: 600, marginTop: 'auto', cursor: 'pointer', transition: 'background 0.2s' }} 
                    onMouseEnter={(e) => { e.currentTarget.style.background = cg.accent; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = cg.accent; }}
                    onClick={() => navigate(`/caregivers/${cg.id}`)}
                  >
                    View Full Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Promotional Banner */}
          <motion.div 
            className="promo-banner glass-panel"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ background: '#10b981', color: 'white', border: 'none', gridColumn: '1 / -1', borderRadius: '24px', padding: '40px' }}
          >
            <div className="promo-content">
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: '2rem' }}>Need help choosing the right fit?</h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>Our Family Concierge team can help you navigate profiles, conduct interviews, and find the perfect specialist for your unique needs.</p>
              <div className="promo-buttons" style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button className="btn btn-primary btn-talk" style={{ background: 'white', color: '#10b981', border: 'none', padding: '14px 24px', borderRadius: '12px', fontWeight: 700 }} onClick={() => setShowTalkModal(true)}>Talk to a Specialist</button>
                <button className="btn btn-outline-white" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '14px 24px', borderRadius: '12px', fontWeight: 700 }} onClick={() => setShowHowModal(true)}>How it Works</button>
              </div>
            </div>
            <div className="promo-graphic">
               <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="background-hands" style={{ width: '200px', height: '200px' }}>
                  <path d="M20.5 9.5L12 18l-8.5-8.5a5.5 5.5 0 0 1 7.78-7.78L12 2.83l.72-.71a5.5 5.5 0 0 1 7.78 7.78z"></path>
               </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Caregivers;
