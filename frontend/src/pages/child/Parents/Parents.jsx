import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, User, HeartPulse, ShieldAlert, Phone, MapPin, 
  UserSearch, Sparkles, Heart, Activity, Thermometer
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './Parents.css';

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchParents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/parents');
      setParents(data || []);
    } catch (err) {
      console.error('Error fetching parents:', err);
      setError('Could not retrieve parents list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  return (
    <ChildLayout title="My Parents">
      <div className="pm-container">
        
        {/* Header section with page title and action button */}
        <div className="pm-header-row">
          <div className="pm-header-left">
            <p className="pm-subtitle">Manage profiles and view real-time status of your loved ones.</p>
          </div>
          <Link to="/add-parent" className="pm-add-btn">
            <Plus size={16} /> Add Parent
          </Link>
        </div>

        {error && (
          <div className="pm-error-banner">
            <span>✕</span> {error}
          </div>
        )}

        {loading ? (
          <div className="pm-loading-state">
            <div className="pm-spinner"></div>
            <p>Loading parent profiles...</p>
          </div>
        ) : parents.length === 0 ? (
          /* Empty state when no parents are registered */
          <div className="pm-empty-state">
            <div className="pm-empty-icon-wrap">
              <User size={48} className="pm-empty-icon" />
            </div>
            <h3>No Parents Registered</h3>
            <p>You haven't added any family members to your account yet. Let's create your first profile to start tracking their vitals and schedule.</p>
            <Link to="/add-parent" className="pm-empty-action-btn">
              <Plus size={16} /> Add Your First Parent
            </Link>
          </div>
        ) : (
          /* Grid of parent cards */
          <div className="pm-grid">
            {parents.map(parent => {
              const seed = parent.name || 'avatar';
              return (
                <div key={parent.id} className="pm-card">
                  
                  {/* Top Header Section */}
                  <div className="pm-card-top">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`} 
                      alt={parent.name} 
                      className="pm-avatar"
                    />
                    <div className="pm-name-section">
                      <h3 className="pm-name">{parent.name}</h3>
                      <p className="pm-relationship">
                        {parent.relationship ? `${parent.relationship}` : 'Family Member'}
                        {parent.age ? ` • ${parent.age} yrs old` : ''}
                        {parent.gender ? ` • ${parent.gender.charAt(0).toUpperCase() + parent.gender.slice(1)}` : ''}
                      </p>
                    </div>
                    <span className="pm-status-badge good">ACTIVE</span>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="pm-card-section">
                    <div className="pm-info-row">
                      <Phone size={14} className="pm-info-icon" />
                      <span>{parent.phone || 'No phone number added'}</span>
                    </div>
                    <div className="pm-info-row">
                      <MapPin size={14} className="pm-info-icon" />
                      <span className="pm-address-text">{parent.address || 'No address added'}</span>
                    </div>
                  </div>

                  {/* Medical Baseline / Summary */}
                  <div className="pm-card-section bg-light">
                    <h4 className="pm-section-title">
                      <HeartPulse size={14} className="pm-section-icon teal" />
                      Medical Profile
                    </h4>
                    <div className="pm-medical-grid">
                      <div className="pm-med-col">
                        <span className="pm-med-lbl">CONDITIONS</span>
                        <p className="pm-med-val">{parent.medical_conditions || 'None listed'}</p>
                      </div>
                      <div className="pm-med-col">
                        <span className="pm-med-lbl">ALLERGIES</span>
                        <p className="pm-med-val text-red">{parent.allergies || 'None listed'}</p>
                      </div>
                    </div>
                    {parent.current_medications && (
                      <div className="pm-med-meds">
                        <span className="pm-med-lbl">MEDICATIONS</span>
                        <p className="pm-med-val">{parent.current_medications}</p>
                      </div>
                    )}
                  </div>

                  {/* Caregiver and Emergency Contact */}
                  <div className="pm-card-section">
                    <div className="pm-split-row">
                      <div>
                        <span className="pm-med-lbl">ASSIGNED CAREGIVER</span>
                        <p className="pm-caregiver-name">
                          {parent.caregiver_name ? (
                            <>👩‍⚕️ {parent.caregiver_name}</>
                          ) : (
                            <span className="pm-unassigned">None Assigned</span>
                          )}
                        </p>
                      </div>
                      
                      {parent.emergency_contact_name && (
                        <div>
                          <span className="pm-med-lbl">EMERGENCY CONTACT</span>
                          <p className="pm-emergency-name">
                            🚨 {parent.emergency_contact_name} ({parent.emergency_contact_phone || 'No number'})
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pm-card-actions">
                    <Link to={`/health-feed?parent_id=${parent.id}`} className="pm-card-btn primary">
                      <Activity size={14} /> Health Feed
                    </Link>
                    <Link to="/messages" className="pm-card-btn secondary">
                      Contact Caregiver
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </ChildLayout>
  );
};

export default Parents;
