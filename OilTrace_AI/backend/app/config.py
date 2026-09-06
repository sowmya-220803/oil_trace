import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
SAMPLES_DIR = BASE_DIR / "samples"
OUTPUT_DIR = BASE_DIR / "outputs"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
SAMPLES_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Default synthetic maritime spatial boundaries (e.g. North Sea / English Channel Shipping Lane)
DEFAULT_CENTER_LAT = 53.2500
DEFAULT_CENTER_LON = 3.4500
DEFAULT_PIXEL_SCALE_KM = 0.05  # 50 meters per pixel for 512x512 SAR chip -> ~25.6km x 25.6km scene
