import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Mail, Lock, Eye, EyeOff, User, Phone, ShieldCheck, Heart, 
  Stethoscope, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, 
  Briefcase, Award, DollarSign, FileText, Sparkles, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import GoogleSignInButton from './GoogleSignInButton';
import familyHeroImg from '../../assets/auth_family_hero.png';
import caregiverHeroImg from '../../assets/auth_caregiver_hero.png';
import api from '../../services/api';
import './AuthModal.css';

const RELATIONSHIP_OPTIONS = [
  'Son',
  'Daughter',
  'Grandchild',
  'Spouse / Partner',
  'Sibling',
  'Guardian',
  'Other Family Member'
];

const SPECIALIZATION_OPTIONS = [
  'General Elder Care',
  'Dementia & Alzheimer\'s Care',
  'Post-Surgery Recovery',
  'Mobility Assistance',
  'Palliative & Hospice Care',
  'Medication Management',
  'Companionship & Daily Aid'
];

const AuthModal = () => {
  const { isOpen, mode, role, setMode, setRole, closeAuthModal } = useAuthModal();
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Common form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Family specific
  const [relationship, setRelationship] = useState('Son');

  // Caregiver specific
  const [step, setStep] = useState(1); // 1: Account, 2: Qualifications
  const [specialization, setSpecialization] = useState('General Elder Care');
  const [experienceYears, setExperienceYears] = useState('3');
  const [hourlyRate, setHourlyRate] = useState('25');
  const [certification, setCertification] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [bio, setBio] = useState('');

  // 2FA state
  const [tfaRequired, setTfaRequired] = useState(false);
  const [tfaPartialToken, setTfaPartialToken] = useState('');
  const [tfaOtp, setTfaOtp] = useState('');

  // Forgot password state
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Status state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Reset form whenever modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setError('');
      setLoading(false);
      setTfaRequired(false);
      setTfaOtp('');
      setForgotSent(false);
      setStep(1);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const redirectByRole = (userRole) => {
    closeAuthModal();
    if (userRole === 'admin') navigate('/admin/dashboard');
    else if (userRole === 'caregiver') navigate('/caregiver/dashboard');
    else navigate('/dashboard');
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#e2e8f0' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: '#ef4444' };
      case 2:
        return { score: 50, label: 'Fair', color: '#f59e0b' };
      case 3:
        return { score: 75, label: 'Good', color: '#3b82f6' };
      case 4:
        return { score: 100, label: 'Strong', color: '#10b981' };
      default:
        return { score: 0, label: '', color: '#e2e8f0' };
    }
  };

  const strength = getPasswordStrength(password);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password, role);
      redirectByRole(data.role);
    } catch (err) {
      const resp = err?.response?.data;
      if (resp?.tfa_required) {
        setTfaPartialToken(resp.partial_token);
        setTfaRequired(true);
        setLoading(false);
        return;
      }
      setError(resp?.error || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA Validate
  const handleTfaSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/2fa/validate', {
        partial_token: tfaPartialToken,
        token: tfaOtp,
      });
      localStorage.setItem('token', data.token);
      redirectByRole(data.role);
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid 2FA code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // If caregiver and on step 1, proceed to step 2
    if (role === 'caregiver' && step === 1) {
      if (!name || !email || !password) {
        setError('Please complete all required fields.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      setStep(2);
      return;
    }

    if (!agreedToTerms) {
      setError('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role: role === 'caregiver' ? 'caregiver' : 'family',
        relationship: role === 'family' ? relationship : undefined,
        specialization: role === 'caregiver' ? specialization : undefined,
        experience_years: role === 'caregiver' ? parseInt(experienceYears, 10) || 0 : undefined,
        hourly_rate: role === 'caregiver' ? parseFloat(hourlyRate) || 25 : undefined,
        certification: role === 'caregiver' ? certification : undefined,
        license_id: role === 'caregiver' ? licenseId : undefined,
        bio: role === 'caregiver' ? bio : undefined,
      };

      const data = await register(payload);
      redirectByRole(data.user?.role || role);
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In & Sign-Up Success
  const handleGoogleSuccess = async (googlePayload) => {
    setError('');
    setLoading(true);
    try {
      const data = await googleLogin({
        ...googlePayload,
        relationship: role === 'family' ? relationship : undefined,
        specialization: role === 'caregiver' ? specialization : undefined,
        experience_years: role === 'caregiver' ? parseInt(experienceYears, 10) || 0 : undefined,
        hourly_rate: role === 'caregiver' ? parseFloat(hourlyRate) || 25 : undefined,
        certification: role === 'caregiver' ? certification : undefined,
        license_id: role === 'caregiver' ? licenseId : undefined,
        bio: role === 'caregiver' ? bio : undefined,
      });
      closeAuthModal();
      redirectByRole(data.role);
    } catch (err) {
      setError(err?.response?.data?.error || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setForgotLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setForgotSent(true);
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not send reset link. Please check the email address.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div 
        className={`auth-modal-card ${mode === 'register' && role === 'caregiver' && step === 2 ? 'auth-modal--wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button 
          className="auth-modal-close" 
          onClick={closeAuthModal} 
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* ── LEFT HERO SIDEBAR ── */}
        <div className="auth-modal-hero">
          {/* Dynamic Background Image with Smooth Gradient Overlay */}
          <div className="auth-hero-img-container">
            <img 
              src={role === 'family' ? familyHeroImg : caregiverHeroImg} 
              alt={role === 'family' ? "Family Care" : "Caregiver Support"}
              className="auth-hero-bg-img"
            />
            <div className="auth-hero-overlay"></div>
          </div>
          
          <div className="auth-hero-header">
            <div className="auth-hero-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 21C12 21 3 14 3 8.5C3 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14 14 21 12 21Z" fill="#00C9B5"/>
              </svg>
            </div>
            <span className="auth-hero-brand">FamilyCare</span>
          </div>

          <div className="auth-hero-body">
            <div className="auth-hero-pill">
              <span className="auth-hero-dot"></span>
              {role === 'family' ? 'Family Portal' : 'Caregiver Network'}
            </div>

            <h2 className="auth-hero-title">
              {role === 'family' ? (
                <>Caring for your loved ones, <span className="highlight-teal">anywhere in the world.</span></>
              ) : (
                <>Empower your caregiving career <span className="highlight-teal">with trusted families.</span></>
              )}
            </h2>

            <p className="auth-hero-desc">
              {role === 'family'
                ? 'Join thousands of families monitoring vitals, managing medication, and coordinating verified care in real-time.'
                : 'Manage patient care plans, log real-time vitals, and connect seamlessly with verified families.'}
            </p>

            {/* Floating Glassmorphic Trust Card */}
            <div className="auth-hero-trust-badge">
              <div className="auth-trust-avatar-group">
                <div className="auth-trust-dot"></div>
                <ShieldCheck size={18} />
              </div>
              <div className="auth-trust-text">
                <strong>HIPAA & 256-Bit Encrypted</strong>
                <span>Verified medical-grade care network</span>
              </div>
            </div>
          </div>

          {/* Social Proof Metric */}
          <div className="auth-hero-footer">
            <div className="auth-stat-item">
              <strong>5,000+</strong>
              <span>Families</span>
            </div>
            <div className="auth-stat-divider"></div>
            <div className="auth-stat-item">
              <strong>4.95★</strong>
              <span>Rating</span>
            </div>
            <div className="auth-stat-divider"></div>
            <div className="auth-stat-item">
              <strong>100%</strong>
              <span>Secure</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT AUTH CONTENT PANEL ── */}
        <div className="auth-modal-content">
          
          {/* TOP MODE TOGGLE (Sign In vs Create Account) */}
          {mode !== 'forgot_password' && !tfaRequired && (
            <div className="auth-mode-tabs">
              <button 
                type="button"
                className={`auth-mode-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setError(''); }}
              >
                Sign In
              </button>
              <button 
                type="button"
                className={`auth-mode-tab ${mode === 'register' ? 'active' : ''}`}
                onClick={() => { setMode('register'); setError(''); }}
              >
                Create Account
              </button>
            </div>
          )}

          {/* ROLE SELECTOR PILL */}
          {mode !== 'forgot_password' && !tfaRequired && (
            <div className="auth-role-segmented">
              <button
                type="button"
                className={`auth-role-btn ${role === 'family' ? 'active' : ''}`}
                onClick={() => { setRole('family'); setStep(1); setError(''); }}
              >
                <Heart size={16} />
                <span>Family Member</span>
              </button>
              <button
                type="button"
                className={`auth-role-btn ${role === 'caregiver' ? 'active' : ''}`}
                onClick={() => { setRole('caregiver'); setStep(1); setError(''); }}
              >
                <Stethoscope size={16} />
                <span>Caregiver</span>
              </button>
            </div>
          )}

          {/* ERROR ALERT BOX */}
          {error && (
            <div className="auth-error-banner">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ════════════════════════════════════════════
             VIEW 1: TWO FACTOR AUTHENTICATION (2FA)
             ════════════════════════════════════════════ */}
          {tfaRequired ? (
            <form onSubmit={handleTfaSubmit} className="auth-form-wrapper">
              <div className="auth-heading">
                <h3>Two-Factor Authentication</h3>
                <p>Enter the 6-digit verification code from your authenticator app.</p>
              </div>

              <div className="auth-input-group">
                <label>Security Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={tfaOtp}
                  onChange={e => setTfaOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  className="auth-input auth-input--otp"
                  autoFocus
                  required
                />
              </div>

              <button 
                type="submit" 
                className="auth-primary-btn"
                disabled={loading || tfaOtp.length < 6}
              >
                {loading ? <span className="auth-btn-spinner" /> : 'Verify & Continue'}
              </button>

              <button 
                type="button" 
                className="auth-ghost-btn"
                onClick={() => { setTfaRequired(false); setTfaOtp(''); setError(''); }}
              >
                <ArrowLeft size={15} /> Back to Sign In
              </button>
            </form>
          ) : mode === 'forgot_password' ? (
            /* ════════════════════════════════════════════
               VIEW 2: FORGOT PASSWORD
               ════════════════════════════════════════════ */
            <div className="auth-form-wrapper">
              {forgotSent ? (
                <div className="auth-forgot-success">
                  <div className="auth-success-badge">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3>Check your inbox</h3>
                  <p>We’ve sent password recovery instructions to <strong>{email}</strong>.</p>
                  <button 
                    type="button" 
                    className="auth-primary-btn" 
                    onClick={() => { setMode('login'); setForgotSent(false); }}
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <div className="auth-heading">
                    <h3>Reset your password</h3>
                    <p>Enter your account email and we'll send you a secure recovery link.</p>
                  </div>

                  <div className="auth-input-group">
                    <label>Email Address</label>
                    <div className="auth-input-box">
                      <Mail size={17} className="auth-input-icon" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="auth-input"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="auth-primary-btn"
                    disabled={forgotLoading || !email}
                  >
                    {forgotLoading ? <span className="auth-btn-spinner" /> : 'Send Recovery Link'}
                  </button>

                  <button 
                    type="button" 
                    className="auth-ghost-btn"
                    onClick={() => { setMode('login'); setError(''); }}
                  >
                    <ArrowLeft size={15} /> Back to Sign In
                  </button>
                </form>
              )}
            </div>
          ) : mode === 'login' ? (
            /* ════════════════════════════════════════════
               VIEW 3: SIGN IN FORM
               ════════════════════════════════════════════ */
            <form onSubmit={handleLoginSubmit} className="auth-form-wrapper">
              
              {/* Google Sign In */}
              <GoogleSignInButton 
                mode="login"
                role={role}
                onSuccess={handleGoogleSuccess}
                onError={(msg) => setError(msg)}
              />

              <div className="auth-divider">
                <span>or continue with email</span>
              </div>

              {/* Email Field */}
              <div className="auth-input-group">
                <label>Email Address</label>
                <div className="auth-input-box">
                  <Mail size={17} className="auth-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="auth-input"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label>Password</label>
                  <button 
                    type="button" 
                    className="auth-forgot-link"
                    onClick={() => setMode('forgot_password')}
                  >
                    Forgot?
                  </button>
                </div>
                <div className="auth-input-box">
                  <Lock size={17} className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="auth-input"
                    required
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="auth-options-row">
                <label className="auth-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={e => setRememberMe(e.target.checked)} 
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit" 
                className="auth-primary-btn"
                disabled={loading}
              >
                {loading ? <span className="auth-btn-spinner" /> : (
                  <>Sign In to {role === 'family' ? 'Family Account' : 'Caregiver Account'} <ArrowRight size={17} /></>
                )}
              </button>

              <div className="auth-switch-footer">
                <span>Don't have an account?</span>
                <button 
                  type="button" 
                  className="auth-switch-link"
                  onClick={() => { setMode('register'); setError(''); }}
                >
                  Create one now
                </button>
              </div>

            </form>
          ) : (
            /* ════════════════════════════════════════════
               VIEW 4: CREATE ACCOUNT (REGISTER)
               ════════════════════════════════════════════ */
            <form onSubmit={handleRegisterSubmit} className="auth-form-wrapper">
              
              {/* Multi-step progress indicator for caregiver */}
              {role === 'caregiver' && (
                <div className="auth-steps-header">
                  <div className={`auth-step-bubble ${step === 1 ? 'active' : 'completed'}`}>
                    {step > 1 ? <Check size={12} /> : '1'}
                  </div>
                  <span className={`auth-step-label ${step === 1 ? 'active' : ''}`}>Account Basics</span>
                  <div className="auth-step-line"></div>
                  <div className={`auth-step-bubble ${step === 2 ? 'active' : ''}`}>2</div>
                  <span className={`auth-step-label ${step === 2 ? 'active' : ''}`}>Care Profile</span>
                </div>
              )}

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <>
                  {/* Google Sign Up */}
                  <GoogleSignInButton 
                    mode="register"
                    role={role}
                    onSuccess={handleGoogleSuccess}
                    onError={(msg) => setError(msg)}
                  />

                  <div className="auth-divider">
                    <span>or sign up with details</span>
                  </div>

                  {/* Name */}
                  <div className="auth-input-group">
                    <label>Full Name</label>
                    <div className="auth-input-box">
                      <User size={17} className="auth-input-icon" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Sarah Mitchell"
                        className="auth-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone grid */}
                  <div className="auth-input-row">
                    <div className="auth-input-group">
                      <label>Email Address</label>
                      <div className="auth-input-box">
                        <Mail size={17} className="auth-input-icon" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="auth-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label>Phone Number</label>
                      <div className="auth-input-box">
                        <Phone size={17} className="auth-input-icon" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="auth-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="auth-input-group">
                    <label>Create Password</label>
                    <div className="auth-input-box">
                      <Lock size={17} className="auth-input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="auth-input"
                        required
                      />
                      <button 
                        type="button" 
                        className="auth-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {password && (
                      <div className="auth-strength-meter">
                        <div className="auth-strength-track">
                          <div 
                            className="auth-strength-fill" 
                            style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
                          />
                        </div>
                        <span style={{ color: strength.color }}>{strength.label}</span>
                      </div>
                    )}
                  </div>

                  {/* Family Relationship */}
                  {role === 'family' && (
                    <div className="auth-input-group">
                      <label>Relationship to Elder</label>
                      <div className="auth-input-box">
                        <select 
                          value={relationship} 
                          onChange={e => setRelationship(e.target.value)}
                          className="auth-input auth-select"
                        >
                          {RELATIONSHIP_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Terms for Family */}
                  {role === 'family' && (
                    <div className="auth-terms-box">
                      <label className="auth-checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={agreedToTerms} 
                          onChange={e => setAgreedToTerms(e.target.checked)} 
                        />
                        <span>I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.</span>
                      </label>
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Caregiver Professional Profile */}
              {role === 'caregiver' && step === 2 && (
                <div className="auth-caregiver-step2">
                  <div className="auth-input-row">
                    <div className="auth-input-group">
                      <label>Primary Specialization</label>
                      <div className="auth-input-box">
                        <Briefcase size={17} className="auth-input-icon" />
                        <select 
                          value={specialization} 
                          onChange={e => setSpecialization(e.target.value)}
                          className="auth-input auth-select"
                        >
                          {SPECIALIZATION_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label>Years of Experience</label>
                      <div className="auth-input-box">
                        <Award size={17} className="auth-input-icon" />
                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={experienceYears}
                          onChange={e => setExperienceYears(e.target.value)}
                          className="auth-input"
                          placeholder="e.g. 5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="auth-input-row">
                    <div className="auth-input-group">
                      <label>Hourly Rate ($/hr)</label>
                      <div className="auth-input-box">
                        <DollarSign size={17} className="auth-input-icon" />
                        <input
                          type="number"
                          min="10"
                          max="200"
                          value={hourlyRate}
                          onChange={e => setHourlyRate(e.target.value)}
                          className="auth-input"
                          placeholder="25"
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label>Certification / License</label>
                      <div className="auth-input-box">
                        <FileText size={17} className="auth-input-icon" />
                        <input
                          type="text"
                          value={certification}
                          onChange={e => setCertification(e.target.value)}
                          className="auth-input"
                          placeholder="CNA, HHA, RN, CPR"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label>Professional Bio (Brief Introduction)</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Passionate caregiver dedicated to providing compassionate, dignified elder care..."
                      className="auth-textarea"
                    />
                  </div>

                  <div className="auth-terms-box">
                    <label className="auth-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={agreedToTerms} 
                        onChange={e => setAgreedToTerms(e.target.checked)} 
                      />
                      <span>I agree to the <strong>Caregiver Code of Conduct</strong> and verification terms.</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="auth-actions-group">
                {role === 'caregiver' && step === 2 && (
                  <button 
                    type="button" 
                    className="auth-secondary-btn"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                )}

                <button 
                  type="submit" 
                  className="auth-primary-btn"
                  disabled={loading}
                >
                  {loading ? <span className="auth-btn-spinner" /> : (
                    role === 'caregiver' && step === 1 ? (
                      <>Continue to Profile <ArrowRight size={17} /></>
                    ) : (
                      <>Create {role === 'family' ? 'Family' : 'Caregiver'} Account <ArrowRight size={17} /></>
                    )
                  )}
                </button>
              </div>

              <div className="auth-switch-footer">
                <span>Already have an account?</span>
                <button 
                  type="button" 
                  className="auth-switch-link"
                  onClick={() => { setMode('login'); setError(''); }}
                >
                  Sign in here
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
