import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import nurseImage from '../../../assets/about/nurse_holding_hands.png';
import './Register.css';

const TEAL = '#0d9488';

const MODAL_CONTENT = {
  terms: {
    title: 'Terms of Service',
    sections: [
      { heading: '1. Acceptance of Terms', body: 'By creating an account and using FamilyCare, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.' },
      { heading: '2. Description of Service', body: 'FamilyCare provides a platform that connects family members with professional caregivers to facilitate remote monitoring and coordination of care for elderly or dependent individuals.' },
      { heading: '3. User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access. You must provide accurate and complete information during registration.' },
      { heading: '4. Caregiver Verification', body: 'Caregiver accounts are subject to additional verification before activation. FamilyCare reserves the right to revoke caregiver access if provided credentials or certifications are found to be invalid.' },
      { heading: '5. Prohibited Conduct', body: 'You agree not to misuse the platform, share false information, attempt unauthorized access to other accounts, or use the service for any unlawful purpose.' },
      { heading: '6. Limitation of Liability', body: 'FamilyCare is a coordination platform and does not directly provide medical care. We are not liable for the actions of caregivers or the outcomes of care arrangements facilitated through our platform.' },
      { heading: '7. Modifications', body: 'We reserve the right to update these Terms at any time. Continued use of the platform after changes are posted constitutes your acceptance of the revised Terms.' },
      { heading: '8. Governing Law', body: 'These Terms shall be governed by applicable federal and state laws, including all relevant healthcare regulations.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: '1. Information We Collect', body: 'We collect personal information you provide during registration (name, email, phone, role), usage data, and health-related information shared through the platform to facilitate care coordination.' },
      { heading: '2. HIPAA Compliance', body: 'FamilyCare handles Protected Health Information (PHI) in accordance with the Health Insurance Portability and Accountability Act (HIPAA). We implement administrative, physical, and technical safeguards to protect the privacy and security of health information.' },
      { heading: '3. How We Use Your Information', body: 'Your information is used to operate the platform, connect family members with caregivers, send notifications, improve our services, and comply with legal obligations. We do not sell your personal data.' },
      { heading: '4. Information Sharing', body: 'We share information only with the parties you authorize (e.g., caregivers you connect with), service providers who assist our operations under strict confidentiality agreements, and authorities when required by law.' },
      { heading: '5. Data Security', body: 'We use industry-standard encryption (TLS in transit, AES-256 at rest), access controls, and regular security audits to protect your data against unauthorized access or disclosure.' },
      { heading: '6. Your Rights', body: 'You have the right to access, correct, or delete your personal information. You may also opt out of non-essential communications. To exercise these rights, contact our Privacy Officer at privacy@familycare.com.' },
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
          <button className="reg-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="reg-modal-body">
          <p style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: 0, marginBottom: '1rem' }}>Last updated: January 1, 2026</p>
          {content.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.83rem', fontWeight: '600', color: '#1a202c', margin: '0 0 4px 0' }}>{s.heading}</h4>
              <p style={{ fontSize: '0.79rem', color: '#4A5568', lineHeight: 1.65, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
        <div className="reg-modal-footer">
          <button className="reg-modal-ok-btn" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  const [selectedRole, setSelectedRole] = useState('family');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError('Please agree to the Terms of Service and Privacy Policy.'); return; }
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

  return (
    <>
      <div className="register-page-container">
        <div className="register-card">

          {/* ── LEFT PANEL (FORM) ── */}
          <div className="register-left">
            <div className="register-top-arc" />
            <h2 className="register-header-text">CREATE ACCOUNT</h2>

            {/* Role Tabs */}
            <div className="reg-role-tabs">
              {[{ id: 'family', label: 'Family Member' }, { id: 'caregiver', label: 'Caregiver' }].map(role => (
                <button
                  key={role.id}
                  type="button"
                  className={`reg-role-tab ${selectedRole === role.id ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  {role.label}
                </button>
              ))}
            </div>

            {/* Role info banner */}
            <div className={`reg-info-banner ${selectedRole}`}>
              {selectedRole === 'family' ? (
                <><span>✓</span><span>As a Family Member you can monitor and stay connected with your loved ones.</span></>
              ) : (
                <><span>⚠</span><span>Caregiver accounts require additional verification before activation.</span></>
              )}
            </div>

            {/* Error banner */}
            {error && <div className="reg-error-banner">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Row 1: Name + Email */}
              <div className="reg-form-row">
                <div className="reg-form-group">
                  <label className="reg-label">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" required className="reg-input" />
                </div>
                <div className="reg-form-group">
                  <label className="reg-label">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" required className="reg-input" />
                </div>
              </div>

              {/* Row 2: Phone + Password */}
              <div className="reg-form-row">
                <div className="reg-form-group">
                  <label className="reg-label">Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="reg-input" />
                </div>
                <div className="reg-form-group">
                  <label className="reg-label">Password</label>
                  <div className="reg-pwd-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Create a password" required
                      className="reg-input" style={{ paddingRight: '2.5rem' }}
                    />
                    <button type="button" className="reg-pwd-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Family-specific */}
              {selectedRole === 'family' && (
                <div className="reg-form-group">
                  <label className="reg-label">Relationship to Senior</label>
                  <select value={relationship} onChange={e => setRelationship(e.target.value)} required className="reg-select">
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

              {/* Caregiver-specific */}
              {selectedRole === 'caregiver' && (
                <>
                  <div className="reg-form-row">
                    <div className="reg-form-group">
                      <label className="reg-label">Years of Experience</label>
                      <select value={experience} onChange={e => setExperience(e.target.value)} required className="reg-select">
                        <option value="" disabled>Select experience...</option>
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1–3 years</option>
                        <option value="3-5">3–5 years</option>
                        <option value="5-10">5–10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                    <div className="reg-form-group">
                      <label className="reg-label">Certification</label>
                      <select value={certification} onChange={e => setCertification(e.target.value)} required className="reg-select">
                        <option value="" disabled>Select certification...</option>
                        <option value="CNA">CNA</option>
                        <option value="LPN">LPN</option>
                        <option value="RN">RN</option>
                        <option value="HHA">HHA</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="reg-form-group">
                    <label className="reg-label">License / ID Number <span className="reg-label-optional">(optional)</span></label>
                    <input type="text" value={licenseId} onChange={e => setLicenseId(e.target.value)} placeholder="e.g. CNA-123456" className="reg-input" />
                  </div>
                </>
              )}

              {/* Terms checkbox */}
              <div className="reg-terms-row">
                <input type="checkbox" id="agreed" className="reg-checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <label htmlFor="agreed" className="reg-terms-label">
                  I agree to the{' '}
                  <a href="#" className="reg-terms-link" onClick={e => { e.preventDefault(); setOpenModal('terms'); }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="reg-terms-link" onClick={e => { e.preventDefault(); setOpenModal('privacy'); }}>Privacy Policy</a>
                  , including HIPAA compliance standards.
                </label>
              </div>

              {/* Submit */}
              <button type="submit" className="reg-btn" disabled={isLoading}>
                {isLoading ? 'Creating account...' : selectedRole === 'caregiver' ? 'CREATE CAREGIVER ACCOUNT' : 'CREATE FAMILY ACCOUNT'}
              </button>
            </form>

            <p className="reg-footer" style={{ marginTop: '0.75rem' }}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>

          {/* ── RIGHT PANEL (BANNER) ── */}
          <div className="register-right">
            <div className="register-right-title">JOIN US,</div>
            <div className="register-right-subtitle">START CARING SMARTER</div>

            <img src={nurseImage} alt="Care illustration" className="register-right-image" />

            <div className="register-signin-footer">
              <span className="register-signin-text">Already have an account?</span>
              <Link to="/login" className="register-signin-link">Sign In</Link>
            </div>
          </div>

        </div>
      </div>

      {openModal && <LegalModal type={openModal} onClose={() => setOpenModal(null)} />}
    </>
  );
};

export default Register;
