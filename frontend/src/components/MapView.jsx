import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapView({ issues }) {
  const center = [48.8566, 2.3522];
  const zoom = 12;

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {issues.map((issue) => {
        const { id, title, description, latitude, longitude } = issue;
        return (
          <Marker key={id} position={[latitude, longitude]}>
            <Popup>
              <h3>{title}</h3>
              <p>{description}</p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapView;
