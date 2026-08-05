/**
 * Health Data Mapper Layer
 * 
 * Transforms raw database/API records into normalized UI models with proper formatting,
 * null-coalescing, condition tagging, and graceful fallbacks.
 */

import { INITIAL_HEALTH_LOG_STATE } from '../types/healthLog';

/**
 * Formats ISO timestamp to human-friendly display
 * @param {string|Date} iso 
 * @returns {string}
 */
export const formatHealthLogDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  if (diffDays === 0 && d.getDate() === now.getDate()) {
    return `Today, ${timeStr}`;
  }
  if (diffDays <= 1) {
    return `Yesterday, ${timeStr}`;
  }
  
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${timeStr}`;
};

/**
 * Normalizes condition to standardized status key for styling ('stable' | 'needs-attention' | 'critical')
 * @param {string} condition 
 * @returns {'stable'|'needs-attention'|'critical'}
 */
export const normalizeConditionStatus = (condition) => {
  const cond = (condition || '').toLowerCase().trim();
  if (cond.includes('critical') || cond.includes('emergency') || cond.includes('poor')) {
    return 'critical';
  }
  if (cond.includes('attention') || cond.includes('warning') || cond.includes('concern') || cond.includes('fair')) {
    return 'needs-attention';
  }
  return 'stable';
};

/**
 * Formats medication status and notes from database fields
 * @param {number|boolean|string|null} medsTaken 
 * @param {string|null} medsNotes 
 * @param {string|null} legacyStatus
 * @returns {{ status: string, notes: string|null, display: string }}
 */
export const formatMedicationData = (medsTaken, medsNotes, legacyStatus) => {
  if (legacyStatus && legacyStatus !== 'N/A') {
    return {
      status: legacyStatus,
      notes: medsNotes || null,
      display: legacyStatus,
    };
  }

  if (medsTaken === 1 || medsTaken === true || medsTaken === '1' || medsTaken === 'true') {
    return {
      status: 'Taken',
      notes: medsNotes || null,
      display: medsNotes ? `Taken (${medsNotes})` : 'Administered on schedule',
    };
  }
  
  if (medsTaken === 0 || medsTaken === false || medsTaken === '0' || medsTaken === 'false') {
    return {
      status: 'Missed / Refused',
      notes: medsNotes || null,
      display: medsNotes ? `Missed: ${medsNotes}` : 'Not Administered / Refused',
    };
  }

  return {
    status: '—',
    notes: medsNotes || null,
    display: medsNotes || 'No medication record',
  };
};

/**
 * Formats meal statuses into a concise summary
 * @param {string} breakfast 
 * @param {string} lunch 
 * @param {string} dinner 
 * @returns {string}
 */
export const formatMealsSummary = (breakfast, lunch, dinner) => {
  const b = breakfast || 'Pending';
  const l = lunch || 'Pending';
  const d = dinner || 'Pending';
  
  if (b === 'Pending' && l === 'Pending' && d === 'Pending') {
    return 'Pending logs';
  }
  return `B: ${b} · L: ${l} · D: ${d}`;
};

/**
 * Master mapping function: Converts raw API payload to rich UI model
 * @param {Object} raw 
 * @returns {typeof INITIAL_HEALTH_LOG_STATE}
 */
export const mapHealthLogToUIModel = (raw) => {
  if (!raw) return { ...INITIAL_HEALTH_LOG_STATE };

  const conditionBadge = normalizeConditionStatus(raw.overall_condition || raw.flag);
  const formattedDate = formatHealthLogDate(raw.logged_at);
  const medData = formatMedicationData(raw.meds_taken, raw.meds_notes, raw.medication_status);
  
  const breakfast = raw.breakfast_status || 'Pending';
  const lunch = raw.lunch_status || 'Pending';
  const dinner = raw.dinner_status || 'Pending';
  const mealsSummary = formatMealsSummary(breakfast, lunch, dinner);

  const clinicalNotes = raw.clinical_notes || raw.notes || 'No clinical notes recorded.';
  const generalNotes = raw.notes || '';

  return {
    id: raw.id,
    parentId: raw.parent_id || null,
    elderName: raw.elder_name || raw.parentName || 'Resident',
    elderAge: raw.elder_age || null,
    elderGender: raw.elder_gender || null,
    elderRoom: raw.elder_room || null,
    elderCareStatus: raw.elder_care_status || raw.overall_condition || 'STABLE',
    medicalConditions: raw.medical_conditions || null,
    allergies: raw.allergies || null,
    caregiverName: raw.caregiver_name || raw.caregiver || 'Caregiver',
    caregiverEmail: raw.caregiver_email || null,
    
    // Core Vitals
    bloodPressure: raw.blood_pressure || null,
    heartRate: raw.heart_rate !== null && raw.heart_rate !== undefined ? Number(raw.heart_rate) : null,
    temperature: raw.temperature !== null && raw.temperature !== undefined ? Number(raw.temperature) : null,
    
    // Extended Metrics
    medsTaken: raw.meds_taken,
    medsNotes: raw.meds_notes || null,
    medicationStatus: medData.status,
    medicationDisplay: medData.display,
    
    breakfastStatus: breakfast,
    lunchStatus: lunch,
    dinnerStatus: dinner,
    mealsSummary,
    
    mood: raw.mood || null,
    clinicalNotes,
    generalNotes,
    overallCondition: raw.overall_condition || 'STABLE',
    conditionBadge,
    attachmentUrl: raw.attachment_url || null,
    loggedAt: raw.logged_at || null,
    formattedDate,
  };
};
