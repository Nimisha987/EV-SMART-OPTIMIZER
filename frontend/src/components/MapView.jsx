import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapView({ chargingStation }) {
  return (
    <MapContainer
      center={[chargingStation.lat, chargingStation.lng]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[chargingStation.lat, chargingStation.lng]}>
        <Popup>⚡ {chargingStation.name}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapView;