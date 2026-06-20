import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Caregivers.css';

/* ── Talk to a Specialist modal ─────────────────────────────── */
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
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '480px', position: 'relative',
        boxShadow: '0 25px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto',
      }}>
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
              marginTop: '1.5rem', background: 'var(--color-primary)', color: 'white',
              border: 'none', borderRadius: '12px', padding: '0.8rem 2rem',
              fontWeight: '600', cursor: 'pointer', width: '100%', fontSize: '0.95rem',
            }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.45rem', color: '#1a202c', marginBottom: '0.4rem' }}>Talk to a Specialist</h3>
              <p style={{ color: '#718096', fontSize: '0.88rem' }}>Our Family Concierge team will help you find the perfect caregiver match.</p>
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
                background: 'var(--color-primary)', color: 'white', border: 'none',
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
      </div>
    </div>
  );
};

/* ── How it Works modal ─────────────────────────────────────── */
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
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '580px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.22)', overflow: 'hidden', maxHeight: '90vh',
      }}>
        {/* Header */}
        <div style={{
          background: 'var(--color-primary)', padding: '2rem 2.5rem',
          color: 'white', position: 'relative',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(255,255,255,0.15)',
            border: 'none', borderRadius: '50%', width: '32px', height: '32px',
            fontSize: '1.1rem', cursor: 'pointer', color: 'white', lineHeight: '32px',
          }}>×</button>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>How FamilyCare Works</h3>
          <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>Four simple steps to the right care.</p>
        </div>

        {/* Step tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #edf2f7' }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              flex: 1, padding: '0.85rem 0.5rem', border: 'none', background: 'none',
              cursor: 'pointer', fontSize: '1.4rem',
              borderBottom: active === i ? '3px solid var(--color-primary)' : '3px solid transparent',
              transition: 'border-color 0.2s',
            }} title={s.title}>{s.icon}</button>
          ))}
        </div>

        {/* Step content */}
        <div style={{ padding: '2rem 2.5rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--color-primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '0.9rem', flexShrink: 0,
            }}>{active + 1}</div>
            <h4 style={{ fontSize: '1.15rem', color: '#1a202c', margin: 0 }}>{steps[active].title}</h4>
          </div>
          <p style={{ color: '#4a5568', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.95rem' }}>
            {steps[active].desc}
          </p>
          <div style={{
            background: '#f0faf8', borderLeft: '3px solid var(--color-primary)',
            padding: '0.9rem 1.1rem', borderRadius: '0 10px 10px 0',
            fontSize: '0.85rem', color: '#2d6a63', lineHeight: 1.6,
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
                background: 'var(--color-primary)', color: 'white',
                cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem',
              }}>Next →</button>
            ) : (
              <button onClick={onClose} style={{
                padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none',
                background: 'var(--color-primary)', color: 'white',
                cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem',
              }}>Get Started ✓</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AVATAR_POOL = [32, 44, 5, 11, 26, 68, 47, 57, 33, 16, 21, 43, 65, 23, 53, 36, 12, 51, 70, 3];
const CARD_ACCENTS = ['#0d9488','#0ea5e9','#8b5cf6','#f59e0b','#10b981','#ef4444','#3b82f6','#ec4899'];

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
    rating:       c.rating ? Number(c.rating).toFixed(1) : null,
    reviews:      c.total_reviews || 0,
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
  const [showTalkModal, setShowTalkModal] = useState(false);
  const [showHowModal, setShowHowModal] = useState(false);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/caregivers/public`)
      .then(res => { if (!res.ok) throw new Error('Failed to load caregivers'); return res.json(); })
      .then(data => { setCaregivers(data.map(mapCaregiver)); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const filtered = caregivers.filter(c =>
    !searchQuery ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="caregivers-page">
      {showTalkModal && <TalkModal onClose={() => setShowTalkModal(false)} />}
      {showHowModal  && <HowItWorksModal onClose={() => setShowHowModal(false)} />}
      <div className="container">
        {/* Header Section */}
        <div className="caregivers-header">
          <h1>Find Your <span className="text-teal">Caregiver</span></h1>
          <p className="caregivers-subtitle">
            We believe every family deserves a sanctuary of support. Connect with verified
            specialists who bring expertise, empathy, and warmth to your home.
          </p>
        </div>

        {/* Filter Section Desktop */}
        <div className="filters-container desktop-filters">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search by name, specialty, or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="dropdowns-group">
            <select className="filter-select">
              <option>Rating: Any</option>
              <option>4.5 &amp; up</option>
              <option>4.0 &amp; up</option>
            </select>
            <select className="filter-select">
              <option>Experience</option>
              <option>5+ Years</option>
              <option>10+ Years</option>
            </select>
            <select className="filter-select">
              <option>Price Range</option>
              <option>Under $30/hr</option>
              <option>$30 - $50/hr</option>
              <option>$50+/hr</option>
            </select>
            <button className="btn btn-primary update-btn">Update Results</button>
          </div>
        </div>

        {/* Filter Section Mobile */}
        <div className="filters-container mobile-filters">
           <div className="mobile-search-row">
             <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Search by name or specialty..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-icon-filter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </button>
           </div>
           <div className="mobile-pills">
             <button className="pill active">Top Rated</button>
             <button className="pill">Near Me</button>
             <button className="pill">Registered Nurse</button>
           </div>
        </div>

        {/* Caregiver Grid */}
        <div className="caregivers-grid">
          {loading && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#718096', padding: '2rem' }}>
              Loading caregivers…
            </p>
          )}
          {error && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#e53e3e', padding: '2rem' }}>
              {error}
            </p>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#718096', padding: '2rem' }}>
              No caregivers found.
            </p>
          )}
          {filtered.map((cg) => (
            <div className="caregiver-card cg-card-v2" key={cg.id}>

              {/* Accent header strip */}
              <div className="cg-accent-strip" style={{ background: cg.accent }} />

              {/* Top row: avatar + price/rating */}
              <div className="cg-top-row">
                <div className="cg-avatar-wrap">
                  <img src={cg.image} alt={cg.name} className="cg-avatar" onError={e => { e.target.src = `https://i.pravatar.cc/300?img=${cg.id + 10}`; }} />
                  <span className="cg-verified-dot" title="Verified">
                    <svg viewBox="0 0 24 24" fill="white" width="10" height="10"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  </span>
                </div>

                <div className="cg-price-block">
                  {cg.price
                    ? <><span className="cg-price">{cg.price}</span><span className="cg-unit"> /hr</span></>
                    : <span className="cg-price-na">Contact</span>
                  }
                  {cg.rating ? (
                    <div className="cg-rating-row">
                      <StarRating value={Number(cg.rating)} />
                      <span className="cg-rating-num">{cg.rating}</span>
                      {cg.reviews > 0 && <span className="cg-reviews">({cg.reviews})</span>}
                    </div>
                  ) : (
                    <span className="cg-new-badge">New</span>
                  )}
                </div>
              </div>

              {/* Name + title */}
              <div className="cg-body">
                <div className="cg-name-row">
                  <h3 className="cg-name">{cg.name}</h3>
                  <span className="cg-verified-pill">✓ Verified</span>
                </div>
                <p className="cg-specialty" style={{ color: cg.accent }}>{cg.title}</p>

                {/* Info grid */}
                <div className="cg-info-grid">
                  <div className="cg-info-item">
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

                {/* Tags */}
                {cg.tags.length > 0 && (
                  <div className="cg-tags">
                    {cg.tags.map((t, i) => (
                      <span className="cg-tag" key={i}>{t.icon} {t.label}</span>
                    ))}
                  </div>
                )}

                {/* Bio */}
                {cg.bio && (
                  <p className="cg-bio">
                    &ldquo;{cg.bio.length > 130 ? cg.bio.slice(0, 130) + '…' : cg.bio}&rdquo;
                  </p>
                )}

                {/* CTA */}
                <button className="cg-btn-profile" style={{ '--accent': cg.accent }} onClick={() => navigate(`/caregivers/${cg.id}`)}>
                  View Full Profile
                </button>
              </div>
            </div>
          ))}

          {/* Promotional Banner */}
          <div className="promo-banner">
            <div className="promo-content">
              <h2>Need help choosing the right fit?</h2>
              <p>Our Family Concierge team can help you navigate profiles, conduct interviews, and find the perfect specialist for your unique needs.</p>
              <div className="promo-buttons">
                <button className="btn btn-primary btn-talk" onClick={() => setShowTalkModal(true)}>Talk to a Specialist</button>
                <button className="btn btn-outline-white" onClick={() => setShowHowModal(true)}>How it Works</button>
              </div>
            </div>
            <div className="promo-graphic">
               <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="background-hands">
                  <path d="M20.5 9.5L12 18l-8.5-8.5a5.5 5.5 0 0 1 7.78-7.78L12 2.83l.72-.71a5.5 5.5 0 0 1 7.78 7.78z"></path>
               </svg>
            </div>
          </div>
        </div>

       

      </div>
    </div>
  );
};

export default Caregivers;
