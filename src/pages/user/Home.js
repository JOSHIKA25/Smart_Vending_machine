import React from "react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════ CSS ═══════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --ink: #0a0a0a;
  --ink-soft: #555;
  --ink-muted: #999;
  --canvas: #f2f1ed;
  --surface: #ffffff;
  --border: rgba(0,0,0,0.07);
  --accent: #c8f04e;
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-body);
  background: var(--canvas);
  color: var(--ink);
}

/* PAGE */
.hm-page {
  min-height: 100vh;
}

/* TOPBAR */
.hm-topbar {
  position: sticky;
  top: 0;
  background: rgba(242,241,237,0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 0 40px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hm-topbar__logo {
  font-family: var(--font-display);
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hm-topbar__logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.hm-topbar__nav {
  display: flex;
  gap: 10px;
}

.hm-btn-login {
  border: 1px solid var(--border);
  background: transparent;
  padding: 8px 18px;
  border-radius: 100px;
  cursor: pointer;
}

.hm-btn-primary {
  background: var(--ink);
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 100px;
  cursor: pointer;
}

/* HERO */
.hm-hero {
  max-width: 900px;
  margin: auto;
  padding: 100px 20px 60px;
  text-align: center;
}

.hm-hero__eyebrow {
  font-size: 12px;
  color: var(--ink-muted);
  margin-bottom: 20px;
}

.hm-hero__title {
  font-family: var(--font-display);
  font-size: 64px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
}

.hm-hero__title-accent {
  background: var(--accent);
  padding: 0 6px;
}

.hm-hero__sub {
  color: var(--ink-soft);
  margin-bottom: 30px;
}

.hm-hero__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.hm-btn-cta {
  background: var(--ink);
  color: white;
  border: none;
  padding: 14px 26px;
  border-radius: 10px;
  cursor: pointer;
}

.hm-btn-outline {
  border: 1px solid var(--border);
  background: transparent;
  padding: 14px 24px;
  border-radius: 10px;
  cursor: pointer;
}

/* STATS */
.hm-stats {
  max-width: 1100px;
  margin: auto;
  padding: 40px 20px;
}

.hm-stats__inner {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

.hm-stats__item {
  flex: 1;
  background: white;
  padding: 20px;
  text-align: center;
}

.hm-stats__num {
  font-size: 28px;
  font-weight: 800;
}

.hm-stats__num span {
  color: var(--accent);
}

.hm-stats__label {
  font-size: 12px;
  color: var(--ink-muted);
}
`;

/* Inject CSS */
function injectStyles() {
  if (!document.getElementById("home-style")) {
    const style = document.createElement("style");
    style.id = "home-style";
    style.innerHTML = CSS;
    document.head.appendChild(style);
  }
}

export default function Home() {
  const navigate = useNavigate();
  injectStyles();

  return (
    <div className="hm-page">

      {/* TOPBAR */}
      <div className="hm-topbar">
        <div className="hm-topbar__logo">
          <div className="hm-topbar__logo-dot" />
          Smart Vending
        </div>

        <div className="hm-topbar__nav">
          <button className="hm-btn-login" onClick={() => navigate("/login-selection")}>
            Log In
          </button>
          <button className="hm-btn-primary" onClick={() => navigate("/user/products")}>
            Get Started
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="hm-hero">
        <div className="hm-hero__eyebrow">
          ● System Online · All units active
        </div>

        <h1 className="hm-hero__title">
          Vending, <span className="hm-hero__title-accent">reinvented</span><br />
          for the future.
        </h1>

        <p className="hm-hero__sub">
          Fast, secure, and contactless shopping with real-time tracking.
        </p>

        <div className="hm-hero__actions">
          <button className="hm-btn-cta" onClick={() => navigate("/user/products")}>
            Browse Products →
          </button>

          <button className="hm-btn-outline" onClick={() => navigate("/login-selection")}>
            Log In
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="hm-stats">
        <div className="hm-stats__inner">
          {[
            { num: <><span>1200</span>+</>, label: "Transactions Today" },
            { num: <><span>24</span></>, label: "Active Machines" },
            { num: <><span>98.2</span>%</>, label: "Fleet Uptime" },
            { num: <><span>&lt;3</span>s</>, label: "Avg Time" },
          ].map((item, i) => (
            <div className="hm-stats__item" key={i}>
              <div className="hm-stats__num">{item.num}</div>
              <div className="hm-stats__label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}