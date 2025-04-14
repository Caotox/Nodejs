//Modif Titouan
import { Issue } from '../models/Issue.js';

export const checkIssueStatus = async (req, res, next) => {
    try {
        const issue = await Issue.findByPk(req.params.id);
        
        if (!issue) {
            return res.status(404).json({ 
                error: 'Problème introuvable' 
            });
        }

        if (issue.status !== 'open') {
            return res.status(403).json({ 
                error: 'Cette action est impossible sur un problème résolu' 
            });
        }
        
        req.issue = issue; // Stocke l'instance dans la requête pour réutilisation
        next();
    } catch (error) {
        console.error('Erreur checkIssueStatus:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};