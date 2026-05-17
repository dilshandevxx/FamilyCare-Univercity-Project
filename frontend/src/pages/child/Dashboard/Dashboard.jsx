import React from 'react';
import ChildLayout from '../../../layouts/ChildLayout';
import { 
  Users, UserPlus, Bell, ThumbsUp, Activity, 
  Thermometer, Search, Calendar, AlertTriangle 
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {

  return (
    <ChildLayout title="Dashboard">
      <div className="child-dashboard-container">
        
        {/* Top Stat Cards */}
        <div className="top-stats-grid">
          <div className="child-stat-card">
            <div className="child-stat-info">
              <span className="child-stat-label">Total Parents</span>
              <h2 className="child-stat-value">02</h2>
            </div>
            <div className="child-stat-icon-wrapper icon-teal">
              <Users size={24} />
            </div>
          </div>
          
          <div className="child-stat-card">
            <div className="child-stat-info">
              <span className="child-stat-label">Active Caregivers</span>
              <h2 className="child-stat-value">04</h2>
            </div>
            <div className="child-stat-icon-wrapper icon-teal">
              <UserPlus size={24} />
            </div>
          </div>
          
          <div className="child-stat-card">
            <div className="child-stat-info">
              <span className="child-stat-label">Alerts Today</span>
              <h2 className="child-stat-value">03</h2>
            </div>
            <div className="child-stat-icon-wrapper icon-orange">
              <Bell size={24} />
            </div>
          </div>
          
          <div className="child-stat-card">
            <div className="child-stat-info">
              <span className="child-stat-label">Health Status</span>
              <h2 className="child-stat-value text-teal">Stable</h2>
            </div>
            <div className="child-stat-icon-wrapper icon-teal">
              <ThumbsUp size={24} />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-main-grid">
          
          {/* Left Column */}
          <div className="dashboard-left-col">
            
            {/* Family Overview */}
            <section>
              <div className="section-header-flex">
                <h3 className="section-title-bold">Family Overview</h3>
                <a href="#parents" className="view-all-link">View All Family</a>
              </div>
              
              <div className="family-overview-grid">
                {/* Arthur Miller */}
                <div className="family-card">
                  <div className="family-card-header">
                    <div className="family-profile">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arthur" alt="Arthur" className="family-avatar" />
                      <div>
                        <h4 className="family-name">Arthur Miller</h4>
                        <p className="family-details">Age: 78 • Heart Condition</p>
                      </div>
                    </div>
                    <span className="status-badge status-good">Good</span>
                  </div>
                  
                  <div className="family-meta">
                    <div className="family-meta-row">
                      <span className="meta-label">Primary Caregiver</span>
                      <span className="meta-value">Sarah Jenkins</span>
                    </div>
                    <div className="family-meta-row">
                      <span className="meta-label">Last Update</span>
                      <span className="meta-value">15 mins ago</span>
                    </div>
                  </div>
                  
                  <div className="family-actions">
                    <button className="btn-vitals">Vitals</button>
                    <button className="btn-vitals">Call</button>
                  </div>
                </div>

                {/* Martha Miller */}
                <div className="family-card warning-border">
                  <div className="family-card-header">
                    <div className="family-profile">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Martha" alt="Martha" className="family-avatar" />
                      <div>
                        <h4 className="family-name">Martha Miller</h4>
                        <p className="family-details">Age: 75 • Type 2 Diabetes</p>
                      </div>
                    </div>
                    <span className="status-badge status-warning">Warning</span>
                  </div>
                  
                  <div className="family-meta">
                    <div className="family-meta-row">
                      <span className="meta-label">Primary Caregiver</span>
                      <span className="meta-value">David Chen</span>
                    </div>
                    <div className="family-meta-row">
                      <span className="meta-label">Last Update</span>
                      <span className="meta-value">2 hours ago</span>
                    </div>
                  </div>
                  
                  <div className="family-actions">
                    <button className="btn-vitals">Vitals</button>
                    <button className="btn-vitals">Call</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Charts Grid */}
            <div className="charts-grid">
              {/* BP Trend */}
              <div className="chart-card">
                <div className="chart-header">
                  <Activity size={18} className="chart-icon" />
                  <span>Blood Pressure Trend</span>
                </div>
                
                <div className="mock-bar-chart">
                  <div className="mock-bar" style={{ height: '40%' }}></div>
                  <div className="mock-bar" style={{ height: '65%' }}></div>
                  <div className="mock-bar" style={{ height: '50%' }}></div>
                  <div className="mock-bar" style={{ height: '80%' }}></div>
                  <div className="mock-bar highlight" style={{ height: '75%' }}></div>
                  <div className="mock-bar" style={{ height: '55%' }}></div>
                  <div className="mock-bar" style={{ height: '60%' }}></div>
                </div>
                <div className="chart-labels">
                  <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                </div>
              </div>

              {/* Temperature Stability */}
              <div className="chart-card">
                <div className="chart-header">
                  <Thermometer size={18} className="chart-icon" />
                  <span>Temperature Stability</span>
                </div>
                
                <div className="temp-stat-row">
                  <span className="temp-avg-label">Today's Avg</span>
                  <span className="temp-avg-value">98.4°F</span>
                </div>
                
                <div className="temp-progress-bar">
                  <div className="temp-progress-fill"></div>
                </div>
                
                <div className="temp-desc">
                  Temperature has remained within the normal range (97.8°F - 99.1°F) for the past 72 hours.
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Column */}
          <div className="dashboard-right-col">
            
            {/* Quick Actions */}
            <div className="quick-actions-card">
              <h3 className="qa-title">Quick Actions</h3>
              <div className="qa-grid">
                <button className="qa-btn">
                  <UserPlus size={20} className="chart-icon" />
                  Add Parent
                </button>
                <button className="qa-btn">
                  <Search size={20} className="chart-icon" />
                  Find Carer
                </button>
                <button className="qa-btn">
                  <Calendar size={20} className="chart-icon" />
                  Schedule
                </button>
                <button className="qa-btn qa-emergency">
                  <AlertTriangle size={20} />
                  Emergency
                </button>
              </div>
            </div>

            {/* Active Alerts */}
            <section>
              <div className="section-header-flex">
                <div className="chart-header" style={{ marginBottom: 0, color: '#d97706' }}>
                  <AlertTriangle size={18} />
                  <span>Active Alerts</span>
                </div>
              </div>
              
              <div className="alerts-list">
                <div className="alert-item">
                  <div className="alert-icon-wrap">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="alert-content">
                    <h4 className="alert-title">Missed medication</h4>
                    <p className="alert-desc">Martha • Metformin (500mg)</p>
                    <span className="alert-time">45 MINS OVERDUE</span>
                  </div>
                </div>
                
                <div className="alert-item alert-white">
                  <div className="alert-icon-wrap">
                    <Activity size={16} />
                  </div>
                  <div className="alert-content">
                    <h4 className="alert-title">Abnormal BP Reading</h4>
                    <p className="alert-desc">Arthur • 142/95 mmHg</p>
                    <span className="alert-time">LOGGED AT 09:30 AM</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity Feed */}
            <div className="activity-feed-card">
              <h3 className="qa-title" style={{ marginBottom: 0 }}>Recent Activity Feed</h3>
              
              <div className="feed-list">
                <div className="feed-item">
                  <div className="feed-dot"></div>
                  <div className="feed-content">
                    <h4 className="feed-title">BP checked & normal</h4>
                    <p className="feed-desc">Arthur • 120/80 mmHg</p>
                    <span className="feed-time">10:45 AM</span>
                  </div>
                </div>
                
                <div className="feed-item">
                  <div className="feed-dot"></div>
                  <div className="feed-content">
                    <h4 className="feed-title">Medicine taken</h4>
                    <p className="feed-desc">Martha • Morning Vitamin Pack</p>
                    <span className="feed-time">09:15 AM</span>
                  </div>
                </div>
                
                <div className="feed-item">
                  <div className="feed-dot"></div>
                  <div className="feed-content">
                    <h4 className="feed-title">Meal completed</h4>
                    <p className="feed-desc">Arthur • Low-sodium breakfast</p>
                    <span className="feed-time">08:30 AM</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </ChildLayout>
  );
};

export default Dashboard;
