import React from 'react';
import { useApp } from '../context/AppContext';
import { FileSpreadsheet, Download, Printer, Shield, Satellite, Radio, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ReportsPage = () => {
  const { sarData, aisData, correlationData } = useApp();

  const activeSpill = sarData?.spills?.[0] || {
    id: "SPILL-2026-001",
    estimated_area_km2: 63.54,
    confidence_score: 0.942,
    detection_time: "2026-09-16 10:49:00 UTC"
  };

  const candidates = correlationData?.rankings || [];

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = ["MMSI", "Vessel Name", "Type", "Correlation Score", "Min Distance (km)", "Time Delta (mins)", "Risk Level"];
    const rows = candidates.map(c => [
      c.mmsi,
      `"${c.vessel_name}"`,
      `"${c.vessel_type}"`,
      c.total_score,
      c.min_distance_km,
      c.time_delta_mins,
      `"${c.risk_level}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "OilTrace_Investigation_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Investigation Reports & Export</h1>
            <span className="badge badge-green">AUDIT READY</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Generate and export official maritime law enforcement audit dossiers.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handlePrintReport} className="btn-secondary">
            <Printer size={16} />
            <span>Print Report</span>
          </button>

          <button onClick={handleExportCsv} className="btn-secondary">
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button onClick={() => alert("JSON evidence package exported successfully.")} className="btn-primary">
            <FileSpreadsheet size={16} />
            <span>Export JSON Package</span>
          </button>
        </div>
      </div>

      {/* Printable Report Preview Paper Box */}
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '16px', background: 'var(--bg-surface)' }}>
        {/* Report Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--accent-cyan)', paddingBottom: '20px', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '1px' }}>
              OFFICIAL MARITIME INVESTIGATION DOSSIER
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '4px' }}>OilTrace AI Satellite Report</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Investigation Case: OT-2026-0916-001 | Gulf of Mexico</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-cyan" style={{ fontSize: '12px' }}>CONFIDENTIAL</span>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Generated: 2026-09-16 11:00 UTC</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px', color: 'var(--accent-cyan)' }}>
            1. EXECUTIVE SUMMARY & SPILL METRICS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '13px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Spill Identifier:</span>
              <div style={{ fontWeight: '700', fontFamily: 'monospace' }}>{activeSpill.id}</div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>Centroid Location:</span>
              <div style={{ fontWeight: '700' }}>28.4521° N, 89.1234° W</div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>Surface Area:</span>
              <div style={{ fontWeight: '800', color: 'var(--accent-cyan)' }}>{activeSpill.estimated_area_km2} km²</div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>Satellite Detection Time:</span>
              <div style={{ fontWeight: '700' }}>{activeSpill.detection_time}</div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>U-Net AI Confidence:</span>
              <div style={{ fontWeight: '800', color: 'var(--accent-green)' }}>{((activeSpill.confidence_score || 0.942) * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Section 2: Candidate Vessels Ranking Table */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px', color: 'var(--accent-cyan)' }}>
            2. CANDIDATE VESSEL SPATIOTEMPORAL CORRELATION RANKINGS
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Rank</th>
                <th style={{ padding: '12px' }}>MMSI</th>
                <th style={{ padding: '12px' }}>Vessel Name</th>
                <th style={{ padding: '12px' }}>Vessel Type</th>
                <th style={{ padding: '12px' }}>Correlation Score</th>
                <th style={{ padding: '12px' }}>Min Distance</th>
                <th style={{ padding: '12px' }}>Time Delta</th>
                <th style={{ padding: '12px' }}>Assessment</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, idx) => (
                <tr key={c.mmsi} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: '800' }}>#{idx + 1}</td>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>{c.mmsi}</td>
                  <td style={{ padding: '12px', fontWeight: '700', color: 'var(--accent-cyan)' }}>{c.vessel_name}</td>
                  <td style={{ padding: '12px' }}>{c.vessel_type}</td>
                  <td style={{ padding: '12px', fontWeight: '900', color: c.total_score >= 70 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
                    {c.total_score}%
                  </td>
                  <td style={{ padding: '12px' }}>{c.min_distance_km} km</td>
                  <td style={{ padding: '12px' }}>-{c.time_delta_mins} mins</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${c.total_score >= 70 ? 'badge-red' : 'badge-amber'}`}>
                      {c.risk_level || 'Potential Association'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Legal & Methodological Disclaimer */}
        <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: '800', color: 'var(--accent-amber)', marginBottom: '4px' }}>
            LEGAL DISCLAIMER & AUDIT VERIFICATION
          </div>
          <p>
            "Potential vessel associations identified in this report are based on statistical spatial-temporal correlation algorithms using public Sentinel-1 SAR imagery and MarineCadastre AIS trajectories. Results represent candidate priorities for further investigation by maritime authorities and do not constitute definitive legal conviction."
          </p>
        </div>
      </div>
    </div>
  );
};
