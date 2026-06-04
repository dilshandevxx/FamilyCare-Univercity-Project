const pool = require('../config/db');

// POST /api/messages
// Send a message
const sendMessage = async (req, res) => {
  const { receiver_id, message } = req.body;
  const sender_id = req.user.id;

  if (!receiver_id || !message) {
    return res.status(400).json({ error: 'Receiver ID and message content are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [sender_id, receiver_id, message]
    );

    res.status(201).json({
      id: result.insertId,
      sender_id,
      receiver_id,
      message,
      message: 'Message sent successfully'
    });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/messages/:otherUserId
// Retrieve chat history between current user and another user
const getMessages = async (req, res) => {
  const sender_id = req.user.id;
  const { otherUserId } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
          OR (sender_id = ? AND receiver_id = ?) 
       ORDER BY created_at ASC`,
      [sender_id, otherUserId, otherUserId, sender_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/messages/contacts
// Retrieve unique contacts (caregivers for child, or parents for caregiver)
const getContacts = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role; // Assuming role is available on req.user

  try {
    let query = '';
    let params = [userId];

    if (role === 'child') {
      // Child's contacts are the caregivers assigned to their parents
      query = `
        SELECT DISTINCT c.id AS user_id, c.name, c.avatar_url, c.specialization AS subtitle
        FROM caregivers c
        JOIN parents p ON p.assigned_caregiver_id = c.id
        WHERE p.child_id = ?
      `;
    } else if (role === 'caregiver') {
      // Caregiver's contacts are the children (family members) of the parents they care for
      query = `
        SELECT DISTINCT u.id AS user_id, u.name, u.avatar_url, 'Family Member' AS subtitle
        FROM users u
        JOIN parents p ON p.child_id = u.id
        WHERE p.assigned_caregiver_id = ?
      `;
    } else {
      return res.status(403).json({ error: 'Invalid role for contacts' });
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getContacts
};
