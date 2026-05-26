import React, { useState, useRef, useEffect } from 'react';
import { Bell, HelpCircle, Menu, X, CheckCheck, Clock, AlertCircle, Calendar, FileText, MessageCircle, BookOpen, Phone } from 'lucide-react';
import CaregiverSidebar from '../components/caregiver/CaregiverSidebar';
import { useAuth } from '../context/AuthContext';
import './CaregiverLayout.css';

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    type: 'alert',
    title: 'Health Alert',
    message: "Patient John D.'s blood pressure reading is above threshold.",
    time: '5 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'appointment',
    title: 'Upcoming Appointment',
    message: 'Medication review scheduled for today at 3:00 PM.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 3,
    type: 'log',
    title: 'Care Log Submitted',
    message: 'Your morning care log was successfully submitted.',
    time: '3 hrs ago',
    read: true,
  },
  {
    id: 4,
    type: 'message',
    title: 'New Message',
    message: 'Family member Sarah M. sent you a message.',
    time: 'Yesterday',
    read: true,
  },
];

const HELP_ITEMS = [
  { icon: BookOpen, label: 'Documentation', description: 'Read how to use the caregiver portal' },
  { icon: MessageCircle, label: 'Live Chat Support', description: 'Chat with our support team' },
  { icon: Phone, label: 'Call Support', description: 'Mon–Fri, 8 AM – 6 PM' },
  { icon: FileText, label: 'Submit a Ticket', description: 'Report a bug or request help' },
];

const notifIcon = (type) => {
  if (type === 'alert')       return { Icon: AlertCircle, bg: '#FEF2F2', color: '#DC2626' };
  if (type === 'appointment') return { Icon: Calendar,     bg: '#EFF6FF', color: '#2563EB' };
  if (type === 'message')     return { Icon: MessageCircle,bg: '#F0FDF4', color: '#16A34A' };
  return                             { Icon: FileText,      bg: '#F5F3FF', color: '#7C3AED' };
};

const CaregiverLayout = ({ children, title = "Dashboard" }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen]       = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp]                 = useState(false);
  const [notifications, setNotifications]       = useState(SAMPLE_NOTIFICATIONS);

  const notifRef = useRef(null);
  const helpRef  = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (helpRef.current  && !helpRef.current.contains(e.target))  setShowHelp(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead    = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="layout-wrapper">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <CaregiverSidebar />
      </div>

      <div className="layout-main">
        <header className="layout-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h2 className="header-title">{title}</h2>
          </div>

          <div className="header-actions">
            <div className="header-icon-group">

              {/* ── Bell ── */}
              <div className="hdr-popover-wrap" ref={notifRef}>
                <button
                  className={`icon-btn ${showNotifications ? 'icon-btn--active' : ''}`}
                  onClick={() => { setShowNotifications(p => !p); setShowHelp(false); }}
                >
                  <Bell size={20} strokeWidth={2} />
                  {unreadCount > 0 && (
                    <span className="notification-dot">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>

                {showNotifications && (
                  <div className="hdr-popover notif-popover">
                    <div className="popover-header">
                      <span className="popover-title">Notifications</span>
                      {unreadCount > 0 && (
                        <button className="popover-action-btn" onClick={markAllRead}>
                          <CheckCheck size={13} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="notif-list">
                      {notifications.map(n => {
                        const { Icon, bg, color } = notifIcon(n.type);
                        return (
                          <div
                            key={n.id}
                            className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
                            onClick={() => markRead(n.id)}
                          >
                            <div className="notif-icon-wrap" style={{ backgroundColor: bg }}>
                              <Icon size={15} color={color} />
                            </div>
                            <div className="notif-body">
                              <p className="notif-title">{n.title}</p>
                              <p className="notif-msg">{n.message}</p>
                              <p className="notif-time"><Clock size={10} /> {n.time}</p>
                            </div>
                            {!n.read && <span className="notif-unread-dot" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="popover-footer">
                      <button className="popover-footer-btn">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Help ── */}
              <div className="hdr-popover-wrap hide-on-mobile" ref={helpRef}>
                <button
                  className={`icon-btn ${showHelp ? 'icon-btn--active' : ''}`}
                  onClick={() => { setShowHelp(p => !p); setShowNotifications(false); }}
                >
                  <HelpCircle size={20} strokeWidth={2} />
                </button>

                {showHelp && (
                  <div className="hdr-popover help-popover">
                    <div className="popover-header">
                      <span className="popover-title">Help & Support</span>
                      <button className="popover-close-btn" onClick={() => setShowHelp(false)}>
                        <X size={14} />
                      </button>
                    </div>

                    <div className="help-list">
                      {HELP_ITEMS.map(({ icon: Icon, label, description }) => (
                        <button key={label} className="help-item">
                          <div className="help-icon-wrap">
                            <Icon size={16} color="#0d9488" />
                          </div>
                          <div>
                            <p className="help-label">{label}</p>
                            <p className="help-desc">{description}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="popover-footer">
                      <p className="help-footer-note">FamilyCare Support · v1.0</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="header-divider hide-on-mobile"></div>

            <div className="profile-group">
              <div className="profile-info hide-on-mobile">
                <p className="profile-name">{user?.name || 'Caregiver'}</p>
                <p className="profile-role">Caregiver</p>
              </div>
              <div className="profile-avatar">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'Caregiver')}`} alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CaregiverLayout;