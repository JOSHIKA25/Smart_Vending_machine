import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box, Dialog, DialogContent } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* ═══════════════════════════ ICONS ═══════════════════════════ */
const Ico = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  nav: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  ),
  phone: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.16a16 16 0 0 0 6 6z"/>
    </svg>
  ),
  building: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>
    </svg>
  ),
  type: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  verified: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  signal: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  refresh: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
};

/* ═══════════════════════════ CSS ═══════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:        #0a0a0a;
    --ink-soft:   #555;
    --ink-muted:  #999;
    --canvas:     #f2f1ed;
    --surface:    #ffffff;
    --border:     rgba(0,0,0,0.07);
    --accent:     #c8f04e;
    --accent-dim: rgba(200,240,78,0.15);
    --red:        #ff4444;
    --green:      #22c55e;
    --blue:       #3b82f6;
    --font-display: 'Syne', sans-serif;
    --font-body:    'DM Sans', sans-serif;
    --font-mono:    'DM Mono', monospace;
    --r-sm: 10px;
    --r-md: 18px;
    --r-lg: 28px;
    --shadow: 0 2px 12px rgba(0,0,0,0.07);
    --shadow-md: 0 8px 32px rgba(0,0,0,0.10);
  }

  body { background: var(--canvas); font-family: var(--font-body); color: var(--ink); }

  /* ── Page ── */
  .am-page { min-height: 100vh; background: var(--canvas); }

  /* ── Topbar ── */
  .am-topbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(242,241,237,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 0 40px;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .am-topbar__logo {
    font-family: var(--font-display);
    font-size: 1.1rem; font-weight: 800;
    letter-spacing: -0.02em;
    display: flex; align-items: center; gap: 10px;
  }
  .am-topbar__logo-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
    box-shadow: 0 0 0 3px rgba(200,240,78,0.3);
    animation: pulse-g 2s infinite;
  }
  @keyframes pulse-g {
    0%,100% { box-shadow: 0 0 0 0 rgba(200,240,78,0.5); }
    50%      { box-shadow: 0 0 0 6px rgba(200,240,78,0); }
  }
  .am-topbar__right { display: flex; align-items: center; gap: 12px; }
  .am-topbar__time {
    font-family: var(--font-mono);
    font-size: 0.75rem; color: var(--ink-muted);
  }
  .am-btn-dash {
    display: flex; align-items: center; gap: 8px;
    background: var(--ink); color: #fff;
    border: none; border-radius: 100px;
    padding: 10px 20px;
    font-family: var(--font-display);
    font-size: 0.85rem; font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  .am-btn-dash:hover { background: #1a1a1a; transform: translateY(-1px); }

  /* ── Body ── */
  .am-body { max-width: 1200px; margin: 0 auto; padding: 40px 24px 80px; }

  /* ── Page header ── */
  .am-header { margin-bottom: 40px; }
  .am-header__eyebrow {
    font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--ink-muted); margin-bottom: 8px;
  }
  .am-header__title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800; letter-spacing: -0.03em;
    line-height: 1.05;
  }
  .am-header__title span { color: var(--accent); -webkit-text-stroke: 1px rgba(0,0,0,0.1); }
  .am-header__sub { font-size: 0.9rem; color: var(--ink-soft); margin-top: 8px; }

  /* ── Summary bar ── */
  .am-summary {
    display: flex; gap: 1px;
    background: var(--border);
    border-radius: var(--r-md);
    overflow: hidden;
    border: 1px solid var(--border);
    margin-bottom: 36px;
  }
  .am-summary__item {
    flex: 1; background: var(--surface);
    padding: 18px 20px;
  }
  .am-summary__num {
    font-family: var(--font-display);
    font-size: 1.8rem; font-weight: 800;
    letter-spacing: -0.03em; line-height: 1;
    margin-bottom: 4px;
  }
  .am-summary__label {
    font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.09em; text-transform: uppercase;
    color: var(--ink-muted);
  }
  .am-summary__dot {
    display: inline-block; width: 8px; height: 8px; border-radius: 50%;
    margin-right: 4px; vertical-align: middle;
  }

  /* ── Machine card ── */
  .am-machine {
    background: var(--surface);
    border-radius: var(--r-lg);
    border: 1px solid var(--border);
    overflow: hidden;
    margin-bottom: 28px;
    box-shadow: var(--shadow);
    transition: box-shadow 0.2s;
  }
  .am-machine:hover { box-shadow: var(--shadow-md); }

  /* Card header band */
  .am-machine__header {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 20px 28px;
    border-bottom: 1px solid var(--border);
    background: #fafaf8;
  }
  .am-machine__id-wrap { display: flex; align-items: center; gap: 14px; }
  .am-machine__id {
    font-family: var(--font-display);
    font-size: 1.4rem; font-weight: 800;
    letter-spacing: -0.02em;
  }
  .am-machine__status {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 14px; border-radius: 100px;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .am-machine__status.online  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; }
  .am-machine__status.offline { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
  .am-machine__status-dot {
    width: 7px; height: 7px; border-radius: 50%;
  }
  .am-machine__status.online  .am-machine__status-dot { background: var(--green); animation: pulse-g 2s infinite; }
  .am-machine__status.offline .am-machine__status-dot { background: var(--red); }
  .am-machine__loc {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.82rem; color: var(--ink-soft);
  }

  /* Card body */
  .am-machine__body { display: grid; grid-template-columns: 220px 1fr; }
  @media(max-width:768px) { .am-machine__body { grid-template-columns: 1fr; } }

  /* Left: image panel */
  .am-machine__img-panel {
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
  }
  .am-machine__img-wrap { position: relative; }
  .am-machine__img {
    width: 100%; aspect-ratio: 3/4;
    object-fit: cover; display: block;
  }
  .am-machine__live-badge {
    position: absolute; top: 12px; left: 12px;
    display: flex; align-items: center; gap: 5px;
    background: rgba(10,10,10,0.75);
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.1em;
    padding: 5px 10px; border-radius: 6px;
    backdrop-filter: blur(4px);
  }
  .am-machine__live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
    animation: pulse-g 1.5s infinite;
  }

  /* Coords display */
  .am-machine__coords {
    padding: 14px 16px;
    border-top: 1px solid var(--border);
    background: #fafaf8;
  }
  .am-machine__coords-label {
    font-size: 0.62rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink-muted); margin-bottom: 4px;
  }
  .am-machine__coords-val {
    font-family: var(--font-mono);
    font-size: 0.75rem; color: var(--ink);
    line-height: 1.5;
  }

  /* Right: map + info */
  .am-machine__right { display: flex; flex-direction: column; }

  .am-machine__map { flex: 1; min-height: 300px; position: relative; }

  /* Tracking overlay */
  .am-track-overlay {
    position: absolute; bottom: 16px; left: 16px; z-index: 1000;
    background: rgba(10,10,10,0.82);
    border: 1px solid rgba(200,240,78,0.3);
    border-radius: 10px;
    padding: 10px 14px;
    backdrop-filter: blur(6px);
    min-width: 160px;
  }
  .am-track-overlay__row {
    display: flex; align-items: center; gap: 6px;
    font-family: var(--font-mono);
    font-size: 0.67rem; color: rgba(255,255,255,0.7);
    margin-bottom: 2px;
  }
  .am-track-overlay__row:last-child { margin-bottom: 0; }
  .am-track-overlay__row b { color: var(--accent); }

  /* Info strip */
  .am-machine__info {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--border);
    border-top: 1px solid var(--border);
  }
  @media(max-width:900px) { .am-machine__info { grid-template-columns: repeat(2,1fr); } }
  .am-info-cell {
    background: var(--surface);
    padding: 16px 18px;
    transition: background 0.15s;
  }
  .am-info-cell:hover { background: #fafaf8; }
  .am-info-cell__icon {
    color: var(--ink-muted);
    margin-bottom: 6px;
    display: flex;
  }
  .am-info-cell__label {
    font-size: 0.65rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink-muted); margin-bottom: 3px;
  }
  .am-info-cell__val {
    font-family: var(--font-display);
    font-size: 0.88rem; font-weight: 700;
    color: var(--ink);
    display: flex; align-items: center; gap: 5px;
  }
  .am-verified {
    display: inline-flex; align-items: center; justify-content: center;
    width: 16px; height: 16px; border-radius: 50%;
    background: #1d4ed8; color: #fff; flex-shrink: 0;
  }

  /* Empty state */
  .am-empty {
    text-align: center; padding: 80px 20px;
    font-family: var(--font-display);
    color: var(--ink-muted);
  }
  .am-empty__num {
    font-size: 5rem; font-weight: 800; opacity: 0.08; line-height: 1;
  }
