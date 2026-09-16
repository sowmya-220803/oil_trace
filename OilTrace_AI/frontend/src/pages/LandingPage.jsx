import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Radar, Satellite, Compass, FileText, Activity, ArrowRight, Play, Award, Sun, Moon } from 'lucide-react';

export const LandingPage = () => {
  const { setActiveTab, runAnimatedDemo, theme, toggleTheme } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', paddingBottom: '60px' }}>
      {/* Standalone Landing Page Header */}
      <header style={{
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1300px',
        margin: '0 auto',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
          }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '900', fontSize: '18px', letterSpacing: '-0.3px' }}>OILTRACE AI</div>
            <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: '700', letterSpacing: '0.5px' }}>
              MARITIME SATELLITE INVESTIGATION
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              width: '38px',
              height: '38px',
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

          <button
            onClick={() => setActiveTab('dashboard')}
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}
          >
            <span>Launch Platform</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Landing Hero Section */}
      <section style={{
        position: 'relative',
        padding: '60px 24px 60px 24px',
        maxWidth: '1300px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* SIH Banner */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: 'var(--accent-cyan)',
          fontSize: '13px',
          fontWeight: '700',
          letterSpacing: '0.5px',
          marginBottom: '24px'
        }}>
          <Award size={16} />
          <span>SIH PROTOTYPE DEMONSTRATION PLATFORM</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          fontWeight: '900',
          lineHeight: '1.15',
          letterSpacing: '-1px',
          marginBottom: '16px'
        }}>
          OILTRACE AI
        </h1>

        <div style={{
          fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
          fontWeight: '800',
          background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          "See the Spill. Trace the Source."
        </div>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '800px',
          margin: '0 auto 36px auto',
          lineHeight: '1.6'
        }}>
          AI-powered satellite oil spill detection and AIS-based spatial-temporal vessel correlation platform. 
          Transforming raw radar signals into verifiable maritime evidence.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: '16px', borderRadius: '10px' }}
          >
            <span>Launch Investigation</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={runAnimatedDemo}
            className="btn-secondary"
            style={{ padding: '14px 28px', fontSize: '16px', borderRadius: '10px' }}
          >
            <Play size={18} fill="currentColor" color="var(--accent-cyan)" />
            <span>Run Live Demo</span>
          </button>
        </div>

        {/* Core Hero Workflow Visualization (The 30-Second Story) */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', textOverflow: 'ellipsis' }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}>
            PRODUCT WORKFLOW ARCHITECTURE
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}>
            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <Satellite size={32} color="var(--accent-cyan)" style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: '700', fontSize: '14px' }}>Sentinel-1 SAR</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>C-Band Satellite</div>
            </div>

            <div style={{ color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '20px' }}>↓</div>

            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <Activity size={32} color="var(--accent-blue)" style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: '700', fontSize: '14px' }}>AI Segmentation</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CNN / U-Net Model</div>
            </div>

            <div style={{ color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '20px' }}>↓</div>

            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <Radar size={32} color="var(--accent-red)" style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: '700', fontSize: '14px' }}>Detected Oil Spill</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Location / Area / Time</div>
            </div>

            <div style={{ color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '20px' }}>↓</div>

            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <Compass size={32} color="var(--accent-amber)" style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: '700', fontSize: '14px' }}>AIS Trajectories</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vessel AIS Feed</div>
            </div>

            <div style={{ color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '20px' }}>↓</div>

            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <Shield size={32} color="var(--accent-green)" style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: '700', fontSize: '14px' }}>Candidate Ranking</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Correlation Dossier</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY OILTRACE AI */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px auto', padding: '0 24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '40px' }}>
          WHY OILTRACE AI
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Activity size={24} color="var(--accent-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>AI Spill Detection</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              Deep learning U-Net model trained on C-band SAR satellite backscatter to isolate dark oil slicks from look-alikes.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Satellite size={24} color="var(--accent-blue)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Satellite Intelligence</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              Sentinel-1 SAR imagery providing day-and-night, all-weather oceanic surveillance across high-risk shipping corridors.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Compass size={24} color="var(--accent-amber)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>AIS Vessel Tracking</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              Real-time & historical MarineCadastre AIS data parsing for commercial tankers, cargo ships, and maritime traffic.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Radar size={24} color="var(--accent-green)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Spatiotemporal Correlation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              Multi-factor scoring algorithm evaluating distance, time delta, trajectory alignment, vessel speed, and heading vector.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <FileText size={24} color="var(--accent-indigo)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Explainable Evidence Dossier</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              Transparent factor breakdowns and downloadable legal audit reports ready for maritime law enforcement.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px auto', padding: '0 24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '40px' }}>
          HOW IT WORKS
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {[
            { step: '01', title: 'Satellite Input', desc: 'Sentinel-1 SAR C-band satellite imagery ingested into system.' },
            { step: '02', title: 'AI Segmentation', desc: 'Deep learning model isolates low-backscatter oil slick regions.' },
            { step: '03', title: 'Spill Intelligence', desc: 'Extracts exact spatial coordinates, centroid, and area (km²).' },
            { step: '04', title: 'AIS Correlation', desc: 'Fetches historical vessel trajectories within spatial-temporal radius.' },
            { step: '05', title: 'Vessel Ranking', desc: 'Computes 5-factor explainable correlation score (0-100%).' },
            { step: '06', title: 'Investigation Report', desc: 'Generates auditable PDF/CSV evidence dossier for maritime authorities.' }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-cyan)', opacity: 0.8 }}>
                {item.step}
              </span>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.4' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '48px 32px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '12px' }}>Start an Oil Spill Investigation</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '28px' }}>
          Access real-time Sentinel-1 SAR intelligence and vessel trajectory correlation tools.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="btn-primary"
          style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '10px' }}
        >
          <span>Launch OilTrace AI</span>
          <ArrowRight size={18} />
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ marginTop: '80px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
        <p style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>OilTrace AI</p>
        <p>AI-Powered Satellite Oil Spill Detection & Vessel Correlation | SIH Prototype</p>
      </footer>
    </div>
  );
};
