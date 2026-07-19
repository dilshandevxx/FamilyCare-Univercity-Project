import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Register.css';

const MODAL_CONTENT = {
  terms: {
    title: 'Terms of Service',
    sections: [
      { heading: '1. Acceptance of Terms', body: 'By creating an account and using FamilyCare, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.' },
      { heading: '2. Description of Service', body: 'FamilyCare provides a platform that connects family members with professional caregivers to facilitate remote monitoring and coordination of care for elderly or dependent individuals.' },
      { heading: '3. User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration.' },
      { heading: '4. Caregiver Verification', body: 'Caregiver accounts are subject to additional verification before activation. FamilyCare reserves the right to revoke caregiver access if provided credentials are found to be invalid.' },
      { heading: '5. Limitation of Liability', body: 'FamilyCare is a coordination platform and does not directly provide medical care. We are not liable for outcomes of care arrangements facilitated through our platform.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: '1. Information We Collect', body: 'We collect personal information you provide during registration including name, email, phone, and role-specific data to facilitate care coordination.' },
      { heading: '2. HIPAA Compliance', body: 'FamilyCare handles Protected Health Information (PHI) in accordance with HIPAA. We implement administrative, physical, and technical safeguards to protect health information.' },
      { heading: '3. How We Use Your Information', body: 'Your information is used to operate the platform, connect family members with caregivers, and comply with legal obligations. We do not sell your personal data.' },
      { heading: '4. Data Security', body: 'We use industry-standard encryption (TLS in transit, AES-256 at rest) and regular security audits to protect your data.' },
    ],
  },
};

const LegalModal = ({ type, onClose }) => {
  const content = MODAL_CONTENT[type];
  if (!content) return null;
  return (
    <div className="reg-modal-overlay" onClick={onClose}>
      <div className="reg-modal-box" onClick={e => e.stopPropagation()}>
        <div className="reg-modal-header">
          <h3>{content.title}</h3>
          <button className="reg-modal-close-btn" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="reg-modal-body">
          <p className="reg-modal-date">Last updated: January 1, 2026</p>
          {content.sections.map((s, i) => (
            <div key={i} className="reg-modal-section">
              <h4>{s.heading}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <div className="reg-modal-footer">
          <button className="reg-modal-ok-btn" onClick={onClose}>Got it, thanks</button>
        </div>
      </div>
    </div>
  );
};

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: 'Real-time Health Monitoring',
    desc: 'Track vitals, medications, and daily logs as they happen.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Verified Caregivers',
    desc: 'Connect with certified, background-checked professionals.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    title: 'Instant Alerts',
    desc: 'Get notified immediately when attention is needed.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'HIPAA Compliant',
    desc: 'Your health data is encrypted and fully protected.',
  },
];

const Register = () => {
  const [selectedRole, setSelectedRole] = useState('family');
  const [step, setStep] = useState(1); // 2-step form for cleanliness
  const [name, setName]                 = useState('');
  const [email, setEmail]               = useState('');
  const [phone, setPhone]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [experience, setExperience]     = useState('');
  const [certification, setCertification] = useState('');
  const [licenseId, setLicenseId]       = useState('');
  const [agreed, setAgreed]             = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState('');
  const [openModal, setOpenModal]       = useState(null);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setStep(1);
    setError('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError('Please agree to the Terms and Privacy Policy.'); return; }
    setError('');
    setIsLoading(true);
    try {
      const userData = {
        name, email, password, role: selectedRole, phone,
        ...(selectedRole === 'family' ? { relationship } : { experience, certification, licenseId }),
      };
      await register(userData);
      navigate(selectedRole === 'caregiver' ? '/caregiver/dashboard' : '/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
  const pStrength = passwordStrength();

  return (
    <>
      <div className="reg-root">

        {/* ─── LEFT: Hero Panel ─── */}
        <div className="reg-hero-panel">
          <div className="reg-hero-content">

            <div className="reg-brand">
              <div className="reg-brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span className="reg-brand-name">FamilyCare</span>
            </div>

            <h2 className="reg-hero-title">
              Everything you need<br/>
              to care <span>brilliantly.</span>
            </h2>

            <p className="reg-hero-desc">
              Join thousands of families who trust FamilyCare to keep their loved ones safe, healthy, and connected.
            </p>

            <div className="reg-features">
              {FEATURES.map((f, i) => (
                <div key={i} className="reg-feature-item">
                  <div className="reg-feature-icon">{f.icon}</div>
                  <div className="reg-feature-text">
                    <strong>{f.title}</strong>
                    <span>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="reg-hero-users">
              <div className="reg-avatars">
                {['A','B','C','D','E'].map((l, i) => (
                  <div key={i} className="reg-avatar" style={{ marginLeft: i > 0 ? '-10px' : 0 }}>{l}</div>
                ))}
              </div>
              <p><strong>10,000+</strong> families already using FamilyCare</p>
            </div>

          </div>

          {/* Decorative circles */}
          <div className="reg-circle reg-circle-1"></div>
          <div className="reg-circle reg-circle-2"></div>
          <div className="reg-circle reg-circle-3"></div>
        </div>

        {/* ─── RIGHT: Form Panel ─── */}
        <div className="reg-form-panel">
          <div className="reg-form-inner">

            <div className="reg-form-header">
              <h1>Create your account</h1>
              <p>Fill in the details below to get started.</p>
            </div>

            {/* Role Selector */}
            <div className="reg-role-toggle">
              <button
                type="button"
                className={`reg-role-btn ${selectedRole === 'family' ? 'active' : ''}`}
                onClick={() => handleRoleChange('family')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Family Member
              </button>
              <button
                type="button"
                className={`reg-role-btn ${selectedRole === 'caregiver' ? 'active' : ''}`}
                onClick={() => handleRoleChange('caregiver')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Caregiver
              </button>
            </div>

            {/* Step Progress */}
            <div className="reg-steps">
              <div className={`reg-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
                <div className="reg-step-circle">
                  {step > 1 ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : '1'}
                </div>
                <span>Your Info</span>
              </div>
              <div className="reg-step-line"></div>
              <div className={`reg-step ${step >= 2 ? 'active' : ''}`}>
                <div className="reg-step-circle">2</div>
                <span>{selectedRole === 'caregiver' ? 'Credentials' : 'Details'}</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="reg-error-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="reg-form slide-in">
                <div className="reg-field-grid">
                  <div className="reg-field">
                    <label htmlFor="reg-name">Full Name <span className="reg-required">*</span></label>
                    <div className="reg-input-wrap">
                      <svg className="reg-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      <input
                        id="reg-name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="reg-input"
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="reg-field">
                    <label htmlFor="reg-email">Email Address <span className="reg-required">*</span></label>
                    <div className="reg-input-wrap">
                      <svg className="reg-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="reg-input"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="reg-field">
                    <label htmlFor="reg-phone">Phone Number</label>
                    <div className="reg-input-wrap">
                      <svg className="reg-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l1.12-1.12a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <input
                        id="reg-phone"
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="reg-input"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="reg-field">
                    <label htmlFor="reg-password">Password <span className="reg-required">*</span></label>
                    <div className="reg-input-wrap">
                      <svg className="reg-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="reg-input"
                        required
                        autoComplete="new-password"
                      />
                      <button type="button" className="reg-eye-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                        {showPassword ? (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        ) : (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="reg-strength">
                        <div className="reg-strength-bars">
                          {[1,2,3,4].map(i => (
                            <div
                              key={i}
                              className="reg-strength-bar"
                              style={{ background: i <= pStrength ? strengthColors[pStrength] : '#e2e8f0' }}
                            ></div>
                          ))}
                        </div>
                        <span style={{ color: strengthColors[pStrength] }}>{strengthLabels[pStrength]}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="reg-submit-btn">
                  Continue
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="reg-form slide-in">
                {selectedRole === 'family' ? (
                  <div className="reg-field">
                    <label htmlFor="reg-relationship">Relationship to Senior <span className="reg-required">*</span></label>
                    <div className="reg-input-wrap">
                      <svg className="reg-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      <select id="reg-relationship" value={relationship} onChange={e => setRelationship(e.target.value)} className="reg-input reg-select" required>
                        <option value="" disabled>Select your relationship...</option>
                        <option value="son">Son</option>
                        <option value="daughter">Daughter</option>
                        <option value="spouse">Spouse</option>
                        <option value="sibling">Sibling</option>
                        <option value="grandchild">Grandchild</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="reg-field-grid">
                    <div className="reg-field">
                      <label>Years of Experience <span className="reg-required">*</span></label>
                      <select value={experience} onChange={e => setExperience(e.target.value)} className="reg-input reg-select" required>
                        <option value="" disabled>Select experience...</option>
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1–3 years</option>
                        <option value="3-5">3–5 years</option>
                        <option value="5-10">5–10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                    <div className="reg-field">
                      <label>Certification <span className="reg-required">*</span></label>
                      <select value={certification} onChange={e => setCertification(e.target.value)} className="reg-input reg-select" required>
                        <option value="" disabled>Select certification...</option>
                        <option value="CNA">CNA — Certified Nursing Assistant</option>
                        <option value="LPN">LPN — Licensed Practical Nurse</option>
                        <option value="RN">RN — Registered Nurse</option>
                        <option value="HHA">HHA — Home Health Aide</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="reg-field reg-field-full">
                      <label>License / ID Number <span className="reg-optional">(optional)</span></label>
                      <div className="reg-input-wrap">
                        <svg className="reg-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                        <input
                          type="text"
                          value={licenseId}
                          onChange={e => setLicenseId(e.target.value)}
                          placeholder="e.g. CNA-123456"
                          className="reg-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Box */}
                <div className="reg-summary">
                  <div className="reg-summary-label">Account Summary</div>
                  <div className="reg-summary-row">
                    <span>Name</span><strong>{name}</strong>
                  </div>
                  <div className="reg-summary-row">
                    <span>Email</span><strong>{email}</strong>
                  </div>
                  <div className="reg-summary-row">
                    <span>Role</span><strong style={{textTransform:'capitalize'}}>{selectedRole === 'family' ? 'Family Member' : 'Caregiver'}</strong>
                  </div>
                </div>

                {/* Terms */}
                <label className="reg-terms-check">
                  <input
                    type="checkbox"
                    className="reg-checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                  />
                  <span>
                    I agree to the{' '}
                    <button type="button" className="reg-terms-link" onClick={() => setOpenModal('terms')}>Terms of Service</button>
                    {' '}and{' '}
                    <button type="button" className="reg-terms-link" onClick={() => setOpenModal('privacy')}>Privacy Policy</button>
                    , including HIPAA compliance.
                  </span>
                </label>

                <div className="reg-btn-group">
                  <button type="button" className="reg-back-btn" onClick={() => { setStep(1); setError(''); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Back
                  </button>
                  <button type="submit" className="reg-submit-btn reg-submit-flex" disabled={isLoading}>
                    {isLoading ? (
                      <><span className="reg-spinner"></span> Creating account…</>
                    ) : (
                      <>{selectedRole === 'caregiver' ? 'Create Caregiver Account' : 'Create Family Account'}</>
                    )}
                  </button>
                </div>
              </form>
            )}

            <p className="reg-signin-text">
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>

      </div>

      {openModal && <LegalModal type={openModal} onClose={() => setOpenModal(null)} />}
    </>
  );
};

export default Register;
