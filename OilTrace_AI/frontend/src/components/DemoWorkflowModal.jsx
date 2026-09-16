import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Loader2, Radar, Shield, Satellite, Radio, Compass, Award, X } from 'lucide-react';

export const DemoWorkflowModal = () => {
  const { isDemoModalOpen, setIsDemoModalOpen, demoStep, demoRunning, setActiveTab } = useApp();

  if (!isDemoModalOpen) return null;

  const steps = [
    { num: 1, title: 'Loading Sentinel-1 SAR Scene...', desc: 'Downloading C-band synthetic aperture radar dataset.' },
    { num: 2, title: 'Preprocessing Satellite Image...', desc: 'Applying Lee speckle filter (5x5) & radiometric calibration.' },
    { num: 3, title: 'Running AI Segmentation Model...', desc: 'Executing deep convolutional U-Net inference.' },
    { num: 4, title: 'Potential Oil Slick Detected!', desc: 'Low-backscatter slick anomaly isolated with 94.2% confidence.' },
    { num: 5, title: 'Extracting Location & Geometry...', desc: 'Calculating spatial centroid (28.45° N, 89.12° W) and area (63.54 km²).' },
    { num: 6, title: 'Loading AIS Vessel Data...', desc: 'Querying MarineCadastre AIS traffic within 25 km radius.' },
    { num: 7, title: 'Analyzing Vessel Trajectories...', desc: 'Reconstructing historical vessel paths and time deltas.' },
    { num: 8, title: 'Running Spatial-Temporal Correlation...', desc: 'Evaluating distance, time, trajectory, speed, and heading vector.' },
    { num: 9, title: 'Ranking Candidate Vessels...', desc: 'Computing explainable correlation scores (OCEAN IMPERIAL: 76%).' },
    { num: 10, title: 'Generating Investigation Dossier...', desc: 'Exporting auditable evidence package for maritime law enforcement.' }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '650px',
        width: '100%',
        padding: '32px',
        borderRadius: '20px',
        border: '1px solid var(--accent-cyan)',
        boxShadow: '0 0 40px rgba(56, 189, 248, 0.3)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={() => setIsDemoModalOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '13px', letterSpacing: '1px', marginBottom: '8px' }}>
            <Radar className={demoRunning ? "pulse-critical" : ""} size={18} />
            <span>LIVE INVESTIGATION WORKFLOW DEMO</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900' }}>OilTrace AI Automated Pipeline</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            End-to-end satellite detection & vessel correlation demonstration
          </p>
        </div>

        {/* Workflow Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '6px' }}>
          {steps.map(step => {
            const isDone = demoStep > step.num;
            const isCurrent = demoStep === step.num;

            return (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: isCurrent ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-surface)',
                  border: isCurrent ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  opacity: (isDone || isCurrent) ? 1 : 0.45,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '13px',
                  background: isDone ? 'var(--accent-green)' : isCurrent ? 'var(--accent-cyan)' : 'var(--bg-primary)',
                  color: (isDone || isCurrent) ? 'white' : 'var(--text-muted)'
                }}>
                  {isDone ? <CheckCircle2 size={18} /> : isCurrent ? <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> : step.num}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: isCurrent ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Completion Action */}
        {demoStep === 10 && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <div style={{ color: 'var(--accent-green)', fontWeight: '800', fontSize: '16px', marginBottom: '14px' }}>
              ✓ INVESTIGATION WORKFLOW COMPLETE
            </div>
            <button
              onClick={() => {
                setIsDemoModalOpen(false);
                setActiveTab('dashboard');
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '15px', borderRadius: '10px', justifyContent: 'center' }}
            >
              Explore Investigation Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
