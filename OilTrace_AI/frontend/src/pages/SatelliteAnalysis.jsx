import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SlickMaskViewer } from '../components/SlickMaskViewer';
import { Upload, Satellite, Sliders, Layers, Check, RefreshCw, Activity, Calendar, Compass } from 'lucide-react';

export const SatelliteAnalysis = () => {
  const { sarData, uploadSarImage, loading } = useApp();

  const [selectedFile, setSelectedFile] = useState(null);
  const [sensitivity, setSensitivity] = useState(0.5);
  const [minArea, setMinArea] = useState(0.1);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('sensitivity', sensitivity);
    formData.append('min_area_km2', minArea);

    try {
      await uploadSarImage(formData);
    } catch (err) {
      console.error(err);
    }
  };

  const spills = sarData?.spills || [];
  const summary = sarData?.detection_summary || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f8fafc' }}>
          Sentinel-1 SAR Satellite Image Analysis
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>
          OpenCV Lee Speckle Noise Reduction, Adaptive Thresholding & CNN/U-Net Oil Spill Segmentation
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px' }}>
        {/* Upload & Controls Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={18} color="#38bdf8" /> Upload Sentinel-1 Imagery
            </h3>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setSelectedFile(e.dataTransfer.files[0]);
                  }
                }}
                style={{
                  border: `2px dashed ${dragActive ? '#38bdf8' : '#334155'}`,
                  borderRadius: '10px',
                  padding: '24px',
                  textAlign: 'center',
                  background: dragActive ? 'rgba(56, 189, 248, 0.1)' : '#0f172a',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => document.getElementById('sar-file-input').click()}
              >
                <input
                  id="sar-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <Satellite size={32} color="#38bdf8" style={{ margin: '0 auto 10px auto', display: 'block' }} />
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>
                  {selectedFile ? selectedFile.name : 'Click or Drag Sentinel-1 SAR Image'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Supports PNG, JPG, TIFF, NPY (Max 20MB)
                </div>
              </div>

              {/* Parameter Sliders */}
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sliders size={14} color="#38bdf8" /> OpenCV Segmentation Tuning
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>Sensitivity Threshold</span>
                    <strong style={{ color: '#38bdf8' }}>{sensitivity}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>Min Slick Area Filter</span>
                    <strong style={{ color: '#38bdf8' }}>{minArea} km²</strong>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="2.0"
                    step="0.05"
                    value={minArea}
                    onChange={(e) => setMinArea(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedFile || loading}
                className="glass-button"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Layers size={16} />}
                <span>Process SAR Image</span>
              </button>
            </form>
          </div>

          {/* Algorithm Info Box */}
          <div className="glass-panel" style={{ padding: '16px', fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
            <div style={{ fontWeight: '700', color: '#cbd5e1', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#10b981" /> Detection Pipeline Info
            </div>
            • <strong>Speckle Filter:</strong> 9x9 Bilateral Noise Reduction<br />
            • <strong>Enhancement:</strong> Contrast-Limited Adaptive Histogram Equalization<br />
            • <strong>Segmentation:</strong> Adaptive Otsu & U-Net Thresholding<br />
            • <strong>Extraction:</strong> OpenCV Contour Vector Polygon Extraction
          </div>
        </div>

        {/* View Component & Extracted Metrics Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Slick Mask View Component */}
          <SlickMaskViewer images={sarData?.images} />

          {/* Extracted Spill Metadata Table */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginBottom: '12px' }}>
              Detected Oil Spill Characteristics
            </h3>

            {spills.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px' }}>Spill ID</th>
                      <th style={{ padding: '10px' }}>Centroid Lat / Lon</th>
                      <th style={{ padding: '10px' }}>Surface Area</th>
                      <th style={{ padding: '10px' }}>Perimeter</th>
                      <th style={{ padding: '10px' }}>Confidence</th>
                      <th style={{ padding: '10px' }}>Detection Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spills.map((s) => (
                      <tr key={s.spill_id} style={{ borderBottom: '1px solid #334155' }}>
                        <td style={{ padding: '10px', fontWeight: '700', color: '#ef4444' }}>{s.spill_id}</td>
                        <td style={{ padding: '10px', color: '#38bdf8' }}>{s.centroid_lat}, {s.centroid_lon}</td>
                        <td style={{ padding: '10px', fontWeight: '700' }}>{s.area_km2} km²</td>
                        <td style={{ padding: '10px' }}>{s.perimeter_km} km</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                            {(s.confidence_score * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td style={{ padding: '10px', color: '#94a3b8' }}>{s.estimated_spill_time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                No oil spill slicks detected in current scene.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
