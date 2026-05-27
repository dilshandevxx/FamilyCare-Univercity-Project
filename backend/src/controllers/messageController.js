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

module.exports = {
  sendMessage,
  getMessages
};
