import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <motion.div 
        className="cta-box"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="section-title" 
          style={{ color: 'white', marginBottom: '24px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Ready to simplify caregiving?
        </motion.h2>
        
        <motion.p 
          className="section-desc" 
          style={{ margin: '0 auto 40px', maxWidth: '600px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Join thousands of families and caregivers who trust FamilyCare to manage daily routines, 
          track health, and provide peace of mind.
        </motion.p>
        
        <motion.div 
          className="hero-actions" 
          style={{ justifyContent: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/register')}
            style={{ 
              backgroundColor: 'white', 
              color: '#10b981', 
              border: 'none',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
            }}
          >
            Create Free Account <ArrowRight size={20} />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
