import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://oil-trace-tn33.onrender.com';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const [error, setError] = useState(null);

  // Core Data States
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

  // Auto-run demo on initial page load so user sees full interactive app instantly!
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
        setDemoActive(true);
      }
    } catch (err) {
      console.error("Failed to run demo workflow:", err);
      setError("Unable to connect to FastAPI backend on port 8000. Ensure backend service is running.");
    } finally {
      setLoading(false);
    }
  };

  const uploadSarImage = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/sar/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSarData(res.data);
      setDemoActive(false);

      // Auto-retrigger correlation if AIS data exists
      if (aisData && aisData.vessels) {
        triggerCorrelation(res.data.spills, aisData.vessels, weights);
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Error uploading SAR image.");
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
      setDemoActive(false);

      // Auto-retrigger correlation if SAR data exists
      if (sarData && sarData.spills) {
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

  const generateSyntheticAis = async (center_lat, center_lon, count = 6, spill_time = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/ais/synthetic`, {
        center_lat,
        center_lon,
        count,
        spill_time
      });
      setAisData(res.data);
      setDemoActive(false);

      if (sarData && sarData.spills) {
        triggerCorrelation(sarData.spills, res.data.vessels, weights);
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Error generating synthetic AIS traffic.");
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
      loading,
      demoActive,
      error,
      setError,
      sarData,
      aisData,
      correlationData,
      selectedVessel,
      setSelectedVessel,
      weights,
      setWeights,
      runFullDemo,
      uploadSarImage,
      uploadAisCsv,
      generateSyntheticAis,
      triggerCorrelation
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
