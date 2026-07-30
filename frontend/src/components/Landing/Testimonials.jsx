import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "The instant alerts feature saved us when my father missed his medication. The caregiver was notified and handled it immediately.",
    name: "James Wilson",
    role: "Family Member",
    initial: "J"
  },
  {
    quote: "As a professional caregiver, this platform makes reporting vitals and communicating with families so much more organized and secure.",
    name: "Elena Rodriguez",
    role: "Registered Nurse",
    initial: "E"
  },
  {
    quote: "I can check on my grandmother's daily activities from across the country. The peace of mind this brings is completely invaluable.",
    name: "Michael Chen",
    role: "Family Member",
    initial: "M"
  }
];

const Testimonials = () => {
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
    <section className="testimonials-section" id="testimonials">
      <div className="section-header">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Trusted by families and <span className="text-accent">professionals</span>
        </motion.h2>
        <motion.p 
          className="section-desc"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Don't just take our word for it. Here is what our community has to say about FamilyCare.
        </motion.p>
      </div>

      <motion.div 
        className="testimonials-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {testimonials.map((test, idx) => (
          <motion.div 
            key={idx} 
            className="testimonial-card glass-panel"
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <Quote size={40} color="rgba(16,185,129,0.2)" style={{ marginBottom: '20px' }} />
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#f8fafc', fontStyle: 'italic' }}>
              "{test.quote}"
            </p>
            <div className="client-info">
              <div className="client-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>
                {test.initial}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>{test.name}</h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{test.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;
