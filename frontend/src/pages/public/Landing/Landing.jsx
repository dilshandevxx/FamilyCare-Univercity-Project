import React from 'react';
import Hero from '../../../components/Landing/Hero';
import Features from '../../../components/Landing/Features';
import ProcessSteps from '../../../components/Landing/ProcessSteps';
import Testimonials from '../../../components/Landing/Testimonials';
import CallToAction from '../../../components/Landing/CallToAction';
import Footer from '../../../components/Landing/Footer';

const Landing = () => {
  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <ProcessSteps />
      <Testimonials />
      <CallToAction />
      <Footer />
      
      <style>{`
        .landing-page {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default Landing;
