import React from 'react';
import { useApp } from '../context/AppContext';
import { History, Satellite, Cpu, MapPin, Radio, SlidersHorizontal, Shield, CheckCircle2 } from 'lucide-react';

export const TimelinePage = () => {
  const { timelineEvents, setActiveTab } = useApp();

  const getEventIcon = (type) => {
    switch (type) {
      case 'sar': return Satellite;
      case 'ai': return Cpu;
      case 'gis': return MapPin;
      case 'ais': return Radio;
      case 'engine': return SlidersHorizontal;
      case 'ranking': return Shield;
      default: return CheckCircle2;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Spill Event Investigation Timeline</h1>
          <span className="badge badge-cyan">AUDIT LOG</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Chronological event history from satellite acquisition to candidate vessel ranking.
        </p>
      </div>

      {/* Interactive Timeline Box */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
        <div style={{ position: 'relative', paddingLeft: '32px' }}>
          {/* Vertical Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '11px',
            width: '2px',
            background: 'linear-gradient(180deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)'
          }} />

          {/* Timeline Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {timelineEvents.map((evt, idx) => {
              const Icon = getEventIcon(evt.type);

              return (
                <div key={evt.id} style={{ position: 'relative' }}>
                  {/* Node Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--bg-surface)',
                    border: '2px solid var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)'
                  }}>
                    <Icon size={12} />
                  </div>

                  {/* Content Card */}
                  <div className="glass-card-solid" style={{ padding: '18px 22px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--accent-cyan)' }}>
                        {evt.title}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {evt.time}
                      </span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>
                      {evt.detail}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed var(--border-color)', fontSize: '11px' }}>
                      <span className="badge badge-green">{evt.status}</span>
                      <button
                        onClick={() => setActiveTab(evt.type === 'sar' ? 'sar' : evt.type === 'ais' ? 'ais' : evt.type === 'ranking' ? 'vessels' : 'correlation')}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: '700' }}
                      >
                        Inspect Evidence →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
