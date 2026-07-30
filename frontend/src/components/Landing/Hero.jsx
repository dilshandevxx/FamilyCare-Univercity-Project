import React from 'react';
import { ArrowRight, Activity, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section className="hero-section">
      <motion.div 
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-text-container">
          <motion.div variants={itemVariants} className="hero-badge">
            <span className="badge-dot"></span>
            Trusted by 100+ families
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="hero-title">
            Caring for your loved ones, <br />
            <span className="text-accent">made effortless.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="hero-desc">
            Connect with professional caregivers, monitor health in real time, 
            and stay close to the people who matter most — all in one clean, 
            secure place.
          </motion.p>
          
          <motion.div variants={itemVariants} className="hero-actions">
            <button 
              className="btn-primary" 
              onClick={() => navigate('/register')}
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '32px', marginTop: '48px' }}>
             <div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 4px' }}>100+</h4>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Families</p>
             </div>
             <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
             <div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 4px' }}>100+</h4>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Caregivers</p>
             </div>
             <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
             <div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 4px' }}>98%</h4>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Satisfaction</p>
             </div>
          </motion.div>
        </div>

        <motion.div 
          className="hero-image-container glass-panel"
          variants={itemVariants}
          style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}
          whileHover={{ y: -10, transition: { duration: 0.3 } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
               S
             </div>
             <div>
               <p style={{ margin: '0 0 8px', fontStyle: 'italic', color: '#f8fafc', lineHeight: 1.5 }}>
                 "FamilyCare completely transformed how we manage care for my mother. It gives us peace of mind every day."
               </p>
               <h5 style={{ margin: 0, fontWeight: '600' }}>Sarah Mitchell</h5>
               <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Family Member, Chicago</p>
             </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '12px 0' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <Activity size={20} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <Shield size={20} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Secure</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <Clock size={20} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>24/7 Access</span>
             </div>
          </div>

        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
