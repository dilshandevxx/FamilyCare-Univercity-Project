import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, HeartHandshake, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: ClipboardCheck,
    title: "1. Create a Profile",
    description: "Sign up and add details for the elder you are caring for, including medical history and specific needs."
  },
  {
    icon: HeartHandshake,
    title: "2. Connect Caregivers",
    description: "Browse and securely assign professional caregivers to manage the daily routine."
  },
  {
    icon: ShieldCheck,
    title: "3. Monitor & Relax",
    description: "Receive instant updates, track health logs in real time, and stay connected with the care team."
  }
];

const ProcessSteps = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section className="process-section">
      <div className="section-header">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          How <span className="text-accent">FamilyCare</span> works
        </motion.h2>
        <motion.p 
          className="section-desc"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          We've made setting up professional, accountable care as simple as 1-2-3.
        </motion.p>
      </div>

      <motion.div 
        className="process-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {steps.map((step, idx) => (
          <motion.div key={idx} className="process-step" variants={stepVariants}>
            <div className="step-number">
              <step.icon size={36} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>
              {step.title}
            </h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1rem', margin: 0 }}>
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProcessSteps;
