import React, { useState } from 'react';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import { Users, FileText, CheckCircle, AlertTriangle, Eye, ArrowRight, CheckSquare, Square, Check } from 'lucide-react';
import './CaregiverDashboard.css';

const CaregiverDashboard = () => {
  const [mealStatus, setMealStatus] = useState('Full');

  return (
    <CaregiverLayout title="Dashboard">
      <div className="dashboard-container">
        
        {/* 1. Top Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon teal"><Users size={20} /></div>
              <span className="stat-label">Total</span>
            </div>
            <div>
              <h2 className="stat-value">04</h2>
              <p className="stat-desc">Assigned<br/>Elders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon orange"><FileText size={20} /></div>
              <span className="stat-label">Today</span>
            </div>
            <div>
              <h2 className="stat-value">12</h2>
              <p className="stat-desc">Logs<br/>Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon emerald"><CheckCircle size={20} /></div>
              <span className="stat-label">Remaining</span>
            </div>
            <div>
              <h2 className="stat-value">07</h2>
              <p className="stat-desc">Pending<br/>Tasks</p>
            </div>
          </div>

          <div className="stat-card urgent">
            <div className="stat-header">
              <div className="stat-icon red"><AlertTriangle size={20} /></div>
              <span className="stat-label red">Urgent</span>
            </div>
            <div>
              <h2 className="stat-value red">02</h2>
              <p className="stat-desc red">Active Alerts</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="main-grid">
          
          {/* Left Column (2/3 width) */}
          <div className="left-column">
            
            {/* My Residents Section */}
            <section>
              <div className="section-header">
                <h3 className="section-title">My Residents</h3>
                <button className="view-all-btn">
                  View All <ArrowRight size={14} />
                </button>
              </div>
              
              <div className="residents-grid">
                {/* Resident Card 1 */}
                <div className="resident-card">
                  <div className="resident-info">
                    <div className="resident-avatar">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor" alt="Eleanor Vance" />
                    </div>
                    <div>
                      <h4 className="resident-name">Eleanor Vance</h4>
                      <p className="resident-meta">82 Years • Room 402</p>
                      <span className="care-badge moderate">MODERATE CARE</span>
                    </div>
                  </div>
                  
                  <div className="resident-stats">
                    <div className="stat-row">
                      <span className="label">Condition</span>
                      <span className="value">Hypertension, Type 2 DM</span>
                    </div>
                    <div className="stat-row">
                      <span className="label">Last Update</span>
                      <span className="value">Today, 09:30 AM</span>
                    </div>
                  </div>

                  <div className="resident-actions">
                    <button className="btn-secondary">View Details</button>
                    <button className="btn-primary">Add Log</button>
                  </div>
                </div>

                {/* Resident Card 2 */}
                <div className="resident-card">
                  <div className="resident-info">
                    <div className="resident-avatar">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Robert" alt="Robert Sterling" />
                    </div>
                    <div>
                      <h4 className="resident-name">Robert Sterling</h4>
                      <p className="resident-meta">78 Years • Room 215</p>
                      <span className="care-badge stable">STABLE</span>
                    </div>
                  </div>
                  
                  <div className="resident-stats">
                    <div className="stat-row">
                      <span className="label">Condition</span>
                      <span className="value">Post-Stroke Recovery</span>
                    </div>
                    <div className="stat-row">
                      <span className="label">Last Update</span>
                      <span className="value">Yesterday, 06:15 PM</span>
                    </div>
                  </div>

                  <div className="resident-actions">
                    <button className="btn-secondary">View Details</button>
                    <button className="btn-primary">Add Log</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity Feed */}
            <section className="activity-feed">
              <h3 className="section-title" style={{ marginBottom: '24px' }}>Recent Activity Feed</h3>
              
              <div className="activity-list">
                {/* Activity 1 */}
                <div className="activity-item">
                  <div className="activity-icon teal">
                    <CheckCircle size={14} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <h5 className="activity-title">Morning Medication Administered</h5>
                      <span className="activity-time">10:45 AM</span>
                    </div>
                    <p className="activity-desc">Resident: Eleanor Vance • Logged by You</p>
                  </div>
                  {/* Vertical Line */}
                  <div className="activity-line"></div>
                </div>

                {/* Activity 2 */}
                <div className="activity-item">
                  <div className="activity-icon orange">
                    <AlertTriangle size={14} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <h5 className="activity-title">Elevated Heart Rate Detected</h5>
                      <span className="activity-time">09:12 AM</span>
                    </div>
                    <p className="activity-desc">Resident: Robert Sterling • Auto-monitored</p>
                  </div>
                  {/* Vertical Line */}
                  <div className="activity-line"></div>
                </div>

                {/* Activity 3 */}
                <div className="activity-item">
                  <div className="activity-icon slate">
                    <FileText size={14} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <h5 className="activity-title">Breakfast Log Entry</h5>
                      <span className="activity-time">08:00 AM</span>
                    </div>
                    <p className="activity-desc">Resident: Clara Oswald • Full meal consumed</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (1/3 width) */}
          <div className="right-column">
            
            {/* Quick Health Entry */}
            <div className="quick-entry">
              <h3 className="section-title" style={{ marginBottom: '20px' }}>Quick Health Entry</h3>
              
              <div className="form-group">
                <label className="form-label">Select Resident</label>
                <select className="form-select">
                  <option>Eleanor Vance</option>
                  <option>Robert Sterling</option>
                </select>
              </div>

              <div className="form-row">
                <div>
                  <label className="form-label">BP (mmHg)</label>
                  <input type="text" placeholder="120/80" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Temp (°F)</label>
                  <input type="text" placeholder="98.6" className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Meal Status</label>
                <div className="meal-status-group">
                  {['Full', 'Partial', 'None'].map(status => (
                    <button 
                      key={status}
                      onClick={() => setMealStatus(status)}
                      className={`meal-btn ${mealStatus === status ? 'active' : ''}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea 
                  placeholder="Any behavioral changes?" 
                  className="form-textarea"
                ></textarea>
              </div>

              <button className="submit-btn">
                Submit Log Entry
              </button>
            </div>

            {/* Tasks for Today */}
            <div className="tasks-card">
              <div className="tasks-header">
                <h3 className="section-title" style={{ margin: 0 }}>Tasks for Today</h3>
                <span className="tasks-badge">7/12 Done</span>
              </div>
              
              <div className="tasks-list">
                {/* Task 1 (Done) */}
                <div className="task-item completed">
                  <button className="task-checkbox"><CheckSquare size={18} fill="currentColor" color="white" /></button>
                  <div className="task-info">
                    <p className="task-title">Blood Pressure Check (Eleanor)</p>
                    <p className="task-time">Completed at 09:00 AM</p>
                  </div>
                </div>
                
                {/* Task 2 */}
                <div className="task-item">
                  <button className="task-checkbox"><Square size={18} /></button>
                  <div className="task-info">
                    <p className="task-title">Insulin Shot (Clara)</p>
                    <p className="task-time orange">Scheduled for 12:30 PM</p>
                  </div>
                </div>

                {/* Task 3 */}
                <div className="task-item">
                  <button className="task-checkbox"><Square size={18} /></button>
                  <div className="task-info">
                    <p className="task-title">Physical Therapy Assist (Robert)</p>
                    <p className="task-time">Scheduled for 02:00 PM</p>
                  </div>
                </div>

                {/* Task 4 */}
                <div className="task-item">
                  <button className="task-checkbox"><Square size={18} /></button>
                  <div className="task-info">
                    <p className="task-title">Daily Hygiene Check (All)</p>
                    <p className="task-time">Self-paced task</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgent Alerts */}
            <div className="urgent-card">
              <div className="urgent-header">
                <AlertTriangle size={18} />
                <h3 className="urgent-title">Urgent Alerts</h3>
              </div>
              
              <div className="alerts-list">
                <div className="alert-item">
                  <h4 className="alert-type">Medication Refill</h4>
                  <p className="alert-desc">Robert Sterling: Donepezil low inventory (3 doses left)</p>
                </div>
                
                <div className="alert-item">
                  <h4 className="alert-type">Vital Variance</h4>
                  <p className="alert-desc">Eleanor Vance: Blood pressure spiking since 08:00 AM</p>
                </div>
              </div>
              
              <button className="ack-btn">
                Acknowledge All Alerts
              </button>
            </div>

          </div>
        </div>
      </div>
    </CaregiverLayout>
  );
};

export default CaregiverDashboard;