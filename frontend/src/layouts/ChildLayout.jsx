import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Bell,
  MessageSquare,
  HelpCircle,
  Menu,
  Search,
  LayoutDashboard,
  Users,
  Activity,
  BarChart2,
  X
} from 'lucide-react';
import ChildSidebar from '../components/child/ChildSidebar';
import { useAuth } from '../context/AuthContext';
import './ChildLayout.css';

const mobileNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users,           label: 'Parents',   path: '/parents' },
  { icon: Activity,        label: 'Feed',      path: '/health-feed' },
  { icon: BarChart2,       label: 'Analytics', path: '/analytics' },
  { icon: Bell,            label: 'Alerts',    path: '/alerts' },
];

const ChildLayout = ({ children, title = 'Dashboard' }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="cl-wrapper">
      {open && <div className="cl-overlay" onClick={() => setOpen(false)} />}
      
      <div className={`cl-sidebar-slot${open ? ' open' : ''}`}>
        <ChildSidebar />
      </div>

      <div className="cl-main">
        <header className="cl-header">
          <div className="cl-header-left">
            <button
              className="cl-menu-btn"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div>
              <h2 className="cl-page-title">{title}</h2>
              <span className="cl-sub hide-mobile">Family Wellness Portal</span>
            </div>
          </div>

          <div className="cl-header-right">
            <div className="cl-search hide-mobile">
              <Search size={15} className="cl-search-icon" />
              <input type="text" placeholder="Search family, vitals, carers…" />
            </div>
            <Link to="/alerts" className="cl-icon-btn" title="Alerts">
              <Bell size={19} />
              <span className="cl-badge" />
            </Link>
            <Link to="/messages" className="cl-icon-btn hide-mobile" title="Messages">
              <MessageSquare size={19} />
            </Link>
            <Link to="/help-center" className="cl-icon-btn hide-mobile" title="Help">
              <HelpCircle size={19} />
            </Link>
            <Link to="/settings" className="cl-profile" title="Profile Settings">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                alt="profile"
              />
            </Link>
          </div>
        </header>

        <main className="cl-content">
          {children}
        </main>

        {/* Mobile Bottom Icon Navigation Tabs */}
        <nav className="cl-mobile-nav" aria-label="Mobile Navigation">
          {mobileNavItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `cl-mob-link${isActive ? ' active' : ''}`}
            >
              <div className="cl-mob-icon-wrap">
                <Icon size={19} />
              </div>
              <span className="cl-mob-label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ChildLayout;

