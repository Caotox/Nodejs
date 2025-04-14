const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { authMiddleware } = require('../middleware/auth');


router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, photo, latitude, longitude } = req.body;

    if (!title || !description || !latitude || !longitude) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    // Création via Sequelize
    const newIssue = await Issue.create({
      title,
      description,
      photo,
      latitude,
      longitude,
      createdBy: req.user.id // depuis ton token
    });

    // Émettre l’event WS si besoin
    // io.emit('issue:new', newIssue);

    return res.status(201).json({
      message: 'Signalement créé avec succès',
      issue: newIssue
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;

router.get('/', async (req, res) => {
    try {
      // On peut filtrer par status, etc.
      const { status } = req.query;
      const where = {};
  
      if (status) {
        where.status = status;
      }
  
      const issues = await Issue.findAll({ where }); 
      return res.status(200).json(issues);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  });


  router.get('/', async (req, res) => {
    const { status, sort } = req.query;
    const order = [];
  
    if (sort === 'votes') order.push(['votes', 'DESC']);
    if (sort === 'date') order.push(['createdAt', 'DESC']);
  
    const issues = await Issue.findAll({
      where: { status: status || 'open' },
      order
    });
    
    res.json(issues);
  });