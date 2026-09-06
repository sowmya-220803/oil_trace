from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, HTMLResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os

from app.config import DEFAULT_CENTER_LAT, DEFAULT_CENTER_LON
from app.services.sample_generator import ensure_sample_data
from app.services.sar_processor import SARProcessor
from app.services.ais_processor import AISProcessor
from app.services.synthetic_ais import generate_synthetic_vessels
from app.services.correlation_engine import CorrelationEngine
from app.services.report_generator import ReportGenerator

app = FastAPI(
    title="AI-Powered Oil Spill Detection & Vessel Correlation API",
    description="Sentinel-1 SAR Satellite Image Processing, MarineCadastre AIS Trajectory Analysis & Spatiotemporal Correlation Engine",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite port 5173 / localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Request Body Schemas
class CorrelationRequest(BaseModel):
    spills: List[Dict[str, Any]]
    vessels: List[Dict[str, Any]]
    weights: Optional[Dict[str, float]] = None

class SyntheticAISRequest(BaseModel):
    center_lat: float = DEFAULT_CENTER_LAT
    center_lon: float = DEFAULT_CENTER_LON
    count: int = 6
    spill_time: Optional[str] = None

class ExportCSVRequest(BaseModel):
    data: List[Dict[str, Any]]

class ExportReportRequest(BaseModel):
    spills: List[Dict[str, Any]]
    rankings: List[Dict[str, Any]]
    metadata: Optional[Dict[str, Any]] = None

@app.on_event("startup")
def startup_event():
    """Ensure sample datasets are initialized on startup."""
    ensure_sample_data()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "system": "AI-Powered Oil Spill Detection & Vessel Correlation Engine",
        "version": "1.0.0",
        "status_code": 200
    }

@app.get("/api/demo")
def run_full_demo():
    """Runs complete end-to-end workflow automatically from sample SAR -> detection -> AIS -> correlation -> ranking."""
    sample_files = ensure_sample_data()
    
    # 1. Process sample SAR image
    sar_proc = SARProcessor(center_lat=DEFAULT_CENTER_LAT, center_lon=DEFAULT_CENTER_LON)
    with open(sample_files["sar_image"], "rb") as f:
        sar_result = sar_proc.process_sar_image(f.read(), sensitivity=0.5)

    # 2. Parse sample MarineCadastre AIS CSV
    with open(sample_files["ais_csv"], "r", encoding="utf-8") as f:
        ais_result = AISProcessor.parse_ais_csv(f.read())

    # 3. Execute spatiotemporal correlation
    corr_result = CorrelationEngine.calculate_correlation(
        spills=sar_result["spills"],
        vessels=ais_result["vessels"]
    )

    return {
        "status": "success",
        "demo_mode": True,
        "sar_analysis": sar_result,
        "ais_data": ais_result,
        "correlation": corr_result
    }

@app.post("/api/sar/upload")
async def upload_sar_image(
    file: UploadFile = File(...),
    sensitivity: float = Form(0.5),
    min_area_km2: float = Form(0.1),
    center_lat: float = Form(DEFAULT_CENTER_LAT),
    center_lon: float = Form(DEFAULT_CENTER_LON)
):
    """Processes uploaded Sentinel-1 SAR image and returns detected oil slick masks & spatial metrics."""
    try:
        contents = await file.read()
        processor = SARProcessor(center_lat=center_lat, center_lon=center_lon)
        result = processor.process_sar_image(contents, sensitivity=sensitivity, min_area_km2=min_area_km2)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/sar/sample")
def process_sample_sar():
    """Processes the default sample SAR satellite image."""
    sample_files = ensure_sample_data()
    processor = SARProcessor(center_lat=DEFAULT_CENTER_LAT, center_lon=DEFAULT_CENTER_LON)
    with open(sample_files["sar_image"], "rb") as f:
        return processor.process_sar_image(f.read(), sensitivity=0.5)

@app.post("/api/ais/upload")
async def upload_ais_csv(file: UploadFile = File(...)):
    """Uploads and parses MarineCadastre format AIS CSV file."""
    try:
        contents = await file.read()
        csv_str = contents.decode("utf-8")
        result = AISProcessor.parse_ais_csv(csv_str)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/ais/synthetic")
def generate_synthetic_ais(req: SyntheticAISRequest):
    """Generates synthetic AIS vessel trajectories around specified coordinates if AIS dataset is unavailable."""
    try:
        result = generate_synthetic_vessels(
            center_lat=req.center_lat,
            center_lon=req.center_lon,
            count=req.count,
            spill_time_str=req.spill_time
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/correlation/analyze")
def run_correlation(req: CorrelationRequest):
    """Calculates spatio-temporal correlation between oil spill slicks and vessel trajectories."""
    try:
        result = CorrelationEngine.calculate_correlation(
            spills=req.spills,
            vessels=req.vessels,
            weights=req.weights
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/export/csv/spills")
def export_spills_csv(body: Dict[str, Any]):
    """Exports detected oil spills as CSV file."""
    spills = body.get("spills", [])
    csv_content = ReportGenerator.generate_spills_csv(spills)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=oil_spill_detections.csv"}
    )

@app.post("/api/export/csv/rankings")
def export_rankings_csv(body: Dict[str, Any]):
    """Exports vessel correlation rankings as CSV file."""
    rankings = body.get("rankings", [])
    csv_content = ReportGenerator.generate_correlations_csv(rankings)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=suspect_vessel_rankings.csv"}
    )

@app.post("/api/export/report")
def export_html_report(req: ExportReportRequest):
    """Generates styled printable HTML audit report."""
    html_content = ReportGenerator.generate_html_report(
        spills=req.spills,
        rankings=req.rankings,
        metadata=req.metadata
    )
    return HTMLResponse(content=html_content)
