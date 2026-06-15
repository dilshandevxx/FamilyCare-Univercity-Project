import React, { useState, useEffect } from 'react';
import { Settings, Shield, Mail, Heart, Save, CheckCircle, Loader2 } from 'lucide-react';
import AdminLayoutV2 from '../../../layouts/AdminLayoutV2/AdminLayoutV2';
import api from '../../../services/api';
import './AdminSettingsV2.css';

const toBool = (v) => v === true || v === 'true';

const AdminSettingsV2 = () => {
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [tfaRequired, setTfaRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [hrThreshold, setHrThreshold] = useState(100);
  const [tempThreshold, setTempThreshold] = useState(100.4);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/admin/settings');
        if (data.twoFactor !== undefined) setTfaRequired(toBool(data.twoFactor));
        if (data.sessionTimeout !== undefined) setSessionTimeout(data.sessionTimeout);
        if (data.hrThreshold !== undefined) setHrThreshold(Number(data.hrThreshold));
        if (data.tempThreshold !== undefined) setTempThreshold(Number(data.tempThreshold));
      } catch (error) {
        console.log('Failed to fetch settings, using defaults');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', {
        twoFactor: String(tfaRequired),
        sessionTimeout: String(sessionTimeout),
        hrThreshold: String(hrThreshold),
        tempThreshold: String(tempThreshold)
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2500);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayoutV2 title="System Settings Console">
        <div className="settings-v2-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Loader2 className="animate-spin" size={40} color="#00A896" />
        </div>
      </AdminLayoutV2>
    );
  }

  return (
    <AdminLayoutV2 title="System Settings Console">
      <div className="settings-v2-container">
        
        {showToast && (
          <div className="settings-v2-toast">
            <CheckCircle size={16} />
            <span>System configuration preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="settings-v2-form-layout">
          
          {/* Section 1: Security Controls */}
          <div className="settings-v2-card">
            <div className="settings-v2-card-header">
              <Shield size={18} color="#00A896" />
              <h4>Global Access & Security Controls</h4>
            </div>
            <div className="settings-v2-card-body">
              <div className="form-toggle-group">
                <div>
                  <h5>Enforce Two-Factor Authentication (2FA)</h5>
                  <p>Require all administrators and caregivers to use 2FA OTP codes on login.</p>
                </div>
                <label className="switch-toggle">
                  <input 
                    type="checkbox" 
                    checked={tfaRequired}
                    onChange={e => setTfaRequired(e.target.checked)}
                  />
                  <span className="slider-round" />
                </label>
              </div>

              <div className="form-input-group">
                <label>Admin Session Timeout Duration (Minutes)</label>
                <select 
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(e.target.value)}
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">60 Minutes</option>
                  <option value="120">120 Minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Vitals Warning Thresholds */}
          <div className="settings-v2-card">
            <div className="settings-v2-card-header">
              <Heart size={18} color="#EF4444" />
              <h4>Automatic Vitals Warning Thresholds</h4>
            </div>
            <div className="settings-v2-card-body">
              <p className="section-intro-text">Configure the vital ranges that automatically trigger system warnings and push notifications to family member accounts.</p>
              
              <div className="form-range-group">
                <div className="range-labels">
                  <label>Critical Heart Rate Trigger Limit</label>
                  <span className="range-val">{hrThreshold} bpm</span>
                </div>
                <input 
                  type="range" 
                  min="80" 
                  max="140" 
                  value={hrThreshold}
                  onChange={e => setHrThreshold(Number(e.target.value))}
                  className="v2-range-slider"
                />
              </div>

              <div className="form-range-group">
                <div className="range-labels">
                  <label>Critical Body Temperature Trigger Limit</label>
                  <span className="range-val">{tempThreshold} °F</span>
                </div>
                <input 
                  type="range" 
                  min="99.0" 
                  max="103.0" 
                  step="0.1"
                  value={tempThreshold}
                  onChange={e => setTempThreshold(Number(e.target.value))}
                  className="v2-range-slider"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="settings-v2-footer">
            <button type="submit" className="settings-v2-save-btn" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Config Settings'}
            </button>
          </div>

        </form>

      </div>
    </AdminLayoutV2>
  );
};

export default AdminSettingsV2;
