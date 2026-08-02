import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { Menu, X, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'Features',   to: '/features' },
  { label: 'Caregivers', to: '/caregivers' },
  { label: 'About',      to: '/about' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { openLogin, openRegister } = useAuthModal();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar__inner container">
          {/* Logo */}
          <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 21C12 21 3 14 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14 14 21 12 21Z" fill="url(#grad)"/>
                <defs>
                  <linearGradient id="grad" x1="3" y1="3" x2="23" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0D9488" />
                    <stop offset="1" stopColor="#0F766E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">FamilyCare</span>
          </Link>

          {/* Desktop Links */}
          <div className="navbar__links">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' nav-link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="navbar__auth">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'caregiver' ? '/caregiver/dashboard' : '/dashboard'} className="btn-modern btn-modern-dashboard">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-modern btn-modern-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  onClick={() => openLogin('family')} 
                  className="nav-link-login"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                >
                  Log in
                </button>
                <button 
                  type="button" 
                  onClick={() => openRegister('family')} 
                  className="btn-modern btn-modern-primary"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  <span>Sign Up</span>
                  <ChevronRight size={16} className="btn-icon" />
                </button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div className={`mobile-overlay${menuOpen ? ' mobile-overlay--open' : ''}`}>
        <div className="mobile-overlay__header">
          <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 21C12 21 3 14 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14 14 21 12 21Z" fill="url(#grad2)"/>
                <defs>
                  <linearGradient id="grad2" x1="3" y1="3" x2="23" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0D9488" />
                    <stop offset="1" stopColor="#0F766E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">FamilyCare</span>
          </Link>
          <button className="mobile-overlay__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-overlay__nav">
          {NAV_LINKS.map(({ label, to }, idx) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `mobile-nav-link${isActive ? ' mobile-nav-link--active' : ''}`
              }
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mobile-overlay__footer">
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'caregiver' ? '/caregiver/dashboard' : '/dashboard'}
                className="btn-modern btn-modern-dashboard w-full justify-center mb-3"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-modern btn-modern-logout w-full justify-center">Logout</button>
            </>
          ) : (
            <>
              <button 
                type="button" 
                className="btn-modern btn-modern-primary w-full justify-center mb-3" 
                onClick={() => { setMenuOpen(false); openRegister('family'); }}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                Get Started
              </button>
              <button 
                type="button" 
                className="btn-modern btn-modern-outline w-full justify-center mb-6" 
                onClick={() => { setMenuOpen(false); openLogin('family'); }}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                Log In
              </button>
              <Link to="/admin/login" className="mobile-admin-link" onClick={() => setMenuOpen(false)}>
                Admin Portal →
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        /* ── Modern Navbar Base ── */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: transparent;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 1.5rem 0;
        }
        
        .navbar--scrolled {
          padding: 0.75rem 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .navbar__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── Logo ── */
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          z-index: 1001;
        }
        .logo-icon {
          width: 36px; height: 36px;
          border-radius: 12px;
          background: #ebf8f6;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 2px 10px rgba(13, 148, 136, 0.1);
        }
        .navbar__logo:hover .logo-icon {
          transform: scale(1.05) rotate(-5deg);
          box-shadow: 0 6px 16px rgba(13, 148, 136, 0.2);
        }
        .logo-text {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          transition: color 0.3s ease;
        }
        .navbar__logo:hover .logo-text {
          color: #0D9488;
        }

        /* ── Desktop Links ── */
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.6);
          padding: 0.4rem;
          border-radius: 4px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 2px 15px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }
        .navbar--scrolled .navbar__links {
          background: rgba(248, 250, 252, 0.8);
          box-shadow: none;
        }

        .nav-link {
          text-decoration: none;
          color: #475569;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .nav-link:hover {
          color: #0f172a;
          background: rgba(15, 23, 42, 0.04);
        }
        .nav-link--active {
          color: #0D9488 !important;
          background: #ebf8f6;
          font-weight: 600;
        }

        /* ── Desktop Auth ── */
        .navbar__auth {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.4);
          padding: 0.35rem 0.35rem 0.35rem 0.75rem;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .navbar--scrolled .navbar__auth {
          background: rgba(248, 250, 252, 0.6);
        }
        
        .nav-link-login, .nav-link-dashboard {
          text-decoration: none;
          color: #334155;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link-login:hover, .nav-link-dashboard:hover {
          color: #0f172a;
          background: rgba(15, 23, 42, 0.05);
        }

        .btn-modern {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0.6rem 1.4rem;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          border: none;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .btn-modern-primary {
          background: #0f172a;
          color: white;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
        }
        .btn-modern-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
          opacity: 1;
          z-index: -1;
          transition: opacity 0.4s ease;
        }
        .btn-modern-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          z-index: -1;
          transition: transform 0.6s ease;
        }
        
        .btn-modern-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(13, 148, 136, 0.35);
        }
        .btn-modern-primary:hover::after {
          transform: translateX(100%);
        }
        .btn-modern-primary .btn-icon {
          transition: transform 0.3s ease;
        }
        .btn-modern-primary:hover .btn-icon {
          transform: translateX(4px);
        }
        
        .btn-modern-outline {
          background: white;
          color: #0f172a;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .btn-modern-outline:hover {
          border-color: #0D9488;
          color: #0D9488;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
        }
        
        .btn-modern-dashboard {
          background: #0D9488;
          color: white;
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.25);
        }
        .btn-modern-dashboard:hover {
          background: #0F766E;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 148, 136, 0.35);
        }

        .btn-modern-logout {
          background: #ef4444;
          color: white;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);
        }
        .btn-modern-logout:hover {
          background: #dc2626;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.35);
        }
        
        .w-full { width: 100%; }
        .justify-center { justify-content: center; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-6 { margin-bottom: 1.5rem; }

        /* ── Hamburger ── */
        .navbar__hamburger {
          display: none;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          padding: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 1001;
        }
        .navbar__hamburger:hover {
          background: #f1f5f9;
        }

        /* ── Mobile Overlay ── */
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 999;
          flex-direction: column;
          padding: 1.5rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .mobile-overlay--open {
          opacity: 1;
          pointer-events: auto;
        }

        .mobile-overlay__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        .mobile-overlay__close {
          background: #f1f5f9;
          border: none;
          width: 44px; height: 44px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-overlay__close:hover {
          background: #e2e8f0;
          color: #0f172a;
          transform: rotate(90deg);
        }

        .mobile-overlay__nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 3rem;
        }
        .mobile-nav-link {
          text-decoration: none;
          color: #334155;
          font-size: 1.4rem;
          font-weight: 600;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          background: transparent;
          transition: all 0.2s ease;
          opacity: 0;
          transform: translateY(10px);
        }
        .mobile-overlay--open .mobile-nav-link {
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .mobile-nav-link:hover {
          background: #f8fafc;
          color: #0f172a;
          padding-left: 2rem;
        }
        .mobile-nav-link--active {
          background: #ebf8f6;
          color: #0D9488 !important;
        }

        .mobile-overlay__footer {
          margin-top: auto;
          padding-bottom: 2rem;
          opacity: 0;
          transform: translateY(10px);
        }
        .mobile-overlay--open .mobile-overlay__footer {
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.2s;
        }

        .mobile-admin-link {
          display: block;
          text-align: center;
          color: #64748b;
          font-weight: 500;
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .mobile-admin-link:hover {
          color: #0D9488;
        }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive breakpoints ── */
        @media (max-width: 900px) {
          .navbar__links, .navbar__auth { display: none; }
          .navbar__hamburger { display: flex; }
          .mobile-overlay { display: flex; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
