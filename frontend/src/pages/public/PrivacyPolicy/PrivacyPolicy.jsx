import React, { useState, useEffect, useRef } from 'react';
import Footer from '../../../components/Landing/Footer';

const sections = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us when you create an account, add family members, or communicate with caregivers. This includes:

• **Account information**: Name, email address, password, and profile photo.
• **Family member data**: Names, dates of birth, health conditions, medication lists, and emergency contacts you add to the platform.
• **Health logs**: Daily observations, vital signs, mood assessments, and caregiver notes submitted through the platform.
• **Usage data**: Pages visited, features used, session duration, and device information collected automatically through cookies and similar technologies.
• **Communications**: Messages exchanged between family members and caregivers within the platform.`,
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

• Provide, maintain, and improve the FamilyCare platform and its features.
• Send you notifications, alerts, and updates related to your family members' health and caregiver activities.
• Process payments and manage your subscription.
• Respond to your comments, questions, and customer support requests.
• Monitor platform usage to detect and prevent fraudulent or unauthorized activity.
• Comply with applicable legal obligations.

We do not sell, rent, or share your personal health data with third parties for advertising or marketing purposes.`,
  },
  {
    id: 'data-sharing',
    title: '3. Data Sharing & Disclosure',
    content: `We share your information only in the following limited circumstances:

• **Within your family account**: Health data is visible only to verified family members and assigned caregivers you explicitly approve.
• **Service providers**: We may share data with trusted third-party vendors (cloud hosting, email delivery, payment processors) who process data only on our behalf and under strict data processing agreements.
• **Legal compliance**: We may disclose information if required by law, court order, or governmental authority.
• **Business transfers**: If FamilyCare is acquired or merges with another company, your data may be transferred as part of that transaction. We will notify you before your data becomes subject to a different privacy policy.

We will never sell your personal health data to data brokers, advertisers, or insurance companies.`,
  },
  {
    id: 'data-security',
    title: '4. Data Security',
    content: `We implement industry-standard security measures to protect your information:

• **Encryption at rest**: All data stored on our servers is encrypted using AES-256 encryption.
• **Encryption in transit**: All data transmitted between your browser and our servers uses TLS 1.3.
• **Access controls**: Employee access to user data is strictly limited by role and audited regularly.
• **Two-factor authentication**: Available for all accounts and mandatory for caregiver accounts.
• **Security audits**: We conduct quarterly penetration tests and annual third-party security audits.

Despite these measures, no method of transmission over the Internet is 100% secure. We encourage you to use a strong, unique password and enable two-factor authentication.`,
  },
  {
    id: 'your-rights',
    title: '5. Your Rights & Choices',
    content: `Depending on your location, you may have the following rights regarding your personal data:

• **Access**: Request a copy of the personal data we hold about you.
• **Correction**: Request correction of inaccurate or incomplete data.
• **Deletion**: Request deletion of your account and associated data. Note: some data may be retained for legal compliance purposes.
• **Portability**: Request an export of your data in a machine-readable format (JSON or CSV).
• **Restriction**: Request that we restrict processing of your data in certain circumstances.
• **Opt-out of communications**: Unsubscribe from marketing emails at any time via the link in any email or in Settings → Notifications.

To exercise any of these rights, email us at privacy@familycare.app. We will respond within 30 days.`,
  },
  {
    id: 'cookies',
    title: '6. Cookies & Tracking',
    content: `We use cookies and similar tracking technologies to:

• Keep you logged in across browser sessions.
• Remember your preferences and settings.
• Analyze how features are used to improve the platform.
• Detect and prevent security threats.

We do not use third-party advertising cookies. You can control cookie settings in your browser, but disabling certain cookies may affect platform functionality. We provide a cookie consent banner on first visit where applicable by law.`,
  },
  {
    id: 'children',
    title: '7. Children\'s Privacy',
    content: `FamilyCare is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information promptly. If you believe we may have inadvertently collected information from a child, please contact us at privacy@familycare.app.`,
  },
  {
    id: 'changes',
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by:

• Sending an email to the address associated with your account.
• Displaying a prominent notice on the FamilyCare platform.
• Updating the "Last Updated" date at the top of this page.

Your continued use of FamilyCare after changes take effect constitutes your acceptance of the updated policy. We encourage you to review this policy periodically.`,
  },
  {
    id: 'contact',
    title: '9. Contact Us',
    content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**FamilyCare Privacy Team**
Email: privacy@familycare.app
Response time: Within 30 business days

For urgent security concerns, please email security@familycare.app.`,
  },
];

