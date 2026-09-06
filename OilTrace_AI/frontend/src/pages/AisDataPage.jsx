import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Radio, Sparkles, Search, Filter, Anchor, RefreshCw } from 'lucide-react';

export const AisDataPage = () => {
  const { aisData, uploadAisCsv, generateSyntheticAis, sarData, loading, setSelectedVessel } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [syntheticCount, setSyntheticCount] = useState(6);

  const centerLat = sarData?.detection_summary?.center_coordinates?.lat || 53.2500;
  const centerLon = sarData?.detection_summary?.center_coordinates?.lon || 3.4500;

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        await uploadAisCsv(e.target.files[0]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleGenerateSynthetic = async () => {
    try {
      await generateSyntheticAis(centerLat, centerLon, syntheticCount);
    } catch (err) {
      console.error(err);
    }
  };

  const vessels = aisData?.vessels || [];

  const filteredVessels = vessels.filter(v => {
    const matchesSearch = v.vessel_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.mmsi.includes(searchQuery) ||
                          v.imo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || v.vessel_type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f8fafc' }}>
          MarineCadastre AIS Data Processing & Synthetic Traffic Generator
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>
          Upload standard MarineCadastre CSV trajectory logs or synthesize realistic maritime traffic along shipping channels
        </p>
      </div>

      {/* Upload & Synthetic Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Upload MarineCadastre CSV */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={18} color="#38bdf8" /> Upload MarineCadastre AIS CSV
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
            Fields: <code>MMSI, BaseDateTime, LAT, LON, SOG, COG, VesselName, IMO, VesselType</code>
          </p>

          <label className="glass-button-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px', cursor: 'pointer' }}>
            <Upload size={16} /> Select AIS CSV File
            <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Generate Synthetic AIS Traffic */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#eab308" /> Generate Synthetic Traffic
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
            Simulate realistic tankers, cargo vessels & tug trajectories around spill coordinates ({centerLat}, {centerLon})
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={syntheticCount}
              onChange={(e) => setSyntheticCount(parseInt(e.target.value))}
              style={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}
            >
              <option value={4}>4 Vessels</option>
              <option value={6}>6 Vessels (Standard)</option>
              <option value={10}>10 Vessels (Dense Channel)</option>
            </select>

            <button
              onClick={handleGenerateSynthetic}
              disabled={loading}
              className="glass-button"
              style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Radio size={16} />}
              <span>Generate AIS Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* AIS Vessel Trajectory Data Grid */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>
            Tracked Vessel Trajectory Index ({filteredVessels.length} Total)
          </h3>

          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search MMSI or Name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  padding: '6px 10px 6px 32px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  width: '200px'
                }}
              />
            </div>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              style={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }}
            >
              <option value="ALL">All Types</option>
              <option value="Tanker">Tanker</option>
              <option value="Cargo">Cargo</option>
              <option value="Tug">Tug</option>
              <option value="Fishing">Fishing</option>
            </select>
          </div>
        </div>

        {filteredVessels.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#0f172a', borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px' }}>MMSI</th>
                  <th style={{ padding: '10px' }}>Vessel Name</th>
                  <th style={{ padding: '10px' }}>Type</th>
                  <th style={{ padding: '10px' }}>IMO</th>
                  <th style={{ padding: '10px' }}>Length</th>
                  <th style={{ padding: '10px' }}>Avg SOG</th>
                  <th style={{ padding: '10px' }}>Min SOG</th>
                  <th style={{ padding: '10px' }}>Waypoints</th>
                  <th style={{ padding: '10px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVessels.map(v => (
                  <tr key={v.mmsi} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '10px', fontWeight: '700', color: '#38bdf8' }}>{v.mmsi}</td>
                    <td style={{ padding: '10px', fontWeight: '700', color: '#f8fafc' }}>{v.vessel_name}</td>
                    <td style={{ padding: '10px' }}>{v.vessel_type}</td>
                    <td style={{ padding: '10px', color: '#94a3b8' }}>{v.imo}</td>
                    <td style={{ padding: '10px' }}>{v.length_m} m</td>
                    <td style={{ padding: '10px' }}>{v.avg_sog_knots} kts</td>
                    <td style={{ padding: '10px', color: v.min_sog_knots < 5.0 ? '#ef4444' : '#cbd5e1', fontWeight: v.min_sog_knots < 5.0 ? '700' : 'normal' }}>
                      {v.min_sog_knots} kts
                    </td>
                    <td style={{ padding: '10px' }}>{v.total_points} pts</td>
                    <td style={{ padding: '10px' }}>
                      <button
                        onClick={() => setSelectedVessel(v)}
                        className="glass-button-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                      >
                        Inspect Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No matching AIS vessels found.
          </div>
        )}
      </div>
    </div>
  );
};
