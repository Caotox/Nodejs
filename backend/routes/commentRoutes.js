const express = require('express');
const db = require('../models/db');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Ajouter un commentaire (protégé par authMiddleware)
router.post('/:id/comments', auth, async (req, res) => {
  console.log("POST /comments -> user:", req.user);
  const { content } = req.body;
  const issueId = req.params.id;
  const userId = req.user.id;
  if (!content) return res.status(400).json({ error: 'Comment required' });

  await db.execute(
    'INSERT INTO comments (issue_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())',
    [issueId, userId, content]
  );
  res.status(200).json({ message: 'Comment added' });
});

// Voir les commentaires d’un problème (accessible à tous)
router.get('/:id/comments', async (req, res) => {
  const issueId = req.params.id;
  const [rows] = await db.execute(`
    SELECT comments.content, comments.created_at, users.name 
    FROM comments 
    JOIN users ON comments.user_id = users.id 
    WHERE comments.issue_id = ? 
    ORDER BY comments.created_at DESC`,
    [issueId]
  );
  res.json(rows);
});

module.exports = router;
