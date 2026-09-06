import React from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { ShieldAlert, Layers, Radio, Activity, Play, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const Dashboard = () => {
  const { sarData, aisData, correlationData, runFullDemo, loading, setSelectedVessel, setActiveTab } = useApp();

  const spills = sarData?.spills || [];
  const totalArea = spills.reduce((acc, s) => acc + (s.area_km2 || 0), 0);
  const vesselRankings = correlationData?.spill_correlations?.[0]?.rankings || [];
  const topSuspect = vesselRankings[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Title & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f8fafc' }}>
            Executive Surveillance Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Real-time Sentinel-1 SAR Oil Spill Detection & MarineCadastre AIS Spatiotemporal Correlation
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveTab('sar')} className="glass-button-secondary" style={{ padding: '8px 14px', fontSize: '12px' }}>
            Upload SAR Satellite Image
          </button>
          <button onClick={runFullDemo} className="glass-button" style={{ padding: '8px 16px', fontSize: '12px' }}>
            <Play size={14} fill="#ffffff" /> Run Automated Demo Workflow
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
      }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '12px' }}>
            <span>Oil Slicks Detected</span>
            <Layers size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: spills.length > 0 ? '#ef4444' : '#f8fafc', marginTop: '8px' }}>
            {spills.length} <small style={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }}>Active Slicks</small>
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> OpenCV / U-Net Segmentation Ready
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '12px' }}>
            <span>Total Slick Surface Area</span>
            <Activity size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#38bdf8', marginTop: '8px' }}>
            {totalArea.toFixed(2)} <small style={{ fontSize: '14px', fontWeight: '600' }}>km²</small>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
            Pixel resolution: 50m / px (Sentinel-1)
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '12px' }}>
            <span>AIS Vessels Tracked</span>
            <Radio size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#f8fafc', marginTop: '8px' }}>
            {vesselRankings.length} <small style={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }}>In Zone</small>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
            MarineCadastre Standard CSV Format
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px', border: topSuspect?.risk_level === 'CRITICAL' ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '12px' }}>
            <span>Max Correlation Risk</span>
            <ShieldAlert size={18} color={topSuspect ? '#ef4444' : '#94a3b8'} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: topSuspect ? '#ef4444' : '#94a3b8', marginTop: '8px' }}>
            {topSuspect ? `${topSuspect.correlation_score}%` : 'N/A'}
          </div>
          <div style={{ fontSize: '11px', color: '#fca5a5', marginTop: '6px' }}>
            {topSuspect ? `${topSuspect.risk_level}: ${topSuspect.vessel_name}` : 'Run Analysis'}
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Top Suspect Side Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Interactive Map */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>
              Maritime GIS Surveillance Map
            </h3>
            <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>
              Leaflet Dark Map • Interactive Polygons & Trajectories
            </span>
          </div>
          <InteractiveMap height="460px" />
        </div>

        {/* Top Suspect Card & Quick Ranking Preview */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} color="#ef4444" /> Suspect Rankings
            </h3>
            <button onClick={() => setActiveTab('vessels')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '600' }}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          {topSuspect ? (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🚨 Top Suspect Vessel (#1)
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc', marginTop: '4px' }}>
                {topSuspect.vessel_name}
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                MMSI: {topSuspect.mmsi} | Type: {topSuspect.vessel_type}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${topSuspect.risk_level.toLowerCase()}`}>
                  {topSuspect.risk_level} ({topSuspect.correlation_score}%)
                </span>
                <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                  Dist: {topSuspect.min_distance_km} km
                </span>
              </div>

              <button
                onClick={() => setSelectedVessel(topSuspect)}
                className="glass-button"
                style={{ width: '100%', marginTop: '12px', padding: '6px 12px', fontSize: '12px', justifyContent: 'center' }}
              >
                Inspect Suspect Dossier
              </button>
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              No correlation analysis loaded yet.
            </div>
          )}

          {/* Additional Suspects List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '200px' }}>
            {vesselRankings.slice(1, 4).map((v, i) => (
              <div
                key={v.mmsi}
                onClick={() => setSelectedVessel(v)}
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#cbd5e1' }}>#{v.rank} {v.vessel_name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{v.vessel_type} • {v.min_distance_km}km away</div>
                </div>
                <span className={`badge badge-${v.risk_level.toLowerCase()}`}>
                  {v.correlation_score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
