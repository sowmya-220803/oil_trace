import React from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, RefreshCw, Activity, ShieldAlert, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ZAxis } from 'recharts';

export const CorrelationPage = () => {
  const { sarData, aisData, correlationData, weights, setWeights, triggerCorrelation, loading, setSelectedVessel } = useApp();

  const handleWeightChange = (key, value) => {
    const newWeights = { ...weights, [key]: parseFloat(value) };
    setWeights(newWeights);
  };

  const handleRecalculate = () => {
    triggerCorrelation(sarData?.spills, aisData?.vessels, weights);
  };

  const rankings = correlationData?.spill_correlations?.[0]?.rankings || [];

  // Data points for distance vs time delta scatter plot
  const scatterData = rankings.map(r => ({
    name: r.vessel_name,
    distanceKm: r.min_distance_km,
    timeDeltaMins: r.time_delta_mins,
    score: r.correlation_score,
    risk: r.risk_level
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f8fafc' }}>
          Spatiotemporal Correlation Engine & Risk Weights
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>
          Multi-factor calculation integrating Haversine distance, time offset, path intersection, speed drop anomalies, and loitering course changes
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px' }}>
        {/* Dynamic Weight Configuration Panel */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#38bdf8" /> Correlation Weight Tuning
          </h3>

          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                <span>Spatial Distance (W_dist)</span>
                <strong style={{ color: '#38bdf8' }}>{(weights.distance * 100).toFixed(0)}%</strong>
              </div>
              <input
                type="range" min="0.05" max="0.6" step="0.05"
                value={weights.distance}
                onChange={e => handleWeightChange('distance', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                <span>Temporal Delta (W_time)</span>
                <strong style={{ color: '#38bdf8' }}>{(weights.time * 100).toFixed(0)}%</strong>
              </div>
              <input
                type="range" min="0.05" max="0.5" step="0.05"
                value={weights.time}
                onChange={e => handleWeightChange('time', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                <span>Trajectory Path Intersection (W_traj)</span>
                <strong style={{ color: '#38bdf8' }}>{(weights.trajectory * 100).toFixed(0)}%</strong>
              </div>
              <input
                type="range" min="0.05" max="0.5" step="0.05"
                value={weights.trajectory}
                onChange={e => handleWeightChange('trajectory', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                <span>Speed Anomaly (SOG Drop) (W_speed)</span>
                <strong style={{ color: '#38bdf8' }}>{(weights.speed * 100).toFixed(0)}%</strong>
              </div>
              <input
                type="range" min="0.05" max="0.4" step="0.05"
                value={weights.speed}
                onChange={e => handleWeightChange('speed', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                <span>Course Drift & Loitering (W_heading)</span>
                <strong style={{ color: '#38bdf8' }}>{(weights.heading * 100).toFixed(0)}%</strong>
              </div>
              <input
                type="range" min="0.05" max="0.4" step="0.05"
                value={weights.heading}
                onChange={e => handleWeightChange('heading', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <button
            onClick={handleRecalculate}
            disabled={loading}
            className="glass-button"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            <span>Recalculate Correlations</span>
          </button>
        </div>

        {/* Charts & Matrix Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Spatiotemporal Distance vs Time Scatter Chart */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginBottom: '4px' }}>
              Spatiotemporal Proximity Chart (Distance vs Time Delta)
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
              Top suspects cluster at the bottom-left corner (closest approach distance & minimal time offset)
            </p>

            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" dataKey="timeDeltaMins" name="Time Delta" unit=" mins" stroke="#64748b" label={{ value: 'Time Delta (mins)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }} />
                  <YAxis type="number" dataKey="distanceKm" name="Min Distance" unit=" km" stroke="#64748b" label={{ value: 'Min Distance (km)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                  <ZAxis type="number" dataKey="score" range={[60, 400]} name="Risk Score" />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Scatter name="Vessels" data={scatterData} fill="#ef4444" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Correlation Score Table */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginBottom: '12px' }}>
              Computed Risk Score Breakdown Matrix
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#0f172a', borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px' }}>Rank</th>
                  <th style={{ padding: '10px' }}>Vessel Name</th>
                  <th style={{ padding: '10px' }}>Dist Score</th>
                  <th style={{ padding: '10px' }}>Time Score</th>
                  <th style={{ padding: '10px' }}>Traj Score</th>
                  <th style={{ padding: '10px' }}>Speed Drop</th>
                  <th style={{ padding: '10px' }}>Composite Risk</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((r) => (
                  <tr key={r.mmsi} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '10px', fontWeight: '700' }}>#{r.rank}</td>
                    <td style={{ padding: '10px', fontWeight: '700', color: '#38bdf8' }}>{r.vessel_name}</td>
                    <td style={{ padding: '10px' }}>{r.score_components?.distance_score}%</td>
                    <td style={{ padding: '10px' }}>{r.score_components?.time_score}%</td>
                    <td style={{ padding: '10px' }}>{r.score_components?.trajectory_score}%</td>
                    <td style={{ padding: '10px' }}>{r.score_components?.speed_anomaly_score}%</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`badge badge-${r.risk_level.toLowerCase()}`}>
                        {r.risk_level} ({r.correlation_score}%)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
