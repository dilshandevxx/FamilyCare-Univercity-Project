import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Shield, Bell, BarChart2, LayoutDashboard,
  Users, CheckCircle, ChevronRight,
  Heart, Clock, Smartphone, Play
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

const coreFeatures = [
  {
    icon: Heart,
    title: 'Health Monitoring',
    description: 'Real-time tracking of vital signs, nutrition, and daily wellness tracking for your family members.',
    highlights: ['Activity logging', 'Medication reminders'],
    size: 'large'
  },
  {
    icon: Users,
    title: 'Caregiver Management',
    description: 'Find and manage the perfect caregiver. Filter by experience, location, and availability.',
    highlights: ['Staff profiles', 'Direct Messaging'],
    size: 'small'
  },
  {
    icon: Bell,
    title: 'Emergency Response',
    description: 'Instant notification to designated health contacts. Triggers an emergency-action policy immediately.',
    highlights: ['One-click emergency'],
    size: 'small'
  },
  {
    icon: LayoutDashboard,
    title: 'Live Dashboard',
    description: 'A beautiful live activity overview for 24/7 real-time updates for you and your family.',
    highlights: ['Live updates', 'Timeline'],
    size: 'large'
  },
  {
    icon: BarChart2,
    title: 'Predictive Analytics',
    description: 'Analyse activity reports and historical data to predict and prevent complications before they arise.',
    highlights: ['Trend reports'],
    size: 'small'
  },
  {
    icon: Shield,
    title: 'Military-Grade Security',
    description: 'Highest-grade data protection using AES 256-bit encryption with multi-factor authentication.',
    highlights: ['HIPAA compliant'],
    size: 'small'
  }
];

const familyFeatures = [
  'Monitor vitals 24/7 in real-time',
  'Manage caregiver check-ins instantly',
  'Receive critical health alerts'
];

const caregiverFeatures = [
  'Organised daily shift logging',
  'Patient management dashboard',
  'Direct emergency reporting'
];

