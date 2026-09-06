import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, Printer, ShieldCheck, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';

export const ReportsPage = () => {
  const { sarData, aisData, correlationData } = useApp();
  const [downloading, setDownloading] = useState(false);

  const spills = sarData?.spills || [];
  const rankings = correlationData?.spill_correlations?.[0]?.rankings || [];

  const handleDownloadSpillsCsv = async () => {
    try {
      const res = await axios.post('https://oil-trace-tn33.onrender.com', { spills }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'oil_spill_detections.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error downloading spills CSV:", err);
    }
  };

  const handleDownloadRankingsCsv = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/export/csv/rankings', { rankings }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'suspect_vessel_rankings.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error downloading rankings CSV:", err);
    }
  };

  const handlePrintPdfReport = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/export/report', {
        spills,
        rankings,
        metadata: { generated_by: 'OilTrace AI System' }
      });
      const printWindow = window.open('', '_blank');
      printWindow.document.write(res.data);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (err) {
      console.error("Error printing report:", err);
    }
  };

  const topSuspect = rankings[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f8fafc' }}>
          Reports & Data Export Center
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>
          Export forensic CSV spreadsheets and print official maritime incident audit documentation
        </p>
      </div>

      {/* Export Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <FileSpreadsheet size={28} color="#10b981" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>
              Spill Detections CSV
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Raw spatial metrics: Spill IDs, Centroids, Area ($km^2$), Perimeters, Confidence scores.
            </p>
          </div>
          <button
            onClick={handleDownloadSpillsCsv}
            className="glass-button"
            style={{ width: '100%', marginTop: '16px', justifyContent: 'center', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
          >
            <Download size={14} /> Download Spills CSV
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <FileSpreadsheet size={28} color="#38bdf8" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>
              Suspect Vessel Rankings CSV
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Full correlation rankings, MMSI, IMO, Risk Scores, Min Distance, Time Offset, Evidence.
            </p>
          </div>
          <button
            onClick={handleDownloadRankingsCsv}
            className="glass-button"
            style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
          >
            <Download size={14} /> Download Rankings CSV
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Printer size={28} color="#ef4444" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>
              Print Official PDF Report
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Styled executive incident audit document ready for browser print or PDF saving.
            </p>
          </div>
          <button
            onClick={handlePrintPdfReport}
            className="glass-button-danger"
            style={{ width: '100%', marginTop: '16px', justifyContent: 'center', border: 'none', padding: '10px 16px', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Printer size={14} /> Print Audit PDF
          </button>
        </div>
      </div>

      {/* Official Audit Document Live Preview */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #38bdf8', paddingBottom: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8' }}>MARITIME INCIDENT AUDIT REPORT PREVIEW</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>AI-Powered Sentinel-1 SAR & MarineCadastre AIS Correlation Analysis</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
              <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} /> VERIFIED AUDIT
            </span>
          </div>
        </div>

        {/* Audit Highlights */}
        <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#cbd5e1', marginBottom: '12px' }}>
            Executive Incident Summary
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Detected Slicks</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444', marginTop: '2px' }}>{spills.length}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Surface Area</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>
                {spills.reduce((a, b) => a + (b.area_km2 || 0), 0).toFixed(2)} km²
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Vessels Correlated</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#f8fafc', marginTop: '2px' }}>{rankings.length}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Primary Suspect Score</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444', marginTop: '2px' }}>
                {topSuspect ? `${topSuspect.correlation_score}%` : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {topSuspect && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#ef4444', marginBottom: '6px' }}>
              🚨 PRIMARY SUSPECT DISCHARGE VESSEL
            </h4>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
              {topSuspect.vessel_name} (MMSI: {topSuspect.mmsi})
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>
              Type: {topSuspect.vessel_type} | IMO: {topSuspect.imo} | CallSign: {topSuspect.callsign}
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>
              Closest Approach: {topSuspect.min_distance_km} km at {topSuspect.closest_approach?.timestamp} (Speed drop to {topSuspect.closest_approach?.sog} knots)
            </div>
          </div>
        )}

        {/* Audit Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0f172a', borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px' }}>Rank</th>
              <th style={{ padding: '10px' }}>Vessel Name</th>
              <th style={{ padding: '10px' }}>MMSI</th>
              <th style={{ padding: '10px' }}>Type</th>
              <th style={{ padding: '10px' }}>Risk Level</th>
              <th style={{ padding: '10px' }}>Min Distance</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map(r => (
              <tr key={r.mmsi} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '10px', fontWeight: '700' }}>#{r.rank}</td>
                <td style={{ padding: '10px', fontWeight: '700', color: '#38bdf8' }}>{r.vessel_name}</td>
                <td style={{ padding: '10px' }}>{r.mmsi}</td>
                <td style={{ padding: '10px' }}>{r.vessel_type}</td>
                <td style={{ padding: '10px' }}>
                  <span className={`badge badge-${r.risk_level.toLowerCase()}`}>
                    {r.risk_level} ({r.correlation_score}%)
                  </span>
                </td>
                <td style={{ padding: '10px' }}>{r.min_distance_km} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
