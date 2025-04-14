import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/auth/signup', { email, password, name, role });
      alert('Inscription OK');
    } catch (err) {
      alert('Erreur lors de l\'inscription');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      <input placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="user">Utilisateur</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">S'inscrire</button>
    </form>
  );
}
