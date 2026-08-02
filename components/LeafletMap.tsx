'use client';

import { useEffect, useRef } from 'react';

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

/**
 * Interactive Leaflet/OpenStreetMap component.
 * Must be dynamically imported with { ssr: false } — Leaflet requires browser APIs.
 */
export default function LeafletMap({ latitude, longitude, zoom = 13 }: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef  = useRef<import('leaflet').Map | null>(null);
  const markerRef       = useRef<import('leaflet').Marker | null>(null);

  // Initialize map on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Dynamically require leaflet (safe in 'use client' context)
    const L = require('leaflet') as typeof import('leaflet');

    // Fix default marker icon paths broken by webpack
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([latitude, longitude])
      .bindPopup(`<b>Monitoring Station</b><br/>${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
      .addTo(map);

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Update marker and view when coordinates change
  useEffect(() => {
    const map    = mapInstanceRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    const latlng: [number, number] = [latitude, longitude];
    map.setView(latlng, map.getZoom(), { animate: true });
    marker.setLatLng(latlng);
    marker.setPopupContent(
      `<b>Monitoring Station</b><br/>${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
    );
  }, [latitude, longitude]);

  return (
    <>
      {/* Leaflet CSS — loaded once in this component */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <div
        ref={mapContainerRef}
        className="w-full h-72 rounded-xl overflow-hidden z-0"
        aria-label={`Map showing monitoring station at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
      />
    </>
  );
}
