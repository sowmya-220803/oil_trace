import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Satellite,
  Radio,
  SlidersHorizontal,
  Ship,
  History,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Home,
  CheckCircle,
  Settings
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed } = useApp();

  const menuItems = [
    { id: 'landing', label: 'Overview & Story', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sar', label: 'Satellite Analysis', icon: Satellite },
    { id: 'ais', label: 'AIS Intelligence', icon: Radio },
    { id: 'correlation', label: 'Correlation Engine', icon: SlidersHorizontal },
    { id: 'vessels', label: 'Vessel Investigation', icon: Ship },
    { id: 'timeline', label: 'Investigation Timeline', icon: History },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet }
  ];

  return (
    <aside style={{
      width: sidebarCollapsed ? '72px' : '240px',
      transition: 'width 0.25s ease',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px 10px',
      userSelect: 'none'
    }}>
      {/* Navigation List */}
      <div>
        {/* Expand / Collapse Button Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          marginBottom: '20px',
          padding: '0 6px'
        }}>
          {!sidebarCollapsed && (
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: 'var(--text-muted)',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              NAVIGATION
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '6px',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: sidebarCollapsed ? '12px 0' : '10px 14px',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)'
                    : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={18} color={isActive ? 'var(--accent-cyan)' : undefined} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom System Status Box */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
        {!sidebarCollapsed ? (
          <div style={{
            background: 'var(--bg-primary)',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            fontSize: '11px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>System Status</span>
              <CheckCircle size={14} color="var(--accent-green)" />
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Sentinel-1 SAR API</div>
            <div style={{ color: 'var(--accent-green)', fontWeight: '600' }}>Active & Operational</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--accent-green)' }}>
            <CheckCircle size={20} />
          </div>
        )}
      </div>
    </aside>
  );
};
