import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Comments({ issueId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
    fetchComments();
  }, [issueId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/issues/${issueId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Erreur récupération commentaires :", err);
    }
  };

  const addComment = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Vous devez être connecté pour commenter.");

    try {
      await axios.post(
        `http://localhost:3001/api/issues/${issueId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([{ content, name: 'Vous', created_at: new Date().toISOString() }, ...comments]);
      setContent('');
    } catch (err) {
      console.error("Erreur ajout commentaire :", err);
      alert("Erreur lors de l'ajout du commentaire.");
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <h4>Commentaires</h4>
      {isAuthenticated ? (
        <>
          <input
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Ajouter un commentaire"
          />
          <button onClick={addComment}>Envoyer</button>
        </>
      ) : (
        <p>Connectez-vous pour commenter.</p>
      )}

      {comments.map((c, i) => (
        <div key={i}>
          <p><b>{c.name}</b>: {c.content}</p>
          <small>{new Date(c.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
