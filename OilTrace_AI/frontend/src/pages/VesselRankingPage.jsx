import React from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { Ship, Shield, AlertTriangle, Compass, MapPin, Clock, ArrowRight, FileText } from 'lucide-react';

export const VesselRankingPage = () => {
  const { correlationData, selectedVessel, setSelectedVessel } = useApp();

  const candidates = correlationData?.rankings || [
    {
      mmsi: 235091234,
      vessel_name: "OCEAN IMPERIAL",
      vessel_type: "Tanker",
      total_score: 76.0,
      risk_level: "High Risk",
      min_distance_km: 1.5,
      time_delta_mins: 42,
      explanation: "Vessel trajectory passed within 1.5 km of the detected spill approximately 42 minutes before detection."
    },
    {
      mmsi: 311000891,
      vessel_name: "MAERSK VISBY",
      vessel_type: "Container Ship",
      total_score: 61.0,
      risk_level: "Medium Risk",
      min_distance_km: 4.8,
      time_delta_mins: 34,
      explanation: "Vessel passed 4.8 km from spill area."
    }
  ];

  const vessel = selectedVessel || candidates[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Vessel Investigation Workspace</h1>
          <span className="badge badge-red">CORRELATION RANKING</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Three-column investigation dossier evaluating candidate vessels against satellite oil spill evidence.
        </p>
      </div>

      {/* 3-Column Layout: Left (Candidates List) + Center (GIS Map) + Right (Evidence Panel) */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 340px', gap: '20px', alignItems: 'start' }}>
        {/* LEFT COLUMN: Candidate Vessels List */}
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>
            CANDIDATE VESSELS ({candidates.length})
          </div>

          {candidates.map((cand, idx) => {
            const isSelected = vessel.mmsi === cand.mmsi;
            const isHighRisk = cand.total_score >= 70;

            return (
              <div
                key={cand.mmsi}
                onClick={() => setSelectedVessel(cand)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-surface)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '2px' }}>
                  CANDIDATE #{idx + 1}
                </div>
                <div style={{ fontWeight: '800', fontSize: '15px', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                  {cand.vessel_name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MMSI: {cand.mmsi} | {cand.vessel_type}</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span className={`badge ${isHighRisk ? 'badge-red' : 'badge-amber'}`}>
                    Potential Association
                  </span>
                  <span style={{ fontWeight: '900', color: isHighRisk ? 'var(--accent-red)' : 'var(--accent-amber)', fontSize: '15px' }}>
                    {cand.total_score}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER COLUMN: Focused GIS Map */}
        <div>
          <div style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Focused Correlation Map: <strong style={{ color: 'var(--accent-cyan)' }}>{vessel.vessel_name}</strong> vs Slick
          </div>
          <InteractiveMap height="540px" focusedVesselMmsi={vessel.mmsi} />
        </div>

        {/* RIGHT COLUMN: Evidence Panel */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '1px' }}>
              INVESTIGATION EVIDENCE DOSSIER
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginTop: '2px' }}>{vessel.vessel_name}</h3>
          </div>

          {/* VESSEL PROFILE */}
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '11px' }}>VESSEL PROFILE</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>MMSI:</span>
              <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>{vessel.mmsi}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Vessel Type:</span>
              <span style={{ fontWeight: '600' }}>{vessel.vessel_type || "Tanker"}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Flag:</span>
              <span style={{ fontWeight: '600' }}>{vessel.flag || "Panama"}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Speed / Course:</span>
              <span style={{ fontWeight: '600' }}>{vessel.speed || 12.4} kts / {vessel.course || 142}°</span>
            </div>
          </div>

          {/* SPATIAL EVIDENCE */}
          <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px' }}>
            <div style={{ fontWeight: '800', color: 'var(--accent-cyan)', marginBottom: '4px' }}>SPATIAL EVIDENCE</div>
            <div>Minimum Distance to Spill: <strong style={{ color: 'var(--accent-red)' }}>{vessel.min_distance_km || 1.5} km</strong></div>
          </div>

          {/* TEMPORAL EVIDENCE */}
          <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px' }}>
            <div style={{ fontWeight: '800', color: 'var(--accent-amber)', marginBottom: '4px' }}>TEMPORAL EVIDENCE</div>
            <div>Time Delta to Satellite Scene: <strong>-{vessel.time_delta_mins || 42} mins</strong></div>
          </div>

          {/* TRAJECTORY EVIDENCE */}
          <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px' }}>
            <div style={{ fontWeight: '800', color: 'var(--accent-indigo)', marginBottom: '4px' }}>TRAJECTORY EVIDENCE</div>
            <div>Heading & course vector aligned with slick propagation axis.</div>
          </div>

          {/* INVESTIGATION NOTE */}
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '12px' }}>
            <div style={{ fontWeight: '800', color: 'var(--accent-red)', marginBottom: '4px' }}>INVESTIGATION NOTE</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              "{vessel.explanation}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
