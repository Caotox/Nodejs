const express = require('express');
const db = require('../models/db');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Middleware spécifique aux admins
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  next();
}

// Récupérer tous les utilisateurs
router.get('/users', auth, isAdmin, async (req, res) => {
  const [users] = await db.execute('SELECT id, name, email, role FROM users');
  res.json(users);
});

// Supprimer un utilisateur (et ses commentaires)
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  const userId = req.params.id;

  // Supprimer les commentaires de l'utilisateur d'abord
  await db.execute('DELETE FROM comments WHERE user_id = ?', [userId]);

  // Puis supprimer l'utilisateur
  await db.execute('DELETE FROM users WHERE id = ?', [userId]);

  res.json({ message: 'User and associated comments deleted' });
});

// Récupérer tous les commentaires
router.get('/comments', auth, isAdmin, async (req, res) => {
  const [comments] = await db.execute(`
    SELECT comments.id, comments.content, comments.created_at, users.name 
    FROM comments 
    JOIN users ON comments.user_id = users.id
    ORDER BY comments.created_at DESC
  `);
  res.json(comments);
});

// Supprimer un commentaire
router.delete('/comments/:id', auth, isAdmin, async (req, res) => {
  const commentId = req.params.id;
  await db.execute('DELETE FROM comments WHERE id = ?', [commentId]);
  res.json({ message: 'Comment deleted' });
});

module.exports = router;