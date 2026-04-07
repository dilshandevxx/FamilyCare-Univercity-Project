import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Shield, Bell, BarChart2, LayoutDashboard,
  Users, ArrowRight, Play, CheckCircle, ChevronRight,
  Heart, Clock, Smartphone, Star
} from 'lucide-react';
import Footer from '../../../components/Landing/Footer';

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

/* For Family Members features */
const familyFeatures = [
  { text: 'Monitor vitals 24/7' },
  { text: 'Manage caregiver check-ins' },
  { text: 'Receive critical alerts' },
];

/* For Caregivers features */
const caregiverFeatures = [
  { text: 'Organised daily logging' },
  { text: 'Patient management dashboard' },
  { text: 'Direct emergency reporting' },
];

/* ─── Sub-components ──────────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, color, iconColor, title, description, highlights }) => (
  <div className="fc-card">
    <div className="fc-card__icon" style={{ background: color }}>
      <Icon size={22} color={iconColor} />
    </div>
    <h3 className="fc-card__title">{title}</h3>
    <p className="fc-card__desc">{description}</p>
    {highlights.map((h) => (
      <span key={h} className="fc-card__tag" style={{ color: iconColor, background: color }}>
        {h}
      </span>
    ))}
  </div>
);

const CheckItem = ({ text }) => (
  <div className="fp-check">
    <CheckCircle size={18} color="#00A896" />
    <span>{text}</span>
  </div>
);

/* ─── Main Page ───────────────────────────────────────────────────── */
const FeaturesPage = () => {
  return (
    <div className="fp-root">

      {/* ── Hero ── */}
      <header className="fp-hero">
        <div className="container fp-hero__inner">
          <div className="fp-hero__content">
            <span className="fp-badge">INNOVATION &amp; CARE</span>
            <h1 className="fp-hero__title">
              Powerful Features<br />for <span className="fp-teal">Smarter</span><br />Eldercare
            </h1>
            <p className="fp-hero__subtitle">
              A digital sanctuary designed to bridge the gap between clinical precision and family warmth. Monitor, manage, and protect your loved ones with an intimate-grade interface.
            </p>
            <div className="fp-hero__actions">
              <a href="#features" className="fp-btn fp-btn--primary fp-btn--lg">
                Explore Core Features
              </a>
              <button className="fp-btn fp-btn--video">
                <span className="fp-play-icon"><Play size={14} fill="currentColor" /></span>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="fp-hero__visual">
            <div className="fp-hero__card fp-hero__card--main">
              <div className="fp-hero__card-head">
                <div className="fp-hero__avatar" />
                <div>
                  <div className="fp-skeleton fp-skeleton--sm" style={{ width: '80px' }} />
                  <div className="fp-skeleton fp-skeleton--xs" style={{ width: '56px', marginTop: '4px' }} />
                </div>
                <span className="fp-status fp-status--active">Active</span>
                <span className="fp-status fp-status--logged">Logged</span>
              </div>
              <div className="fp-hero__chart">
                {[60, 80, 55, 90, 70, 85, 65, 95, 75].map((h, i) => (
                  <div key={i} className="fp-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="fp-hero__icon-row">
                <div className="fp-icon-chip fp-icon-chip--green"><Heart size={14} /></div>
                <div className="fp-icon-chip fp-icon-chip--orange"><Activity size={14} /></div>
                <div className="fp-icon-chip fp-icon-chip--blue"><Shield size={14} /></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Core Features Grid ── */}
      <section id="features" className="fp-section fp-section--light">
        <div className="container">
          <div className="fp-section__head">
            <h2 className="fp-section__title">Integrated Health Ecosystem</h2>
            <p className="fp-section__sub">
              Everything you need to create excellence in care, unified in a single, intuitive dashboard.
            </p>
          </div>
          <div className="fc-grid">
            {coreFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tailored Experiences ── */}
      <section className="fp-section fp-section--white">
        <div className="container">
          <div className="fp-section__head">
            <p className="fp-eyebrow">FOR EVERY STAKEHOLDER</p>
            <h2 className="fp-section__title">Tailored Experiences for Every Stakeholder</h2>
          </div>

          {/* Row 1 – Family Members */}
          <div className="fp-row fp-row--reverse">
            <div className="fp-row__text">
              <span className="fp-eyebrow">FOR FAMILY MEMBERS</span>
              <h3 className="fp-row__heading">Peace of Mind, Personalized.</h3>
              <p className="fp-row__desc">
                Stay connected on all your parents' needs, from anywhere in the world. View family health logs, receive instant alerts, and manage care schedules — all in a simple, high-end interface.
              </p>
              <div className="fp-checks">
                {familyFeatures.map((f) => <CheckItem key={f.text} {...f} />)}
              </div>
            </div>
            <div className="fp-row__visual">
              <div className="fp-mockup fp-mockup--teal">
                <div className="fp-mockup__bar" />
                <div className="fp-mockup__line fp-mockup__line--lg" />
                <div className="fp-mockup__line fp-mockup__line--md" />
                <div className="fp-mockup__row">
                  <div className="fp-mockup__chip fp-chip--teal"><Heart size={12} /></div>
                  <div className="fp-mockup__chip-label">
                    <div className="fp-skeleton fp-skeleton--xs" style={{ width: '64px' }} />
                    <div className="fp-skeleton fp-skeleton--xs" style={{ width: '48px', marginTop: '4px' }} />
                  </div>
                </div>
                <div className="fp-mockup__mini-chart">
                  {[40, 65, 50, 80, 60, 75, 55, 85].map((h, i) => (
                    <div key={i} className="fp-mini-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="fp-mockup__family-avatar">
                  <img src="/assets/images/family_app.png" alt="Family App" className="fp-family-img" style={{ objectFit: 'cover' }} />
                  <div className="fp-mockup__line fp-mockup__line--sm" style={{ marginTop: '8px' }} />
                  <div className="fp-mockup__line fp-mockup__line--xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 – Caregivers */}
          <div className="fp-row" style={{ marginTop: '5rem' }}>
            <div className="fp-row__visual">
              <div className="fp-mockup fp-mockup--blue">
                <div className="fp-mockup__bar" />
                <div className="fp-caregiver-avatar">
                  <img src="/assets/images/caregiver_tablet.png" alt="Caregiver Tablet" className="fp-caregiver-img" style={{ objectFit: 'cover' }} />
                </div>
                <div className="fp-mockup__line fp-mockup__line--md" style={{ marginTop: '12px' }} />
                <div className="fp-mockup__line fp-mockup__line--sm" />
                <div className="fp-mockup__statrow">
                  <div className="fp-stat">
                    <Activity size={12} color="#2563eb" />
                    <div className="fp-skeleton fp-skeleton--xs" style={{ width: '48px' }} />
                  </div>
                  <div className="fp-stat">
                    <Clock size={12} color="#2563eb" />
                    <div className="fp-skeleton fp-skeleton--xs" style={{ width: '40px' }} />
                  </div>
                </div>
                <div className="fp-mockup__mini-chart">
                  {[30, 55, 45, 70, 50, 80, 60, 90].map((h, i) => (
                    <div key={i} className="fp-mini-bar fp-mini-bar--blue" style={{ height: `${h}%` }} />
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
                {caregiverFeatures.map((f) => <CheckItem key={f.text} {...f} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="fp-cta">
        <div className="container fp-cta__inner">
          <h2 className="fp-cta__title">Start monitoring your loved ones today</h2>
          <p className="fp-cta__sub">
            Join thousands of families who have found peace of mind through the Living Sanctuary digital ecosystem.
          </p>
          <div className="fp-cta__actions">
            <Link to="/register" className="fp-btn fp-btn--primary fp-btn--lg">Create Free Account</Link>
            <button className="fp-btn fp-btn--outline-white fp-btn--lg">Schedule a Demo</button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Styles ── */}
      <style>{`
        /* ---- Reset & Root ---- */
        .fp-root {
          font-family: 'Inter', sans-serif;
          color: #1A202C;
        }



        /* ---- Buttons ---- */
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
        }
        .fp-btn--primary {
          background: #00A896;
          color: white;
        }
        .fp-btn--primary:hover { background: #008f80; transform: translateY(-1px); }
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
        .fp-btn--video:hover { background: #EDF2F7; }
        .fp-btn--lg { padding: 0.9rem 2rem; font-size: 1rem; border-radius: 10px; }
        .fp-btn--outline-white {
          background: transparent;
          color: white;
          border: 1px solid rgba(255,255,255,0.35);
        }
        .fp-btn--outline-white:hover { background: rgba(255,255,255,0.1); }
        .fp-play-icon {
          width: 28px; height: 28px;
          background: #00A896;
          color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        /* ---- Badge ---- */
        .fp-badge {
          display: inline-block;
          background: #e0f2f1;
          color: #00796b;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 1.25rem;
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
        .fp-teal { color: #00A896; }

        /* ---- Hero ---- */
        .fp-hero {
          padding: 160px 0 80px;
          background: #fff;
        }
        .fp-hero__inner {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
        }
        .fp-hero__title {
          font-size: clamp(2.6rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          color: #1A202C;
        }
        .fp-hero__subtitle {
          font-size: 1.05rem;
          color: #718096;
          line-height: 1.7;
          max-width: 500px;
          margin-bottom: 2.2rem;
        }
        .fp-hero__actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Hero Visual Card */
        .fp-hero__visual {
          display: flex;
          justify-content: center;
        }
        .fp-hero__card {
          background: #1A202C;
          border-radius: 20px;
          padding: 1.5rem;
          width: 300px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.18);
        }
        .fp-hero__card--main { background: #1E2A38; }
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
        .fp-status {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
          margin-left: auto;
        }
        .fp-status--active { background: #dcfce7; color: #16a34a; }
        .fp-status--logged { background: #eff6ff; color: #2563eb; margin-left: 0.4rem; }
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
          transition: height 0.3s;
        }
        .fp-hero__icon-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .fp-icon-chip {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: white;
        }
        .fp-icon-chip--green { background: #16a34a; }
        .fp-icon-chip--orange { background: #ea580c; }
        .fp-icon-chip--blue { background: #2563eb; }

        /* Skeleton lines */
        .fp-skeleton {
          background: #2D3748;
          border-radius: 4px;
        }
        .fp-skeleton--sm { height: 12px; }
        .fp-skeleton--xs { height: 8px; }

        /* ---- Section ---- */
        .fp-section { padding: 100px 0; }
        .fp-section--light { background: #F8FAFC; }
        .fp-section--white { background: #fff; }
        .fp-section__head {
          text-align: center;
          margin-bottom: 4rem;
        }
        .fp-section__title {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 800;
          margin-bottom: 1rem;
          color: #1A202C;
        }
        .fp-section__sub {
          color: #718096;
          font-size: 1.05rem;
          max-width: 550px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ---- Feature Grid ---- */
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
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .fc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.07);
        }
        .fc-card__icon {
          width: 46px; height: 46px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.3rem;
        }
        .fc-card__title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1A202C;
        }
        .fc-card__desc {
          font-size: 0.9rem;
          color: #718096;
          line-height: 1.6;
          flex: 1;
        }
        .fc-card__tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          margin-right: 0.3rem;
          margin-top: 0.2rem;
        }

        /* ---- Stakeholder Rows ---- */
        .fp-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .fp-row--reverse {
          direction: rtl;
        }
        .fp-row--reverse > * { direction: ltr; }
        .fp-row__heading {
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 800;
          margin-bottom: 1rem;
          color: #1A202C;
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
        }

        /* ---- Mockup Cards ---- */
        .fp-row__visual {
          display: flex;
          justify-content: center;
        }
        .fp-mockup {
          width: 280px;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        .fp-mockup--teal { background: linear-gradient(145deg, #e0f2f1, #b2dfdb); }
        .fp-mockup--blue { background: linear-gradient(145deg, #eff6ff, #bfdbfe); }
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
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin: 1rem 0;
        }
        .fp-mockup__chip {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .fp-chip--teal { background: #00A896; color: white; }
        .fp-chip--blue { background: #2563eb; color: white; }
        .fp-mockup__chip-label { flex: 1; }
        .fp-mockup__mini-chart {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 48px;
          margin-top: 1rem;
        }
        .fp-mini-bar {
          flex: 1;
          background: rgba(0,168,150,0.4);
          border-radius: 2px 2px 0 0;
        }
        .fp-mini-bar--blue { background: rgba(37,99,235,0.4); }
        .fp-mockup__family-avatar {
          margin-top: 1rem;
        }
        .fp-family-img {
          width: 100%;
          height: 80px;
          background: linear-gradient(135deg, #00A89640, #00A89620);
          border-radius: 10px;
        }
        .fp-caregiver-avatar {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .fp-caregiver-img {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb40, #2563eb20);
        }
        .fp-mockup__statrow {
          display: flex;
          gap: 0.75rem;
          margin: 1rem 0;
        }
        .fp-stat {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.6);
          border-radius: 8px;
          padding: 6px 10px;
        }

        /* ---- CTA ---- */
        .fp-cta {
          padding: 90px 0;
          background: linear-gradient(135deg, #00A896 0%, #00796b 100%);
        }
        .fp-cta__inner {
          text-align: center;
          color: white;
        }
        .fp-cta__title {
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 800;
          margin-bottom: 1.2rem;
          line-height: 1.2;
        }
        .fp-cta__sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.8);
          max-width: 520px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }
        .fp-cta__actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .fp-cta .fp-btn--primary {
          background: white;
          color: #00A896;
        }
        .fp-cta .fp-btn--primary:hover { background: #F0FFF4; }

        /* ---- Responsive ---- */
        @media (max-width: 1024px) {
          .fc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .fp-nav__links { display: none; }
          .fp-hero__inner {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .fp-hero__subtitle { max-width: 100%; margin-left: auto; margin-right: auto; }
          .fp-hero__actions { justify-content: center; }
          .fp-hero__visual { display: none; }
          .fc-grid { grid-template-columns: 1fr; }
          .fp-row, .fp-row--reverse {
            grid-template-columns: 1fr;
            direction: ltr;
            text-align: center;
            gap: 2.5rem;
          }
          .fp-row--reverse > * { direction: ltr; }
          .fp-checks { align-items: center; }
          .fp-row__visual { order: -1; }
        }
        @media (max-width: 480px) {
          .fp-hero { padding: 100px 0 60px; }
          .fp-section { padding: 70px 0; }
          .fp-cta { padding: 60px 0; }
        }
      `}</style>
    </div>
  );
};

export default FeaturesPage;
