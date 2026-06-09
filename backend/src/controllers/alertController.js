const pool = require('../config/db');

// GET /api/alerts
// Retrieve alerts scoped to the logged-in child's parents
const getAlerts = async (req, res) => {
  const { parent_id, type } = req.query;
  const child_id = req.user.id;

  try {
    let query = `
      SELECT a.*, p.name AS parent_name, p.relationship AS relation
      FROM alerts a
      JOIN parents p ON a.parent_id = p.id
      WHERE p.child_id = ?
    `;
    const params = [child_id];

    if (parent_id && parent_id !== 'All') {
      query += ' AND a.parent_id = ?';
      params.push(parent_id);
    }
    if (type && type !== 'All') {
      query += ' AND a.type = ?';
      params.push(type.toLowerCase());
    }

    query += ' ORDER BY a.created_at DESC';

    const [rows] = await pool.query(query, params);

    // If database is empty, seed mock alerts matching the mockup UI design
    let alerts = rows;
    if (alerts.length === 0) {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      alerts = [
        {
          id: 'mock-alert-1',
          parent_id: parent_id || 1,
          parent_name: 'Eleanor',
          relation: 'Mother',
          title: 'Critical Heart Rate Spike',
          description: 'Resting heart rate detected at 118 BPM. This is 30% above her normal threshold. Action is required immediately.',
          type: 'critical',
          is_resolved: false,
          created_at: new Date(today.setHours(10, 42, 0, 0)).toISOString()
        },
        {
          id: 'mock-alert-2',
          parent_id: parent_id || 2,
          parent_name: 'Robert',
          relation: 'Father',
          title: 'Missed Morning Medication',
          description: 'The smart dispenser reported that the 8:00 AM slot for Metformin has not been opened.',
          type: 'warning',
          is_resolved: false,
          created_at: new Date(today.setHours(8, 15, 0, 0)).toISOString()
        },
        {
          id: 'mock-alert-3',
          parent_id: parent_id || 1,
          parent_name: 'Eleanor',
          relation: 'Mother',
          title: 'Sleep Quality Drop',
          description: 'Deep sleep was 15 minutes lower than average last night. Eleanor may feel more fatigued today.',
          type: 'info',
          is_resolved: false,
          created_at: new Date(yesterday.setHours(7, 0, 0, 0)).toISOString()
        }
      ];

      // Perform local filtering on mock items to match request
      if (type && type !== 'All') {
        alerts = alerts.filter(a => a.type === type.toLowerCase());
      }
    }

    res.json(alerts);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/alerts/:id/resolve
// Mark alert as resolved
const resolveAlert = async (req, res) => {
  const { id } = req.params;

  try {
    // If it's a mock alert, simulate resolution success
    if (String(id).startsWith('mock-')) {
      return res.json({ message: 'Mock alert marked as resolved' });
    }

    const [result] = await pool.query(
      'UPDATE alerts SET is_resolved = 1 WHERE id = ?',
      [id]
    );

    res.json({ message: 'Alert resolved successfully' });
  } catch (err) {
    console.error('Error resolving alert:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/alerts/:id
// Permanently dismiss/delete an alert (only if it belongs to child's parent)
const deleteAlert = async (req, res) => {
  const { id } = req.params;
  const child_id = req.user.id;

  try {
    if (String(id).startsWith('mock-')) {
      return res.json({ message: 'Mock alert dismissed' });
    }

    // Only delete if the alert belongs to a parent owned by this child
    const [result] = await pool.query(
      `DELETE a FROM alerts a
       JOIN parents p ON a.parent_id = p.id
       WHERE a.id = ? AND p.child_id = ?`,
      [id, child_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Alert not found or access denied' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (err) {
    console.error('Error deleting alert:', err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/alerts
// Create a new alert for a parent (child manually logs an alert)
const createAlert = async (req, res) => {
  const { parent_id, title, description, type } = req.body;
  const child_id = req.user.id;

  if (!parent_id || !title || !description) {
    return res.status(400).json({ error: 'parent_id, title, and description are required' });
  }

  try {
    // Verify the parent belongs to this child
    const [[parent]] = await pool.query(
      'SELECT id FROM parents WHERE id = ? AND child_id = ?',
      [parent_id, child_id]
    );

    if (!parent) {
      return res.status(403).json({ error: 'Access denied: parent not found' });
    }

    const [result] = await pool.query(
      'INSERT INTO alerts (parent_id, title, description, type) VALUES (?, ?, ?, ?)',
      [parent_id, title, description, type || 'info']
    );

    res.status(201).json({ id: result.insertId, message: 'Alert created successfully' });
  } catch (err) {
    console.error('Error creating alert:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAlerts,
  resolveAlert,
  deleteAlert,
  createAlert,
};