const renderContent = (text) => {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('•')) {
      const rest = line.slice(1).trim();
      const parts = rest.split(/\*\*(.*?)\*\*/g);
      return (
        <div key={i} style={{ display:'flex', gap:'0.6rem', marginBottom:'0.4rem', alignItems:'flex-start' }}>
          <span style={{ color:'#00A896', fontWeight:'700', flexShrink:0, marginTop:'2px' }}>•</span>
          <span style={{ color:'#4A5568', lineHeight:'1.7', fontSize:'0.95rem' }}>
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color:'#1A202C' }}>{p}</strong> : p)}
          </span>
        </div>
      );
    }
    if (line.trim() === '') return <div key={i} style={{ height:'0.6rem' }} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} style={{ color:'#4A5568', lineHeight:'1.7', fontSize:'0.95rem', margin:'0 0 0.4rem' }}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color:'#1A202C' }}>{p}</strong> : p)}
      </p>
    );
  });
};

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1A202C', background: '#fff' }}>
      <style>{`
        .pp-sidebar-link {
          display:block; padding:0.5rem 1rem; border-radius:8px; font-size:0.85rem;
          color:#718096; cursor:pointer; transition:background 0.2s,color 0.2s;
          border-left:3px solid transparent; text-decoration:none; line-height:1.4;
        }
        .pp-sidebar-link:hover { background:#F0FFF4; color:#00A896; }
        .pp-sidebar-link.active { background:#e0f2f1; color:#00796b; border-left-color:#00A896; font-weight:600; }
        .pp-section { scroll-margin-top:100px; }
        @media(max-width:900px){ .pp-layout{ flex-direction:column !important; } .pp-sidebar{ display:none !important; } }
      `}</style>

      {/* Hero */}
      <header style={{ padding:'120px 5% 50px', background:'linear-gradient(135deg,#f0fdf9 0%,#fff 60%)', borderBottom:'1px solid #EDF2F7' }}>
        <div style={{ maxWidth:'700px' }}>
          <span style={{ display:'inline-block', background:'#e0f2f1', color:'#00796b', fontSize:'0.75rem', fontWeight:'700', letterSpacing:'1.2px', padding:'5px 14px', borderRadius:'20px', marginBottom:'1.2rem' }}>
            LEGAL
          </span>
          <h1 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:'800', color:'#1A202C', marginBottom:'0.75rem', lineHeight:'1.2' }}>Privacy Policy</h1>
          <p style={{ color:'#718096', fontSize:'0.95rem', marginBottom:'0.5rem' }}>Effective date: January 1, 2026 &nbsp;·&nbsp; Last updated: June 1, 2026</p>
          <p style={{ color:'#718096', fontSize:'0.95rem', lineHeight:'1.7' }}>
            This Privacy Policy explains how FamilyCare ("we", "us", "our") collects, uses, and protects your personal information when you use our platform.
          </p>
        </div>
      </header>

      {/* Body */}
      <div className="pp-layout" style={{ display:'flex', maxWidth:'1100px', margin:'0 auto', padding:'60px 5% 80px', gap:'4rem', alignItems:'flex-start' }}>

        {/* Sidebar TOC */}
        <aside className="pp-sidebar" style={{ width:'230px', flexShrink:0, position:'sticky', top:'90px' }}>
          <p style={{ fontSize:'0.75rem', fontWeight:'700', letterSpacing:'1.2px', color:'#A0AEC0', marginBottom:'0.75rem', textTransform:'uppercase' }}>Contents</p>
          {sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`pp-sidebar-link ${activeSection === s.id ? 'active' : ''}`}
              onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior:'smooth' }); }}
            >
              {s.title}
            </a>
          ))}
        </aside>

        {/* Content */}
        <div style={{ flex:1, minWidth:0 }}>
          {sections.map((s) => (
            <div
              key={s.id}
              id={s.id}
              className="pp-section"
              ref={el => sectionRefs.current[s.id] = el}
              style={{ marginBottom:'3rem', paddingBottom:'3rem', borderBottom:'1px solid #EDF2F7' }}
            >
              <h2 style={{ fontSize:'1.2rem', fontWeight:'800', color:'#1A202C', marginBottom:'1.2rem' }}>{s.title}</h2>
              {renderContent(s.content)}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
