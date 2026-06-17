import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Users, Shield } from 'lucide-react';
import Footer from '../../../components/Landing/Footer';

const openings = [
  { role: 'Full-Stack Engineer', team: 'Engineering', location: 'Remote', type: 'Full-time', tag: 'Tech' },
  { role: 'UI / UX Designer', team: 'Design', location: 'Remote', type: 'Full-time', tag: 'Design' },
  { role: 'Eldercare Product Manager', team: 'Product', location: 'Colombo, LK', type: 'Full-time', tag: 'Product' },
  { role: 'Customer Success Specialist', team: 'Support', location: 'Remote', type: 'Part-time', tag: 'Support' },
  { role: 'Data Analyst', team: 'Analytics', location: 'Remote', type: 'Full-time', tag: 'Tech' },
  { role: 'Marketing & Growth Lead', team: 'Marketing', location: 'Remote', type: 'Full-time', tag: 'Marketing' },
];

const tagColors = {
  Tech:      { bg: '#eff6ff', color: '#2563eb' },
  Design:    { bg: '#faf5ff', color: '#7c3aed' },
  Product:   { bg: '#fff7ed', color: '#ea580c' },
  Support:   { bg: '#f0fdf4', color: '#16a34a' },
  Marketing: { bg: '#fef2f2', color: '#dc2626' },
};

const perks = [
  { icon: Heart,   title: 'Health & Wellness',    desc: 'Full medical, dental, and vision coverage for you and your family.' },
  { icon: Users,   title: 'Remote-First Culture',  desc: 'Work from anywhere. We trust you to deliver results, not hours.' },
  { icon: Shield,  title: 'Equity & Growth',       desc: 'Competitive equity packages and a clear path to senior roles.' },
  { icon: Briefcase, title: 'Learning Budget',     desc: 'USD 1,000/year for courses, conferences, and books.' },
];

const Careers = () => {
  const [active, setActive] = useState(null);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1A202C', background: '#fff' }}>
      <style>{`
        @keyframes car-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .car-hero   { animation: car-fade-up 0.6s ease both; }
        .car-grid   { display: grid; grid-template-columns: repeat(2,1fr); gap: 1rem; }
        .car-card   {
          border: 1.5px solid #EDF2F7; border-radius: 14px; padding: 1.5rem 1.8rem;
          cursor: pointer; transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
          background: #fff;
        }
        .car-card:hover {
          border-color: #00A896; box-shadow: 0 12px 32px rgba(0,168,150,0.1);
          transform: translateY(-4px);
        }
        .car-perks  { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.5rem; }
        .car-perk   {
          background: #F8FAFC; border-radius: 14px; padding: 1.5rem;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .car-perk:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.07); transform: translateY(-3px); }
        @media(max-width:768px){
          .car-grid  { grid-template-columns: 1fr !important; }
          .car-perks { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Hero */}
      <header style={{ padding: '140px 5% 80px', background: 'linear-gradient(135deg,#f0fdf9 0%,#fff 60%)' }}>
        <div className="car-hero" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display:'inline-block', background:'#e0f2f1', color:'#00796b', fontSize:'0.75rem', fontWeight:'700', letterSpacing:'1.2px', padding:'5px 14px', borderRadius:'20px', marginBottom:'1.2rem' }}>
            JOIN OUR TEAM
          </span>
          <h1 style={{ fontSize:'clamp(2.4rem,5vw,3.6rem)', fontWeight:'800', lineHeight:'1.15', marginBottom:'1rem', color:'#1A202C' }}>
            Build the Future of <span style={{ color:'#00A896' }}>Eldercare</span>
          </h1>
          <p style={{ fontSize:'1.05rem', color:'#718096', lineHeight:'1.7', marginBottom:'2rem' }}>
            We're a small, mission-driven team creating technology that keeps families close across oceans. Come build with us.
          </p>
          <a href="#openings" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'#00A896', color:'white', padding:'0.85rem 2rem', borderRadius:'10px', fontWeight:'600', textDecoration:'none', transition:'background 0.2s,transform 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background='#008f80'}
            onMouseLeave={e=>e.currentTarget.style.background='#00A896'}
          >
            View Open Roles <ArrowRight size={16} />
          </a>
        </div>
      </header>

      {/* Perks */}
      <section style={{ padding:'80px 5%', background:'#fff' }}>
        <div style={{ maxWidth:'960px', margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', fontWeight:'800', fontSize:'clamp(1.6rem,3vw,2.2rem)', marginBottom:'3rem', color:'#1A202C' }}>Why FamilyCare?</h2>
          <div className="car-perks">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="car-perk">
                <div style={{ width:'42px', height:'42px', background:'#e0f2f1', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
                  <Icon size={20} color="#00A896" />
                </div>
                <h4 style={{ fontWeight:'700', marginBottom:'0.4rem', color:'#1A202C' }}>{title}</h4>
                <p style={{ fontSize:'0.9rem', color:'#718096', lineHeight:'1.6', margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section id="openings" style={{ padding:'80px 5%', background:'#F8FAFC' }}>
        <div style={{ maxWidth:'960px', margin:'0 auto' }}>
          <h2 style={{ fontWeight:'800', fontSize:'clamp(1.6rem,3vw,2.2rem)', marginBottom:'0.5rem', color:'#1A202C' }}>Open Positions</h2>
          <p style={{ color:'#718096', marginBottom:'2.5rem', fontSize:'0.95rem' }}>{openings.length} roles open across all teams</p>
          <div className="car-grid">
            {openings.map((job, i) => {
              const tc = tagColors[job.tag] || { bg:'#e0f2f1', color:'#00796b' };
              return (
                <div key={i} className="car-card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                    <h3 style={{ fontWeight:'700', fontSize:'1.05rem', color:'#1A202C', margin:0 }}>{job.role}</h3>
                    <span style={{ fontSize:'0.72rem', fontWeight:'700', background:tc.bg, color:tc.color, padding:'3px 10px', borderRadius:'20px', whiteSpace:'nowrap', marginLeft:'0.5rem' }}>{job.tag}</span>
                  </div>
                  <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'0.83rem', color:'#718096' }}><Briefcase size={13} />{job.team}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'0.83rem', color:'#718096' }}><MapPin size={13} />{job.location}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'0.83rem', color:'#718096' }}><Clock size={13} />{job.type}</span>
                  </div>
                  <div style={{ marginTop:'1rem', display:'flex', alignItems:'center', gap:'0.3rem', color:'#00A896', fontSize:'0.85rem', fontWeight:'600' }}>
                    Apply now <ArrowRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ textAlign:'center', marginTop:'2.5rem', color:'#718096', fontSize:'0.9rem' }}>
            Don't see your role? Email us at{' '}
            <a href="mailto:careers@familycare.app" style={{ color:'#00A896', textDecoration:'none', fontWeight:'600' }}>careers@familycare.app</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
