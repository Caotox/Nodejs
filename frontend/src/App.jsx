import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Comments from './components/Comments';
import React from 'react';
import NewIssueForm from './NewIssueForm';
import IssuesPage from './IssuesPage';
import MapView from './MapView';

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert("Déconnecté !");
    navigate("/login");
  };

  return (
    <div>
      <nav>
        <Link to="/login">Login</Link> | 
        <Link to="/signup">Signup</Link> | 
        <Link to="/issues/1/comments">Voir commentaires</Link> | 
        {token && <button onClick={handleLogout}>Déconnexion</button>}
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/issues/:id/comments" element={<Comments />} />
      </Routes>
    </div>
  );
}

export default App;
