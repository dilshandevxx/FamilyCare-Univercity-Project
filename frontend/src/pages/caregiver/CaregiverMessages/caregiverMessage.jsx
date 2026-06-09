import React, { useState, useEffect, useRef, useCallback } from 'react';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import {
  Search, Phone, Info, Plus, Image as ImageIcon, Send,
  Calendar, Pill, FileText, Download, MessageSquarePlus,
  LayoutGrid, Users, ClipboardList, MessageSquare,
  MessageCircle, Loader2, ChevronLeft, X, PenSquare,
} from 'lucide-react';
import './caregiverMessage.css';

/* ── helpers ─────────────────────────────────────────────── */

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date    = new Date(dateStr);
  const now     = new Date();
  const diffMs  = now - date;
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffDay === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7)   return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || 'user')}`;

/* ── skeleton loader ─────────────────────────────────────── */

const ContactSkeleton = () => (
  <div className="contacts-loading">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="contact-skeleton">
        <div className="skeleton-content">
          <div className="skeleton-row">
            <div className="skeleton-line short" />
            <div className="skeleton-line xshort" />
          </div>
          <div className="skeleton-line medium" />
          <div className="skeleton-line long" />
        </div>
      </div>
    ))}
  </div>
);

/* ── main component ──────────────────────────────────────── */

const CaregiverMessage = () => {
  const { user } = useAuth();

  const [contacts,        setContacts]        = useState([]);
  const [selected,        setSelected]        = useState(null);
  const [messages,        setMessages]        = useState([]);
  const [newMessage,      setNewMessage]      = useState('');
  const [searchQuery,     setSearchQuery]     = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending,         setSending]         = useState(false);
  const [showChat,        setShowChat]        = useState(false); // mobile

  // compose modal
  const [showCompose,     setShowCompose]     = useState(false);
  const [allUsers,        setAllUsers]        = useState([]);
  const [loadingUsers,    setLoadingUsers]    = useState(false);
  const [userSearch,      setUserSearch]      = useState('');
  const [sendError,       setSendError]       = useState('');

  // right-sidebar
  const [sidebarData,    setSidebarData]    = useState(null);
  const [loadingSidebar, setLoadingSidebar] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const pollingRef     = useRef(null);

  /* load contacts list */
  const loadContacts = useCallback(async (silent = false) => {
    if (!silent) setLoadingContacts(true);
    try {
      const { data } = await api.get('/messages/contacts');
      setContacts(data);
    } catch (err) {
      console.error('loadContacts:', err);
    } finally {
      if (!silent) setLoadingContacts(false);
    }
  }, []);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  /* load messages for selected contact + mark as read */
  const loadMessages = useCallback(async (contactId, quiet = false) => {
    if (!contactId) return;
    if (!quiet) setLoadingMessages(true);
    try {
      const { data } = await api.get(`/messages/${contactId}`);
      setMessages(data);
    } catch (err) {
      console.error('loadMessages:', err);
    } finally {
      if (!quiet) setLoadingMessages(false);
    }
  }, []);

  /* load elder sidebar data when a contact with an elder is selected */
  const loadSidebarData = useCallback(async (elderId) => {
    if (!elderId) { setSidebarData(null); return; }
    setSidebarData(null);
    setLoadingSidebar(true);
    try {
      const { data } = await api.get(`/messages/elder-sidebar/${elderId}`);
      setSidebarData(data);
    } catch (err) {
      console.error('loadSidebarData:', err);
    } finally {
      setLoadingSidebar(false);
    }
  }, []);

  useEffect(() => { loadSidebarData(selected?.elder_id ?? null); }, [selected, loadSidebarData]);

  /* polling: refresh messages + contacts every 5 s while a chat is open */
  useEffect(() => {
    if (!selected) { clearInterval(pollingRef.current); return; }
    pollingRef.current = setInterval(() => {
      loadMessages(selected.id, true);
      loadContacts(true);
    }, 5000);
    return () => clearInterval(pollingRef.current);
  }, [selected, loadMessages, loadContacts]);

  /* auto-scroll to bottom whenever messages change */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* select a conversation */
  const handleSelect = async (contact) => {
    setSelected(contact);
    setShowChat(true);
    setLoadingMessages(true);

    // Clear unread badge optimistically
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c))
    );

    try {
      const { data } = await api.get(`/messages/${contact.id}`);
      setMessages(data);
    } catch (err) {
      console.error('handleSelect:', err);
    } finally {
      setLoadingMessages(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  /* send message */
  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || !selected || sending) return;

    setSendError('');
    setNewMessage('');
    setSending(true);

    // Optimistic bubble — mark it pending so we can show a failed state
    const optimisticId = `opt-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id:          optimisticId,
        sender_id:   user?.id,
        receiver_id: selected.id,
        message:     text,
        created_at:  new Date().toISOString(),
        pending:     true,
      },
    ]);

    try {
      await api.post('/messages', { receiver_id: selected.id, message: text });
      await loadMessages(selected.id, true);
      loadContacts(true);
    } catch (err) {
      // Mark the optimistic bubble as failed instead of silently removing it
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId ? { ...m, failed: true, pending: false } : m
        )
      );
      setNewMessage(text);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Could not send message. Is the server running?';
      setSendError(msg);
      // Auto-dismiss error after 5 s
      setTimeout(() => setSendError(''), 5000);
      console.error('handleSend:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* compose: open modal + fetch all users */
  const openCompose = async () => {
    setShowCompose(true);
    setUserSearch('');
    if (allUsers.length > 0) return; // already loaded
    setLoadingUsers(true);
    try {
      const { data } = await api.get('/messages/all-users');
      setAllUsers(data);
    } catch (err) {
      console.error('openCompose:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  /* start a chat directly with a chosen user */
  const startChatWith = (user) => {
    setShowCompose(false);
    setUserSearch('');
    // Build a minimal contact shape so the chat column renders
    const contact = {
      id:         user.id,
      name:       user.name,
      email:      user.email,
      role:       user.role,
      elder_name: null,
      elder_id:   null,
      unreadCount: 0,
      lastMessage: null,
    };
    // Add to contacts list if not already there
    setContacts((prev) =>
      prev.find((c) => c.id === user.id) ? prev : [contact, ...prev]
    );
    handleSelect(contact);
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.elder_name && c.elder_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  /* ── render ──────────────────────────────────────────── */
  return (
    <CaregiverLayout title="Messages">
      <div className="messages-container">

        {/* ── LEFT: conversations list ── */}
        <div className={`conversations-column${showChat ? ' hidden-mobile' : ''}`}>
          <div className="conv-column-header">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>
            <button className="compose-btn" onClick={openCompose} title="New message">
              <PenSquare size={18} />
            </button>
          </div>

          <div className="conversations-list">
            {loadingContacts ? (
              <ContactSkeleton />
            ) : filteredContacts.length === 0 ? (
              <div className="empty-contacts">
                <MessageCircle size={44} className="empty-icon" />
                <p>{searchQuery ? 'No conversations match your search' : 'No contacts yet'}</p>
                {!searchQuery && (
                  <span>Contacts appear once elders are assigned to you</span>
                )}
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`conversation-item${selected?.id === contact.id ? ' active' : ''}`}
                  onClick={() => handleSelect(contact)}
                >
                  {/* avatar (visible on mobile only via CSS) */}
                  <div className="conv-avatar-wrapper">
                    <img
                      src={avatarUrl(contact.name)}
                      alt={contact.name}
                      className="conv-avatar"
                    />
                    <span className="online-indicator" />
                  </div>

                  <div className="conv-details">
                    <div className="conv-header">
                      <span className="conv-name">{contact.name}</span>
                      <span className="conv-time">
                        {contact.lastMessage
                          ? formatTime(contact.lastMessage.created_at)
                          : ''}
                      </span>
                    </div>

                    {contact.elder_name && (
                      <>
                        <div className="conv-regarding-desktop">
                          Regarding: {contact.elder_name}
                        </div>
                        <div className="conv-regarding-mobile">
                          Elder: {contact.elder_name}
                        </div>
                      </>
                    )}

                    <div className="conv-preview-row">
                      <p className="conv-preview">
                        {contact.lastMessage?.message || 'No messages yet'}
                      </p>
                      {contact.unreadCount > 0 && (
                        <span className="unread-badge">{contact.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="mobile-fab">
            <MessageSquarePlus size={24} color="white" />
          </button>
        </div>

        {/* ── MIDDLE: chat window ── */}
        <div className={`chat-column${!showChat ? ' hidden-mobile' : ''}`}>
          {selected ? (
            <>
              {/* header */}
              <div className="chat-header">
                <div className="chat-header-info">
                  <button className="back-btn" onClick={() => setShowChat(false)}>
                    <ChevronLeft size={20} />
                  </button>
                  <img
                    src={avatarUrl(selected.name)}
                    alt={selected.name}
                    className="chat-avatar"
                  />
                  <div>
                    <h3 className="chat-name">
                      {selected.name}
                      <span className="status-badge">ONLINE</span>
                    </h3>
                    {selected.elder_name && (
                      <p className="chat-regarding">
                        Regarding: <strong>{selected.elder_name}</strong>
                      </p>
                    )}
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="icon-btn"><Phone size={20} /></button>
                  <button className="icon-btn"><Info  size={20} /></button>
                </div>
              </div>

              {/* messages */}
              <div className="chat-messages">
                {loadingMessages ? (
                  <div className="messages-loading">
                    <Loader2 size={28} className="spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="empty-messages">
                    <MessageCircle size={44} />
                    <p>No messages yet — say hello!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = Number(msg.sender_id) === Number(user?.id);
                    return (
                      <div
                        key={msg.id}
                        className={`message-bubble ${isMe ? 'me' : 'them'}${msg.failed ? ' failed' : ''}${msg.pending ? ' pending' : ''}`}
                      >
                        {msg.message}
                        {msg.failed && (
                          <span className="msg-failed-label">⚠ Failed to send</span>
                        )}
                        <div className="message-time">{formatTime(msg.created_at)}</div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* error banner */}
              {sendError && (
                <div className="send-error-banner">
                  <span>⚠ {sendError}</span>
                  <button onClick={() => setSendError('')}><X size={14} /></button>
                </div>
              )}

              {/* input */}
              <div className="chat-input-area">
                <button className="icon-btn"><Plus      size={20} /></button>
                <button className="icon-btn"><ImageIcon size={20} /></button>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type message..."
                  className="chat-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className={`send-btn${sending ? ' sending' : ''}`}
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                >
                  {sending
                    ? <Loader2 size={18} color="white" className="spin" />
                    : <Send    size={18} color="white" />}
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation">
              <MessageSquare size={60} className="no-conv-icon" />
              <h3>Select a Conversation</h3>
              <p>Choose a contact from the list to start messaging</p>
            </div>
          )}
        </div>

        {/* ── RIGHT: patient info sidebar ── */}
        <div className="patient-info-column">
          {selected ? (
            <>
              <div className="patient-profile">
                <img
                  src={avatarUrl(selected.elder_name || 'Elder')}
                  alt={selected.elder_name || 'Patient'}
                  className="patient-avatar-large"
                />
                <h3 className="patient-name">{selected.elder_name || 'Patient'}</h3>
                <p className="patient-id">
                  Patient ID: #FC-{String(selected.elder_id || 0).padStart(4, '0')}
                </p>
              </div>

              <div className="info-section">
                <h4 className="section-subtitle">QUICK ACTIONS</h4>
                <div className="quick-actions-grid">
                  <button className="action-card">
                    <Calendar size={20} />
                    <span>Schedule</span>
                  </button>
                  <button className="action-card">
                    <Pill size={20} />
                    <span>Meds</span>
                  </button>
                </div>
              </div>

<div className="info-section">
                <h4 className="section-subtitle">SHARED DOCUMENTS</h4>
                {loadingSidebar ? (
                  <div className="sidebar-section-loading">
                    <Loader2 size={18} className="spin" />
                  </div>
                ) : sidebarData?.documents?.length > 0 ? (
                  <div className="document-list">
                    {sidebarData.documents.map((doc) => {
                      const filename = doc.attachment_url.split('/').pop();
                      const docUrl   = api.defaults.baseURL.replace(/\/api$/, '') + doc.attachment_url;
                      return (
                        <div key={doc.id} className="document-card">
                          <div className="doc-info">
                            <FileText size={18} className="doc-icon" />
                            <span className="doc-name">{filename}</span>
                          </div>
                          <a href={docUrl} target="_blank" rel="noopener noreferrer" download className="download-btn">
                            <Download size={16} />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="sidebar-section-empty">No attachments yet</p>
                )}
              </div>
            </>
          ) : (
            <div className="sidebar-empty">
              <Users size={44} className="sidebar-empty-icon" />
              <p>Select a conversation to see patient details</p>
            </div>
          )}
        </div>

      </div>

      {/* ── Compose / New Message modal ── */}
      {showCompose && (
        <div className="compose-overlay" onClick={() => setShowCompose(false)}>
          <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
            <div className="compose-modal-header">
              <h3>New Message</h3>
              <button className="icon-btn" onClick={() => setShowCompose(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="compose-search-wrap">
              <Search size={16} className="compose-search-icon" />
              <input
                autoFocus
                type="text"
                placeholder="Search people..."
                className="compose-search-input"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            <div className="compose-user-list">
              {loadingUsers ? (
                <div className="compose-loading">
                  <Loader2 size={22} className="spin" />
                </div>
              ) : (
                allUsers
                  .filter((u) =>
                    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                    u.email.toLowerCase().includes(userSearch.toLowerCase())
                  )
                  .map((u) => (
                    <button
                      key={u.id}
                      className="compose-user-item"
                      onClick={() => startChatWith(u)}
                    >
                      <img
                        src={avatarUrl(u.name)}
                        alt={u.name}
                        className="compose-user-avatar"
                      />
                      <div className="compose-user-info">
                        <span className="compose-user-name">{u.name}</span>
                        <span className="compose-user-role">{u.role}</span>
                      </div>
                    </button>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── mobile bottom nav ── */}
      <div className="mobile-bottom-nav">
        <div className="bottom-nav-item">
          <LayoutGrid size={24} />
          <span>Dashboard</span>
        </div>
        <div className="bottom-nav-item">
          <Users size={24} />
          <span>Elders</span>
        </div>
        <div className="bottom-nav-item">
          <ClipboardList size={24} />
          <span>Logs</span>
        </div>
        <div className="bottom-nav-item active">
          <MessageSquare size={24} fill="currentColor" />
          <span>Chat</span>
        </div>
      </div>
    </CaregiverLayout>
  );
};

export default CaregiverMessage;
