import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Heart, 
  Activity, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Users, 
  Clock, 
  Award, 
  Lock, 
  Stethoscope, 
  Eye, 
  PhoneCall,
  Sparkles
} from 'lucide-react';
import Footer from '../../../components/Landing/Footer';
import './About.css';

import elderlyWomanImg   from '../../../assets/about/elderly_woman_tablet.png';
import nurseHandsImg     from '../../../assets/about/nurse_holding_hands.png';
import sarahChenImg      from '../../../assets/about/sarah_chen.png';
import marcusThorneImg   from '../../../assets/about/marcus_thorne.png';
import elenaRodriguezImg from '../../../assets/about/elena_rodriguez.png';

const team = [
  {
    img: sarahChenImg,
    name: 'Sarah Chen',
    role: 'Chief Executive Officer',
    badge: 'Co-Founder & Tech Leader',
    bio: 'Dedicated to revolutionizing eldercare through human-centered technology and transparent family workflows.',
    specialty: 'Healthcare Operations & Product Strategy'
  },
  {
    img: marcusThorneImg,
    name: 'Dr. Marcus Thorne',
    role: 'Chief Medical Officer',
    badge: 'Board-Certified Geriatrician',
    bio: 'Ensuring our platform adheres to the highest clinical benchmarks, safe medical protocols, and preventative wellness.',
    specialty: 'Geriatric Care & Clinical Safety'
  },
  {
    img: elenaRodriguezImg,
    name: 'Elena Rodriguez',
    role: 'Head of Caregiver Network',
    badge: 'Senior Care Specialist',
    bio: 'Over 14 years of hands-on senior care management, focusing on caregiver vetting, training, and empathetic support.',
    specialty: 'Caregiver Vetting & Quality Assurance'
  },
];

const values = [
  {
    icon: Heart,
    colorClass: 'teal',
    title: 'Empathy at the Core',
    desc: 'Every elder deserves respect, gentle patience, and warmth. We treat your parents with the exact devotion we give our own.'
  },
  {
    icon: Shield,
    colorClass: 'blue',
    title: 'Uncompromising Safety',
    desc: 'Every caregiver undergoes strict multi-tier background checks, credential validation, and admin manual approvals.'
  },
  {
    icon: Eye,
    colorClass: 'indigo',
    title: 'Total Family Transparency',
    desc: 'Never wonder how your parent is doing. Access live vitals, daily meal logs, medication records, and mood updates anytime.'
  },
  {
    icon: Activity,
    colorClass: 'emerald',
    title: 'Clinical Rigor & Speed',
    desc: 'Equipped with smart anomaly detection and rapid alerts so potential health concerns are addressed before becoming emergencies.'
  }
];

const stats = [
  { value: '2,400+', label: 'Families Supported', sub: 'Across 45+ regions' },
  { value: '99.4%',  label: 'Positive Care Satisfaction', sub: 'Verified family reviews' },
  { value: '150+',   label: 'Certified Care Specialists', sub: '100% background vetted' },
  { value: '< 15m',  label: 'Urgent Alert Response Time', sub: '24/7 dedicated support' }
];

