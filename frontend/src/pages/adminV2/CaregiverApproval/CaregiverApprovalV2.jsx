import React, { useState } from 'react';
import { ShieldCheck, UserCheck, ShieldX, Check, AlertCircle, Award, Clock, Hash, MapPin, Users, Search } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import './CaregiverApprovalV2.css';

const initialApplicants = [
  { id: 1, name: 'Clara Oswald', email: 'clara@care.com', experience: '5 years', certification: 'CNA', license: 'CNA-778945', location: 'New York, NY', status: 'pending', bio: 'Compassionate nurse specialized in elder care, stroke recovery assistance, and cognitive therapies.', rating: 4.8 },
  { id: 2, name: 'Ravi Kumar', email: 'ravi@care.com', experience: '8 years', certification: 'RN', license: 'RN-901124', location: 'San Francisco, CA', status: 'pending', bio: 'Certified Registered Nurse with over 8 years experience in hospital ICU settings and home hospice monitoring.', rating: 4.9 },
  { id: 3, name: 'Arthur Jenkins', email: 'arthur@care.com', experience: '3 years', certification: 'HHA', license: 'HHA-334120', location: 'Austin, TX', status: 'pending', bio: 'Experienced Home Health Aide specializing in daily assistance, meal planning, and mobility care.', rating: 4.7 },
  { id: 4, name: 'Elena Rodriguez', email: 'elena@care.com', experience: '12 years', certification: 'LPN', license: 'LPN-556123', location: 'Miami, FL', status: 'pending', bio: 'Licensed Practical Nurse experienced in managing chronic conditions, medication administration, and palliative care.', rating: 5.0 }
];

const CaregiverApprovalV2 = () => {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [recentAction, setRecentAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDecision = (id, name, decision) => {
    setApplicants(applicants.map(a => {
      if (a.id === id) {
        return { ...a, status: decision };
      }
      return a;
    }));

    setRecentAction({ name, decision });
    setTimeout(() => {
      setApplicants(prev => prev.filter(a => a.id !== id));
      setRecentAction(null);
    }, 2000);
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
        {applicants.length === 0 ? (
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
