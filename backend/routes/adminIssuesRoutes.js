const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/roleMiddleware');
const db = require('../models/db'); // à adapter si ton fichier est ailleurs

// Obtenir toutes les issues
router.get('/', authenticate, checkAdmin, (req, res) => {
  db.query('SELECT * FROM issues', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(results);
  });
});

// Supprimer une issue
router.delete('/:id', authenticate, checkAdmin, (req, res) => {
  const issueId = req.params.id;
  db.query('DELETE FROM issues WHERE id = ?', [issueId], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la suppression' });
    res.json({ message: 'Issue supprimée' });
  });
});

// Marquer comme résolue
router.patch('/:id/resolve', authenticate, checkAdmin, (req, res) => {
  const issueId = req.params.id;
  db.query('UPDATE issues SET resolved = 1 WHERE id = ?', [issueId], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    res.json({ message: 'Issue marquée comme résolue' });
  });
});

module.exports = router;
