import React, { useState } from 'react';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import { 
  Activity, Thermometer, Heart, ChevronDown, Check, 
  Smile, Frown, Meh, UploadCloud, Clock, Lightbulb, User 
} from 'lucide-react';
import './AddHealthLog.css';

const AddHealthLog = () => {
  const [mealStatus, setMealStatus] = useState({
    breakfast: 'Completed',
    lunch: 'Completed',
    dinner: 'Skipped'
  });
  
  const [medsTaken, setMedsTaken] = useState(true);
  const [mood, setMood] = useState('neutral');
  const [condition, setCondition] = useState('stable');

  const toggleMeal = (meal, status) => {
    setMealStatus(prev => ({
      ...prev,
      [meal]: status
    }));
  };

  return (
    <CaregiverLayout title="Add Health Log">
      <div className="health-log-container">
        
        {/* Header */}
        <div className="health-log-header">
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span>/</span>
            <span className="active">Add Health Log</span>
          </div>
          <h1>Add Health Log</h1>
        </div>

        <div className="health-log-content">
          
          {/* Main Form Section */}
          <div className="main-form-section">
            
            {/* Top Selection Row */}
            <div className="hl-row">
              <div className="hl-group">
                <label className="hl-label">Select Elder</label>
                <div className="hl-select-wrapper">
                  <select className="hl-select" defaultValue="albert">
                    <option value="albert">Albert J. Henderson</option>
                    <option value="eleanor">Eleanor Vance</option>
                  </select>
                  <ChevronDown className="hl-select-icon" size={18} />
                </div>
              </div>
              
              <div className="hl-group">
                <label className="hl-label">Date & Time</label>
                <div className="hl-select-wrapper">
                  <input 
                    type="text" 
                    className="hl-input" 
                    value="October 24, 2023 | 09:45 AM" 
                    readOnly 
                  />
                  <Clock className="hl-select-icon" size={16} />
                </div>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="hl-card">
              <h2 className="hl-card-title">
                <Activity className="icon" size={20} />
                Vital Signs
              </h2>
              <div className="vitals-grid">
                <div className="vital-input-box">
                  <label>BP (mmHg)</label>
                  <input type="text" placeholder="120/80" defaultValue="120/80" />
                </div>
                <div className="vital-input-box">
                  <label>Temperature (°F)</label>
                  <input type="text" placeholder="98.6" defaultValue="98.6" />
                </div>
                <div className="vital-input-box">
                  <label>Heart Rate (BPM)</label>
                  <input type="text" placeholder="72" defaultValue="72" />
                </div>
              </div>
            </div>

            {/* Meals & Medication Row */}
            <div className="hl-row">
              
              {/* Meals Log */}
              <div className="hl-card hl-group">
                <h2 className="hl-card-title">Meals Log</h2>
                <div className="meals-log">
                  {['breakfast', 'lunch', 'dinner'].map((meal) => (
                    <div className="meal-row" key={meal}>
                      <span className="meal-name" style={{ textTransform: 'capitalize' }}>{meal}</span>
                      <div className="meal-toggles">
                        <button 
                          className={`meal-toggle-btn completed ${mealStatus[meal] === 'Completed' ? 'active' : ''}`}
                          onClick={() => toggleMeal(meal, 'Completed')}
                        >
                          Completed
                        </button>
                        <button 
                          className={`meal-toggle-btn skipped ${mealStatus[meal] === 'Skipped' ? 'active' : ''}`}
                          onClick={() => toggleMeal(meal, 'Skipped')}
                        >
                          Skipped
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medication */}
              <div className="hl-card hl-group">
                <div className="medication-header">
                  <h3>Medication</h3>
                  <div className="meds-toggle">
                    <span className="meds-toggle-label">Meds Taken?</span>
                    <div 
                      className={`custom-switch ${medsTaken ? 'active' : ''}`}
                      onClick={() => setMedsTaken(!medsTaken)}
                    >
                      <div className="knob"></div>
                    </div>
                  </div>
                </div>
                <textarea 
                  className="hl-textarea" 
                  placeholder="Dosage details or changes..."
                ></textarea>
              </div>
            </div>

            {/* Clinical Notes & Mood */}
            <div className="hl-card">
              <div className="mood-header">
                <h2 className="hl-card-title" style={{ margin: 0 }}>Clinical Notes & Mood</h2>
                <div className="mood-icons">
                  <button 
                    className={`mood-btn ${mood === 'happy' ? 'active' : ''}`}
                    onClick={() => setMood('happy')}
                  >
                    <Smile size={20} />
                  </button>
                  <button 
                    className={`mood-btn neutral ${mood === 'neutral' ? 'active neutral' : ''}`}
                    onClick={() => setMood('neutral')}
                  >
                    <Meh size={20} />
                  </button>
                  <button 
                    className={`mood-btn sad ${mood === 'sad' ? 'active sad' : ''}`}
                    onClick={() => setMood('sad')}
                  >
                    <Frown size={20} />
                  </button>
                </div>
              </div>
              <textarea 
                className="hl-textarea" 
                placeholder="Observation about mood, physical complaints, or social interaction..."
                style={{ minHeight: '120px' }}
              ></textarea>
            </div>

            {/* Bottom Row */}
            <div className="hl-row mb-4">
              
              {/* Overall Condition */}
              <div className="hl-card hl-group">
                <h2 className="hl-card-title">Overall Condition</h2>
                <div className="condition-options">
                  <div 
                    className={`condition-radio stable ${condition === 'stable' ? 'active' : ''}`}
                    onClick={() => setCondition('stable')}
                  >
                    <div className="radio-circle"><div className="radio-inner"></div></div>
                    <span className="condition-label">Stable</span>
                  </div>
                  
                  <div 
                    className={`condition-radio needs-attention ${condition === 'needs-attention' ? 'active' : ''}`}
                    onClick={() => setCondition('needs-attention')}
                  >
                    <div className="radio-circle"><div className="radio-inner"></div></div>
                    <span className="condition-label">Needs Attention</span>
                  </div>

                  <div 
                    className={`condition-radio critical ${condition === 'critical' ? 'active' : ''}`}
                    onClick={() => setCondition('critical')}
                  >
                    <div className="radio-circle"><div className="radio-inner"></div></div>
                    <span className="condition-label">Critical</span>
                  </div>
                </div>
              </div>

              {/* Upload Attachment */}
              <div className="hl-card hl-group" style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 className="hl-card-title" style={{ opacity: 0 }}>Upload Attachment</h2> {/* Invisible header for alignment */}
                <div className="file-upload-box" style={{ flex: 1, justifyContent: 'center' }}>
                  <UploadCloud className="upload-icon" size={32} />
                  <span className="upload-text">Upload Attachment</span>
                  <span className="upload-subtext">Photos, meal charts, or prescriptions</span>
                  <button className="browse-btn">Browse Files</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-area" style={{ marginBottom: '2rem' }}>
              <button className="btn-cancel">Cancel</button>
              <button className="btn-submit">Submit Log</button>
            </div>

          </div>

          {/* Right Sidebar Section */}
          <div className="sidebar-section">
            
            {/* Profile Card */}
            <div className="hl-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="profile-summary">
                <div className="profile-avatar-wrapper">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Albert" alt="Albert J. Henderson" />
                </div>
                <h3 className="profile-name">Albert J. Henderson</h3>
                <p className="profile-meta">82 Years • Male</p>
                <div className="profile-badges">
                  <span className="badge orange">Hypertension</span>
                  <span className="badge teal">Diabetes II</span>
                </div>
              </div>
            </div>

            {/* Last Log Summary */}
            <div className="hl-card">
              <h2 className="hl-card-title" style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                Last Log Summary
              </h2>
              
              <div className="log-summary-item">
                <div className="log-icon-wrapper teal">
                  <Activity size={16} />
                </div>
                <div className="log-content">
                  <span className="log-time">Recorded 6 hours ago</span>
                  <h4 className="log-title">BP: 132/85 mmHg</h4>
                  <p className="log-desc">"User was feeling slightly dizzy in the morning. Encouraged extra hydration."</p>
                </div>
              </div>

              <div className="log-summary-item">
                <div className="log-icon-wrapper orange">
                  <Activity size={16} /> {/* Placeholder for meal icon if needed */}
                </div>
                <div className="log-content">
                  <span className="log-time">Meals Status</span>
                  <h4 className="log-title">Breakfast & Lunch Completed</h4>
                </div>
              </div>
            </div>

            {/* Recent Condition */}
            <div className="hl-card">
              <h2 className="hl-card-title" style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                Recent Condition
              </h2>
              
              <div className="recent-condition-list">
                <div className="condition-item">
                  <span className="condition-time">Today, 06:00 AM</span>
                  <span className="status-tag stable">STABLE</span>
                </div>
                <div className="condition-item">
                  <span className="condition-time">Yesterday, 08:00 PM</span>
                  <span className="status-tag stable">STABLE</span>
                </div>
                <div className="condition-item">
                  <span className="condition-time">Yesterday, 12:00 PM</span>
                  <span className="status-tag elevated">ELEVATED</span>
                </div>
              </div>

              <button className="view-history-btn">View Full History</button>
            </div>

            {/* Caregiver Tip */}
            <div className="hl-card tip-card">
              <div className="tip-title">
                <Lightbulb size={18} />
                Caregiver Tip
              </div>
              <p className="tip-content">
                Regular hydration checks are crucial for Albert during autumn months to prevent skin irritation.
              </p>
            </div>

          </div>
        </div>
      </div>
    </CaregiverLayout>
  );
};

export default AddHealthLog;