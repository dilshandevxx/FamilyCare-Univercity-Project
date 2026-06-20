import React from 'react';
import { Shield, Lock, Eye, UserCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import Footer from '../../../components/Landing/Footer';

const safetyFeatures = [
  {
    icon: Lock,
    color: '#e0f2f1',
    iconColor: '#00A896',
    title: 'AES-256 Encryption',
    desc: 'All health data, messages, and files are encrypted at rest and in transit using military-grade AES-256 encryption. Your data is never stored in plain text.',
  },
  {
    icon: UserCheck,
    color: '#eff6ff',
    iconColor: '#2563eb',
    title: 'Verified Caregivers',
    desc: 'Every caregiver on FamilyCare goes through a background verification process. Only approved caregivers appear in search results and can be assigned to your family.',
  },
  {
    icon: Eye,
    color: '#fff7ed',
    iconColor: '#ea580c',
    title: 'Privacy Controls',
    desc: 'You decide who sees what. Granular privacy settings let you control which family members and caregivers can view specific health records, alerts, and communications.',
  },
  {
    icon: AlertTriangle,
    color: '#fef2f2',
    iconColor: '#dc2626',
    title: 'Emergency Protocols',
    desc: 'One-click emergency alerts reach all designated contacts within seconds. Caregivers follow documented emergency response protocols reviewed by licensed healthcare advisors.',
  },
  {
    icon: Shield,
    color: '#f0fdf4',
    iconColor: '#16a34a',
    title: 'HIPAA-Aligned Practices',
    desc: 'Our data handling practices are aligned with HIPAA standards for health information privacy. We conduct quarterly security audits and penetration tests.',
  },
  {
    icon: CheckCircle,
    color: '#faf5ff',
    iconColor: '#7c3aed',
    title: 'Two-Factor Authentication',
    desc: 'Protect your account with two-factor authentication via SMS or authenticator app. 2FA is strongly recommended and enforced for all caregiver accounts.',
  },
];

const tourSteps = [
  { step: '01', title: 'Register & Set Up', desc: 'Create your free account, add your parent\'s profile with health background, and set notification preferences.' },
  { step: '02', title: 'Assign a Caregiver', desc: 'Browse verified caregivers, review their profiles and availability, and send an assignment request directly from the platform.' },
  { step: '03', title: 'Go Live', desc: 'Your caregiver starts logging daily health observations. You receive real-time updates from anywhere in the world.' },
  { step: '04', title: 'Monitor & Act', desc: 'View health trends in the analytics dashboard. Get instant alerts for abnormal readings or missed check-ins.' },
];

const ToursAndSafety = () => (
  <div style={{ fontFamily: "'Inter', sans-serif", color: '#1A202C', background: '#fff' }}>
    <style>{`
      @keyframes ts-fade { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      .ts-hero { animation: ts-fade 0.6s ease both; }
      .ts-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
      .ts-card  {
        border:1.5px solid #EDF2F7; border-radius:16px; padding:1.8rem;
        transition:transform 0.3s ease,box-shadow 0.3s ease;
        background:#fff;
      }
      .ts-card:hover { transform:translateY(-6px); box-shadow:0 20px 40px rgba(0,0,0,0.08); }
      .ts-tour-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; }
      .ts-step {
        background:#F8FAFC; border-radius:16px; padding:1.8rem 1.5rem;
        border-left:4px solid #00A896; transition:box-shadow 0.3s;
      }
      .ts-step:hover { box-shadow:0 12px 28px rgba(0,168,150,0.1); }
      @media(max-width:1024px){
        .ts-grid{grid-template-columns:repeat(2,1fr)!important}
        .ts-tour-steps{grid-template-columns:repeat(2,1fr)!important}
      }
      @media(max-width:600px){
        .ts-grid{grid-template-columns:1fr!important}
        .ts-tour-steps{grid-template-columns:1fr!important}
      }
    `}</style>

    {/* Hero */}
    <header style={{ padding:'140px 5% 80px', background:'linear-gradient(135deg,#f0fdf9 0%,#fff 60%)', textAlign:'center' }}>
      <div className="ts-hero">
        <span style={{ display:'inline-block', background:'#e0f2f1', color:'#00796b', fontSize:'0.75rem', fontWeight:'700', letterSpacing:'1.2px', padding:'5px 14px', borderRadius:'20px', marginBottom:'1.2rem' }}>
          TOURS &amp; SAFETY
        </span>
        <h1 style={{ fontSize:'clamp(2.2rem,5vw,3.4rem)', fontWeight:'800', color:'#1A202C', lineHeight:'1.2', marginBottom:'1rem' }}>
          Platform Tour &amp; <span style={{ color:'#00A896' }}>Safety Commitment</span>
        </h1>
        <p style={{ color:'#718096', fontSize:'1.05rem', maxWidth:'540px', margin:'0 auto', lineHeight:'1.7' }}>
          Understand how FamilyCare works and the measures we take to keep your family's data and loved ones safe.
        </p>
      </div>
    </header>

    {/* Platform Tour */}
    <section style={{ padding:'80px 5%', background:'#fff' }}>
      <div style={{ maxWidth:'1080px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <h2 style={{ fontWeight:'800', fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'#1A202C', marginBottom:'0.5rem' }}>How It Works — Platform Tour</h2>
          <p style={{ color:'#718096', fontSize:'0.95rem' }}>Get started in four simple steps.</p>
        </div>
        <div className="ts-tour-steps">
          {tourSteps.map(({ step, title, desc }) => (
            <div key={step} className="ts-step">
              <div style={{ fontSize:'2rem', fontWeight:'800', color:'#00A896', marginBottom:'0.75rem', lineHeight:1 }}>{step}</div>
              <h4 style={{ fontWeight:'700', fontSize:'1rem', marginBottom:'0.5rem', color:'#1A202C' }}>{title}</h4>
              <p style={{ fontSize:'0.88rem', color:'#718096', lineHeight:'1.6', margin:0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Safety Features */}
    <section style={{ padding:'80px 5%', background:'#F8FAFC' }}>
      <div style={{ maxWidth:'1080px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <h2 style={{ fontWeight:'800', fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'#1A202C', marginBottom:'0.5rem' }}>Our Safety Standards</h2>
          <p style={{ color:'#718096', fontSize:'0.95rem' }}>Enterprise-grade protection built for families.</p>
        </div>
        <div className="ts-grid">
          {safetyFeatures.map(({ icon: Icon, color, iconColor, title, desc }) => (
            <div key={title} className="ts-card">
              <div style={{ width:'44px', height:'44px', background:color, borderRadius:'11px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
                <Icon size={20} color={iconColor} />
              </div>
              <h4 style={{ fontWeight:'700', fontSize:'1rem', color:'#1A202C', marginBottom:'0.5rem' }}>{title}</h4>
              <p style={{ fontSize:'0.88rem', color:'#718096', lineHeight:'1.6', margin:0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Trust Banner */}
    <section style={{ padding:'60px 5%', background:'linear-gradient(135deg,#00A896,#00796b)', textAlign:'center', color:'white' }}>
      <Shield size={40} style={{ marginBottom:'1rem', opacity:0.9 }} />
      <h2 style={{ fontWeight:'800', fontSize:'clamp(1.4rem,3vw,2rem)', marginBottom:'0.75rem' }}>Your Trust is Our Product</h2>
      <p style={{ opacity:0.85, fontSize:'1rem', maxWidth:'480px', margin:'0 auto', lineHeight:'1.7' }}>
        We will never sell, share, or monetize your family's personal health data. Our business is built on subscriptions, not data.
      </p>
    </section>

    <Footer />
  </div>
);

export default ToursAndSafety;
