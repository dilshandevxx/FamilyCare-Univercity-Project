import React, { useState } from 'react';
import { Bell, MessageSquare, HelpCircle, Menu, Search } from 'lucide-react';
import ChildSidebar from '../components/child/ChildSidebar';
import { useAuth } from '../context/AuthContext';
import './ChildLayout.css';

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
            <button className="cl-menu-btn" onClick={() => setOpen(!open)}>
              <Menu size={22} />
            </button>
            <h2 className="cl-page-title">{title}</h2>
            <p className="cl-sub hide-mobile">The Living Sanctuary</p>
          </div>

          <div className="cl-header-right">
            <div className="cl-search hide-mobile">
              <Search size={16} className="cl-search-icon" />
              <input type="text" placeholder="Search care network..." />
            </div>
            <button className="cl-icon-btn">
              <Bell size={20} />
              <span className="cl-badge"></span>
            </button>
            <button className="cl-icon-btn hide-mobile"><MessageSquare size={20} /></button>
            <button className="cl-icon-btn hide-mobile"><HelpCircle size={20} /></button>
            <div className="cl-profile">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Alex'}`}
                alt="profile"
              />
            </div>
          </div>
        </header>

        <main className="cl-content">{children}</main>
      </div>
    </div>
  );
};

export default ChildLayout;
