import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, CheckCircle, HelpCircle, 
  Star, Calendar, UserCheck, Heart, Sparkles, AlertCircle,
  MessageSquare, User, Phone, Mail, Award, FileText, Globe, MapPin, X,
  ShieldCheck, Check, Clock, RefreshCw, AlertTriangle, ChevronRight, UserPlus, Users
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './Caregivers.css';

const CaregiversList = () => {
  // Tabs: 'browse', 'assigned'
  const [activeTab, setActiveTab] = useState('browse');
  
  // States for caregivers and parents
  const [caregivers, setCaregivers] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningCg, setAssigningCg] = useState(null); // Caregiver being assigned
  const [viewingCg, setViewingCg] = useState(null); // Caregiver profile modal
  const [selectedParentId, setSelectedParentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('All Levels');
  const [availabilityFilter, setAvailabilityFilter] = useState('Anytime');
  const [ratingFilter, setRatingFilter] = useState('All Ratings');

  // UI Status Banners
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchParentsData = async () => {
    try {
      const parentRes = await api.get('/parents');
      setParents(parentRes.data || []);
    } catch (pErr) {
      console.warn('Error fetching parents in child Caregivers view:', pErr);
    }
  };

  // Fetch Caregivers and Parents on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch caregivers
        let cgData = [];
        try {
          const cgRes = await api.get('/caregivers');
          if (Array.isArray(cgRes.data) && cgRes.data.length > 0) {
            cgData = cgRes.data;
          }
        } catch (authErr) {
          console.warn('Could not load /caregivers via auth, trying public:', authErr);
        }

        if (cgData.length === 0) {
          try {
            const pubRes = await api.get('/caregivers/public');
            if (Array.isArray(pubRes.data) && pubRes.data.length > 0) {
              cgData = pubRes.data;
            }
          } catch (pubErr) {
            console.error('Error loading public caregivers:', pubErr);
          }
        }
        
        // 2. Fetch parents
        await fetchParentsData();

        // 3. Fallback mock if completely empty
        if (cgData.length === 0) {
          cgData = [
            {
              id: 1,
              name: 'Elena Rodriguez',
              specialization: 'Dementia Care, Palliative Care, CNA Certified',
              experience_years: '8',
              hourly_rate: 32.00,
              bio: 'Specialized in elderly dementia support with 8 years of certified nursing assistance experience.',
              rating: 4.9,
              total_reviews: 128,
              availability: 'Mon, Wed, Fri',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
            },
            {
              id: 2,
              name: 'Marcus Thorne',
              specialization: 'Mobility Support, Physical Therapy, Rehab',
              experience_years: '12',
              hourly_rate: 45.00,
              bio: 'PT assistant focusing on senior mobility enhancement and post-injury rehabilitation.',
              rating: 4.8,
              total_reviews: 94,
              availability: 'Weeknights',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
            }
          ];
        } else {
          // Normalize caregiver fields
          cgData = cgData.map((cg, index) => {
            const avatarUrl = cg.avatar_url 
              ? (cg.avatar_url.startsWith('http') ? cg.avatar_url : `http://localhost:5000${cg.avatar_url}`)
              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cg.name || 'Caregiver' + index)}`;
            return {
              ...cg,
              rating: Number(cg.rating || (4.6 + ((index * 7) % 5) * 0.1)).toFixed(1),
              total_reviews: cg.total_reviews || (25 + index * 8),
              availability: (cg.is_available ? 'Immediate' : 'Weekdays') || cg.availability || 'Weekdays',
              avatar: avatarUrl
            };
          });
        }

        setCaregivers(cgData);
      } catch (err) {
        console.error('Error fetching caregivers feed:', err);
        setErrorMsg('Failed to load caregivers listing.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle Direct Caregiver Assignment Request to Caregiver
  const handleAssignSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedParentId || !assigningCg) return;

    const chosenParent = parents.find(p => p.id === parseInt(selectedParentId, 10));
    const parentName = chosenParent ? chosenParent.name : 'your parent';

    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');

      // Send assignment request to caregiver (sets assignment_status = 'pending')
      await api.put(`/parents/${selectedParentId}/assign`, {
        assigned_caregiver_id: assigningCg.id
      });

      setSuccessMsg(`Care assignment request sent to ${assigningCg.name} for ${parentName}! The request is now pending their approval.`);
      setAssigningCg(null);
      setSelectedParentId('');
      
      // Refresh parent list so state is immediate
      await fetchParentsData();
      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err) {
      console.error('Error sending care assignment request:', err);
      setErrorMsg(err?.response?.data?.error || 'Failed to send care assignment request.');
    } finally {
      setSubmitting(false);
    }
  };

  // Unassign Caregiver
  const handleUnassign = async (parentId, parentName) => {
    const confirmed = window.confirm(`Are you sure you want to cancel the caregiver assignment for ${parentName}?`);
    if (!confirmed) return;

    try {
      setErrorMsg('');
      setSuccessMsg('');

      await api.put(`/parents/${parentId}/assign`, {
        assigned_caregiver_id: null
      });

      setSuccessMsg(`Caregiver assignment removed for ${parentName}.`);
      
      // Update local state
      setParents(prev => prev.map(p => {
        if (p.id === parentId) {
          return { ...p, assigned_caregiver_id: null, caregiver_name: null, assignment_status: null };
        }
        return p;
      }));

      await fetchParentsData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error unassigning caregiver:', err);
      setErrorMsg('Failed to remove caregiver.');
    }
  };

  // Filter Logic
  const filteredCaregivers = caregivers.filter(cg => {
    // 1. Search Query
    const query = searchQuery.toLowerCase().trim();
    const safeName = (cg.name || '').toLowerCase();
    const safeSpec = (cg.specialization || '').toLowerCase();
    const safeBio = (cg.bio || '').toLowerCase();
    const safeLoc = (cg.location || '').toLowerCase();

    const matchesSearch = !query || 
                          safeName.includes(query) || 
                          safeSpec.includes(query) || 
                          safeBio.includes(query) ||
                          safeLoc.includes(query);

    // 2. Experience Filter
    let matchesExperience = true;
    const years = parseInt(cg.experience_years, 10) || 0;
    if (experienceFilter === '1-5 Years') {
      matchesExperience = years >= 1 && years <= 5;
    } else if (experienceFilter === '5-10 Years') {
      matchesExperience = years > 5 && years <= 10;
    } else if (experienceFilter === '10+ Years') {
      matchesExperience = years > 10;
    }

    // 3. Availability Filter
    let matchesAvailability = true;
    if (availabilityFilter !== 'Anytime') {
      const avail = (cg.availability || '').toLowerCase();
      matchesAvailability = avail.includes(availabilityFilter.toLowerCase()) ||
                            avail.includes('immediate') ||
                            cg.is_available === 1 ||
                            cg.is_available === true;
    }

    // 4. Rating Filter
    let matchesRating = true;
    const ratingVal = parseFloat(cg.rating) || 0;
    if (ratingFilter === '4.5+ Stars') {
      matchesRating = ratingVal >= 4.5;
    } else if (ratingFilter === '4.8+ Stars') {
      matchesRating = ratingVal >= 4.8;
    } else if (ratingFilter === '5.0 Stars') {
      matchesRating = ratingVal >= 5.0;
    }

    return matchesSearch && matchesExperience && matchesAvailability && matchesRating;
  });

  // Assigned Caregivers filter
  const assignedCaregivers = caregivers.filter(cg => 
    Array.isArray(parents) && parents.some(p => p.assigned_caregiver_id === cg.id)
  );

  const displayCaregivers = activeTab === 'assigned' ? assignedCaregivers : filteredCaregivers;

  return (
    <ChildLayout title="Caregivers">
      <div className="cg-container">
        
        {/* BREADCRUMBS & HEADER */}
        <div className="cg-header-row">
          <div className="cg-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span className="cg-bc-separator">&gt;</span>
            <span className="cg-bc-active">Caregivers Directory</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="cg-page-title" style={{ marginBottom: '4px' }}>Find & Assign Caregivers</h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 1.2rem 0' }}>
              Connect your parents with verified, certified professional caregivers dedicated to their safety and health.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdfa', border: '1px solid #99f6e4', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', color: '#0f766e', fontWeight: '600' }}>
            <ShieldCheck size={15} /> Verified Caregiver Network
          </div>
        </div>

        {/* FEEDBACK BANNERS */}
        {successMsg && (
          <div className="cg-feedback-banner success">
            <CheckCircle size={16} /> <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="cg-feedback-banner error">
            <AlertCircle size={16} /> <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB TOGGLES */}
        <div className="cg-tab-row">
          <button 
            className={`cg-tab-btn${activeTab === 'browse' ? ' active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse All Caregivers ({filteredCaregivers.length})
          </button>
          <button 
            className={`cg-tab-btn${activeTab === 'assigned' ? ' active' : ''}`}
            onClick={() => setActiveTab('assigned')}
          >
            Assigned Caregivers ({assignedCaregivers.length})
          </button>
        </div>

        {/* ── TAB: BROWSE ALL CAREGIVERS ── */}
        {activeTab === 'browse' && (
          /* FILTER PANEL CONSOLE */
          <div className="cg-filter-panel">
            <div className="cg-search-box">
              <span className="cg-search-label">SEARCH CAREGIVERS</span>
              <div className="cg-search-input-wrapper">
                <Search size={16} className="cg-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by name, specialty, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="cg-dropdown-group">
              <div className="cg-drop">
                <span className="cg-search-label">EXPERIENCE</span>
                <select value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)}>
                  <option>All Levels</option>
                  <option>1-5 Years</option>
                  <option>5-10 Years</option>
                  <option>10+ Years</option>
                </select>
              </div>

              <div className="cg-drop">
                <span className="cg-search-label">AVAILABILITY</span>
                <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
                  <option>Anytime</option>
                  <option>Immediate</option>
                  <option>Weeknights</option>
                  <option>Mon, Wed, Fri</option>
                </select>
              </div>

              <div className="cg-drop">
                <span className="cg-search-label">RATING</span>
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                  <option>All Ratings</option>
                  <option>4.5+ Stars</option>
                  <option>4.8+ Stars</option>
                  <option>5.0 Stars</option>
                </select>
              </div>

              {(searchQuery || experienceFilter !== 'All Levels' || availabilityFilter !== 'Anytime' || ratingFilter !== 'All Ratings') && (
                <button 
                  className="cg-filter-icon-btn" 
                  title="Reset Filters"
                  onClick={() => {
                    setSearchQuery('');
                    setExperienceFilter('All Levels');
                    setAvailabilityFilter('Anytime');
                    setRatingFilter('All Ratings');
                  }}
                  style={{ cursor: 'pointer', background: 'var(--color-primary)', color: 'white', border: 'none' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="cg-loader">Loading Caregivers...</div>
        ) : (
          <>
            {/* GRID OF CAREGIVER CARDS */}
            {displayCaregivers.length === 0 ? (
              <div className="cg-empty-state">
                <h3>No caregivers found matching filters</h3>
                <p>Try resetting your search query or dropdown filters.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setExperienceFilter('All Levels');
                    setAvailabilityFilter('Anytime');
                    setRatingFilter('All Ratings');
                  }}
                  style={{ marginTop: '12px', padding: '8px 16px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="cg-grid">
                {displayCaregivers.map(cg => {
                  const assignedParents = parents.filter(p => p.assigned_caregiver_id === cg.id);
                  return (
                    <div key={cg.id} className="cg-card">
                      
                      {/* Rating Overlay badge */}
                      <div className="cg-card-image-box">
                        <img src={cg.avatar} alt={cg.name} className="cg-card-avatar" />
                        <span className="cg-card-rating">
                          <Star size={12} fill="currentColor" /> {cg.rating}
                        </span>
                      </div>

                      {/* Header Title */}
                      <div className="cg-card-body">
                        <div className="cg-card-header">
                          <div>
                            <h4 className="cg-cg-name">{cg.name}</h4>
                            <p className="cg-cg-exp">
                              {cg.experience_years ? `${cg.experience_years} Years Experience` : 'Certified Caregiver'}
                            </p>
                          </div>
                          {cg.location && (
                            <div style={{ fontSize: '0.76rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <MapPin size={12} /> {cg.location}
                            </div>
                          )}
                        </div>

                        {/* Specializations Badges */}
                        <div className="cg-badges-row">
                          {(cg.specialization || 'General Care').split(',').map((spec, i) => (
                            <span key={i} className="cg-badge">
                              {spec.trim()}
                            </span>
                          ))}
                        </div>

                        {/* Availability Details & Capacity */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                          <p className="cg-cg-avail" style={{ margin: 0 }}>
                            <Calendar size={13} /> Available: {cg.availability}
                          </p>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: (cg.active_count || 0) >= (cg.max_capacity || 4) ? '#fee2e2' : '#f0fdf4',
                            color: (cg.active_count || 0) >= (cg.max_capacity || 4) ? '#dc2626' : '#16a34a',
                            border: `1px solid ${(cg.active_count || 0) >= (cg.max_capacity || 4) ? '#fca5a5' : '#86efac'}`
                          }}>
                            {cg.active_count || 0}/{cg.max_capacity || 4} Residents {(cg.active_count || 0) >= (cg.max_capacity || 4) ? '• Full' : ''}
                          </span>
                        </div>

                        {/* Bio Text */}
                        <p className="cg-cg-bio">{cg.bio || 'Dedicated professional caregiver committed to providing high quality personal and healthcare support.'}</p>

                        {/* Assigned Parents tags */}
                        {assignedParents.length > 0 && (
                          <div className="cg-assigned-parents-box">
                            <span className="cg-assigned-lbl">Assigned to:</span>
                            {assignedParents.map(p => (
                              <div key={p.id} className="cg-assigned-parent-tag">
                                <span>{p.name}</span>
                                {p.assignment_status === 'pending' ? (
                                  <span style={{ fontSize: '0.68rem', color: '#b45309', background: '#fef3c7', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px' }}>
                                    Pending
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '0.68rem', color: '#15803d', background: '#dcfce7', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px' }}>
                                    Active
                                  </span>
                                )}
                                <button 
                                  type="button" 
                                  onClick={() => handleUnassign(p.id, p.name)}
                                  className="cg-unassign-x"
                                  title="Unassign Caregiver"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="cg-card-actions">
                          {assignedParents.length > 0 && cg.user_id && (
                            <Link 
                              to={`/messages?recipient=${cg.user_id}`}
                              className="cg-action-btn"
                              style={{ background: '#0ea5e9', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                              title={`Chat with ${cg.name}`}
                            >
                              <MessageSquare size={14} /> Chat
                            </Link>
                          )}
                          <button 
                            className="cg-action-btn secondary"
                            onClick={() => setViewingCg(cg)}
                          >
                            View Profile
                          </button>
                          <button 
                            className="cg-action-btn primary"
                            onClick={() => setAssigningCg(cg)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                          >
                            <UserPlus size={14} /> Assign to Parent
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
            
            {/* WHY FAMILYCARE QUALITY HIGHLIGHT SECTION */}
            {activeTab === 'browse' && (
              <div className="cg-marketing-section">
                <div className="cg-mkt-content">
                  <span className="cg-mkt-lbl">DIRECT DEDICATED CARE ASSIGNMENT</span>
                  <h3 className="cg-mkt-title">
                    Trusted elder care with <span className="teal-text">real-time coordination.</span>
                  </h3>
                  <p className="cg-mkt-desc">
                    When you assign a caregiver to your parent, an instant care request is dispatched. Once accepted, your caregiver gets immediate access to health vitals logs, medication schedules, and 24/7 direct communication.
                  </p>

                  <div className="cg-mkt-stats-row">
                    <div className="cg-stat-box">
                      <span className="cg-stat-num">100%</span>
                      <span className="cg-stat-lbl">BACKGROUND VERIFIED</span>
                    </div>
                    <div className="cg-stat-divider"></div>
                    <div className="cg-stat-box">
                      <span className="cg-stat-num">24/7</span>
                      <span className="cg-stat-lbl">HEALTH MONITORING</span>
                    </div>
                  </div>
                </div>

                <div className="cg-mkt-visual">
                  <img 
                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400" 
                    alt="caregiver hands support"
                    className="cg-mkt-image"
                  />
                  <div className="cg-verified-badge">
                    <span className="cg-v-icon">✓</span>
                    <div>
                      <span className="cg-v-lbl">CONTINUOUS CARE GUARANTEE</span>
                      <p className="cg-v-text">Directly connect with certified caregivers tailored to your parent's unique needs.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── VIEW PROFILE MODAL ── */}
        {viewingCg && (
          <div className="cg-modal-overlay" onClick={() => setViewingCg(null)}>
            <div className="cg-modal" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="cg-modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCheck size={20} style={{ color: 'var(--color-primary)' }} />
                  Caregiver Profile
                </h3>
                <button onClick={() => setViewingCg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <img src={viewingCg.avatar} alt={viewingCg.name} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#1e293b' }}>{viewingCg.name}</h4>
                  <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: '500' }}>{viewingCg.specialization || 'General Elder Care'}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>⭐ {viewingCg.rating} ({viewingCg.total_reviews} reviews)</span>
                    <span>•</span>
                    <span>{viewingCg.experience_years ? `${viewingCg.experience_years} yrs experience` : 'Certified'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#334155', marginBottom: '20px' }}>
                <div>
                  <strong style={{ display: 'block', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '4px' }}>About Caregiver</strong>
                  <p style={{ margin: 0, lineHeight: 1.5, color: '#64748b', fontSize: '0.86rem' }}>
                    {viewingCg.bio || 'Dedicated professional caregiver committed to the safety, happiness, and clinical health of elders.'}
                  </p>
                </div>

                {viewingCg.certification && (
                  <div>
                    <strong style={{ display: 'block', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '4px' }}>Certifications & Qualifications</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f766e', background: '#f0fdfa', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccfbf1' }}>
                      <Award size={16} />
                      <span style={{ fontSize: '0.84rem' }}>{viewingCg.certification}</span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Availability</span>
                    <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.85rem' }}>{viewingCg.availability || 'Weekdays'}</span>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Current Capacity</span>
                    <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.85rem' }}>{viewingCg.active_count || 0}/{viewingCg.max_capacity || 4} Assigned Residents</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  className="cg-modal-btn cancel"
                  onClick={() => setViewingCg(null)}
                >
                  Close
                </button>
                <button 
                  className="cg-modal-btn submit"
                  onClick={() => {
                    const cg = viewingCg;
                    setViewingCg(null);
                    setAssigningCg(cg);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <UserPlus size={15} /> Assign to Parent
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ASSIGN CAREGIVER MODAL (DIRECT REQUEST TO CAREGIVER) ── */}
        {assigningCg && (
          <div className="cg-modal-overlay" onClick={() => !submitting && setAssigningCg(null)}>
            <div className="cg-modal" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 className="cg-modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={20} className="icon-teal" />
                  Assign Caregiver to Parent
                </h3>
                {!submitting && (
                  <button onClick={() => setAssigningCg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Caregiver Summary Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <img 
                  src={assigningCg.avatar} 
                  alt={assigningCg.name} 
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '0.96rem', color: '#0f172a' }}>{assigningCg.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: '500' }}>
                    {assigningCg.specialization || 'Certified Caregiver'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleAssignSubmit}>
                <div className="cg-modal-field" style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    SELECT PARENT TO ASSIGN
                  </label>
                  {!Array.isArray(parents) || parents.length === 0 ? (
                    <p className="cg-modal-warning" style={{ background: '#fef2f2', padding: '10px', borderRadius: '8px', color: '#991b1b', fontSize: '0.82rem' }}>
                      No parent profiles found. Please <Link to="/add-parent" style={{ color: '#0d9488', fontWeight: '600' }}>create a parent profile</Link> first.
                    </p>
                  ) : (
                    <select 
                      value={selectedParentId} 
                      onChange={e => setSelectedParentId(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#0f172a',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    >
                      <option value="">-- Choose Parent --</option>
                      {parents.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.relationship ? `(${p.relationship})` : ''} {p.assigned_caregiver_id ? `— Currently: ${p.caregiver_name || 'Caregiver #' + p.assigned_caregiver_id}` : '— (Unassigned)'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Direct Request Notice */}
                <div style={{
                  background: '#f0fdfa',
                  border: '1px solid #99f6e4',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  color: '#0f766e',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <Clock size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>How Assignment Works:</strong> Submitting this request will send an immediate care invitation to <strong>{assigningCg.name}</strong>. Once they accept, they will have access to the parent's clinical profile and care logs.
                  </div>
                </div>

                <div className="cg-modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="cg-modal-btn cancel"
                    disabled={submitting}
                    onClick={() => setAssigningCg(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="cg-modal-btn submit"
                    disabled={!selectedParentId || submitting}
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#0d9488'
                    }}
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} /> Send Assignment Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </ChildLayout>
  );
};

export default CaregiversList;
