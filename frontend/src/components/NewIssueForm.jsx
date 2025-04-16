import React, { useState } from 'react';
import axios from 'axios';

const NewIssueForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photo: null,
    latitude: '',
    longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (err) => {
          setError("Erreur de géolocalisation: " + err.message);
        }
      );
    } else {
      setError("La géolocalisation n'est pas prise en charge par votre navigateur");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Vous devez être connecté pour signaler un problème");

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('latitude', formData.latitude);
      data.append('longitude', formData.longitude);
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      await axios.post('http://localhost:3001/api/issues', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setFormData({
        title: '',
        description: '',
        photo: null,
        latitude: '',
        longitude: ''
      });
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      onSuccess();
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      setError(err.response?.data?.error || err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-issue-form">
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Titre</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="photo">Photo</label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          required
        />
      </div>
      
      <div className="form-group location-group">
        <div>
          <label htmlFor="latitude">Latitude</label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="longitude">Longitude</label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="button" onClick={handleLocationClick} className="location-btn">
          Utiliser ma position
        </button>
      </div>
      
      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Envoi en cours...' : 'Signaler le problème'}
      </button>
    </form>
  );
};

export default NewIssueForm;