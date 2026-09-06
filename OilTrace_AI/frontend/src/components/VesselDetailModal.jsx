import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, Navigation, Clock, Anchor, Activity, FileText, Check } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const VesselDetailModal = () => {
  const { selectedVessel, setSelectedVessel } = useApp();

  if (!selectedVessel) return null;

  const v = selectedVessel;
  const scores = v.score_components || {};
  const trajectory = v.trajectory || [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        position: 'relative',
        border: '1px solid #38bdf8'
      }}>
        {/* Close Button */}
        <button
          onClick={() => setSelectedVessel(null)}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid #334155',
            color: '#cbd5e1',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: v.risk_level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
            border: `1px solid ${v.risk_level === 'CRITICAL' ? '#ef4444' : '#38bdf8'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Anchor size={24} color={v.risk_level === 'CRITICAL' ? '#ef4444' : '#38bdf8'} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#f8fafc' }}>{v.vessel_name}</h2>
              <span className={`badge badge-${v.risk_level?.toLowerCase()}`}>
                {v.risk_level} ({v.correlation_score}%)
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              MMSI: {v.mmsi} | IMO: {v.imo} | CallSign: {v.callsign} | Type: {v.vessel_type}
            </p>
          </div>
        </div>

        {/* KPI Quick Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Min Distance</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#38bdf8', marginTop: '4px' }}>{v.min_distance_km} km</div>
          </div>
          <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Time Offset</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginTop: '4px' }}>{v.time_delta_mins} mins</div>
          </div>
          <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Closest Speed</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#eab308', marginTop: '4px' }}>{v.closest_approach?.sog} kts</div>
          </div>
          <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Risk Rank</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444', marginTop: '4px' }}>#{v.rank} of All</div>
          </div>
        </div>

        {/* Multi-Factor Score Component Breakdown */}
        <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#cbd5e1', marginBottom: '12px' }}>
            Multi-Factor Correlation Risk Breakdown
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Spatial Proximity (Distance)', score: scores.distance_score, weight: '35%' },
              { label: 'Temporal Alignment (Time Delta)', score: scores.time_score, weight: '25%' },
              { label: 'Trajectory Intersection', score: scores.trajectory_score, weight: '20%' },
              { label: 'Speed Anomaly (Discharge Speed Drop)', score: scores.speed_anomaly_score, weight: '10%' },
              { label: 'Course Deviation & Loitering', score: scores.heading_score, weight: '10%' }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>{item.label} <small>({item.weight} weight)</small></span>
                  <strong style={{ color: item.score > 70 ? '#ef4444' : '#38bdf8' }}>{item.score}%</strong>
                </div>
                <div style={{ height: '6px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${item.score}%`,
                    height: '100%',
                    background: item.score > 70 ? 'linear-gradient(90deg, #f97316, #ef4444)' : 'linear-gradient(90deg, #0284c7, #38bdf8)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOG Speed Timeline Chart */}
        {trajectory.length > 0 && (
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#cbd5e1', marginBottom: '12px' }}>
              Speed Over Ground (SOG) Trajectory Timeline (Knots)
            </h4>
            <div style={{ width: '100%', height: '160px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" stroke="#64748b" tickFormatter={t => t.split('T')[1] || t} fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="sog" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} name="Speed (SOG kts)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Evidence Summary List */}
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '16px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#fca5a5', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={16} /> Key Forensic Evidence Log
          </h4>
          <ul style={{ paddingLeft: '20px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.7' }}>
            {v.evidence_summary?.map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
