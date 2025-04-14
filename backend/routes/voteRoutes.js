// ------------------- Titouan --------------------------

const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');

// Voter pour un problème
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const [existingVote] = await db.query(
      'SELECT * FROM votes WHERE user_id = ? AND issue_id = ?',
      [req.user.id, req.params.id]
    );
    
    if (existingVote.length > 0) {
      return res.status(403).json({ message: 'Vous avez déjà voté pour ce problème' });
    }

    await db.query(
      'INSERT INTO votes (user_id, issue_id) VALUES (?, ?)',
      [req.user.id, req.params.id]
    );

    await db.query(
      'UPDATE issues SET votes_count = votes_count + 1 WHERE id = ?',
      [req.params.id]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

module.exports = router;

// ---------------------------------
