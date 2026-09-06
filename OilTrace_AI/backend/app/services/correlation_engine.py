import numpy as np
from datetime import datetime
import math

class CorrelationEngine:
    @staticmethod
    def haversine_distance_km(lat1, lon1, lat2, lon2):
        """Calculates distance between two lat/lon coordinates in kilometers using Haversine formula."""
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    @classmethod
    def calculate_correlation(cls, spills, vessels, weights=None):
        """Calculates spatial-temporal correlation scores and ranks suspect vessels for each detected oil spill."""
        if not weights:
            weights = {
                "distance": 0.35,
                "time": 0.25,
                "trajectory": 0.20,
                "speed": 0.10,
                "heading": 0.10
            }

        # Normalize weights to sum to 1.0
        weight_sum = sum(weights.values())
        w_dist = weights.get("distance", 0.35) / weight_sum
        w_time = weights.get("time", 0.25) / weight_sum
        w_traj = weights.get("trajectory", 0.20) / weight_sum
        w_speed = weights.get("speed", 0.10) / weight_sum
        w_heading = weights.get("heading", 0.10) / weight_sum

        correlation_results = []

        for spill in spills:
            spill_id = spill.get("spill_id", "SPILL-001")
            spill_lat = spill["centroid_lat"]
            spill_lon = spill["centroid_lon"]
            spill_area = spill.get("area_km2", 1.0)
            
            # Estimated spill time
            raw_time = spill.get("estimated_spill_time", datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"))
            try:
                clean_time = raw_time.replace(" UTC", "").replace("T", " ")
                spill_time = datetime.strptime(clean_time, "%Y-%m-%d %H:%M:%S")
            except Exception:
                spill_time = datetime.utcnow()

            vessel_rankings = []

            for vessel in vessels:
                mmsi = vessel["mmsi"]
                vessel_name = vessel["vessel_name"]
                vessel_type = vessel.get("vessel_type", "Unknown")
                trajectory = vessel.get("trajectory", [])

                if not trajectory:
                    continue

                min_dist_km = float('inf')
                closest_point = None
                time_deltas_min = []
                closest_time_delta_min = float('inf')

                # Speed & Course analysis around slick
                near_slick_sogs = []
                far_slick_sogs = []
                cogs = [pt["cog"] for pt in trajectory]

                for pt in trajectory:
                    pt_lat = pt["lat"]
                    pt_lon = pt["lon"]
                    pt_sog = pt["sog"]
                    dist = cls.haversine_distance_km(spill_lat, spill_lon, pt_lat, pt_lon)

                    # Time difference
                    try:
                        pt_time = datetime.strptime(pt["timestamp"].replace("T", " "), "%Y-%m-%d %H:%M:%S")
                        dt_min = abs((pt_time - spill_time).total_seconds()) / 60.0
                    except Exception:
                        dt_min = 0.0

                    if dist < min_dist_km:
                        min_dist_km = dist
                        closest_point = pt
                        closest_time_delta_min = dt_min

                    if dist <= 3.0: # Within 3km of spill
                        near_slick_sogs.append(pt_sog)
                    else:
                        far_slick_sogs.append(pt_sog)

                # 1. Spatial Distance Score (1.0 at 0km, 0.0 at 10km+)
                score_dist = max(0.0, 1.0 - (min_dist_km / 10.0))
                if min_dist_km <= 0.3:
                    score_dist = 1.0

                # 2. Time Delta Score (exponential decay with half-life of 60 mins)
                score_time = math.exp(-closest_time_delta_min / 60.0)

                # 3. Trajectory Alignment Score
                # Intersects or buffer proximity
                if min_dist_km <= 0.5:
                    score_traj = 1.0
                elif min_dist_km <= 2.5:
                    score_traj = 0.75
                elif min_dist_km <= 5.0:
                    score_traj = 0.40
                else:
                    score_traj = 0.10

                # 4. Speed Anomaly Score
                # High score if vessel slowed down near slick relative to normal transit speed
                if near_slick_sogs and far_slick_sogs:
                    avg_far = float(np.mean(far_slick_sogs))
                    min_near = float(np.min(near_slick_sogs))
                    speed_drop = max(0.0, avg_far - min_near)
                    score_speed = min(1.0, speed_drop / 6.0)
                elif near_slick_sogs:
                    min_near = float(np.min(near_slick_sogs))
                    score_speed = 0.8 if min_near < 6.0 else 0.2
                else:
                    score_speed = 0.0

                # 5. Heading Variance / Course Change Score
                if len(cogs) > 1:
                    cog_std = float(np.std(cogs))
                    score_heading = min(1.0, cog_std / 25.0)
                else:
                    score_heading = 0.0

                # Composite Risk Score (0 to 100%)
                total_score = (
                    (w_dist * score_dist) +
                    (w_time * score_time) +
                    (w_traj * score_traj) +
                    (w_speed * score_speed) +
                    (w_heading * score_heading)
                ) * 100.0

                total_score = round(total_score, 1)

                # Risk Level Categorization
                if total_score >= 78.0:
                    risk_level = "CRITICAL"
                    badge_color = "red"
                elif total_score >= 60.0:
                    risk_level = "HIGH"
                    badge_color = "orange"
                elif total_score >= 40.0:
                    risk_level = "MEDIUM"
                    badge_color = "yellow"
                else:
                    risk_level = "LOW"
                    badge_color = "blue"

                # Evidence Breakdown Generation
                evidence = []
                if min_dist_km <= 1.0:
                    evidence.append(f"Direct trajectory overlap: Passed within {min_dist_km:.2f} km of slick centroid")
                elif min_dist_km <= 5.0:
                    evidence.append(f"Proximity: Passed within {min_dist_km:.2f} km of slick area")

                if closest_time_delta_min <= 45:
                    evidence.append(f"Precise time match: Present {closest_time_delta_min:.0f} mins from estimated spill formation")

                if near_slick_sogs and float(np.min(near_slick_sogs)) < 6.0:
                    evidence.append(f"Speed anomaly: Speed dropped to {min(near_slick_sogs):.1f} knots near slick site (possible discharge maneuver)")

                if "Tanker" in vessel_type:
                    evidence.append("Vessel profile: Cargo tank vessel carrying liquid petroleum/chemical cargo")

                if not evidence:
                    evidence.append("No suspicious operational anomalies detected along route")

                vessel_rankings.append({
                    "mmsi": mmsi,
                    "vessel_name": vessel_name,
                    "vessel_type": vessel_type,
                    "imo": vessel.get("imo", "N/A"),
                    "callsign": vessel.get("callsign", "N/A"),
                    "length_m": vessel.get("length_m", 150),
                    "correlation_score": total_score,
                    "risk_level": risk_level,
                    "badge_color": badge_color,
                    "min_distance_km": round(min_dist_km, 2),
                    "time_delta_mins": round(closest_time_delta_min, 1),
                    "closest_approach": {
                        "timestamp": closest_point["timestamp"] if closest_point else "N/A",
                        "lat": closest_point["lat"] if closest_point else spill_lat,
                        "lon": closest_point["lon"] if closest_point else spill_lon,
                        "sog": closest_point["sog"] if closest_point else 0.0,
                        "cog": closest_point["cog"] if closest_point else 0.0
                    },
                    "score_components": {
                        "distance_score": round(score_dist * 100, 1),
                        "time_score": round(score_time * 100, 1),
                        "trajectory_score": round(score_traj * 100, 1),
                        "speed_anomaly_score": round(score_speed * 100, 1),
                        "heading_score": round(score_heading * 100, 1)
                    },
                    "evidence_summary": evidence,
                    "trajectory": trajectory
                })

            # Sort rankings by total correlation score descending
            vessel_rankings.sort(key=lambda x: x["correlation_score"], reverse=True)

            # Assign rank numbers (1, 2, 3...)
            for rank_idx, v_rank in enumerate(vessel_rankings, 1):
                v_rank["rank"] = rank_idx

            correlation_results.append({
                "spill_id": spill_id,
                "centroid_lat": spill_lat,
                "centroid_lon": spill_lon,
                "spill_area_km2": spill_area,
                "polygon_geojson": spill.get("polygon_geojson"),
                "total_vessels_analyzed": len(vessels),
                "top_suspect_vessel": vessel_rankings[0]["vessel_name"] if vessel_rankings else "None",
                "max_correlation_score": vessel_rankings[0]["correlation_score"] if vessel_rankings else 0.0,
                "rankings": vessel_rankings
            })

        return {
            "status": "success",
            "weights_used": weights,
            "spill_correlations": correlation_results
        }
