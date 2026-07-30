import React from 'react';
import { Activity, Bell, UserPlus, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const featuresData = [
  {
    icon: Users,
    title: "Centralized Care Hub",
    description: "Manage multiple elders, coordinate with caregivers, and keep all family members in the loop securely."
  },
  {
    icon: Activity,
    title: "Real-Time Health Tracking",
    description: "Monitor vitals, medication schedules, and daily routines with instant updates from professional caregivers."
  },
  {
    icon: Bell,
    title: "Instant Smart Alerts",
    description: "Get notified immediately about missed medications, abnormal vitals, or emergencies requiring attention."
  },
  {
    icon: UserPlus,
    title: "Professional Caregivers",
    description: "Access a network of vetted, highly-rated caregivers tailored to your family's specific medical needs."
  }
];

const Features = () => {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section className="features-section" id="features">
      <div className="section-header">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Everything you need for <span className="text-accent">peace of mind</span>
        </motion.h2>
        <motion.p 
          className="section-desc"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          A complete suite of tools designed to simplify elderly care management and bridge the gap between families and caregivers.
        </motion.p>
      </div>

      <motion.div 
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {featuresData.map((feature, idx) => (
          <motion.div 
            key={idx} 
            className="feature-card glass-panel"
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <div className="feature-icon-wrapper">
              <feature.icon size={28} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0', color: '#0f172a' }}>{feature.title}</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
