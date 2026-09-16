import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sun, Moon, Bell, CheckCircle2, Radar, Award, AlertTriangle, X } from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme, notificationCount, setNotificationCount, setActiveTab, runAnimatedDemo } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Sentinel-1 SAR Pass Acquired', time: '10 mins ago', type: 'info', text: 'New C-band radar backscatter image ingested for Gulf Sector 4B.' },
    { id: 2, title: 'High-Risk Candidate Identified', time: '15 mins ago', type: 'critical', text: 'OCEAN IMPERIAL (MMSI: 235091234) scored 76% spatiotemporal correlation.' },
    { id: 3, title: 'AIS Stream Update', time: '22 mins ago', type: 'success', text: 'MarineCadastre stream updated: 4 commercial vessels tracked in zone.' }
  ];

  return (
    <header className="glass-card-solid" style={{
      height: '64px',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left Brand & Active Case Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div 
          onClick={() => setActiveTab('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
          }}>
            <Shield size={20} />
          </div>
          <div>
            <div style={{ fontWeight: '900', fontSize: '16px', letterSpacing: '-0.3px' }}>OILTRACE AI</div>
            <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: '700', letterSpacing: '0.5px' }}>
              SATELLITE EVIDENCE ENGINE
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '24px', width: '1px', background: 'var(--border-color)' }} />

        {/* Case Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Case:</span>
          <span style={{ fontWeight: '700', fontFamily: 'monospace', color: 'var(--accent-cyan)', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            OT-2026-0916-001
          </span>
          <span style={{ color: 'var(--text-muted)' }}>| Sector:</span>
          <span style={{ fontWeight: '600' }}>Gulf of Mexico 4B</span>
        </div>
      </div>

      {/* Middle System Readiness Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-green)' }} />
          <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>AI Engine — READY</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
          <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>AIS Feed — CONNECTED</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-indigo)' }} />
          <span style={{ color: 'var(--accent-indigo)', fontWeight: '700' }}>GIS Engine — READY</span>
        </div>
      </div>

      {/* Right User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Quick Live Demo Trigger */}
        <button
          onClick={runAnimatedDemo}
          className="btn-primary"
          style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px' }}
        >
          <Radar size={14} />
          <span>RUN DEMO</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="var(--accent-amber)" /> : <Moon size={18} color="var(--accent-indigo)" />}
        </button>

        {/* Notification Button & Popover Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (notificationCount > 0) setNotificationCount(0);
            }}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Bell size={18} />
          </button>
          {notificationCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--accent-red)',
              color: 'white',
              fontSize: '10px',
              fontWeight: '800',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {notificationCount}
            </span>
          )}

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '340px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-main)',
              zIndex: 1000,
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--accent-cyan)' }}>
                  INVESTIGATION NOTIFICATIONS
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: n.type === 'critical' ? 'var(--accent-red)' : 'var(--accent-cyan)' }}>
                        {n.title}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '11px', lineHeight: '1.4' }}>
                      {n.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIH Team Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-primary)',
          padding: '4px 10px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          fontSize: '12px'
        }}>
          <Award size={16} color="var(--accent-cyan)" />
          <div>
            <div style={{ fontWeight: '700', fontSize: '11px' }}>SIH 2026</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>TEAM OILTRACE</div>
          </div>
        </div>
      </div>
    </header>
  );
};
