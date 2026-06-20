import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AVATAR_POOL = [32, 44, 5, 11, 26, 68, 47, 57, 33, 16, 21, 43, 65, 23, 53, 36, 12, 51, 70, 3];
const CARD_ACCENTS = ['#0d9488','#0ea5e9','#8b5cf6','#f59e0b','#10b981','#ef4444','#3b82f6','#ec4899'];

function StarRating({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= full ? '#f59e0b' : (i === full+1 && half ? '#f59e0b' : '#e2e8f0') }}>★</span>
      ))}
    </span>
  );
}

const TalkModal = ({ caregiver, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Care Inquiry for ${caregiver.name}`);
    const body = encodeURIComponent(
      `Hello ${caregiver.name},\n\nI am interested in your caregiving services.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${caregiver.email || 'support@familycare.com'}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'20px', padding:'2rem', width:'100%', maxWidth:'460px', position:'relative', boxShadow:'0 25px 60px rgba(0,0,0,0.2)', maxHeight:'90vh', overflowY:'auto' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'1rem', right:'1.2rem', background:'none', border:'none', fontSize:'1.4rem', cursor:'pointer', color:'#718096' }}>×</button>

        {sent ? (
          <div style={{ textAlign:'center', padding:'1.5rem 0' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎉</div>
            <h3 style={{ color:'#0d9488', marginBottom:'0.5rem' }}>Request Sent!</h3>
            <p style={{ color:'#718096', fontSize:'0.9rem' }}>Your email client should open shortly.</p>
            <button onClick={onClose} style={{ marginTop:'1.5rem', background:'#0d9488', color:'white', border:'none', borderRadius:'12px', padding:'0.8rem 2rem', fontWeight:'600', cursor:'pointer', width:'100%' }}>Done</button>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize:'1.3rem', marginBottom:'0.3rem', color:'#1a202c' }}>Contact {caregiver.name}</h3>
            <p style={{ color:'#718096', fontSize:'0.85rem', marginBottom:'1.5rem' }}>Send a message to enquire about availability and services.</p>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
              {[['Full Name','text','name','Jane Smith'],['Email','email','email','your@email.com'],['Phone (optional)','tel','phone','+1 234 567 8900']].map(([lbl,type,key,ph]) => (
                <div key={key}>
                  <label style={{ display:'block', fontSize:'0.8rem', fontWeight:'600', color:'#4a5568', marginBottom:'0.3rem' }}>{lbl.toUpperCase()}</label>
                  <input type={type} required={type!=='tel'} placeholder={ph}
                    style={{ width:'100%', padding:'0.7rem 1rem', borderRadius:'10px', border:'1.5px solid #e2e8f0', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' }}
                    value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} />
                </div>
              ))}
              <div>
                <label style={{ display:'block', fontSize:'0.8rem', fontWeight:'600', color:'#4a5568', marginBottom:'0.3rem' }}>MESSAGE</label>
                <textarea required rows={3} placeholder="Tell us about your care needs…"
                  style={{ width:'100%', padding:'0.7rem 1rem', borderRadius:'10px', border:'1.5px solid #e2e8f0', fontSize:'0.9rem', outline:'none', resize:'vertical', boxSizing:'border-box', fontFamily:'inherit' }}
                  value={form.message} onChange={e => setForm({...form,message:e.target.value})} />
              </div>
              <button type="submit" style={{ background:'#0d9488', color:'white', border:'none', borderRadius:'12px', padding:'0.85rem', fontWeight:'700', cursor:'pointer', fontSize:'0.95rem', marginTop:'0.25rem' }}>
                Send Message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const CaregiverProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cg, setCg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/caregivers/public/${id}`)
      .then(res => { if (!res.ok) throw new Error('Caregiver not found'); return res.json(); })
      .then(data => { setCg(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', color:'#718096' }}>
        <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>⏳</div>
        Loading profile…
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>😕</div>
        <p style={{ color:'#e53e3e', marginBottom:'1rem' }}>{error}</p>
        <button onClick={() => navigate('/caregivers')} style={{ background:'#0d9488', color:'white', border:'none', borderRadius:'10px', padding:'0.7rem 1.5rem', fontWeight:'600', cursor:'pointer' }}>
          ← Back to Caregivers
        </button>
      </div>
    </div>
  );

  const imgIdx  = AVATAR_POOL[(cg.id - 1) % AVATAR_POOL.length];
  const accent  = CARD_ACCENTS[(cg.id - 1) % CARD_ACCENTS.length];
  const avatar  = cg.avatar_url ? `http://localhost:5000${cg.avatar_url}` : `https://i.pravatar.cc/300?img=${imgIdx}`;
  const title   = cg.specialization ? cg.specialization.toUpperCase() : 'CAREGIVER';
  const price   = cg.hourly_rate ? `$${Number(cg.hourly_rate).toFixed(0)}/hr` : 'Contact for pricing';
  const tags    = [
    cg.experience_years && { icon:'🗓', label:`${cg.experience_years} Experience` },
    cg.certification    && { icon:'🏅', label: cg.certification },
    cg.license_id       && { icon:'📋', label:`License: ${cg.license_id}` },
    cg.languages        && { icon:'🌐', label: cg.languages },
  ].filter(Boolean);

  return (
    <div style={{ background:'#f8fafc', minHeight:'100vh', paddingBottom:'4rem' }}>
      {showContact && <TalkModal caregiver={cg} onClose={() => setShowContact(false)} />}

      {/* Hero banner */}
      <div style={{ background: accent, height:'200px', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.18)' }} />
        <div style={{ position:'absolute', top:'1.2rem', left:'1.5rem' }}>
          <button onClick={() => navigate('/caregivers')} style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(4px)', color:'white', border:'1px solid rgba(255,255,255,0.35)', borderRadius:'8px', padding:'0.45rem 1rem', fontWeight:'600', cursor:'pointer', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'6px' }}>
            ← Back
          </button>
        </div>
      </div>

      <div style={{ maxWidth:'860px', margin:'0 auto', padding:'0 1.5rem' }}>

        {/* Avatar + quick info row */}
        <div style={{ display:'flex', gap:'1.5rem', alignItems:'flex-end', marginTop:'-60px', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <img src={avatar} alt={cg.name}
              onError={e => { e.target.src = `https://i.pravatar.cc/300?img=${cg.id + 10}`; }}
              style={{ width:'120px', height:'120px', borderRadius:'50%', objectFit:'cover', border:'4px solid white', boxShadow:'0 4px 20px rgba(0,0,0,0.15)' }} />
            <span style={{ position:'absolute', bottom:'6px', right:'6px', width:'26px', height:'26px', background:'#10b981', borderRadius:'50%', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg viewBox="0 0 24 24" fill="white" width="12" height="12"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </span>
          </div>

          <div style={{ flex:1, paddingBottom:'0.5rem', minWidth:'200px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
              <h1 style={{ fontSize:'1.8rem', fontWeight:'800', color:'#1a202c', margin:0 }}>{cg.name}</h1>
              <span style={{ background:'#d1fae5', color:'#065f46', fontSize:'0.72rem', fontWeight:'700', padding:'3px 10px', borderRadius:'20px' }}>✓ Verified</span>
            </div>
            <p style={{ color: accent, fontWeight:'700', fontSize:'0.8rem', letterSpacing:'0.8px', textTransform:'uppercase', margin:'0.25rem 0 0' }}>{title}</p>
          </div>

          <div style={{ textAlign:'right', paddingBottom:'0.5rem' }}>
            <div style={{ fontSize:'2rem', fontWeight:'800', color:'#1a202c', lineHeight:1 }}>{price}</div>
            {cg.rating ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'6px', marginTop:'4px' }}>
                <StarRating value={Number(cg.rating)} />
                <span style={{ fontWeight:'700', fontSize:'0.95rem' }}>{Number(cg.rating).toFixed(1)}</span>
                {cg.total_reviews > 0 && <span style={{ color:'#a0aec0', fontSize:'0.82rem' }}>({cg.total_reviews} reviews)</span>}
              </div>
            ) : (
              <span style={{ background:'#e0f2fe', color:'#0369a1', fontSize:'0.72rem', fontWeight:'700', padding:'3px 10px', borderRadius:'20px', display:'inline-block', marginTop:'4px' }}>New</span>
            )}
          </div>
        </div>

        {/* Main content grid */}
        <div style={{ display:'grid', gridTemplateColumns:'clamp(280px,1fr,560px) 300px', gap:'1.5rem', marginTop:'1.5rem', flexWrap:'wrap' }}>

          {/* Left column */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

            {/* About */}
            {cg.bio && (
              <div style={{ background:'white', borderRadius:'16px', padding:'1.75rem', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize:'1.05rem', fontWeight:'700', color:'#1a202c', marginBottom:'0.9rem', display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ color: accent }}>👤</span> About
                </h2>
                <p style={{ color:'#4a5568', lineHeight:1.8, fontSize:'0.93rem', whiteSpace:'pre-line' }}>{cg.bio}</p>
              </div>
            )}

            {/* Qualifications */}
            {tags.length > 0 && (
              <div style={{ background:'white', borderRadius:'16px', padding:'1.75rem', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize:'1.05rem', fontWeight:'700', color:'#1a202c', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ color: accent }}>🏆</span> Qualifications
                </h2>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  {tags.map((t, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.9rem', padding:'0.75rem 1rem', background:'#f8fafc', borderRadius:'10px', border:'1px solid #e2e8f0' }}>
                      <span style={{ fontSize:'1.3rem' }}>{t.icon}</span>
                      <span style={{ fontWeight:'600', color:'#2d3748', fontSize:'0.9rem' }}>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div style={{ background:'white', borderRadius:'16px', padding:'1.75rem', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize:'1.05rem', fontWeight:'700', color:'#1a202c', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ color: accent }}>📅</span> Availability
              </h2>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'1rem', background: cg.is_available ? '#f0fdf4' : '#fffbeb', borderRadius:'12px', border:`1px solid ${cg.is_available ? '#86efac' : '#fde68a'}` }}>
                <span style={{ fontSize:'1.5rem' }}>{cg.is_available ? '✅' : '🕐'}</span>
                <div>
                  <div style={{ fontWeight:'700', color: cg.is_available ? '#065f46' : '#92400e', fontSize:'0.95rem' }}>
                    {cg.is_available ? 'Currently Available' : 'Available on Request'}
                  </div>
                  <div style={{ color:'#718096', fontSize:'0.82rem', marginTop:'2px' }}>
                    {cg.is_available ? 'This caregiver is accepting new clients.' : 'Contact to check schedule.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

            {/* Contact card */}
            <div style={{ background:'white', borderRadius:'16px', padding:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', position:'sticky', top:'1rem' }}>
              <h3 style={{ fontSize:'1rem', fontWeight:'700', color:'#1a202c', marginBottom:'1rem' }}>Get in Touch</h3>

              <button onClick={() => setShowContact(true)}
                style={{ width:'100%', padding:'0.85rem', background: accent, color:'white', border:'none', borderRadius:'12px', fontWeight:'700', fontSize:'0.95rem', cursor:'pointer', marginBottom:'0.75rem', transition:'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                Send Message
              </button>

              <button onClick={() => navigate('/register')}
                style={{ width:'100%', padding:'0.85rem', background:'#f1f5f9', color:'#1a202c', border:'none', borderRadius:'12px', fontWeight:'600', fontSize:'0.9rem', cursor:'pointer' }}>
                Book Now
              </button>

              <div style={{ marginTop:'1.25rem', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.83rem', color:'#4a5568' }}>
                  <span>📍</span>
                  <span>{cg.location || 'In-home & Facility'}</span>
                </div>
                {cg.phone && (
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.83rem', color:'#4a5568' }}>
                    <span>📞</span>
                    <span>{cg.phone}</span>
                  </div>
                )}
                {cg.languages && (
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.83rem', color:'#4a5568' }}>
                    <span>🌐</span>
                    <span>{cg.languages}</span>
                  </div>
                )}
              </div>

              <div style={{ marginTop:'1.25rem', padding:'0.9rem', background:'#f0fdf4', borderRadius:'10px', fontSize:'0.78rem', color:'#065f46', lineHeight:1.5 }}>
                🔒 All caregivers are identity-verified and background-checked by FamilyCare.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverProfile;
