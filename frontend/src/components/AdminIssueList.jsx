//Modif Titouan

// frontend/src/components/AdminIssueList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminIssueList() {
  const [issues, setIssues] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const res = await axios.get('http://localhost:3001/issues?status=open', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setIssues(res.data);
  };

  const resolveIssue = async (id) => {
    if (window.confirm('Marquer ce problème comme résolu ?')) {
      await axios.patch(`http://localhost:3001/admin/issues/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchIssues();
      alert('Problème marqué comme résolu !');
    }
  };

  return (
    <div>
      <h2>Problèmes ouverts</h2>
      {issues.map(issue => (
        <div key={issue.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <h3>{issue.title}</h3>
          <p>{issue.description}</p>
          <p>Votes: {issue.votes}</p>
          <button onClick={() => resolveIssue(issue.id)}>
            Marquer comme résolu
          </button>
        </div>
      ))}
    </div>
  );
}



//Modif Titouan
const [sortBy, setSortBy] = useState('date');

const fetchIssues = async () => {
  const res = await axios.get(`http://localhost:3001/issues?sort=${sortBy}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  setIssues(res.data);
};

// Dans le JSX
<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
  <option value="date">Trier par date</option>
  <option value="votes">Trier par votes</option>
</select>


useEffect(() => {
    const socket = io('http://localhost:3001');
    
    socket.on('issue:resolved', (issueId) => {
      setIssues(prev => prev.filter(issue => issue.id !== issueId));
    });
  
    return () => socket.disconnect();
  }, []);