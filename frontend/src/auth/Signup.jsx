import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:3001/auth/signup', form);
    localStorage.setItem('token', res.data.token);
    alert('Inscription réussie');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input placeholder="name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Signup</button>
    </form>
  );
}
