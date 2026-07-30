import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Shield, Bell, BarChart2, LayoutDashboard,
  Users, Play, CheckCircle, Heart, Clock
} from 'lucide-react';
import Footer from '../../../components/Landing/Footer';

const coreFeatures = [
  {
    icon: Heart,
    color: 'rgba(16, 185, 129, 0.1)',
    iconColor: '#10b981',
    title: 'Health Monitoring',
    description: 'Real-time tracking of vital signs, nutrition, and daily wellness tracking for your family members.',
    highlights: ['Activity logging', 'Medication reminders'],
  },
  {
    icon: Users,
    color: 'rgba(245, 158, 11, 0.1)',
    iconColor: '#f59e0b',
    title: 'Caregiver Management',
    description: 'Find and manage the perfect caregiver. Filter by experience, location, and availability.',
    highlights: ['Staff profiles', 'Direct Messaging'],
  },
  {
    icon: Bell,
    color: 'rgba(239, 68, 68, 0.1)',
    iconColor: '#ef4444',
    title: 'Emergency Response',
    description: 'Instant notification to designated health contacts. Triggers an emergency-action policy immediately.',
    highlights: ['One-click emergency', 'In-progress status'],
  },
  {
    icon: BarChart2,
    color: 'rgba(59, 130, 246, 0.1)',
    iconColor: '#3b82f6',
    title: 'Predictive Analytics',
    description: 'Analyse activity reports and historical data to predict and prevent complications before they arise.',
    highlights: ['Trend reports'],
  },
  {
    icon: LayoutDashboard,
    color: 'rgba(139, 92, 246, 0.1)',
    iconColor: '#8b5cf6',
    title: 'Live Dashboard',
    description: 'A beautiful live activity overview for 24/7 real-time updates for you and your family.',
    highlights: ['Live updates'],
  },
  {
    icon: Shield,
    color: 'rgba(16, 185, 129, 0.1)',
    iconColor: '#10b981',
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

const FeatureCard = ({ icon: Icon, color, iconColor, title, description, highlights }) => {
  return (
    <motion.div
      className="glass-panel"
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      style={{
        background: 'white',
        padding: '32px',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
      }}
    >
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px',
        background: color, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: '24px'
      }}>
        <Icon size={28} color={iconColor} strokeWidth={2} />
      </div>
      <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' }}>{title}</h3>
      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 24px 0', flex: 1 }}>{description}</p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {highlights.map((h) => (
          <span key={h} style={{
            color: iconColor, background: color,
            padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700'
          }}>
            {h}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const DEMO_VIDEO_ID = 'dQw4w9WgXcQ'; 

const VideoModal = ({ onClose }) => (
  <div 
    style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
    onClick={onClose}
  >
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{ width: '100%', maxWidth: '800px', background: 'black', borderRadius: '24px', overflow: 'hidden', aspectRatio: '16/9', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }} 
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}>✕</button>
      <iframe
        src={`https://www.youtube.com/embed/${DEMO_VIDEO_ID}?autoplay=1`}
        title="FamilyCare Demo"
        frameBorder="0"
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </motion.div>
  </div>
);

const FeaturesPage = () => {
  const [showDemo, setShowDemo] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a', background: '#ffffff', overflowX: 'hidden' }}>
      
      {/* ── Hero ── */}
      <section style={{ padding: '160px 6% 80px', background: '#f8fafc', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '800px' }}
        >
          <span style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', marginBottom: '24px' }}>
            INNOVATION & CARE
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '800', margin: '0 0 24px 0', lineHeight: 1.1, color: '#0f172a' }}>
            Powerful Features for <br /> <span style={{ color: '#10b981' }}>Smarter</span> Eldercare
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: 1.7, margin: '0 auto 40px', maxWidth: '600px' }}>
            A digital sanctuary designed to bridge the gap between clinical precision and family warmth. Monitor, manage, and protect your loved ones with an intimate-grade interface.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="#features" style={{ padding: '16px 32px', background: '#10b981', color: 'white', borderRadius: '12px', fontWeight: '700', textDecoration: 'none' }}>
              Explore Features
            </a>
            <button onClick={() => setShowDemo(true)} style={{ padding: '16px 32px', background: 'white', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={18} /> Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Core Features Grid ── */}
      <section id="features" style={{ padding: '120px 6%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>Integrated Health Ecosystem</h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to create excellence in care, unified in a single, intuitive dashboard.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}
          >
            {coreFeatures.map((f, i) => (
              <motion.div key={f.title} variants={itemVariants}>
                <FeatureCard {...f} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tailored Experiences ── */}
      <section style={{ padding: '100px 6%', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#10b981', letterSpacing: '1px' }}>FOR EVERY STAKEHOLDER</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', margin: '16px 0 0 0' }}>Tailored Experiences</h2>
          </motion.div>

          {/* Row 1 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'center', marginBottom: '120px' }}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ flex: '1 1 400px' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#10b981', letterSpacing: '1px' }}>FOR FAMILY MEMBERS</span>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: '16px 0', color: '#0f172a' }}>Peace of Mind, Personalized.</h3>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.7, marginBottom: '32px' }}>
                Stay connected on all your parents' needs, from anywhere in the world. View family health logs, receive instant alerts, and manage care schedules — all in a simple, high-end interface.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {familyFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={20} color="#10b981" />
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ flex: '1 1 400px', background: 'white', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}
            >
              <div style={{ background: 'rgba(16,185,129,0.1)', height: '200px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={64} color="#10b981" />
              </div>
            </motion.div>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '60px', alignItems: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ flex: '1 1 400px', background: 'white', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}
            >
              <div style={{ background: 'rgba(59,130,246,0.1)', height: '200px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={64} color="#3b82f6" />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ flex: '1 1 400px' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#3b82f6', letterSpacing: '1px' }}>FOR CAREGIVERS</span>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: '16px 0', color: '#0f172a' }}>Efficiency in Every Interaction.</h3>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.7, marginBottom: '32px' }}>
                Focus on the human element while we handle the data. Tailored digital tools, logs, manage medication checklists, and trigger digital emergency protocols with one-tap actions.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {caregiverFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={20} color="#3b82f6" />
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '120px 6%', background: 'white' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 40px', background: '#10b981', borderRadius: '32px', color: 'white', textAlign: 'center', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)' }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '24px' }}>Start monitoring your loved ones today</h2>
          <p style={{ margin: '0 auto 40px', maxWidth: '600px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>
            Join thousands of families who have found peace of mind through the Living Sanctuary digital ecosystem.
          </p>
          <Link to="/register" style={{ display: 'inline-block', padding: '16px 32px', background: 'white', color: '#10b981', borderRadius: '12px', fontWeight: '700', textDecoration: 'none' }}>
            Create Free Account
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Demo Video Modal ── */}
      <AnimatePresence>
        {showDemo && <VideoModal onClose={() => setShowDemo(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default FeaturesPage;
