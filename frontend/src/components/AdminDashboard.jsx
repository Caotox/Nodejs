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
    </div>
  );
}
