import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { SatelliteAnalysis } from './pages/SatelliteAnalysis';
import { AisDataPage } from './pages/AisDataPage';
import { CorrelationPage } from './pages/CorrelationPage';
import { VesselRankingPage } from './pages/VesselRankingPage';
import { TimelinePage } from './pages/TimelinePage';
import { ReportsPage } from './pages/ReportsPage';
import { DemoWorkflowModal } from './components/DemoWorkflowModal';
import { VesselDetailModal } from './components/VesselDetailModal';
import { AlertCircle } from 'lucide-react';

const MainLayout = () => {
  const { activeTab, error, setError } = useApp();
  const isLanding = activeTab === 'landing';

  const renderPage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'sar':
        return <SatelliteAnalysis />;
      case 'ais':
        return <AisDataPage />;
      case 'correlation':
        return <CorrelationPage />;
      case 'vessels':
        return <VesselRankingPage />;
      case 'timeline':
        return <TimelinePage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top Navbar - Only shown for main app pages */}
      {!isLanding && <Navbar />}

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left Sidebar Navigation - Only shown for main app pages */}
        {!isLanding && <Sidebar />}

        {/* Main Content Area */}
        <main style={{
          flex: 1,
          padding: isLanding ? '0' : '24px',
          overflowY: 'auto',
          maxWidth: isLanding ? '100%' : '1600px',
          margin: '0 auto',
          width: '100%'
        }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '10px',
              padding: '14px 18px',
              margin: '16px',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={18} color="#ef4444" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontWeight: '700' }}
              >
                Dismiss
              </button>
            </div>
          )}

          {renderPage()}
        </main>
      </div>

      {/* Demo Workflow Progress Modal */}
      <DemoWorkflowModal />

      {/* Suspect Vessel Dossier Modal */}
      <VesselDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
