import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ─── Inline Styles (no MUI dependency for the redesign shell) ────────────────
// We still import MUI for CircularProgress & Dialog, but layout is pure CSS-in-JS
import {
  CircularProgress,
  Dialog,
  DialogContent,
  Box,
} from "@mui/material";

/* ═══════════════════════════════════════════════════════════════
   ICON COMPONENTS (inline SVGs — no extra import needed)
═══════════════════════════════════════════════════════════════ */
const IconLocation = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.16a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
  </svg>
);
const IconCart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconBuilding = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>
  </svg>
);
const IconType = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES — injected once
═══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:       #0d0d0d;
    --ink-soft:  #6b6b6b;
    --ink-muted: #a0a0a0;
    --canvas:    #f5f3ef;
    --surface:   #ffffff;
    --accent:    #c8f04e;      /* electric lime */
    --accent-2:  #ff6b35;      /* warm orange */
    --online:    #22c55e;
    --offline:   #ef4444;
    --border:    rgba(0,0,0,0.08);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
    --shadow-md: 0 8px 32px rgba(0,0,0,0.10);
    --shadow-lg: 0 24px 64px rgba(0,0,0,0.14);
    --r-sm: 12px;
    --r-md: 20px;
    --r-lg: 32px;
    --font-display: 'Syne', sans-serif;
    --font-body:    'DM Sans', sans-serif;
  }

  body { background: var(--canvas); font-family: var(--font-body); color: var(--ink); }

  /* ── Page wrapper ── */
  .md-page {
    min-height: 100vh;
    background: var(--canvas);
    padding: 0 0 80px;
  }

  /* ── Hero Banner ── */
  .md-hero {
    position: relative;
    width: 100%;
    height: 380px;
    overflow: hidden;
    background: #0d0d0d;
  }
  .md-hero__img {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.55;
    transform: scale(1.05);
    transition: transform 8s ease;
  }
  .md-hero__img.loaded { transform: scale(1); }
  .md-hero__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.85) 100%);
  }
  .md-hero__back {
    position: absolute; top: 24px; left: 24px;
    display: flex; align-items: center; gap: 8px;
    color: rgba(255,255,255,0.85);
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 100px;
    padding: 8px 16px;
    backdrop-filter: blur(8px);
    transition: all 0.2s;
    text-decoration: none;
  }
  .md-hero__back:hover { background: rgba(255,255,255,0.22); }

  .md-hero__status {
    position: absolute; top: 24px; right: 24px;
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px;
    border-radius: 100px;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    backdrop-filter: blur(8px);
  }
  .md-hero__status.online  { background: rgba(34,197,94,0.18); border: 1px solid rgba(34,197,94,0.4); color: #86efac; }
  .md-hero__status.offline { background: rgba(239,68,68,0.18); border: 1px solid rgba(239,68,68,0.4); color: #fca5a5; }
  .md-hero__status-dot {
    width: 8px; height: 8px; border-radius: 50%;
  }
  .md-hero__status.online  .md-hero__status-dot { background: var(--online); box-shadow: 0 0 0 3px rgba(34,197,94,0.3); animation: pulse-dot 2s infinite; }
  .md-hero__status.offline .md-hero__status-dot { background: var(--offline); }

  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
    50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
  }

  .md-hero__content {
    position: absolute; bottom: 36px; left: 36px; right: 36px;
  }
  .md-hero__id {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
  }
  .md-hero__name {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 800;
    color: #ffffff;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  .md-hero__loc {
    display: flex; align-items: center; gap: 6px;
    margin-top: 10px;
    color: rgba(255,255,255,0.65);
    font-size: 0.95rem;
    font-weight: 300;
  }

  /* ── Layout ── */
  .md-body {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* Floating action card that overlaps hero */
  .md-action-float {
    position: relative;
    z-index: 10;
    margin-top: -56px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .md-btn-primary {
    display: flex; align-items: center; gap: 10px;
    background: var(--ink);
    color: #fff;
    border: none;
    border-radius: 100px;
    padding: 18px 32px;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(.34,1.56,.64,1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    white-space: nowrap;
  }
  .md-btn-primary:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 28px rgba(0,0,0,0.3); background: #1a1a1a; }
  .md-btn-primary:active { transform: scale(0.98); }

  .md-btn-ghost {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface);
    color: var(--ink);
    border: 1.5px solid var(--border);
    border-radius: 100px;
    padding: 17px 28px;
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: var(--shadow-sm);
    white-space: nowrap;
  }
  .md-btn-ghost:hover { border-color: var(--ink); background: #fafafa; }

  /* ── Grid ── */
  .md-grid {
    display: grid;
    grid-template-columns: 1fr 1.35fr;
    gap: 28px;
    margin-top: 32px;
  }
  @media (max-width: 768px) {
    .md-grid { grid-template-columns: 1fr; }
    .md-hero { height: 280px; }
    .md-hero__name { font-size: 1.8rem; }
  }

  /* ── Cards ── */
  .md-card {
    background: var(--surface);
    border-radius: var(--r-lg);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  /* ── Spec tiles ── */
  .md-specs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .md-spec-tile {
    background: var(--surface);
    padding: 20px 22px;
    transition: background 0.15s;
  }
  .md-spec-tile:hover { background: #fafafa; }
  .md-spec-tile__icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: #f0f0f0;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
    color: var(--ink);
  }
  .md-spec-tile__label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin-bottom: 4px;
  }
  .md-spec-tile__value {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--ink);
  }

  /* ── Operator card ── */
  .md-operator {
    padding: 26px;
  }
  .md-operator__header {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 16px;
  }
  .md-operator__avatar {
    width: 48px; height: 48px; border-radius: 14px;
    background: linear-gradient(135deg, var(--accent) 0%, #a8e63a 100%);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--ink);
    flex-shrink: 0;
  }
  .md-operator__name {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
  }
  .md-operator__badge {
    display: inline-flex; align-items: center; gap: 4px;
    background: #f0fdf4; color: #16a34a;
    font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid #bbf7d0;
    border-radius: 100px;
    padding: 2px 10px;
    margin-top: 2px;
  }
  .md-operator__desc {
    font-size: 0.88rem;
    color: var(--ink-soft);
    line-height: 1.65;
  }

  /* ── Map ── */
  .md-map-wrap {
    border-radius: var(--r-lg);
    overflow: hidden;
    height: 240px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  /* ── Left panel ── */
  .md-left { display: flex; flex-direction: column; gap: 20px; }

  /* ── Stats strip ── */
  .md-stats {
    display: flex;
    gap: 1px;
    background: var(--border);
    border-radius: var(--r-md);
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .md-stat {
    flex: 1;
    background: var(--surface);
    padding: 18px 16px;
    text-align: center;
  }
  .md-stat__num {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 4px;
  }
  .md-stat__label {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }

  /* ── Accent stripe on the hero image card ── */
  .md-image-card { position: relative; }
  .md-image-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%);
  }

  /* ── Section label ── */
  .md-section-label {
    font-family: var(--font-body);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin-bottom: 12px;
  }

  /* ── Dialog ── */
  .md-dialog-inner {
    padding: 36px;
    text-align: center;
    font-family: var(--font-body);
  }
  .md-dialog-inner h2 {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 800;
    margin-bottom: 8px;
  }
  .md-dialog-inner p { font-size: 0.9rem; color: var(--ink-soft); margin-bottom: 24px; }
  .md-dialog-phone {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.02em;
    display: block;
    margin-bottom: 24px;
  }
  .md-dialog-close {
    position: absolute; top: 16px; right: 16px;
    background: #f5f5f5; border: none; border-radius: 50%;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--ink);
    transition: background 0.15s;
  }
  .md-dialog-close:hover { background: #e5e5e5; }
`;

function injectStyles(css) {
  if (typeof document === "undefined") return;
  const id = "machine-detail-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function MachineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [openContact, setOpenContact] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  injectStyles(GLOBAL_CSS);

  useEffect(() => {
    fetch(`http://localhost:5000/api/machines/${id}`)
      .then((res) => res.json())
      .then((data) => setMachine(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!machine) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--canvas)" }}>
        <CircularProgress size={48} thickness={3} sx={{ color: "#0d0d0d" }} />
      </Box>
    );
  }

  const isOnline = machine.status?.toString().toLowerCase().trim() === "online";
  const position = [machine.latitude || 6.9271, machine.longitude || 79.8612];
  const operatorInitial = (machine.operator || "D").charAt(0).toUpperCase();

  const specs = [
    { label: "Machine Type", value: machine.type || "Smart Vending", icon: <IconType /> },
    { label: "Company", value: machine.operator || "N/A", icon: <IconBuilding /> },
    { label: "Support", value: machine.contact_phone || "N/A", icon: <IconPhone /> },
    { label: "Zone", value: machine.location?.split(",")[0] || "N/A", icon: <IconLocation /> },
  ];

  return (
    <div className="md-page">
      {/* ── HERO ── */}
      <div className="md-hero">
        <img
          className={`md-hero__img${imgLoaded ? " loaded" : ""}`}
          src="/vending-machine.jpg"
          alt={machine.name}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1575224526797-5730d099781d?q=80&w=1200&auto=format&fit=crop";
            setImgLoaded(true);
          }}
        />
        <div className="md-hero__overlay" />

        {/* Back button */}
        <button className="md-hero__back" onClick={() => navigate(-1)}>
          <IconArrow /> Back
        </button>

        {/* Status pill */}
        <div className={`md-hero__status ${isOnline ? "online" : "offline"}`}>
          <span className="md-hero__status-dot" />
          {isOnline ? "Online" : "Offline"}
        </div>

        {/* Title */}
        <div className="md-hero__content">
          <div className="md-hero__id">Machine #{id}</div>
          <div className="md-hero__name">{machine.name}</div>
          <div className="md-hero__loc">
            <IconLocation /> {machine.location}
          </div>
        </div>
      </div>

      <div className="md-body">
        {/* ── FLOATING ACTIONS ── */}
        <div className="md-action-float">
          <button className="md-btn-primary" onClick={() => navigate("/user/products")}>
            <IconCart /> Shop Now
          </button>
          <button className="md-btn-ghost" onClick={() => setOpenContact(true)}>
            <IconAlert /> Report an Issue
          </button>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="md-stats" style={{ marginTop: 28 }}>
          {[
            { num: "24/7", label: "Availability" },
            { num: "40+", label: "Products" },
            { num: "98%", label: "Uptime" },
            { num: "4.8★", label: "Rating" },
          ].map((s, i) => (
            <div className="md-stat" key={i}>
              <div className="md-stat__num" style={{ color: i === 0 ? "var(--ink)" : "var(--ink)" }}>{s.num}</div>
              <div className="md-stat__label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div className="md-grid">
          {/* LEFT */}
          <div className="md-left">
            {/* Operator card */}
            <div className="md-section-label">Operator</div>
            <div className="md-card">
              <div className="md-operator">
                <div className="md-operator__header">
                  <div className="md-operator__avatar">{operatorInitial}</div>
                  <div>
                    <div className="md-operator__name">{machine.operator || "DreamTech Vending"}</div>
                    <div className="md-operator__badge">✓ Verified Partner</div>
                  </div>
                </div>
                <div className="md-operator__desc">
                  {machine.company_detail ||
                    "DreamTech Vending provides premium snacks and beverage solutions across university campuses with 24/7 remote monitoring and rapid restocking."}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="md-section-label">Location</div>
            <div className="md-map-wrap">
              <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                  <Popup>{machine.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="md-section-label">Specifications</div>
            <div className="md-specs">
              {specs.map((s, i) => (
                <div className="md-spec-tile" key={i}>
                  <div className="md-spec-tile__icon">{s.icon}</div>
                  <div className="md-spec-tile__label">{s.label}</div>
                  <div className="md-spec-tile__value">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Big call-to-action panel */}
            <div
              className="md-card"
              style={{
                marginTop: 20,
                background: "linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)",
                padding: "36px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative circles */}
              <div style={{
                position: "absolute", width: 200, height: 200, borderRadius: "50%",
                background: "rgba(200,240,78,0.08)", top: -60, right: -60,
              }} />
              <div style={{
                position: "absolute", width: 120, height: 120, borderRadius: "50%",
                background: "rgba(200,240,78,0.05)", bottom: 20, left: -30,
              }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem", fontWeight: 600,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "var(--accent)", marginBottom: 10,
                }}>Ready to Shop?</div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem", fontWeight: 800,
                  color: "#fff", lineHeight: 1.2, marginBottom: 12,
                }}>Grab your snacks<br />in seconds</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>
                  Tap below to browse real-time stock, prices & deals.
                </div>
                <button
                  className="md-btn-primary"
                  style={{ background: "var(--accent)", color: "var(--ink)" }}
                  onClick={() => navigate("/user/products")}
                >
                  <IconCart /> Browse Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTACT DIALOG ── */}
      <Dialog
        open={openContact}
        onClose={() => setOpenContact(false)}
        PaperProps={{
          sx: {
            borderRadius: "24px",
            overflow: "hidden",
            minWidth: 340,
            position: "relative",
            fontFamily: "var(--font-body)",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <div className="md-dialog-inner">
            <button className="md-dialog-close" onClick={() => setOpenContact(false)}>
              <IconClose />
            </button>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, #fee2e2, #fecaca)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <IconAlert />
            </div>
            <h2>Report an Issue</h2>
            <p>For technical issues with <strong>{machine.name}</strong>, contact support directly:</p>
            <span className="md-dialog-phone">{machine.contact_phone || "N/A"}</span>
            <button
              className="md-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => setOpenContact(false)}
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
