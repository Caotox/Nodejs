// ------------------- Titouan ------------------

const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');
const emailService = require('../utils/emailService');

// Résoudre un problème
router.patch('/issues/:id/resolve', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }

  try {
    const [issue] = await db.query(
      'SELECT * FROM issues WHERE id = ?',
      [req.params.id]
    );

    if (!issue.length) {
      return res.status(404).json({ message: 'Problème non trouvé' });
    }

    await db.query(
      'UPDATE issues SET status = "resolved" WHERE id = ?',
      [req.params.id]
    );

    // Envoi de notification
    const [user] = await db.query(
      'SELECT email FROM users WHERE id = ?',
      [issue[0].user_id]
    );
    
    if (user.length) {
      await emailService.sendResolutionEmail(
        user[0].email,
        issue[0].title,
        issue[0].id
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Récupérer tous les problèmes pour l'admin
router.get('/issues', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }

  try {
    const [issues] = await db.query(`
      SELECT issues.*, users.username 
      FROM issues
      JOIN users ON issues.user_id = users.id
      ORDER BY created_at DESC
    `);
    res.status(200).json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

module.exports = router;


// ------------------------------
















/*
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
*/