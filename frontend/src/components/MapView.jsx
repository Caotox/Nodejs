import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapView = ({ issues }) => {
  const icon = L.icon({ iconUrl: '/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] });

  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {issues.map((issue) => (
        <Marker key={issue.id} position={[issue.latitude, issue.longitude]} icon={icon}>
          <Popup>
            <strong>{issue.title}</strong>
            <br />
            <img src={issue.thumbnail} alt="thumb" width="100" />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;