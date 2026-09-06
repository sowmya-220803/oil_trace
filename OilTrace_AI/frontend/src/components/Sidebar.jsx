import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Satellite, Radio, Sliders, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, sarData, aisData, correlationData } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, ready: true },
    { id: 'sar', label: 'Satellite Analysis', icon: Satellite, ready: !!sarData },
    { id: 'ais', label: 'AIS Data & Traffic', icon: Radio, ready: !!aisData },
    { id: 'correlation', label: 'Correlation Engine', icon: Sliders, ready: !!correlationData },
    { id: 'vessels', label: 'Vessel Ranking', icon: ShieldAlert, ready: !!correlationData },
    { id: 'reports', label: 'Reports & Export', icon: FileText, ready: !!correlationData }
  ];

  return (
    <aside style={{
      width: '240px',
      background: 'rgba(15, 23, 42, 0.65)',
      borderRight: '1px solid rgba(51, 65, 85, 0.6)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 14px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ padding: '0 10px 10px 10px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Navigation Menu
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.4) 100%)' : 'transparent',
                borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontSize: '13.5px',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                  e.currentTarget.style.color = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? '#38bdf8' : '#64748b'} />
                <span>{item.label}</span>
              </div>
              {item.ready && (
                <CheckCircle2 size={13} color="#10b981" style={{ opacity: 0.8 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Dataset & Quick Status Footer */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '12px',
        fontSize: '11px'
      }}>
        <div style={{ fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
          Reference Datasets
        </div>
        <div style={{ color: '#94a3b8', lineHeight: '1.5' }}>
          • Sentinel-1 SAR (Zenodo)<br />
          • MarineCadastre AIS CSV
        </div>
      </div>
    </aside>
  );
};
