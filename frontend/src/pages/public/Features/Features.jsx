import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Shield, Bell, BarChart2, LayoutDashboard,
  Users, ArrowRight, Play, CheckCircle, ChevronRight,
  Heart, Clock, Smartphone, Star
} from 'lucide-react';
import Footer from '../../../components/Landing/Footer';

/* ─── Scroll-reveal hook ──────────────────────────────────────────── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

/* ─── Feature Card Data ───────────────────────────────────────────── */
const coreFeatures = [
  {
    icon: Heart,
    color: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Health Monitoring',
    description: 'Real-time tracking of vital signs, nutrition, and daily wellness tracking for your family members.',
    highlights: ['Activity logging', 'Medication reminders'],
  },
  {
    icon: Users,
    color: '#fff7ed',
    iconColor: '#ea580c',
    title: 'Caregiver Management',
    description: 'Find and manage the perfect caregiver. Filter by experience, location, and availability.',
    highlights: ['Staff profiles', 'Direct Messaging'],
  },
  {
    icon: Bell,
    color: '#fef2f2',
    iconColor: '#dc2626',
    title: 'Emergency Response',
    description: 'Instant notification to designated health contacts. Triggers an emergency-action policy immediately.',
    highlights: ['One-click emergency', 'In-progress status'],
  },
  {
    icon: BarChart2,
    color: '#eff6ff',
    iconColor: '#2563eb',
    title: 'Predictive Analytics',
    description: 'Analyse activity reports and historical data to predict and prevent complications before they arise.',
    highlights: ['Trend reports'],
  },
  {
    icon: LayoutDashboard,
    color: '#fefce8',
    iconColor: '#ca8a04',
    title: 'Live Dashboard',
    description: 'A beautiful live activity overview for 24/7 real-time updates for you and your family.',
    highlights: ['Live updates'],
  },
  {
    icon: Shield,
    color: '#f0fdf4',
    iconColor: '#15803d',
    title: 'Military-Grade Security',
    description: 'Highest-grade data protection using AES 256-bit encryption with multi-factor authentication.',
    highlights: ['HIPAA compliant'],
  },
];

const familyFeatures = [
  { text: 'Monitor vitals 24/7' },
  { text: 'Manage caregiver check-ins' },
  { text: 'Receive critical alerts' },
];

const caregiverFeatures = [
  { text: 'Organised daily logging' },
  { text: 'Patient management dashboard' },
  { text: 'Direct emergency reporting' },
];

/* ─── 3-D Tilt Feature Card ───────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, color, iconColor, title, description, highlights, index }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * 8;
    const ry = ((cx - x) / cx) * 8;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.02)`;
    card.style.boxShadow = `0 24px 48px rgba(0,0,0,0.12), 0 0 0 1.5px ${iconColor}33`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.transform = '';
    card.style.boxShadow = '';
  };

  return (
    <div
      ref={cardRef}
      className="fc-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="fc-card__icon" style={{ background: color }}>
        <Icon size={22} color={iconColor} className="fc-card__icon-svg" />
      </div>
      <h3 className="fc-card__title">{title}</h3>
      <p className="fc-card__desc">{description}</p>
      <div className="fc-card__tags">
        {highlights.map((h) => (
          <span key={h} className="fc-card__tag" style={{ color: iconColor, background: color }}>
            {h}
          </span>
        ))}
      </div>
    </div>
  );
};

const CheckItem = ({ text, index }) => (
  <div className="fp-check" style={{ animationDelay: `${index * 0.12}s` }}>
    <CheckCircle size={18} color="#00A896" className="fp-check__icon" />
    <span>{text}</span>
  </div>
);

/* ─── Demo Video Modal ────────────────────────────────────────────── */
const DEMO_VIDEO_ID = 'dQw4w9WgXcQ'; // Replace with your actual YouTube video ID

