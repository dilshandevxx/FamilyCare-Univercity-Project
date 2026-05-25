import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import './CaregiverApproval.css';

const mockPending = [
  { id: 1, name: 'Elena Rossi',    specialty: 'Registered Nurse (RN)',  exp: '8 years',  applied: '2 hours ago' },
  { id: 2, name: 'David Kim',      specialty: 'Physical Therapist',     exp: '5 years',  applied: '5 hours ago' },
  { id: 3, name: 'Amara Johnson',  specialty: 'Home Health Aide',       exp: '3 years',  applied: 'Yesterday' },
  { id: 4, name: 'Luis Morales',   specialty: 'Certified Nursing Asst', exp: '6 years',  applied: 'Yesterday' },
  { id: 5, name: 'Priya Sharma',   specialty: 'Geriatric Specialist',   exp: '11 years', applied: '2 days ago' },
  { id: 6, name: 'Fatima Al-Saud', specialty: 'Registered Nurse (RN)',  exp: '4 years',  applied: '3 days ago' },
  { id: 7, name: 'Chris Nguyen',   specialty: 'Home Health Aide',       exp: '2 years',  applied: '3 days ago' },
  { id: 8, name: 'Sophie Laurent', specialty: 'Physical Therapist',     exp: '7 years',  applied: '4 days ago' },
];

const CaregiverApproval = () => {
  const [items, setItems] = useState(mockPending);

  const approve = id => setItems(prev => prev.filter(c => c.id !== id));
  const reject  = id => setItems(prev => prev.filter(c => c.id !== id));

  return (
    <AdminLayout title="Caregiver Approval">
      <div className="ca-page">
        <div className="ca-header">
          <div>
            <h1 className="ca-title">Caregiver Approval</h1>
            <p className="ca-subtitle">Review and approve pending caregiver applications.</p>
          </div>
          <div className="ca-pending-count">
            <Clock size={15} />
            {items.length} Pending
          </div>
        </div>

        {items.length === 0 ? (
          <div className="ca-empty">
            <CheckCircle size={48} color="#14b8a6" />
            <p>All applications reviewed. No pending approvals.</p>
          </div>
        ) : (
          <div className="ca-grid">
            {items.map(c => (
              <div key={c.id} className="ca-card">
                <div className="ca-card-top">
                  <div className="ca-avatar">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.name)}`}
                      alt={c.name}
                    />
                  </div>
                  <div className="ca-info">
                    <p className="ca-name">{c.name}</p>
                    <p className="ca-specialty">{c.specialty}</p>
                    <p className="ca-exp">{c.exp} experience</p>
                  </div>
                </div>
                <div className="ca-meta">
                  <Clock size={12} /> Applied {c.applied}
                </div>
                <div className="ca-actions">
                  <button className="ca-btn reject" onClick={() => reject(c.id)}>
                    <XCircle size={14} /> Reject
                  </button>
                  <button className="ca-btn view">
                    <FileText size={14} /> View Docs
                  </button>
                  <button className="ca-btn approve" onClick={() => approve(c.id)}>
                    <CheckCircle size={14} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CaregiverApproval;
