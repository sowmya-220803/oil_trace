import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Navigation, Clock, Eye, Layers } from 'lucide-react';

// Custom Leaflet Vessel Marker Icons
const createVesselIcon = (riskLevel, isTopSuspect) => {
  let color = '#3b82f6'; // Blue
  if (riskLevel === 'CRITICAL') color = '#ef4444'; // Red
  else if (riskLevel === 'HIGH') color = '#f97316'; // Orange
  else if (riskLevel === 'MEDIUM') color = '#eab308'; // Yellow

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 19 21 12 17 5 21 12 2"/>
    </svg>
  `;

  return L.divAnchor ? L.divIcon({
    className: 'custom-vessel-marker',
    html: `<div style="filter: drop-shadow(0 0 6px ${color}); transition: transform 0.2s;">${svg}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  }) : L.divIcon({
    className: 'custom-vessel-marker',
    html: `<div style="filter: drop-shadow(0 0 6px ${color});">${svg}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

// Component to dynamically fit bounds of spill & trajectories
const MapBoundsAdjuster = ({ centerLat, centerLon }) => {
  const map = useMap();
  React.useEffect(() => {
    if (centerLat && centerLon) {
      map.setView([centerLat, centerLon], 11);
    }
  }, [centerLat, centerLon, map]);
  return null;
};

export const InteractiveMap = ({ height = "520px" }) => {
  const { sarData, aisData, correlationData, setSelectedVessel, setSelectedTab } = useApp();

  const [showSlicks, setShowSlicks] = useState(true);
  const [showTracks, setShowTracks] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);

  const centerLat = sarData?.detection_summary?.center_coordinates?.lat || 53.2500;
  const centerLon = sarData?.detection_summary?.center_coordinates?.lon || 3.4500;

  const spills = sarData?.spills || [];
  const vesselRankings = correlationData?.spill_correlations?.[0]?.rankings || [];

  return (
    <div style={{ position: 'relative', height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Layer Toggle Floating Controls */}
      <div style={{
        position: 'absolute',
        top: '14px',
        right: '14px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontWeight: '600' }}>
          <Layers size={14} color="#38bdf8" /> Layers:
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#cbd5e1', cursor: 'pointer' }}>
          <input type="checkbox" checked={showSlicks} onChange={e => setShowSlicks(e.target.checked)} />
          <span style={{ color: '#ef4444', fontWeight: '600' }}>Slick Masks</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#cbd5e1', cursor: 'pointer' }}>
          <input type="checkbox" checked={showTracks} onChange={e => setShowTracks(e.target.checked)} />
          <span>Vessel Tracks</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#cbd5e1', cursor: 'pointer' }}>
          <input type="checkbox" checked={showMarkers} onChange={e => setShowMarkers(e.target.checked)} />
          <span>Vessel Icons</span>
        </label>
      </div>

      <MapContainer
        center={[centerLat, centerLon]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapBoundsAdjuster centerLat={centerLat} centerLon={centerLon} />

        {/* CartoDB Dark Matter Base Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Render Oil Spill Polygons */}
        {showSlicks && spills.map((spill, idx) => {
          const coords = spill.polygon_geojson?.coordinates?.[0] || [];
          const leafletCoords = coords.map(pt => [pt[1], pt[0]]);

          return (
            <React.Fragment key={spill.spill_id || idx}>
              <Polygon
                positions={leafletCoords}
                pathOptions={{
                  color: '#ef4444',
                  fillColor: '#dc2626',
                  fillOpacity: 0.45,
                  weight: 3,
                  dashArray: '4, 4'
                }}
              >
                <Popup>
                  <div style={{ minWidth: '180px' }}>
                    <div style={{ color: '#ef4444', fontWeight: '800', fontSize: '13px', marginBottom: '4px' }}>
                      🚨 {spill.spill_id}
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                      <strong>Estimated Area:</strong> {spill.area_km2} km²<br />
                      <strong>Perimeter:</strong> {spill.perimeter_km} km<br />
                      <strong>Confidence:</strong> {(spill.confidence_score * 100).toFixed(0)}%<br />
                      <strong>Spill Time:</strong> {spill.estimated_spill_time}
                    </div>
                  </div>
                </Popup>
              </Polygon>

              {/* Spill Centroid Circle */}
              <CircleMarker
                center={[spill.centroid_lat, spill.centroid_lon]}
                radius={6}
                pathOptions={{ color: '#ffffff', fillColor: '#ef4444', fillOpacity: 1, weight: 2 }}
              />
            </React.Fragment>
          );
        })}

        {/* Render Ranked Vessels & Trajectories */}
        {vesselRankings.map((vessel) => {
          const riskLevel = vessel.risk_level;
          let trackColor = '#3b82f6';
          if (riskLevel === 'CRITICAL') trackColor = '#ef4444';
          else if (riskLevel === 'HIGH') trackColor = '#f97316';
          else if (riskLevel === 'MEDIUM') trackColor = '#eab308';

          const trajectory = vessel.trajectory || [];
          const positions = trajectory.map(pt => [pt.lat, pt.lon]);

          // Closest approach point
          const closest = vessel.closest_approach;

          return (
            <React.Fragment key={vessel.mmsi}>
              {/* Trajectory Polyline */}
              {showTracks && positions.length > 1 && (
                <Polyline
                  positions={positions}
                  pathOptions={{
                    color: trackColor,
                    weight: riskLevel === 'CRITICAL' ? 4 : 2,
                    opacity: 0.85,
                    dashArray: riskLevel === 'CRITICAL' ? null : '6, 6'
                  }}
                />
              )}

              {/* Closest Point of Approach Pulse Marker */}
              {closest && (
                <CircleMarker
                  center={[closest.lat, closest.lon]}
                  radius={vessel.rank === 1 ? 7 : 4}
                  pathOptions={{
                    color: trackColor,
                    fillColor: trackColor,
                    fillOpacity: 0.9,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div style={{ fontSize: '12px' }}>
                      <strong style={{ color: trackColor }}>Closest Point of Approach</strong><br />
                      Distance: {vessel.min_distance_km} km<br />
                      Timestamp: {closest.timestamp}<br />
                      Speed: {closest.sog} knots
                    </div>
                  </Popup>
                </CircleMarker>
              )}

              {/* Vessel End Position Marker */}
              {showMarkers && positions.length > 0 && (
                <Marker
                  position={positions[positions.length - 1]}
                  icon={createVesselIcon(riskLevel, vessel.rank === 1)}
                >
                  <Popup>
                    <div style={{ width: '220px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '800', color: '#38bdf8', fontSize: '13px' }}>
                          {vessel.vessel_name}
                        </span>
                        <span className={`badge badge-${riskLevel.toLowerCase()}`}>
                          {riskLevel} ({vessel.correlation_score}%)
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '8px' }}>
                        <strong>MMSI:</strong> {vessel.mmsi} | <strong>IMO:</strong> {vessel.imo}<br />
                        <strong>Type:</strong> {vessel.vessel_type}<br />
                        <strong>Min Distance to Slick:</strong> {vessel.min_distance_km} km<br />
                        <strong>Time Offset:</strong> {vessel.time_delta_mins} mins
                      </div>

                      <button
                        onClick={() => setSelectedVessel(vessel)}
                        className="glass-button-secondary"
                        style={{ width: '100%', padding: '4px 8px', fontSize: '11px', justifyContent: 'center' }}
                      >
                        <Eye size={12} /> View Full Suspect Dossier
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
