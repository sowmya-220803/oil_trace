import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, Polyline, Circle, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { Layers } from 'lucide-react';

// Custom Marker Icons
const createVesselIcon = (color = '#38bdf8', isSelected = false) => {
  return L.divIcon({
    className: 'custom-vessel-marker',
    html: `
      <div style="
        background: ${color};
        width: ${isSelected ? '24px' : '18px'};
        height: ${isSelected ? '24px' : '18px'};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 ${isSelected ? '16px' : '8px'} ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [isSelected ? 24 : 18, isSelected ? 24 : 18],
    iconAnchor: [isSelected ? 12 : 9, isSelected ? 12 : 9]
  });
};

const getSpillCenter = (spill) => {
  if (Array.isArray(spill?.centroid) && spill.centroid.length >= 2) {
    return [spill.centroid[0], spill.centroid[1]];
  }
  if (spill?.centroid_lat !== undefined && spill?.centroid_lon !== undefined) {
    return [spill.centroid_lat, spill.centroid_lon];
  }
  if (spill?.latitude !== undefined && spill?.longitude !== undefined) {
    return [spill.latitude, spill.longitude];
  }
  return [28.4521, -89.1234];
};

export const InteractiveMap = ({ height = '500px', focusedVesselMmsi = null }) => {
  const { sarData, aisData, correlationData, selectedVessel, setSelectedVessel, theme } = useApp();
  const [layers, setLayers] = useState({
    spillPolygon: true,
    spillCentroid: true,
    vesselPositions: true,
    vesselTrajectories: true,
    correlationLines: true,
    analysisRadius: true,
    satelliteFootprint: true
  });

  const spills = sarData?.spills || [];
  const vessels = aisData?.vessels || [];
  const primarySpill = spills[0];
  const center = getSpillCenter(primarySpill);

  // Generate Spill Polygon points around centroid safely
  const spillPolygonCoords = spills.map(spill => {
    const [cLat, cLon] = getSpillCenter(spill);
    if (spill?.polygon_geojson?.coordinates?.[0]?.length > 0) {
      return spill.polygon_geojson.coordinates[0].map(pt => [pt[1], pt[0]]);
    }
    return [
      [cLat + 0.025, cLon - 0.045],
      [cLat + 0.040, cLon - 0.010],
      [cLat + 0.030, cLon + 0.035],
      [cLat - 0.015, cLon + 0.050],
      [cLat - 0.035, cLon + 0.015],
      [cLat - 0.020, cLon - 0.040]
    ];
  });

  // Satellite Footprint Box
  const satelliteFootprint = [
    [center[0] + 0.20, center[1] - 0.25],
    [center[0] + 0.20, center[1] + 0.25],
    [center[0] - 0.20, center[1] + 0.25],
    [center[0] - 0.20, center[1] - 0.25]
  ];

  const getVesselRiskColor = (mmsi) => {
    const ranking = correlationData?.rankings?.find(r => r.mmsi === mmsi);
    if (!ranking) return '#38bdf8';
    if (ranking.total_score >= 70) return '#ef4444'; // Red
    if (ranking.total_score >= 50) return '#f59e0b'; // Amber
    return '#38bdf8'; // Cyan
  };

  return (
    <div style={{ position: 'relative', height, width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      {/* Map Control Bar Overlay */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 1000,
        background: 'var(--bg-surface)',
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        fontSize: '11px',
        boxShadow: 'var(--shadow-main)'
      }}>
        <div style={{ fontWeight: '700', marginBottom: '6px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={14} />
          <span>GIS LAYERS</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {Object.keys(layers).map(layerKey => (
            <label key={layerKey} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={layers[layerKey]}
                onChange={() => setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }))}
              />
              <span style={{ textTransform: 'capitalize' }}>{layerKey.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Map Component */}
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={theme === 'dark' 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        {/* Satellite Footprint Layer */}
        {layers.satelliteFootprint && (
          <Polygon
            positions={satelliteFootprint}
            pathOptions={{ color: '#38bdf8', weight: 1, dashArray: '6, 6', fillColor: '#38bdf8', fillOpacity: 0.03 }}
          />
        )}

        {/* 25 km Analysis Radius Layer */}
        {layers.analysisRadius && (
          <Circle
            center={center}
            radius={25000} // 25 km
            pathOptions={{ color: '#6366f1', weight: 1, dashArray: '4, 4', fillColor: '#6366f1', fillOpacity: 0.05 }}
          />
        )}

        {/* Detected Oil Spill Polygon Layer */}
        {layers.spillPolygon && spillPolygonCoords.map((poly, idx) => (
          <Polygon
            key={idx}
            positions={poly}
            pathOptions={{ color: '#ef4444', weight: 2.5, fillColor: '#dc2626', fillOpacity: 0.45 }}
          >
            <Popup>
              <div style={{ padding: '4px' }}>
                <div style={{ fontWeight: '800', color: '#ef4444', marginBottom: '4px' }}>
                  DETECTED OIL SLICK MASK
                </div>
                <div style={{ fontSize: '12px' }}>Area: {spills[idx]?.estimated_area_km2 ?? spills[idx]?.area_km2 ?? 63.54} km²</div>
                <div style={{ fontSize: '12px' }}>Confidence: {(((spills[idx]?.confidence_score ?? 0.942)) * 100).toFixed(1)}%</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                  Detection Time: {spills[idx]?.detection_time || spills[idx]?.estimated_spill_time || "10:49:00 UTC"}
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Spill Centroid Layer */}
        {layers.spillCentroid && spills.map((spill, idx) => (
          <CircleMarker
            key={idx}
            center={getSpillCenter(spill)}
            radius={8}
            pathOptions={{ color: '#ffffff', fillColor: '#ef4444', fillOpacity: 1, weight: 2 }}
          />
        ))}

        {/* AIS Vessel Trajectories & Position Markers */}
        {vessels.map(vessel => {
          const mmsi = vessel.mmsi;
          const isSelected = selectedVessel?.mmsi === mmsi || focusedVesselMmsi === mmsi;
          const vesselColor = getVesselRiskColor(mmsi);
          const trajPoints = vessel.trajectory?.map(pt => [pt.lat, pt.lon]) || [];
          const vesselLat = vessel.latitude ?? vessel.lat ?? center[0];
          const vesselLon = vessel.longitude ?? vessel.lon ?? center[1];

          return (
            <React.Fragment key={mmsi}>
              {/* Trajectory Polyline */}
              {layers.vesselTrajectories && trajPoints.length > 1 && (
                <Polyline
                  positions={trajPoints}
                  pathOptions={{
                    color: vesselColor,
                    weight: isSelected ? 4 : 2,
                    dashArray: isSelected ? undefined : '5, 5',
                    opacity: isSelected ? 1 : 0.6
                  }}
                />
              )}

              {/* Correlation Vector to Spill Centroid */}
              {layers.correlationLines && isSelected && (
                <Polyline
                  positions={[ [vesselLat, vesselLon], center ]}
                  pathOptions={{ color: '#ef4444', weight: 2, dashArray: '4, 4', opacity: 0.9 }}
                />
              )}

              {/* Vessel Position Marker */}
              {layers.vesselPositions && (
                <Marker
                  position={[vesselLat, vesselLon]}
                  icon={createVesselIcon(vesselColor, isSelected)}
                  eventHandlers={{
                    click: () => setSelectedVessel(correlationData?.rankings?.find(r => r.mmsi === mmsi) || vessel)
                  }}
                >
                  <Popup>
                    <div style={{ padding: '4px' }}>
                      <div style={{ fontWeight: '800', fontSize: '14px', color: vesselColor }}>
                        {vessel.vessel_name || vessel.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>MMSI: {vessel.mmsi} | Type: {vessel.type || vessel.vessel_type}</div>
                      <div style={{ fontSize: '12px', marginTop: '6px' }}>Speed: {vessel.speed} kts | Course: {vessel.course}°</div>
                      {correlationData?.rankings?.find(r => r.mmsi === mmsi) && (
                        <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700' }}>Correlation Score:</span>
                          <span style={{ fontSize: '13px', fontWeight: '900', color: vesselColor }}>
                            {correlationData.rankings.find(r => r.mmsi === mmsi).total_score}%
                          </span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        zIndex: 1000,
        background: 'var(--bg-surface)',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        fontSize: '11px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        boxShadow: 'var(--shadow-main)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', background: '#dc2626', opacity: 0.7, borderRadius: '2px' }} />
          <span>Oil Spill Mask</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%' }} />
          <span>High Risk Candidate</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '50%' }} />
          <span>Medium Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', background: '#38bdf8', borderRadius: '50%' }} />
          <span>Low Risk / AIS Traffic</span>
        </div>
      </div>
    </div>
  );
};
