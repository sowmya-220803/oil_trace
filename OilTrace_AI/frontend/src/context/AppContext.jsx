import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Theme States
  const [activeTab, setActiveTab] = useState('landing'); // Default view is Landing Page
  const [theme, setTheme] = useState('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // System & Demo States
  const [loading, setLoading] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);

  // Core Data States (Unified Investigation Data Model)
  const [sarData, setSarData] = useState(null);
  const [aisData, setAisData] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState(null);

  // Correlation Weights
  const [weights, setWeights] = useState({
    distance: 0.35,
    time: 0.25,
    trajectory: 0.20,
    speed: 0.10,
    heading: 0.10
  });

  // Investigation Audit Timeline Events
  const [timelineEvents, setTimelineEvents] = useState([
    { id: 1, time: '10:42 UTC', title: 'Sentinel-1 SAR Scene Acquired', type: 'sar', status: 'Completed', detail: 'Sentinel-1B IW GRDH C-band SAR satellite pass over Gulf of Mexico Sector 4B.' },
    { id: 2, time: '10:48 UTC', title: 'SAR Imagery Preprocessing', type: 'sar', status: 'Completed', detail: 'Speckle filtering (Lee Filter 5x5), land masking, and radiometric calibration finished.' },
    { id: 3, time: '10:49 UTC', title: 'AI U-Net Segmentation Complete', type: 'ai', status: 'Completed', detail: 'Anomalous dark backscatter slick patch detected with 94.2% confidence.' },
    { id: 4, time: '10:50 UTC', title: 'Spill Geometry & Area Calculated', type: 'gis', status: 'Completed', detail: 'Slick polygon generated. Surface Area: 63.54 km², Centroid: 28.4521° N, 89.1234° W.' },
    { id: 5, time: '10:52 UTC', title: 'MarineCadastre AIS Feed Retrieved', type: 'ais', status: 'Completed', detail: '6 commercial vessels identified within 25 km radius during 3-hour temporal window.' },
    { id: 6, time: '10:54 UTC', title: 'Spatiotemporal Correlation Engine', type: 'engine', status: 'Completed', detail: 'Calculated 5-factor correlation scores for candidate vessels.' },
    { id: 7, time: '10:55 UTC', title: 'Candidate Vessel Rankings Generated', type: 'ranking', status: 'Completed', detail: 'Primary candidate identified: OCEAN IMPERIAL (MMSI: 235091234, 76% Correlation Score).' }
  ]);

  // Sync Theme with HTML root attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initial load: Fetch default sample demo data
  useEffect(() => {
    runFullDemo();
  }, []);

  const runFullDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/demo`);
      if (res.data.status === 'success') {
        setSarData(res.data.sar_analysis);
        setAisData(res.data.ais_data);
        setCorrelationData(res.data.correlation);
        if (res.data.correlation?.rankings?.length > 0) {
          setSelectedVessel(res.data.correlation.rankings[0]);
        }
        setDemoActive(true);
      }
    } catch (err) {
      console.warn("Failed to connect to backend, loading rich local mock data for demo mode:", err);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockSar = {
      image_name: "Sentinel1_SAR_Gulf_20260916.tif",
      timestamp: "2026-09-16T10:49:00Z",
      center_lat: 28.4521,
      center_lon: -89.1234,
      total_spills_detected: 1,
      spills: [
        {
          id: "SPILL-2026-001",
          centroid: [28.4521, -89.1234],
          estimated_area_km2: 63.54,
          confidence_score: 0.942,
          detection_time: "2026-09-16 10:49:00 UTC",
          slick_type: "Heavy Crude Oil Slick",
          perimeter_km: 41.2
        }
      ],
      mask_base64: null
    };

    const mockAis = {
      total_vessels: 4,
      vessels: [
        {
          mmsi: 235091234,
          vessel_name: "OCEAN IMPERIAL",
          type: "Tanker",
          flag: "Panama",
          latitude: 28.4610,
          longitude: -89.1120,
          speed: 12.4,
          course: 142.0,
          timestamp: "2026-09-16T10:07:00Z",
          trajectory: [
            { lat: 28.4820, lon: -89.1550, time: "09:30 UTC", speed: 13.1 },
            { lat: 28.4610, lon: -89.1120, time: "10:07 UTC", speed: 12.4 },
            { lat: 28.4350, lon: -89.0700, time: "10:45 UTC", speed: 12.0 }
          ]
        },
        {
          mmsi: 311000891,
          vessel_name: "MAERSK VISBY",
          type: "Container Ship",
          flag: "Denmark",
          latitude: 28.4900,
          longitude: -89.0800,
          speed: 18.2,
          course: 110.0,
          timestamp: "2026-09-16T10:15:00Z",
          trajectory: [
            { lat: 28.5200, lon: -89.1700, time: "09:40 UTC", speed: 18.5 },
            { lat: 28.4900, lon: -89.0800, time: "10:15 UTC", speed: 18.2 }
          ]
        },
        {
          mmsi: 477123900,
          vessel_name: "NORDIC TRAVELLER",
          type: "Bulk Carrier",
          flag: "Liberia",
          latitude: 28.4100,
          longitude: -89.1900,
          speed: 9.8,
          course: 45.0,
          timestamp: "2026-09-16T10:20:00Z",
          trajectory: [
            { lat: 28.3800, lon: -89.2300, time: "09:50 UTC", speed: 10.0 },
            { lat: 28.4100, lon: -89.1900, time: "10:20 UTC", speed: 9.8 }
          ]
        },
        {
          mmsi: 538002110,
          vessel_name: "SEA TITAN",
          type: "Tug / Supply",
          flag: "Marshall Islands",
          latitude: 28.3900,
          longitude: -89.0500,
          speed: 6.5,
          course: 220.0,
          timestamp: "2026-09-16T10:30:00Z",
          trajectory: [
            { lat: 28.4200, lon: -89.0200, time: "10:00 UTC", speed: 6.8 },
            { lat: 28.3900, lon: -89.0500, time: "10:30 UTC", speed: 6.5 }
          ]
        }
      ]
    };

    const mockCorrelation = {
      spill_id: "SPILL-2026-001",
      rankings: [
        {
          mmsi: 235091234,
          vessel_name: "OCEAN IMPERIAL",
          vessel_type: "Tanker",
          total_score: 76.0,
          risk_level: "High Risk",
          min_distance_km: 1.5,
          time_delta_mins: 42,
          factor_scores: {
            distance_proximity: 24,
            temporal_proximity: 18,
            trajectory_alignment: 17,
            speed_consistency: 9,
            direction_consistency: 8
          },
          explanation: "Candidate vessel trajectory passed within 1.5 km of detected slick centroid 42 minutes prior to satellite acquisition. Heading (142°) aligns directly with observed slick dispersion orientation."
        },
        {
          mmsi: 311000891,
          vessel_name: "MAERSK VISBY",
          vessel_type: "Container Ship",
          total_score: 61.0,
          risk_level: "Medium Risk",
          min_distance_km: 4.8,
          time_delta_mins: 34,
          factor_scores: {
            distance_proximity: 18,
            temporal_proximity: 16,
            trajectory_alignment: 14,
            speed_consistency: 7,
            direction_consistency: 6
          },
          explanation: "Vessel passed 4.8 km from spill area. High cruising speed (18.2 kts) reduces probability of stationary discharge, but proximity warrants monitoring."
        },
        {
          mmsi: 477123900,
          vessel_name: "NORDIC TRAVELLER",
          vessel_type: "Bulk Carrier",
          total_score: 43.0,
          risk_level: "Low Risk",
          min_distance_km: 8.2,
          time_delta_mins: 29,
          factor_scores: {
            distance_proximity: 12,
            temporal_proximity: 14,
            trajectory_alignment: 9,
            speed_consistency: 5,
            direction_consistency: 3
          },
          explanation: "Moderate distance (8.2 km). Course vector tangential to spill propagation path."
        },
        {
          mmsi: 538002110,
          vessel_name: "SEA TITAN",
          vessel_type: "Tug / Supply",
          total_score: 32.0,
          risk_level: "Low Risk",
          min_distance_km: 11.5,
          time_delta_mins: 19,
          factor_scores: {
            distance_proximity: 8,
            temporal_proximity: 10,
            trajectory_alignment: 7,
            speed_consistency: 4,
            direction_consistency: 3
          },
          explanation: "Vessel position at 11.5 km distance with low correlation score."
        }
      ]
    };

    setSarData(mockSar);
    setAisData(mockAis);
    setCorrelationData(mockCorrelation);
    setSelectedVessel(mockCorrelation.rankings[0]);
    setDemoActive(true);
  };

  // Run Animated 10-Step Demo Workflow Modal
  const runAnimatedDemo = () => {
    setIsDemoModalOpen(true);
    setDemoRunning(true);
    setDemoStep(1);

    const steps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setDemoStep(step);
        if (step === 10) {
          setDemoRunning(false);
          runFullDemo();
        }
      }, (index + 1) * 800);
    });
  };

  const uploadSarImage = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/sar/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSarData(res.data);
      if (aisData?.vessels) {
        triggerCorrelation(res.data.spills, aisData.vessels, weights);
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Error processing SAR imagery upload.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAisCsv = async (file) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API_BASE_URL}/ais/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAisData(res.data);
      if (sarData?.spills) {
        triggerCorrelation(sarData.spills, res.data.vessels, weights);
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Error parsing AIS CSV file.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const triggerCorrelation = async (spills = sarData?.spills, vessels = aisData?.vessels, newWeights = weights) => {
    if (!spills || !spills.length || !vessels || !vessels.length) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/correlation/analyze`, {
        spills,
        vessels,
        weights: newWeights
      });
      setCorrelationData(res.data);
      if (res.data?.rankings?.length > 0) {
        setSelectedVessel(res.data.rankings[0]);
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Error calculating spatiotemporal correlation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      theme,
      toggleTheme,
      sidebarCollapsed,
      setSidebarCollapsed,
      loading,
      demoActive,
      demoRunning,
      demoStep,
      isDemoModalOpen,
      setIsDemoModalOpen,
      error,
      setError,
      notificationCount,
      setNotificationCount,
      sarData,
      aisData,
      correlationData,
      selectedVessel,
      setSelectedVessel,
      weights,
      setWeights,
      timelineEvents,
      runFullDemo,
      runAnimatedDemo,
      uploadSarImage,
      uploadAisCsv,
      triggerCorrelation
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
