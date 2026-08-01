import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const imageRef = useRef(null);

  const handleImageMouseMove = (e) => {
    const el = imageRef.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale(1.02)`;
  };
  const handleImageMouseLeave = () => {
    imageRef.current.style.transform = '';
  };

  return (
    <>
    <style>{`
      /* ── Keyframes ── */
      @keyframes hero-float {
        0%,100% { transform:translateY(0px); }
        50%      { transform:translateY(-12px); }
      }
      @keyframes hero-float-alt {
        0%,100% { transform:translateY(0px); }
        50%      { transform:translateY(9px); }
      }
      @keyframes hero-live-pulse {
        0%,100% { box-shadow:0 0 0 0 rgba(0,168,150,0.55); }
        70%      { box-shadow:0 0 0 8px rgba(0,168,150,0); }
      }
      @keyframes hero-fade-up {
        from { opacity:0; transform:translateY(28px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes hero-blob-1 {
        0%,100% { transform:scale(1) translate(0,0); }
        33%      { transform:scale(1.1) translate(30px,-20px); }
        66%      { transform:scale(0.95) translate(-15px,20px); }
      }
      @keyframes hero-blob-2 {
        0%,100% { transform:scale(1); }
        50%      { transform:scale(1.08) translate(-20px,15px); }
      }
      @keyframes hero-dot-grid-shift {
        0%,100% { background-position:0 0; }
        50%      { background-position:16px 16px; }
      }
      @keyframes hero-badge-glow {
        0%,100% { box-shadow:0 0 0 0 rgba(0,168,150,0.3); }
        50%      { box-shadow:0 0 0 6px rgba(0,168,150,0); }
      }
      @keyframes hero-shine {
        0%   { left:-80%; }
        100% { left:120%; }
      }
      @keyframes hero-gradient-text {
        0%,100% { background-position:0% 50%; }
        50%      { background-position:100% 50%; }
      }
      @keyframes hero-avatar-pop {
        0%   { transform:scale(0.8); opacity:0; }
        70%  { transform:scale(1.05); }
        100% { transform:scale(1); opacity:1; }
      }
      @keyframes hero-card-float-in {
        from { opacity:0; transform:translateY(16px) scale(0.95); }
        to   { opacity:1; transform:translateY(0) scale(1); }
      }
      @keyframes hero-graph-draw {
        from { stroke-dashoffset:300; }
        to   { stroke-dashoffset:0; }
      }

      /* ── Hero section ── */
      section.hero {
        min-height:100vh;
        display:flex; align-items:center;
        padding-top:88px; padding-bottom:72px;
        position:relative; overflow:hidden;
        background-color:#fff;
      }

      /* Animated dot-grid texture */
      section.hero::before {
        content:'';
        position:absolute; inset:0;
        background-image:radial-gradient(circle,rgba(0,168,150,0.07) 1px,transparent 1px);
        background-size:32px 32px;
        pointer-events:none; z-index:0;
        animation:hero-dot-grid-shift 20s ease-in-out infinite;
      }

      /* ── Background blobs ── */
      .hero-blob {
        position:absolute; border-radius:50%;
        pointer-events:none; z-index:0; filter:blur(70px);
      }
      .hero-blob--1 {
        width:700px; height:700px; top:-200px; right:-180px;
        background:radial-gradient(circle,rgba(0,168,150,0.1) 0%,transparent 65%);
        animation:hero-blob-1 14s ease-in-out infinite;
      }
      .hero-blob--2 {
        width:500px; height:500px; bottom:-120px; left:-120px;
        background:radial-gradient(circle,rgba(0,168,150,0.06) 0%,transparent 65%);
        animation:hero-blob-2 18s ease-in-out infinite;
      }
      .hero-blob--3 {
        width:300px; height:300px; top:40%; left:35%;
        background:radial-gradient(circle,rgba(37,99,235,0.04) 0%,transparent 65%);
        animation:hero-blob-2 10s ease-in-out infinite reverse;
      }

      section.hero .hero-inner { position:relative; z-index:1; width:100%; }

      /* ── Staggered entrance animations ── */
      section.hero .hero-badge    { animation:hero-fade-up 0.6s 0.05s ease both; }
      section.hero .hero-headline { animation:hero-fade-up 0.7s 0.15s ease both; }
      section.hero .hero-subtext  { animation:hero-fade-up 0.7s 0.25s ease both; }
      section.hero .hero-cta-row  { animation:hero-fade-up 0.7s 0.35s ease both; }
      section.hero .social-proof  { animation:hero-fade-up 0.7s 0.45s ease both; }
      section.hero .hero-visual   { animation:hero-fade-up 0.85s 0.2s ease both; }

      /* ── Badge ── */
      section.hero .hero-badge {
        display:inline-flex; align-items:center; gap:8px;
        background:rgba(0,168,150,0.08);
        border:1px solid rgba(0,168,150,0.3);
        color:var(--color-primary);
        font-weight:700; text-transform:uppercase;
        letter-spacing:1.2px; font-size:0.76rem;
        padding:6px 16px 6px 10px; border-radius:100px;
        margin-bottom:1.4rem;
        animation:hero-badge-glow 3s ease-in-out infinite, hero-fade-up 0.6s 0.05s ease both;
        transition:transform 0.2s ease, box-shadow 0.2s ease;
      }
      section.hero .hero-badge:hover { transform:scale(1.04); }

      /* ── Animated gradient "anytime, anywhere" ── */
      section.hero .text-teal {
        background:linear-gradient(90deg,#00A896,#00d4bf,#00A896,#009688);
        background-size:300% auto;
        -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        background-clip:text;
        animation:hero-gradient-text 4s linear infinite;
      }

      /* ── Buttons ── */
      section.hero .hero-btn-primary {
        display:inline-flex; align-items:center; gap:8px;
        background:var(--color-primary); color:white;
        border:none; padding:14px 32px; border-radius:50px;
        font-size:1rem; font-weight:600; cursor:pointer;
        transition:transform 0.25s ease, box-shadow 0.25s ease, background 0.2s;
        box-shadow:0 4px 18px rgba(0,168,150,0.38);
        position:relative; overflow:hidden;
      }
      section.hero .hero-btn-primary::after {
        content:''; position:absolute; top:0; left:-80%;
        width:60%; height:100%;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
        pointer-events:none;
      }
      section.hero .hero-btn-primary:hover::after { animation:hero-shine 0.55s ease forwards; }
      section.hero .hero-btn-primary:hover {
        transform:translateY(-3px);
        box-shadow:0 12px 30px rgba(0,168,150,0.5);
        background:var(--color-primary-dark);
      }
      section.hero .hero-btn-primary:active { transform:translateY(-1px); }
      section.hero .hero-btn-primary .hero-btn-arrow {
        transition:transform 0.25s ease;
      }
      section.hero .hero-btn-primary:hover .hero-btn-arrow { transform:translateX(4px); }

      section.hero .hero-btn-secondary {
        display:inline-flex; align-items:center; gap:8px;
        background:white; color:#374151;
        border:1.5px solid #D1D5DB; padding:14px 32px;
        border-radius:50px; font-size:1rem; font-weight:600; cursor:pointer;
        transition:border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
      }
      section.hero .hero-btn-secondary:hover {
        border-color:var(--color-primary);
        color:var(--color-primary);
        background:rgba(0,168,150,0.04);
        transform:translateY(-2px);
        box-shadow:0 6px 16px rgba(0,0,0,0.07);
      }

      /* ── Image wrapper ── */
      .hero-img-wrap {
        border-radius:28px; overflow:hidden;
        box-shadow:0 32px 64px -12px rgba(0,168,150,0.22);
        border:1px solid rgba(0,168,150,0.14);
        transition:transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease;
        will-change:transform;
      }
      .hero-img-wrap:hover { box-shadow:0 40px 80px -12px rgba(0,168,150,0.3); }

      /* ── Floating cards ── */
      .hero-float-card {
        transition:transform 0.3s ease, box-shadow 0.3s ease;
      }
      .hero-float-card:hover {
        transform:scale(1.04) translateY(-4px) !important;
        box-shadow:0 24px 50px rgba(0,0,0,0.18) !important;
      }

      /* Animated SVG polyline */
      .hero-graph-line {
        stroke-dasharray:300;
        stroke-dashoffset:300;
        animation:hero-graph-draw 1.8s 0.5s ease forwards;
      }

      /* Avatar stacked circles */
      .hero-avatar-circle {
        transition:transform 0.2s ease;
        animation:hero-avatar-pop 0.5s ease both;
      }
      .hero-avatar-circle:hover { transform:scale(1.15) translateY(-3px) !important; }

      /* Social proof */
      .social-proof { display:flex; align-items:center; gap:1rem; }

      @media(max-width:768px){
        section.hero { padding-top:96px !important; padding-bottom:56px !important; min-height:auto !important; text-align:center; }
        section.hero .hero-grid { grid-template-columns:1fr !important; gap:2.5rem !important; }
        section.hero .hero-headline { font-size:2.2rem !important; }
        section.hero .hero-subtext  { font-size:1rem !important; margin:0 auto 2rem !important; }
        section.hero .hero-badge    { margin:0 auto 1.2rem !important; }
        section.hero .hero-visual   { display:none !important; }
        section.hero .hero-cta-row  { flex-direction:column !important; align-items:center !important; }
        section.hero .hero-btn-primary,
        section.hero .hero-btn-secondary { width:100%; justify-content:center; max-width:340px; }
        section.hero .social-proof  { justify-content:center; }
      }
    `}</style>

    <section className="hero">
      {/* Animated background blobs */}
      <div className="hero-blob hero-blob--1" />
      <div className="hero-blob hero-blob--2" />
      <div className="hero-blob hero-blob--3" />

      <div className="container hero-inner">
        <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1.15fr 1fr', gap:'4.5rem', alignItems:'center' }}>

          {/* ── Left: Content ── */}
          <div className="hero-content">
            <span className="hero-badge">
              <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'var(--color-primary)', display:'inline-block', animation:'hero-live-pulse 2s ease-in-out infinite' }} />
              Caring Beyond Distance
            </span>

            <h1 className="hero-headline" style={{ fontSize:'4.2rem', marginTop:0, marginBottom:'1.4rem', color:'#1A202C', lineHeight:1.1, letterSpacing:'-0.5px' }}>
              Stay connected with your loved ones,{' '}
              <span className="text-teal">anytime, anywhere.</span>
            </h1>

            <p className="hero-subtext" style={{ fontSize:'1.15rem', color:'var(--color-text-muted)', maxWidth:'520px', marginBottom:'2.5rem', lineHeight:1.78 }}>
              FamilyCare is a web-based platform designed for children working abroad to monitor and manage the health and daily activities of their elderly parents back home.
            </p>

            <div className="hero-cta-row" style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'3rem' }}>
              <button className="hero-btn-primary" onClick={() => navigate('/register')}>
                Get Started <ArrowRight size={17} className="hero-btn-arrow" />
              </button>
              <button className="hero-btn-secondary" onClick={() => navigate('/features')}>
                Tell me more
              </button>
            </div>

            <div className="social-proof">
              <div style={{ display:'flex' }}>
                {[
                  { bg:'linear-gradient(135deg,#00A896,#00C9B5)', delay:'0s' },
                  { bg:'linear-gradient(135deg,#F6AD55,#F06030)', delay:'0.08s' },
                  { bg:'linear-gradient(135deg,#9F7AEA,#6B46C1)', delay:'0.16s' },
                ].map(({ bg, delay }, i) => (
                  <div key={i} className="hero-avatar-circle" style={{
                    width:'38px', height:'38px', borderRadius:'50%',
                    background:bg, border:'2.5px solid white',
                    marginLeft: i === 0 ? '0' : '-11px',
                    boxShadow:'0 2px 6px rgba(0,0,0,0.13)',
                    animationDelay:delay, zIndex:3 - i,
                  }} />
                ))}
              </div>
              <span style={{ fontSize:'0.88rem', color:'var(--color-text-muted)', fontWeight:'500' }}>
                Trusted by 100k+ global users
              </span>
            </div>
          </div>

          {/* ── Right: Visual ── */}
          <div className="hero-visual" style={{ position:'relative' }}>
            <div
              ref={imageRef}
              className="hero-img-wrap"
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
            >
              <img src="/hero-couple.png" alt="Elderly Couple" style={{ width:'100%', display:'block' }} />
            </div>

            {/* Floating Health Status card */}
            <div className="hero-float-card" style={{
              position:'absolute', top:'14%', right:'-8px',
              background:'white', padding:'1rem 1.2rem', borderRadius:'18px',
              boxShadow:'0 20px 44px rgba(0,0,0,0.13)', width:'190px',
              animation:'hero-float 3.5s ease-in-out infinite, hero-card-float-in 0.6s 0.5s ease both',
              border:'1px solid rgba(0,168,150,0.12)',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                <div style={{ width:'30px', height:'30px', background:'#FFF5F5', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>❤️</div>
                <span style={{ fontWeight:'700', fontSize:'0.83rem', color:'#1a202c' }}>Health Status</span>
              </div>
              <svg width="100%" height="34" viewBox="0 0 158 34" preserveAspectRatio="none" style={{ display:'block', margin:'2px 0 6px' }}>
                <defs>
                  <linearGradient id="hg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,168,150,0.18)" />
                    <stop offset="100%" stopColor="rgba(0,168,150,0)" />
                  </linearGradient>
                </defs>
                <polygon points="0,34 0,26 22,20 44,24 70,12 90,17 110,8 132,14 158,10 158,34" fill="url(#hg2)" />
                <polyline
                  className="hero-graph-line"
                  points="0,26 22,20 44,24 70,12 90,17 110,8 132,14 158,10"
                  fill="none" stroke="var(--color-primary)" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#48BB78', display:'inline-block', animation:'hero-live-pulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize:'0.72rem', color:'var(--color-text-muted)' }}>Last update: 5m ago</span>
              </div>
            </div>

            {/* Floating Caregiver Active card */}
            <div className="hero-float-card" style={{
              position:'absolute', bottom:'10%', left:'-16px',
              background:'white', padding:'0.7rem 1rem', borderRadius:'14px',
              boxShadow:'0 14px 32px rgba(0,0,0,0.1)',
              display:'flex', alignItems:'center', gap:'10px',
              animation:'hero-float-alt 4s ease-in-out infinite, hero-card-float-in 0.6s 0.75s ease both',
              border:'1px solid rgba(0,168,150,0.1)',
            }}>
              <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(0,168,150,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'17px', transition:'transform 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15) rotate(-5deg)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >🩺</div>
              <div>
                <p style={{ margin:0, fontWeight:'700', fontSize:'0.79rem', color:'#1a202c' }}>Caregiver Active</p>
                <p style={{ margin:0, fontSize:'0.7rem', color:'#48BB78', fontWeight:'600' }}>● Online now</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;
