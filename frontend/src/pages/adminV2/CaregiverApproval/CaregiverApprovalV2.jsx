import React, { useState } from 'react';
import { ShieldCheck, UserCheck, ShieldX, Check, AlertCircle, FileText } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import './CaregiverApprovalV2.css';

const initialApplicants = [
  { id: 1, name: 'Clara Oswald', email: 'clara@care.com', experience: '5 years', certification: 'CNA', license: 'CNA-778945', status: 'pending', bio: 'Compassionate nurse specialized in elder care, stroke recovery assistance, and cognitive therapies.' },
  { id: 2, name: 'Ravi Kumar', email: 'ravi@care.com', experience: '8 years', certification: 'RN', license: 'RN-901124', status: 'pending', bio: 'Certified Registered Nurse with over 8 years experience in hospital ICU settings and home hospice monitoring.' },
  { id: 3, name: 'Arthur Jenkins', email: 'arthur@care.com', experience: '3 years', certification: 'HHA', license: 'HHA-334120', status: 'pending', bio: 'Experienced Home Health Aide specializing in daily assistance, meal planning, and mobility care.' }
];

const CaregiverApprovalV2 = () => {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [recentAction, setRecentAction] = useState(null);

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
    }, 1500);
  };

  return (
    <AdminLayoutV2 title="Caregiver Verification">
      <div className="approval-v2-container">
        
        {recentAction && (
          <div className={`approval-v2-action-banner banner-${recentAction.decision}`}>
            <Check size={16} />
            <span>Caregiver <strong>{recentAction.name}</strong> has been successfully {recentAction.decision === 'approved' ? 'Approved & Activated' : 'Rejected'}.</span>
          </div>
        )}

        {applicants.length === 0 ? (
          <div className="approval-v2-empty-state">
            <ShieldCheck size={48} color="#00A896" />
            <h3>All Caught Up!</h3>
            <p>There are no pending caregiver applications awaiting administrative review.</p>
          </div>
        ) : (
          <div className="approval-v2-applicants-grid">
            {applicants.map(a => (
              <div key={a.id} className={`approval-v2-card status-${a.status}`}>
                <div className="approval-v2-card-header">
                  <div className="approval-v2-profile-avatar">
                    {a.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="approval-v2-applicant-name">{a.name}</h3>
                    <p className="approval-v2-applicant-email">{a.email}</p>
                  </div>
                </div>

                <div className="approval-v2-credentials">
                  <div className="credential-row">
                    <span className="label">Certification:</span>
                    <span className="value-badge">{a.certification}</span>
                  </div>
                  <div className="credential-row">
                    <span className="label">Experience:</span>
                    <span className="value">{a.experience}</span>
                  </div>
                  <div className="credential-row">
                    <span className="label">License Number:</span>
                    <span className="value font-mono">{a.license}</span>
                  </div>
                </div>

                <div className="approval-v2-bio">
                  <p>{a.bio}</p>
                </div>

                {a.status === 'pending' ? (
                  <div className="approval-v2-actions">
                    <button 
                      className="reject-btn"
                      onClick={() => handleDecision(a.id, a.name, 'rejected')}
                    >
                      <ShieldX size={15} />
                      Reject
                    </button>
                    <button 
                      className="approve-btn"
                      onClick={() => handleDecision(a.id, a.name, 'approved')}
                    >
                      <UserCheck size={15} />
                      Approve & Verify
                    </button>
                  </div>
                ) : (
                  <div className={`approval-v2-decision-status is-${a.status}`}>
                    {a.status === 'approved' ? 'APPROVED' : 'REJECTED'}
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
