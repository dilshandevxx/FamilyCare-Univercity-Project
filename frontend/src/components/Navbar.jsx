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
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-secondary navbar__cta">
                  Logout
                </button>
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
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <div className={`navbar__drawer${menuOpen ? ' navbar__drawer--open' : ''}`}>
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `drawer-link${isActive ? ' drawer-link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div className="drawer-divider" />
          {user ? (
            <>
              <Link to="/dashboard" className="drawer-link" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary drawer-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="drawer-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary drawer-btn" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          transition: box-shadow 0.3s ease, background 0.3s ease;
        }
        .navbar--scrolled {
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.97);
        }

        .navbar__inner {
          display: flex;
          align-items: center;
          height: 72px;
          gap: 2rem;
        }

        /* Logo */
        .navbar__logo {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--color-primary);
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Desktop nav links */
        .navbar__links {
          display: flex;
          gap: 0.25rem;
          flex: 1;
          justify-content: center;
        }
        .nav-link {
          text-decoration: none;
          color: #4A5568;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover {
          color: var(--color-primary);
          background: #f0faf9;
        }
        .nav-link--active {
          color: var(--color-primary) !important;
          background: #e0f2f1;
          font-weight: 600;
        }

        /* Auth side */
        .navbar__auth {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .navbar__cta {
          font-size: 0.9rem;
          padding: 0.55rem 1.2rem;
          border-radius: 8px;
        }

        /* Hamburger */
        .navbar__hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #1A202C;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.2s;
          margin-left: auto;
        }
        .navbar__hamburger:hover { background: #F7FAFC; }

        /* Mobile Drawer */
        .navbar__drawer {
          display: none;
          flex-direction: column;
          padding: 0.5rem 1.5rem 1.5rem;
          gap: 0.25rem;
          background: white;
          border-top: 1px solid #EDF2F7;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease, padding 0.3s ease;
        }
        .navbar__drawer--open {
          max-height: 400px;
          padding: 1rem 1.5rem 1.5rem;
        }
        .drawer-link {
          text-decoration: none;
          color: #4A5568;
          font-weight: 500;
          font-size: 1rem;
          padding: 0.65rem 0.75rem;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .drawer-link:hover { color: var(--color-primary); background: #f0faf9; }
        .drawer-link--active {
          color: var(--color-primary) !important;
          background: #e0f2f1;
          font-weight: 600;
        }
        .drawer-divider {
          height: 1px;
          background: #EDF2F7;
          margin: 0.5rem 0;
        }
        .drawer-btn {
          margin-top: 0.25rem;
          text-align: center;
          padding: 0.7rem 1rem;
          font-size: 0.95rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .navbar__links,
          .navbar__auth { display: none; }
          .navbar__hamburger { display: flex; }
          .navbar__drawer { display: flex; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
