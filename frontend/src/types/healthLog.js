/**
 * Health Log Data Interfaces and Type Definitions
 * 
 * Synchronized with MySQL database schema (tables: health_logs, parents, users)
 * and backend API endpoint payloads (/api/admin/health-logs and /api/admin/health-logs/:id).
 */

/**
 * @typedef {Object} BackendHealthLogPayload
 * @property {number} id - Unique health log identifier
 * @property {number} [parent_id] - Associated resident / elder ID
 * @property {string} [elder_name] - Name of the elder resident
 * @property {number|null} [elder_age] - Elder age
 * @property {string|null} [elder_gender] - Elder gender
 * @property {string|null} [elder_room] - Elder room number
 * @property {string|null} [elder_care_status] - Current care status ('STABLE' | 'NEEDS ATTENTION' | 'CRITICAL')
 * @property {string|null} [medical_conditions] - Known medical conditions
 * @property {string|null} [allergies] - Known allergies
 * @property {string} [caregiver_name] - Name of caregiver who recorded log
 * @property {string|null} [caregiver_email] - Caregiver email
 * @property {string|null} [blood_pressure] - Blood pressure reading (e.g., "120/80 mmHg")
 * @property {number|null} [heart_rate] - Heart rate in beats per minute (e.g., 72)
 * @property {number|string|null} [temperature] - Body temperature in °F (e.g., 98.6)
 * @property {number|boolean|null} [meds_taken] - Medication administration status (1 = true, 0 = false, null = unrecorded)
 * @property {string|null} [meds_notes] - Details/notes on medications taken or missed
 * @property {string|null} [clinical_notes] - Professional caregiver clinical observation notes
 * @property {string|null} [notes] - General log notes
 * @property {string|null} [mood] - Elder mood/behavior (e.g., 'Cheerful', 'Calm', 'Agitated')
 * @property {'STABLE'|'NEEDS ATTENTION'|'CRITICAL'|string|null} [overall_condition] - Clinical severity rating
 * @property {'Completed'|'Skipped'|'Pending'|string|null} [breakfast_status] - Breakfast meal status
 * @property {'Completed'|'Skipped'|'Pending'|string|null} [lunch_status] - Lunch meal status
 * @property {'Completed'|'Skipped'|'Pending'|string|null} [dinner_status] - Dinner meal status
 * @property {string|null} [attachment_url] - Optional uploaded file attachment URL
 * @property {string} logged_at - ISO 8601 creation timestamp
 */

/**
 * Standard default empty model for health log modal state
 */
export const INITIAL_HEALTH_LOG_STATE = Object.freeze({
  id: null,
  parentId: null,
  elderName: '—',
  elderAge: null,
  elderGender: null,
  elderRoom: null,
  elderCareStatus: null,
  medicalConditions: null,
  allergies: null,
  caregiverName: '—',
  caregiverEmail: null,
  bloodPressure: null,
  heartRate: null,
  temperature: null,
  medsTaken: null,
  medsNotes: null,
  medicationDisplay: '—',
  clinicalNotes: 'No clinical notes provided.',
  generalNotes: '',
  mood: '—',
  overallCondition: 'STABLE',
  conditionBadge: 'stable',
  breakfastStatus: 'Pending',
  lunchStatus: 'Pending',
  dinnerStatus: 'Pending',
  mealsSummary: '—',
  attachmentUrl: null,
  loggedAt: null,
  formattedDate: '—',
});

/**
 * Valid overall condition values in database
 */
export const HEALTH_CONDITIONS = Object.freeze({
  STABLE: 'STABLE',
  NEEDS_ATTENTION: 'NEEDS ATTENTION',
  CRITICAL: 'CRITICAL',
});

/**
 * Meal statuses supported in database ENUM
 */
export const MEAL_STATUSES = Object.freeze({
  COMPLETED: 'Completed',
  SKIPPED: 'Skipped',
  PENDING: 'Pending',
});
