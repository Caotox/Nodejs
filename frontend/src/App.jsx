import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Comments from './components/Comments';
import AdminDashboard from './components/AdminDashboard';
import IssuesPage from './components/IssuesPage';
import { io } from 'socket.io-client';
import './index.css';
import 'leaflet/dist/leaflet.css';
import MapIssues from './components/MapIssues'; 
import './App.css';




function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io('http://localhost:3001');
    setSocket(s);
    return () => s.disconnect();
  }, []);


  return (
    <div>
      <nav>
        <Link to="/login">Login</Link> | 
        <Link to="/signup">Signup</Link> | 
        <Link to="/admin">Admin</Link> | 
        <Link to="/Issues">Issues</Link> |
        <Link to="/map">Map</Link> |
        <button onClick={handleLogout}>Déconnexion</button>
      </nav>
      
      

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/issues/:id/comments" element={<Comments />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<IssuesPage socket={socket} />} />
        <Route path="/issues" element={<IssuesPage socket={socket} />} />
        <Route path="/map" element={<MapIssues socket={socket} />} />
      </Routes>
    </div>
  );
}

export default App;
