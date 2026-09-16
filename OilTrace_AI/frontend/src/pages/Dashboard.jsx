import React from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/InteractiveMap';
import {
  Shield,
  Radio,
  Satellite,
  Activity,
  AlertTriangle,
  FileText,
  Upload,
  Play,
  ArrowRight,
  Clock,
  MapPin,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const Dashboard = () => {
  const {
    sarData,
    aisData,
    correlationData,
    selectedVessel,
    setSelectedVessel,
    setActiveTab,
    runAnimatedDemo
  } = useApp();

  const activeSpill = sarData?.spills?.[0] || {
    id: "SPILL-2026-001",
    estimated_area_km2: 63.54,
    confidence_score: 0.942,
    detection_time: "2026-09-16 10:49:00 UTC",
    centroid: [28.4521, -89.1234]
  };

  const candidateVessels = correlationData?.rankings || [];
  const topCandidate = candidateVessels[0] || {
    vessel_name: "OCEAN IMPERIAL",
    mmsi: 235091234,
    total_score: 76.0,
    min_distance_km: 1.5,
    risk_level: "High Risk"
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Maritime Surveillance & Investigation</h1>
            <span className="badge badge-cyan">LIVE SURVEILLANCE</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Satellite-derived oil spill intelligence and AIS spatial-temporal vessel correlation.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('sar')} className="btn-secondary">
            <Upload size={16} />
            <span>Upload SAR Image</span>
          </button>

          <button onClick={() => setActiveTab('correlation')} className="btn-secondary">
            <Activity size={16} />
            <span>Run AI Analysis</span>
          </button>

          <button onClick={() => setActiveTab('vessels')} className="btn-secondary">
            <Shield size={16} />
            <span>Start Investigation</span>
          </button>

          <button onClick={runAnimatedDemo} className="btn-primary">
            <Play size={16} fill="currentColor" />
            <span>Run Complete Demo</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>ACTIVE OIL SPILLS</span>
            <AlertTriangle size={20} color="var(--accent-red)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-red)' }}>
            {sarData?.total_spills_detected || 1} Slick
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Sentinel-1 C-Band Detection
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>TOTAL SPILL AREA</span>
            <Activity size={20} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-cyan)' }}>
            {activeSpill.estimated_area_km2} km²
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Confidence: {((activeSpill.confidence_score || 0.942) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>TRACKED AIS VESSELS</span>
            <Radio size={20} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-amber)' }}>
            {aisData?.total_vessels || 4} Vessels
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Within 25 km Analysis Radius
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>POTENTIAL ASSOCIATIONS</span>
            <Shield size={20} color="var(--accent-indigo)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-indigo)' }}>
            {candidateVessels.length || 4} Candidates
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Correlated Spatial-Temporal
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>HIGHEST CORRELATION</span>
            <CheckCircle2 size={20} color="var(--accent-red)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-red)' }}>
            {topCandidate.total_score}% Score
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Vessel: {topCandidate.vessel_name}
          </div>
        </div>
      </div>

      {/* Core Story "5 Ws" Briefing Panel */}
      <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--accent-cyan)' }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
          EXECUTIVE INVESTIGATION BRIEFING (THE 5 Ws)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>WHAT HAPPENED?</div>
            <div style={{ fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>Oil Slick Detected</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sentinel-1 C-Band SAR radar backscatter anomaly.</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>WHERE DID IT HAPPEN?</div>
            <div style={{ fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>Gulf of Mexico Sector 4B</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>28.4521° N, 89.1234° W (Area: 63.54 km²)</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>WHEN DID IT HAPPEN?</div>
            <div style={{ fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>2026-09-16 10:49 UTC</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Satellite acquisition timestamp.</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>WHICH VESSELS WERE NEARBY?</div>
            <div style={{ fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>OCEAN IMPERIAL + 3 others</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Passed within 1.5 km of slick origin.</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>WHY POTENTIAL ASSOCIATION?</div>
            <div style={{ fontWeight: '700', fontSize: '14px', marginTop: '2px', color: 'var(--accent-red)' }}>76% Correlation Score</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Proximity in time & heading alignment.</div>
          </div>
        </div>
      </div>

      {/* Main Center GIS Map + Right Investigation Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left GIS Map Container */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Maritime GIS Command Center</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Interactive Satellite & AIS Layer Overlay</span>
          </div>
          <InteractiveMap height="520px" />
        </div>

        {/* Right Investigation Summary Panel */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '1px' }}>
                INVESTIGATION DOSSIER
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '900', marginTop: '4px' }}>Case OT-2026-0916-001</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Spill ID:</span>
                <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>{activeSpill.id}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Detection Time:</span>
                <span style={{ fontWeight: '600' }}>{activeSpill.detection_time}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Coordinates:</span>
                <span style={{ fontWeight: '600' }}>28.4521° N, 89.1234° W</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Area:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{activeSpill.estimated_area_km2} km²</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>AI Confidence:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-green)' }}>{((activeSpill.confidence_score || 0.942) * 100).toFixed(1)}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Top Candidate:</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-red)' }}>{topCandidate.vessel_name}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Correlation Score:</span>
                <span style={{ fontWeight: '900', color: 'var(--accent-red)', fontSize: '16px' }}>{topCandidate.total_score}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Investigation Status:</span>
                <span className="badge badge-red">INVESTIGATION ACTIVE</span>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)', marginTop: '20px' }}>
            <button
              onClick={() => setActiveTab('vessels')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '8px' }}
            >
              <span>Investigate Top Candidate</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Factor Evidence Overview */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '14px' }}>Multi-Factor Evidence Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-cyan)', marginBottom: '6px' }}>SATELLITE EVIDENCE</div>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>Sentinel-1 C-Band SAR</div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Dark slick mask identified by U-Net deep model.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', marginBottom: '6px' }}>AIS EVIDENCE</div>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>MarineCadastre Traffic</div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              4 commercial vessels tracked in 3-hour window.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-amber)', marginBottom: '6px' }}>SPATIAL EVIDENCE</div>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>1.5 km Proximity</div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              OCEAN IMPERIAL trajectory passed within 1.5 km.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-green)', marginBottom: '6px' }}>TEMPORAL EVIDENCE</div>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>-42 min Time Delta</div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Vessel pass occurred 42 minutes before satellite scene.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-indigo)', marginBottom: '6px' }}>TRAJECTORY EVIDENCE</div>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>142° Course Alignment</div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Slick dispersion vector aligns directly with vessel heading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
