import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, Video, Phone, MoreVertical, Paperclip, Smile, Send,
  PhoneCall, User, Calendar, Heart, ShieldAlert, Plus, AlertCircle, Loader2, MessageSquare
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

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get('recipient');

  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  // Load Contacts
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
      setMessages(data);
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
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const text = newMessage.trim();
    if (!text || !selected || sending) return;

    setSendError('');
    setNewMessage('');
    setSending(true);

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

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.elder_name && c.elder_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <ChildLayout title="Messages">
      <div className="mc-container">
        <div className="mc-grid">
          
          {/* COLUMN 1 - CHATS LIST */}
          <div className="mc-chats-sidebar">
            <div className="mc-search-wrapper">
              <Search size={16} className="mc-search-icon" />
              <input 
                type="text" 
                placeholder="Search chats..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="mc-contacts-list">
              {loadingContacts ? (
                <div style={{ padding: '20px', textAlign: 'center' }}><Loader2 className="spin" size={24} /></div>
              ) : filteredContacts.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No conversations found.</div>
              ) : (
                filteredContacts.map(c => {
                  const isActive = selected?.id === c.id;
                  return (
                    <div 
                      key={c.id} 
                      className={`mc-contact-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleSelect(c)}
                    >
                      <img 
                        src={avatarUrl(c.name)} 
                        alt={c.name} 
                        className="mc-contact-avatar"
                      />
                      <div className="mc-contact-details">
                        <div className="mc-contact-row">
                          <span className="mc-contact-name">{c.name}</span>
                          <span className="mc-contact-time">{c.lastMessage ? formatTime(c.lastMessage.created_at) : ''}</span>
                        </div>
                        <div className="mc-contact-row">
                          <span className="mc-contact-snippet">{c.lastMessage?.message || 'No messages yet'}</span>
                          {c.unreadCount > 0 && (
                            <span className="mc-unread-badge">{c.unreadCount}</span>
                          )}
                        </div>
                        {c.elder_name && (
                          <span className="mc-relation-badge teal">
                            {c.elder_name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button className="mc-new-msg-btn">
              <Plus size={16} /> New Message
            </button>
          </div>

          {/* COLUMN 2 - CHAT WORKSPACE */}
          <div className="mc-chat-workspace">
            {selected ? (
              <>
                {/* Header */}
                <div className="mc-chat-header">
                  <div className="mc-header-profile">
                    <img 
                      src={avatarUrl(selected.name)} 
                      alt={selected.name} 
                    />
                    <div>
                      <h4 className="mc-header-name">{selected.name}</h4>
                      <p className="mc-header-status">
                        {selected.elder_name && `Regarding ${selected.elder_name} • `}
                        <span className="mc-status-indicator online">ONLINE</span>
                      </p>
                    </div>
                  </div>
                  <div className="mc-header-actions">
                    <button className="mc-header-btn"><Video size={18} /></button>
                    <button className="mc-header-btn"><Phone size={18} /></button>
                    <button className="mc-header-btn"><MoreVertical size={18} /></button>
                  </div>
                </div>

                {/* Chat Messages Log */}
                <div className="mc-chat-messages">
                  {loadingMessages ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                      <Loader2 size={32} className="spin" color="#00a896" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      <MessageSquare size={48} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                      <p>No messages yet. Say hello!</p>
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isMe = Number(msg.sender_id) === Number(user?.id);
                      return (
                        <div key={msg.id} className={`mc-bubble-wrapper ${isMe ? 'right' : 'left'}`}>
                          {!isMe && (
                            <img 
                              src={avatarUrl(selected.name)} 
                              alt="avatar" 
                              className="mc-bubble-avatar"
                            />
                          )}
                          <div className={`mc-bubble-card ${isMe ? 'user-bg' : 'cg-bg'} ${msg.pending ? 'pending' : ''} ${msg.failed ? 'failed' : ''}`}>
                            <p className="mc-bubble-text">{msg.message}</p>
                            <span className="mc-bubble-time">{formatTime(msg.created_at)}</span>
                            {msg.failed && <span style={{ fontSize: '0.7rem', color: '#ef4444' }}> Failed to send</span>}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {sendError && (
                  <div style={{ padding: '8px 16px', background: '#fef2f2', color: '#991b1b', fontSize: '0.85rem' }}>
                    {sendError}
                  </div>
                )}

                {/* Message Input Footer */}
                <form onSubmit={handleSend} className="mc-chat-footer">
                  <button type="button" className="mc-input-btn"><Paperclip size={18} /></button>
                  <input 
                    type="text" 
                    placeholder="Type message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <button type="button" className="mc-input-btn"><Smile size={18} /></button>
                  <button type="submit" className={`mc-send-btn ${sending ? 'sending' : ''}`} disabled={sending || !newMessage.trim()}>
                    {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <MessageSquare size={64} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <h3>Select a Conversation</h3>
                <p>Choose a contact from the list to start messaging</p>
              </div>
            )}
          </div>

          {/* COLUMN 3 - CONTACT PROFILE SIDEBAR */}
          <div className="mc-contact-profile-sidebar">
            {selected ? (
              <>
                <div className="mc-sidebar-profile-card">
                  <img 
                    src={avatarUrl(selected.name)} 
                    alt={selected.name} 
                    className="mc-sb-avatar"
                  />
                  <h3 className="mc-sb-name">{selected.name}</h3>
                  <p className="mc-sb-title">{selected.role === 'caregiver' ? 'Caregiver' : selected.role}</p>
                  
                  {selected.elder_name && (
                    <span className="mc-sb-badge teal">
                      CARING FOR {selected.elder_name.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="mc-sb-action-btns">
                  <button className="mc-sb-action-btn">
                    <PhoneCall size={16} /> Call {selected.role === 'caregiver' ? 'Caregiver' : 'User'}
                  </button>
                  <Link to="/parents" className="mc-sb-action-btn">
                    <User size={16} /> View Parent Profile
                  </Link>
                  <button className="mc-sb-action-btn">
                    <Calendar size={16} /> Schedule Meeting
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                Select a contact to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </ChildLayout>
  );
};

export default Messages;
