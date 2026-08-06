import React, { useState, useEffect, useRef, useCallback } from 'react';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import {
  Search, Phone, Info, Plus, Image as ImageIcon, Send,
  Calendar, Pill, FileText, Download, MessageSquarePlus,
  LayoutGrid, Users, ClipboardList, MessageSquare,
  MessageCircle, Loader2, ChevronLeft, X, PenSquare, Trash2,
  CheckCheck, Smile, Paperclip, Sparkles, Heart
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

const formatDateDivider = (dateStr) => {
  if (!dateStr) return 'Today';
  const date = new Date(dateStr);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
};

const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || 'user')}`;

const EMOJI_LIST = ['😊', '👍', '❤️', '🙏', '💊', '🩺', '✅', '👋'];

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const quickCareReplies = [
    selected?.elder_name ? `Daily vitals for ${selected.elder_name} have been checked.` : 'Daily vitals checked and normal.',
    'Medication has been administered on schedule.',
    'Resting comfortably now.',
    'I will call you shortly to discuss.'
  ];

  /* load contacts list */
  const loadContacts = useCallback(async (silent = false) => {
    if (!silent) setLoadingContacts(true);
    try {
      const { data } = await api.get('/messages/contacts');
      setContacts(data || []);
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
      setMessages(data || []);
    } catch (err) {
      console.error('loadMessages:', err);
    } finally {
      if (!quiet) setLoadingMessages(false);
    }
  }, []);

  /* polling every 5s */
  useEffect(() => {
    if (!selected) {
      clearInterval(pollingRef.current);
      return;
    }
    pollingRef.current = setInterval(() => {
      loadMessages(selected.id, true);
      loadContacts(true);
    }, 5000);
    return () => clearInterval(pollingRef.current);
  }, [selected, loadMessages, loadContacts]);

  /* auto-scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* fetch right-sidebar data when contact / elder changes */
  const fetchSidebarData = useCallback(async (contact) => {
    if (!contact?.elder_id) {
      setSidebarData(null);
      return;
    }
    setLoadingSidebar(true);
    try {
      const [vitalsRes, medsRes, docsRes] = await Promise.allSettled([
        api.get(`/vitals/parent/${contact.elder_id}`).catch(() => ({ data: [] })),
        api.get(`/medications/parent/${contact.elder_id}`).catch(() => ({ data: [] })),
        api.get(`/documents/parent/${contact.elder_id}`).catch(() => ({ data: [] })),
      ]);
      setSidebarData({
        vitals:    vitalsRes.status === 'fulfilled' ? vitalsRes.value.data    : [],
        meds:      medsRes.status   === 'fulfilled' ? medsRes.value.data      : [],
        documents: docsRes.status   === 'fulfilled' ? docsRes.value.data      : [],
      });
    } catch (err) {
      console.error('fetchSidebarData error:', err);
    } finally {
      setLoadingSidebar(false);
    }
  }, []);

  /* select a contact */
  const handleSelect = async (contact) => {
    setSelected(contact);
    setShowChat(true);
    setLoadingMessages(true);
    setSendError('');

    // Clear unread count locally
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c))
    );

    try {
      const { data } = await api.get(`/messages/${contact.id}`);
      setMessages(data || []);
    } catch (err) {
      console.error('handleSelect:', err);
    } finally {
      setLoadingMessages(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }

    fetchSidebarData(contact);
  };

  /* send message */
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const text = newMessage.trim();
    if (!text || !selected || sending) return;

    setSendError('');
    setNewMessage('');
    setShowEmojiPicker(false);
    setSending(true);

    // Optimistic bubble
    const optimisticId = `opt-${Date.now()}`;
    const myId = user?.id || 'me';

    setMessages((prev) => [
      ...prev,
      {
        id:          optimisticId,
        sender_id:   myId,
        receiver_id: selected.id,
        sender_name: user?.name || 'You',
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
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId ? { ...m, failed: true, pending: false } : m
        )
      );
      setNewMessage(text);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Could not send message.';
      setSendError(msg);
      setTimeout(() => setSendError(''), 5000);
      console.error('handleSend:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* delete a message */
  const handleDelete = async (msg) => {
    if (typeof msg.id === 'string' && msg.id.startsWith('opt-')) {
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      return;
    }
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${msg.id}`);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      loadContacts(true);
    } catch (err) {
      console.error('handleDelete error:', err);
    }
  };

  /* compose modal */
  const handleOpenCompose = async () => {
    setShowCompose(true);
    setLoadingUsers(true);
    try {
      const { data } = await api.get('/messages/all-users');
      setAllUsers(data || []);
    } catch (err) {
      console.error('handleOpenCompose:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleStartConversation = (targetUser) => {
    setShowCompose(false);
    const existing = contacts.find((c) => c.id === targetUser.id);
    if (existing) {
      handleSelect(existing);
    } else {
      const virtualContact = {
        id:          targetUser.id,
        name:        targetUser.name,
        email:       targetUser.email,
        role:        targetUser.role,
        elder_name:  null,
        elder_id:    null,
        lastMessage: null,
        unreadCount: 0,
      };
      setContacts((prev) => [virtualContact, ...prev]);
      handleSelect(virtualContact);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.elder_name && c.elder_name.toLowerCase().includes(q))
    );
  });

  const filteredUsers = allUsers.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  return (
    <CaregiverLayout title="Messages">
      <div className="wa-shell">
        <div className="wa-card">

          {/* ════════ LEFT: CONTACTS SIDEBAR ════════ */}
          <div className={`wa-sidebar ${showChat ? 'hide-mobile' : ''}`}>
            
            {/* Sidebar Top Bar */}
            <div className="wa-sb-header">
              <div className="wa-sb-profile">
                <img src={avatarUrl(user?.name)} alt={user?.name} className="wa-sb-my-avatar" />
                <span className="wa-sb-title">Chats</span>
              </div>
              <button
                className="wa-icon-action-btn"
                onClick={handleOpenCompose}
                title="New Chat"
              >
                <MessageSquarePlus size={20} />
              </button>
            </div>

            {/* Search Box */}
            <div className="wa-search-wrap">
              <div className="wa-search-input-box">
                <Search size={16} className="wa-search-ico" />
                <input
                  type="text"
                  placeholder="Search or start new chat"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="wa-clear-btn" onClick={() => setSearchQuery('')}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Contacts List */}
            <div className="wa-contact-list">
              {loadingContacts ? (
                <ContactSkeleton />
              ) : filteredContacts.length === 0 ? (
                <div className="wa-empty-sidebar">
                  <MessageSquare size={36} color="#8696a0" />
                  <p>No chats found</p>
                  <button className="wa-start-btn" onClick={handleOpenCompose}>
                    <Plus size={14} /> Start a conversation
                  </button>
                </div>
              ) : (
                filteredContacts.map((c) => {
                  const isSelected = selected?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      className={`wa-contact-item ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelect(c)}
                    >
                      <div className="wa-avatar-box">
                        <img
                          src={avatarUrl(c.name)}
                          alt={c.name}
                          className="wa-contact-avatar"
                        />
                        <span className="wa-online-dot" />
                      </div>

                      <div className="wa-contact-info">
                        <div className="wa-c-row-top">
                          <span className="wa-contact-name">{c.name}</span>
                          <span className="wa-contact-time">
                            {c.lastMessage ? formatTime(c.lastMessage.created_at) : ''}
                          </span>
                        </div>

                        <div className="wa-c-row-mid">
                          <span className={`wa-preview ${c.unreadCount > 0 ? 'unread' : ''}`}>
                            {c.lastMessage?.message || 'Tap to chat'}
                          </span>
                          {c.unreadCount > 0 && (
                            <span className="wa-unread-pill">{c.unreadCount}</span>
                          )}
                        </div>

                        {c.elder_name && (
                          <div className="wa-c-row-bottom">
                            <span className="wa-regarding-tag">
                              <Heart size={10} /> {c.elder_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ════════ CENTER: WHATSAPP CHAT AREA ════════ */}
          <div className={`wa-chat-area ${!showChat ? 'hide-mobile' : ''}`}>
            {selected ? (
              <>
                {/* Chat Top Header */}
                <div className="wa-chat-header">
                  <div className="wa-chat-header-left">
                    <button className="wa-mobile-back" onClick={() => setShowChat(false)}>
                      <ChevronLeft size={22} />
                    </button>
                    <img
                      src={avatarUrl(selected.name)}
                      alt={selected.name}
                      className="wa-chat-header-avatar"
                    />
                    <div className="wa-chat-header-text">
                      <div className="wa-header-name-box">
                        <span className="wa-header-name">{selected.name}</span>
                        <span className="wa-header-role">{selected.role === 'child' ? 'Family Member' : 'Caregiver'}</span>
                      </div>
                      <span className="wa-header-status">
                        {selected.elder_name ? `Regarding: ${selected.elder_name} • online` : 'online'}
                      </span>
                    </div>
                  </div>

                  <div className="wa-chat-header-right">
                    <button className="wa-header-icon-btn" title="Call" onClick={() => alert(`Calling ${selected.name}...`)}>
                      <Phone size={18} />
                    </button>
                    <button className="wa-header-icon-btn" title="Contact Info">
                      <Info size={18} />
                    </button>
                  </div>
                </div>

                {/* WhatsApp Messages Feed */}
                <div className="wa-chat-messages">
                  {loadingMessages ? (
                    <div className="wa-messages-loading">
                      <Loader2 size={32} className="spin" color="#00a884" />
                      <p>Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="wa-empty-chat">
                      <div className="wa-lock-notice">
                        🔒 Messages are end-to-end encrypted for patient privacy.
                      </div>
                      <p>No messages yet. Send a message to start chatting with {selected.name}!</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, index) => {
                        const currentUserId = user?.id || (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('fc_user') || '{}')?.id);
                        const contactId = selected?.id;

                        // Check if message was sent by current user (Right) or contact (Left)
                        const isMe = Boolean(
                          msg.pending ||
                          (currentUserId && Number(msg.sender_id) === Number(currentUserId)) ||
                          (contactId && Number(msg.receiver_id) === Number(contactId) && Number(msg.sender_id) !== Number(contactId))
                        );

                        const isFirstOfDate = index === 0 || 
                          (msg.created_at && messages[index - 1]?.created_at && 
                           new Date(msg.created_at).toDateString() !== new Date(messages[index - 1].created_at).toDateString());

                        const senderDisplayName = isMe 
                          ? 'You' 
                          : (msg.sender_name || selected?.name || 'Contact');
                        const canDelete = isMe && !msg.pending && msg.id && !String(msg.id).startsWith('opt-');

                        return (
                          <React.Fragment key={msg.id || index}>
                            {isFirstOfDate && (
                              <div className="wa-date-divider">
                                <span>{formatDateDivider(msg.created_at)}</span>
                              </div>
                            )}

                            <div 
                              className={`wa-msg-row ${isMe ? 'outgoing' : 'incoming'}`}
                            >
                              {!isMe && (
                                <img 
                                  src={avatarUrl(selected.name)} 
                                  alt={selected.name} 
                                  className="wa-msg-avatar"
                                />
                              )}

                              <div className="wa-bubble-group">
                                <div className={`wa-bubble ${isMe ? 'wa-bubble-me' : 'wa-bubble-them'} ${msg.pending ? 'pending' : ''} ${msg.failed ? 'failed' : ''}`}>
                                  
                                  {/* Distinct Sender Name Label (WhatsApp Style) */}
                                  <div className={`wa-sender-label ${isMe ? 'me-label' : 'them-label'}`}>
                                    <span>{senderDisplayName}</span>
                                    {!isMe && selected?.role && (
                                      <span className="wa-sender-role-pill">
                                        {selected.role === 'child' ? 'Family' : 'Caregiver'}
                                      </span>
                                    )}
                                  </div>

                                  <p className="wa-msg-text">{msg.message}</p>

                                  <div className="wa-msg-meta">
                                    <span className="wa-msg-time">{formatTime(msg.created_at)}</span>
                                    {isMe && !msg.failed && (
                                      <span className="wa-blue-ticks" title="Delivered">
                                        <CheckCheck size={14} />
                                      </span>
                                    )}
                                    {msg.failed && (
                                      <span className="wa-fail-badge">Failed</span>
                                    )}
                                  </div>
                                </div>

                                {canDelete && (
                                  <button
                                    className="wa-bubble-delete"
                                    onClick={() => handleDelete(msg)}
                                    title="Delete message"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Care Reply Suggestions */}
                <div className="wa-quick-replies">
                  <Sparkles size={14} className="wa-sparkle-ico" />
                  <div className="wa-quick-scroll">
                    {quickCareReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="wa-reply-chip"
                        onClick={() => {
                          setNewMessage(reply);
                          inputRef.current?.focus();
                        }}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error banner */}
                {sendError && (
                  <div className="wa-error-banner">
                    <span>⚠ {sendError}</span>
                    <button onClick={() => setSendError('')}><X size={14} /></button>
                  </div>
                )}

                {/* Emoji Tray */}
                {showEmojiPicker && (
                  <div className="wa-emoji-tray">
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className="wa-emoji-btn"
                        onClick={() => setNewMessage((prev) => prev + emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* WhatsApp Chat Input Bar */}
                <form onSubmit={handleSend} className="wa-input-bar">
                  <button
                    type="button"
                    className={`wa-bar-icon-btn ${showEmojiPicker ? 'active' : ''}`}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Insert Emoji"
                  >
                    <Smile size={22} />
                  </button>

                  <button
                    type="button"
                    className="wa-bar-icon-btn"
                    title="Attach File / Health Record"
                    onClick={() => alert('Attachments: Share health records, photos, and vitals.')}
                  >
                    <Paperclip size={22} />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message"
                    className="wa-text-field"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                  />

                  <button
                    type="submit"
                    className={`wa-send-btn ${sending ? 'sending' : ''}`}
                    disabled={!newMessage.trim() || sending}
                    title="Send (Enter)"
                  >
                    {sending ? (
                      <Loader2 size={20} className="spin" color="white" />
                    ) : (
                      <Send size={18} color="white" />
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="wa-no-chat">
                <div className="wa-no-chat-inner">
                  <div className="wa-big-icon">
                    <MessageSquare size={64} color="#00a884" />
                  </div>
                  <h3>FamilyCare WhatsApp Messenger</h3>
                  <p>Send and receive messages with families and caregivers. Keep everyone informed in real time.</p>
                  <button className="wa-primary-compose-btn" onClick={handleOpenCompose}>
                    <Plus size={16} /> Start a conversation
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ════════ RIGHT: PATIENT & CONTACT SIDEBAR ════════ */}
          {selected && (
            <div className="wa-info-sidebar hide-tablet">
              <div className="wa-info-header">
                <img
                  src={avatarUrl(selected.elder_name || selected.name)}
                  alt="Patient"
                  className="wa-info-avatar"
                />
                <h3 className="wa-info-title">{selected.elder_name || selected.name}</h3>
                <span className="wa-info-badge">
                  {selected.elder_name ? 'Assigned Elder' : 'Family Contact'}
                </span>
                <p className="wa-info-sub">{selected.email}</p>
              </div>

              {selected.elder_name && (
                <div className="wa-info-section">
                  <h4 className="wa-sec-title">Elder Overview</h4>
                  <div className="wa-info-box">
                    <div className="wa-info-row">
                      <span className="wa-info-k">Patient Name:</span>
                      <span className="wa-info-v">{selected.elder_name}</span>
                    </div>
                    <div className="wa-info-row">
                      <span className="wa-info-k">Family Contact:</span>
                      <span className="wa-info-v">{selected.name}</span>
                    </div>
                    <div className="wa-info-row">
                      <span className="wa-info-k">Status:</span>
                      <span className="wa-info-v status-ok">Active Monitoring</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="wa-info-section">
                <h4 className="wa-sec-title">Quick Care Tools</h4>
                <div className="wa-action-list">
                  <a href="/caregiver/health-log" className="wa-action-row">
                    <Heart size={16} color="#00a884" />
                    <span>Add Daily Health Log</span>
                  </a>
                  <a href="/caregiver/assigned-elders" className="wa-action-row">
                    <Users size={16} color="#00a884" />
                    <span>View Elder Care Profile</span>
                  </a>
                  <a href="/caregiver/visits" className="wa-action-row">
                    <Calendar size={16} color="#00a884" />
                    <span>Care Visit History</span>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ════════ COMPOSE MODAL ════════ */}
        {showCompose && (
          <div className="wa-modal-overlay" onClick={() => setShowCompose(false)}>
            <div className="wa-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="wa-modal-header">
                <h3>New Conversation</h3>
                <button className="wa-modal-close" onClick={() => setShowCompose(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="wa-modal-search">
                <Search size={16} className="wa-modal-search-ico" />
                <input
                  type="text"
                  placeholder="Search user by name, role or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="wa-modal-user-list">
                {loadingUsers ? (
                  <div className="wa-modal-loading">
                    <Loader2 size={24} className="spin" color="#00a884" />
                    <p>Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="wa-modal-empty">No users found.</div>
                ) : (
                  filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      className="wa-modal-user-row"
                      onClick={() => handleStartConversation(u)}
                    >
                      <img src={avatarUrl(u.name)} alt={u.name} className="wa-modal-user-avatar" />
                      <div className="wa-modal-user-details">
                        <span className="wa-modal-name">{u.name}</span>
                        <span className="wa-modal-sub">{u.email}</span>
                      </div>
                      <span className={`wa-modal-role-tag ${u.role === 'caregiver' ? 'cg' : 'child'}`}>
                        {u.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </CaregiverLayout>
  );
};

export default CaregiverMessage;
