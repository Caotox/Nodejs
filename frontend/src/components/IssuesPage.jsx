import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapView from './MapView';
import NewIssueForm from './NewIssueForm';
import Comments from '../components/Comments';

const IssuesPage = ({ socket }) => {
  const [issues, setIssues] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
    fetchIssues();
    if (socket) {
      socket.on('issue:new', (newIssue) => {
        setIssues((prev) => [...prev, newIssue]);
      });
    }
    return () => socket?.off('issue:new');
  }, [socket]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3001/api/issues');
      const issuesData = Array.isArray(res.data) ? res.data : [];
      setIssues(issuesData);
      setError(null);
    } catch (err) {
      console.error('Erreur de chargement des issues :', err);
      setError("Erreur lors du chargement des problèmes");
      setIssues([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Connectez-vous pour voter.");
    try {
      await axios.post(`http://localhost:3001/api/issues/${id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchIssues();
    } catch (err) {
      console.error("Erreur d'upvote :", err);
    }
  };

  return (
    <div className="issues-page">
      <h2>Signaler un problème</h2>
      {isAuthenticated ? <NewIssueForm onSuccess={fetchIssues} /> : <p>Connectez-vous pour signaler un problème.</p>}
      
      {loading ? (
        <div>Chargement en cours...</div>
      ) : error ? (
        <div className="error-section">
          <div className="error">{error}</div>
          <p>Vous pouvez toujours soumettre un nouveau problème ci-dessus.</p>
        </div>
      ) : (
        <div className="issues-list">
          <h2>Problèmes signalés</h2>
          {issues.length > 0 ? (
            issues.map(issue => (
              <div className="issue-card" key={issue.id}>
                <h3>{issue.title}</h3>
                {issue.thumbnail && (
                  <img
                    src={`http://localhost:3001${issue.thumbnail}`}
                    width="200"
                    alt={`Illustration de ${issue.title}`}
                  />
                )}
                <p>{issue.description}</p>
                <p><strong>Votes :</strong> {issue.upvotes || 0}</p>
                <button onClick={() => handleUpvote(issue.id)}>👍 Voter</button>
                <Comments issueId={issue.id} />
              </div>
            ))
          ) : (
            <p>Aucun problème signalé pour le moment</p>
          )}
        </div>
      )}
      
      <h2>Carte des problèmes</h2>
      <MapView issues={issues} />
    </div>
  );
};

export default IssuesPage;