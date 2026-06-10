import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import nurseImage from '../../../assets/about/nurse_holding_hands.png';

const TEAL = '#00A896';
const TEAL_DARK = '#008f80';
const TEAL_LIGHT = '#E6F7F5';

const inputStyle = {
  width: '100%',
  padding: '0.68rem 0.75rem',
  borderRadius: '9px',
  border: '1.5px solid #E2E8F0',
  fontSize: '0.84rem',
  outline: 'none',
  boxSizing: 'border-box',
  color: '#1a202c',
  backgroundColor: 'white',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.35rem',
  fontSize: '0.8rem',
  fontWeight: '500',
  color: '#374151',
};

const MODAL_CONTENT = {
  terms: {
    title: 'Terms of Service',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: 'By creating an account and using FamilyCare, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.',
      },
      {
        heading: '2. Description of Service',
        body: 'FamilyCare provides a platform that connects family members with professional caregivers to facilitate remote monitoring and coordination of care for elderly or dependent individuals.',
      },
      {
        heading: '3. User Accounts',
        body: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access. You must provide accurate and complete information during registration.',
      },
      {
        heading: '4. Caregiver Verification',
        body: 'Caregiver accounts are subject to additional verification before activation. FamilyCare reserves the right to revoke caregiver access if provided credentials or certifications are found to be invalid.',
      },
      {
        heading: '5. Prohibited Conduct',
        body: 'You agree not to misuse the platform, share false information, attempt unauthorized access to other accounts, or use the service for any unlawful purpose.',
      },
      {
        heading: '6. Limitation of Liability',
        body: 'FamilyCare is a coordination platform and does not directly provide medical care. We are not liable for the actions of caregivers or the outcomes of care arrangements facilitated through our platform.',
      },
      {
        heading: '7. Modifications',
        body: 'We reserve the right to update these Terms at any time. Continued use of the platform after changes are posted constitutes your acceptance of the revised Terms.',
      },
      {
        heading: '8. Governing Law',
        body: 'These Terms shall be governed by applicable federal and state laws, including all relevant healthcare regulations.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'We collect personal information you provide during registration (name, email, phone, role), usage data, and health-related information shared through the platform to facilitate care coordination.',
      },
      {
        heading: '2. HIPAA Compliance',
        body: 'FamilyCare handles Protected Health Information (PHI) in accordance with the Health Insurance Portability and Accountability Act (HIPAA). We implement administrative, physical, and technical safeguards to protect the privacy and security of health information.',
      },
      {
        heading: '3. How We Use Your Information',
        body: 'Your information is used to operate the platform, connect family members with caregivers, send notifications, improve our services, and comply with legal obligations. We do not sell your personal data.',
      },
      {
        heading: '4. Information Sharing',
        body: 'We share information only with the parties you authorize (e.g., caregivers you connect with), service providers who assist our operations under strict confidentiality agreements, and authorities when required by law.',
      },
      {
        heading: '5. Data Security',
        body: 'We use industry-standard encryption (TLS in transit, AES-256 at rest), access controls, and regular security audits to protect your data against unauthorized access or disclosure.',
      },
      {
        heading: '6. Data Retention',
        body: 'We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time.',
      },
      {
        heading: '7. Your Rights',
        body: 'You have the right to access, correct, or delete your personal information. You may also opt out of non-essential communications. To exercise these rights, contact our Privacy Officer at privacy@familycare.com.',
      },
      {
        heading: '8. Cookies',
        body: 'We use essential cookies to keep you logged in and session cookies to improve your experience. We do not use third-party advertising cookies.',
      },
      {
        heading: '9. Contact Us',
        body: 'For privacy-related inquiries or to report a concern, contact us at privacy@familycare.com or write to: FamilyCare Privacy Officer, [Company Address].',
      },
    ],
  },
};

