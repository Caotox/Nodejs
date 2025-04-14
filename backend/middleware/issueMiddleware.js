//Modif Titouan
exports.checkIssueStatus = async (req, res, next) => {
    const issue = await Issue.findByPk(req.params.id);
    
    if (issue?.status !== 'open') {
      return res.status(403).json({ 
        error: 'Cette action est impossible sur un problème résolu' 
      });
    }
    
    next();
  };
  
  // Utilisation dans les routes :
  router.post('/:id/vote', auth, checkIssueStatus, ...);