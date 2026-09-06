import pandas as pd
import io

class ReportGenerator:
    @staticmethod
    def generate_spills_csv(spills):
        """Generates CSV bytes for detected oil spills."""
        rows = []
        for s in spills:
            rows.append({
                "Spill_ID": s.get("spill_id"),
                "Centroid_Latitude": s.get("centroid_lat"),
                "Centroid_Longitude": s.get("centroid_lon"),
                "Area_SqKm": s.get("area_km2"),
                "Perimeter_Km": s.get("perimeter_km"),
                "Confidence_Score": s.get("confidence_score"),
                "Estimated_Spill_Time": s.get("estimated_spill_time")
            })
        df = pd.DataFrame(rows)
        output = io.StringIO()
        df.to_csv(output, index=False)
        return output.getvalue()

    @staticmethod
    def generate_correlations_csv(rankings):
        """Generates CSV bytes for vessel correlation rankings."""
        rows = []
        for r in rankings:
            rows.append({
                "Rank": r.get("rank"),
                "MMSI": r.get("mmsi"),
                "Vessel_Name": r.get("vessel_name"),
                "Vessel_Type": r.get("vessel_type"),
                "IMO": r.get("imo"),
                "CallSign": r.get("callsign"),
                "Risk_Level": r.get("risk_level"),
                "Correlation_Score_Pct": r.get("correlation_score"),
                "Min_Distance_Km": r.get("min_distance_km"),
                "Time_Delta_Mins": r.get("time_delta_mins"),
                "Closest_Approach_Timestamp": r.get("closest_approach", {}).get("timestamp"),
                "Closest_SOG_Knots": r.get("closest_approach", {}).get("sog"),
                "Evidence_Summary": " | ".join(r.get("evidence_summary", []))
            })
        df = pd.DataFrame(rows)
        output = io.StringIO()
        df.to_csv(output, index=False)
        return output.getvalue()

    @staticmethod
    def generate_html_report(spills, rankings, metadata=None):
        """Generates print-ready styled HTML report for export or browser printing."""
        meta = metadata or {}
        spill_count = len(spills)
        total_area = sum(s.get("area_km2", 0) for s in spills)
        top_suspect = rankings[0] if rankings else {}

        rankings_rows_html = ""
        for r in rankings[:5]: # Top 5
            color = "#ef4444" if r.get("risk_level") == "CRITICAL" else ("#f97316" if r.get("risk_level") == "HIGH" else "#eab308")
            rankings_rows_html += f"""
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #334155; font-weight: bold;">#{r.get('rank')}</td>
                <td style="padding: 10px; border-bottom: 1px solid #334155; font-weight: bold; color: #38bdf8;">{r.get('vessel_name')}</td>
                <td style="padding: 10px; border-bottom: 1px solid #334155;">{r.get('mmsi')}</td>
                <td style="padding: 10px; border-bottom: 1px solid #334155;">{r.get('vessel_type')}</td>
                <td style="padding: 10px; border-bottom: 1px solid #334155;"><span style="background: {color}; color: white; padding: 3px 8px; rounded: 4px; font-weight: 600;">{r.get('risk_level')} ({r.get('correlation_score')}%)</span></td>
                <td style="padding: 10px; border-bottom: 1px solid #334155;">{r.get('min_distance_km')} km</td>
                <td style="padding: 10px; border-bottom: 1px solid #334155;">{r.get('time_delta_mins')} mins</td>
            </tr>
            """

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Oil Spill Investigation Audit Report</title>
            <style>
                body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; margin: 0; }}
                .container {{ max-width: 900px; margin: auto; background: #1e293b; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; }}
                .header {{ display: flex; justify-content: space-between; border-bottom: 2px solid #38bdf8; padding-bottom: 15px; margin-bottom: 25px; }}
                .title {{ font-size: 24px; font-weight: bold; color: #38bdf8; }}
                .subtitle {{ font-size: 13px; color: #94a3b8; }}
                .kpi-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }}
                .kpi-card {{ background: #0f172a; padding: 15px; border-radius: 8px; border: 1px solid #334155; text-align: center; }}
                .kpi-value {{ font-size: 22px; font-weight: bold; color: #38bdf8; margin-top: 5px; }}
                .kpi-label {{ font-size: 12px; color: #94a3b8; text-transform: uppercase; }}
                table {{ width: 100%; border-collapse: collapse; margin-top: 15px; text-align: left; font-size: 14px; }}
                th {{ background: #0f172a; padding: 12px 10px; color: #94a3b8; text-transform: uppercase; font-size: 11px; border-bottom: 2px solid #334155; }}
                .suspect-box {{ background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 30px; }}
                .footer {{ margin-top: 40px; border-top: 1px solid #334155; padding-top: 20px; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div>
                        <div class="title">MARITIME INCIDENT AUDIT REPORT</div>
                        <div class="subtitle">AI-Powered Sentinel-1 SAR & MarineCadastre AIS Correlation Analysis</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 13px; color: #cbd5e1;">Report ID: <strong>REP-{datetime.utcnow().strftime("%Y%m%d-%H%M")}</strong></div>
                        <div style="font-size: 12px; color: #94a3b8;">Generated: {datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")}</div>
                    </div>
                </div>

                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-label">Spills Detected</div>
                        <div class="kpi-value">{spill_count}</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Total Slick Area</div>
                        <div class="kpi-value">{total_area:.2f} km²</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Vessels Correlated</div>
                        <div class="kpi-value">{len(rankings)}</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Max Risk Score</div>
                        <div class="kpi-value" style="color: #ef4444;">{top_suspect.get('correlation_score', 0)}%</div>
                    </div>
                </div>

                {"<div class='suspect-box'><h3 style='color: #ef4444; margin-top:0;'>⚠️ TOP SUSPECT DISCHARGE VESSEL</h3>" +
                 f"<div style='font-size: 18px; font-weight: bold;'>{top_suspect.get('vessel_name')} (MMSI: {top_suspect.get('mmsi')})</div>" +
                 f"<p style='color: #cbd5e1; font-size: 14px;'><strong>Type:</strong> {top_suspect.get('vessel_type')} | <strong>IMO:</strong> {top_suspect.get('imo')} | <strong>CallSign:</strong> {top_suspect.get('callsign')}</p>" +
                 f"<p style='color: #cbd5e1; font-size: 14px;'><strong>Closest Approach:</strong> {top_suspect.get('min_distance_km')} km at {top_suspect.get('closest_approach', {}).get('timestamp')} (Speed drop to {top_suspect.get('closest_approach', {}).get('sog')} knots)</p>" +
                 "<strong>Key Evidence Findings:</strong><ul>" + "".join([f"<li>{ev}</li>" for ev in top_suspect.get('evidence_summary', [])]) + "</ul></div>" if top_suspect else ""}

                <h3>Ranked Vessel Spatiotemporal Correlation Summary</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Vessel Name</th>
                            <th>MMSI</th>
                            <th>Type</th>
                            <th>Risk Score</th>
                            <th>Min Distance</th>
                            <th>Time Delta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings_rows_html}
                    </tbody>
                </table>

                <div class="footer">
                    <div>OilTrace AI System - Official Maritime SAR Spill & AIS Intelligence Engine</div>
                    <div>Page 1 of 1</div>
                </div>
            </div>
        </body>
        </html>
        """
        return html_content
