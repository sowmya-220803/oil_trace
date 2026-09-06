import React, { useState } from 'react';
import { Layers, Eye, Image as ImageIcon, CheckCircle, Sliders } from 'lucide-react';

export const SlickMaskViewer = ({ images }) => {
  const [activeView, setActiveView] = useState('overlay');

  if (!images) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
        No Sentinel-1 SAR imagery processed yet.
      </div>
    );
  }

  const views = [
    { id: 'raw', label: '1. Raw SAR', desc: 'Sentinel-1 C-band backscatter intensity' },
    { id: 'denoised', label: '2. Lee Denoised', desc: 'Speckle noise reduction + CLAHE' },
    { id: 'mask', label: '3. Slick Mask', desc: 'U-Net / Otsu binary threshold' },
    { id: 'overlay', label: '4. Slick Detection Overlay', desc: 'Bounding box & slick perimeter' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>
            Sentinel-1 SAR Image Processing Pipeline
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>
            {views.find(v => v.id === activeView)?.desc}
          </p>
        </div>

        {/* View Mode Selector */}
        <div style={{ display: 'flex', gap: '6px', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeView === v.id ? '#0284c7' : 'transparent',
                color: activeView === v.id ? '#ffffff' : '#94a3b8',
                fontSize: '12px',
                fontWeight: activeView === v.id ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main SAR Image Display */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        background: '#070b14',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #334155'
      }}>
        <img
          src={images[activeView]}
          alt={`SAR ${activeView}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />

        {/* View overlay badge */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #334155',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#38bdf8',
          fontWeight: '600'
        }}>
          MODE: {activeView.toUpperCase()}
        </div>
      </div>
    </div>
  );
};
