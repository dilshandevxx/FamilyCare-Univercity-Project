import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Register.css';

/* ── Legal Modal ──────────────────────────────────────────────────────────── */
const MODAL_CONTENT = {
  terms: {
    title: 'Terms of Service',
    sections: [
      { heading: '1. Acceptance of Terms', body: 'By creating an account and using FamilyCare, you agree to be bound by these Terms of Service.' },
      { heading: '2. Description of Service', body: 'FamilyCare connects family members with professional caregivers for remote monitoring and care coordination.' },
      { heading: '3. User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials and providing accurate information during registration.' },
      { heading: '4. Caregiver Verification', body: 'Caregiver accounts require admin verification before activation. FamilyCare may revoke access if credentials are found invalid.' },
      { heading: '5. Limitation of Liability', body: 'FamilyCare is a coordination platform. We are not liable for care outcomes facilitated through our platform.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: '1. Information We Collect', body: 'We collect name, email, phone, and role-specific data you provide during registration.' },
      { heading: '2. HIPAA Compliance', body: 'Health information is handled per HIPAA regulations using administrative, physical, and technical safeguards.' },
      { heading: '3. How We Use Your Information', body: 'Your information is used to operate the platform and connect families with caregivers. We never sell your data.' },
      { heading: '4. Data Security', body: 'We use TLS encryption in transit and AES-256 at rest, with regular security audits.' },
    ],
  },
};

const LegalModal = ({ type, onClose }) => {
  const c = MODAL_CONTENT[type];
  if (!c) return null;
  return (
    <div className="reg-modal-overlay" onClick={onClose}>
      <div className="reg-modal-box" onClick={e => e.stopPropagation()}>
        <div className="reg-modal-header">
          <h3>{c.title}</h3>
          <button className="reg-modal-close-btn" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="reg-modal-body">
          <p className="reg-modal-date">Last updated: January 1, 2026</p>
          {c.sections.map((s, i) => (
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

/* ── Hero Features ────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: 'Real-time Health Monitoring',
    desc: 'Track vitals, medications, and daily logs live.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'Verified Caregivers',
    desc: 'Certified, background-checked professionals.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    title: 'Instant Alerts',
    desc: 'Get notified the moment attention is needed.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'HIPAA Compliant',
    desc: 'Your health data is encrypted and protected.',
  },
];

/* ── Reusable Field Components ──────────────────────────────────────────────── */
const Field = ({ label, required, optional, children }) => (
  <div className="rf-field">
    <label className="rf-label">
      {label}
      {required && <span className="rf-required">*</span>}
      {optional && <span className="rf-optional"> — optional</span>}
    </label>
    {children}
  </div>
);

const Input = ({ ...props }) => <input className="rf-input" {...props} />;

const Select = ({ children, ...props }) => (
  <div className="rf-select-wrap">
    <select className="rf-select" {...props}>{children}</select>
    <svg className="rf-select-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
  </div>
);

const PrefixInput = ({ prefix, ...props }) => (
  <div className="rf-prefix-wrap">
    <span className="rf-prefix">{prefix}</span>
    <input className="rf-input rf-input-prefixed" {...props} />
  </div>
);

const Textarea = ({ ...props }) => <textarea className="rf-textarea" {...props} />;

/* ── Main Register Component ─────────────────────────────────────────────── */
const Register = () => {
  const [selectedRole, setSelectedRole] = useState('family');
  const [step, setStep] = useState(1);

  // Shared fields → users table
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Family-specific → family_profiles table
  const [relationship, setRelationship] = useState('');

  // Caregiver-specific → caregivers table
  const [specialization, setSpecialization]   = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [certification, setCertification]     = useState('');
  const [licenseId, setLicenseId]             = useState('');
  const [hourlyRate, setHourlyRate]           = useState('');
  const [bio, setBio]                         = useState('');

  // UI state
  const [agreed, setAgreed]       = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');
  const [openModal, setOpenModal] = useState(null);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRoleChange = (role) => { setSelectedRole(role); setStep(1); setError(''); };

  // Password strength
  const getStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const strengthMeta = [null,
    { label: 'Weak',   color: '#ef4444' },
    { label: 'Fair',   color: '#f97316' },
    { label: 'Good',   color: '#eab308' },
    { label: 'Strong', color: '#22c55e' },
  ];
  const pStr = getStrength();

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) { setError('Please fill in all required fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError('Please agree to the Terms and Privacy Policy.'); return; }
    setError('');
    setIsLoading(true);
    try {
      const payload = {
        name, email, password, phone, role: selectedRole,
        ...(selectedRole === 'family'
          ? { relationship }
          : { specialization, experience_years: experienceYears, certification, license_id: licenseId, hourly_rate: hourlyRate, bio }
        ),
      };
      await register(payload);
      navigate(selectedRole === 'caregiver' ? '/caregiver/dashboard' : '/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="reg-root">

        {/* ══ LEFT: Hero Panel ══════════════════════════════════════════════ */}
        <div className="reg-hero-panel">
          <div className="reg-hero-content">
            <div className="reg-brand">
              <div className="reg-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
              <p><strong>10,000+</strong> families on FamilyCare</p>
            </div>
          </div>
          <div className="reg-circle reg-circle-1"></div>
          <div className="reg-circle reg-circle-2"></div>
          <div className="reg-circle reg-circle-3"></div>
        </div>

        {/* ══ RIGHT: Form Panel ════════════════════════════════════════════ */}
        <div className="reg-form-panel">
          <div className="reg-form-inner">

            {/* Header */}
            <div className="reg-form-header">
              <h1>Create your account</h1>
              <p>Fill in the details below to get started for free.</p>
            </div>

            {/* Role Toggle */}
            <div className="reg-role-toggle">
              {[
                { id: 'family',    label: 'Family Member', emoji: '👨‍👩‍👧' },
                { id: 'caregiver', label: 'Caregiver',     emoji: '🩺' },
              ].map(r => (
                <button key={r.id} type="button"
                  className={`reg-role-btn ${selectedRole === r.id ? 'active' : ''}`}
                  onClick={() => handleRoleChange(r.id)}
                >
                  <span>{r.emoji}</span>{r.label}
                </button>
              ))}
            </div>

            {/* Step Progress */}
            <div className="reg-steps">
              {[
                { n: 1, label: 'Account Info' },
                { n: 2, label: selectedRole === 'caregiver' ? 'Professional Details' : 'Family Details' },
              ].map((s, idx) => (
                <React.Fragment key={s.n}>
                  {idx > 0 && <div className={`reg-step-line ${step > 1 ? 'done' : ''}`}></div>}
                  <div className={`reg-step ${step >= s.n ? 'active' : ''} ${step > s.n ? 'done' : ''}`}>
                    <div className="reg-step-circle">
                      {step > s.n
                        ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : s.n
                      }
                    </div>
                    <span>{s.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="reg-error-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {/* ══ STEP 1: Account Info ══ */}
            {step === 1 && (
              <form onSubmit={handleStep1} className="reg-form slide-in">
                <div className="reg-field-grid">
                  <Field label="Full Name" required>
                    <Input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Jane Doe" required autoComplete="name" />
                  </Field>

                  <Field label="Email Address" required>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="jane@example.com" required autoComplete="email" />
                  </Field>

                  <Field label="Phone Number">
                    <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000" autoComplete="tel" />
                  </Field>

                  <Field label="Password" required>
                    <div className="rf-pw-wrap">
                      <Input type={showPassword ? 'text' : 'password'}
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Min. 8 characters" required autoComplete="new-password"
                        className="rf-input rf-pw-input"
                      />
                      <button type="button" className="rf-pw-toggle" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                        {showPassword
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    {password && (
                      <div className="rf-strength">
                        <div className="rf-strength-bars">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="rf-strength-bar"
                              style={{ background: i <= pStr ? strengthMeta[pStr]?.color : '#e2e8f0' }} />
                          ))}
                        </div>
                        <span style={{ color: strengthMeta[pStr]?.color, fontSize: '0.72rem', fontWeight: 600 }}>
                          {strengthMeta[pStr]?.label}
                        </span>
                      </div>
                    )}
                  </Field>
                </div>

                <button type="submit" className="reg-submit-btn">
                  Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </form>
            )}

            {/* ══ STEP 2: Role-specific Details ══ */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="reg-form slide-in">

                {/* ── FAMILY MEMBER ── */}
                {selectedRole === 'family' && (
                  <div className="s2-card">
                    <div className="s2-card-header">
                      <div className="s2-card-icon s2-icon-family">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <div>
                        <h3>Family Details</h3>
                        <p>Tell us about your connection to the person receiving care.</p>
                      </div>
                    </div>

                    <Field label="Your relationship to the senior" required>
                      <Select value={relationship} onChange={e => setRelationship(e.target.value)} required>
                        <option value="" disabled>Select your relationship…</option>
                        <option value="son">Son</option>
                        <option value="daughter">Daughter</option>
                        <option value="spouse">Spouse / Partner</option>
                        <option value="sibling">Sibling</option>
                        <option value="grandchild">Grandchild</option>
                        <option value="parent">Parent</option>
                        <option value="friend">Close Friend</option>
                        <option value="other">Other</option>
                      </Select>
                    </Field>
                  </div>
                )}

                {/* ── CAREGIVER ── */}
                {selectedRole === 'caregiver' && (
                  <div className="s2-card">
                    <div className="s2-card-header">
                      <div className="s2-card-icon s2-icon-caregiver">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </div>
                      <div>
                        <h3>Professional Credentials</h3>
                        <p>These details help families find and trust you as a caregiver.</p>
                      </div>
                    </div>

                    <div className="s2-grid">
                      <Field label="Specialization" required>
                        <Select value={specialization} onChange={e => setSpecialization(e.target.value)} required>
                          <option value="" disabled>Choose specialization…</option>
                          <option value="Elder Care">Elder Care</option>
                          <option value="Dementia Care">Dementia / Alzheimer's Care</option>
                          <option value="Post-Surgical Care">Post-Surgical Recovery</option>
                          <option value="Palliative Care">Palliative / End-of-Life Care</option>
                          <option value="Physical Therapy Assist">Physical Therapy Assist</option>
                          <option value="Medication Management">Medication Management</option>
                          <option value="General Home Care">General Home Care</option>
                        </Select>
                      </Field>

                      <Field label="Certification / License Type" required>
                        <Select value={certification} onChange={e => setCertification(e.target.value)} required>
                          <option value="" disabled>Choose certification…</option>
                          <option value="CNA">CNA — Certified Nursing Assistant</option>
                          <option value="LPN">LPN — Licensed Practical Nurse</option>
                          <option value="RN">RN — Registered Nurse</option>
                          <option value="HHA">HHA — Home Health Aide</option>
                          <option value="PCA">PCA — Personal Care Aide</option>
                          <option value="BSN">BSN — Bachelor of Science in Nursing</option>
                          <option value="Other">Other</option>
                        </Select>
                      </Field>

                      <Field label="Years of Experience" required>
                        <Select value={experienceYears} onChange={e => setExperienceYears(e.target.value)} required>
                          <option value="" disabled>Select experience…</option>
                          <option value="Less than 1 year">Less than 1 year</option>
                          <option value="1-3 years">1–3 years</option>
                          <option value="3-5 years">3–5 years</option>
                          <option value="5-10 years">5–10 years</option>
                          <option value="10+ years">10+ years</option>
                        </Select>
                      </Field>

                      <Field label="Hourly Rate" optional>
                        <PrefixInput prefix="$" type="number" value={hourlyRate}
                          onChange={e => setHourlyRate(e.target.value)}
                          placeholder="0.00" min="0" step="0.01" />
                      </Field>

                      <Field label="License / ID Number" optional>
                        <Input type="text" value={licenseId}
                          onChange={e => setLicenseId(e.target.value)}
                          placeholder="e.g. CNA-123456" />
                      </Field>
                    </div>

                    <Field label="Professional Bio" optional>
                      <Textarea value={bio} onChange={e => setBio(e.target.value)}
                        placeholder="Briefly describe your experience, care approach, and why families can trust you…"
                        rows={3}
                      />
                    </Field>
                  </div>
                )}

                {/* Account Summary */}
                <div className="s2-summary">
                  <div className="s2-summary-label">Account Preview</div>
                  <div className="s2-summary-grid">
                    <div className="s2-summary-item">
                      <span>Name</span>
                      <strong>{name}</strong>
                    </div>
                    <div className="s2-summary-item">
                      <span>Email</span>
                      <strong>{email}</strong>
                    </div>
                    {phone && (
                      <div className="s2-summary-item">
                        <span>Phone</span>
                        <strong>{phone}</strong>
                      </div>
                    )}
                    <div className="s2-summary-item">
                      <span>Role</span>
                      <strong className={`s2-role-pill ${selectedRole}`}>
                        {selectedRole === 'family' ? '👨‍👩‍👧 Family Member' : '🩺 Caregiver'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <label className="s2-terms">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="s2-checkbox" />
                  <span>
                    I agree to the{' '}
                    <button type="button" className="s2-link" onClick={() => setOpenModal('terms')}>Terms of Service</button>
                    {' '}and{' '}
                    <button type="button" className="s2-link" onClick={() => setOpenModal('privacy')}>Privacy Policy</button>
                    {selectedRole === 'caregiver' ? ', including HIPAA compliance and admin review before activation.' : '.'}
                  </span>
                </label>

                {/* Action Buttons */}
                <div className="s2-actions">
                  <button type="button" className="s2-back-btn" onClick={() => { setStep(1); setError(''); }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Back
                  </button>
                  <button type="submit" className="s2-submit-btn" disabled={isLoading}>
                    {isLoading
                      ? <><span className="s2-spinner"></span> Creating…</>
                      : selectedRole === 'caregiver' ? 'Submit Application' : 'Create Account'
                    }
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
