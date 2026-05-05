import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Activity, CheckCircle2, Plus, Star } from 'lucide-react';
import Footer from '../../../components/Landing/Footer';

// Importing images
import elderlyWomanImg from '../../../assets/about/elderly_woman_tablet.png';
import nurseHandsImg from '../../../assets/about/nurse_holding_hands.png';
import sarahChenImg from '../../../assets/about/sarah_chen.png';
import marcusThorneImg from '../../../assets/about/marcus_thorne.png';
import elenaRodriguezImg from '../../../assets/about/elena_rodriguez.png';

const About = () => {
  return (
    <div style={{ fontFamily: '"Inter", sans-serif', color: '#333', background: '#FAFAFA' }}>
      {/* HERO SECTION */}
      <section style={{ padding: '120px 5% 80px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px', background: '#F8FBFB' }}>
        <div style={{ flex: '1 1 400px' }}>
          <span style={{ 
            display: 'inline-block', background: '#E6F7F5', color: '#00A896', 
            padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', 
            letterSpacing: '1px', marginBottom: '20px' 
          }}>
            COMPANY REPORT
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px', color: '#111' }}>
            Bridging the<br />Distance with<br />
            <span style={{ color: '#00A896' }}>Empathy.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.6', maxWidth: '480px' }}>
            The distance shouldn't dictate parental care. Who takes care? The goal,
            worry-free delivery of elderly care. We are building a bridge to make
            healthy, connected life.
          </p>
        </div>
        <div style={{ flex: '1 1 400px', position: 'relative' }}>
          <img src={elderlyWomanImg} alt="Elderly woman with tablet" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          
          <div style={{ 
            position: 'absolute', bottom: '-20px', left: '-20px', background: 'white', 
            padding: '16px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <div style={{ background: '#FFF5F0', padding: '10px', borderRadius: '50%' }}>
               <Star size={20} fill="#F59E0B" color="#F59E0B" />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>4.8/5 rating</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>best app in the market</div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section style={{ padding: '0 5%', marginTop: '-40px', position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: '1 1 300px', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>
              <Shield color="#00A896" size={24} />
              Our Mission
            </div>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.6', fontWeight: '500', color: '#222' }}>
              "Our mission is to provide a digital sanctuary where medical precision meets human warmth."
            </p>
          </div>
          <div style={{ alignSelf: 'flex-end', color: '#00A896', marginTop: '20px' }}>
            <Plus size={24} />
          </div>
        </div>

        <div style={{ flex: '1 1 400px', background: '#0A5C48', padding: '40px', borderRadius: '24px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontWeight: 'bold', fontSize: '1.2rem', color: '#E6F7F5' }}>
              <Activity size={24} />
              Our Vision
            </div>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#D1E8E2' }}>
              To redefine aging not as a period of decline, but as a chapter of shared growth,
              supported by the highest standard of accessible technology.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
             <div>
               <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>100+</div>
               <div style={{ fontSize: '0.8rem', color: '#A0C4BC', textTransform: 'uppercase', letterSpacing: '1px' }}>Cities</div>
             </div>
             <div>
               <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>24/7</div>
               <div style={{ fontSize: '0.8rem', color: '#A0C4BC', textTransform: 'uppercase', letterSpacing: '1px' }}>Monitoring</div>
             </div>
             <div>
               <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>150+</div>
               <div style={{ fontSize: '0.8rem', color: '#A0C4BC', textTransform: 'uppercase', letterSpacing: '1px' }}>Caregivers</div>
             </div>
          </div>
        </div>
      </section>

      {/* CHALLENGE & SOLUTION */}
      <section style={{ padding: '100px 5%', display: 'flex', flexWrap: 'wrap', gap: '60px' }}>
        {/* Left side */}
        <div style={{ flex: '1 1 400px' }}>
          <span style={{ color: '#D97706', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>THE CHALLENGE</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '10px', marginBottom: '20px', lineHeight: '1.2', color: '#111' }}>
            The invisible weight of<br />distance.
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '40px' }}>
            Families all over the globe face a common challenge usually by distance and separated by spaces.
          </p>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ color: '#666' }}><MapPin size={24} /></div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1rem' }}>Geographical distance</h4>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
                And lack of opportunities to check in all features fully and keep passively connected to loved ones.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ color: '#666' }}><CheckCircle2 size={24} /></div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1rem' }}>Complex choices</h4>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Choosing kind of elderly homecare options is hard and very stressful to make the right choice.
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div style={{ flex: '1 1 400px', background: '#F8FBFB', padding: '40px', borderRadius: '24px' }}>
          <span style={{ color: '#00A896', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>THE SOLUTION</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '10px', marginBottom: '16px', color: '#111' }}>
            Real-time presence.
          </h2>
          <p style={{ color: '#555', marginBottom: '30px', fontSize: '1rem' }}>
            Bridging the gap by integrating all care channels into one beautiful and simple interface.
          </p>

          <div style={{ background: 'white', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#E6F7F5', padding: '12px', borderRadius: '12px', color: '#00A896' }}><Shield size={24} /></div>
            <div>
              <div style={{ fontWeight: 'bold' }}>Centralized Care</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>All communication, documents, and updates in one place.</div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#FFF5F0', padding: '12px', borderRadius: '12px', color: '#D97706' }}><Activity size={24} /></div>
            <div>
              <div style={{ fontWeight: 'bold' }}>Real-time alerts</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Get instant notifications about your loved ones well-being.</div>
            </div>
          </div>

          <img src={nurseHandsImg} alt="Nurse holding hands" style={{ width: '100%', borderRadius: '16px', objectFit: 'cover', height: '180px' }} />
        </div>
      </section>

      {/* TEAM SECTION */}
      <section style={{ padding: '60px 5% 100px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', color: '#111' }}>
          The Heart of our Sanctuary
        </h2>
        <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 60px' }}>
          We believe that the best healthcare is technology driven but humanity delivered.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
          {[
            { img: sarahChenImg, name: 'Sarah Chen', role: 'Chief Executive Officer', desc: 'A dedicated leader focused on improving life through connected healthcare.' },
            { img: marcusThorneImg, name: 'Dr. Marcus Thorne', role: 'Medical Director', desc: 'Ensuring that our platform meets the highest standards of clinical excellence.' },
            { img: elenaRodriguezImg, name: 'Elena Rodriguez', role: 'Head of Care', desc: 'Passionate about crafting an experience that feels personal and supportive.' }
          ].map((member, i) => (
            <div key={i} style={{ flex: '1 1 250px', maxWidth: '300px', textAlign: 'left' }}>
              <img src={member.img} alt={member.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '24px', marginBottom: '20px' }} />
              <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '4px' }}>{member.name}</h4>
              <div style={{ color: '#00A896', fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>{member.role}</div>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '0 5% 100px' }}>
        <div style={{ 
          background: '#1A1A1A', borderRadius: '32px', padding: '60px 40px', 
          textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' 
        }}>
          {/* Decorative background blur/gradient if wanted */}
          <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: '#00A896', opacity: '0.15', filter: 'blur(80px)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '300px', height: '300px', background: '#D97706', opacity: '0.1', filter: 'blur(80px)', borderRadius: '50%' }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px' }}>
              Join the Sanctuary
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#AAA', maxWidth: '500px', margin: '0 auto 40px', lineHeight: '1.6' }}>
              Ready to bridge the distance? Start your journey toward a more connected and worry-free experience today.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ 
                background: '#00A896', color: 'white', padding: '14px 32px', 
                borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none', transition: '0.2s',
                display: 'inline-block'
              }}>
                Get Started
              </Link>
              <Link to="/contact" style={{ 
                background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
                padding: '14px 32px', borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none',
                transition: '0.2s', display: 'inline-block'
              }}>
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
