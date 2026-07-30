import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Activity, CheckCircle2, Plus, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../../../components/Landing/Footer';
import './About.css';

import elderlyWomanImg   from '../../../assets/about/elderly_woman_tablet.png';
import nurseHandsImg     from '../../../assets/about/nurse_holding_hands.png';
import sarahChenImg      from '../../../assets/about/sarah_chen.png';
import marcusThorneImg   from '../../../assets/about/marcus_thorne.png';
import elenaRodriguezImg from '../../../assets/about/elena_rodriguez.png';

const team = [
  { img: sarahChenImg,      name: 'Sarah Chen',        role: 'Chief Executive Officer', desc: 'A dedicated leader focused on improving life through connected, technology-driven healthcare.' },
  { img: marcusThorneImg,   name: 'Dr. Marcus Thorne', role: 'Medical Director',         desc: 'Ensuring our platform meets the highest standards of clinical excellence and patient safety.' },
  { img: elenaRodriguezImg, name: 'Elena Rodriguez',   role: 'Head of Care',             desc: 'Passionate about crafting an experience that feels deeply personal and genuinely supportive.' },
];

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <motion.div 
          className="about-hero-text"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="about-badge" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}><Heart size={12} /> Company Story</span>
          <h1 className="about-hero-title">
            Bridging the Distance<br />with <span style={{ color: '#10b981' }}>Empathy.</span>
          </h1>
          <p className="about-hero-desc">
            Distance should not dictate parental care. FamilyCare is building a bridge
            between families and their loved ones — delivering worry-free elderly care
            through technology and human warmth.
          </p>
        </motion.div>

        <motion.div 
          className="about-hero-img-wrap"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.img 
            src={elderlyWomanImg} 
            alt="Elderly woman with tablet" 
            className="about-hero-img"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="about-hero-badge-float glass-panel"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.9)' }}
          >
            <div className="about-hero-badge-icon">
              <Star size={20} fill="#F59E0B" color="#F59E0B" />
            </div>
            <div>
              <strong style={{ color: '#0f172a' }}>4.8 / 5 Rating</strong>
              <span style={{ color: '#64748b' }}>Trusted by 1,200+ families</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* MISSION & VISION */}
      <motion.section 
        className="about-mv-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.div variants={itemVariants} className="about-mission-card glass-panel" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div>
            <div className="about-card-label" style={{ color: '#10b981' }}><Shield color="#10b981" size={22} /> Our Mission</div>
            <blockquote style={{ color: '#0f172a' }}>
              "Our mission is to provide a digital sanctuary where medical precision
              meets human warmth — connecting families across any distance."
            </blockquote>
          </div>
          <div className="about-mission-card-footer" style={{ background: '#10b981' }}><Plus size={18} color="white" /></div>
        </motion.div>

        <motion.div variants={itemVariants} className="about-vision-card glass-panel" style={{ background: '#0f172a', color: 'white' }}>
          <div>
            <div className="about-card-label" style={{ color: '#10b981' }}><Activity size={22} /> Our Vision</div>
            <p style={{ color: '#f8fafc' }}>
              To redefine aging not as a period of decline, but as a chapter of shared
              growth — supported by the highest standard of accessible, compassionate technology.
            </p>
          </div>
          <div className="about-vision-stats">
            <div><div className="about-stat-value" style={{ color: 'white' }}>100+</div><div className="about-stat-label" style={{ color: '#94a3b8' }}>Cities</div></div>
            <div><div className="about-stat-value" style={{ color: 'white' }}>24/7</div><div className="about-stat-label" style={{ color: '#94a3b8' }}>Monitoring</div></div>
            <div><div className="about-stat-value" style={{ color: 'white' }}>150+</div><div className="about-stat-label" style={{ color: '#94a3b8' }}>Caregivers</div></div>
          </div>
        </motion.div>
      </motion.section>

      {/* CHALLENGE & SOLUTION */}
      <section className="about-cs-section">
        <motion.div 
          className="about-challenge"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="about-section-tag" style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}>The Challenge</span>
          <h2 className="about-section-title" style={{ color: '#0f172a' }}>The invisible weight<br />of distance.</h2>
          <p className="about-section-desc">
            Families all over the globe face a common challenge — separated by miles,
            they struggle to stay connected and confident about their loved ones care.
          </p>
          <div className="about-challenge-points">
            <div className="about-challenge-point">
              <div className="about-point-icon" style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}><MapPin size={22} /></div>
              <div>
                <p className="about-point-title" style={{ color: '#0f172a' }}>Geographical Distance</p>
                <p className="about-point-desc" style={{ color: '#64748b' }}>
                  Limited visibility into daily routines makes it nearly impossible
                  to stay passively connected to a loved ones well-being.
                </p>
              </div>
            </div>
            <div className="about-challenge-point">
              <div className="about-point-icon" style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}><CheckCircle2 size={22} /></div>
              <div>
                <p className="about-point-title" style={{ color: '#0f172a' }}>Complex Choices</p>
                <p className="about-point-desc" style={{ color: '#64748b' }}>
                  Navigating elderly homecare options is stressful. Families deserve
                  clear guidance to make the right decision with confidence.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="about-solution"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <span className="about-section-tag" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>The Solution</span>
          <h2 className="about-section-title" style={{ fontSize: '1.9rem', color: '#0f172a' }}>Real-time presence.</h2>
          <p className="about-section-desc" style={{ marginBottom: '28px' }}>
            Bridging the gap by integrating all care channels into one beautiful,
            simple, and powerful interface.
          </p>
          <div className="about-solution-cards">
            <motion.div className="about-solution-card glass-panel" whileHover={{ y: -5 }}>
              <div className="about-solution-icon" style={{ color: '#10b981' }}><Shield size={22} /></div>
              <div>
                <p className="about-solution-card-title" style={{ color: '#0f172a' }}>Centralized Care</p>
                <p className="about-solution-card-desc">All communication, documents, and updates in one place.</p>
              </div>
            </motion.div>
            <motion.div className="about-solution-card glass-panel" whileHover={{ y: -5 }}>
              <div className="about-solution-icon" style={{ color: '#f59e0b' }}><Activity size={22} /></div>
              <div>
                <p className="about-solution-card-title" style={{ color: '#0f172a' }}>Real-time Alerts</p>
                <p className="about-solution-card-desc">Instant notifications about your loved ones well-being.</p>
              </div>
            </motion.div>
            <motion.div className="about-solution-card glass-panel" whileHover={{ y: -5 }}>
              <div className="about-solution-icon" style={{ color: '#3b82f6' }}><CheckCircle2 size={22} /></div>
              <div>
                <p className="about-solution-card-title" style={{ color: '#0f172a' }}>Verified Caregivers</p>
                <p className="about-solution-card-desc">Background-checked specialists matched to your family needs.</p>
              </div>
            </motion.div>
          </div>
          <motion.img 
            src={nurseHandsImg} 
            alt="Nurse holding hands" 
            className="about-solution-img"
            whileHover={{ scale: 1.02 }}
          />
        </motion.div>
      </section>

      {/* TEAM */}
      <section className="about-team-section" style={{ background: '#f8fafc' }}>
        <motion.div 
          className="about-team-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ color: '#0f172a' }}>The Heart of our Sanctuary</h2>
          <p style={{ color: '#64748b' }}>We believe the best healthcare is technology-driven but humanity-delivered.</p>
        </motion.div>
        
        <motion.div 
          className="about-team-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {team.map((member, i) => (
            <motion.div className="about-team-card glass-panel" key={i} variants={itemVariants} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <div className="about-team-img-wrap">
                <img src={member.img} alt={member.name} className="about-team-img" />
                <div className="about-team-overlay">
                  <span className="about-team-overlay-tag" style={{ background: '#10b981' }}>{member.role}</span>
                </div>
              </div>
              <div className="about-team-info">
                <h4 className="about-team-name" style={{ color: '#0f172a' }}>{member.name}</h4>
                <p className="about-team-role" style={{ color: '#10b981' }}>{member.role}</p>
                <p className="about-team-desc" style={{ color: '#64748b' }}>{member.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="about-cta-section" style={{ padding: '120px 24px', background: 'white' }}>
        <motion.div 
          className="cta-box"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 40px', background: '#10b981', borderRadius: '32px', color: 'white', textAlign: 'center', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)' }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '24px' }}>Join the Sanctuary</h2>
          <p style={{ margin: '0 auto 40px', maxWidth: '600px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>
            Ready to bridge the distance? Start your journey toward a more connected
            and worry-free caregiving experience today.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" style={{ padding: '16px 32px', background: 'white', color: '#10b981', borderRadius: '12px', fontWeight: '600', textDecoration: 'none' }}>Get Started Free</Link>
            <Link to="/caregivers" style={{ padding: '16px 32px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', fontWeight: '600', textDecoration: 'none' }}>Browse Caregivers</Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
