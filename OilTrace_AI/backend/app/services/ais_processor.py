import pandas as pd
import numpy as np
import io
from datetime import datetime

VESSEL_TYPE_MAP = {
    70: "Cargo", 71: "Cargo - Hazard A", 72: "Cargo - Hazard B", 73: "Cargo - Hazard C", 74: "Cargo - Hazard D",
    80: "Oil Tanker", 81: "Chemical Tanker", 82: "Liquified Gas Tanker", 89: "Tanker - Other",
    52: "Tug", 30: "Fishing", 60: "Passenger", 36: "Sailing", 50: "Pilot Vessel", 51: "Search & Rescue"
}

class AISProcessor:
    @staticmethod
    def parse_ais_csv(csv_content: str):
        """Parses MarineCadastre AIS CSV content and builds structured vessel trajectories."""
        try:
            df = pd.read_csv(io.StringIO(csv_content))
        except Exception as e:
            raise ValueError(f"Invalid AIS CSV format: {str(e)}")

        # Normalize column names to uppercase stripped strings
        cols_map = {col: col.strip().upper() for col in df.columns}
        df.rename(columns=cols_map, inplace=True)

        # Standard header checks / fallback aliases
        lat_col = next((c for c in ['LAT', 'LATITUDE', 'Y'] if c in df.columns), None)
        lon_col = next((c for c in ['LON', 'LONGITUDE', 'X'] if c in df.columns), None)
        mmsi_col = next((c for c in ['MMSI', 'VESSEL_MMSI'] if c in df.columns), None)
        time_col = next((c for c in ['BASEDATETIME', 'DATETIME', 'TIMESTAMP', 'TIME'] if c in df.columns), None)
        sog_col = next((c for c in ['SOG', 'SPEED'] if c in df.columns), 'SOG')
        cog_col = next((c for c in ['COG', 'COURSE'] if c in df.columns), 'COG')
        name_col = next((c for c in ['VESSELNAME', 'NAME', 'SHIPNAME'] if c in df.columns), 'VESSELNAME')
        type_col = next((c for c in ['VESSELTYPE', 'SHIPTYPE', 'TYPE'] if c in df.columns), 'VESSELTYPE')
        imo_col = next((c for c in ['IMO', 'IMO_NUMBER'] if c in df.columns), 'IMO')
        callsign_col = next((c for c in ['CALLSIGN', 'CALL_SIGN'] if c in df.columns), 'CALLSIGN')

        if not lat_col or not lon_col or not mmsi_col or not time_col:
            raise ValueError(f"CSV missing mandatory MarineCadastre AIS columns (MMSI, BaseDateTime, LAT, LON). Found columns: {list(df.columns)}")

        # Clean invalid values
        df = df.dropna(subset=[mmsi_col, lat_col, lon_col, time_col])
        df[lat_col] = pd.to_numeric(df[lat_col], errors='coerce')
        df[lon_col] = pd.to_numeric(df[lon_col], errors='coerce')
        df = df.dropna(subset=[lat_col, lon_col])

        # Parse timestamps safely
        df['parsed_time'] = pd.to_datetime(df[time_col], errors='coerce')
        df = df.dropna(subset=['parsed_time'])
        df = df.sort_values(by=[mmsi_col, 'parsed_time'])

        vessels_dict = {}
        for mmsi, group in df.groupby(mmsi_col):
            mmsi_str = str(int(mmsi))
            
            # Extract metadata from first record
            first_row = group.iloc[0]
            vessel_name = str(first_row.get(name_col, f"Vessel-{mmsi_str}")).strip()
            if vessel_name.lower() in ['nan', 'none', '']:
                vessel_name = f"Vessel-{mmsi_str}"

            raw_type = first_row.get(type_col, 0)
            try:
                type_code = int(float(raw_type)) if pd.notnull(raw_type) else 0
            except ValueError:
                type_code = 0
                
            vessel_type_desc = VESSEL_TYPE_MAP.get(type_code, "Commercial Vessel")
            imo = str(first_row.get(imo_col, "UNKNOWN")).strip()
            callsign = str(first_row.get(callsign_col, "N/A")).strip()
            length = float(first_row.get('LENGTH', 150)) if 'LENGTH' in group.columns and pd.notnull(first_row.get('LENGTH')) else 150.0

            trajectory = []
            sogs = []
            cogs = []
            
            for idx, row in group.iterrows():
                sog = float(row.get(sog_col, 0.0)) if pd.notnull(row.get(sog_col)) else 0.0
                cog = float(row.get(cog_col, 0.0)) if pd.notnull(row.get(cog_col)) else 0.0
                heading = float(row.get('HEADING', cog)) if 'HEADING' in group.columns and pd.notnull(row.get('HEADING')) else cog
                
                sogs.append(sog)
                cogs.append(cog)

                trajectory.append({
                    "timestamp": row['parsed_time'].strftime("%Y-%m-%dT%H:%M:%S"),
                    "lat": round(float(row[lat_col]), 5),
                    "lon": round(float(row[lon_col]), 5),
                    "sog": round(sog, 1),
                    "cog": round(cog, 1),
                    "heading": round(heading, 1)
                })

            avg_sog = float(np.mean(sogs)) if sogs else 0.0
            min_sog = float(np.min(sogs)) if sogs else 0.0
            max_sog = float(np.max(sogs)) if sogs else 0.0

            vessels_dict[mmsi_str] = {
                "mmsi": mmsi_str,
                "vessel_name": vessel_name,
                "imo": imo,
                "callsign": callsign,
                "vessel_type": vessel_type_desc,
                "vessel_type_code": type_code,
                "length_m": length,
                "total_points": len(trajectory),
                "avg_sog_knots": round(avg_sog, 1),
                "min_sog_knots": round(min_sog, 1),
                "max_sog_knots": round(max_sog, 1),
                "start_time": trajectory[0]["timestamp"] if trajectory else None,
                "end_time": trajectory[-1]["timestamp"] if trajectory else None,
                "trajectory": trajectory
            }

        return {
            "status": "success",
            "total_records_parsed": len(df),
            "total_unique_vessels": len(vessels_dict),
            "vessels": list(vessels_dict.values())
        }
