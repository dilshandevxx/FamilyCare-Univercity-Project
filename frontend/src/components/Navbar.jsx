import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'Features',   to: '/features' },
  { label: 'Caregivers', to: '/caregivers' },
  { label: 'About',      to: '/about' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
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
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">

          {/* Logo */}
          <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
            <span style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'var(--color-primary)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 21C12 21 3 14 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14 14 21 12 21Z" fill="white"/>
              </svg>
            </span>
            FamilyCare
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
                <Link to={user.role === 'admin' ? '/admin-v2/dashboard' : user.role === 'caregiver' ? '/caregiver/dashboard' : '/dashboard'} className="nav-link">Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-secondary navbar__cta">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary navbar__cta">Sign Up</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div className={`mobile-overlay${menuOpen ? ' mobile-overlay--open' : ''}`}>
        {/* Overlay header */}
        <div className="mobile-overlay__header">
          <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
            <span style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'var(--color-primary)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 21C12 21 3 14 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14 14 21 12 21Z" fill="white"/>
              </svg>
            </span>
            FamilyCare
          </Link>
          <button className="mobile-overlay__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="mobile-overlay__nav">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `mobile-nav-link${isActive ? ' mobile-nav-link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mobile-overlay__divider" />

        {/* Auth */}
        <div className="mobile-overlay__auth">
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/admin-v2/dashboard' : user.role === 'caregiver' ? '/caregiver/dashboard' : '/dashboard'}
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="mobile-btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-btn-outline" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="mobile-btn-primary" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        /* ── Navbar base ── */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(0,0,0,0.07);
          transition: box-shadow 0.3s ease, background 0.3s ease;
        }
        .navbar--scrolled {
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
          background: rgba(255,255,255,0.98);
        }
        .navbar::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--color-primary), transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .navbar--scrolled::after { opacity: 1; }

        .navbar__inner {
          display: flex;
          align-items: center;
          height: 72px;
          gap: 2rem;
        }

        /* Logo */
        .navbar__logo {
          display: flex; align-items: center; gap: 8px;
          font-size: 1.3rem; font-weight: 800;
          color: var(--color-primary); text-decoration: none;
          white-space: nowrap; flex-shrink: 0; letter-spacing: -0.3px;
        }

        /* Desktop nav links */
        .navbar__links {
          display: flex; gap: 0.25rem; flex: 1; justify-content: center;
        }
        .nav-link {
          text-decoration: none; color: #4A5568; font-weight: 500;
          font-size: 0.95rem; padding: 0.45rem 0.85rem; border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: var(--color-primary); background: #f0faf9; }
        .nav-link--active {
          color: var(--color-primary) !important;
          background: #e0f2f1; font-weight: 600;
        }

        /* Desktop auth */
        .navbar__auth {
          display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;
        }
        .navbar__cta {
          font-size: 0.9rem; padding: 0.55rem 1.2rem;
          border-radius: 8px; text-decoration: none;
        }

        /* Hamburger — hidden on desktop */
        .navbar__hamburger {
          display: none; background: none; border: none; cursor: pointer;
          color: #1A202C; padding: 6px; border-radius: 8px;
          transition: background 0.2s; margin-left: auto;
        }
        .navbar__hamburger:hover { background: #F7FAFC; }

        /* ── Full-screen mobile overlay ── */
        .mobile-overlay {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: white;
          z-index: 999;
          flex-direction: column;
          padding: 0 1.5rem 2rem;
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
        }
        .mobile-overlay--open { transform: translateX(0); }

        .mobile-overlay__header {
          display: flex; align-items: center; justify-content: space-between;
          height: 72px; flex-shrink: 0;
          border-bottom: 1px solid #F1F5F9;
          margin-bottom: 0.5rem;
        }
        .mobile-overlay__close {
          background: #F7FAFC; border: none; cursor: pointer;
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #374151; transition: background 0.2s;
        }
        .mobile-overlay__close:hover { background: #EDF2F7; }

        .mobile-overlay__nav {
          display: flex; flex-direction: column; gap: 4px; margin: 0.5rem 0;
        }
        .mobile-nav-link {
          text-decoration: none; color: #374151; font-weight: 500;
          font-size: 1.1rem; padding: 0.9rem 1rem; border-radius: 12px;
          transition: color 0.2s, background 0.2s; display: block;
        }
        .mobile-nav-link:hover { color: var(--color-primary); background: #f0faf9; }
        .mobile-nav-link--active {
          color: var(--color-primary) !important;
          background: #e6f7f5; font-weight: 700;
        }

        .mobile-overlay__divider {
          height: 1px; background: #F1F5F9; margin: 0.75rem 0;
        }

        .mobile-overlay__auth {
          display: flex; flex-direction: column; gap: 10px; margin-top: 0.5rem;
        }
        .mobile-btn-outline {
          display: block; text-align: center; text-decoration: none;
          border: 1.5px solid #D1D5DB; background: white;
          color: #374151; font-weight: 600; font-size: 1rem;
          padding: 0.9rem 1rem; border-radius: 50px; cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .mobile-btn-outline:hover { border-color: var(--color-primary); color: var(--color-primary); }
        .mobile-btn-primary {
          display: block; text-align: center; text-decoration: none;
          background: var(--color-primary); color: white;
          font-weight: 600; font-size: 1rem;
          padding: 0.9rem 1rem; border-radius: 50px;
          box-shadow: 0 4px 14px rgba(0,168,150,0.35);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .mobile-btn-primary:hover {
          background: var(--color-primary-dark);
          box-shadow: 0 6px 20px rgba(0,168,150,0.45);
        }

        /* ── Responsive breakpoint ── */
        @media (max-width: 768px) {
          .navbar__links, .navbar__auth { display: none; }
          .navbar__hamburger { display: flex; }
          .mobile-overlay { display: flex; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
