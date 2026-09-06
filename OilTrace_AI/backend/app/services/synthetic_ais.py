import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from app.config import DEFAULT_CENTER_LAT, DEFAULT_CENTER_LON

def generate_synthetic_vessels(center_lat=DEFAULT_CENTER_LAT, center_lon=DEFAULT_CENTER_LON, count=6, spill_time_str=None):
    """Generates realistic synthetic MarineCadastre AIS vessel trajectories near a target spill coordinate."""
    if spill_time_str:
        try:
            base_time = datetime.strptime(spill_time_str.replace(" UTC", ""), "%Y-%m-%d %H:%M:%S")
        except Exception:
            base_time = datetime.utcnow() - timedelta(hours=3)
    else:
        base_time = datetime.utcnow() - timedelta(hours=3)

    vessel_templates = [
        {"name": "ATLANTIC DISCOVERER", "mmsi": "228391000", "imo": "IMO9723011", "callsign": "FN8921", "type": 80, "type_desc": "Oil Tanker", "len": 274, "wid": 48, "suspect": True},
        {"name": "EVER GLOBE", "mmsi": "353912000", "imo": "IMO9811002", "callsign": "H3VR", "type": 70, "type_desc": "Cargo - Container", "len": 400, "wid": 59, "suspect": False},
        {"name": "NORDIC STAR", "mmsi": "258204000", "imo": "IMO9412099", "callsign": "LA921", "type": 81, "type_desc": "Chemical Tanker", "len": 183, "wid": 32, "suspect": False},
        {"name": "BALTIC GUARDIAN", "mmsi": "211094320", "imo": "IMO9081234", "callsign": "DG219", "type": 52, "type_desc": "Tug / Supply", "len": 55, "wid": 14, "suspect": False},
        {"name": "SEA TRADER", "mmsi": "636092100", "imo": "IMO9334109", "callsign": "A8XX9", "type": 70, "type_desc": "General Cargo", "len": 190, "wid": 28, "suspect": False},
        {"name": "NORTH SEA SEEKER", "mmsi": "235118900", "imo": "IMO9192837", "callsign": "MA991", "type": 30, "type_desc": "Fishing Vessel", "len": 38, "wid": 9, "suspect": False}
    ]

    selected_templates = vessel_templates[:min(count, len(vessel_templates))]
    vessels = []
    
    num_pts = 12
    start_time = base_time - timedelta(hours=2.5)

    for i, t in enumerate(selected_templates):
        is_suspect = t["suspect"]
        
        if is_suspect:
            # Passes directly through center_lat, center_lon at t=6 (spill_time)
            start_lat = center_lat - 0.08
            start_lon = center_lon - 0.09
            end_lat = center_lat + 0.08
            end_lon = center_lon + 0.09
            base_sog = 13.8
        else:
            # Off-center transit routes
            angle = i * (2 * np.pi / count)
            offset_lat = 0.06 * np.cos(angle) + np.random.uniform(-0.02, 0.02)
            offset_lon = 0.06 * np.sin(angle) + np.random.uniform(-0.02, 0.02)
            start_lat = center_lat + offset_lat - 0.07
            start_lon = center_lon + offset_lon - 0.07
            end_lat = center_lat + offset_lat + 0.07
            end_lon = center_lon + offset_lon + 0.07
            base_sog = 10.0 + i * 1.5

        lats = np.linspace(start_lat, end_lat, num_pts)
        lons = np.linspace(start_lon, end_lon, num_pts)

        d_lat = end_lat - start_lat
        d_lon = end_lon - start_lon
        base_cog = round((np.degrees(np.arctan2(d_lon, d_lat)) + 360) % 360, 1)

        trajectory = []
        sogs = []
        cogs = []

        for p in range(num_pts):
            pt_time = start_time + timedelta(minutes=p * 25)
            lat = float(lats[p])
            lon = float(lons[p])

            sog = base_sog
            cog = base_cog

            # Inject speed drop & course deviation anomaly for suspect vessel near spill site
            if is_suspect and (5 <= p <= 7):
                sog = round(sog * 0.32, 1)  # Drop to ~4.4 knots (slow discharge)
                cog = round((cog + 22.0) % 360, 1)
            else:
                sog = round(max(1.0, sog + np.random.normal(0, 0.25)), 1)

            sogs.append(sog)
            cogs.append(cog)

            trajectory.append({
                "timestamp": pt_time.strftime("%Y-%m-%dT%H:%M:%S"),
                "lat": round(lat, 5),
                "lon": round(lon, 5),
                "sog": sog,
                "cog": cog,
                "heading": cog
            })

        vessels.append({
            "mmsi": t["mmsi"],
            "vessel_name": t["name"],
            "imo": t["imo"],
            "callsign": t["callsign"],
            "vessel_type": t["type_desc"],
            "vessel_type_code": t["type"],
            "length_m": t["len"],
            "total_points": len(trajectory),
            "avg_sog_knots": round(float(np.mean(sogs)), 1),
            "min_sog_knots": round(float(np.min(sogs)), 1),
            "max_sog_knots": round(float(np.max(sogs)), 1),
            "start_time": trajectory[0]["timestamp"],
            "end_time": trajectory[-1]["timestamp"],
            "trajectory": trajectory
        })

    return {
        "status": "success",
        "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "total_unique_vessels": len(vessels),
        "center_reference": {"lat": center_lat, "lon": center_lon},
        "vessels": vessels
    }
