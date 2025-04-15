import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapView from './MapView';
import NewIssueForm from './NewIssueForm';
import Comments from '../components/Comments';
//import './IssuePage.css';

const IssuesPage = ({ socket }) => {
  const [issues, setIssues] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      const res = await axios.get('http://localhost:3001/api/issues');
      setIssues(res.data);
    } catch (err) {
      console.error('Erreur de chargement des issues :', err);
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

      <div className="issues-list">
        {issues.map(issue => (
          <div className="issue-card" key={issue.id}>
            <h3>{issue.title}</h3>
            <img src={`http://localhost:3001${issue.thumbnail}`} width="200" />
            <p>{issue.description}</p>
            <p><strong>Votes :</strong> {issue.upvotes || 0}</p>
            <button onClick={() => handleUpvote(issue.id)}>👍 Voter</button>
            <Comments issueId={issue.id} />
          </div>
        ))}
      </div>

      <h2>Carte des problèmes</h2>
      <MapView issues={issues} />
    </div>
  );
};

export default IssuesPage;
