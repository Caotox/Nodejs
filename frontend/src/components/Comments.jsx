import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Comments() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    axios.get(`http://localhost:3001/issues/${id}/comments`)
      .then(res => setComments(res.data))
      .catch(err => console.error("Erreur récupération commentaires :", err));
  }, [id]);

  const addComment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vous devez être connecté pour commenter.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3001/issues/${id}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([{ content, name: 'Vous', created_at: new Date().toISOString() }, ...comments]);
      setContent('');
    } catch (err) {
      console.error("Erreur ajout commentaire :", err.response?.data || err);
      alert("Erreur lors de l'ajout du commentaire.");
    }
  };

  return (
    <div>
      <h2>Commentaires</h2>

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
        <p>Connectez-vous pour ajouter un commentaire.</p>
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
