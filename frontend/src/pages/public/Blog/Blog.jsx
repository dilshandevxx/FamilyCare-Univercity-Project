import React, { useState } from 'react';
import { Clock, Tag, Search } from 'lucide-react';
import Footer from '../../../components/Landing/Footer';

const posts = [
  {
    category: 'Care Tips',
    title: 'How to Monitor Elderly Health Remotely Without Being Intrusive',
    excerpt: 'Balancing oversight with dignity is one of the greatest challenges for families abroad. Here are evidence-backed strategies that work.',
    date: 'Jun 10, 2026',
    readTime: '5 min read',
    color: '#e0f2f1',
    accent: '#00A896',
  },
  {
    category: 'Product',
    title: "What's New in FamilyCare 2.0 — Live Dashboard & Smart Alerts",
    excerpt: 'Our biggest update yet brings real-time vitals, caregiver check-in tracking, and an all-new emergency alert system to your fingertips.',
    date: 'May 28, 2026',
    readTime: '3 min read',
    color: '#eff6ff',
    accent: '#2563eb',
  },
  {
    category: 'Family Stories',
    title: "\"I Felt Like I Was There\" — A Daughter's Story from London",
    excerpt: 'Amara moved to London at 24 to pursue her career. Three years later, her mother was diagnosed with early-stage Parkinson\'s. This is her story.',
    date: 'May 14, 2026',
    readTime: '7 min read',
    color: '#fff7ed',
    accent: '#ea580c',
  },
  {
    category: 'Research',
    title: 'The Loneliness Epidemic in Elderly Care — and What Technology Can Do',
    excerpt: 'New research shows that 40% of elderly people in South Asia report significant social isolation. We look at the data and what digital platforms can realistically address.',
    date: 'Apr 30, 2026',
    readTime: '8 min read',
    color: '#faf5ff',
    accent: '#7c3aed',
  },
  {
    category: 'Care Tips',
    title: '7 Questions to Ask Before Hiring a Home Caregiver',
    excerpt: 'Choosing the right caregiver for your parent is one of the most important decisions you\'ll make. Use this checklist to evaluate candidates effectively.',
    date: 'Apr 18, 2026',
    readTime: '4 min read',
    color: '#f0fdf4',
    accent: '#16a34a',
  },
  {
    category: 'Product',
    title: 'Building Accessible Design for Elderly Users — Our UX Journey',
    excerpt: 'Designing for an audience that includes both tech-savvy adult children and elderly parents who may be using a smartphone for the first time is a unique challenge.',
    date: 'Apr 5, 2026',
    readTime: '6 min read',
    color: '#fef2f2',
    accent: '#dc2626',
  },
];

const categories = ['All', 'Care Tips', 'Product', 'Family Stories', 'Research'];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = posts.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1A202C', background: '#fff' }}>
      <style>{`
        @keyframes blog-fade { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .blog-card {
          border: 1.5px solid #EDF2F7; border-radius: 16px; overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: #fff; animation: blog-fade 0.5s ease both;
        }
        .blog-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .blog-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .blog-cat-btn {
          padding: 0.45rem 1.1rem; border-radius: 20px; border: 1.5px solid #E2E8F0;
          background: transparent; cursor: pointer; font-size: 0.85rem; font-weight: 600;
          color: #718096; transition: all 0.2s ease;
        }
        .blog-cat-btn:hover { border-color: #00A896; color: #00A896; }
        .blog-cat-btn.active { background: #00A896; color: white; border-color: #00A896; }
        .blog-search {
          display: flex; align-items: center; gap: 0.6rem;
          border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 0.5rem 1rem;
          background: #F8FAFC; transition: border-color 0.2s;
        }
        .blog-search:focus-within { border-color: #00A896; background: #fff; }
        .blog-search input { border: none; background: transparent; outline: none; font-size: 0.9rem; color: #1A202C; width: 200px; }
        @media(max-width:1024px){ .blog-grid{grid-template-columns:repeat(2,1fr)!important} }
        @media(max-width:600px){ .blog-grid{grid-template-columns:1fr!important} }
      `}</style>

      {/* Hero */}
      <header style={{ padding: '140px 5% 60px', background: 'linear-gradient(135deg,#f0fdf9 0%,#fff 60%)', textAlign: 'center' }}>
        <span style={{ display:'inline-block', background:'#e0f2f1', color:'#00796b', fontSize:'0.75rem', fontWeight:'700', letterSpacing:'1.2px', padding:'5px 14px', borderRadius:'20px', marginBottom:'1.2rem' }}>
          FAMILYCARE BLOG
        </span>
        <h1 style={{ fontSize:'clamp(2.2rem,5vw,3.4rem)', fontWeight:'800', lineHeight:'1.2', color:'#1A202C', marginBottom:'1rem' }}>
          Insights on Eldercare &amp; <span style={{ color:'#00A896' }}>Family Connection</span>
        </h1>
        <p style={{ color:'#718096', fontSize:'1.05rem', maxWidth:'520px', margin:'0 auto', lineHeight:'1.7' }}>
          Tips, stories, research, and product updates from the FamilyCare team.
        </p>
      </header>

      {/* Filters */}
      <div style={{ padding:'32px 5%', borderBottom:'1px solid #EDF2F7', display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
          {categories.map(c => (
            <button key={c} className={`blog-cat-btn ${activeCategory===c?'active':''}`} onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </div>
        <div className="blog-search">
          <Search size={15} color="#718096" />
          <input placeholder="Search articles…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Grid */}
      <section style={{ padding:'60px 5% 80px' }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto' }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign:'center', color:'#718096', padding:'4rem 0' }}>No articles found. Try a different search or category.</p>
          ) : (
            <div className="blog-grid">
              {filtered.map((post, i) => (
                <div key={i} className="blog-card" style={{ animationDelay:`${i*0.07}s` }}>
                  <div style={{ height:'8px', background:`linear-gradient(90deg,${post.accent},${post.accent}88)` }} />
                  <div style={{ padding:'1.6rem' }}>
                    <span style={{ fontSize:'0.72rem', fontWeight:'700', background:post.color, color:post.accent, padding:'3px 10px', borderRadius:'20px' }}>{post.category}</span>
                    <h3 style={{ fontWeight:'700', fontSize:'1rem', lineHeight:'1.5', margin:'0.85rem 0 0.6rem', color:'#1A202C' }}>{post.title}</h3>
                    <p style={{ fontSize:'0.88rem', color:'#718096', lineHeight:'1.6', marginBottom:'1.2rem' }}>{post.excerpt}</p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #EDF2F7', paddingTop:'1rem' }}>
                      <div style={{ display:'flex', gap:'0.75rem' }}>
                        <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'0.78rem', color:'#718096' }}><Clock size={12} />{post.date}</span>
                        <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'0.78rem', color:'#718096' }}><Tag size={12} />{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
