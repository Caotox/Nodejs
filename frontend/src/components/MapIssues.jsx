// frontend/src/pages/MapIssues.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapIssues = ({ socket }) => {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/issues');
      setIssues(res.data);
    } catch (err) {
      console.error("Erreur de chargement des issues :", err.message);
    }
  };

  useEffect(() => {
    fetchIssues();

    if (socket) {
      socket.on('issue:new', (newIssue) => {
        setIssues(prev => [...prev, newIssue]);
      });
    }

    return () => {
      if (socket) socket.off('issue:new');
    };
  }, [socket]);

  const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div>
      <h2>Carte des signalements</h2>
      <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {issues.map(issue => (
          <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={defaultIcon}
          >
            <Popup>
  <strong>{issue.title}</strong><br />
  {issue.resolved && <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Résolue</span>}<br />
  <img src={`http://localhost:3001${issue.thumbnail}`} width="200" /><br />
  {issue.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapIssues;