/* ─── Feature Card (Bento Style) ───────────────────────────────────────── */
const BentoCard = ({ icon: Icon, title, description, highlights, size, index }) => {
  return (
    <div
      className={`feat-bento-card feat-bento-card--${size}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="feat-bento-card__icon-wrap">
        <Icon size={24} className="feat-bento-card__icon" />
      </div>
      <h3 className="feat-bento-card__title">{title}</h3>
      <p className="feat-bento-card__desc">{description}</p>
      <div className="feat-bento-card__tags">
        {highlights.map((h) => (
          <span key={h} className="feat-bento-card__tag">
            {h}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Demo Video Modal ────────────────────────────────────────────── */
const DEMO_VIDEO_ID = 'dQw4w9WgXcQ'; 
const VideoModal = ({ onClose }) => (
  <div className="feat-modal-overlay" onClick={onClose}>
    <div className="feat-modal-box" onClick={(e) => e.stopPropagation()}>
      <button className="feat-modal-close" onClick={onClose} aria-label="Close">✕</button>
      <div className="feat-modal-video">
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
    <div className="feat-page-root">
      {/* ── Hero ── */}
      <header className="feat-hero">
        <div className="feat-hero__bg-gradient" />
        <div className="feat-hero__container container">
          <div className="feat-badge fade-up">
            <span className="feat-badge-dot" /> INNOVATION & CARE
          </div>
          <h1 className="feat-hero__title fade-up delay-1">
            Powerful Features for <br/>
            <span className="feat-text-gradient">Smarter Eldercare</span>
          </h1>
          <p className="feat-hero__subtitle fade-up delay-2">
            A digital sanctuary designed to bridge the gap between clinical precision and family warmth. Monitor, manage, and protect your loved ones with an elegant, intuitive interface.
          </p>
          <div className="feat-hero__actions fade-up delay-3">
            <a href="#features" className="feat-btn feat-btn-primary">
              Explore Features
            </a>
            <button className="feat-btn feat-btn-outline" onClick={() => setShowDemo(true)}>
              <Play size={18} fill="currentColor" className="feat-btn-icon" />
              Watch Demo
            </button>
          </div>
        </div>
      </header>

      {/* ── Bento Grid ── */}
      <section id="features" className="feat-section bg-gray-50">
        <div className="container">
          <div className="feat-section-header" ref={gridRef}>
            <h2 className="feat-section-title">Integrated Health Ecosystem</h2>
            <p className="feat-section-subtitle">
              Everything you need to create excellence in care, unified in a single, intuitive platform.
            </p>
          </div>
          <div className={`feat-bento-grid ${gridInView ? 'in-view' : ''}`}>
            {coreFeatures.map((f, i) => (
              <BentoCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stakeholder Sections ── */}
      <section className="feat-section">
        <div className="container">
          
          {/* Family Members Row */}
          <div ref={row1Ref} className={`feat-split-row ${row1InView ? 'in-view' : ''}`}>
            <div className="feat-split-content">
              <span className="feat-eyebrow">FOR FAMILY MEMBERS</span>
              <h3 className="feat-split-title">Peace of Mind, Personalized.</h3>
              <p className="feat-split-desc">
                Stay connected on all your parents' needs, from anywhere in the world. View family health logs, receive instant alerts, and manage care schedules — all in a simple, high-end interface.
              </p>
              <ul className="feat-check-list">
                {familyFeatures.map((text, i) => (
                  <li key={i} className="feat-check-item">
                    <CheckCircle size={20} className="feat-check-icon" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="feat-split-visual">
              <img src="/assets/family_photo.png" alt="Family using app" className="feat-image" loading="lazy" />
            </div>
          </div>

          {/* Caregivers Row */}
          <div ref={row2Ref} className={`feat-split-row feat-split-row--reverse ${row2InView ? 'in-view' : ''}`}>
            <div className="feat-split-content">
              <span className="feat-eyebrow">FOR CAREGIVERS</span>
              <h3 className="feat-split-title">Efficiency in Every Interaction.</h3>
              <p className="feat-split-desc">
                Focus on the human element while we handle the data. Tailored digital tools, logs, manage medication checklists, and trigger digital emergency protocols with one-tap actions.
              </p>
              <ul className="feat-check-list">
                {caregiverFeatures.map((text, i) => (
                  <li key={i} className="feat-check-item">
                    <CheckCircle size={20} className="feat-check-icon" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="feat-split-visual">
              <img src="/assets/caregiver_photo.png" alt="Caregiver checking app" className="feat-image" loading="lazy" />
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className={`feat-cta-section ${ctaInView ? 'in-view' : ''}`}>
        <div className="container">
          <div className="feat-cta-card">
            <h2 className="feat-cta-title">Start monitoring your loved ones today</h2>
            <p className="feat-cta-sub">
              Join thousands of families who have found peace of mind through the FamilyCare digital ecosystem.
            </p>
            <div className="feat-cta-actions">
              <Link to="/register" className="feat-btn feat-btn-white">Create Free Account</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {showDemo && <VideoModal onClose={() => setShowDemo(false)} />}

      <style>{`
        /* ── Base & Variables ── */
        .feat-page-root {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #0f172a;
          background-color: #ffffff;
          overflow-x: hidden;
        }

        /* Utilities */
        .bg-gray-50 { background-color: #f8fafc; }
        .text-teal { color: #0D9488; }
        .text-blue { color: #2563eb; }
        .w-16 { width: 4rem; }
        .w-20 { width: 5rem; }
        .w-24 { width: 6rem; }
        .w-32 { width: 8rem; }
        .w-full { width: 100%; }
        .opacity-50 { opacity: 0.5; }

        /* Animations */
        @keyframes featFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          opacity: 0;
          animation: featFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }

        /* ── Buttons ── */
        .feat-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0.8rem 1.8rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          border: none;
        }
        .feat-btn-primary {
          background: #0D9488;
          color: white;
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.25);
        }
        .feat-btn-primary:hover {
          background: #0F766E;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(13, 148, 136, 0.35);
        }
        .feat-btn-outline {
          background: white;
          color: #0f172a;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .feat-btn-outline:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-2px);
        }
        .feat-btn-white {
          background: white;
          color: #0F766E;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .feat-btn-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .feat-btn-icon {
          transition: transform 0.3s ease;
        }
        .feat-btn:hover .feat-btn-icon {
          transform: scale(1.1);
        }

        /* ── Hero Section ── */
        .feat-hero {
          position: relative;
          padding: 12rem 0 8rem;
          text-align: center;
          overflow: hidden;
        }
        .feat-hero__bg-gradient {
          position: absolute;
          inset: 0;
          background: #f8fafc;
          z-index: 0;
        }
        .feat-hero__container {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .feat-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: #ebf8f6;
          border-radius: 100px;
          color: #0D9488;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          margin-bottom: 2rem;
        }
        .feat-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #0D9488;
        }

        .feat-hero__title {
          font-size: 4rem;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -1.5px;
          margin-bottom: 1.5rem;
          color: #0f172a;
        }
        .feat-text-gradient {
          color: #0D9488;
        }

        .feat-hero__subtitle {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 3rem;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .feat-hero__actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        /* ── Sections ── */
        .feat-section {
          padding: 6rem 0;
        }
        .feat-section-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .feat-section-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 1rem;
        }
        .feat-section-subtitle {
          font-size: 1.15rem;
          color: #64748b;
          line-height: 1.6;
        }

        /* ── Bento Grid ── */
        .feat-bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .feat-bento-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          transform: translateY(30px);
        }
        .feat-bento-grid.in-view .feat-bento-card {
          animation: featFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .feat-bento-card--large {
          grid-column: span 2;
        }
        .feat-bento-card--small {
          grid-column: span 1;
        }

        .feat-bento-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
          border-color: #cbd5e1;
        }

        .feat-bento-card__icon-wrap {
          width: 56px;
          height: 56px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0D9488;
          margin-bottom: 1.5rem;
          transition: transform 0.3s ease;
        }
        .feat-bento-card:hover .feat-bento-card__icon-wrap {
          transform: scale(1.05);
          background: #ebf8f6;
          border-color: #ccfbf1;
        }

        .feat-bento-card__title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          letter-spacing: -0.3px;
        }
        .feat-bento-card__desc {
          color: #64748b;
          line-height: 1.6;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }

        .feat-bento-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .feat-bento-card__tag {
          padding: 4px 12px;
          background: #f1f5f9;
          color: #475569;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 100px;
        }
        .feat-bento-card:hover .feat-bento-card__tag {
          background: #ebf8f6;
          color: #0D9488;
        }

        /* ── Split Rows ── */
        .feat-split-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          max-width: 1100px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .feat-split-row.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        .feat-split-row--reverse {
          margin-top: 6rem;
        }
        .feat-split-row--reverse .feat-split-content {
          order: 2;
        }

        .feat-eyebrow {
          font-size: 0.85rem;
          font-weight: 700;
          color: #0D9488;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 1rem;
        }
        .feat-split-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 1.15;
          margin-bottom: 1.5rem;
        }
        .feat-split-desc {
          font-size: 1.15rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .feat-check-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .feat-check-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.05rem;
          color: #1e293b;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        .feat-check-icon {
          color: #0D9488;
        }

        /* ── Split Rows Visuals ── */
        .feat-split-visual {
          position: relative;
        }
        .feat-image {
          width: 100%;
          height: auto;
          aspect-ratio: 4/3;
          object-fit: cover;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          transition: transform 0.4s ease;
        }
        .feat-image:hover {
          transform: translateY(-4px);
        }

        /* ── CTA Section ── */
        .feat-cta-section {
          padding: 4rem 0 8rem;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .feat-cta-section.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        .feat-cta-card {
          background: #0D9488;
          border-radius: 32px;
          padding: 5rem 2rem;
          text-align: center;
          color: white;
          box-shadow: 0 20px 40px rgba(13, 148, 136, 0.2);
        }
        .feat-cta-title {
          font-size: 2.8rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 1rem;
        }
        .feat-cta-sub {
          font-size: 1.15rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ── Video Modal ── */
        .feat-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 2rem;
        }
        .feat-modal-box {
          position: relative;
          background: black;
          width: 100%; max-width: 900px;
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .feat-modal-video {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 */
          height: 0;
        }
        .feat-modal-video iframe {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
        }
        .feat-modal-close {
          position: absolute; top: 16px; right: 16px;
          z-index: 10;
          background: rgba(255,255,255,0.1);
          border: none; color: white;
          width: 36px; height: 36px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: background 0.2s;
        }
        .feat-modal-close:hover { background: rgba(255,255,255,0.2); }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .feat-bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .feat-bento-card--large {
            grid-column: span 1;
          }
          .feat-split-row {
            gap: 2rem;
          }
        }
        @media (max-width: 768px) {
          .feat-hero { padding: 8rem 0 4rem; }
          .feat-hero__title { font-size: 2.8rem; }
          .feat-hero__actions { flex-direction: column; }
          .feat-bento-grid { grid-template-columns: 1fr; }
          .feat-bento-card--large, .feat-bento-card--small {
            grid-column: span 1;
          }
          .feat-split-row {
            display: flex;
            flex-direction: column-reverse;
            text-align: center;
            gap: 2rem;
          }
          .feat-check-item { justify-content: center; }
          .feat-cta-card { padding: 3rem 1.5rem; }
          .feat-cta-title { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
};

export default FeaturesPage;
