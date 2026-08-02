import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, Check, X, Star, Calendar, Shield, Award, Clock } from 'lucide-react';
import Footer from '../../../components/Landing/Footer';
import './Caregivers.css';

/* ─── Talk to a Specialist Modal ─── */
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

  return (
    <div className="cg-modal-overlay" onClick={onClose}>
      <div className="cg-modal-content" onClick={e => e.stopPropagation()}>
        <button className="cg-modal-close" onClick={onClose}><X size={20} /></button>
        {sent ? (
          <div className="cg-modal-success">
            <div className="cg-modal-success-icon">🎉</div>
            <h3>Request Sent!</h3>
            <p>Your email client should open shortly. A Family Concierge specialist will reach out within 24 hours.</p>
            <button onClick={onClose} className="cg-btn cg-btn-primary w-full mt-4">Done</button>
          </div>
        ) : (
          <div className="cg-modal-form-wrap">
            <h3 className="cg-modal-title">Talk to a Specialist</h3>
            <p className="cg-modal-desc">Our Family Concierge team will help you find the perfect caregiver match.</p>
            <form onSubmit={handleSubmit} className="cg-form">
              <div className="cg-form-row">
                <div className="cg-form-group">
                  <label>Full Name</label>
                  <input type="text" required placeholder="Jane Smith" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="cg-form-group">
                  <label>Phone (optional)</label>
                  <input type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
              </div>
              <div className="cg-form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="cg-form-group">
                <label>Preferred Contact Time</label>
                <div className="cg-select-wrapper">
                  <select value={form.time} onChange={e => setForm({...form, time: e.target.value})}>
                    <option value="">Select a time window…</option>
                    <option>Morning (8am – 12pm)</option>
                    <option>Afternoon (12pm – 5pm)</option>
                    <option>Evening (5pm – 8pm)</option>
                    <option>Any time</option>
                  </select>
                  <ChevronDown className="cg-select-icon" size={16} />
                </div>
              </div>
              <div className="cg-form-group">
                <label>Tell us about your needs</label>
                <textarea required rows={3} placeholder="E.g. looking for a nurse for my mother, 3 days a week…" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </div>
              <button type="submit" className="cg-btn cg-btn-primary w-full mt-2">Send Request</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── How it Works Modal ─── */
const HowItWorksModal = ({ onClose }) => {
  const [active, setActive] = useState(0);
  const steps = [
    { icon: <Search size={24}/>, title: 'Browse & Filter', desc: 'Explore our pool of verified, background-checked caregivers. Use filters like specialty, experience, price, and rating to narrow down the best candidates.' },
    { icon: <Shield size={24}/>, title: 'Review Profiles', desc: 'Read detailed profiles including qualifications, patient reviews, specialties, and personal care philosophy — so you know exactly who you\'re trusting.' },
    { icon: <Calendar size={24}/>, title: 'Schedule a Match', desc: 'Not sure who to choose? Our Family Concierge team will schedule a free consultation to understand your needs and personally recommend the best matches.' },
    { icon: <Check size={24}/>, title: 'Start Care', desc: 'Once you\'ve chosen, we handle the contracts, scheduling, and ongoing check-ins. Your dedicated care manager monitors health logs in real time.' },
  ];

  return (
    <div className="cg-modal-overlay" onClick={onClose}>
      <div className="cg-modal-content cg-modal-content--large" onClick={e => e.stopPropagation()}>
        <button className="cg-modal-close" onClick={onClose}><X size={20} /></button>
        <div className="cg-how-header">
          <h3>How FamilyCare Works</h3>
          <p>Four simple steps to finding the perfect care.</p>
        </div>
        
        <div className="cg-how-tabs">
          {steps.map((s, i) => (
            <button key={i} className={`cg-how-tab ${active === i ? 'active' : ''}`} onClick={() => setActive(i)}>
              <div className="cg-how-tab-icon">{s.icon}</div>
              <span>Step {i + 1}</span>
            </button>
          ))}
        </div>

        <div className="cg-how-body">
          <h4>{steps[active].title}</h4>
          <p>{steps[active].desc}</p>
          <div className="cg-how-nav">
            <button onClick={() => setActive(p => Math.max(0, p - 1))} disabled={active === 0} className="cg-btn cg-btn-outline">Previous</button>
            {active < steps.length - 1 ? (
              <button onClick={() => setActive(p => p + 1)} className="cg-btn cg-btn-primary">Next Step</button>
            ) : (
              <button onClick={onClose} className="cg-btn cg-btn-primary">Get Started</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── API & Data Mapping ─── */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AVATAR_POOL = [32, 44, 5, 11, 26, 68, 47, 57, 33, 16, 21, 43, 65, 23, 53, 36, 12, 51, 70, 3];

function mapCaregiver(c) {
  const tags = [];
  const rawExp = c.experience_years ? String(c.experience_years).trim() : '';
  const numExp = parseInt(rawExp, 10);
  const expYears = !isNaN(numExp) ? numExp : 1;

  if (rawExp) {
    if (/year/i.test(rawExp)) {
      tags.push({ label: rawExp });
    } else {
      tags.push({ label: `${rawExp} Years Exp.` });
    }
  }
  if (c.certification) tags.push({ label: c.certification });
  if (c.languages)     tags.push({ label: c.languages });

  const imgIdx = AVATAR_POOL[((c.id || 1) - 1) % AVATAR_POOL.length] || 1;
  const rateVal = c.hourly_rate != null ? Number(c.hourly_rate) : null;
  const priceDisplay = (rateVal && rateVal > 0) ? `$${rateVal.toFixed(0)}` : '$25';

  const avatarUrl = c.avatar_url 
    ? (c.avatar_url.startsWith('http') ? c.avatar_url : `http://localhost:5000${c.avatar_url}`)
    : `https://i.pravatar.cc/300?img=${imgIdx}`;

  return {
    id:              c.id,
    name:            c.name || 'Caregiver',
    title:           c.specialization ? c.specialization : 'Elder & Health Caregiver',
    price:           priceDisplay,
    hourlyRate:      (rateVal && rateVal > 0) ? rateVal : 25,
    rating:          c.rating ? Number(c.rating).toFixed(1) : '4.9',
    reviews:         c.total_reviews || 18,
    experienceYears: expYears,
    tags,
    bio:             c.bio || 'Compassionate and certified caregiver dedicated to personalized elder care and daily wellness assistance.',
    image:           avatarUrl,
    available:       c.is_available !== 0 && c.is_available !== false,
    location:        c.location || 'In-home & Facility',
    active_residents: c.active_residents || 0,
    max_capacity:    c.max_capacity || 4,
    status:          c.status || 'approved',
  };
}

/* ─── Main Component ─── */
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

  useEffect(() => {
    const loadCaregivers = async () => {
      try {
        let res = await fetch(`${API_BASE}/caregivers/public`);
        if (!res.ok) {
          res = await fetch('/api/caregivers/public');
        }
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setCaregivers(data.map(mapCaregiver));
        }
      } catch (err) {
        console.error('Error fetching public caregivers:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCaregivers();
  }, []);

  const filtered = caregivers.filter(c => {
    const nameStr = (c.name || '').toLowerCase();
    const titleStr = (c.title || '').toLowerCase();
    const bioStr = (c.bio || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    if (query && !nameStr.includes(query) && !titleStr.includes(query) && !bioStr.includes(query)) return false;
    if (ratingFilter === '4.5 & up' && !(c.rating && Number(c.rating) >= 4.5)) return false;
    if (ratingFilter === '4.0 & up' && !(c.rating && Number(c.rating) >= 4.0)) return false;
    if (experienceFilter === '5+ Years'  && !(c.experienceYears >= 5))  return false;
    if (experienceFilter === '10+ Years' && !(c.experienceYears >= 10)) return false;
    if (priceFilter === 'Under $30/hr' && !(c.hourlyRate != null && c.hourlyRate < 30)) return false;
    if (priceFilter === '$30 - $50/hr' && !(c.hourlyRate != null && c.hourlyRate >= 30 && c.hourlyRate <= 50)) return false;
    if (priceFilter === '$50+/hr'      && !(c.hourlyRate != null && c.hourlyRate > 50)) return false;
    return true;
  });

  return (
    <div className="cg-page">
      {showTalkModal && <TalkModal onClose={() => setShowTalkModal(false)} />}
      {showHowModal && <HowItWorksModal onClose={() => setShowHowModal(false)} />}
      
      {/* ── Hero ── */}
      <header className="cg-hero">
        <div className="container">
          <h1 className="cg-hero-title">Find Your <span className="text-teal">Caregiver</span></h1>
          <p className="cg-hero-subtitle">
            Connect with verified specialists who bring expertise, empathy, and warmth to your home. We believe every family deserves a sanctuary of support.
          </p>
        </div>
      </header>

      <main className="container cg-main">
        {/* ── Filters ── */}
        <div className="cg-filters-wrapper">
          <div className="cg-search-box">
            <Search className="cg-search-icon" size={20} />
            <input type="text" placeholder="Search by name, specialty, or keywords..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="cg-filters-dropdowns">
            <div className="cg-select-wrapper">
              <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
                <option>Rating: Any</option>
                <option>4.5 &amp; up</option>
                <option>4.0 &amp; up</option>
              </select>
              <ChevronDown className="cg-select-icon" size={16} />
            </div>
            <div className="cg-select-wrapper">
              <select value={experienceFilter} onChange={e => setExperienceFilter(e.target.value)}>
                <option>Experience</option>
                <option>5+ Years</option>
                <option>10+ Years</option>
              </select>
              <ChevronDown className="cg-select-icon" size={16} />
            </div>
            <div className="cg-select-wrapper">
              <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
                <option>Price Range</option>
                <option>Under $30/hr</option>
                <option>$30 - $50/hr</option>
                <option>$50+/hr</option>
              </select>
              <ChevronDown className="cg-select-icon" size={16} />
            </div>
          </div>
        </div>

        {/* ── Actions Row ── */}
        <div className="cg-actions-row">
          <span className="cg-results-count">{filtered.length} caregivers available</span>
          <div className="cg-actions-btns">
            <button className="cg-btn cg-btn-outline" onClick={() => setShowHowModal(true)}>How it works</button>
            <button className="cg-btn cg-btn-primary" onClick={() => setShowTalkModal(true)}>Talk to a Specialist</button>
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="cg-loading">
            <div className="cg-spinner"></div>
            <p>Finding perfect matches...</p>
          </div>
        ) : (
          <div className="cg-grid">
            {filtered.map((c, idx) => (
              <div key={c.id} className="cg-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="cg-card-header">
                  <img src={c.image} alt={c.name} className="cg-avatar" loading="lazy" />
                  <div className="cg-card-price">
                    <span className="cg-price-val">{c.price}</span><span className="cg-price-unit">/hr</span>
                  </div>
                </div>
                
                <div className="cg-card-body">
                  <div className="cg-card-title-row">
                    <h3 className="cg-card-name">{c.name}</h3>
                    {c.available && <span className="cg-status-badge">Available</span>}
                  </div>
                  <p className="cg-card-specialty">{c.title}</p>
                  
                  <div className="cg-card-stats">
                    <div className="cg-stat">
                      <Star size={16} className="text-yellow" fill="currentColor" />
                      <span><strong>{c.rating}</strong> ({c.reviews})</span>
                    </div>
                    <div className="cg-stat">
                      <Clock size={16} className="text-gray" />
                      <span>{c.experienceYears} Years Exp.</span>
                    </div>
                  </div>

                  <p className="cg-card-bio">{c.bio}</p>

                  <div className="cg-card-tags">
                    {c.tags.slice(0,3).map((tag, i) => (
                      <span key={i} className="cg-tag">{tag.label}</span>
                    ))}
                  </div>
                </div>

                <div className="cg-card-footer">
                  <Link to={`/caregivers/${c.id}`} className="cg-btn cg-btn-outline w-full">View Profile</Link>
                </div>
              </div>
            ))}
            
            {filtered.length === 0 && (
              <div className="cg-no-results">
                <Search size={48} className="text-gray-light mb-4" />
                <h3>No caregivers found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button className="cg-btn cg-btn-outline mt-4" onClick={() => {
                  setSearchQuery(''); setRatingFilter('Rating: Any'); setExperienceFilter('Experience'); setPriceFilter('Price Range');
                }}>Clear all filters</button>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Caregivers;
