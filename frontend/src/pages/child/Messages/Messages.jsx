import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Video, Phone, MoreVertical, Paperclip, Smile, Send,
  PhoneCall, User, Calendar, Heart, ShieldAlert, Plus, Sparkles, AlertCircle
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './Messages.css';

// Pre-seeded chat list contacts
const contactsData = [
  {
    id: 'Sarah',
    user_id: 101, // Mock user ID for the receiver
    name: 'Nurse Sarah Jenkins',
    title: 'Senior Care Specialist',
    relation: 'Mother',
    relationColor: 'teal',
    status: 'ONLINE',
    avatar: 'Sarah',
    lastMessage: 'The latest BP reading looks much more stable today.',
    lastTime: '10:42 AM',
    unread: 0,
    heartRate: '72 BPM',
    bp: '128 / 82',
    focus: 'Mother',
    sharedMedia: [
      'https://api.dicebear.com/7.x/identicon/svg?seed=meds1',
      'https://api.dicebear.com/7.x/identicon/svg?seed=meds2'
    ],
    initialMessages: [
      {
        id: 1,
        sender: 'caregiver',
        text: "Hello! I just finished the morning check-in. Mother's blood pressure was 128/82 at 9:00 AM. This is a significant improvement from yesterday.",
        time: '10:40 AM'
      },
      {
        id: 2,
        sender: 'user',
        text: "That's wonderful news, Sarah. Thank you for the update. Did she take her medication with breakfast as prescribed?",
        time: '10:42 AM'
      },
      {
        id: 3,
        sender: 'caregiver',
        text: "Yes, she did. I've attached the full log for your review. The latest BP reading looks much more stable today.",
        time: '10:45 AM',
        attachment: 'Daily_Log_May26.pdf'
      }
    ]
  },
  {
    id: 'Thompson',
    user_id: 102,
    name: 'Dr. Mark Thompson',
    title: 'Chief Cardiologist',
    relation: 'Father',
    relationColor: 'orange',
    status: 'OFFLINE',
    avatar: 'Mark',
    lastMessage: "I've updated the physical therapy schedule...",
    lastTime: '9:15 AM',
    unread: 2,
    heartRate: '84 BPM',
    bp: '135 / 90',
    focus: 'Father',
    sharedMedia: [
      'https://api.dicebear.com/7.x/identicon/svg?seed=chart1'
    ],
    initialMessages: [
      {
        id: 1,
        sender: 'caregiver',
        text: "Hello, I wanted to review your father's exercise chart. He completed his walk today without chest pain.",
        time: '9:00 AM'
      },
      {
        id: 2,
        sender: 'caregiver',
        text: "I've updated the physical therapy schedule to three times a week. Let me know if you want to dial in for our sync.",
        time: '9:15 AM'
      }
    ]
  },
  {
    id: 'Emily',
    user_id: 103,
    name: 'Emily Davis',
    title: 'Speech Therapist',
    relation: 'Mother',
    relationColor: 'teal',
    status: 'ONLINE',
    avatar: 'Emily',
    lastMessage: 'Lunch was finished today! She had salmon...',
    lastTime: 'Yesterday',
    unread: 0,
    heartRate: '68 BPM',
    bp: '120 / 78',
    focus: 'Mother',
    sharedMedia: [],
    initialMessages: [
      {
        id: 1,
        sender: 'caregiver',
        text: 'Lunch was finished today! She had salmon and wilted spinach. Very good appetite.',
        time: 'Yesterday'
      }
    ]
  }
];