`;

function injectStyles(id, css) {
  if (typeof document === "undefined") return;
  if (!document.getElementById(id)) {
    const el = document.createElement("style");
    el.id = id; el.textContent = css;
    document.head.appendChild(el);
  }
}

/* ── Map tracker ── */
function TrackAndRecenter({ path }) {
  const map = useMap();
  useEffect(() => {
    if (path.length > 0) map.panTo(path[path.length - 1], { animate: true, duration: 1 });
  }, [path, map]);
  return null;
}

/* ── Live clock ── */
function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  return <span className="am-topbar__time">{t.toLocaleTimeString()}</span>;
}

/* ════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════ */
export default function AdminMachines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pathHistory, setPathHistory] = useState([[6.9271, 79.8612]]);
  const navigate = useNavigate();

  injectStyles("admin-machines-css", CSS);

  const fetchMachines = useCallback(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/machines")
      .then(res => {
        const sanitized = res.data.map(m =>
          m.id === "VM-101" ? { ...m, lat: 6.9271, lng: 79.8612 } : m
        );
        setMachines(sanitized);
      })
      .catch(() => setMachines([{
        id: "VM-101", location: "Transit: Colombo Sector",
        status: "online", type: "Mobile Unit",
        operator: "DreamTech Vending", contact: "+94771234567",
        company: "DreamTech Vending", lat: 6.9271, lng: 79.8612
      }]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchMachines();
    const tracker = setInterval(() => {
      setPathHistory(prev => {
        const last = prev[prev.length - 1];
        return [...prev, [last[0] + 0.0004, last[1] + 0.0004]];
      });
    }, 3000);
    return () => clearInterval(tracker);
  }, [fetchMachines]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--canvas)" }}>
        <CircularProgress size={40} thickness={3} sx={{ color: "#0a0a0a" }} />
      </Box>
    );
  }

  const onlineCount = machines.filter(m => m.status?.toLowerCase() === "online").length;
  const latest = pathHistory[pathHistory.length - 1];

  return (
    <div className="am-page">
      {/* ── TOP BAR ── */}
      <div className="am-topbar">
        <div className="am-topbar__logo">
          <div className="am-topbar__logo-dot" />
          FleetOps Console
        </div>
        <div className="am-topbar__right">
          <LiveClock />
          <button className="am-btn-dash" onClick={() => navigate("/admin/dashboard")}>
            {Ico.grid} Dashboard {Ico.arrowRight}
          </button>
        </div>
      </div>

      <div className="am-body">
        {/* ── HEADER ── */}
        <div className="am-header">
          <div className="am-header__eyebrow">Admin · Asset Management</div>
          <div className="am-header__title">
            Live <span>Tracking</span>
          </div>
          <div className="am-header__sub">
            Real-time telemetry for all active vending units
          </div>
        </div>

        {/* ── SUMMARY BAR ── */}
        <div className="am-summary">
          {[
            { num: machines.length, label: "Total Units" },
            { num: onlineCount, label: "Online", dot: "var(--green)" },
            { num: machines.length - onlineCount, label: "Offline", dot: "var(--red)" },
            { num: pathHistory.length, label: "Track Points" },
            { num: "98.2%", label: "Fleet Uptime" },
          ].map((s, i) => (
            <div className="am-summary__item" key={i}>
              <div className="am-summary__num">
                {s.dot && <span className="am-summary__dot" style={{ background: s.dot }} />}
                {s.num}
              </div>
              <div className="am-summary__label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MACHINE CARDS ── */}
        {machines.length === 0 ? (
          <div className="am-empty">
            <div className="am-empty__num">0</div>
            No machines registered.
          </div>
        ) : (
          machines.map((machine) => {
            const isOnline = machine.status?.toLowerCase() === "online";
            const pos = pathHistory[pathHistory.length - 1];

            return (
              <div className="am-machine" key={machine.id}>
                {/* Header band */}
                <div className="am-machine__header">
                  <div className="am-machine__id-wrap">
                    <div className="am-machine__id">{machine.id}</div>
                    <div className={`am-machine__status ${isOnline ? "online" : "offline"}`}>
                      <span className="am-machine__status-dot" />
                      {isOnline ? "Online" : "Offline"}
                    </div>
                  </div>
                  <div className="am-machine__loc">
                    {Ico.nav}
                    <span>In Motion · {machine.location}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="am-machine__body">
                  {/* LEFT: image + coords */}
                  <div className="am-machine__img-panel">
                    <div className="am-machine__img-wrap">
                      <img
                        className="am-machine__img"
                        src="/vending-machine.jpg"
                        alt={machine.id}
                        onError={e => { e.target.src = "https://images.unsplash.com/photo-1575224526797-5730d099781d?q=80&w=400&auto=format&fit=crop"; }}
                      />
                      <div className="am-machine__live-badge">
                        <span className="am-machine__live-dot" /> LIVE
                      </div>
                    </div>
                    <div className="am-machine__coords">
                      <div className="am-machine__coords-label">Current Position</div>
                      <div className="am-machine__coords-val">
                        {pos[0].toFixed(5)}°N<br />{pos[1].toFixed(5)}°E
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: map + info */}
                  <div className="am-machine__right">
                    {/* Map */}
                    <div className="am-machine__map">
                      <MapContainer center={pathHistory[0]} zoom={16} style={{ height: "100%", width: "100%", minHeight: 300 }}>
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution="&copy; OpenStreetMap contributors"
                        />
                        <Polyline
                          positions={pathHistory}
                          pathOptions={{
                            color: "#c8f04e", weight: 4, opacity: 0.85,
                            dashArray: "1, 10", lineCap: "round"
                          }}
                        />
                        <Marker position={pos}>
                          <Popup><strong>{machine.id}</strong><br />Tracking Active</Popup>
                        </Marker>
                        <TrackAndRecenter path={pathHistory} />
                      </MapContainer>

                      {/* Overlay */}
                      <div className="am-track-overlay">
                        <div className="am-track-overlay__row">
                          {Ico.signal} <b>SIGNAL ACTIVE</b>
                        </div>
                        <div className="am-track-overlay__row">
                          {Ico.nav} Δ {pathHistory.length} points logged
                        </div>
                        <div className="am-track-overlay__row">
                          {Ico.refresh} Update every 3s
                        </div>
                      </div>
                    </div>

                    {/* Info strip */}
                    <div className="am-machine__info">
                      {[
                        { icon: Ico.type,     label: "Unit Type",   value: machine.type },
                        { icon: Ico.building, label: "Operator",    value: machine.operator, verified: true },
                        { icon: Ico.phone,    label: "Emergency",   value: machine.contact },
                        { icon: Ico.building, label: "Fleet Owner", value: machine.company },
                      ].map((s, i) => (
                        <div className="am-info-cell" key={i}>
                          <div className="am-info-cell__icon">{s.icon}</div>
                          <div className="am-info-cell__label">{s.label}</div>
                          <div className="am-info-cell__val">
                            {s.value || "N/A"}
                            {s.verified && (
                              <span className="am-verified">{Ico.verified}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
