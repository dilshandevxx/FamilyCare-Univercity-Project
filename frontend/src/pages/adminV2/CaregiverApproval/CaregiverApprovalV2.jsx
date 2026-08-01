import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, UserCheck, ShieldX, Check, AlertCircle, Award, Clock, Hash, MapPin, Users, Search, Loader2 } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import api from '../../../services/api';
import { useAdminStats } from '../../../context/AdminStatsContext';
import './CaregiverApprovalV2.css';

const CaregiverApprovalV2 = () => {
  const { refresh: refreshAdminStats } = useAdminStats();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentAction, setRecentAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/caregivers/pending');
      setApplicants(data.map(item => ({
        id: item.id,
        name: item.user_name || item.name || 'Caregiver',
        email: item.email || 'caregiver@care.com',
        experience: item.experience_years ? `${item.experience_years} years` : '5 years',
        certification: item.certification || 'CNA',
        license: item.license_id || `CNA-${item.id}8890`,
        location: 'New York, NY',
        status: 'pending',
        bio: item.bio || 'Compassionate nurse specialized in elder care, stroke recovery assistance, and cognitive therapies.',
        rating: 4.8
      })));
    } catch (err) {
      console.error('Failed to fetch pending caregivers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleDecision = async (id, name, decision) => {
    try {
      if (decision === 'approved') {
        await api.put(`/admin/caregivers/${id}/approve`);
      } else {
        await api.put(`/admin/caregivers/${id}/reject`);
      }

      setApplicants(prev => prev.map(a => {
        if (a.id === id) {
          return { ...a, status: decision };
        }
        return a;
      }));

      // Trigger immediate refresh of sidebar badge count
      if (typeof refreshAdminStats === 'function') {
        refreshAdminStats();
      }

      setRecentAction({ name, decision });
      setTimeout(() => {
        setApplicants(prev => prev.filter(a => a.id !== id));
        setRecentAction(null);
      }, 2000);
    } catch (err) {
      console.error(`Failed to ${decision} caregiver:`, err);
    }
  };

  const filteredApplicants = applicants.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.certification.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.license.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayoutV2 title="Caregiver Verification">
      <div className="approval-v2-container">
        
        {/* Header Section */}
        <div className="approval-v2-header">
          <div className="approval-v2-title">
            <h2>Caregiver Approvals</h2>
            <p>Review and verify caregiver applications for platform access.</p>
          </div>
          
          <div className="approval-v2-header-actions">
            <div className="approval-v2-search">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search applicants by name, cert, or license..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="approval-v2-stat-pill">
              <Users size={18} />
              <span>{applicants.filter(a => a.status === 'pending').length} Pending</span>
            </div>
          </div>
        </div>

        {/* Success/Error Banner */}
        {recentAction && (
          <div className={`approval-v2-action-banner banner-${recentAction.decision}`}>
            {recentAction.decision === 'approved' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
            <span>Caregiver <strong>{recentAction.name}</strong> has been successfully {recentAction.decision === 'approved' ? 'Approved & Activated' : 'Rejected'}.</span>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="approval-v2-empty-state">
            <Loader2 size={40} className="animate-spin" style={{ color: '#00A896', marginBottom: 12 }} />
            <p>Loading caregiver applications...</p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="approval-v2-empty-state">
            <div className="approval-v2-empty-icon">
              <ShieldCheck size={64} />
            </div>
            <h3>All Caught Up!</h3>
            <p>There are no pending caregiver applications awaiting administrative review at this time.</p>
          </div>
        ) : (
          <div className="approval-v2-list">
            {filteredApplicants.length > 0 ? filteredApplicants.map(a => (
              <div key={a.id} className={`approval-v2-list-item status-${a.status}`}>
                
                {/* 1. Profile Info */}
                <div className="list-item-profile">
                  <div className="list-item-avatar">
                    {a.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="list-item-details">
                    <h3>{a.name}</h3>
                    <p className="list-item-email">{a.email}</p>
                    <p className="list-item-location">
                      <MapPin size={12} /> {a.location}
                    </p>
                  </div>
                </div>

                {/* 2. Credentials */}
                <div className="list-item-credentials">
                  <div className="cred-badge primary">
                    <Award size={14} /> <span>{a.certification}</span>
                  </div>
                  <div className="cred-badge">
                    <Clock size={14} /> <span>{a.experience}</span>
                  </div>
                  <div className="cred-badge mono">
                    <Hash size={14} /> <span>{a.license}</span>
                  </div>
                </div>

                {/* 3. Bio Snippet */}
                <div className="list-item-bio">
                  <p>"{a.bio}"</p>
                </div>

                {/* 4. Actions */}
                <div className="list-item-actions">
                  {a.status === 'pending' ? (
                    <>
                      <button 
                        className="btn-reject"
                        onClick={() => handleDecision(a.id, a.name, 'rejected')}
                        title="Reject Applicant"
                      >
                        <ShieldX size={18} />
                      </button>
                      <button 
                        className="btn-approve"
                        onClick={() => handleDecision(a.id, a.name, 'approved')}
                      >
                        <UserCheck size={16} /> Approve
                      </button>
                    </>
                  ) : (
                    <div className={`decision-badge is-${a.status}`}>
                      {a.status === 'approved' ? (
                        <><Check size={16} /> Approved</>
                      ) : (
                        <><ShieldX size={16} /> Rejected</>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="approval-v2-empty-state">
                <p>No applicants match your search criteria.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </AdminLayoutV2>
  );
};

export default CaregiverApprovalV2;
