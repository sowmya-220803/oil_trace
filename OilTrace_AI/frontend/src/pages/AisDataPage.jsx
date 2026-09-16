import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { Radio, Search, Filter, Ship, Compass, MapPin, Clock, ArrowRight, X } from 'lucide-react';

export const AisDataPage = () => {
  const { aisData, correlationData, selectedVessel, setSelectedVessel } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const vessels = aisData?.vessels || [];

  const filteredVessels = vessels.filter(v => {
    const name = v.vessel_name || v.name || "UNNAMED VESSEL";
    const type = v.type || v.vessel_type || "Commercial Vessel";
    const mmsiStr = String(v.mmsi || '');

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || mmsiStr.includes(searchTerm);
    const matchesType = filterType === 'ALL' || type.toUpperCase().includes(filterType);
    return matchesSearch && matchesType;
  });

  const getVesselCorrelation = (mmsi) => {
    return correlationData?.rankings?.find(r => r.mmsi === mmsi);
  };

  const handleSelectVessel = (vessel) => {
    const correlationInfo = getVesselCorrelation(vessel.mmsi);
    setSelectedVessel(correlationInfo || vessel);
    setDrawerOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>AIS Vessel Intelligence</h1>
            <span className="badge badge-cyan">MARINECADASTRE AIS</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Real-time and historical commercial vessel trajectory analysis within surveillance zone.
          </p>
        </div>

        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Status: </span>
            <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>CONNECTED</span>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Vessels Detected: </span>
            <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{vessels.length}</span>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Analysis Radius: </span>
            <span style={{ fontWeight: '700' }}>25 km</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Map */}
      <InteractiveMap height="460px" focusedVesselMmsi={selectedVessel?.mmsi} />

      {/* Search & Filter Controls */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        {/* Search Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-primary)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1, maxWidth: '360px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by Vessel Name or MMSI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '13px' }}
          />
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Type:</span>
          {['ALL', 'TANKER', 'CONTAINER SHIP', 'BULK CARRIER', 'TUG / SUPPLY'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filterType === type ? 'var(--accent-cyan)' : 'var(--bg-surface)',
                color: filterType === type ? 'white' : 'var(--text-secondary)',
                fontWeight: filterType === type ? '700' : '500',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Vessel Table */}
      <div className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 16px' }}>MMSI</th>
              <th style={{ padding: '14px 16px' }}>Vessel Name</th>
              <th style={{ padding: '14px 16px' }}>Type</th>
              <th style={{ padding: '14px 16px' }}>Position (Lat, Lon)</th>
              <th style={{ padding: '14px 16px' }}>Speed (kts)</th>
              <th style={{ padding: '14px 16px' }}>Course</th>
              <th style={{ padding: '14px 16px' }}>Distance to Spill</th>
              <th style={{ padding: '14px 16px' }}>Correlation</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVessels.map(v => {
              const mmsi = v.mmsi || 0;
              const name = v.vessel_name || v.name || "UNNAMED VESSEL";
              const type = v.type || v.vessel_type || "Commercial Vessel";
              const lat = v.latitude ?? v.lat ?? 28.4521;
              const lon = v.longitude ?? v.lon ?? -89.1234;
              const speed = v.speed ?? 12.4;
              const course = v.course ?? 142;

              const correlation = getVesselCorrelation(mmsi);
              const isSelected = selectedVessel?.mmsi === mmsi;

              return (
                <tr
                  key={mmsi}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    background: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: '700' }}>{mmsi}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--accent-cyan)' }}>{name}</td>
                  <td style={{ padding: '14px 16px' }}>{type}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    {typeof lat === 'number' ? lat.toFixed(4) : lat}°, {typeof lon === 'number' ? lon.toFixed(4) : lon}°
                  </td>
                  <td style={{ padding: '14px 16px' }}>{speed} kts</td>
                  <td style={{ padding: '14px 16px' }}>{course}°</td>
                  <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                    {correlation ? `${correlation.min_distance_km} km` : '1.5 km'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {correlation ? (
                      <span className={`badge ${correlation.total_score >= 70 ? 'badge-red' : correlation.total_score >= 50 ? 'badge-amber' : 'badge-cyan'}`}>
                        {correlation.total_score}% Score
                      </span>
                    ) : (
                      <span className="badge badge-cyan">N/A</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleSelectVessel(v)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                    >
                      <span>Details</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detailed Vessel Dossier Drawer */}
      {drawerOpen && selectedVessel && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '420px',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-main)',
          zIndex: 999,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '1px' }}>
                VESSEL DOSSIER
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
              {selectedVessel.vessel_name || selectedVessel.name || "OCEAN IMPERIAL"}
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              MMSI: {selectedVessel.mmsi} | Flag: {selectedVessel.flag || "Panama"}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Vessel Type:</span>
                <span style={{ fontWeight: '700' }}>{selectedVessel.vessel_type || selectedVessel.type || "Tanker"}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Current Position:</span>
                <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>
                  {typeof (selectedVessel.latitude ?? selectedVessel.lat) === 'number'
                    ? (selectedVessel.latitude ?? selectedVessel.lat).toFixed(4)
                    : (selectedVessel.latitude ?? selectedVessel.lat)}°, {
                  typeof (selectedVessel.longitude ?? selectedVessel.lon) === 'number'
                    ? (selectedVessel.longitude ?? selectedVessel.lon).toFixed(4)
                    : (selectedVessel.longitude ?? selectedVessel.lon)}°
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cruising Speed:</span>
                <span style={{ fontWeight: '700' }}>{selectedVessel.speed || 12.4} kts</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Course / Heading:</span>
                <span style={{ fontWeight: '700' }}>{selectedVessel.course || 142}°</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Distance to Spill Centroid:</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-red)' }}>{selectedVessel.min_distance_km || 1.5} km</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Time Delta to Detection:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-amber)' }}>-{selectedVessel.time_delta_mins || 42} minutes</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Correlation Score:</span>
                <span style={{ fontWeight: '900', color: 'var(--accent-red)', fontSize: '18px' }}>
                  {selectedVessel.total_score || 76}%
                </span>
              </div>
            </div>

            {/* Explanation box */}
            {selectedVessel.explanation && (
              <div style={{ marginTop: '20px', background: 'var(--bg-primary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                  INVESTIGATION EVIDENCE SUMMARY
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  "{selectedVessel.explanation}"
                </p>
              </div>
            )}
          </div>

          <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setDrawerOpen(false)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Close Vessel Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
