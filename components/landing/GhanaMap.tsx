'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues when using Webpack/Next.js
// By deleting default icon config and relying completely on custom icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Custom animated marker using our CSS pulse animation
const createPulseIcon = () => {
  return L.divIcon({
    className: 'custom-pulse-marker',
    html: '<div class="map-marker-pulse"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });
};

const pulseIcon = createPulseIcon();

export default function GhanaMap() {
  // Center map on Ghana roughly
  const center: L.LatLngTuple = [8.0, -1.0];
  
  // Bounds for Ghana roughly
  const bounds: L.LatLngBoundsExpression = [
    [4.5, -3.5], 
    [11.5, 1.5]
  ];

  return (
    <div className="w-full h-[480px] rounded-2xl overflow-hidden border border-slate-200 relative z-0 shadow-xl shadow-slate-200/50">
      <MapContainer 
        center={center} 
        zoom={6.5} 
        scrollWheelZoom={false}
        className="w-full h-full bg-slate-50"
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        minZoom={6}
      >
        {/* Using CartoDB Positron tiles to match the light landing page theme */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Pin 1: Accra */}
        <Marker position={[5.5502, -0.2174]} icon={pulseIcon}>
          <Popup className="landing-map-popup">
            <div className="text-sm font-sans">
              <strong className="block text-slate-900 mb-1">Accra / Circle</strong>
              <span className="text-slate-600">High flood-risk urban corridor; site of the June 2015 disaster.</span>
            </div>
          </Popup>
        </Marker>

        {/* Pin 2: Akosombo / Volta */}
        <Marker position={[6.2992, 0.0571]} icon={pulseIcon}>
          <Popup className="landing-map-popup">
            <div className="text-sm font-sans">
              <strong className="block text-slate-900 mb-1">Akosombo / Volta River</strong>
              <span className="text-slate-600">Downstream communities at risk from seasonal dam overflow.</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
