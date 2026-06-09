const pool = require('../config/db');

// GET /api/messages/contacts
// Returns users this caregiver/child can message, enriched with last-message + unread count
const getContacts = async (req, res) => {
  const userId   = req.user.id;
  const userRole = req.user.role;

  try {
    let contacts = [];

    if (userRole === 'caregiver') {
      // Family members (child users) whose elders are assigned to this caregiver
      const [rows] = await pool.query(
        `SELECT DISTINCT u.id, u.name, u.email, u.role,
                p.name AS elder_name, p.id AS elder_id
         FROM users u
         JOIN parents p    ON p.child_id = u.id
         JOIN caregivers c ON p.assigned_caregiver_id = c.id
         WHERE c.user_id = ?`,
        [userId]
      );
      contacts = rows;
    } else if (userRole === 'child') {
      // Caregivers assigned to my elders
      const [rows] = await pool.query(
        `SELECT DISTINCT u.id, u.name, u.email, u.role,
                p.name AS elder_name, p.id AS elder_id
         FROM users u
         JOIN caregivers c ON c.user_id = u.id
         JOIN parents p    ON p.assigned_caregiver_id = c.id
         WHERE p.child_id = ?`,
        [userId]
      );
      contacts = rows;
    } else {
      // Admin: everyone except self
      const [rows] = await pool.query(
        `SELECT id, name, email, role,
                NULL AS elder_name, NULL AS elder_id
         FROM users WHERE id != ?`,
        [userId]
      );
      contacts = rows;
    }

    // Deduplicate: same user may appear once per elder assignment
    const seenIds = new Map();
    contacts.forEach((c) => { if (!seenIds.has(c.id)) seenIds.set(c.id, c); });
    contacts = Array.from(seenIds.values());

    // If no structured contacts, fall back to anyone this user has messaged
    if (contacts.length === 0) {
      const [rows] = await pool.query(
        `SELECT DISTINCT u.id, u.name, u.email, u.role,
                NULL AS elder_name, NULL AS elder_id
         FROM users u
         JOIN messages m
           ON (m.sender_id = u.id   AND m.receiver_id = ?)
           OR (m.receiver_id = u.id AND m.sender_id   = ?)
         WHERE u.id != ?`,
        [userId, userId, userId]
      );
      contacts = rows;
    }

    // Enrich each contact with last message preview and unread count
    const enriched = await Promise.all(
      contacts.map(async (contact) => {
        const [lastMsg] = await pool.query(
          `SELECT message, created_at, sender_id
           FROM messages
           WHERE (sender_id = ? AND receiver_id = ?)
              OR (sender_id = ? AND receiver_id = ?)
           ORDER BY created_at DESC LIMIT 1`,
          [userId, contact.id, contact.id, userId]
        );

        let unreadCnt = 0;
        try {
          const [unread] = await pool.query(
            `SELECT COUNT(*) AS cnt FROM messages
             WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE`,
            [contact.id, userId]
          );
          unreadCnt = Number(unread[0].cnt);
        } catch (_) { /* is_read column may not exist yet — migration pending */ }

        return {
          ...contact,
          lastMessage:  lastMsg[0] || null,
          unreadCount:  unreadCnt,
        };
      })
    );

    // Sort: conversations with messages first, then by recency
    enriched.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at);
    });

    res.json(enriched);
  } catch (err) {
    console.error('getContacts error:', err);
    res.status(500).json({ error: err.message });
  }
};

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
      id:          result.insertId,
      sender_id,
      receiver_id: Number(receiver_id),
      message,
      is_read:     false,
      created_at:  new Date().toISOString(),
    });
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/messages/:otherUserId
// Retrieve chat history and mark received messages as read
const getMessages = async (req, res) => {
  const myId    = req.user.id;
  const otherId = req.params.otherUserId;

  try {
    // Mark incoming messages as read (safe — ignore if column missing)
    try {
      await pool.query(
        `UPDATE messages SET is_read = TRUE
         WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE`,
        [otherId, myId]
      );
    } catch (_) {}

    const [rows] = await pool.query(
      `SELECT * FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [myId, otherId, otherId, myId]
    );

    res.json(rows);
  } catch (err) {
    console.error('getMessages error:', err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/messages/:otherUserId/read
// Explicitly mark all messages from otherUser as read
const markAsRead = async (req, res) => {
  const myId    = req.user.id;
  const otherId = req.params.otherUserId;

  try {
    try {
      await pool.query(
        `UPDATE messages SET is_read = TRUE
         WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE`,
        [otherId, myId]
      );
    } catch (_) {}
    res.json({ success: true });
  } catch (err) {
    console.error('markAsRead error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/messages/all-users
// Returns every user except the caller — used for the "New Message" composer
const getAllUsers = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, role FROM users WHERE id != ? ORDER BY name ASC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('getAllUsers error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/messages/elder-sidebar/:elderId
// Returns today's appointments + health-log attachments for the sidebar
const getElderSidebar = async (req, res) => {
  const elderId = req.params.elderId;
  try {
    const [[elder]] = await pool.query(
      `SELECT id, name, age, gender, medical_conditions FROM parents WHERE id = ?`,
      [elderId]
    );
    if (!elder) return res.status(404).json({ error: 'Elder not found' });

    const [documents] = await pool.query(
      `SELECT id, attachment_url, notes, logged_at
       FROM health_logs
       WHERE parent_id = ? AND attachment_url IS NOT NULL AND attachment_url != ''
       ORDER BY logged_at DESC LIMIT 5`,
      [elderId]
    );

    res.json({ elder, documents });
  } catch (err) {
    console.error('getElderSidebar error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getContacts, getAllUsers, sendMessage, getMessages, markAsRead, getElderSidebar };
