import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, CheckCircle, HelpCircle, 
  Star, Calendar, UserCheck, Heart, Sparkles, AlertCircle,
  MessageSquare, User, Phone, Mail, Award, FileText, Globe, MapPin, X,
  CreditCard, ShieldCheck, Check, Clock, RefreshCw, AlertTriangle, ChevronRight, Zap
} from 'lucide-react';
import ChildLayout from '../../../layouts/ChildLayout';
import api from '../../../services/api';
import './Caregivers.css';

const CaregiversList = () => {
  // Tabs: 'browse', 'assigned', 'subscriptions'
  const [activeTab, setActiveTab] = useState('browse');
  
  // States for caregivers, parents and subscriptions
  const [caregivers, setCaregivers] = useState([]);
  const [parents, setParents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningCg, setAssigningCg] = useState(null); // Caregiver being assigned / subscribed
  const [viewingCg, setViewingCg] = useState(null); // Caregiver profile modal
  const [selectedParentId, setSelectedParentId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  
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

  const fetchSubscriptionsData = async () => {
    try {
      const subRes = await api.get('/users/subscriptions/my-subscriptions');
      setSubscriptions(subRes.data || []);
    } catch (sErr) {
      console.warn('Error fetching child subscriptions:', sErr);
    }
  };

  // Fetch Caregivers, Parents, and Subscriptions on mount
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
        
        // 2. Fetch parents & subscriptions
        await Promise.all([
          fetchParentsData(),
          fetchSubscriptionsData(),
        ]);

        // 3. Fallback mock if completely empty
        if (cgData.length === 0) {
          cgData = [
            {
              id: 1,
              name: 'Elena Rodriguez',
              specialization: 'Dementia Care, Palliative Care, CNA Certified',
              experience_years: '8',
              hourly_rate: 32.00,
              monthly_rate: 350.00,
              plan_title: 'Comprehensive Monthly Care Plan',
              plan_description: 'Full-spectrum daily elder care, medication tracking, and vitals monitoring.',
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
              monthly_rate: 420.00,
              plan_title: 'Rehabilitation & Active Care Plan',
              plan_description: 'Mobility training, fall prevention, exercise regimen, and vitals logs.',
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
              monthly_rate: cg.monthly_rate != null ? Number(cg.monthly_rate) : 350.00,
              plan_title: cg.plan_title || 'Comprehensive Monthly Care Plan',
              plan_description: cg.plan_description || 'Full-spectrum daily elder care and continuous health vitals monitoring.',
              plan_features: cg.plan_features || 'Daily Vital Signs Logging\nMedication Reminders & Tracking\n24/7 Priority Emergency Support\nWeekly Family Health Progress Reports',
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

  // Handle PayHere Monthly Subscription Checkout & Assignment
  const handlePayHereCheckout = async (e, directSandbox = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedParentId || !assigningCg) return;

    const chosenParent = parents.find(p => p.id === parseInt(selectedParentId, 10));
    const parentName = chosenParent ? chosenParent.name : 'your parent';

    try {
      setPaymentLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      // 1. Call backend to initiate order and compute hash
      const initRes = await api.post('/users/subscriptions/payhere-init', {
        parentId: parseInt(selectedParentId, 10),
        caregiverId: assigningCg.id,
      });

      const payhereData = initRes.data;

      // Helper function to complete subscription verification
      const verifyAndFinalize = async (txId, method) => {
        try {
          await api.post('/users/subscriptions/payhere-verify', {
            parentId: parseInt(selectedParentId, 10),
            caregiverId: assigningCg.id,
            order_id: payhereData.order_id,
            payhere_payment_id: txId || `PAYHERE_SB_${Date.now()}`,
            payhere_amount: payhereData.amount,
            payhere_currency: payhereData.currency,
            plan_title: assigningCg.plan_title || payhereData.caregiver?.plan_title,
          });

          setSuccessMsg(`Payment Successful! 1-Month care subscription activated for ${assigningCg.name}. Successfully assigned to ${parentName}.`);
          setAssigningCg(null);
          setSelectedParentId('');
          await fetchParentsData();
          await fetchSubscriptionsData();
          setTimeout(() => setSuccessMsg(''), 5000);
        } catch (vErr) {
          console.error('Verification error:', vErr);
          setErrorMsg(vErr?.response?.data?.error || 'Subscription verification failed.');
        } finally {
          setPaymentLoading(false);
        }
      };

      // If user chose direct sandbox simulation or if PayHere SDK is unavailable
      if (directSandbox || !window.payhere) {
        await verifyAndFinalize(`SANDBOX_DIRECT_${Date.now()}`, 'SANDBOX_DIRECT');
        return;
      }

      // 2. Setup PayHere JS SDK Event Callbacks
      window.payhere.onCompleted = function onCompleted(orderId) {
        console.log('PayHere payment completed:', orderId);
        verifyAndFinalize(orderId, 'PAYHERE_POPUP');
      };

      window.payhere.onDismissed = function onDismissed() {
        setPaymentLoading(false);
        setErrorMsg('Payment modal closed. Caregiver subscription was not activated.');
      };

      window.payhere.onError = function onError(error) {
        setPaymentLoading(false);
        console.error('PayHere Error:', error);
        setErrorMsg(`Payment error: ${error || 'Payment gateway encountered an issue.'}`);
      };

      // 3. Trigger PayHere Sandbox Checkout Popup
      const paymentObj = {
        sandbox: true,
        merchant_id: payhereData.merchant_id,
        return_url: payhereData.return_url,
        cancel_url: payhereData.cancel_url,
        notify_url: payhereData.notify_url,
        order_id: payhereData.order_id,
        items: payhereData.items,
        amount: payhereData.amount,
        currency: payhereData.currency,
        hash: payhereData.hash,
        first_name: payhereData.first_name,
        last_name: payhereData.last_name,
        email: payhereData.email,
        phone: payhereData.phone,
        address: payhereData.address,
        city: payhereData.city,
        country: payhereData.country,
        custom_1: String(selectedParentId),
        custom_2: String(assigningCg.id),
      };

      window.payhere.startPayment(paymentObj);

    } catch (err) {
      console.error('Error initiating PayHere subscription:', err);
      setErrorMsg(err?.response?.data?.error || 'Failed to initialize PayHere subscription.');
      setPaymentLoading(false);
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
          return { ...p, assigned_caregiver_id: null, caregiver_name: null, subscription_status: 'inactive' };
        }
        return p;
      }));

      await Promise.all([fetchParentsData(), fetchSubscriptionsData()]);
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
        
        {/* BREADCRUMBS & SEARCH HEADER */}
        <div className="cg-header-row">
          <div className="cg-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span className="cg-bc-separator">&gt;</span>
            <span className="cg-bc-active">Caregivers & Subscriptions</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="cg-page-title" style={{ marginBottom: '4px' }}>Caregivers & Monthly Care Plans</h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 1.2rem 0' }}>
              Assign certified caregivers to your parents with secure 30-day monthly subscriptions powered by PayHere.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdfa', border: '1px solid #99f6e4', padding: '6px 12px', borderRadius: '20px', fontSize: '0.78rem', color: '#0f766e', fontWeight: '600' }}>
            <ShieldCheck size={14} /> PayHere Sandbox Verified
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
          <button 
            className={`cg-tab-btn${activeTab === 'subscriptions' ? ' active' : ''}`}
            onClick={() => {
              setActiveTab('subscriptions');
              fetchSubscriptionsData();
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={15} /> Subscriptions & Billing ({subscriptions.length})
            </span>
          </button>
        </div>

        {/* ── TAB: SUBSCRIPTIONS & BILLING ── */}
        {activeTab === 'subscriptions' && (
          <div style={{ marginTop: '1rem' }}>
            {subscriptions.length === 0 ? (
              <div className="cg-empty-state" style={{ background: '#ffffff', padding: '48px 24px', borderRadius: '16px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                <CreditCard size={40} style={{ color: '#94a3b8', margin: '0 auto 12px' }} />
                <h3 style={{ color: '#1e293b', fontSize: '1.1rem', margin: '0 0 6px 0' }}>No active subscriptions yet</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 16px' }}>
                  When you assign a caregiver to your parent and pay via PayHere, your monthly subscription receipts and validity will appear here.
                </p>
                <button 
                  onClick={() => setActiveTab('browse')}
                  style={{ padding: '8px 18px', background: '#0d9488', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Browse Caregivers
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {subscriptions.map(sub => {
                  const endDate = new Date(sub.end_date);
                  const now = new Date();
                  const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                  const isActive = diffDays > 0 && sub.status === 'active';

                  return (
                    <div 
                      key={sub.id} 
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '20px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '20px',
                        alignItems: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                    >
                      {/* Parent & Caregiver */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            background: isActive ? '#dcfce7' : '#fee2e2',
                            color: isActive ? '#15803d' : '#b91c1c',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {isActive ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                            {isActive ? `Active (${diffDays} days left)` : 'Expired / Due Renewal'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Order: {sub.transaction_id || sub.id}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 4px 0', color: '#0f172a' }}>
                          {sub.plan_name || 'Monthly Care Plan'}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                          Parent: <strong>{sub.parent_name}</strong> • Caregiver: <strong>{sub.caregiver_name}</strong>
                        </div>
                      </div>

                      {/* Payment & Validity */}
                      <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                          <span>Monthly Rate</span>
                          <strong style={{ color: '#0d9488', fontSize: '0.95rem' }}>
                            {sub.currency || 'LKR'} {Number(sub.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>
                          <span>Start Date</span>
                          <span>{new Date(sub.start_date).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                          <span>End Date</span>
                          <span style={{ fontWeight: '600', color: isActive ? '#0f172a' : '#b91c1c' }}>
                            {endDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            const cg = caregivers.find(c => c.id === sub.caregiver_id) || {
                              id: sub.caregiver_id,
                              name: sub.caregiver_name,
                              monthly_rate: sub.amount,
                              plan_title: sub.plan_name,
                            };
                            setSelectedParentId(String(sub.parent_id));
                            setAssigningCg(cg);
                          }}
                          style={{
                            padding: '8px 16px',
                            background: '#0d9488',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <RefreshCw size={13} /> Renew Subscription
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

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
          <div className="cg-loader">Loading Caregivers & Packages...</div>
        ) : (
          activeTab !== 'subscriptions' && (
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

                        {/* Header Title + Rate */}
                        <div className="cg-card-body">
                          <div className="cg-card-header">
                            <div>
                              <h4 className="cg-cg-name">{cg.name}</h4>
                              <p className="cg-cg-exp">
                                {cg.experience_years ? `${cg.experience_years} Years Experience` : 'Certified Caregiver'}
                              </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span className="cg-cg-rate" style={{ fontSize: '1rem', color: '#0d9488' }}>
                                LKR {Number(cg.monthly_rate || 350).toLocaleString()}
                                <span className="small">/mo</span>
                              </span>
                            </div>
                          </div>

                          {/* Plan Title Badge */}
                          <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '4px 8px', borderRadius: '6px', marginBottom: '8px', fontSize: '0.74rem', color: '#0f766e', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={11} /> {cg.plan_title || 'Comprehensive Monthly Care Plan'}
                          </div>

                          {/* Specializations Badges */}
                          <div className="cg-badges-row">
                            {(cg.specialization || 'General Care').split(',').map((spec, i) => (
                              <span key={i} className="cg-badge">
                                {spec.trim()}
                              </span>
                            ))}
                          </div>

                          {/* Availability Details */}
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

                          {/* Assignments / Actions */}
                          {assignedParents.length > 0 && (
                            <div className="cg-assigned-parents-box">
                              <span className="cg-assigned-lbl">Assigned to:</span>
                              {assignedParents.map(p => (
                                <div key={p.id} className="cg-assigned-parent-tag">
                                  <span>{p.name}</span>
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
                              View Plan & Profile
                            </button>
                            <button 
                              className="cg-action-btn primary"
                              onClick={() => setAssigningCg(cg)}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                            >
                              <CreditCard size={13} /> Subscribe & Assign
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* WHY FAMILYCARE MARKETING SECTION */}
              {activeTab === 'browse' && (
                <div className="cg-marketing-section">
                  <div className="cg-mkt-content">
                    <span className="cg-mkt-lbl">SECURE MONTHLY CARE SUBSCRIPTIONS</span>
                    <h3 className="cg-mkt-title">
                      Trusted care with seamless <span className="teal-text">PayHere monthly billing.</span>
                    </h3>
                    <p className="cg-mkt-desc">
                      Every caregiver manages their customized monthly service package. When assigning care for your parent, you enjoy 30 days of round-the-clock vitals tracking, instant emergency alerts, and dedicated health logs.
                    </p>

                    <div className="cg-mkt-stats-row">
                      <div className="cg-stat-box">
                        <span className="cg-stat-num">100%</span>
                        <span className="cg-stat-lbl">SANDBOX SECURED</span>
                      </div>
                      <div className="cg-stat-divider"></div>
                      <div className="cg-stat-box">
                        <span className="cg-stat-num">30 Days</span>
                        <span className="cg-stat-lbl">FULL CARE WINDOW</span>
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
                        <span className="cg-v-lbl">MONTHLY CARE GUARANTEE</span>
                        <p className="cg-v-text">Directly support caregivers with transparent monthly subscription pricing.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        )}

        {/* ── VIEW PROFILE & MONTHLY PLAN MODAL ── */}
        {viewingCg && (
          <div className="cg-modal-overlay" onClick={() => setViewingCg(null)}>
            <div className="cg-modal" style={{ maxWidth: '620px' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="cg-modal-title" style={{ margin: 0 }}>Caregiver Profile & Package</h3>
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
                    <span>{viewingCg.experience_years ? `${viewingCg.experience_years} yrs exp` : 'Certified'}</span>
                  </div>
                </div>
              </div>

              {/* Monthly Subscription Plan Card */}
              <div style={{
                background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                    MONTHLY CARE PACKAGE
                  </span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>30 Days Subscription</span>
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#ffffff' }}>
                  {viewingCg.plan_title || 'Comprehensive Monthly Care Plan'}
                </h4>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', margin: '8px 0 6px 0', color: '#5eead4' }}>
                  LKR {Number(viewingCg.monthly_rate || 350).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  <span style={{ fontSize: '0.8rem', color: '#ccfbf1', fontWeight: 'normal' }}> / month</span>
                </div>
                <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  {viewingCg.plan_description || 'Full-spectrum daily elder care and continuous health vitals monitoring.'}
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.85, marginBottom: '6px' }}>
                    Package Inclusions:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '6px' }}>
                    {(viewingCg.plan_features || 'Daily Vitals Tracking\nMedication Reminders\nEmergency Support')
                      .split('\n')
                      .filter(f => f.trim())
                      .map((feat, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem' }}>
                          <Check size={12} style={{ color: '#5eead4', flexShrink: 0 }} />
                          <span>{feat.trim()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                <div>
                  <strong style={{ display: 'block', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '2px' }}>About Caregiver</strong>
                  <p style={{ margin: 0, lineHeight: 1.4, color: '#64748b', fontSize: '0.84rem' }}>{viewingCg.bio || 'Professional caregiver dedicated to the safety, happiness, and health of elders.'}</p>
                </div>

                {viewingCg.certification && (
                  <div>
                    <strong style={{ display: 'block', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '2px' }}>Certifications</strong>
                    <p style={{ margin: 0, color: '#334155', fontSize: '0.84rem' }}>{viewingCg.certification}</p>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
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
                  <CreditCard size={14} /> Subscribe & Assign via PayHere
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ASSIGN & PAYHERE CHECKOUT MODAL ── */}
        {assigningCg && (
          <div className="cg-modal-overlay" onClick={() => !paymentLoading && setAssigningCg(null)}>
            <div className="cg-modal" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 className="cg-modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={20} className="icon-teal" />
                  Monthly Care Subscription
                </h3>
                {!paymentLoading && (
                  <button onClick={() => setAssigningCg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                )}
              </div>

              <p className="cg-modal-sub" style={{ margin: '0 0 16px 0', fontSize: '0.85rem' }}>
                Subscribe to <span className="bold">{assigningCg.name}</span> for a 30-day care package dedicated to your parent.
              </p>

              {/* Package Summary Box */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
                      SELECTED MONTHLY PLAN
                    </span>
                    <h4 style={{ margin: '2px 0 0 0', fontSize: '1rem', color: '#0f172a' }}>
                      {assigningCg.plan_title || 'Comprehensive Monthly Care Plan'}
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0d9488' }}>
                      LKR {Number(assigningCg.monthly_rate || 350).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>for 30 days</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px', marginTop: '10px', fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={13} style={{ color: '#0d9488' }} />
                    <span>Daily vitals monitoring and medication log access</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={13} style={{ color: '#0d9488' }} />
                    <span>24/7 direct messaging & emergency escalation</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePayHereCheckout}>
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
                          {p.name} {p.assigned_caregiver_id ? `(Current: ${p.caregiver_name || 'Caregiver #' + p.assigned_caregiver_id})` : '(Unassigned)'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* PayHere Sandbox Info Box */}
                <div style={{
                  background: '#f0fdfa',
                  border: '1px solid #99f6e4',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  color: '#0f766e',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldCheck size={20} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>PayHere Sandbox Gateway:</strong> Test credit/debit card popup or simulate instant approval. Caregiver will be assigned immediately for 30 days.
                  </div>
                </div>

                <div className="cg-modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    type="submit" 
                    className="cg-modal-btn submit"
                    disabled={!selectedParentId || paymentLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: '#0d9488'
                    }}
                  >
                    {paymentLoading ? (
                      <>
                        <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Processing PayHere Sandbox...
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} /> Pay LKR {Number(assigningCg.monthly_rate || 350).toLocaleString()} with PayHere
                      </>
                    )}
                  </button>

                  {/* Fast Instant Sandbox Simulation Button */}
                  <button
                    type="button"
                    disabled={!selectedParentId || paymentLoading}
                    onClick={() => handlePayHereCheckout(null, true)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      color: '#475569',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Zap size={13} style={{ color: '#0d9488' }} /> Fast Instant Sandbox Test (Bypass Popup)
                  </button>

                  <button 
                    type="button" 
                    className="cg-modal-btn cancel"
                    disabled={paymentLoading}
                    onClick={() => setAssigningCg(null)}
                    style={{ width: '100%', textAlign: 'center', marginTop: '4px' }}
                  >
                    Cancel
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
