//Modif Titouan

// frontend/src/components/VoteButton.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function VoteButton({ issueId, initialVotes }) {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkVote = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/issues/${issueId}/vote`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHasVoted(res.data.hasVoted);
      } catch (err) {/* Ignorer les erreurs */}
    };
    if (token) checkVote();
  }, [issueId, token]);

  const handleVote = async () => {
    try {
      await axios.post(`http://localhost:3001/issues/${issueId}/vote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVotes(v => v + 1);
      setHasVoted(true);
    } catch (err) {
      alert('Vous avez déjà voté pour ce problème');
    }
  };

  return (
    <div>
      <button onClick={handleVote} disabled={hasVoted || !token}>
        👍 {votes}
      </button>
    </div>
  );
}