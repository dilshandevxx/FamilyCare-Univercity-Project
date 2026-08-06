import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, Video, Phone, MoreVertical, Paperclip, Smile, Send,
  PhoneCall, User, Calendar, Heart, ShieldAlert, Plus, AlertCircle, 
  Loader2, MessageSquare, Trash2, CheckCheck, Sparkles, X, ChevronLeft,
  Info, Clock
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import './Messages.css';

const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || 'user')}`;

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

const EMOJI_LIST = ['😊', '👍', '❤️', '🙏', '💊', '🩺', '✅', '👋'];

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get('recipient');

  const [contacts, setContacts]         = useState([]);
  const [selected, setSelected]         = useState(null);
  const [messages, setMessages]         = useState([]);
  const [newMessage, setNewMessage]     = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterType, setFilterType]     = useState('all'); // all, unread, caregivers
  
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending]                 = useState(false);
  const [sendError, setSendError]             = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMobileChat, setShowMobileChat]   = useState(false);

  // New Conversation Modal
  const [showCompose, setShowCompose]         = useState(false);
  const [allUsers, setAllUsers]               = useState([]);
  const [loadingUsers, setLoadingUsers]       = useState(false);
  const [userSearch, setUserSearch]           = useState('');

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const pollingRef     = useRef(null);

  // Quick suggestions for easy interaction
  const quickSuggestions = [
    selected?.elder_name ? `How is ${selected.elder_name} doing today?` : 'How is everything going today?',
    'Vitals have been updated in the feed.',
    'Please confirm medication schedule.',
    'Thank you so much for the quick update!'
  ];

  // Load Contacts
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

  // Handle URL recipient parameter to select a contact on load
  useEffect(() => {
    if (recipientId && contacts.length > 0 && !selected) {
      const match = contacts.find(c => String(c.id) === String(recipientId));
      if (match) {
        handleSelect(match);
        const regardingName = searchParams.get('regardingName');
        if (regardingName && !newMessage) {
          setNewMessage(`[Regarding ${regardingName}] `);
        }
      }
    }
  }, [recipientId, contacts, selected, searchParams, newMessage]);

  // Load Messages
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

  // Polling
  useEffect(() => {
    if (!selected) { clearInterval(pollingRef.current); return; }
    pollingRef.current = setInterval(() => {
      loadMessages(selected.id, true);
      loadContacts(true);
    }, 5000);
    return () => clearInterval(pollingRef.current);
  }, [selected, loadMessages, loadContacts]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelect = async (contact) => {
    setSelected(contact);
    setShowMobileChat(true);
    setLoadingMessages(true);

    // Clear unread badge optimistically
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
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const text = newMessage.trim();
    if (!text || !selected || sending) return;

    setSendError('');
    setNewMessage('');
    setShowEmojiPicker(false);
    setSending(true);

    const optimisticId = `opt-${Date.now()}`;
    const myId = user?.id || 'me';

    setMessages((prev) => [
      ...prev,
      {
        id:          optimisticId,
        sender_id:   myId,
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
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId ? { ...m, failed: true, pending: false } : m
        )
      );
      setNewMessage(text);
      setSendError('Failed to send message.');
      setTimeout(() => setSendError(''), 5000);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (msg) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${msg.id}`);
      setMessages(prev => prev.filter(m => m.id !== msg.id));
      loadContacts(true);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const openCompose = async () => {
    setShowCompose(true);
    setLoadingUsers(true);
    try {
      const { data } = await api.get('/messages/all-users');
      setAllUsers(data || []);
    } catch (err) {
      console.error('openCompose error:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleStartConversation = (targetUser) => {
    setShowCompose(false);
    // If already in contacts, select it; else create virtual contact
    const existing = contacts.find(c => c.id === targetUser.id);
    if (existing) {
      handleSelect(existing);
    } else {
      const newContact = {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        elder_name: null,
        lastMessage: null,
        unreadCount: 0,
      };
      setContacts(prev => [newContact, ...prev]);
      handleSelect(newContact);
    }
  };

  // Filter contacts
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.elder_name && c.elder_name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterType === 'unread') return c.unreadCount > 0;
    if (filterType === 'caregivers') return c.role === 'caregiver';
    return true;
  });

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.role && u.role.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <ChildLayout title="Care Messages & Chat">
      <div className="mc-shell">
        <div className="mc-container">

          {/* ════════ COLUMN 1: CONVERSATIONS LIST ════════ */}
          <aside className={`mc-sidebar ${showMobileChat ? 'hide-mobile' : ''}`}>
            
            {/* Header with Compose Button */}
            <div className="mc-sb-header">
              <div className="mc-sb-title-wrap">
                <h3 className="mc-sb-title">Conversations</h3>
                <span className="mc-total-badge">{contacts.length}</span>
              </div>
              <button className="mc-compose-btn" onClick={openCompose} title="New Message">
                <Plus size={16} />
                <span>New Chat</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="mc-search-box">
              <Search size={16} className="mc-search-ico" />
              <input 
                type="text" 
                placeholder="Search caregivers, family…" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="mc-clear-search" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="mc-filter-tabs">
              <button 
                className={`mc-tab ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button 
                className={`mc-tab ${filterType === 'caregivers' ? 'active' : ''}`}
                onClick={() => setFilterType('caregivers')}
              >
                Caregivers
              </button>
              <button 
                className={`mc-tab ${filterType === 'unread' ? 'active' : ''}`}
                onClick={() => setFilterType('unread')}
              >
                Unread
              </button>
            </div>

            {/* Contact Items */}
            <div className="mc-contact-list">
              {loadingContacts ? (
                <div className="mc-list-loading">
                  <Loader2 className="spin" size={24} color="#00A896" />
                  <p>Loading messages…</p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="mc-empty-contacts">
                  <MessageSquare size={36} className="mc-empty-icon" />
                  <p>No conversations found</p>
                  <span>Start a chat with an assigned caregiver or family member.</span>
                  <button className="mc-empty-btn" onClick={openCompose}>
                    <Plus size={14} /> Start New Chat
                  </button>
                </div>
              ) : (
                filteredContacts.map(c => {
                  const isActive = selected?.id === c.id;
                  return (
                    <div 
                      key={c.id} 
                      className={`mc-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleSelect(c)}
                    >
                      <div className="mc-avatar-wrap">
                        <img 
                          src={avatarUrl(c.name)} 
                          alt={c.name} 
                          className="mc-avatar-img"
                        />
                        <span className="mc-online-dot" />
                      </div>

                      <div className="mc-info-wrap">
                        <div className="mc-top-line">
                          <span className="mc-item-name">{c.name}</span>
                          <span className="mc-item-time">
                            {c.lastMessage ? formatTime(c.lastMessage.created_at) : ''}
                          </span>
                        </div>

                        <div className="mc-sub-line">
                          <span className={`mc-item-preview ${c.unreadCount > 0 ? 'unread' : ''}`}>
                            {c.lastMessage?.message || 'No messages yet'}
                          </span>
                          {c.unreadCount > 0 && (
                            <span className="mc-item-badge">{c.unreadCount}</span>
                          )}
                        </div>

                        {c.elder_name && (
                          <div className="mc-meta-row">
                            <span className="mc-elder-chip">
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
          </aside>


          {/* ════════ COLUMN 2: ACTIVE CHAT WINDOW ════════ */}
          <main className={`mc-chat-window ${!showMobileChat ? 'hide-mobile' : ''}`}>
            {selected ? (
              <>
                {/* Chat Top Header */}
                <header className="mc-header">
                  <div className="mc-header-left">
                    <button 
                      className="mc-mobile-back-btn" 
                      onClick={() => setShowMobileChat(false)}
                      aria-label="Back to contacts"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="mc-header-avatar-wrap">
                      <img 
                        src={avatarUrl(selected.name)} 
                        alt={selected.name} 
                        className="mc-header-avatar"
                      />
                      <span className="mc-header-status-dot" />
                    </div>
                    <div className="mc-header-details">
                      <div className="mc-header-name-row">
                        <h4 className="mc-header-name">{selected.name}</h4>
                        <span className="mc-role-tag">{selected.role === 'caregiver' ? 'Caregiver' : 'Member'}</span>
                      </div>
                      <p className="mc-header-meta">
                        {selected.elder_name ? (
                          <span>Caring for <strong>{selected.elder_name}</strong> • </span>
                        ) : null}
                        <span className="mc-status-text">Active Now</span>
                      </p>
                    </div>
                  </div>

                  <div className="mc-header-actions">
                    <button className="mc-action-circle-btn" title="Phone Call" onClick={() => alert(`Calling ${selected.name}...`)}>
                      <Phone size={17} />
                    </button>
                    <button className="mc-action-circle-btn" title="Video Meeting" onClick={() => alert(`Starting video call with ${selected.name}...`)}>
                      <Video size={17} />
                    </button>
                    <Link to="/parents" className="mc-action-circle-btn" title="View Elders & Care Plan">
                      <Info size={17} />
                    </Link>
                  </div>
                </header>

                {/* Messages Feed Area */}
                <div className="mc-feed">
                  {loadingMessages ? (
                    <div className="mc-feed-loading">
                      <Loader2 size={32} className="spin" color="#00A896" />
                      <p>Loading conversation…</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="mc-feed-empty">
                      <div className="mc-empty-avatar-circle">
                        <img src={avatarUrl(selected.name)} alt={selected.name} />
                      </div>
                      <h4>Chat with {selected.name}</h4>
                      <p>
                        {selected.elder_name 
                          ? `Discuss updates, daily vitals, and health routines for ${selected.elder_name}.`
                          : 'Send a message to coordinate care.'}
                      </p>
                      <div className="mc-start-prompts">
                        {quickSuggestions.slice(0, 2).map((s, idx) => (
                          <button key={idx} className="mc-prompt-btn" onClick={() => setNewMessage(s)}>
                            "{s}"
                          </button>
                        ))}
                      </div>
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
                              <div className="mc-date-sep">
                                <span>{formatDateDivider(msg.created_at)}</span>
                              </div>
                            )}

                            <div 
                              className={`mc-bubble-row ${isMe ? 'sent' : 'received'}`}
                            >
                              {!isMe && (
                                <img 
                                  src={avatarUrl(selected.name)} 
                                  alt={selected.name} 
                                  className="mc-msg-avatar"
                                />
                              )}

                              <div className="mc-bubble-group">
                                <div className={`mc-bubble ${isMe ? 'me-bg' : 'them-bg'} ${msg.pending ? 'pending' : ''} ${msg.failed ? 'failed' : ''}`}>
                                  
                                  {/* Sender Label */}
                                  <div className={`mc-sender-label ${isMe ? 'me' : 'them'}`}>
                                    <span>{senderDisplayName}</span>
                                    {!isMe && selected?.role && (
                                      <span className="mc-sender-role-pill">
                                        {selected.role === 'caregiver' ? 'Caregiver' : 'Family Member'}
                                      </span>
                                    )}
                                  </div>

                                  <p className="mc-bubble-content">{msg.message}</p>
                                  
                                  <div className="mc-bubble-footer">
                                    <span className="mc-msg-time">{formatTime(msg.created_at)}</span>
                                    {isMe && !msg.failed && (
                                      <span className="mc-read-check" title="Delivered">
                                        <CheckCheck size={14} />
                                      </span>
                                    )}
                                    {msg.failed && (
                                      <span className="mc-fail-badge">Failed</span>
                                    )}
                                  </div>
                                </div>

                                {canDelete && (
                                  <button 
                                    className="mc-msg-delete" 
                                    onClick={() => handleDeleteMessage(msg)}
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

                {/* Quick Suggestion Chips */}
                <div className="mc-chips-bar">
                  <Sparkles size={14} className="mc-chip-sparkle" />
                  <div className="mc-chips-scroll">
                    {quickSuggestions.map((text, i) => (
                      <button 
                        key={i} 
                        type="button"
                        className="mc-quick-chip"
                        onClick={() => {
                          setNewMessage(text);
                          inputRef.current?.focus();
                        }}
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Banner */}
                {sendError && (
                  <div className="mc-error-banner">
                    <AlertCircle size={15} />
                    <span>{sendError}</span>
                  </div>
                )}

                {/* Emoji Quick Bar */}
                {showEmojiPicker && (
                  <div className="mc-emoji-tray">
                    {EMOJI_LIST.map((emoji) => (
                      <button 
                        key={emoji} 
                        type="button" 
                        className="mc-emoji-btn"
                        onClick={() => setNewMessage(prev => prev + emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Bottom Input Form */}
                <form onSubmit={handleSend} className="mc-input-area">
                  <button 
                    type="button" 
                    className={`mc-tool-btn ${showEmojiPicker ? 'active' : ''}`}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Insert Emoji"
                  >
                    <Smile size={19} />
                  </button>

                  <button 
                    type="button" 
                    className="mc-tool-btn" 
                    title="Attach File"
                    onClick={() => alert('Attachments: Uploading health reports and photos is enabled.')}
                  >
                    <Paperclip size={19} />
                  </button>

                  <input 
                    ref={inputRef}
                    type="text" 
                    placeholder={`Message ${selected.name}…`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    className="mc-text-input"
                  />

                  <button 
                    type="submit" 
                    className={`mc-submit-btn ${sending ? 'busy' : ''}`} 
                    disabled={sending || !newMessage.trim()}
                    title="Send message (Enter)"
                  >
                    {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                  </button>
                </form>
              </>
            ) : (
              /* No Conversation Selected Placeholder */
              <div className="mc-no-selection">
                <div className="mc-placeholder-card">
                  <div className="mc-placeholder-icon">
                    <MessageSquare size={48} color="#00A896" />
                  </div>
                  <h3>Your Care Messages</h3>
                  <p>
                    Select a caregiver or family member from the left panel to coordinate health care, review logs, and stay connected.
                  </p>
                  <button className="mc-compose-primary-btn" onClick={openCompose}>
                    <Plus size={16} /> Start a Conversation
                  </button>
                </div>
              </div>
            )}
          </main>


          {/* ════════ COLUMN 3: CONTACT & ELDER DETAILS (Desktop) ════════ */}
          {selected && (
            <aside className="mc-info-sidebar hide-tablet">
              <div className="mc-info-card">
                <div className="mc-info-avatar-large">
                  <img src={avatarUrl(selected.name)} alt={selected.name} />
                  <span className="mc-info-online-pill">Online</span>
                </div>
                <h3 className="mc-info-name">{selected.name}</h3>
                <span className="mc-info-role-badge">
                  {selected.role === 'caregiver' ? 'Certified Caregiver' : 'Family Member'}
                </span>
                <p className="mc-info-email">{selected.email}</p>
              </div>

              {selected.elder_name && (
                <div className="mc-elder-card">
                  <div className="mc-elder-card-header">
                    <Heart size={16} color="#00A896" />
                    <span>Assigned Elder</span>
                  </div>
                  <h4 className="mc-elder-patient-name">{selected.elder_name}</h4>
                  <p className="mc-elder-patient-sub">Monitored via FamilyCare Care Network</p>
                  <Link to="/parents" className="mc-elder-link-btn">
                    View Full Medical Profile
                  </Link>
                </div>
              )}

              <div className="mc-quick-actions-panel">
                <span className="mc-qa-title">Quick Care Tools</span>
                <Link to="/health-feed" className="mc-qa-btn">
                  <Heart size={15} /> Open Health Feed
                </Link>
                <Link to="/alerts" className="mc-qa-btn">
                  <ShieldAlert size={15} /> Emergency Alerts
                </Link>
                <Link to="/analytics" className="mc-qa-btn">
                  <Clock size={15} /> Vitals Trends
                </Link>
              </div>
            </aside>
          )}

        </div>

        {/* ════════ COMPOSE / NEW MESSAGE MODAL ════════ */}
        {showCompose && (
          <div className="mc-modal-overlay" onClick={() => setShowCompose(false)}>
            <div className="mc-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="mc-modal-header">
                <div className="mc-modal-title">
                  <MessageSquare size={18} color="#00A896" />
                  <h4>New Conversation</h4>
                </div>
                <button className="mc-modal-close" onClick={() => setShowCompose(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="mc-modal-search">
                <Search size={15} className="mc-modal-search-ico" />
                <input 
                  type="text" 
                  placeholder="Search by name, role or email…"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="mc-modal-user-list">
                {loadingUsers ? (
                  <div className="mc-modal-loading">
                    <Loader2 size={24} className="spin" color="#00A896" />
                    <p>Loading directory…</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="mc-modal-empty">No users found.</div>
                ) : (
                  filteredUsers.map(u => (
                    <div 
                      key={u.id} 
                      className="mc-modal-user-item"
                      onClick={() => handleStartConversation(u)}
                    >
                      <img src={avatarUrl(u.name)} alt={u.name} className="mc-modal-avatar" />
                      <div className="mc-modal-user-info">
                        <span className="mc-modal-user-name">{u.name}</span>
                        <span className="mc-modal-user-sub">{u.email}</span>
                      </div>
                      <span className={`mc-modal-role-pill ${u.role === 'caregiver' ? 'cg' : 'child'}`}>
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
    </ChildLayout>
  );
};

export default Messages;
