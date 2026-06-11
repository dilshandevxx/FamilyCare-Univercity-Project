import React, { useState } from 'react';
import { ShieldCheck, UserCheck, ShieldX, Check, AlertCircle, FileText, Award, Clock, Hash, MapPin, Users, Search } from 'lucide-react';
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
    a.certification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayoutV2 title="Caregiver Verification">
      <div className="approval-v2-container">
        
        {/* Header and Stats */}
        <div className="approval-v2-header">
          <div className="approval-v2-header-content">
            <h2>Caregiver Approvals</h2>
            <p>Review and verify caregiver applications before they can join the platform.</p>
          </div>
          
          <div className="approval-v2-stats">
            <div className="approval-v2-stat-card">
              <div className="stat-icon pending">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <h4>Pending</h4>
                <p className="stat-value">{applicants.filter(a => a.status === 'pending').length}</p>
              </div>
            </div>
            <div className="approval-v2-stat-card">
              <div className="stat-icon approved">
                <ShieldCheck size={24} />
              </div>
              <div className="stat-info">
                <h4>Verified</h4>
                <p className="stat-value">124</p>
              </div>
            </div>
          </div>
        </div>

        {recentAction && (
          <div className={`approval-v2-action-banner banner-${recentAction.decision}`}>
            {recentAction.decision === 'approved' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
            <span>Caregiver <strong>{recentAction.name}</strong> has been successfully {recentAction.decision === 'approved' ? 'Approved & Activated' : 'Rejected'}.</span>
          </div>
        )}

        {applicants.length === 0 ? (
          <div className="approval-v2-empty-state">
            <div className="approval-v2-empty-icon">
              <ShieldCheck size={48} />
            </div>
            <h3>All Caught Up!</h3>
            <p>There are no pending caregiver applications awaiting administrative review at this time.</p>
          </div>
        ) : (
          <div className="approval-v2-applicants-grid">
            {filteredApplicants.map(a => (
              <div key={a.id} className={`approval-v2-card status-${a.status}`}>
                <div className="approval-v2-card-header">
                  <div className="approval-v2-profile-avatar">
                    {a.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="approval-v2-applicant-info">
                    <h3 className="approval-v2-applicant-name">{a.name}</h3>
                    <p className="approval-v2-applicant-email">
                      {a.email}
                    </p>
                    <p className="approval-v2-applicant-location">
                      <MapPin size={12} /> {a.location}
                    </p>
                  </div>
                </div>

                <div className="approval-v2-credentials">
                  <div className="credential-item">
                    <div className="credential-icon"><Award size={16} /></div>
                    <div className="credential-details">
                      <span className="label">Certification</span>
                      <span className="value">{a.certification}</span>
                    </div>
                  </div>
                  <div className="credential-item">
                    <div className="credential-icon"><Clock size={16} /></div>
                    <div className="credential-details">
                      <span className="label">Experience</span>
                      <span className="value">{a.experience}</span>
                    </div>
                  </div>
                  <div className="credential-item full-width">
                    <div className="credential-icon"><Hash size={16} /></div>
                    <div className="credential-details">
                      <span className="label">License Number</span>
                      <span className="value font-mono">{a.license}</span>
                    </div>
                  </div>
                </div>

                <div className="approval-v2-bio">
                  <p>"{a.bio}"</p>
                </div>

                {a.status === 'pending' ? (
                  <div className="approval-v2-actions">
                    <button 
                      className="reject-btn"
                      onClick={() => handleDecision(a.id, a.name, 'rejected')}
                    >
                      <ShieldX size={18} />
                      Reject
                    </button>
                    <button 
                      className="approve-btn"
                      onClick={() => handleDecision(a.id, a.name, 'approved')}
                    >
                      <UserCheck size={18} />
                      Approve & Verify
                    </button>
                  </div>
                ) : (
                  <div className={`approval-v2-decision-status is-${a.status}`}>
                    {a.status === 'approved' ? (
                      <><Check size={18} /> APPROVED</>
                    ) : (
                      <><ShieldX size={18} /> REJECTED</>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayoutV2>
  );
};

export default CaregiverApprovalV2;
