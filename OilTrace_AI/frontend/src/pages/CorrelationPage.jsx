import React from 'react';
import { useApp } from '../context/AppContext';
import { SlidersHorizontal, Shield, AlertTriangle, Compass, Clock, MapPin, Activity, CheckCircle2 } from 'lucide-react';

export const CorrelationPage = () => {
  const { sarData, correlationData, selectedVessel, setSelectedVessel, weights, setWeights, triggerCorrelation } = useApp();

  const spill = sarData?.spills?.[0] || {
    id: "SPILL-2026-001",
    estimated_area_km2: 63.54,
    detection_time: "2026-09-16 10:49:00 UTC",
    centroid: [28.4521, -89.1234]
  };

  const vessel = selectedVessel || correlationData?.rankings?.[0] || {
    vessel_name: "OCEAN IMPERIAL",
    mmsi: 235091234,
    vessel_type: "Tanker",
    total_score: 76.0,
    min_distance_km: 1.5,
    time_delta_mins: 42,
    factor_scores: {
      distance_proximity: 24,
      temporal_proximity: 18,
      trajectory_alignment: 17,
      speed_consistency: 9,
      direction_consistency: 8
    },
    explanation: "Candidate vessel trajectory passed within 1.5 km of detected slick centroid 42 minutes prior to satellite acquisition. Heading (142°) aligns directly with observed slick dispersion orientation."
  };

  const factorScores = vessel.factor_scores || {
    distance_proximity: 24,
    temporal_proximity: 18,
    trajectory_alignment: 17,
    speed_consistency: 9,
    direction_consistency: 8
  };

  const handleWeightChange = (factor, value) => {
    const updated = { ...weights, [factor]: Number(value) };
    setWeights(updated);
    triggerCorrelation(undefined, undefined, updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Spatial-Temporal Correlation Engine</h1>
          <span className="badge badge-cyan">EXPLAINABLE AI ENGINE</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Evaluating candidate vessel trajectories against detected oil spill characteristics.
        </p>
      </div>

      {/* Spill Context Bar */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--accent-cyan)' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '1px', marginBottom: '8px' }}>
          ACTIVE SPILL CORRELATION TARGET
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '13px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Spill ID: </span>
            <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>{spill.id}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Centroid: </span>
            <span style={{ fontWeight: '600' }}>28.4521° N, 89.1234° W</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Surface Area: </span>
            <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{spill.estimated_area_km2} km²</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Detection Time: </span>
            <span style={{ fontWeight: '600' }}>{spill.detection_time}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Factor Breakdown & Weight Adjusters (Left) + Selected Vessel Score Gauge (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Factor Breakdown */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Explainable 5-Factor Score Breakdown</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Candidate: {vessel.vessel_name || vessel.name}</span>
          </div>

          {/* 5 Factors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Factor 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>1. Distance Proximity (Max 30)</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-cyan)' }}>{factorScores.distance_proximity} / 30</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(factorScores.distance_proximity / 30) * 100}%`, height: '100%', background: 'var(--accent-cyan)', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Evaluates minimum distance between vessel path and slick centroid (1.5 km distance).
              </div>
            </div>

            {/* Factor 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>2. Temporal Proximity (Max 20)</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-blue)' }}>{factorScores.temporal_proximity} / 20</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(factorScores.temporal_proximity / 20) * 100}%`, height: '100%', background: 'var(--accent-blue)', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Measures time delta between vessel passage and satellite detection (-42 mins).
              </div>
            </div>

            {/* Factor 3 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>3. Trajectory Alignment (Max 20)</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-indigo)' }}>{factorScores.trajectory_alignment} / 20</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(factorScores.trajectory_alignment / 20) * 100}%`, height: '100%', background: 'var(--accent-indigo)', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Analyzes geometric overlap between vessel path vector and oil slick elongation axis.
              </div>
            </div>

            {/* Factor 4 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>4. Speed Consistency (Max 15)</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-amber)' }}>{factorScores.speed_consistency} / 15</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(factorScores.speed_consistency / 15) * 100}%`, height: '100%', background: 'var(--accent-amber)', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Assesses cruising speed drop during passage (12.4 kts cruising).
              </div>
            </div>

            {/* Factor 5 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>5. Direction Consistency (Max 15)</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-green)' }}>{factorScores.direction_consistency} / 15</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(factorScores.direction_consistency / 15) * 100}%`, height: '100%', background: 'var(--accent-green)', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Correlates vessel heading (142°) against oceanic current dispersion drift.
              </div>
            </div>
          </div>

          {/* Dynamic Weight Sliders Box */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)', marginTop: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-cyan)', marginBottom: '12px' }}>
              CUSTOM FACTOR WEIGHT ADJUSTERS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Distance Weight ({weights.distance})</label>
                <input type="range" min="0.1" max="0.5" step="0.05" value={weights.distance} onChange={(e) => handleWeightChange('distance', e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Time Weight ({weights.time})</label>
                <input type="range" min="0.1" max="0.5" step="0.05" value={weights.time} onChange={(e) => handleWeightChange('time', e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Total Correlation Score Card & Evidence Box */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
          <div>
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                TOTAL CORRELATION SCORE
              </div>
              <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--accent-red)', lineHeight: '1.1', margin: '8px 0' }}>
                {vessel.total_score || 76}%
              </div>
              <span className="badge badge-red" style={{ fontSize: '12px', padding: '6px 14px' }}>
                POTENTIAL ASSOCIATION
              </span>
            </div>

            {/* Vessel Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Vessel Name:</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-cyan)' }}>{vessel.vessel_name || vessel.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>MMSI:</span>
                <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>{vessel.mmsi}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Vessel Type:</span>
                <span style={{ fontWeight: '600' }}>{vessel.vessel_type || vessel.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Closest Approach:</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-red)' }}>{vessel.min_distance_km || 1.5} km</span>
              </div>
            </div>

            {/* Why This Vessel Box */}
            <div style={{ marginTop: '20px', background: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-amber)', marginBottom: '6px' }}>
                "WHY THIS VESSEL?" EVIDENCE EXPLANATION
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                "{vessel.explanation}"
              </p>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            Legal Note: Score indicates statistical spatial-temporal correlation probability, not definitive legal guilt.
          </div>
        </div>
      </div>
    </div>
  );
};
