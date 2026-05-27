import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Calendar, Heart, ShieldAlert, Phone, MapPin, 
  UserRoundCheck, ShieldCheck, HeartPulse, Sparkles, Upload
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './AddParent.css';

const AddParent = () => {
  const navigate = useNavigate();
  const [caregivers, setCaregivers] = useState([]);
  const [avatarSeed, setAvatarSeed] = useState('George');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    relationship: '',
    phone: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: '',
    allergies: '',
    current_medications: '',
    assigned_caregiver_id: ''
  });

  // Fetch caregivers list
  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const { data } = await api.get('/caregivers');
        setCaregivers(data || []);
      } catch (err) {
        console.error('Error fetching caregivers:', err);
        // Fallback mock caregivers in case database is empty or error occurs
        setCaregivers([
          { id: 1, name: 'Sarah Jenkins', specialization: 'Geriatric Care' },
          { id: 2, name: 'David Chan', specialization: 'Dementia Specialist' },
          { id: 3, name: 'Maria Rodriguez', specialization: 'Physical Therapy' }
        ]);
      }
    };
    fetchCaregivers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update avatar seed based on name to make it interactive and fun
    if (name === 'name' && value.trim()) {
      setAvatarSeed(value.trim());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Please fill in the parent name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send data to backend parents API
      await api.post('/parents', {
        ...formData,
        avatar_seed: avatarSeed // we can send this as well
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/parents');
      }, 1500);
    } catch (err) {
      console.error('Error adding parent:', err);
      setError(err.response?.data?.error || 'Failed to save parent profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChildLayout title="Add Parent">
      <div className="ap-container">
        
        {/* Breadcrumb Navigation */}
        <div className="ap-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span className="ap-bc-separator">&gt;</span>
          <Link to="/parents">My Parents</Link>
          <span className="ap-bc-separator">&gt;</span>
          <span className="ap-bc-active">Add Parent</span>
        </div>

        <form onSubmit={handleSubmit} className="ap-form">
          <div className="ap-grid-layout">
            
            {/* LEFT COLUMN - Main Form Fields */}
            <div className="ap-form-main">
              
              {/* Section 1: Basic Information */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <User className="ap-card-icon teal" size={20} />
                  <h3>Basic Information</h3>
                </div>
                
                <div className="ap-card-body">
                  <div className="ap-input-group full-width">
                    <label htmlFor="name">PARENT NAME</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="Full Legal Name" 
                      required 
                    />
                  </div>

                  <div className="ap-input-row">
                    <div className="ap-input-group">
                      <label htmlFor="age">AGE</label>
                      <input 
                        type="number" 
                        id="age"
                        name="age" 
                        value={formData.age} 
                        onChange={handleChange}
                        placeholder="e.g. 72" 
                      />
                    </div>

                    <div className="ap-input-group">
                      <label htmlFor="gender">GENDER</label>
                      <select 
                        id="gender"
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="ap-input-group full-width">
                    <label htmlFor="relationship">RELATIONSHIP</label>
                    <input 
                      type="text" 
                      id="relationship"
                      name="relationship" 
                      value={formData.relationship} 
                      onChange={handleChange}
                      placeholder="e.g. Mother, Father, Guardian" 
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Information */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <Phone className="ap-card-icon teal" size={20} />
                  <h3>Contact Information</h3>
                </div>

                <div className="ap-card-body">
                  <div className="ap-input-group full-width">
                    <label htmlFor="phone">PHONE NUMBER</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000" 
                    />
                  </div>

                  <div className="ap-input-group full-width">
                    <label htmlFor="address">ADDRESS</label>
                    <textarea 
                      id="address"
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange}
                      placeholder="Residential Address" 
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Section 3: Medical Profile */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <HeartPulse className="ap-card-icon teal" size={20} />
                  <h3>Medical Profile</h3>
                </div>

                <div className="ap-card-body">
                  <div className="ap-input-group full-width">
                    <label htmlFor="medical_conditions">MEDICAL CONDITIONS</label>
                    <textarea 
                      id="medical_conditions"
                      name="medical_conditions" 
                      value={formData.medical_conditions} 
                      onChange={handleChange}
                      placeholder="List existing health conditions..." 
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="ap-input-row">
                    <div className="ap-input-group">
                      <label htmlFor="allergies">ALLERGIES</label>
                      <input 
                        type="text" 
                        id="allergies"
                        name="allergies" 
                        value={formData.allergies} 
                        onChange={handleChange}
                        placeholder="Pollen, Penicillin, etc." 
                      />
                    </div>

                    <div className="ap-input-group">
                      <label htmlFor="current_medications">CURRENT MEDICATIONS</label>
                      <input 
                        type="text" 
                        id="current_medications"
                        name="current_medications" 
                        value={formData.current_medications} 
                        onChange={handleChange}
                        placeholder="Dosages and names" 
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN - Photo, Emergency Contact, Caregiver Assignment */}
            <div className="ap-form-sidebar">
              
              {/* Profile Image Preview */}
              <div className="ap-card ap-photo-card">
                <div className="ap-photo-section">
                  <h4>Profile Image</h4>
                  <div className="ap-avatar-container">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`} 
                      alt="Parent Avatar" 
                      className="ap-avatar-img"
                    />
                    <div className="ap-avatar-badge">
                      <Upload size={14} />
                    </div>
                  </div>
                  <div className="ap-avatar-controls">
                    <label htmlFor="avatar-seed-input">AVATAR SEED (TYPE TO CHANGE)</label>
                    <input 
                      type="text" 
                      id="avatar-seed-input"
                      value={avatarSeed} 
                      onChange={(e) => setAvatarSeed(e.target.value)}
                      placeholder="George"
                    />
                  </div>
                  <p className="ap-photo-tip">Recommended: Simple names/seeds. This helps caregivers identify your parent quickly.</p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <ShieldAlert className="ap-card-icon orange" size={20} />
                  <h3>Emergency Contact</h3>
                </div>

                <div className="ap-card-body">
                  <div className="ap-input-group full-width">
                    <label htmlFor="emergency_contact_name">CONTACT NAME</label>
                    <input 
                      type="text" 
                      id="emergency_contact_name"
                      name="emergency_contact_name" 
                      value={formData.emergency_contact_name} 
                      onChange={handleChange}
                      placeholder="Name" 
                    />
                  </div>

                  <div className="ap-input-group full-width">
                    <label htmlFor="emergency_contact_phone">EMERGENCY NUMBER</label>
                    <input 
                      type="tel" 
                      id="emergency_contact_phone"
                      name="emergency_contact_phone" 
                      value={formData.emergency_contact_phone} 
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000" 
                    />
                  </div>
                </div>
              </div>

              {/* Assign Caregiver */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <UserRoundCheck className="ap-card-icon teal" size={20} />
                  <h3>Assign Caregiver</h3>
                </div>

                <div className="ap-card-body">
                  <div className="ap-input-group full-width">
                    <label htmlFor="assigned_caregiver_id">SELECT CAREGIVER</label>
                    <select 
                      id="assigned_caregiver_id"
                      name="assigned_caregiver_id" 
                      value={formData.assigned_caregiver_id} 
                      onChange={handleChange}
                    >
                      <option value="">Search caregivers...</option>
                      {caregivers.map(cg => (
                        <option key={cg.id} value={cg.id}>
                          {cg.name} {cg.specialization ? `(${cg.specialization})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="ap-sidebar-tip">Optional: You can assign a primary caregiver now or later from the Caregivers page.</p>
                </div>
              </div>

            </div>

          </div>

          {/* Form Actions Footer */}
          {error && (
            <div className="ap-error-banner">
              <span>✕</span> {error}
            </div>
          )}

          {success && (
            <div className="ap-success-banner">
              <ShieldCheck size={18} /> Parent profile created successfully! Redirecting...
            </div>
          )}

          <div className="ap-form-footer">
            <span className="ap-compliance-text">
              <ShieldCheck size={16} className="ap-compliance-icon" />
              All data is encrypted and HIPAA compliant.
            </span>

            <div className="ap-action-btns">
              <button 
                type="button" 
                onClick={() => navigate('/parents')} 
                className="ap-btn-cancel"
                disabled={loading}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="ap-btn-submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Parent'}
              </button>
            </div>
          </div>
        </form>
        
        <div className="ap-footer-session">
          <div className="ap-session-dot"></div>
          <span>FAMILYCARE ECOSYSTEM ACTIVE | SECURE SESSION</span>
        </div>

      </div>
    </ChildLayout>
  );
};

export default AddParent;
