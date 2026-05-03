import React, { useState } from 'react';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import { Search, Phone, Info, Plus, Image as ImageIcon, Send, Calendar, Pill, FileText, Download, MessageSquarePlus, LayoutGrid, Users, ClipboardList, MessageSquare } from 'lucide-react';
import './caregiverMessage.css';

const conversations = [
  { 
    id: 1, 
    name: 'Marcus Thompson', 
    regarding: 'Arthur T.', 
    time: '10:45 AM', 
    preview: 'Did the doctor mention anything about...', 
    unread: 2, 
    active: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    online: true
  },
  { 
    id: 2, 
    name: 'Sarah Jenkins', 
    regarding: 'Martha J.', 
    time: 'Yesterday', 
    preview: 'Thank you so much for the update! ...', 
    unread: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ',
    online: false
  },
  { 
    id: 3, 
    name: 'Elena Rodriguez', 
    regarding: 'Sofia R.', 
    time: 'Mon', 
    preview: 'I\'ll be dropping off the groceries ...', 
    unread: 0,
    avatar: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=a7f3d0&color=065f46',
    online: false,
    isInitials: true
  },
  { 
    id: 4, 
    name: 'David Wu', 
    regarding: 'Henry W.', 
    time: 'Oct 12', 
    preview: 'Please let me know if he needs any ...', 
    unread: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    online: false
  },
  { 
    id: 5, 
    name: 'Jordan Lee', 
    regarding: 'Frank L.', 
    time: 'Oct 10', 
    preview: 'The physical therapy session went w...', 
    unread: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    online: false
  },
];

const messages = [
  { id: 1, sender: 'Marcus', time: '09:45 AM', text: 'Hi Maria, I saw the update on Mom\'s morning vitals. How is she feeling today? She seemed a bit tired on our video call last night.', isMe: false },
  { id: 2, sender: 'Maria', time: '10:42 AM', text: 'Good morning, Marcus! She did have a slightly restless night, but her BP stabilized beautifully after her morning tea.', isMe: true },
];

const CaregiverMessage = () => {
  return (
    <CaregiverLayout title="Messages">
      <div className="messages-container">
        
        {/* Left Column: Conversations List */}
        <div className="conversations-column">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search conversations..." />
          </div>
          
          <div className="conversations-list">
            {conversations.map(conv => (
              <div key={conv.id} className={`conversation-item ${conv.active ? 'active' : ''}`}>
                <div className="conv-avatar-wrapper">
                  {conv.isInitials ? (
                     <img src={conv.avatar} alt={conv.name} className="conv-avatar initials" />
                  ) : (
                     <img src={conv.avatar} alt={conv.name} className="conv-avatar" />
                  )}
                  {conv.online && <span className="online-indicator"></span>}
                </div>
                <div className="conv-details">
                  <div className="conv-header">
                    <span className="conv-name">{conv.name}</span>
                    <span className="conv-time">{conv.time}</span>
                  </div>
                  <div className="conv-regarding-mobile">Elder: {conv.regarding}</div>
                  <div className="conv-regarding-desktop">Regarding: {conv.regarding}</div>
                  <div className="conv-preview-row">
                    <p className="conv-preview">{conv.preview}</p>
                    {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Mobile FAB */}
          <button className="mobile-fab">
            <MessageSquarePlus size={24} color="white" />
          </button>
        </div>

        {/* Middle Column: Chat Window */}
        <div className="chat-column">
          <div className="chat-header">
            <div className="chat-header-info">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" alt="Marcus" className="chat-avatar" />
              <div>
                <h3 className="chat-name">Marcus Thompson <span className="status-badge">ONLINE</span></h3>
                <p className="chat-regarding">Regarding: <strong>Eleanor Jenkins</strong></p>
              </div>
            </div>
            <div className="chat-actions">
              <button className="icon-btn"><Phone size={20} /></button>
              <button className="icon-btn"><Info size={20} /></button>
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message-bubble ${msg.isMe ? 'me' : 'them'}`}>
                {msg.text}
                <div className="message-time">{msg.time}</div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <button className="icon-btn"><Plus size={20} /></button>
            <button className="icon-btn"><ImageIcon size={20} /></button>
            <input type="text" placeholder="Type message..." className="chat-input" />
            <button className="send-btn"><Send size={18} color="white" /></button>
          </div>
        </div>

        {/* Right Column: Patient Info */}
        <div className="patient-info-column">
          <div className="patient-profile">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor" alt="Eleanor" className="patient-avatar-large" />
            <h3 className="patient-name">Eleanor Jenkins</h3>
            <p className="patient-id">Patient ID: #FC-9921</p>
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
            <h4 className="section-subtitle">TODAY'S SCHEDULE</h4>
            <div className="schedule-list">
              <div className="schedule-item completed">
                <div className="time-badge">08A</div>
                <div>
                  <p className="schedule-title">Morning Meds</p>
                  <p className="schedule-desc">Completed by Maria</p>
                </div>
              </div>
              <div className="schedule-item upcoming">
                <div className="time-badge green">02P</div>
                <div>
                  <p className="schedule-title green">Physical Therapy</p>
                  <p className="schedule-desc green">Upcoming session</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4 className="section-subtitle">SHARED DOCUMENTS</h4>
            <div className="document-card">
              <div className="doc-info">
                <FileText size={18} className="doc-icon" />
                <span className="doc-name">Lab_Results_Oct.pdf</span>
              </div>
              <button className="download-btn"><Download size={16} /></button>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Bottom Navigation */}
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
