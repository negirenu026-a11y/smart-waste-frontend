import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={icon}></Marker>
    );
}

export default function MapComponent({ onLocationSelect }) {
    const [position, setPosition] = useState(null);

    const handlePositionChange = (newPosition) => {
        setPosition(newPosition);
        if (onLocationSelect) {
            onLocationSelect(newPosition);
        }
    };

    return (
        <MapContainer
            center={[28.6139, 77.2090]}
            zoom={13}
            style={{ height: '100%', minHeight: '400px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            <LocationMarker position={position} setPosition={handlePositionChange} />
        </MapContainer>
    );
}
