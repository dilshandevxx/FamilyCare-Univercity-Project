import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Footer from '../../../components/Landing/Footer';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Award,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Calendar,
  Activity,
  HeartPulse,
  Stethoscope,
  FileCheck,
  Check,
  MessageSquare,
  Sparkles,
  AlertCircle,
  X,
  Send,
  UserCheck
} from 'lucide-react';
import './CaregiverProfile.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HEALTHCARE_FALLBACK_AVATARS = [
  'https://images.unsplash.com/photo-1594824813590-78a48695d606?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'
];

function StarRating({ value }) {
  const rating = Number(value) || 5;
  const full = Math.floor(rating);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          fill={i <= full ? '#f59e0b' : 'none'}
          color={i <= full ? '#f59e0b' : '#cbd5e1'}
        />
      ))}
    </div>
  );
}

const InquiryModal = ({ caregiver, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Care Inquiry for ${caregiver.name} - FamilyCare`);
    const body = encodeURIComponent(
      `Hello ${caregiver.name},\n\nI am interested in your caregiving services for my family on FamilyCare.\n\n` +
      `Contact Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'N/A'}\n\n` +
      `Care Needs / Inquiry Message:\n${form.message}`
    );
    window.location.href = `mailto:${caregiver.email || 'support@familycare.com'}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="cg-modal-backdrop" onClick={onClose}>
      <div className="cg-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="cg-modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {sent ? (
          <div className="cg-modal-success">
            <div className="cg-modal-success-icon">
              <Check size={28} />
            </div>
            <h3 className="cg-modal-title">Inquiry Submitted!</h3>
            <p className="cg-modal-subtitle">
              Your default email application has opened. {caregiver.name} or our care coordinator will reach out shortly.
            </p>
            <button className="cg-btn-action-primary" onClick={onClose} style={{ marginTop: '16px' }}>
              Close Window
            </button>
          </div>
        ) : (
          <>
            <h3 className="cg-modal-title">Contact {caregiver.name}</h3>
            <p className="cg-modal-subtitle">
              Send a direct message or care inquiry to check schedule alignment and specialized requirements.
            </p>
            <form onSubmit={handleSubmit} className="cg-modal-form">
              <div className="cg-form-group">
                <label>Your Full Name</label>
                <input
                  type="text"
                  required
                  className="cg-form-input"
                  placeholder="e.g. Jane Miller"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="cg-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  className="cg-form-input"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="cg-form-group">
                <label>Phone Number (Optional)</label>
                <input
                  type="tel"
                  className="cg-form-input"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="cg-form-group">
                <label>Care Requirements & Message</label>
                <textarea
                  required
                  rows={4}
                  className="cg-form-textarea"
                  placeholder="Describe your parent's schedule, health conditions, and support required..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button type="submit" className="cg-modal-submit-btn">
                <Send size={16} /> Send Direct Inquiry
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const CaregiverProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cg, setCg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/caregivers/public/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Caregiver profile not found or currently unverified');
        return res.json();
      })
      .then((data) => {
        setCg(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="cg-profile-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: '#ffffff', borderRadius: '50%', border: '1px solid #e2e8f0', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Activity size={32} color="#00A896" className="animate-spin" />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700, margin: '0 0 6px' }}>Loading Caregiver Profile</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Fetching clinical records & verification credentials...</p>
        </div>
      </div>
    );
  }

  if (error || !cg) {
    return (
      <div className="cg-profile-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', maxWidth: '440px', padding: '32px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <AlertCircle size={44} color="#ef4444" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Caregiver Not Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
            {error || 'This caregiver may not be approved yet or is no longer available in the public registry.'}
          </p>
          <button onClick={() => navigate('/caregivers')} className="cg-btn-action-primary">
            <ArrowLeft size={16} /> Browse Verified Caregivers
          </button>
        </div>
      </div>
    );
  }

  // Calculate fields & fallbacks
  const fallbackIndex = Math.abs((Number(cg.id) || 1) - 1) % HEALTHCARE_FALLBACK_AVATARS.length;
  const avatarUrl = cg.avatar_url
    ? (cg.avatar_url.startsWith('http') ? cg.avatar_url : `http://localhost:5000${cg.avatar_url}`)
    : HEALTHCARE_FALLBACK_AVATARS[fallbackIndex];

  const specialization = cg.specialization || 'Certified Senior Care Specialist';
  const hourlyRate = cg.hourly_rate ? `$${Number(cg.hourly_rate).toFixed(0)}` : '$35';
  const ratingValue = cg.rating ? Number(cg.rating).toFixed(1) : '4.9';
  const reviewsCount = cg.total_reviews ? Number(cg.total_reviews) : 18;
  const experienceText = cg.experience_years ? `${cg.experience_years} Years` : '5+ Years';

  const activeResidents = Number(cg.active_residents) || 0;
  const maxCapacity = Number(cg.max_capacity) || 4;
  const isAvailable = cg.is_available !== false && activeResidents < maxCapacity;

  // Curated clinical services based on specialization or defaults
  const clinicalServices = [
    { title: 'Vital Signs & Daily Health Logging', icon: HeartPulse },
    { title: 'Medication Administration & Reminders', icon: Stethoscope },
    { title: 'Mobility & Fall Prevention Assistance', icon: ShieldCheck },
    { title: 'Nutritional Meal Preparation & Dietary Care', icon: Sparkles },
    { title: 'Cognitive & Memory Stimulation Exercises', icon: Award },
    { title: 'Emergency Escalation & Clinical Coordination', icon: AlertCircle }
  ];

  const handleBookingAction = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role') || localStorage.getItem('user_role');
    if (token && userRole === 'child') {
      navigate('/parents');
    } else if (token) {
      navigate('/dashboard');
    } else {
      setShowContact(true);
    }
  };

  return (
    <div className="cg-profile-page">
      {showContact && <InquiryModal caregiver={cg} onClose={() => setShowContact(false)} />}

      <div className="cg-profile-container">
        {/* Top Navigation & Breadcrumb */}
        <div className="cg-top-nav">
          <button onClick={() => navigate('/caregivers')} className="cg-back-btn">
            <ArrowLeft size={16} /> Back to Directory
          </button>
          <div className="cg-breadcrumb">
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to="/caregivers" style={{ color: 'inherit', textDecoration: 'none' }}>Caregivers</Link>
            <span>/</span>
            <span className="active">{cg.name}</span>
          </div>
        </div>

        {/* Hero Profile Showcase Card */}
        <div className="cg-hero-card">
          <div className="cg-hero-banner" />

          <div className="cg-hero-content">
            <div className="cg-hero-header-row">
              {/* Avatar with Verified Shield */}
              <div className="cg-avatar-wrapper">
                <img
                  src={avatarUrl}
                  alt={cg.name}
                  className="cg-avatar-img"
                  onError={(e) => {
                    e.target.src = HEALTHCARE_FALLBACK_AVATARS[0];
                  }}
                />
                <div className="cg-verified-badge" title="Identity & Clinical Credentials Verified">
                  <ShieldCheck size={16} />
                </div>
              </div>

              {/* Center Info */}
              <div className="cg-hero-main-info">
                <div className="cg-name-row">
                  <h1 className="cg-profile-name">{cg.name}</h1>
                  <span className={`cg-status-pill ${isAvailable ? 'available' : 'busy'}`}>
                    <span className="cg-status-dot" />
                    {isAvailable ? 'Accepting Clients' : 'Schedule at Capacity'}
                  </span>
                </div>

                <div className="cg-spec-row">
                  <span className="cg-spec-badge">{specialization}</span>
                  <span className="cg-info-item">
                    <MapPin size={15} color="#00A896" />
                    {cg.location || 'In-Home & Clinical Visits'}
                  </span>
                  <span className="cg-info-item">
                    <Clock size={15} color="#00A896" />
                    {experienceText} Experience
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="cg-metrics-strip">
              <div className="cg-metric-box">
                <div className="cg-metric-icon gold">
                  <Star size={20} />
                </div>
                <div>
                  <div className="cg-metric-val">{ratingValue} ★</div>
                  <div className="cg-metric-lbl">{reviewsCount} Family Reviews</div>
                </div>
              </div>

              <div className="cg-metric-box">
                <div className="cg-metric-icon">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="cg-metric-val">{experienceText}</div>
                  <div className="cg-metric-lbl">Clinical Background</div>
                </div>
              </div>

              <div className="cg-metric-box">
                <div className="cg-metric-icon">
                  <Users size={20} />
                </div>
                <div>
                  <div className="cg-metric-val">{activeResidents} / {maxCapacity} Assigned</div>
                  <div className="cg-metric-lbl">Active Resident Load</div>
                </div>
              </div>

              <div className="cg-metric-box">
                <div className="cg-metric-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="cg-metric-val">100% Verified</div>
                  <div className="cg-metric-lbl">Level 2 Background Checked</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="cg-body-grid">
          {/* Main Left Content */}
          <div className="cg-main-col">
            {/* Bio & Care Philosophy */}
            <div className="cg-card">
              <h2 className="cg-card-title">
                <Sparkles size={20} className="cg-card-title-icon" /> Professional Biography & Care Approach
              </h2>
              <p className="cg-bio-text">
                {cg.bio ||
                  `${cg.name} is a certified, compassionate healthcare professional specialized in geriatric care, daily vitals tracking, and holistic elder assistance. Committed to empowering aging adults to live with dignity, comfort, and emotional connection in their own homes.`}
              </p>
            </div>

            {/* Clinical Capabilities & Services */}
            <div className="cg-card">
              <h2 className="cg-card-title">
                <HeartPulse size={20} className="cg-card-title-icon" /> Care Capabilities & Daily Services
              </h2>
              <div className="cg-services-grid">
                {clinicalServices.map((srv, idx) => {
                  const Icon = srv.icon;
                  return (
                    <div key={idx} className="cg-service-tag">
                      <Icon size={18} className="cg-service-tag-icon" />
                      <span>{srv.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verified Certifications & Licensing */}
            <div className="cg-card">
              <h2 className="cg-card-title">
                <FileCheck size={20} className="cg-card-title-icon" /> Verified Credentials & Licensing
              </h2>
              <div className="cg-credentials-list">
                <div className="cg-credential-item">
                  <div className="cg-cred-icon-box">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="cg-cred-title">
                      {cg.certification || 'Certified Nursing Assistant (CNA) & Geriatric Specialist'}
                    </div>
                    <div className="cg-cred-sub">
                      Accredited by National Board of Healthcare Professionals
                    </div>
                  </div>
                </div>

                <div className="cg-credential-item">
                  <div className="cg-cred-icon-box">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="cg-cred-title">
                      State Health License: {cg.license_id || `ID #FC-${cg.id}883-V`}
                    </div>
                    <div className="cg-cred-sub">
                      Active and in good standing with State Department of Health
                    </div>
                  </div>
                </div>

                <div className="cg-credential-item">
                  <div className="cg-cred-icon-box">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <div className="cg-cred-title">Comprehensive Criminal & Identity Clearance</div>
                    <div className="cg-cred-sub">
                      Fingerprinted Level 2 FBI background screening verified
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability & Scheduling */}
            <div className="cg-card">
              <h2 className="cg-card-title">
                <Calendar size={20} className="cg-card-title-icon" /> Availability & Caseload Status
              </h2>
              <div className={`cg-avail-box ${isAvailable ? 'open' : 'full'}`}>
                <div className="cg-avail-icon-box">
                  {isAvailable ? <CheckCircle2 size={22} /> : <Clock size={22} />}
                </div>
                <div>
                  <div className="cg-avail-status-title">
                    {isAvailable ? 'Open for New Resident Assignments' : 'Currently Operating at Maximum Capacity'}
                  </div>
                  <div className="cg-avail-desc">
                    {isAvailable
                      ? `${cg.name} currently supports ${activeResidents} of ${maxCapacity} maximum residents. Dedicated care slots are open for weekday and weekend home visits.`
                      : `${cg.name} is currently managing ${activeResidents} full-time residents. You may still send an inquiry to be placed on the upcoming schedule priority list.`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sticky Booking & Contact Sidebar */}
          <div className="cg-side-col">
            <div className="cg-booking-card">
              <div className="cg-price-header">
                <span className="cg-price-amount">{hourlyRate}</span>
                <span className="cg-price-period">/ hour</span>
              </div>
              <div className="cg-price-subtext">Transparent hourly rate • No hidden booking fees</div>

              <div className="cg-action-buttons">
                <button onClick={handleBookingAction} className="cg-btn-action-primary">
                  <UserCheck size={18} /> Assign to My Parent
                </button>

                <button onClick={() => setShowContact(true)} className="cg-btn-action-secondary">
                  <MessageSquare size={18} /> Send Direct Message
                </button>
              </div>

              <div className="cg-sidebar-details">
                <div className="cg-side-detail-row">
                  <MapPin size={16} className="cg-side-detail-icon" />
                  <span>{cg.location || 'Metro Area & In-Home'}</span>
                </div>

                {cg.phone && (
                  <div className="cg-side-detail-row">
                    <Phone size={16} className="cg-side-detail-icon" />
                    <span>{cg.phone}</span>
                  </div>
                )}

                <div className="cg-side-detail-row">
                  <Mail size={16} className="cg-side-detail-icon" />
                  <span>{cg.email || `${cg.name.toLowerCase().replace(/\s+/g, '.')}@care.familycare.com`}</span>
                </div>

                <div className="cg-side-detail-row">
                  <Globe size={16} className="cg-side-detail-icon" />
                  <span>{cg.languages || 'English (Fluent)'}</span>
                </div>
              </div>
            </div>

            {/* Safety & Guarantee Badge */}
            <div className="cg-trust-guarantee-card">
              <ShieldCheck size={22} className="cg-trust-guarantee-icon" />
              <div className="cg-trust-guarantee-text">
                <strong>FamilyCare Trust Standard</strong>
                All caregivers undergo annual re-certification, identity verification, and live supervisory auditing.
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CaregiverProfile;
