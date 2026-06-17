import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle, BookOpen, ShieldCheck, Bell } from 'lucide-react';
import Footer from '../../../components/Landing/Footer';

const faqs = [
  {
    category: 'Getting Started',
    icon: BookOpen,
    color: '#e0f2f1',
    iconColor: '#00A896',
    questions: [
      { q: 'How do I create a FamilyCare account?', a: 'Click "Get Started" on the homepage or go to /register. You can sign up with your email address or use Google OAuth for a one-click login. After registration you will be asked to set up your profile and add your first parent.' },
      { q: 'How do I add my parent or elderly relative?', a: 'After logging in, go to the Parents section in your sidebar and click "Add Parent". Fill in their details, health information, and caregiver assignments. You can add multiple family members to one account.' },
      { q: 'Can I use FamilyCare on my mobile phone?', a: 'Yes — FamilyCare is fully responsive and works on all modern browsers on iOS and Android. A dedicated mobile app is currently in development and will be released in Q4 2026.' },
    ],
  },
  {
    category: 'Health Monitoring',
    icon: ShieldCheck,
    color: '#eff6ff',
    iconColor: '#2563eb',
    questions: [
      { q: 'How are health logs recorded?', a: 'Caregivers log daily health observations (vitals, mood, meals, medication) through their dashboard. These logs are instantly visible to family members. You can also set up automated reminders to ensure logs are submitted on time.' },
      { q: 'Who can see my parent\'s health data?', a: 'Only verified family members and assigned caregivers can view health records. All data is encrypted at rest and in transit using AES-256 encryption. You control who has access from your Settings page.' },
      { q: 'Can I export health records?', a: 'Yes. From the Health Feed, click the Export button to download a PDF or CSV of all health logs for a selected date range. This is useful for sharing with doctors.' },
    ],
  },
  {
    category: 'Alerts & Emergencies',
    icon: Bell,
    color: '#fef2f2',
    iconColor: '#dc2626',
    questions: [
      { q: 'How do emergency alerts work?', a: 'Caregivers can trigger a one-click emergency alert from their dashboard. This immediately notifies all family members via email, push notification, and in-app alert. The alert includes the caregiver\'s location and a status update.' },
      { q: 'Can I customise which alerts I receive?', a: 'Yes. In Settings → Notifications, you can choose which events trigger alerts: missed medications, abnormal vitals, caregiver check-in delays, and emergencies. You can also set quiet hours.' },
      { q: 'What happens if an alert is sent by mistake?', a: 'Caregivers can cancel a false-alarm alert within 60 seconds. After cancellation, all family members receive an "all clear" notification automatically.' },
    ],
  },
  {
    category: 'Account & Billing',
    icon: MessageCircle,
    color: '#f0fdf4',
    iconColor: '#16a34a',
    questions: [
      { q: 'Is FamilyCare free to use?', a: 'FamilyCare offers a free tier that supports one parent and one caregiver. Premium plans unlock multiple family members, advanced analytics, and priority support. See our Pricing page for details.' },
      { q: 'How do I cancel my subscription?', a: 'You can cancel anytime from Settings → Billing → Cancel Subscription. You will retain access until the end of your current billing period. We do not charge cancellation fees.' },
      { q: 'How do I contact support?', a: 'Use the chat widget in the bottom-right corner of any page. You can also email support@familycare.app. Our team responds within 24 hours on business days.' },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid #EDF2F7',
        overflow: 'hidden',
        transition: 'background 0.2s',
        borderRadius: open ? '10px' : '0',
        background: open ? '#FAFFFE' : 'transparent',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '1.2rem 0', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', cursor: 'pointer', gap: '1rem',
        }}
      >
        <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1A202C', lineHeight: '1.4' }}>{q}</span>
        <ChevronDown
          size={18}
          color="#00A896"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}
        />
      </button>
      <div style={{
        maxHeight: open ? '300px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.23,1,0.32,1)',
      }}>
        <p style={{ fontSize: '0.92rem', color: '#718096', lineHeight: '1.7', paddingBottom: '1.2rem', margin: 0, paddingRight: '2rem' }}>{a}</p>
      </div>
    </div>
  );
};

