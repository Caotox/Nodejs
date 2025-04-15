import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Comments from './components/Comments';
import AdminDashboard from './components/AdminDashboard';
import IssuesPage from './components/IssuesPage';
import { io } from 'socket.io-client';
import './index.css';

function App() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  useEffect(() => {
    const s = io('http://localhost:3000');
    setSocket(s);
    return () => s.disconnect();
  }, []);

  return (
    <div>
      <nav>
        <Link to="/login">Login</Link> | 
        <Link to="/signup">Signup</Link> | 
        <Link to="/issues/1/comments">Voir commentaires</Link> | 
        <Link to="/admin">Admin</Link> | 
        <button onClick={handleLogout}>Déconnexion</button>
      </nav>

      <Routes>
        <Route path="/" element={<IssuesPage socket={socket} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/issues/:id/comments" element={<Comments />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