const LegalModal = ({ type, onClose }) => {
  const content = MODAL_CONTENT[type];
  if (!content) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'white', borderRadius: '16px',
          width: '100%', maxWidth: '560px',
          maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: TEAL_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6M9 16h6M7 8h10M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1a202c' }}>{content.title}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F3F4F6', border: 'none', borderRadius: '8px',
              width: '32px', height: '32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', color: '#6B7280',
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', padding: '1.25rem 1.5rem', flex: 1 }}>
          <p style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: 0, marginBottom: '1rem' }}>
            Last updated: January 1, 2026
          </p>
          {content.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.83rem', fontWeight: '600', color: '#1a202c', margin: '0 0 4px 0' }}>{s.heading}</h4>
              <p style={{ fontSize: '0.79rem', color: '#4A5568', lineHeight: 1.65, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #E2E8F0',
          flexShrink: 0,
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: TEAL, color: 'white', border: 'none',
              borderRadius: '8px', padding: '0.55rem 1.25rem',
              fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer',
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  const [selectedRole, setSelectedRole] = useState('family');
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [experience, setExperience]   = useState('');
  const [certification, setCertification] = useState('');
  const [licenseId, setLicenseId]     = useState('');
  const [agreed, setAgreed]           = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState('');
  const [openModal, setOpenModal]     = useState(null);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const userData = {
        name, email, password,
        role: selectedRole,
        phone,
        ...(selectedRole === 'family'
          ? { relationship }
          : { experience, certification, licenseId }),
      };
      await register(userData);
      navigate(selectedRole === 'caregiver' ? '/caregiver/dashboard' : '/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const focusBorder  = (e) => { e.target.style.borderColor = TEAL; };
  const blurBorder   = (e) => { e.target.style.borderColor = '#E2E8F0'; };

  const RoleCard = ({ role, label, description, icon }) => {
    const active = selectedRole === role;
    return (
      <button
        type="button"
        onClick={() => setSelectedRole(role)}
        style={{
          padding: '0.85rem',
          borderRadius: '12px',
          border: `2px solid ${active ? TEAL : '#E2E8F0'}`,
          backgroundColor: active ? TEAL_LIGHT : 'white',
          cursor: 'pointer',
          textAlign: 'left',
          position: 'relative',
          transition: 'all 0.2s',
        }}
      >
        {active && (
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '17px', height: '17px', borderRadius: '50%',
            backgroundColor: TEAL,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        <div style={{ fontSize: '1.25rem', marginBottom: '3px' }}>{icon}</div>
        <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#1a202c', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '0.72rem', color: '#718096', lineHeight: 1.4 }}>{description}</div>
      </button>
    );
  };

  return (
    <>
    <style>{`
      @media (max-width: 768px) {
        .register-hero-panel { display: none !important; }
        .register-form-panel { width: 100% !important; }
      }
    `}</style>
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left panel ── */}
      <div className="register-hero-panel" style={{
        flex: 1,
        backgroundImage: `url(${nurseImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem',
        minHeight: '100vh',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,50,40,0.45), rgba(0,30,25,0.72))' }} />

        {/* Logo */}
        <Link to="/" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21C12 21 3 14 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14 14 21 12 21Z" fill="white" />
            </svg>
          </div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '1.2rem', letterSpacing: '-0.3px' }}>FamilyCare</span>
        </Link>

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'white', fontSize: '2.8rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-1px' }}>
            Start Caring<br />Smarter.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '300px' }}>
            Join a community dedicated to providing dignified, tech-enabled care for your loved ones. Real-time monitoring and empathetic coordination.
          </p>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex' }}>
              {['#4CAF50', '#2196F3', '#FF9800'].map((color, i) => (
                <div key={i} style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  backgroundColor: color, border: '2px solid white',
                  marginLeft: i > 0 ? '-8px' : 0,
                }} />
              ))}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem' }}>
              <strong>2,000+</strong> families trust us daily
            </span>
          </div>
        </div>

        <p style={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>
          © 2024 FamilyCare. Your sanctuary for health.
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="register-form-panel" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2.5rem 2.8rem',
        backgroundColor: 'white',
        overflowY: 'auto',
      }}>
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>

          {/* Back to home */}
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#6B7280', fontSize: '0.82rem', textDecoration: 'none',
            marginBottom: '1.4rem', fontWeight: '500',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to home
          </Link>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.25rem' }}>
            Create an Account
          </h2>
          <p style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '1.4rem' }}>
            Select your role to get started.
          </p>

          {/* Role selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.2rem' }}>
            <RoleCard
              role="family"
              label="Family Member"
              description="Monitor your parents remotely and stay connected."
              icon="🏠"
            />
            <RoleCard
              role="caregiver"
              label="Caregiver"
              description="Provide professional care, logs, and updates."
              icon="🩺"
            />
          </div>

          {/* Role info banner */}
          {selectedRole === 'family' ? (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              backgroundColor: TEAL_LIGHT, border: `1px solid ${TEAL}`,
              borderRadius: '8px', padding: '9px 12px', marginBottom: '1.2rem',
            }}>
              <span style={{ color: TEAL, fontSize: '0.9rem', flexShrink: 0 }}>✓</span>
              <p style={{ fontSize: '0.77rem', color: TEAL_DARK, margin: 0, lineHeight: 1.5 }}>
                As a Family Member you can monitor and stay connected with your loved ones.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              backgroundColor: '#FFFBEB', border: '1px solid #FCD34D',
              borderRadius: '8px', padding: '9px 12px', marginBottom: '1.2rem',
            }}>
              <span style={{ color: '#D97706', fontSize: '0.9rem', flexShrink: 0 }}>⚠</span>
              <p style={{ fontSize: '0.77rem', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                Caregiver accounts require additional verification before activation.
              </p>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5',
              borderRadius: '8px', padding: '9px 12px', marginBottom: '1rem',
            }}>
              <span style={{ color: '#DC2626', fontSize: '0.85rem', flexShrink: 0 }}>✕</span>
              <p style={{ fontSize: '0.77rem', color: '#B91C1C', margin: 0, lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Row 1: Full Name + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Jane Doe" required style={inputStyle}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="jane@example.com" required style={inputStyle}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>
            </div>

            {/* Row 2: Phone + Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000" style={inputStyle}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Create a secure password" required
                    style={{ ...inputStyle, paddingRight: '2.2rem' }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: '#9CA3AF', padding: 0,
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Family-specific fields */}
            {selectedRole === 'family' && (
              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle}>Relationship to Senior</label>
                <select
                  value={relationship} onChange={e => setRelationship(e.target.value)}
                  required style={{ ...inputStyle, color: relationship ? '#1a202c' : '#9CA3AF' }}
                  onFocus={focusBorder} onBlur={blurBorder}
                >
                  <option value="" disabled>Select relationship...</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                  <option value="grandchild">Grandchild</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {/* Caregiver-specific fields */}
            {selectedRole === 'caregiver' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={labelStyle}>Years of Experience</label>
                    <select
                      value={experience} onChange={e => setExperience(e.target.value)}
                      required style={{ ...inputStyle, color: experience ? '#1a202c' : '#9CA3AF' }}
                      onFocus={focusBorder} onBlur={blurBorder}
                    >
                      <option value="" disabled>Select experience...</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1–3 years</option>
                      <option value="3-5">3–5 years</option>
                      <option value="5-10">5–10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Certification</label>
                    <select
                      value={certification} onChange={e => setCertification(e.target.value)}
                      required style={{ ...inputStyle, color: certification ? '#1a202c' : '#9CA3AF' }}
                      onFocus={focusBorder} onBlur={blurBorder}
                    >
                      <option value="" disabled>Select certification...</option>
                      <option value="CNA">CNA</option>
                      <option value="LPN">LPN</option>
                      <option value="RN">RN</option>
                      <option value="HHA">HHA</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={labelStyle}>License / ID Number <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></label>
                  <input
                    type="text" value={licenseId} onChange={e => setLicenseId(e.target.value)}
                    placeholder="e.g. CNA-123456" style={inputStyle}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                </div>
              </>
            )}

            {/* HIPAA checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '1.2rem', marginTop: '4px' }}>
              <input
                type="checkbox" id="agreed" checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ width: '15px', height: '15px', marginTop: '2px', cursor: 'pointer', accentColor: TEAL, flexShrink: 0 }}
              />
              <label htmlFor="agreed" style={{ fontSize: '0.76rem', color: '#4A5568', cursor: 'pointer', lineHeight: 1.5 }}>
                I agree to the{' '}
                <a
                  href="#" onClick={e => { e.preventDefault(); setOpenModal('terms'); }}
                  style={{ color: TEAL, textDecoration: 'none', fontWeight: '500' }}
                >Terms of Service</a>
                {' '}and{' '}
                <a
                  href="#" onClick={e => { e.preventDefault(); setOpenModal('privacy'); }}
                  style={{ color: TEAL, textDecoration: 'none', fontWeight: '500' }}
                >Privacy Policy</a>
                , including HIPAA compliance standards.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '0.82rem',
                backgroundColor: isLoading ? TEAL_DARK : TEAL,
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '0.9rem', fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.8 : 1, transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isLoading) e.target.style.backgroundColor = TEAL_DARK; }}
              onMouseLeave={e => { if (!isLoading) e.target.style.backgroundColor = TEAL; }}
            >
              {isLoading
                ? 'Creating account...'
                : selectedRole === 'caregiver' ? 'Create Caregiver Account' : 'Create Family Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#6B7280', marginTop: '1rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: TEAL, fontWeight: '600', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>

          {/* Quick nav links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: '1px solid #F1F5F9' }}>
            {[{ label: 'Home', to: '/' }, { label: 'Features', to: '/features' }, { label: 'About', to: '/about' }].map(({ label, to }) => (
              <Link key={to} to={to} style={{ fontSize: '0.78rem', color: '#9CA3AF', textDecoration: 'none', fontWeight: '500' }}>
                {label}
              </Link>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9CA3AF', marginTop: '1.2rem' }}>
            © 2026 FamilyCare. Your sanctuary for health.
          </p>
        </div>
      </div>
    </div>

    {openModal && <LegalModal type={openModal} onClose={() => setOpenModal(null)} />}
    </>
  );
};

export default Register;
