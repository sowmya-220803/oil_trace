import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, ShieldAlert, Radio, Compass, RefreshCw, Cpu, Layers } from 'lucide-react';

export const Navbar = () => {
  const { runFullDemo, loading, demoActive, sarData, aisData, correlationData } = useApp();

  const spillCount = sarData?.spills?.length || 0;
  const vesselCount = aisData?.vessels?.length || 0;
  const topSuspect = correlationData?.spill_correlations?.[0]?.rankings?.[0];

  return (
    <header style={{
      height: '68px',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(51, 65, 85, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Title & Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
        }}>
          <Compass size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px', background: 'linear-gradient(90deg, #ffffff, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            OilTrace AI
          </h1>
          <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
            Sentinel-1 SAR Oil Spill & MarineCadastre AIS Correlation Engine
          </p>
        </div>
      </div>

      {/* Live System Status / Pipeline Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="#38bdf8" />
            <span style={{ color: '#94a3b8' }}>Slicks:</span>
            <strong style={{ color: spillCount > 0 ? '#ef4444' : '#f8fafc' }}>{spillCount} Detected</strong>
          </div>
          <div style={{ width: '1px', height: '14px', background: '#334155' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={14} color="#10b981" />
            <span style={{ color: '#94a3b8' }}>AIS Vessels:</span>
            <strong style={{ color: '#f8fafc' }}>{vesselCount} Tracked</strong>
          </div>
          {topSuspect && (
            <>
              <div style={{ width: '1px', height: '14px', background: '#334155' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={14} color="#ef4444" />
                <span style={{ color: '#94a3b8' }}>Top Suspect:</span>
                <strong style={{ color: '#ef4444' }}>{topSuspect.vessel_name} ({topSuspect.correlation_score}%)</strong>
              </div>
            </>
          )}
        </div>

        {/* 1-Click Run Demo Button */}
        <button
          onClick={runFullDemo}
          disabled={loading}
          className="glass-button"
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            padding: '8px 18px',
            fontSize: '13px'
          }}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Processing Pipeline...</span>
            </>
          ) : (
            <>
              <Play size={16} fill="#ffffff" />
              <span>Run Complete Demo</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
