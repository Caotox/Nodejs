import React, { useState } from 'react';
import axios from 'axios';

function NewIssueForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const body = {
        title,
        description,
        photo,
        latitude,
        longitude
      };

      const res = await axios.post('/api/issues', body, config);
      console.log('Issue created:', res.data.issue);

      setTitle('');
      setDescription('');
      setPhoto('');
      setLatitude('');
      setLongitude('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Signaler un problème</h3>
      <div>
        <label>Titre</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>URL Photo (optionnel)</label>
        <input
          value={photo}
          onChange={e => setPhoto(e.target.value)}
        />
      </div>
      <div>
        <label>Latitude</label>
        <input
          type="number"
          step="any"
          value={latitude}
          onChange={e => setLatitude(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Longitude</label>
        <input
          type="number"
          step="any"
          value={longitude}
          onChange={e => setLongitude(e.target.value)}
          required
        />
      </div>
      <button type="submit">Enregistrer</button>
    </form>
  );
}

export default NewIssueForm;
