const express = require('express');
const db = require('../models/db');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// ------ Titouan ---------

router.patch('/issues/:id/resolve', authMiddleware, async (req, res) => {
  try {
      if (req.user.role !== 'admin') return res.status(403).send('Accès refusé');
      
      // Récupérer l'issue avec l'email de l'auteur
      const [issue] = await pool.query(`
          SELECT i.*, u.email 
          FROM issues i
          JOIN users u ON i.createdBy = u.id
          WHERE i.id = ?
      `, [req.params.id]);

      if (!issue.length) return res.status(404).send('Problème non trouvé');

      // Mettre à jour le statut
      await pool.query(
          'UPDATE issues SET status = ? WHERE id = ?',
          ['resolved', req.params.id]
      );

      // Envoi de notification
      const msg = {
          to: issue[0].email,
          from: process.env.ADMIN_EMAIL,
          subject: 'Votre problème a été résolu',
          text: `Le problème "${issue[0].title}" a été marqué comme résolu.`
      };
      await sgMail.send(msg);

      res.send({ message: 'Problème résolu avec succès' });
  } catch (error) {
      res.status(500).send(error.message);
  }
});

// Voter pour un problème
router.post('/issues/:id/vote', authMiddleware, async (req, res) => {
  try {
      // Vérifier le vote existant
      const [existingVote] = await pool.query(
          'SELECT * FROM votes WHERE userId = ? AND issueId = ?',
          [req.user.id, req.params.id]
      );
      
      if (existingVote.length > 0) return res.status(403).send('Vous avez déjà voté');
      
      // Enregistrer le vote
      await pool.query(
          'INSERT INTO votes (userId, issueId) VALUES (?, ?)',
          [req.user.id, req.params.id]
      );
      
      res.send({ message: 'Vote enregistré' });
  } catch (error) {
      res.status(500).send(error.message);
  }
});

// Liste admin
router.get('/admin/issues', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Accès refusé');
  
  try {
      const [issues] = await pool.query(`
          SELECT 
              i.*, 
              COUNT(v.id) AS votes,
              u.name AS author
          FROM issues i
          LEFT JOIN votes v ON v.issueId = i.id
          JOIN users u ON i.createdBy = u.id
          WHERE i.status = 'open'
          GROUP BY i.id
          ORDER BY i.createdAt DESC
      `);
      
      res.send(issues);
  } catch (error) {
      res.status(500).send(error.message);
  }
});


// -------------------------------------------


module.exports = router;
