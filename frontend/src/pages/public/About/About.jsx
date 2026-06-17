import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Activity, CheckCircle2, Plus, Star, Heart } from 'lucide-react';
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

const About = () => (
  <div className="about-page">

    {/* HERO */}
    <section className="about-hero">
      <div className="about-hero-text">
        <span className="about-badge"><Heart size={12} /> Company Story</span>
        <h1 className="about-hero-title">
          Bridging the Distance<br />with <span className="accent">Empathy.</span>
        </h1>
        <p className="about-hero-desc">
          Distance should not dictate parental care. FamilyCare is building a bridge
          between families and their loved ones — delivering worry-free elderly care
          through technology and human warmth.
        </p>
      </div>

      <div className="about-hero-img-wrap">
        <img src={elderlyWomanImg} alt="Elderly woman with tablet" className="about-hero-img" />
        <div className="about-hero-badge-float">
          <div className="about-hero-badge-icon">
            <Star size={20} fill="#F59E0B" color="#F59E0B" />
          </div>
          <div>
            <strong>4.8 / 5 Rating</strong>
            <span>Trusted by 1,200+ families</span>
          </div>
        </div>
      </div>
    </section>

    {/* MISSION & VISION */}
    <section className="about-mv-section">
      <div className="about-mission-card">
        <div>
          <div className="about-card-label"><Shield color="#0d9488" size={22} /> Our Mission</div>
          <blockquote>
            "Our mission is to provide a digital sanctuary where medical precision
            meets human warmth — connecting families across any distance."
          </blockquote>
        </div>
        <div className="about-mission-card-footer"><Plus size={18} /></div>
      </div>

      <div className="about-vision-card">
        <div>
          <div className="about-card-label"><Activity size={22} /> Our Vision</div>
          <p>
            To redefine aging not as a period of decline, but as a chapter of shared
            growth — supported by the highest standard of accessible, compassionate technology.
          </p>
        </div>
        <div className="about-vision-stats">
          <div><div className="about-stat-value">100+</div><div className="about-stat-label">Cities</div></div>
          <div><div className="about-stat-value">24/7</div><div className="about-stat-label">Monitoring</div></div>
          <div><div className="about-stat-value">150+</div><div className="about-stat-label">Caregivers</div></div>
        </div>
      </div>
    </section>

    {/* CHALLENGE & SOLUTION */}
    <section className="about-cs-section">
      <div className="about-challenge">
        <span className="about-section-tag orange">The Challenge</span>
        <h2 className="about-section-title">The invisible weight<br />of distance.</h2>
        <p className="about-section-desc">
          Families all over the globe face a common challenge — separated by miles,
          they struggle to stay connected and confident about their loved ones care.
        </p>
        <div className="about-challenge-points">
          <div className="about-challenge-point">
            <div className="about-point-icon"><MapPin size={22} /></div>
            <div>
              <p className="about-point-title">Geographical Distance</p>
              <p className="about-point-desc">
                Limited visibility into daily routines makes it nearly impossible
                to stay passively connected to a loved ones well-being.
              </p>
            </div>
          </div>
          <div className="about-challenge-point">
            <div className="about-point-icon"><CheckCircle2 size={22} /></div>
            <div>
              <p className="about-point-title">Complex Choices</p>
              <p className="about-point-desc">
                Navigating elderly homecare options is stressful. Families deserve
                clear guidance to make the right decision with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-solution">
        <span className="about-section-tag teal">The Solution</span>
        <h2 className="about-section-title" style={{ fontSize: '1.9rem' }}>Real-time presence.</h2>
        <p className="about-section-desc" style={{ marginBottom: '28px' }}>
          Bridging the gap by integrating all care channels into one beautiful,
          simple, and powerful interface.
        </p>
        <div className="about-solution-cards">
          <div className="about-solution-card">
            <div className="about-solution-icon teal"><Shield size={22} /></div>
            <div>
              <p className="about-solution-card-title">Centralized Care</p>
              <p className="about-solution-card-desc">All communication, documents, and updates in one place.</p>
            </div>
          </div>
          <div className="about-solution-card">
            <div className="about-solution-icon orange"><Activity size={22} /></div>
            <div>
              <p className="about-solution-card-title">Real-time Alerts</p>
              <p className="about-solution-card-desc">Instant notifications about your loved ones well-being.</p>
            </div>
          </div>
          <div className="about-solution-card">
            <div className="about-solution-icon blue"><CheckCircle2 size={22} /></div>
            <div>
              <p className="about-solution-card-title">Verified Caregivers</p>
              <p className="about-solution-card-desc">Background-checked specialists matched to your family needs.</p>
            </div>
          </div>
        </div>
        <img src={nurseHandsImg} alt="Nurse holding hands" className="about-solution-img" />
      </div>
    </section>

    {/* TEAM */}
    <section className="about-team-section">
      <div className="about-team-header">
        <h2>The Heart of our Sanctuary</h2>
        <p>We believe the best healthcare is technology-driven but humanity-delivered.</p>
      </div>
      <div className="about-team-grid">
        {team.map((member, i) => (
          <div className="about-team-card" key={i}>
            <div className="about-team-img-wrap">
              <img src={member.img} alt={member.name} className="about-team-img" />
              <div className="about-team-overlay">
                <span className="about-team-overlay-tag">{member.role}</span>
              </div>
            </div>
            <div className="about-team-info">
              <h4 className="about-team-name">{member.name}</h4>
              <p className="about-team-role">{member.role}</p>
              <p className="about-team-desc">{member.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="about-cta-section">
      <div className="about-cta-box">
        <div className="about-cta-glow-1" />
        <div className="about-cta-glow-2" />
        <div className="about-cta-inner">
          <span className="about-cta-tag">Get Started Today</span>
          <h2 className="about-cta-title">Join the Sanctuary</h2>
          <p className="about-cta-desc">
            Ready to bridge the distance? Start your journey toward a more connected
            and worry-free caregiving experience today.
          </p>
          <div className="about-cta-buttons">
            <Link to="/register"   className="about-cta-btn-primary">Get Started Free</Link>
            <Link to="/caregivers" className="about-cta-btn-secondary">Browse Caregivers</Link>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
