import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ issues }) => {
  return (
    <MapContainer
      center={[48.8566, 2.3522]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {issues.map((issue) => (
        <Marker
          key={issue.id}
          position={[issue.latitude, issue.longitude]}
        >
          <Popup>
            <strong>{issue.title}</strong><br />
            <img src={issue.thumbnail} alt="thumb" width="100" />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
