import os
import cv2
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from app.config import SAMPLES_DIR, DEFAULT_CENTER_LAT, DEFAULT_CENTER_LON

def ensure_sample_data():
    """Generates sample Sentinel-1 SAR imagery and MarineCadastre AIS CSV if not present."""
    sar_image_path = SAMPLES_DIR / "sentinel1_sar_sample.png"
    ais_csv_path = SAMPLES_DIR / "marinecadastre_ais_sample.csv"

    # Generate SAR sample if missing
    if not sar_image_path.exists():
        generate_sample_sar_image(sar_image_path)

    # Generate AIS CSV sample if missing
    if not ais_csv_path.exists():
        generate_sample_ais_csv(ais_csv_path)

    return {
        "sar_image": str(sar_image_path),
        "ais_csv": str(ais_csv_path)
    }

def generate_sample_sar_image(output_path):
    """Creates a synthetic Sentinel-1 SAR image (512x512) with sea surface texture, dark oil slick, and vessel targets."""
    height, width = 512, 512
    
    # 1. Base ocean backscatter intensity (~160 out of 255 with Rayleigh speckle noise)
    mean_sea = 150
    speckle = np.random.exponential(scale=25, size=(height, width)).astype(np.float32)
    sea_surface = np.full((height, width), mean_sea, dtype=np.float32) + speckle - 12
    
    # 2. Add subtle wind wave gradient patterns across SAR scene
    x = np.linspace(0, 4 * np.pi, width)
    y = np.linspace(0, 4 * np.pi, height)
    xx, yy = np.meshgrid(x, y)
    waves = 10 * np.sin(xx * 0.5 + yy * 0.3)
    sea_surface += waves

    # 3. Create dark oil slick polygon (low backscatter, suppressed surface capillary waves)
    slick_mask = np.zeros((height, width), dtype=np.uint8)
    
    # Irregular oil spill shapes (main slick + smaller elongated trail)
    pts1 = np.array([[200, 180], [280, 160], [350, 210], [380, 270], [310, 320], [220, 300], [170, 240]], np.int32)
    pts1 = pts1.reshape((-1, 1, 2))
    cv2.fillPoly(slick_mask, [pts1], 255)
    
    # Secondary slick tail (linear trailing discharge from moving vessel)
    cv2.line(slick_mask, (380, 270), (450, 360), 255, thickness=28)
    
    # Smooth slick edges with Gaussian blur to mimic ocean diffusion
    slick_mask_blurred = cv2.GaussianBlur(slick_mask, (21, 21), 0)
    
    # Apply slick attenuation: oil reduces radar backscatter intensity by ~60-80 dB / brightness
    attenuation_factor = 1.0 - (slick_mask_blurred.astype(np.float32) / 255.0) * 0.70
    sar_image = sea_surface * attenuation_factor
    
    # 4. Add bright metallic point targets (vessels appearing as strong radar reflectors)
    # Suspect vessel right at slick tail tip (450, 360)
    cv2.circle(sar_image, (450, 360), 4, (255), -1)
    cv2.circle(sar_image, (450, 360), 8, (240), 1)
    
    # Neighboring innocent vessels
    cv2.circle(sar_image, (120, 100), 4, (250), -1)
    cv2.circle(sar_image, (400, 80), 3, (245), -1)
    cv2.circle(sar_image, (90, 410), 3, (245), -1)

    # Clip to valid 8-bit image range
    sar_image = np.clip(sar_image, 0, 255).astype(np.uint8)
    
    cv2.imwrite(str(output_path), sar_image)

