import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:3001/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));

    axios.get('http://localhost:3001/admin/comments', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setComments(res.data));
  };

  const deleteComment = async (id) => {
    await axios.delete(`http://localhost:3001/admin/comments/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setComments(comments.filter(c => c.id !== id));
  };

  const deleteUser = async (id) => {
    if (window.confirm('Confirmer la suppression de cet utilisateur ?')) {
      await axios.delete(`http://localhost:3001/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== id));
      setComments(comments.filter(c => c.user_id !== id));
    }
  };

  return (
    <div>
      <h2>👤 Utilisateurs</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.name} ({u.email}) - {u.role}
            {u.role !== 'admin' && (
              <button onClick={() => deleteUser(u.id)} style={{ marginLeft: '10px' }}>
                Supprimer
              </button>
            )}
          </li>
        ))}
      </ul>

      <h2>💬 Commentaires</h2>
      <ul>
        {comments.map(c => (
          <li key={c.id}>
            <strong>{c.name}</strong>: {c.content}
            <button onClick={() => deleteComment(c.id)} style={{ marginLeft: '10px' }}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>

{ // -------------------------- Titouan ---------------

issues.map(issue => (
  <div key={issue.id} className="issue-card">
    <h3>{issue.title}</h3>
    <p>Signalé par: {issue.username}</p>
    <p>Votes: {issue.votes_count}</p>
    <button 
      onClick={() => handleResolveIssue(issue.id)}
      disabled={issue.status === 'resolved'}
    >
      {issue.status === 'resolved' ? 'Résolu' : 'Marquer comme résolu'}
    </button>
  </div>
))
 // ------------------ Fin (jusqu au div en dessous) --------------------
}
</div>

  );
}


// ----------------------------- Titouan -------------------------

const [issues, setIssues] = useState([]);

useEffect(() => {
  const fetchIssues = async () => {
    try {
      const response = await axios.get('/api/admin/issues', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIssues(response.data);
    } catch (error) {
      console.error('Erreur de récupération des problèmes:', error);
    }
  };
  fetchIssues();
}, []);

const handleResolveIssue = async (issueId) => {
  try {
    await axios.patch(`/api/admin/issues/${issueId}/resolve`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setIssues(issues.map(issue => 
      issue.id === issueId ? {...issue, status: 'resolved'} : issue
    ));
  } catch (error) {
    console.error('Erreur de résolution:', error);
  }
};

// ---------------------------------------