const HelpCenter = () => {
  const [search, setSearch] = useState('');

  const filtered = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.questions.length > 0);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1A202C', background: '#fff' }}>
      <style>{`
        @keyframes hc-fade { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .hc-section { animation: hc-fade 0.5s ease both; }
        .hc-search-wrap {
          display:flex; align-items:center; gap:0.7rem; max-width:500px; margin:0 auto;
          background:#fff; border:2px solid #E2E8F0; border-radius:14px; padding:0.7rem 1.2rem;
          box-shadow:0 4px 20px rgba(0,0,0,0.06); transition:border-color 0.2s;
        }
        .hc-search-wrap:focus-within { border-color:#00A896; }
        .hc-search-wrap input { border:none; outline:none; font-size:1rem; color:#1A202C; flex:1; background:transparent; }
        .hc-cat-card {
          background:#fff; border:1.5px solid #EDF2F7; border-radius:16px; padding:2rem;
          transition:box-shadow 0.3s, transform 0.3s;
        }
        .hc-cat-card:hover { box-shadow:0 12px 30px rgba(0,0,0,0.07); transform:translateY(-2px); }
      `}</style>

      {/* Hero */}
      <header style={{ padding: '140px 5% 60px', background: 'linear-gradient(135deg,#f0fdf9 0%,#fff 60%)', textAlign: 'center' }}>
        <span style={{ display:'inline-block', background:'#e0f2f1', color:'#00796b', fontSize:'0.75rem', fontWeight:'700', letterSpacing:'1.2px', padding:'5px 14px', borderRadius:'20px', marginBottom:'1.2rem' }}>
          HELP CENTER
        </span>
        <h1 style={{ fontSize:'clamp(2.2rem,5vw,3.2rem)', fontWeight:'800', color:'#1A202C', marginBottom:'1rem' }}>
          How can we <span style={{ color:'#00A896' }}>help you?</span>
        </h1>
        <p style={{ color:'#718096', fontSize:'1rem', marginBottom:'2rem' }}>Search our knowledge base or browse by category below.</p>
        <div className="hc-search-wrap">
          <Search size={18} color="#718096" />
          <input
            placeholder="Search for answers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* FAQ sections */}
      <section style={{ padding: '60px 5% 80px', maxWidth: '860px', margin: '0 auto' }} className="hc-section">
        {filtered.length === 0 ? (
          <p style={{ textAlign:'center', color:'#718096', padding:'4rem 0' }}>No results found. Try a different search term.</p>
        ) : filtered.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div key={i} className="hc-cat-card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'1.2rem' }}>
                <div style={{ width:'38px', height:'38px', background:cat.color, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={18} color={cat.iconColor} />
                </div>
                <h3 style={{ fontWeight:'700', fontSize:'1.05rem', color:'#1A202C', margin:0 }}>{cat.category}</h3>
              </div>
              {cat.questions.map((item, j) => <FAQItem key={j} {...item} />)}
            </div>
          );
        })}

        {/* Contact CTA */}
        <div style={{ marginTop:'3rem', background:'linear-gradient(135deg,#00A896,#00796b)', borderRadius:'16px', padding:'2.5rem', textAlign:'center', color:'white' }}>
          <MessageCircle size={32} style={{ marginBottom:'1rem', opacity:0.9 }} />
          <h3 style={{ fontWeight:'800', fontSize:'1.3rem', marginBottom:'0.5rem' }}>Still need help?</h3>
          <p style={{ opacity:0.85, marginBottom:'1.5rem', fontSize:'0.95rem' }}>Our support team replies within 24 hours on business days.</p>
          <a href="mailto:support@familycare.app" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'white', color:'#00A896', padding:'0.75rem 1.8rem', borderRadius:'10px', fontWeight:'700', textDecoration:'none', fontSize:'0.95rem' }}>
            Contact Support
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpCenter;