def generate_sample_ais_csv(output_path):
    """Generates MarineCadastre compliant AIS CSV dataset with realistic vessel trajectories near slick area."""
    now = datetime.utcnow()
    spill_time = now - timedelta(hours=3)
    
    center_lat = DEFAULT_CENTER_LAT
    center_lon = DEFAULT_CENTER_LON
    
    # Vessels: 1 Suspect, 3 Innocent passing traffic
    vessels = [
        {
            "MMSI": "235091234",
            "VesselName": "OCEAN IMPERIAL",
            "IMO": "IMO9482710",
            "CallSign": "MBXZ9",
            "VesselType": 80, # Oil Tanker
            "Length": 245,
            "Width": 42,
            "Status": 0, # Underway using engine
            "type_desc": "Tanker",
            # Trajectory crosses right through spill centroid around spill_time
            "start_lat": center_lat - 0.08,
            "start_lon": center_lon - 0.09,
            "end_lat": center_lat + 0.09,
            "end_lon": center_lon + 0.10,
            "sog_normal": 14.5,
            "has_speed_anomaly": True, # Slows down near spill site
            "suspect": True
        },
        {
            "MMSI": "311000854",
            "VesselName": "MAERSK VISBY",
            "IMO": "IMO9312944",
            "CallSign": "OU281",
            "VesselType": 70, # Cargo
            "Length": 298,
            "Width": 38,
            "Status": 0,
            "type_desc": "Cargo",
            "start_lat": center_lat - 0.12,
            "start_lon": center_lon + 0.05,
            "end_lat": center_lat + 0.12,
            "end_lon": center_lon + 0.07,
            "sog_normal": 18.2,
            "has_speed_anomaly": False,
            "suspect": False
        },
        {
            "MMSI": "211442000",
            "VesselName": "NORDIC TRAVELLER",
            "IMO": "IMO9621183",
            "CallSign": "DK992",
            "VesselType": 81, # Crude Tanker
            "Length": 180,
            "Width": 30,
            "Status": 0,
            "type_desc": "Tanker",
            "start_lat": center_lat + 0.05,
            "start_lon": center_lon - 0.14,
            "end_lat": center_lat + 0.06,
            "end_lon": center_lon + 0.12,
            "sog_normal": 12.0,
            "has_speed_anomaly": False,
            "suspect": False
        },
        {
            "MMSI": "244670112",
            "VesselName": "SEA TITAN",
            "IMO": "IMO9104432",
            "CallSign": "PCEW",
            "VesselType": 52, # Tug
            "Length": 45,
            "Width": 12,
            "Status": 0,
            "type_desc": "Tug",
            "start_lat": center_lat - 0.04,
            "start_lon": center_lon - 0.12,
            "end_lat": center_lat - 0.05,
            "end_lon": center_lon - 0.02,
            "sog_normal": 9.4,
            "has_speed_anomaly": False,
            "suspect": False
        }
    ]
    
    rows = []
    num_timestamps = 13 # Hourly/15-min increments across a 6 hour window
    start_time = spill_time - timedelta(hours=3)
    
    for v in vessels:
        lats = np.linspace(v["start_lat"], v["end_lat"], num_timestamps)
        lons = np.linspace(v["start_lon"], v["end_lon"], num_timestamps)
        
        # Calculate initial COG (Course Over Ground)
        d_lat = v["end_lat"] - v["start_lat"]
        d_lon = v["end_lon"] - v["start_lon"]
        base_cog = round((np.degrees(np.arctan2(d_lon, d_lat)) + 360) % 360, 1)
        
        for i in range(num_timestamps):
            timestamp = start_time + timedelta(minutes=i * 30)
            lat = float(lats[i])
            lon = float(lons[i])
            
            sog = v["sog_normal"]
            cog = base_cog
            
            # Inject speed anomaly for suspect vessel near middle of trajectory (spill location)
            if v["has_speed_anomaly"] and (5 <= i <= 7):
                sog = round(sog * 0.35, 1) # Sudden drop to 5 knots (discharge/slow maneuvering)
                cog = (cog + 25) % 360    # Slight course drift while discharging
            else:
                sog = round(sog + np.random.normal(0, 0.3), 1)
            
            rows.append({
                "MMSI": v["MMSI"],
                "BaseDateTime": timestamp.strftime("%Y-%m-%dT%H:%M:%S"),
                "LAT": round(lat, 5),
                "LON": round(lon, 5),
                "SOG": max(0.0, sog),
                "COG": round(cog, 1),
                "Heading": round(cog, 1),
                "VesselName": v["VesselName"],
                "IMO": v["IMO"],
                "CallSign": v["CallSign"],
                "VesselType": v["VesselType"],
                "Status": v["Status"],
                "Length": v["Length"],
                "Width": v["Width"],
                "Draft": 11.5,
                "Cargo": 80
            })
            
    df = pd.DataFrame(rows)
    df.to_csv(str(output_path), index=False)
