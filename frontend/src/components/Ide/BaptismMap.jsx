import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function createPinIcon(color, labelText = '') {
  return L.divIcon({
    className: 'ide-leaflet-pin-wrap',
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2.5px solid #ffffff;box-shadow:0 3px 10px rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;">
        <div style="width:8px;height:8px;border-radius:50%;background:#ffffff;transform:rotate(45deg);"></div>
      </div>
      ${labelText ? `<span style="margin-top:2px;background:rgba(11,13,20,0.88);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:6px;white-space:nowrap;border:1px solid rgba(255,255,255,0.2);">${labelText}</span>` : ''}
    </div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export default function BaptismMap({ churches = [], selectedChurch, userCoords, onSelectChurch }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const center = selectedChurch
      ? [selectedChurch.lat, selectedChurch.lon]
      : [-23.7042, -46.7628];

    const map = L.map(containerRef.current, {
      center,
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    setTimeout(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (userCoords?.lat != null && userCoords?.lon != null) {
      L.marker([userCoords.lat, userCoords.lon], {
        icon: createPinIcon('#2563eb', 'Você'),
      })
        .bindPopup('<strong>Sua localização</strong>')
        .addTo(layer);
    }

    churches.forEach((ch) => {
      if (ch.lat == null || ch.lon == null) return;
      const color = ch.isMarcoZero ? '#d97706' : ch.isAdventist ? '#059669' : '#e11d48';
      const marker = L.marker([ch.lat, ch.lon], {
        icon: createPinIcon(color, ch.isMarcoZero ? 'Marco Zero' : ''),
      }).addTo(layer);

      const distText = ch.distanceKm != null ? `<br/><small>Distância: ${ch.distanceKm.toFixed(1)} km</small>` : '';
      marker.bindPopup(
        `<div style="min-width:170px;color:#111827;">
          <strong>${ch.name}</strong><br/>
          <small>${ch.address}</small>${distText}
        </div>`
      );
      marker.on('click', () => {
        if (onSelectChurch) onSelectChurch(ch);
      });

      if (selectedChurch && selectedChurch.id === ch.id) {
        marker.openPopup();
      }
    });
  }, [churches, selectedChurch, userCoords, onSelectChurch]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedChurch) return;
    map.setView([selectedChurch.lat, selectedChurch.lon], 14, { animate: true });
  }, [selectedChurch]);

  return (
    <div
      ref={containerRef}
      className="ide-leaflet-map"
      style={{ width: '100%', height: '340px', borderRadius: '14px', overflow: 'hidden', zIndex: 1 }}
    />
  );
}
