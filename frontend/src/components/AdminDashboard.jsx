import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [issues, setIssues] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:3001/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));

    axios.get('http://localhost:3001/api/comments', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setComments(res.data));

    axios.get('http://localhost:3001/api/issues', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setIssues(res.data));
  };

  const deleteComment = async (id) => {
    await axios.delete(`http://localhost:3001/api/comments/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setComments(comments.filter(c => c.id !== id));
  };

  const deleteUser = async (id) => {
    if (window.confirm('Confirmer la suppression de cet utilisateur ?')) {
      await axios.delete(`http://localhost:3001/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== id));
      setComments(comments.filter(c => c.user_id !== id));
    }
  };

  const deleteIssue = async (id) => {
    if (window.confirm("Confirmer la suppression de ce signalement ?")) {
      await axios.delete(`http://localhost:3001/api/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssues(issues.filter(i => i.id !== id));
    }
  };

  const resolveIssue = async (id) => {
    await axios.put(`http://localhost:3001/issues/${id}/resolve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setIssues(issues.map(i => i.id === id ? { ...i, resolved: 1 } : i));
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

      
    </div>
  );
}