const VideoModal = ({ onClose }) => (
  <div className="fp-modal-overlay" onClick={onClose}>
    <div className="fp-modal-box" onClick={(e) => e.stopPropagation()}>
      <button className="fp-modal-close" onClick={onClose} aria-label="Close">✕</button>
      <div className="fp-modal-video">
        <iframe
          src={`https://www.youtube.com/embed/${DEMO_VIDEO_ID}?autoplay=1`}
          title="FamilyCare Demo"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  </div>
);

/* ─── Main Page ───────────────────────────────────────────────────── */
const FeaturesPage = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [gridRef, gridInView] = useInView(0.1);
  const [row1Ref, row1InView] = useInView(0.15);
  const [row2Ref, row2InView] = useInView(0.15);
  const [ctaRef, ctaInView] = useInView(0.2);

  return (
    <div className="fp-root">

      {/* ── Hero ── */}
      <header className="fp-hero">
        {/* animated mesh blobs */}
        <div className="fp-hero__blob fp-hero__blob--1" />
        <div className="fp-hero__blob fp-hero__blob--2" />
        <div className="fp-hero__blob fp-hero__blob--3" />

        <div className="container fp-hero__inner">
          <div className="fp-hero__content">
            <span className="fp-badge">
              <span className="fp-badge__dot" />
              INNOVATION &amp; CARE
            </span>
            <h1 className="fp-hero__title">
              Powerful Features<br />for <span className="fp-teal fp-teal--anim">Smarter</span><br />Eldercare
            </h1>
            <p className="fp-hero__subtitle">
              A digital sanctuary designed to bridge the gap between clinical precision and family warmth. Monitor, manage, and protect your loved ones with an intimate-grade interface.
            </p>
            <div className="fp-hero__actions">
              <a href="#features" className="fp-btn fp-btn--primary fp-btn--lg fp-btn--shine">
                Explore Core Features
              </a>
              <button className="fp-btn fp-btn--video" onClick={() => setShowDemo(true)}>
                <span className="fp-play-icon"><Play size={14} fill="currentColor" /></span>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="fp-hero__visual">
            <div className="fp-hero__card fp-hero__card--main fp-hero__card--float">
              <div className="fp-hero__card-head">
                <div className="fp-hero__avatar fp-hero__avatar--pulse" />
                <div>
                  <div className="fp-skeleton fp-skeleton--sm fp-skeleton--shine" style={{ width: '80px' }} />
                  <div className="fp-skeleton fp-skeleton--xs fp-skeleton--shine" style={{ width: '56px', marginTop: '4px' }} />
                </div>
                <span className="fp-status fp-status--active">Active</span>
                <span className="fp-status fp-status--logged">Logged</span>
              </div>
              <div className="fp-hero__chart">
                {[60, 80, 55, 90, 70, 85, 65, 95, 75].map((h, i) => (
                  <div
                    key={i}
                    className="fp-bar fp-bar--anim"
                    style={{ '--bar-h': `${h}%`, animationDelay: `${i * 0.07}s` }}
                  />
                ))}
              </div>
              <div className="fp-hero__icon-row">
                <div className="fp-icon-chip fp-icon-chip--green fp-icon-chip--pop"><Heart size={14} /></div>
                <div className="fp-icon-chip fp-icon-chip--orange fp-icon-chip--pop" style={{ animationDelay: '0.15s' }}><Activity size={14} /></div>
                <div className="fp-icon-chip fp-icon-chip--blue fp-icon-chip--pop" style={{ animationDelay: '0.3s' }}><Shield size={14} /></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Core Features Grid ── */}
      <section id="features" className="fp-section fp-section--light">
        <div className="container">
          <div className="fp-section__head fp-reveal" ref={gridRef} data-inview={gridInView}>
            <h2 className="fp-section__title fp-underline-draw">Integrated Health Ecosystem</h2>
            <p className="fp-section__sub">
              Everything you need to create excellence in care, unified in a single, intuitive dashboard.
            </p>
          </div>
          <div className={`fc-grid ${gridInView ? 'fc-grid--revealed' : ''}`}>
            {coreFeatures.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tailored Experiences ── */}
      <section className="fp-section fp-section--white">
        <div className="container">
          <div className="fp-section__head">
            <p className="fp-eyebrow">FOR EVERY STAKEHOLDER</p>
            <h2 className="fp-section__title fp-underline-draw">Tailored Experiences for Every Stakeholder</h2>
          </div>

          {/* Row 1 – Family Members */}
          <div
            ref={row1Ref}
            className={`fp-row fp-row--reverse fp-reveal-row ${row1InView ? 'fp-reveal-row--in' : ''}`}
          >
            <div className="fp-row__text">
              <span className="fp-eyebrow">FOR FAMILY MEMBERS</span>
              <h3 className="fp-row__heading">Peace of Mind, Personalized.</h3>
              <p className="fp-row__desc">
                Stay connected on all your parents' needs, from anywhere in the world. View family health logs, receive instant alerts, and manage care schedules — all in a simple, high-end interface.
              </p>
              <div className="fp-checks">
                {familyFeatures.map((f, i) => <CheckItem key={f.text} {...f} index={i} />)}
              </div>
            </div>
            <div className="fp-row__visual">
              <div className="fp-mockup fp-mockup--teal fp-mockup--float">
                <div className="fp-mockup__bar" />
                <div className="fp-mockup__line fp-mockup__line--lg" />
                <div className="fp-mockup__line fp-mockup__line--md" />
                <div className="fp-mockup__row">
                  <div className="fp-mockup__chip fp-chip--teal"><Heart size={12} /></div>
                  <div className="fp-mockup__chip-label">
                    <div className="fp-skeleton fp-skeleton--xs fp-skeleton--shine" style={{ width: '64px' }} />
                    <div className="fp-skeleton fp-skeleton--xs fp-skeleton--shine" style={{ width: '48px', marginTop: '4px' }} />
                  </div>
                </div>
                <div className="fp-mockup__mini-chart">
                  {[40, 65, 50, 80, 60, 75, 55, 85].map((h, i) => (
                    <div key={i} className="fp-mini-bar fp-mini-bar--anim" style={{ '--bar-h': `${h}%`, animationDelay: `${0.3 + i * 0.07}s` }} />
                  ))}
                </div>
                <div className="fp-mockup__family-avatar">
                  <div className="fp-family-img" />
                  <div className="fp-mockup__line fp-mockup__line--sm" style={{ marginTop: '8px' }} />
                  <div className="fp-mockup__line fp-mockup__line--xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 – Caregivers */}
          <div
            ref={row2Ref}
            className={`fp-row fp-reveal-row fp-reveal-row--right ${row2InView ? 'fp-reveal-row--in' : ''}`}
            style={{ marginTop: '5rem' }}
          >
            <div className="fp-row__visual">
              <div className="fp-mockup fp-mockup--blue fp-mockup--float" style={{ animationDelay: '0.5s' }}>
                <div className="fp-mockup__bar" />
                <div className="fp-caregiver-avatar">
                  <div className="fp-caregiver-img" />
                </div>
                <div className="fp-mockup__line fp-mockup__line--md" style={{ marginTop: '12px' }} />
                <div className="fp-mockup__line fp-mockup__line--sm" />
                <div className="fp-mockup__statrow">
                  <div className="fp-stat fp-stat--hover">
                    <Activity size={12} color="#2563eb" />
                    <div className="fp-skeleton fp-skeleton--xs fp-skeleton--shine" style={{ width: '48px' }} />
                  </div>
                  <div className="fp-stat fp-stat--hover">
                    <Clock size={12} color="#2563eb" />
                    <div className="fp-skeleton fp-skeleton--xs fp-skeleton--shine" style={{ width: '40px' }} />
                  </div>
                </div>
                <div className="fp-mockup__mini-chart">
                  {[30, 55, 45, 70, 50, 80, 60, 90].map((h, i) => (
                    <div key={i} className="fp-mini-bar fp-mini-bar--blue fp-mini-bar--anim" style={{ '--bar-h': `${h}%`, animationDelay: `${0.5 + i * 0.07}s` }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="fp-row__text">
              <span className="fp-eyebrow">FOR CAREGIVERS</span>
              <h3 className="fp-row__heading">Efficiency in Every Interaction.</h3>
              <p className="fp-row__desc">
                Focus on the human element while we handle the data. Tailored digital tools, logs, manage medication checklists, and trigger digital emergency protocols with one-tap actions.
              </p>
              <div className="fp-checks">
                {caregiverFeatures.map((f, i) => <CheckItem key={f.text} {...f} index={i} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`fp-cta ${ctaInView ? 'fp-cta--in' : ''}`} ref={ctaRef}>
        <div className="fp-cta__particles">
          {[...Array(8)].map((_, i) => <div key={i} className="fp-particle" style={{ '--i': i }} />)}
        </div>
        <div className="container fp-cta__inner">
          <h2 className="fp-cta__title">Start monitoring your loved ones today</h2>
          <p className="fp-cta__sub">
            Join thousands of families who have found peace of mind through the Living Sanctuary digital ecosystem.
          </p>
          <div className="fp-cta__actions">
            <Link to="/register" className="fp-btn fp-btn--primary fp-btn--lg fp-btn--cta-white">Create Free Account</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Demo Video Modal ── */}
      {showDemo && <VideoModal onClose={() => setShowDemo(false)} />}

      {/* ── Styles ── */}
      <style>{`
        /* ======================================================
           RESET & ROOT
        ====================================================== */
        .fp-root {
          font-family: 'Inter', sans-serif;
          color: #1A202C;
          overflow-x: hidden;
        }

        /* ======================================================
           KEYFRAMES
        ====================================================== */
        @keyframes fp-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fp-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fp-slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fp-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-10px) rotate(0.5deg); }
          66%       { transform: translateY(-5px) rotate(-0.5deg); }
        }
        @keyframes fp-float-alt {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes fp-pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(0,168,150,0.55); }
          70%  { box-shadow: 0 0 0 10px rgba(0,168,150,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,168,150,0); }
        }
        @keyframes fp-bar-grow {
          from { height: 0; }
          to   { height: var(--bar-h); }
        }
        @keyframes fp-mini-bar-grow {
          from { height: 0; }
          to   { height: var(--bar-h); }
        }
        @keyframes fp-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes fp-blob-1 {
          0%,100% { transform: scale(1) translate(0,0); }
          33%      { transform: scale(1.08) translate(30px,-20px); }
          66%      { transform: scale(0.95) translate(-20px,15px); }
        }
        @keyframes fp-blob-2 {
          0%,100% { transform: scale(1) translate(0,0); }
          50%      { transform: scale(1.1) translate(-25px,20px); }
        }
        @keyframes fp-blob-3 {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.15) translate(15px,-10px); }
        }
        @keyframes fp-dot-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.6; transform: scale(0.8); }
        }
        @keyframes fp-underline-grow {
          from { width: 0; }
          to   { width: 60px; }
        }
        @keyframes fp-pop-in {
          0%   { opacity: 0; transform: scale(0.7); }
          70%  { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fp-check-slide {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fp-shine-sweep {
          0%   { left: -80%; }
          100% { left: 120%; }
        }
        @keyframes fp-cta-in {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fp-particle {
          0%   { transform: translateY(0) scale(1); opacity: 0.7; }
          100% { transform: translateY(-120px) scale(0); opacity: 0; }
        }
        @keyframes fp-card-grid-in {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ======================================================
           HERO
        ====================================================== */
        .fp-hero {
          padding: 140px 0 80px;
          background: #fff;
          position: relative;
          overflow: hidden;
        }
        /* animated background blobs */
        .fp-hero__blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(70px);
          z-index: 0;
        }
        .fp-hero__blob--1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(0,168,150,0.08) 0%, transparent 70%);
          top: -200px; right: -150px;
          animation: fp-blob-1 12s ease-in-out infinite;
        }
        .fp-hero__blob--2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(0,168,150,0.05) 0%, transparent 70%);
          bottom: -100px; left: -100px;
          animation: fp-blob-2 15s ease-in-out infinite;
        }
        .fp-hero__blob--3 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%);
          top: 40%; left: 40%;
          animation: fp-blob-3 10s ease-in-out infinite;
        }
        .fp-hero__inner {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        /* hero content staggered entrance */
        .fp-hero__content { animation: fp-fade-up 0.7s ease both; }
        .fp-hero__content .fp-badge      { animation: fp-fade-up 0.6s 0.05s ease both; }
        .fp-hero__content .fp-hero__title   { animation: fp-fade-up 0.7s 0.12s ease both; }
        .fp-hero__content .fp-hero__subtitle { animation: fp-fade-up 0.7s 0.22s ease both; }
        .fp-hero__content .fp-hero__actions  { animation: fp-fade-up 0.7s 0.32s ease both; }
        .fp-hero__visual { animation: fp-fade-up 0.85s 0.2s ease both; }

        .fp-hero__title {
          font-size: clamp(2.6rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          color: #1A202C;
          animation: fpFadeUp 0.8s ease-out both;
        }
        .fp-hero__subtitle {
          font-size: 1.05rem;
          color: #718096;
          line-height: 1.7;
          max-width: 500px;
          margin-bottom: 2.2rem;
          animation: fpFadeUp 0.8s 0.2s ease-out both;
        }
        .fp-hero__actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          animation: fpFadeUp 0.8s 0.4s ease-out both;
        }

        /* Hero Visual Card */
        .fp-hero__visual {
          display: flex;
          justify-content: center;
          animation: fpFadeUp 1s 0.3s ease-out both;
        }
        /* ---- Animated "Smarter" text ---- */
        .fp-teal { color: #00A896; }
        .fp-teal--anim {
          background: linear-gradient(90deg, #00A896, #00d4bf, #00A896);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fp-shimmer 3s linear infinite;
        }

        /* ---- Badge ---- */
        .fp-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #e0f2f1;
          color: #00796b;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          padding: 5px 14px 5px 10px;
          border-radius: 20px;
          margin-bottom: 1.25rem;
          border: 1px solid rgba(0,168,150,0.2);
        }
        .fp-badge__dot {
          width: 7px; height: 7px;
          background: #00A896;
          border-radius: 50%;
          display: inline-block;
          animation: fp-dot-pulse 2s ease-in-out infinite;
        }
        .fp-eyebrow {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #00A896;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }

        /* ─── Hero Visual Card ─── */
        .fp-hero__visual { display: flex; justify-content: center; }
        .fp-hero__card {
          background: #1A202C;
          border-radius: 20px;
          padding: 1.5rem;
          width: 300px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.18);
          transition: box-shadow 0.3s ease;
          animation: fpFloat 6s ease-in-out infinite;
        }
        .fp-hero__card--main { background: #1E2A38; }
        .fp-hero__card--float { animation: fp-float 5s ease-in-out infinite; }
        .fp-hero__card:hover {
          box-shadow: 0 35px 80px rgba(0,168,150,0.18);
        }
        .fp-hero__card-head {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
        }
        .fp-hero__avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00A896, #00d4bf);
          flex-shrink: 0;
        }
        .fp-hero__avatar--pulse { animation: fp-pulse-ring 2.5s ease-in-out infinite; }
        .fp-status {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
          margin-left: auto;
        }
        .fp-status--active { background: #dcfce7; color: #16a34a; }
        .fp-status--logged { background: #eff6ff; color: #2563eb; margin-left: 0.4rem; }

        /* ─── Animated bars ─── */
        .fp-hero__chart {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          height: 70px;
          margin-bottom: 1rem;
        }
        .fp-bar {
          flex: 1;
          background: linear-gradient(to top, #00A896, #00d4bf40);
          border-radius: 3px 3px 0 0;
          height: var(--bar-h);
        }
        .fp-bar--anim {
          animation: fp-bar-grow 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        .fp-hero__icon-row { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
        .fp-icon-chip {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: white;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .fp-icon-chip--pop { animation: fp-pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .fp-icon-chip:hover { transform: scale(1.18) rotate(-5deg); }
        .fp-icon-chip--green { background: #16a34a; }
        .fp-icon-chip--orange { background: #ea580c; }
        .fp-icon-chip--blue { background: #2563eb; }

        /* ─── Skeleton shimmer ─── */
        .fp-skeleton {
          background: #2D3748;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        .fp-skeleton--sm { height: 12px; }
        .fp-skeleton--xs { height: 8px; }
        .fp-skeleton--shine::after {
          content: '';
          position: absolute;
          top: 0; left: -80%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: fp-shine-sweep 1.8s ease-in-out infinite;
        }

        /* ======================================================
           BUTTONS
        ====================================================== */
        .fp-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.4rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          border: none;
          text-decoration: none;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .fp-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -80%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transition: none;
        }
        .fp-btn:hover::after { animation: fp-shine-sweep 0.55s ease forwards; }

        .fp-btn--primary { background: #00A896; color: white; }
        .fp-btn--primary:hover {
          background: #008f80;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,168,150,0.35);
        }
        .fp-btn--primary:active { transform: translateY(0px); }

        .fp-btn--ghost {
          background: transparent;
          color: #4A5568;
          border: 1px solid #E2E8F0;
        }
        .fp-btn--ghost:hover { border-color: #00A896; color: #00A896; }

        .fp-btn--video {
          background: #F7FAFC;
          color: #1A202C;
          border: 1px solid #E2E8F0;
          gap: 0.6rem;
        }
        .fp-btn--video:hover {
          background: #EDF2F7;
          border-color: #00A896;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        }
        .fp-btn--video:active { transform: translateY(0px); }

        .fp-btn--lg { padding: 0.9rem 2rem; font-size: 1rem; border-radius: 10px; }

        .fp-btn--outline-white {
          background: transparent;
          color: white;
          border: 1px solid rgba(255,255,255,0.35);
        }
        .fp-btn--outline-white:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.7);
          transform: translateY(-2px);
        }

        .fp-btn--cta-white {
          background: white;
          color: #00A896;
        }
        .fp-btn--cta-white:hover {
          background: #F0FFF4;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .fp-play-icon {
          width: 28px; height: 28px;
          background: #00A896;
          color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.25s ease;
          flex-shrink: 0;
        }
        .fp-btn--video:hover .fp-play-icon { transform: scale(1.15); }

        /* ======================================================
           SECTION COMMON
        ====================================================== */
        .fp-section { padding: 100px 0; }
        .fp-section--light { background: #F8FAFC; }
        .fp-section--white { background: #fff; }
        .fp-section__head { text-align: center; margin-bottom: 4rem; }
        .fp-section__title {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 800;
          margin-bottom: 1rem;
          color: #1A202C;
          display: inline-block;
          position: relative;
        }
        /* underline draw on section titles */
        .fp-underline-draw::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -10px;
          transform: translateX(-50%);
          height: 4px;
          width: 60px;
          background: linear-gradient(90deg, #00A896, #00d4bf);
          border-radius: 2px;
          animation: fp-underline-grow 0.8s 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .fp-section__sub {
          color: #718096;
          font-size: 1.05rem;
          max-width: 550px;
          margin: 0.8rem auto 0;
          line-height: 1.7;
        }

        /* ======================================================
           FEATURE GRID — scroll reveal
        ====================================================== */
        .fc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .fc-card {
          background: white;
          border: 1px solid #EDF2F7;
          border-radius: 18px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          transition: transform 0.35s cubic-bezier(0.23,1,0.32,1),
                      box-shadow 0.35s ease,
                      border-color 0.25s ease;
          animation: fpFadeUp 0.8s ease-out both;
        }
        .fc-card:nth-child(1) { animation-delay: 0.1s; }
        .fc-card:nth-child(2) { animation-delay: 0.2s; }
        .fc-card:nth-child(3) { animation-delay: 0.3s; }
        .fc-card:nth-child(4) { animation-delay: 0.4s; }
        .fc-card:nth-child(5) { animation-delay: 0.5s; }
        .fc-card:nth-child(6) { animation-delay: 0.6s; }
        .fc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.07);
        }
        .fc-grid--revealed .fc-card {
          animation: fp-card-grid-in 0.55s cubic-bezier(0.23,1,0.32,1) both;
        }
        .fc-card__icon {
          width: 46px; height: 46px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.3rem;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .fc-card:hover .fc-card__icon { transform: scale(1.15) rotate(-6deg); }
        .fc-card__title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1A202C;
          transition: color 0.2s ease;
        }
        .fc-card__desc {
          font-size: 0.9rem;
          color: #718096;
          line-height: 1.6;
          flex: 1;
        }
        .fc-card__tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.2rem; }
        .fc-card__tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          transition: transform 0.2s ease;
        }
        .fc-card:hover .fc-card__tag { transform: scale(1.04); }

        /* ======================================================
           SCROLL REVEAL — rows
        ====================================================== */
        .fp-reveal-row {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1);
        }
        .fp-reveal-row--right {
          transform: translateX(40px);
        }
        .fp-reveal-row--in {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        /* ======================================================
           STAKEHOLDER ROWS
        ====================================================== */
        .fp-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .fp-row--reverse { direction: rtl; }
        .fp-row--reverse > * { direction: ltr; }
        .fp-row__heading {
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 800;
          margin-bottom: 1rem;
          color: #1A202C;
          position: relative;
          display: inline-block;
        }
        .fp-row__desc {
          color: #718096;
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
        .fp-checks { display: flex; flex-direction: column; gap: 0.85rem; }
        .fp-check {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 0.95rem;
          color: #4A5568;
          font-weight: 500;
          opacity: 0;
          animation: fp-check-slide 0.5s ease both;
        }
        .fp-reveal-row--in .fp-check { animation: fp-check-slide 0.5s ease both; }
        .fp-check__icon { flex-shrink: 0; transition: transform 0.3s ease; }
        .fp-check:hover .fp-check__icon { transform: scale(1.25) rotate(-10deg); }
        .fp-check:hover { color: #1A202C; }

        /* ======================================================
           MOCKUP CARDS
        ====================================================== */
        .fp-row__visual { display: flex; justify-content: center; }
        .fp-mockup {
          width: 280px;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
        }
        .fp-mockup--teal { background: linear-gradient(145deg, #e0f2f1, #b2dfdb); animation: fpFloat 5s ease-in-out infinite; }
        .fp-mockup--blue { background: linear-gradient(145deg, #eff6ff, #bfdbfe); animation: fpFloatAlt 5.5s ease-in-out infinite; }
        .fp-mockup--float { animation: fp-float-alt 4.5s ease-in-out infinite; }
        .fp-mockup:hover {
          transform: scale(1.03) translateY(-4px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }
        .fp-mockup__bar {
          height: 8px;
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
          margin-bottom: 1rem;
          width: 60%;
        }
        .fp-mockup__line {
          height: 8px;
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
          margin-bottom: 0.6rem;
        }
        .fp-mockup__line--lg { width: 90%; }
        .fp-mockup__line--md { width: 70%; }
        .fp-mockup__line--sm { width: 55%; }
        .fp-mockup__line--xs { width: 40%; }
        .fp-mockup__row {
          display: flex; align-items: center;
          gap: 0.7rem; margin: 1rem 0;
        }
        .fp-mockup__chip {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .fp-mockup__chip:hover { transform: scale(1.15) rotate(-8deg); }
        .fp-chip--teal { background: #00A896; color: white; }
        .fp-chip--blue { background: #2563eb; color: white; }
        .fp-mockup__chip-label { flex: 1; }

        /* animated mini-bars */
        .fp-mockup__mini-chart {
          display: flex; align-items: flex-end;
          gap: 4px; height: 48px; margin-top: 1rem;
        }
        .fp-mini-bar {
          flex: 1;
          background: rgba(0,168,150,0.4);
          border-radius: 2px 2px 0 0;
          height: var(--bar-h);
        }
        .fp-mini-bar--blue { background: rgba(37,99,235,0.4); }
        .fp-mini-bar--anim { animation: fp-mini-bar-grow 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }

        .fp-mockup__family-avatar { margin-top: 1rem; }
        .fp-family-img {
          width: 100%; height: 80px;
          background: linear-gradient(135deg, #00A89640, #00A89620);
          border-radius: 10px;
          transition: opacity 0.3s;
        }
        .fp-caregiver-avatar { display: flex; justify-content: center; margin-bottom: 1rem; }
        .fp-caregiver-img {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb40, #2563eb20);
          transition: transform 0.3s ease;
        }
        .fp-mockup:hover .fp-caregiver-img { transform: scale(1.07); }
        .fp-mockup__statrow { display: flex; gap: 0.75rem; margin: 1rem 0; }
        .fp-stat {
          display: flex; align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.6);
          border-radius: 8px; padding: 6px 10px;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .fp-stat--hover:hover {
          background: rgba(255,255,255,0.9);
          transform: scale(1.05);
        }

        /* ======================================================
           CTA SECTION
        ====================================================== */
        .fp-cta {
          padding: 90px 0;
          background: linear-gradient(135deg, #00A896 0%, #00796b 100%);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fp-cta--in { opacity: 1 !important; transform: translateY(0) !important; }
        .fp-cta__particles { position: absolute; inset: 0; pointer-events: none; }
        .fp-particle {
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          bottom: 20%;
          left: calc(10% + var(--i) * 12%);
          animation: fp-particle calc(3s + var(--i) * 0.4s) ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.5s);
        }
        .fp-cta__inner { text-align: center; color: white; position: relative; z-index: 1; }
        .fp-cta__title {
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 800; margin-bottom: 1.2rem; line-height: 1.2;
        }
        .fp-cta__sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.85);
          max-width: 520px; margin: 0 auto 2.5rem; line-height: 1.7;
        }
        .fp-cta__actions {
          display: flex; gap: 1rem;
          justify-content: center; flex-wrap: wrap;
        }

        /* ======================================================
           VIDEO MODAL
        ====================================================== */
        .fp-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; padding: 1rem;
          animation: fp-fade-in 0.2s ease;
          backdrop-filter: blur(6px);
        }
        .fp-modal-box {
          position: relative; width: 100%; max-width: 860px;
          background: #000; border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
          animation: fp-slide-up 0.28s cubic-bezier(0.34,1.56,0.64,1);
        }
        .fp-modal-close {
          position: absolute; top: 10px; right: 14px; z-index: 10;
          background: rgba(255,255,255,0.15); border: none; color: white;
          font-size: 1rem; width: 32px; height: 32px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.2s;
        }
        .fp-modal-close:hover { background: rgba(255,255,255,0.32); transform: rotate(90deg); }
        .fp-modal-video { position: relative; padding-bottom: 56.25%; height: 0; }
        .fp-modal-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }

        /* ======================================================
           RESPONSIVE
        ====================================================== */
        @media (max-width: 1024px) {
          .fc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .fp-hero__inner { grid-template-columns: 1fr; text-align: center; }
          .fp-hero__subtitle { max-width: 100%; margin-left: auto; margin-right: auto; }
          .fp-hero__actions { justify-content: center; }
          .fp-hero__visual { display: none; }
          .fc-grid { grid-template-columns: 1fr; }
          .fp-row, .fp-row--reverse {
            grid-template-columns: 1fr;
            direction: ltr; text-align: center; gap: 2.5rem;
          }
          .fp-row--reverse > * { direction: ltr; }
          .fp-checks { align-items: center; }
          .fp-row__visual { order: -1; }
          .fp-reveal-row { transform: translateY(24px); }
          .fp-reveal-row--right { transform: translateY(24px); }
        }
        @media (max-width: 480px) {
          .fp-hero { padding: 100px 0 60px; }
          .fp-section { padding: 70px 0; }
          .fp-cta { padding: 60px 0; }
        }

        /* ---- Animations ---- */
        @keyframes fpFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fpFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes fpFloatAlt {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(12px); }
        }
      `}</style>
    </div>
  );
};

export default FeaturesPage;
