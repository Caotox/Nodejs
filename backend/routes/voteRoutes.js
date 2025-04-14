//Modif Titouan

const express = require('express');
const router = express.Router();
const { Vote, Issue } = require('../models');
const auth = require('../middleware/authMiddleware');

router.post('/:id/vote', auth, async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Problème introuvable' });
    
    if (issue.status !== 'open') {
      return res.status(403).json({ error: 'Les votes sont clos pour ce problème' });
    }

    const [vote, created] = await Vote.findOrCreate({
      where: {
        UserId: req.user.id,
        IssueId: req.params.id
      }
    });

    if (!created) return res.status(403).json({ error: 'Vous avez déjà voté' });

    await issue.increment('votes');
    res.json({ votes: issue.votes + 1 });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});