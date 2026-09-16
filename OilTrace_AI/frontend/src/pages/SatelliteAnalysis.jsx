import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Satellite, Upload, Play, Cpu, CheckCircle2, AlertTriangle, Layers, Info, Sliders } from 'lucide-react';

export const SatelliteAnalysis = () => {
  const { sarData, uploadSarImage, runFullDemo, loading } = useApp();
  const [activeViewerTab, setActiveViewerTab] = useState('overlay');
  const [sliderPos, setSliderPos] = useState(50);
  const [localFilePreview, setLocalFilePreview] = useState(null);
  const [localFileName, setLocalFileName] = useState(null);

  const spill = sarData?.spills?.[0] || {
    centroid: [28.4521, -89.1234],
    estimated_area_km2: 63.54,
    area_km2: 63.54,
    confidence_score: 0.942,
    detection_time: "2026-09-16 10:49:00 UTC"
  };

  const images = sarData?.images || {};

  // Map active viewer tab to image key
  const getImageForTab = () => {
    switch (activeViewerTab) {
      case 'original':
        return images.raw || localFilePreview;
      case 'preprocessed':
        return images.denoised || images.raw || localFilePreview;
      case 'segmentation':
        return images.mask || images.overlay || localFilePreview;
      case 'overlay':
        return images.overlay || images.mask || localFilePreview;
      default:
        return images.overlay || localFilePreview;
    }
  };

  const currentImageSrc = getImageForTab();

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalFileName(file.name);
      const fileUrl = URL.createObjectURL(file);
      setLocalFilePreview(fileUrl);

      const formData = new FormData();
      formData.append('file', file);
      uploadSarImage(formData);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Satellite Intelligence</h1>
            <span className="badge badge-cyan">SENTINEL-1 SAR</span>
            {localFileName ? (
              <span className="badge badge-green">UPLOADED: {localFileName}</span>
            ) : (
              <span className="badge badge-amber">DEMO DATA</span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Sentinel-1 C-Band SAR radar backscatter ingestion and AI U-Net oil slick segmentation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <label className="btn-primary" style={{ cursor: 'pointer' }}>
            <Upload size={16} />
            <span>Upload Satellite Image</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <button onClick={runFullDemo} className="btn-secondary">
            <Play size={16} fill="currentColor" />
            <span>Load Demo Scene</span>
          </button>
        </div>
      </div>

      {/* Upload Drag & Drop Box */}
      <label className="glass-panel" style={{
        padding: '24px',
        borderRadius: '12px',
        border: '2px dashed var(--border-glow)',
        textAlign: 'center',
        background: 'rgba(56, 189, 248, 0.03)',
        cursor: 'pointer',
        display: 'block'
      }}>
        <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
        <Satellite size={40} color="var(--accent-cyan)" style={{ marginBottom: '8px' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
          {localFileName ? `Uploaded Image: ${localFileName}` : "Drag & Drop or Click to Upload Sentinel-1 SAR Satellite Image"}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
          Supports GeoTIFF, PNG, JPG radar backscatter files (Sentinel-1A/1B IW GRDH C-Band)
        </p>
      </label>

      {/* Main Analysis Section: Image Viewer (Left) + AI Metrics (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Interactive Satellite Image Viewer */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tabs Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['original', 'preprocessed', 'segmentation', 'overlay'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveViewerTab(tab)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeViewerTab === tab ? 'var(--accent-cyan)' : 'var(--bg-surface)',
                    color: activeViewerTab === tab ? 'white' : 'var(--text-secondary)',
                    fontWeight: activeViewerTab === tab ? '700' : '500',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab === 'segmentation' ? 'AI Segmentation' : tab}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Scene: {localFileName || sarData?.image_name || "Sentinel1_SAR_Gulf_20260916.tif"}
            </div>
          </div>

          {/* Image Container */}
          <div style={{
            position: 'relative',
            height: '440px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#070b14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)'
          }}>
            {currentImageSrc ? (
              <img
                src={currentImageSrc}
                alt={`SAR ${activeViewerTab}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              /* Synthetic Default Image Box */
              <div style={{
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #070b14 100%)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }} />

                <div style={{
                  position: 'absolute',
                  top: '32%',
                  left: '38%',
                  width: '180px',
                  height: '120px',
                  borderRadius: '45% 55% 60% 40% / 50% 40% 60% 50%',
                  background: activeViewerTab === 'original'
                    ? 'rgba(15, 23, 42, 0.95)'
                    : activeViewerTab === 'preprocessed'
                    ? 'rgba(2, 6, 23, 0.98)'
                    : activeViewerTab === 'segmentation'
                    ? 'rgba(239, 68, 68, 0.85)'
                    : 'rgba(239, 68, 68, 0.65)',
                  border: (activeViewerTab === 'segmentation' || activeViewerTab === 'overlay') ? '2px solid #ef4444' : 'none',
                  boxShadow: (activeViewerTab === 'segmentation' || activeViewerTab === 'overlay') ? '0 0 20px rgba(239, 68, 68, 0.6)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '12px'
                }}>
                  {(activeViewerTab === 'segmentation' || activeViewerTab === 'overlay') && (
                    <span>OIL SLICK MASK ({spill.estimated_area_km2 || spill.area_km2 || 63.54} km²)</span>
                  )}
                </div>
              </div>
            )}

            {/* Scanning Line Effect */}
            <div className="radar-scan-line" />

            {/* Mode Tag */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-color)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              color: 'var(--accent-cyan)',
              fontWeight: '700'
            }}>
              VIEW MODE: {activeViewerTab.toUpperCase()}
            </div>
          </div>

          {/* Interactive Comparison Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '8px' }}>
            <Sliders size={18} color="var(--accent-cyan)" />
            <span style={{ fontSize: '12px', fontWeight: '700', minWidth: '130px' }}>Compare Original vs Mask:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent-cyan)' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', minWidth: '45px' }}>{sliderPos}%</span>
          </div>
        </div>

        {/* Right AI Analysis Panel */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '12px', letterSpacing: '1px', marginBottom: '8px' }}>
              <Cpu size={18} />
              <span>AI SEGMENTATION MODEL METRICS</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900' }}>Detection Intelligence</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Segmentation Model:</span>
              <span style={{ fontWeight: '700' }}>Deep CNN / U-Net SAR</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Analysis Status:</span>
              <span className="badge badge-green">{loading ? "PROCESSING..." : "ANALYSIS COMPLETE"}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Detection Confidence:</span>
              <span style={{ fontWeight: '800', color: 'var(--accent-green)', fontSize: '15px' }}>
                {((spill.confidence_score || 0.942) * 100).toFixed(1)}%
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Detected Spill Area:</span>
              <span style={{ fontWeight: '800', color: 'var(--accent-cyan)', fontSize: '15px' }}>
                {spill.estimated_area_km2 || spill.area_km2 || 63.54} km²
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Spill Centroid:</span>
              <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>
                {spill.centroid_lat || spill.centroid?.[0] || 28.4521}° N, {spill.centroid_lon || spill.centroid?.[1] || -89.1234}° W
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Detection Timestamp:</span>
              <span style={{ fontWeight: '600' }}>{spill.detection_time || spill.estimated_spill_time || "2026-09-16 10:49:00 UTC"}</span>
            </div>
          </div>

          {/* Model Explanation Box */}
          <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-amber)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={14} />
              <span>MODEL EXPLANATION</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              "Potential oil-slick region identified from SAR backscatter characteristics. Dark patch exhibits low Radar Cross Section (RCS) dampening typical of surface oil film."
            </p>
          </div>

          {/* Legend */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>MAP LEGEND</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }} />
                <span>Oil Spill Mask (Critical)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '2px' }} />
                <span>Potential Spill Anomaly</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: '#334155', borderRadius: '2px' }} />
                <span>Ocean Background</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
