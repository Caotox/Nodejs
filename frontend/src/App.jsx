import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Comments from './components/Comments';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div>
      <nav>
        <Link to="/login">Login</Link> | 
        <Link to="/signup">Signup</Link> | 
        <Link to="/issues/1/comments">Voir commentaires</Link> | 
        <button onClick={handleLogout}>Déconnexion</button>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/issues/:id/comments" element={<Comments />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}
export default App;