const About = () => {
  return (
    <div className="about-page">
      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="ab-hero">
        <div className="ab-container">
          <div className="ab-hero-grid">
            <div className="ab-hero-content">
              <div className="ab-trust-pill">
                <span className="ab-pill-dot" />
                <Sparkles size={14} className="ab-pill-icon" />
                <span>Our Story & Mission</span>
              </div>

              <h1 className="ab-hero-title">
                Bridging the Distance with{' '}
                <span className="ab-title-accent">Empathy & Tech.</span>
              </h1>

              <p className="ab-hero-subtitle">
                Distance should never compromise parental care. FamilyCare was created to 
                give families peace of mind through certified caregiver matching, 
                real-time health monitoring, and seamless connection.
              </p>

              <div className="ab-hero-actions">
                <Link to="/caregivers" className="ab-btn-primary">
                  <span>Browse Caregivers</span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/features" className="ab-btn-secondary">
                  <span>Explore Platform</span>
                </Link>
              </div>

              <div className="ab-hero-badges-row">
                <div className="ab-hero-chip">
                  <Shield size={16} className="ab-chip-icon" />
                  <span>100% Verified Specialists</span>
                </div>
                <div className="ab-hero-chip">
                  <Lock size={16} className="ab-chip-icon" />
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>

            <div className="ab-hero-visual">
              <div className="ab-hero-img-card">
                <img 
                  src={elderlyWomanImg} 
                  alt="Senior resident using connected tablet" 
                  className="ab-hero-main-img" 
                />
                
                {/* Floating Social Proof Badge */}
                <div className="ab-float-badge top-right">
                  <div className="ab-badge-star-icon">
                    <Star size={18} fill="#F59E0B" color="#F59E0B" />
                  </div>
                  <div>
                    <div className="ab-badge-val">4.9 / 5.0 Rating</div>
                    <div className="ab-badge-lbl">Trusted by 2,400+ Families</div>
                  </div>
                </div>

                {/* Floating Health Status Badge */}
                <div className="ab-float-badge bottom-left">
                  <div className="ab-badge-pulse-icon">
                    <Activity size={18} color="#00A896" />
                  </div>
                  <div>
                    <div className="ab-badge-status-row">
                      <span className="ab-status-dot-active" />
                      <span className="ab-badge-val">Live Care Feed</span>
                    </div>
                    <div className="ab-badge-lbl">Daily vitals & meds verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <section className="ab-stats-section">
        <div className="ab-container">
          <div className="ab-stats-card">
            <div className="ab-stats-grid">
              {stats.map((s, idx) => (
                <div className="ab-stat-item" key={idx}>
                  <div className="ab-stat-num">{s.value}</div>
                  <div className="ab-stat-label">{s.label}</div>
                  <div className="ab-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ORIGIN STORY SECTION ─────────────────────────────────────── */}
      <section className="ab-story-section">
        <div className="ab-container">
          <div className="ab-section-header">
            <span className="ab-section-tag">Why We Started</span>
            <h2 className="ab-section-title">The Problem We Set Out to Solve</h2>
            <p className="ab-section-desc">
              Every day, millions of adult children worry about aging parents living miles away. 
              We built FamilyCare to replace uncertainty with continuous care and confidence.
            </p>
          </div>

          <div className="ab-story-grid">
            <div className="ab-story-card challenge">
              <div className="ab-story-card-top">
                <span className="ab-story-badge red">The Challenge</span>
                <h3>The Anxiety of Distance & Fragmentation</h3>
              </div>
              <p className="ab-story-card-p">
                When you live in another city or have demanding work hours, checking on your loved ones 
                becomes a series of brief phone calls and endless questions:
              </p>
              <ul className="ab-story-list">
                <li>
                  <span className="ab-list-cross">✕</span>
                  <div>
                    <strong>Uncertain Daily Routines:</strong> Did they take their morning medications? Was their blood pressure within a healthy range?
                  </div>
                </li>
                <li>
                  <span className="ab-list-cross">✕</span>
                  <div>
                    <strong>Fragmented Updates:</strong> Text messages, paper notes, and uncoordinated care make tracking health trends difficult.
                  </div>
                </li>
                <li>
                  <span className="ab-list-cross">✕</span>
                  <div>
                    <strong>Finding Trusted Help:</strong> Vetting reliable, qualified caregivers who genuinely care is exhausting and risky.
                  </div>
                </li>
              </ul>
            </div>

            <div className="ab-story-card solution">
              <div className="ab-story-card-top">
                <span className="ab-story-badge teal">The FamilyCare Solution</span>
                <h3>One Unified Digital Sanctuary</h3>
              </div>
              <p className="ab-story-card-p">
                We combine smart health intelligence with accredited human caregivers so you 
                are always connected in real time:
              </p>
              <ul className="ab-story-list">
                <li>
                  <span className="ab-list-check"><CheckCircle2 size={16} /></span>
                  <div>
                    <strong>Real-Time Health Feeds:</strong> Immediate visibility into vitals, meal logs, doctor visits, and daily emotional state.
                  </div>
                </li>
                <li>
                  <span className="ab-list-check"><CheckCircle2 size={16} /></span>
                  <div>
                    <strong>Admin-Approved Specialists:</strong> Every caregiver on our platform is certified, background-screened, and vetted.
                  </div>
                </li>
                <li>
                  <span className="ab-list-check"><CheckCircle2 size={16} /></span>
                  <div>
                    <strong>Instant Emergency Escalation:</strong> Automated vitals alerts alert families and caregivers instantly if thresholds deviate.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES SECTION ──────────────────────────────────────── */}
      <section className="ab-values-section">
        <div className="ab-container">
          <div className="ab-section-header">
            <span className="ab-section-tag">Our Principles</span>
            <h2 className="ab-section-title">Values That Guide Everything We Build</h2>
            <p className="ab-section-desc">
              From our screening protocols to our mobile experience, these 4 pillars drive our daily decisions.
            </p>
          </div>

          <div className="ab-values-grid">
            {values.map((v, i) => {
              const IconComp = v.icon;
              return (
                <div className={`ab-value-card ${v.colorClass}`} key={i}>
                  <div className="ab-value-icon-box">
                    <IconComp size={24} />
                  </div>
                  <h4 className="ab-value-title">{v.title}</h4>
                  <p className="ab-value-desc">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SAFETY & VETTING PROCESS ─────────────────────────────────── */}
      <section className="ab-safety-section">
        <div className="ab-container">
          <div className="ab-safety-box">
            <div className="ab-safety-content">
              <span className="ab-section-tag light">Trust & Safety Framework</span>
              <h2 className="ab-safety-title">Our Rigorous 3-Step Caregiver Vetting</h2>
              <p className="ab-safety-desc">
                We accept only a select fraction of caregiver applicants. Each candidate is tested for 
                geriatric proficiency, legal certification, and genuine compassionate temperament.
              </p>

              <div className="ab-steps-grid">
                <div className="ab-step-item">
                  <div className="ab-step-num">01</div>
                  <h4 className="ab-step-heading">Identity & Criminal Screening</h4>
                  <p className="ab-step-text">Comprehensive background check, ID verification, and reference validation.</p>
                </div>
                <div className="ab-step-item">
                  <div className="ab-step-num">02</div>
                  <h4 className="ab-step-heading">Clinical Certification</h4>
                  <p className="ab-step-text">Validation of medical licenses, CPR/First-Aid qualifications, and geriatric training.</p>
                </div>
                <div className="ab-step-item">
                  <div className="ab-step-num">03</div>
                  <h4 className="ab-step-heading">Admin Manual Approval</h4>
                  <p className="ab-step-text">Final administrative review before any caregiver is activated for family assignment.</p>
                </div>
              </div>
            </div>
            <div className="ab-safety-visual">
              <img src={nurseHandsImg} alt="Caregiver gently holding senior's hand" className="ab-safety-img" />
              <div className="ab-safety-img-caption">
                <Shield size={16} />
                <span>Strict Clinical Oversight on Every Active Match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP TEAM ─────────────────────────────────────────── */}
      <section className="ab-team-section">
        <div className="ab-container">
          <div className="ab-section-header">
            <span className="ab-section-tag">Leadership Team</span>
            <h2 className="ab-section-title">The People Behind the Platform</h2>
            <p className="ab-section-desc">
              A multidisciplinary group of clinicians, eldercare practitioners, and software engineers.
            </p>
          </div>

          <div className="ab-team-grid">
            {team.map((member, i) => (
              <div className="ab-team-card" key={i}>
                <div className="ab-team-photo-wrap">
                  <img src={member.img} alt={member.name} className="ab-team-photo" />
                  <span className="ab-team-badge">{member.badge}</span>
                </div>
                <div className="ab-team-body">
                  <h3 className="ab-team-name">{member.name}</h3>
                  <div className="ab-team-role">{member.role}</div>
                  <p className="ab-team-bio">{member.bio}</p>
                  <div className="ab-team-specialty">
                    <Award size={14} />
                    <span>{member.specialty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL FOUNDER QUOTE ──────────────────────────────────── */}
      <section className="ab-quote-section">
        <div className="ab-container">
          <div className="ab-quote-card">
            <div className="ab-quote-mark">“</div>
            <blockquote className="ab-quote-text">
              We built FamilyCare because we lived the agony of being far from our parents when they needed us most. 
              Every feature in this platform is designed to preserve dignity, bring clarity, and restore peace of mind to families everywhere.
            </blockquote>
            <div className="ab-quote-author">
              <div className="ab-author-name">Sarah Chen & Dr. Marcus Thorne</div>
              <div className="ab-author-title">Co-Founders, FamilyCare</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ───────────────────────────────────────────── */}
      <section className="ab-cta-section">
        <div className="ab-container">
          <div className="ab-cta-card">
            <div className="ab-cta-content">
              <span className="ab-cta-pill">Start Today • No Credit Card Required</span>
              <h2 className="ab-cta-title">Give Your Loved Ones the Care They Deserve</h2>
              <p className="ab-cta-desc">
                Join thousands of families who trust FamilyCare for verified specialists, 
                continuous health oversight, and effortless connection.
              </p>
              <div className="ab-cta-btns">
                <Link to="/register" className="ab-cta-btn-main">
                  <span>Create Free Account</span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/caregivers" className="ab-cta-btn-alt">
                  <span>Browse Verified Caregivers</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