const Messages = () => {
  const [contacts, setContacts] = useState(contactsData);
  const [activeContactId, setActiveContactId] = useState('Sarah');
  const [searchQuery, setSearchQuery] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeContact.initialMessages, isTyping]);

  // Handle active contact change and reset unread badge
  const handleSelectContact = (id) => {
    setActiveContactId(id);
    setContacts(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, unread: 0 };
      }
      return c;
    }));
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const messageText = typedMessage.trim();
    setTypedMessage('');

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append to local state
    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      time: timeStr
    };

    setContacts(prev => prev.map(c => {
      if (c.id === activeContactId) {
        return {
          ...c,
          lastMessage: messageText,
          lastTime: timeStr,
          initialMessages: [...c.initialMessages, newUserMsg]
        };
      }
      return c;
    }));

    // Post to API (non-blocking mock save to database)
    try {
      await api.post('/messages', {
        receiver_id: activeContact.user_id,
        message: messageText
      });
    } catch (err) {
      console.error('Error saving message in DB:', err);
    }

    // Trigger simulated caregiver auto-reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const caregiverReplies = [
        "Thank you for letting me know. I will make sure to check on that right away.",
        "That sounds perfect! I've updated the record for today.",
        "Yes, absolutely. I'll monitor this closely and send you another update shortly.",
        "I'm on it. Mother is resting comfortably right now, but I will ask her as soon as she wakes up.",
        "Vitals are looking really positive today, so nothing to worry about. I'll keep you posted!"
      ];
      
      const randomReply = caregiverReplies[Math.floor(Math.random() * caregiverReplies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newCaregiverMsg = {
        id: Date.now() + 1,
        sender: 'caregiver',
        text: randomReply,
        time: replyTime
      };

      setContacts(prev => prev.map(c => {
        if (c.id === activeContactId) {
          return {
            ...c,
            lastMessage: randomReply,
            lastTime: replyTime,
            initialMessages: [...c.initialMessages, newCaregiverMsg]
          };
        }
        return c;
      }));
    }, 2000);
  };

  // Filter contacts by search query
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.relation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ChildLayout title="Messages">
      <div className="mc-container">
        
        {/* THREE COLUMN GRID */}
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
              {filteredContacts.map(c => {
                const isActive = c.id === activeContactId;
                return (
                  <div 
                    key={c.id} 
                    className={`mc-contact-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectContact(c.id)}
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.name)}`} 
                      alt={c.name} 
                      className="mc-contact-avatar"
                    />
                    
                    <div className="mc-contact-details">
                      <div className="mc-contact-row">
                        <span className="mc-contact-name">{c.name}</span>
                        <span className="mc-contact-time">{c.lastTime}</span>
                      </div>
                      
                      <div className="mc-contact-row">
                        <span className="mc-contact-snippet">{c.lastMessage}</span>
                        {c.unread > 0 && (
                          <span className="mc-unread-badge">{c.unread}</span>
                        )}
                      </div>
                      
                      <span className={`mc-relation-badge ${c.relationColor}`}>
                        {c.relation}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="mc-new-msg-btn">
              <Plus size={16} /> New Message
            </button>
          </div>

          {/* COLUMN 2 - CHAT WORKSPACE */}
          <div className="mc-chat-workspace">
            {/* Header */}
            <div className="mc-chat-header">
              <div className="mc-header-profile">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeContact.name)}`} 
                  alt={activeContact.name} 
                />
                <div>
                  <h4 className="mc-header-name">{activeContact.name}</h4>
                  <p className="mc-header-status">
                    Related to <span className="bold">{activeContact.relation}</span> • 
                    <span className={`mc-status-indicator ${activeContact.status.toLowerCase()}`}>
                      {activeContact.status}
                    </span>
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
              
              <div className="mc-system-date"><span>TODAY</span></div>

              {activeContact.initialMessages.map(msg => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`mc-bubble-wrapper ${isUser ? 'right' : 'left'}`}>
                    {!isUser && (
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeContact.name)}`} 
                        alt="avatar" 
                        className="mc-bubble-avatar"
                      />
                    )}
                    
                    <div className={`mc-bubble-card ${isUser ? 'user-bg' : 'cg-bg'}`}>
                      {msg.attachment && (
                        <div className="mc-attachment-block">
                          <Paperclip size={14} className="mc-attach-icon" />
                          <span className="mc-attach-text">{msg.attachment}</span>
                        </div>
                      )}
                      
                      <p className="mc-bubble-text">{msg.text}</p>
                      <span className="mc-bubble-time">{msg.time}</span>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="mc-bubble-wrapper left">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeContact.name)}`} 
                    alt="avatar" 
                    className="mc-bubble-avatar"
                  />
                  <div className="mc-bubble-card cg-bg mc-typing-bubble">
                    <span className="mc-typing-dot"></span>
                    <span className="mc-typing-dot"></span>
                    <span className="mc-typing-dot"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Footer */}
            <form onSubmit={handleSendMessage} className="mc-chat-footer">
              <button type="button" className="mc-input-btn"><Paperclip size={18} /></button>
              
              <input 
                type="text" 
                placeholder={`Message ${activeContact.name.split(' ').pop()}...`}
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
              />
              
              <button type="button" className="mc-input-btn"><Smile size={18} /></button>
              <button type="submit" className="mc-send-btn">
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* COLUMN 3 - CONTACT PROFILE SIDEBAR */}
          <div className="mc-contact-profile-sidebar">
            <div className="mc-sidebar-profile-card">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeContact.name)}`} 
                alt={activeContact.name} 
                className="mc-sb-avatar"
              />
              <h3 className="mc-sb-name">{activeContact.name}</h3>
              <p className="mc-sb-title">{activeContact.title}</p>
              
              <span className={`mc-sb-badge ${activeContact.relationColor}`}>
                CARING FOR {activeContact.relation.toUpperCase()}
              </span>
            </div>

            <div className="mc-sb-action-btns">
              <button className="mc-sb-action-btn">
                <PhoneCall size={16} /> Call Caregiver
              </button>
              <Link to="/parents" className="mc-sb-action-btn">
                <User size={16} /> View Parent Profile
              </Link>
              <button className="mc-sb-action-btn">
                <Calendar size={16} /> Schedule Meeting
              </button>
            </div>

            {/* Current Focus Vitals */}
            <div className="mc-sb-card">
              <span className="mc-sb-widget-lbl">CURRENT FOCUS: {activeContact.relation.toUpperCase()}</span>
              
              <div className="mc-sb-vitals-row">
                <div className="mc-sb-vital-box">
                  <div className="mc-sb-vital-header">
                    <Heart size={14} className="teal-text" />
                    <span>Heart Rate</span>
                  </div>
                  <h4>{activeContact.heartRate}</h4>
                </div>
                <div className="mc-sb-vital-box">
                  <div className="mc-sb-vital-header">
                    <AlertCircle size={14} className="orange-text" />
                    <span>Blood Pressure</span>
                  </div>
                  <h4>{activeContact.bp}</h4>
                </div>
              </div>
            </div>

            {/* Shared Media */}
            <div className="mc-sb-card">
              <div className="mc-sb-media-header">
                <span className="mc-sb-widget-lbl no-margin">Shared Media</span>
                <span className="mc-view-all-link">VIEW ALL</span>
              </div>

              <div className="mc-sb-media-grid">
                {activeContact.sharedMedia.map((img, i) => (
                  <img key={i} src={img} alt="Shared attachment" className="mc-media-item" />
                ))}
                
                <button className="mc-add-media-btn">+</button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </ChildLayout>
  );
};

export default Messages;
