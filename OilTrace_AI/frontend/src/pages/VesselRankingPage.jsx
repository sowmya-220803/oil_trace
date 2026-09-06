import React from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { ShieldAlert, Anchor, Eye, AlertTriangle, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export const VesselRankingPage = () => {
  const { correlationData, setSelectedVessel } = useApp();

  const rankings = correlationData?.spill_correlations?.[0]?.rankings || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f8fafc' }}>
          Suspect Vessel Risk Ranking & Forensic Dossiers
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>
          Prioritized list of suspect vessels ranked by multi-variable spatiotemporal probability score
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '20px' }}>
        {/* Ranked Suspect Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {rankings.map((v) => {
            const isCritical = v.risk_level === 'CRITICAL';
            const isHigh = v.risk_level === 'HIGH';

            return (
              <div
                key={v.mmsi}
                className="glass-panel"
                style={{
                  padding: '20px',
                  border: isCritical ? '1px solid rgba(239, 68, 68, 0.7)' : (isHigh ? '1px solid rgba(249, 115, 22, 0.7)' : '1px solid #334155'),
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: isCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                      border: `1px solid ${isCritical ? '#ef4444' : '#38bdf8'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '18px',
                      color: isCritical ? '#ef4444' : '#38bdf8'
                    }}>
                      #{v.rank}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#f8fafc' }}>{v.vessel_name}</h3>
                        <span className={`badge badge-${v.risk_level.toLowerCase()}`}>
                          {v.risk_level} ({v.correlation_score}%)
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                        MMSI: {v.mmsi} | IMO: {v.imo} | Type: {v.vessel_type} | Length: {v.length_m}m
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedVessel(v)}
                    className="glass-button"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    <Eye size={14} /> Dossier
                  </button>
                </div>

                {/* KPI Metrics Line */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  fontSize: '12px'
                }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Closest Approach:</span><br />
                    <strong style={{ color: '#38bdf8' }}>{v.min_distance_km} km away</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Time Offset:</span><br />
                    <strong style={{ color: '#f8fafc' }}>{v.time_delta_mins} mins from spill</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Discharge Speed Drop:</span><br />
                    <strong style={{ color: v.closest_approach?.sog < 6.0 ? '#ef4444' : '#cbd5e1' }}>
                      {v.closest_approach?.sog} knots
                    </strong>
                  </div>
                </div>

                {/* Evidence Bullets */}
                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  <div style={{ fontWeight: '700', color: '#94a3b8', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                    Key Forensic Evidence:
                  </div>
                  <ul style={{ paddingLeft: '18px', margin: 0, lineHeight: '1.6' }}>
                    {v.evidence_summary?.map((ev, idx) => (
                      <li key={idx}>{ev}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* GIS Map Preview Panel */}
        <div style={{ position: 'sticky', top: '88px', height: 'fit-content' }}>
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} color="#ef4444" /> Trajectory & Slick Overlay
            </h3>
            <InteractiveMap height="520px" />
          </div>
        </div>
      </div>
    </div>
  );
};
