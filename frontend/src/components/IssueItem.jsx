import { useNavigate } from 'react-router-dom';

export default function IssueItem({ issue }) {
  const navigate = useNavigate();
  
  return (
    <div 
      style={{ 
        opacity: issue.status === 'resolved' ? 0.6 : 1,
        cursor: 'pointer'
      }}
      onClick={() => navigate(`/issues/${issue.id}`)}
    >
      <h3>{issue.title} {issue.status === 'resolved' && '(Résolu)'}</h3>
      <p>Votes: {issue.votes}</p>
      <p>Créé le: {new Date(issue.createdAt).toLocaleDateString()}</p>
    </div>
  );
}