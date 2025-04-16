import React, { useState } from 'react';
import axios from 'axios';

const NewIssueForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhoto = (e) => {
    setForm({ ...form, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3001/api/issues', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Problème signalé avec succès !');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Erreur lors de la création du problème.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Titre" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
      <input type="file" accept="image/*" onChange={handlePhoto} required />
      <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude" required />
      <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude" required />
      <button type="submit">Signaler</button>
    </form>
  );
};

export default NewIssueForm;
