import { useState, useEffect, useRef, useCallback } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

:root {
  --bg: #04050a;
  --bg2: #080a14;
  --bg3: #0d1020;
  --card: #0b0d1a;
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.12);
  --fg: #f0f0f8;
  --fg2: rgba(240,240,248,0.55);
  --fg3: rgba(240,240,248,0.22);
  --accent: #00ffb2;
  --accent2: #6e44ff;
  --accent3: #ff3d6a;
  --accent-soft: rgba(0,255,178,0.08);
  --nav-h: 76px;
  --radius: 14px;
  --shadow: 0 32px 80px rgba(0,0,0,0.7);
  --px: 60px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  font-family: 'Outfit', sans-serif;
  background: var(--bg);
  color: var(--fg);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
ul { list-style: none; }
button { font-family: inherit; }
img { max-width: 100%; display: block; }

/* SCROLLBAR */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: rgba(0,255,178,0.3); border-radius: 2px; }

/* CURSOR */
#dsCursor {
  position: fixed; top:0; left:0; pointer-events:none; z-index:99999;
  width:14px; height:14px; border-radius:50%; background:var(--accent);
  transform:translate(-50%,-50%);
  transition:width .15s, height .15s, background .2s;
  mix-blend-mode: difference;
}
#dsCursorRing {
  position: fixed; top:0; left:0; pointer-events:none; z-index:99998;
  width:42px; height:42px; border-radius:50%;
  border:1px solid rgba(0,255,178,0.4);
  transform:translate(-50%,-50%);
  transition:width .4s cubic-bezier(.23,1,.32,1), height .4s cubic-bezier(.23,1,.32,1);
}
body.hov #dsCursor { width:8px; height:8px; background:var(--accent3); }
body.hov #dsCursorRing { width:58px; height:58px; border-color:var(--accent3); }

/* SCROLL PROGRESS */
#scrollBar {
  position: fixed; top:0; left:0; height:2px; z-index:1002;
  background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3));
  transition: width .08s;
}

/* ─── NAV ─────────────────────────────────────────────────────────────────── */
.nav {
  position: fixed; top:0; left:0; right:0; z-index:1000;
  height: var(--nav-h);
  display: flex; align-items:center; justify-content:space-between;
  padding: 0 var(--px);
  background: rgba(4,5,10,0.85);
  backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px; letter-spacing:5px; color:var(--fg);
  display:flex; align-items:center; gap:10px; cursor:pointer;
  flex-shrink: 0;
}
.logo-gem {
  width:28px; height:28px; flex-shrink:0;
  background:conic-gradient(var(--accent) 0deg, var(--accent2) 180deg, var(--accent3) 360deg);
  clip-path: polygon(50% 0%,100% 50%,50% 100%,0% 50%);
  animation:gemSpin 8s linear infinite;
}
@keyframes gemSpin { to { filter:hue-rotate(360deg); } }
.nav-links { display:flex; align-items:center; gap:36px; }
.nav-links a {
  font-size:12px; letter-spacing:2px; text-transform:uppercase;
  color:var(--fg2); transition:color .2s; font-weight:500;
  white-space: nowrap;
}
.nav-links a:hover, .nav-links a.active { color:var(--fg); }
.nav-links a.active { position:relative; }
.nav-links a.active::after {
  content:''; position:absolute; bottom:-4px; left:0; right:0; height:1px; background:var(--accent);
}
.nav-cta {
  font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:600;
  padding:10px 24px; border-radius:100px;
  background:var(--accent); color:#04050a; border:none; cursor:pointer;
  transition:transform .2s, box-shadow .2s;
  flex-shrink: 0; white-space: nowrap;
}
.nav-cta:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,255,178,0.4); }
.nav-mobile-btn {
  display:none; flex-direction:column; gap:5px;
  background:none; border:none; cursor:pointer; padding:4px;
}
.nav-mobile-btn span { display:block; width:22px; height:2px; background:var(--fg); border-radius:2px; transition:.3s; }
.nav-mobile-btn.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
.nav-mobile-btn.open span:nth-child(2) { opacity:0; }
.nav-mobile-btn.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }
.mobile-menu {
  display:none; position:fixed; top:var(--nav-h); left:0; right:0; bottom:0;
  background:var(--bg); z-index:999; flex-direction:column; padding:48px 32px; gap:28px;
}
.mobile-menu.open { display:flex; }
.mobile-menu a { font-family:'Bebas Neue',sans-serif; font-size:42px; letter-spacing:4px; color:var(--fg); }

/* PAGE */
.page { padding-top: var(--nav-h); min-height:100vh; }

/* ─── BUTTONS ──────────────────────────────────────────────────────────────── */
.btn-primary {
  display:inline-flex; align-items:center; justify-content:center; gap:10px;
  background:var(--accent); color:#04050a;
  padding:14px 32px; border-radius:100px;
  font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:700;
  border:none; cursor:pointer;
  transition:transform .2s, box-shadow .2s;
  box-shadow: 0 4px 24px rgba(0,255,178,0.25);
  white-space: nowrap;
}
.btn-primary:hover { transform:translateY(-3px); box-shadow:0 10px 40px rgba(0,255,178,0.45); }
.btn-outline {
  display:inline-flex; align-items:center; justify-content:center; gap:10px;
  background:transparent; color:var(--fg);
  padding:14px 32px; border-radius:100px;
  font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:500;
  border:1px solid var(--border2); cursor:pointer;
  transition:border-color .2s, background .2s;
  white-space: nowrap;
}
.btn-outline:hover { border-color:var(--accent); background:var(--accent-soft); }
.btn-ghost {
  background:none; border:none; cursor:pointer;
  font-size:12px; letter-spacing:2px; text-transform:uppercase; color:var(--fg2);
  font-family:inherit; transition:color .2s;
}
.btn-ghost:hover { color:var(--accent); }

/* ─── LABELS ───────────────────────────────────────────────────────────────── */
.label {
  display:inline-flex; align-items:center; gap:8px;
  font-size:10px; letter-spacing:4px; text-transform:uppercase;
  color:var(--accent); font-weight:600; font-family:'Space Mono',monospace;
}
.label::before {
  content:''; width:20px; height:1px; background:var(--accent); flex-shrink:0;
}

/* ─── SECTION TITLE ────────────────────────────────────────────────────────── */
.section-title {
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(52px,8vw,100px);
  line-height:0.9; letter-spacing:2px;
  color:var(--fg);
}
.section-title .outline { -webkit-text-stroke:1.5px var(--fg); color:transparent; }
.section-title .accent { color:var(--accent); }

/* FADE IN */
.fade-in { opacity:0; transform:translateY(28px); transition:opacity .7s ease, transform .7s ease; }
.fade-in.visible { opacity:1; transform:translateY(0); }
.fade-d1 { transition-delay:.1s; }
.fade-d2 { transition-delay:.2s; }
.fade-d3 { transition-delay:.3s; }
.fade-d4 { transition-delay:.4s; }

/* ─── MARQUEE ──────────────────────────────────────────────────────────────── */
.marquee-wrap { overflow:hidden; border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--bg2); }
.marquee-track { display:inline-flex; white-space:nowrap; animation:marqueeAnim 30s linear infinite; }
.marquee-wrap:hover .marquee-track { animation-play-state:paused; }
.marquee-item { padding:14px 28px; font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--fg3); font-family:'Space Mono',monospace; }
.marquee-dot { width:4px; height:4px; border-radius:50%; background:var(--accent); display:inline-block; vertical-align:middle; margin:0 4px; }
@keyframes marqueeAnim { to { transform:translateX(-50%); } }

/* ─── FOOTER ───────────────────────────────────────────────────────────────── */
.footer {
  background:var(--bg2); border-top:1px solid var(--border);
  padding:80px var(--px) 40px;
}
.footer-top {
  display:grid; grid-template-columns:1.2fr repeat(3,1fr);
  gap:60px; margin-bottom:60px;
}
.footer-brand p { font-size:14px; color:var(--fg2); line-height:1.7; margin-top:16px; max-width:260px; font-weight:300; }
.footer-col h5 { font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--fg3); font-family:'Space Mono',monospace; margin-bottom:20px; }
.footer-col ul { display:flex; flex-direction:column; gap:12px; }
.footer-col a { font-size:14px; color:var(--fg2); transition:color .2s; font-weight:300; }
.footer-col a:hover { color:var(--fg); }
.footer-bottom {
  display:flex; justify-content:space-between; align-items:center;
  padding-top:40px; border-top:1px solid var(--border); flex-wrap:wrap; gap:12px;
}
.footer-bottom p { font-size:12px; color:var(--fg3); font-family:'Space Mono',monospace; }
.social-row { display:flex; gap:12px; }
.social-row a {
  width:38px; height:38px; border-radius:50%; border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center; font-size:14px;
  color:var(--fg3); transition:border-color .2s, color .2s;
}
.social-row a:hover { border-color:var(--accent); color:var(--accent); }

/* ─── AI CHAT ──────────────────────────────────────────────────────────────── */
.ai-fab { position:fixed; bottom:32px; right:32px; z-index:800; }
.ai-fab-btn {
  width:56px; height:56px; border-radius:50%;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  border:none; cursor:pointer; font-size:20px;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 4px 24px rgba(0,255,178,0.4);
  transition:transform .3s;
}
.ai-fab-btn:hover { transform:scale(1.08); }
.ai-bubble {
  position:fixed; bottom:100px; right:32px; z-index:800;
  width:360px; background:var(--bg2);
  border:1px solid var(--border2); border-radius:20px;
  box-shadow: var(--shadow);
  transform:scale(0.9) translateY(16px); transform-origin:bottom right;
  opacity:0; pointer-events:none;
  transition:transform .3s cubic-bezier(.23,1,.32,1), opacity .3s;
  overflow:hidden;
}
.ai-bubble.open { transform:scale(1) translateY(0); opacity:1; pointer-events:all; }
.ai-bubble-head {
  padding:16px 18px; background:linear-gradient(135deg,rgba(0,255,178,0.07),rgba(110,68,255,0.07));
  border-bottom:1px solid var(--border);
  display:flex; align-items:center; justify-content:space-between;
}
.ai-head-info { display:flex; align-items:center; gap:10px; }
.ai-dot-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:flex; align-items:center; justify-content:center; font-size:16px; position:relative; flex-shrink:0; }
.ai-dot-avatar::after { content:''; position:absolute; bottom:1px; right:1px; width:9px; height:9px; border-radius:50%; background:#00e676; border:2px solid var(--bg2); }
.ai-head-name { font-size:14px; font-weight:700; font-family:'Bebas Neue',sans-serif; letter-spacing:2px; }
.ai-head-status { font-size:11px; color:var(--accent); font-family:'Space Mono',monospace; }
.ai-close { background:none; border:1px solid var(--border); border-radius:50%; width:28px; height:28px; cursor:pointer; color:var(--fg2); font-size:12px; display:flex; align-items:center; justify-content:center; transition:background .2s; flex-shrink:0; }
.ai-close:hover { background:var(--bg3); color:var(--fg); }
.ai-msgs { padding:16px; height:260px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; }
.ai-msgs::-webkit-scrollbar { width:3px; }
.ai-msg { font-size:13px; line-height:1.5; padding:10px 14px; border-radius:12px; max-width:87%; animation:msgIn .25s ease; }
@keyframes msgIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.ai-msg.bot { background:var(--bg3); border:1px solid var(--border); border-radius:4px 12px 12px 12px; align-self:flex-start; }
.ai-msg.user { background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#04050a; align-self:flex-end; border-radius:12px 12px 4px 12px; font-weight:500; }
.ai-typing { display:flex; gap:4px; padding:10px 14px; background:var(--bg3); border:1px solid var(--border); border-radius:4px 12px 12px 12px; width:fit-content; align-self:flex-start; }
.ai-typing span { width:6px; height:6px; border-radius:50%; background:var(--accent); opacity:.5; animation:typBounce 1.2s ease-in-out infinite; }
.ai-typing span:nth-child(2) { animation-delay:.2s; }
.ai-typing span:nth-child(3) { animation-delay:.4s; }
@keyframes typBounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-5px); opacity:1; } }
.ai-footer { padding:12px 14px; border-top:1px solid var(--border); background:var(--bg); }
.ai-quick { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
.ai-qbtn { font-size:10px; letter-spacing:1px; text-transform:uppercase; padding:4px 11px; border-radius:100px; border:1px solid var(--border); color:var(--fg3); background:none; cursor:pointer; transition:border-color .2s, color .2s; font-family:inherit; }
.ai-qbtn:hover { border-color:var(--accent); color:var(--accent); }
.ai-input-row { display:flex; gap:8px; align-items:center; }
.ai-input { flex:1; background:var(--bg3); border:1px solid var(--border); border-radius:10px; padding:9px 12px; font-size:13px; color:var(--fg); font-family:inherit; outline:none; resize:none; height:40px; transition:border-color .2s; line-height:1.4; }
.ai-input:focus { border-color:rgba(0,255,178,0.3); }
.ai-input::placeholder { color:var(--fg3); }
.ai-send { width:40px; height:40px; border-radius:10px; background:var(--accent); border:none; cursor:pointer; color:#04050a; font-size:15px; display:flex; align-items:center; justify-content:center; transition:transform .2s, opacity .2s; flex-shrink:0; }
.ai-send:hover { transform:scale(1.05); }
.ai-send:disabled { opacity:.4; cursor:default; }
.ai-powered { text-align:center; font-size:9px; color:var(--fg3); letter-spacing:2px; text-transform:uppercase; padding-top:10px; font-family:'Space Mono',monospace; }

/* ═══════ HOME PAGE ══════════════════════════════════════════════════════════ */
.hero {
  min-height:100vh; padding:0 var(--px); display:flex; align-items:center;
  position:relative; overflow:hidden;
}
.hero-bg {
  position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(ellipse 70% 80% at 75% 50%, rgba(0,255,178,.06) 0%, transparent 60%),
             radial-gradient(ellipse 50% 50% at 20% 70%, rgba(110,68,255,.05) 0%, transparent 55%);
}
.hero-grid-bg {
  position:absolute; inset:0;
  background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);
  background-size:64px 64px;
  mask-image:linear-gradient(to bottom,transparent,rgba(0,0,0,.2) 20%,rgba(0,0,0,.1) 70%,transparent);
}
.hero-inner { position:relative; z-index:2; max-width:800px; }
.hero-eyebrow { display:flex; align-items:center; gap:12px; margin-bottom:32px; }
.hero-badge {
  background:var(--accent-soft); border:1px solid rgba(0,255,178,0.2);
  padding:6px 16px; border-radius:100px;
  font-size:10px; letter-spacing:3px; text-transform:uppercase;
  color:var(--accent); font-family:'Space Mono',monospace;
}
.hero-h1 {
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(80px,14vw,180px);
  line-height:.88; letter-spacing:3px; margin-bottom:32px;
}
.hero-h1 .line { display:block; overflow:hidden; }
.hero-h1 .line span { display:inline-block; animation:heroIn 1s cubic-bezier(.23,1,.32,1) both; }
.hero-h1 .line:nth-child(1) span { animation-delay:.3s; }
.hero-h1 .line:nth-child(2) span { animation-delay:.45s; }
.hero-h1 .line:nth-child(3) span { animation-delay:.6s; }
@keyframes heroIn { from { transform:translateY(110%); opacity:0; } to { transform:translateY(0); opacity:1; } }
.hero-h1 .stroke { -webkit-text-stroke:2px var(--fg); color:transparent; }
.hero-h1 .hi { color:var(--accent); }
.hero-desc { font-size:17px; line-height:1.72; color:var(--fg2); max-width:480px; font-weight:300; margin-bottom:40px; }
.hero-ctas { display:flex; gap:14px; flex-wrap:wrap; margin-bottom:72px; align-items:center; }
.hero-stats { display:flex; gap:52px; flex-wrap:wrap; align-items:flex-start; }
.stat-item { display:flex; flex-direction:column; }
.stat-num { font-family:'Bebas Neue',sans-serif; font-size:44px; letter-spacing:2px; line-height:1; color:var(--fg); }
.stat-num em { color:var(--accent); font-style:normal; }
.stat-lbl { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--fg3); margin-top:4px; font-family:'Space Mono',monospace; }
.hero-visual {
  position:absolute; right:0; top:50%; transform:translateY(-50%);
  width:min(640px,50vw); height:min(640px,50vw); pointer-events:none; z-index:1;
}
.hero-visual canvas { width:100%!important; height:100%!important; }
.scroll-hint {
  position:absolute; bottom:36px; left:var(--px); z-index:2;
  display:flex; align-items:center; gap:12px;
  font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--fg3); font-family:'Space Mono',monospace;
}
.scroll-line { width:40px; height:1px; background:var(--fg3); position:relative; overflow:hidden; }
.scroll-line::after { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:var(--accent); animation:scrollLine 2s ease-in-out infinite; }
@keyframes scrollLine { to { left:100%; } }

/* ─── BENTO STATS ──────────────────────────────────────────────────────────── */
.bento { padding:80px var(--px) 100px; display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
.bento-card {
  background:var(--card); border:1px solid var(--border);
  border-radius:var(--radius); padding:32px 28px;
  position:relative; overflow:hidden;
  transition:border-color .3s, transform .3s;
}
.bento-card:hover { border-color:rgba(0,255,178,.25); transform:translateY(-4px); }
.bento-card::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--accent),var(--accent2)); opacity:0; transition:opacity .3s; }
.bento-card:hover::after { opacity:1; }
.bento-num { font-family:'Bebas Neue',sans-serif; font-size:52px; letter-spacing:2px; color:var(--fg); line-height:1; }
.bento-num em { color:var(--accent); font-style:normal; }
.bento-lbl { font-size:11px; letter-spacing:3px; text-transform:uppercase; color:var(--fg3); margin-top:8px; font-family:'Space Mono',monospace; }
.bento-desc { font-size:13px; color:var(--fg2); margin-top:10px; line-height:1.6; font-weight:300; }

/* ─── CLIENTS ──────────────────────────────────────────────────────────────── */
.clients-section { padding:60px 0; overflow:hidden; border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--bg2); }
.clients-label { text-align:center; font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--fg3); margin-bottom:36px; font-family:'Space Mono',monospace; }
.clients-track { display:flex; gap:72px; animation:mqAnim 24s linear infinite; align-items:center; }
@keyframes mqAnim { to { transform:translateX(-50%); } }
.client-name { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:5px; color:var(--fg3); white-space:nowrap; transition:color .3s; }
.client-name:hover { color:var(--fg2); }

/* ─── HOME FEATURES ────────────────────────────────────────────────────────── */
.features-section {
  padding:100px var(--px);
  display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start;
}
.features-left { display:flex; flex-direction:column; }
.features-list { display:flex; flex-direction:column; gap:0; margin-top:0; }
.feature-item { display:flex; gap:24px; padding:28px 0; border-bottom:1px solid var(--border); cursor:pointer; transition:padding-left .3s; }
.feature-item:first-child { border-top:1px solid var(--border); }
.feature-item:hover { padding-left:12px; }
.feature-item:hover .fi-num { color:var(--accent); }
.fi-num { font-family:'Space Mono',monospace; font-size:12px; color:var(--fg3); flex-shrink:0; padding-top:3px; }
.fi-title { font-size:18px; font-weight:600; margin-bottom:8px; }
.fi-desc { font-size:13px; color:var(--fg2); line-height:1.65; font-weight:300; }

/* Features visual card */
.features-visual { position:relative; top:0; }
.fv-card {
  background:var(--card); border:1px solid var(--border); border-radius:20px;
  padding:40px; position:relative; overflow:hidden;
}
.fv-card::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse at top right, rgba(0,255,178,.05) 0%, transparent 60%);
  pointer-events:none;
}
.fv-metric { margin-bottom:28px; }
.fv-label { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--fg3); font-family:'Space Mono',monospace; margin-bottom:8px; }
.fv-value { font-family:'Bebas Neue',sans-serif; font-size:64px; letter-spacing:2px; color:var(--accent); line-height:1; }
.fv-bars { display:flex; flex-direction:column; gap:14px; }
.fv-bar-row { display:flex; align-items:center; gap:12px; }
.fv-bar-label { font-size:11px; color:var(--fg2); width:72px; font-weight:500; flex-shrink:0; }
.fv-bar-bg { flex:1; height:6px; background:rgba(255,255,255,.06); border-radius:3px; overflow:hidden; }
.fv-bar-fill { height:100%; border-radius:3px; transition:width .8s ease; }
.fv-bar-pct { font-size:11px; color:var(--fg3); font-family:'Space Mono',monospace; width:36px; text-align:right; flex-shrink:0; }

/* ─── TESTIMONIAL TEASE ────────────────────────────────────────────────────── */
.tease-section { padding:100px var(--px); background:var(--bg2); }
.tease-inner { display:grid; grid-template-columns:1fr 2fr; gap:80px; align-items:start; }
.tease-cards { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.tease-card {
  background:var(--card); border:1px solid var(--border); border-radius:var(--radius);
  padding:28px; transition:transform .3s, box-shadow .3s;
}
.tease-card:hover { transform:translateY(-4px); box-shadow:0 16px 48px rgba(0,0,0,.4); }
.tease-stars { color:var(--accent); font-size:11px; letter-spacing:2px; margin-bottom:14px; }
.tease-text { font-size:13px; line-height:1.65; color:var(--fg2); font-weight:300; margin-bottom:20px; }
.tease-author { display:flex; align-items:center; gap:10px; }
.ta-av { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; }
.ta-name { font-size:13px; font-weight:600; }
.ta-role { font-size:11px; color:var(--fg3); margin-top:2px; }

/* ═══════ SERVICES PAGE ═══════════════════════════════════════════════════════ */
.services-hero { padding:100px var(--px) 80px; }
.services-hero-inner { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
.services-intro { font-size:16px; line-height:1.75; color:var(--fg2); font-weight:300; margin-top:24px; }
.services-grid {
  padding:0 var(--px) 100px;
  display:grid; grid-template-columns:repeat(3,1fr);
  gap:2px; background:var(--border); border-radius:20px; overflow:hidden;
  margin:0 var(--px);
}
.svc-card {
  background:var(--card); padding:44px 36px;
  position:relative; overflow:hidden; cursor:pointer;
  transition:background .3s;
}
.svc-card:hover { background:var(--bg3); }
.svc-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; opacity:0; transition:opacity .3s; }
.svc-card:nth-child(1)::before { background:var(--accent); }
.svc-card:nth-child(2)::before { background:var(--accent2); }
.svc-card:nth-child(3)::before { background:var(--accent3); }
.svc-card:nth-child(4)::before { background:var(--accent); }
.svc-card:nth-child(5)::before { background:var(--accent2); }
.svc-card:nth-child(6)::before { background:var(--accent3); }
.svc-card:hover::before { opacity:1; }
.svc-icon { font-size:36px; margin-bottom:20px; display:block; }
.svc-num { font-family:'Space Mono',monospace; font-size:11px; letter-spacing:3px; color:var(--fg3); margin-bottom:14px; }
.svc-title { font-size:20px; font-weight:700; margin-bottom:12px; font-family:'Bebas Neue',sans-serif; letter-spacing:2px; }
.svc-desc { font-size:14px; line-height:1.7; color:var(--fg2); font-weight:300; margin-bottom:20px; }
.svc-tags { display:flex; flex-wrap:wrap; gap:6px; }
.svc-tag { font-size:9px; letter-spacing:2px; text-transform:uppercase; padding:3px 10px; border:1px solid var(--border); border-radius:100px; color:var(--fg3); }
.svc-arrow { position:absolute; top:28px; right:28px; font-size:18px; color:var(--fg3); transition:transform .3s, color .3s; }
.svc-card:hover .svc-arrow { transform:translate(4px,-4px); color:var(--accent); }

/* ─── PROCESS STEPS ────────────────────────────────────────────────────────── */
.process-section { padding:100px var(--px); background:var(--bg2); }
.process-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--border); border-radius:16px; overflow:hidden; margin-top:64px; }
.proc-step { background:var(--card); padding:36px 28px; position:relative; }
.proc-step-num { font-family:'Bebas Neue',sans-serif; font-size:48px; letter-spacing:2px; color:rgba(0,255,178,.12); line-height:1; margin-bottom:16px; }
.proc-step-title { font-size:16px; font-weight:600; margin-bottom:10px; }
.proc-step-desc { font-size:13px; line-height:1.65; color:var(--fg2); font-weight:300; }
.proc-connector { position:absolute; top:40px; right:-12px; width:24px; height:24px; background:var(--bg2); border:1px solid var(--border); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; color:var(--accent); z-index:1; }

/* ═══════ PORTFOLIO PAGE ═══════════════════════════════════════════════════════ */
.portfolio-hero { padding:100px var(--px) 60px; }
.portfolio-filters { display:flex; gap:8px; flex-wrap:wrap; margin-top:48px; align-items:center; }
.pf-btn {
  font-size:10px; letter-spacing:2px; text-transform:uppercase;
  padding:9px 22px; border-radius:100px; border:1px solid var(--border);
  color:var(--fg2); background:none; cursor:pointer; font-family:inherit;
  transition:background .2s, color .2s, border-color .2s;
}
.pf-btn.active, .pf-btn:hover { background:var(--accent); color:#04050a; border-color:var(--accent); font-weight:600; }
.portfolio-grid { padding:0 var(--px) 100px; display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.portfolio-item {
  background:var(--card); border:1px solid var(--border); border-radius:var(--radius);
  overflow:hidden; cursor:pointer; transition:transform .3s, box-shadow .3s, opacity .4s;
  position:relative;
}
.portfolio-item:hover { transform:translateY(-6px); box-shadow:0 20px 60px rgba(0,0,0,.5); }
.portfolio-item.hidden { opacity:0.12; transform:scale(.97); pointer-events:none; }
.pi-img { height:260px; position:relative; overflow:hidden; }
.pi-img-inner { width:100%; height:100%; transition:transform .6s cubic-bezier(.23,1,.32,1); }
.portfolio-item:hover .pi-img-inner { transform:scale(1.05); }
.pi-overlay {
  position:absolute; inset:0;
  background:linear-gradient(to top,rgba(4,5,10,.85) 0%,transparent 50%);
  display:flex; align-items:flex-end; padding:24px;
  opacity:0; transition:opacity .3s;
}
.portfolio-item:hover .pi-overlay { opacity:1; }
.pi-overlay-btn { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--accent); border:1px solid var(--accent); padding:6px 16px; border-radius:100px; }
.pi-content { padding:24px; }
.pi-tag { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--accent); font-family:'Space Mono',monospace; margin-bottom:8px; }
.pi-title { font-size:18px; font-weight:700; margin-bottom:6px; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; }
.pi-meta { font-size:12px; color:var(--fg2); }
.pi-result { margin-top:12px; padding-top:12px; border-top:1px solid var(--border); font-size:12px; color:var(--accent); font-family:'Space Mono',monospace; }

/* ═══════ ABOUT PAGE ═══════════════════════════════════════════════════════════ */
.about-hero { padding:100px var(--px) 80px; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
.about-visual { position:relative; }
.about-img-wrap {
  border-radius:20px; overflow:visible; aspect-ratio:1/1;
  background:var(--card); border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center;
  font-size:80px; position:relative; border-radius:20px;
}
.about-img-wrap::before {
  content:''; position:absolute; inset:0; border-radius:20px;
  background:radial-gradient(ellipse at center, rgba(0,255,178,.06) 0%, transparent 70%);
}
.about-float {
  position:absolute; background:var(--card); border:1px solid var(--border2);
  border-radius:12px; padding:16px 20px; backdrop-filter:blur(12px);
  z-index:2;
}
.about-float-1 { top:-20px; right:-20px; }
.about-float-2 { bottom:-20px; left:-20px; }
.af-num { font-family:'Bebas Neue',sans-serif; font-size:32px; letter-spacing:2px; color:var(--accent); line-height:1; }
.af-lbl { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--fg3); font-family:'Space Mono',monospace; margin-top:4px; }
.about-content-text { font-size:16px; line-height:1.75; color:var(--fg2); font-weight:300; margin-top:24px; margin-bottom:24px; }

/* Values */
.values-section { padding:80px var(--px) 100px; }
.values-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:64px; }
.value-card {
  background:var(--card); border:1px solid var(--border); border-radius:var(--radius);
  padding:36px 28px; transition:border-color .3s, transform .3s;
}
.value-card:hover { border-color:rgba(0,255,178,.25); transform:translateY(-4px); }
.value-icon { font-size:32px; margin-bottom:16px; display:block; }
.value-title { font-size:18px; font-weight:600; margin-bottom:10px; font-family:'Bebas Neue',sans-serif; letter-spacing:2px; }
.value-desc { font-size:14px; color:var(--fg2); line-height:1.65; font-weight:300; }

/* Team */
.team-section { padding:100px var(--px); background:var(--bg2); }
.team-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-top:64px; }
.team-card {
  background:var(--card); border:1px solid var(--border); border-radius:var(--radius);
  overflow:hidden; transition:transform .3s;
}
.team-card:hover { transform:translateY(-4px); }
.team-photo { height:200px; display:flex; align-items:center; justify-content:center; font-size:56px; position:relative; overflow:hidden; }
.team-info { padding:20px; }
.team-name { font-size:16px; font-weight:700; font-family:'Bebas Neue',sans-serif; letter-spacing:2px; }
.team-role { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--accent); margin-top:4px; font-family:'Space Mono',monospace; }
.team-bio { font-size:13px; color:var(--fg2); margin-top:10px; line-height:1.55; font-weight:300; }

/* ═══════ PRICING PAGE ═══════════════════════════════════════════════════════ */
.pricing-hero { padding:100px var(--px) 60px; text-align:center; }
.pricing-subtitle { font-size:16px; color:var(--fg2); margin-top:20px; font-weight:300; max-width:500px; margin-inline:auto; line-height:1.65; }
.pricing-toggle { display:flex; align-items:center; gap:14px; justify-content:center; margin-top:36px; flex-wrap:wrap; }
.toggle-label { font-size:12px; letter-spacing:2px; text-transform:uppercase; color:var(--fg2); }
.toggle-track {
  width:52px; height:28px; border-radius:14px; border:1px solid var(--border2);
  background:var(--bg3); position:relative; cursor:pointer; flex-shrink:0;
}
.toggle-thumb { position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%; background:var(--fg); transition:transform .3s; }
.toggle-track.active .toggle-thumb { transform:translateX(24px); background:var(--accent); }
.toggle-save { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--accent); font-family:'Space Mono',monospace; }

.pricing-cards { padding:0 var(--px) 80px; display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.pricing-card {
  background:var(--card); border:1px solid var(--border); border-radius:20px;
  padding:44px 36px; position:relative; overflow:hidden;
  transition:transform .3s, box-shadow .3s;
  display:flex; flex-direction:column;
}
.pricing-card:hover { transform:translateY(-6px); box-shadow:0 24px 64px rgba(0,0,0,.5); }
.pricing-card.featured {
  border-color:rgba(0,255,178,.3);
  background:linear-gradient(160deg,rgba(0,255,178,.04) 0%,var(--card) 50%);
}
.pricing-card.featured::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--accent),var(--accent2)); }
.pricing-badge { position:absolute; top:24px; right:24px; background:var(--accent); color:#04050a; font-size:9px; letter-spacing:2px; text-transform:uppercase; padding:4px 12px; border-radius:100px; font-weight:700; }
.pricing-tier { font-size:11px; letter-spacing:4px; text-transform:uppercase; color:var(--fg3); font-family:'Space Mono',monospace; margin-bottom:16px; }
.pricing-name { font-family:'Bebas Neue',sans-serif; font-size:32px; letter-spacing:3px; margin-bottom:8px; }
.pricing-price { font-family:'Bebas Neue',sans-serif; font-size:68px; letter-spacing:2px; line-height:1; color:var(--fg); margin:24px 0 4px; display:flex; align-items:flex-start; gap:2px; }
.pricing-price em { font-size:28px; font-style:normal; color:var(--fg3); margin-top:8px; }
.pricing-period { font-size:12px; color:var(--fg3); margin-bottom:28px; font-family:'Space Mono',monospace; }
.pricing-divider { height:1px; background:var(--border); margin:28px 0; }
.pricing-features { display:flex; flex-direction:column; gap:12px; margin-bottom:32px; flex:1; }
.pf-feature { display:flex; align-items:flex-start; gap:10px; font-size:14px; color:var(--fg2); font-weight:300; line-height:1.5; }
.pf-check { color:var(--accent); flex-shrink:0; margin-top:2px; font-size:12px; }
.pf-cross { color:var(--fg3); flex-shrink:0; margin-top:2px; font-size:12px; }

/* FAQ */
.pricing-faq { padding:0 var(--px) 100px; }
.faq-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:64px; }
.faq-item { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:28px; cursor:pointer; transition:border-color .3s; }
.faq-item:hover { border-color:rgba(0,255,178,.2); }
.faq-q { font-size:15px; font-weight:600; display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
.faq-icon { flex-shrink:0; color:var(--accent); font-size:20px; transition:transform .3s; line-height:1; margin-top:1px; }
.faq-item.open .faq-icon { transform:rotate(45deg); }
.faq-a { font-size:13px; color:var(--fg2); line-height:1.65; margin-top:14px; font-weight:300; display:none; }
.faq-item.open .faq-a { display:block; }

/* ═══════ CTA SECTION ═══════════════════════════════════════════════════════ */
.cta-section { padding:120px var(--px); text-align:center; position:relative; overflow:hidden; }
.cta-bg { position:absolute; inset:0; background:radial-gradient(ellipse 60% 60% at 50% 50%,rgba(0,255,178,.05) 0%,transparent 65%); pointer-events:none; }
.cta-eyebrow { font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--accent); font-family:'Space Mono',monospace; margin-bottom:20px; }
.cta-h2 { font-family:'Bebas Neue',sans-serif; font-size:clamp(60px,12vw,160px); letter-spacing:4px; line-height:.9; color:var(--fg); margin-bottom:40px; }
.cta-h2 span { -webkit-text-stroke:2px var(--fg); color:transparent; }
.cta-btns { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; align-items:center; }

/* ─── SECTION HEADER UTILITY ───────────────────────────────────────────────── */
.section-header-center { text-align:center; margin-bottom:0; }
.section-header-center .label { justify-content:center; }

/* ═══════ RESPONSIVE ═══════════════════════════════════════════════════════ */
@media (max-width:1200px) {
  :root { --px: 40px; }
}
@media (max-width:1024px) {
  .services-grid { grid-template-columns:repeat(2,1fr); margin:0 var(--px); }
  .portfolio-grid { grid-template-columns:repeat(2,1fr); }
  .team-grid { grid-template-columns:repeat(2,1fr); }
  .pricing-cards { grid-template-columns:1fr; max-width:480px; margin-inline:auto; padding-bottom:80px; }
  .features-section { grid-template-columns:1fr; gap:60px; }
  .tease-inner { grid-template-columns:1fr; gap:48px; }
  .process-grid { grid-template-columns:repeat(2,1fr); }
  .footer-top { grid-template-columns:1fr 1fr; }
  .bento { grid-template-columns:repeat(2,1fr); }
  .about-hero { grid-template-columns:1fr; }
}
@media (max-width:768px) {
  :root { --nav-h:64px; --px: 24px; }
  .nav { padding:0 24px; }
  .nav-links { display:none; }
  .nav-mobile-btn { display:flex; }
  .hero { padding:0 24px; }
  .hero-h1 { font-size:clamp(64px,18vw,100px); }
  .hero-visual { display:none; }
  .scroll-hint { left:24px; }
  .bento { padding:60px 24px; grid-template-columns:1fr 1fr; }
  .clients-section { padding:48px 0; }
  .features-section { padding:60px 24px; }
  .tease-section { padding:60px 24px; }
  .tease-cards { grid-template-columns:1fr; }
  .services-hero { padding:60px 24px 40px; }
  .services-hero-inner { grid-template-columns:1fr; gap:40px; }
  .services-grid { padding:0; margin:0 24px; grid-template-columns:1fr; }
  .process-section { padding:60px 24px; }
  .process-grid { grid-template-columns:1fr; }
  .portfolio-hero { padding:60px 24px 40px; }
  .portfolio-grid { padding:0 24px 60px; grid-template-columns:1fr; }
  .about-hero { padding:60px 24px; grid-template-columns:1fr; }
  .about-visual { display:none; }
  .values-section { padding:60px 24px; }
  .values-grid { grid-template-columns:1fr; }
  .team-section { padding:60px 24px; }
  .team-grid { grid-template-columns:1fr 1fr; }
  .pricing-hero { padding:60px 24px 40px; }
  .pricing-cards { padding:0 24px 60px; max-width:100%; }
  .pricing-faq { padding:0 24px 60px; }
  .faq-grid { grid-template-columns:1fr; }
  .cta-section { padding:80px 24px; }
  .footer { padding:60px 24px 32px; }
  .footer-top { grid-template-columns:1fr; gap:40px; }
  .ai-bubble { width:calc(100vw - 32px); right:16px; }
  #dsCursor, #dsCursorRing { display:none; }
  body { cursor:auto; }
  .ai-fab { bottom:24px; right:16px; }
  .hero-stats { gap:32px; }
  .hero-ctas { gap:12px; }
}
@media (max-width:480px) {
  .bento { grid-template-columns:1fr; }
  .team-grid { grid-template-columns:1fr; }
  .tease-cards { grid-template-columns:1fr; }
  .hero-stats { gap:24px; }
}
`;

// ─── Globe ──────────────────────────────────────────────────────────────────
const seedRng = (n) => { const x = Math.sin(n) * 43758.5453; return x - Math.floor(x); };
const DOTS = Array.from({length:380}, (_,i) => ({
  phi: Math.acos(1 - 2*seedRng(i*7+1)),
  theta: seedRng(i*13+3) * Math.PI*2,
  size: seedRng(i*17+5)*1.8+0.4,
  bright: seedRng(i*11+7),
}));
const ARCS = Array.from({length:18}, (_,i) => ({
  a: DOTS[Math.floor(seedRng(i*3)*DOTS.length)],
  b: DOTS[Math.floor(seedRng(i*7+50)*DOTS.length)],
  progress: seedRng(i*11),
  speed: 0.0018+seedRng(i*5)*0.0025,
  alpha: 0.3+seedRng(i*9)*0.5,
}));

function Globe() {
  const canvasRef = useRef(null);
  const rotRef = useRef(0);
  const tiltRef = useRef({tx:0,ty:0,cx:0,cy:0});
  const arcsRef = useRef(ARCS.map(a=>({...a})));
  const rafRef = useRef(null);
  useEffect(()=>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const handleMouse = e => { tiltRef.current.tx=(e.clientY/window.innerHeight-.5)*.35; tiltRef.current.ty=(e.clientX/window.innerWidth-.5)*.2; };
    window.addEventListener('mousemove',handleMouse);
    let dpr = window.devicePixelRatio||1;
    const resize = () => {
      dpr=window.devicePixelRatio||1;
      const w=canvas.parentElement;
      canvas.width=w.clientWidth*dpr;
      canvas.height=w.clientHeight*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    resize(); window.addEventListener('resize',resize);
    const proj = (phi,theta,rot,tx,ty,cx,cy,R) => {
      let x=Math.sin(phi)*Math.cos(theta+rot), y=Math.cos(phi), z=Math.sin(phi)*Math.sin(theta+rot);
      const cX=Math.cos(tx),sX=Math.sin(tx), y1=y*cX-z*sX, z1=y*sX+z*cX;
      const cY=Math.cos(ty),sY=Math.sin(ty), x2=x*cY+z1*sY, z2=-x*sY+z1*cY;
      return {sx:cx+x2*R,sy:cy-y1*R,depth:z2,vis:z2>-0.05};
    };
    const draw = () => {
      const W=canvas.width/dpr, H=canvas.height/dpr;
      ctx.clearRect(0,0,W,H);
      const cx=W/2,cy=H/2,R=Math.min(W,H)*.44;
      const t=tiltRef.current;
      t.cx+=(t.tx-t.cx)*.03; t.cy+=(t.ty-t.cy)*.03;
      // atmosphere
      const atmo=ctx.createRadialGradient(cx,cy,R*.6,cx,cy,R*1.3);
      atmo.addColorStop(0,'rgba(0,255,178,0)'); atmo.addColorStop(.6,'rgba(0,255,178,.02)'); atmo.addColorStop(1,'rgba(0,255,178,.12)');
      ctx.beginPath(); ctx.arc(cx,cy,R*1.3,0,Math.PI*2); ctx.fillStyle=atmo; ctx.fill();
      // sphere
      const sg=ctx.createRadialGradient(cx-R*.2,cy-R*.25,R*.02,cx,cy,R);
      sg.addColorStop(0,'rgba(18,30,55,.95)'); sg.addColorStop(.5,'rgba(6,10,22,.9)'); sg.addColorStop(1,'rgba(2,4,12,.95)');
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fillStyle=sg; ctx.fill();
      // grid
      ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.clip();
      for(let ld=-75;ld<=75;ld+=15){
        const lr=ld*Math.PI/180,slR=R*Math.cos(lr),slY=cy-R*Math.sin(lr);
        ctx.beginPath();ctx.ellipse(cx,slY,slR,slR*.18,0,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,255,178,.05)';ctx.lineWidth=.7;ctx.stroke();
      }
      for(let lo=0;lo<180;lo+=20){
        const angle=lo*Math.PI/180+rotRef.current,rxE=R*Math.abs(Math.cos(angle));
        ctx.beginPath();ctx.ellipse(cx,cy,rxE,R,0,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,255,178,.04)';ctx.lineWidth=.7;ctx.stroke();
      }
      ctx.restore();
      // arcs
      arcsRef.current.forEach(arc=>{
        arc.progress+=arc.speed; if(arc.progress>1.2) arc.progress=-0.1;
        const pA=proj(arc.a.phi,arc.a.theta,rotRef.current,t.cx,t.cy,cx,cy,R);
        const pB=proj(arc.b.phi,arc.b.theta,rotRef.current,t.cx,t.cy,cx,cy,R);
        if(!pA.vis||!pB.vis) return;
        const dist=Math.hypot(pB.sx-pA.sx,pB.sy-pA.sy);
        if(dist>R*.9) return;
        const mcx=(pA.sx+pB.sx)/2,mcy=(pA.sy+pB.sy)/2-dist*.28;
        const t0=Math.max(0,arc.progress-.25),t1=Math.min(1,arc.progress);
        if(t0>=t1) return;
        ctx.beginPath(); let first=true;
        for(let s=0;s<=20;s++){
          const tt=t0+(t1-t0)*(s/20);
          const bx=(1-tt)*(1-tt)*pA.sx+2*(1-tt)*tt*mcx+tt*tt*pB.sx;
          const by=(1-tt)*(1-tt)*pA.sy+2*(1-tt)*tt*mcy+tt*tt*pB.sy;
          if(first){ctx.moveTo(bx,by);first=false;}else ctx.lineTo(bx,by);
        }
        const al=arc.alpha*Math.min(arc.progress,1-arc.progress+.5)*.7;
        ctx.strokeStyle=`rgba(0,255,178,${Math.max(0,al)})`;ctx.lineWidth=1;ctx.stroke();
        if(arc.progress>0&&arc.progress<1){
          const tt=arc.progress;
          const hx=(1-tt)*(1-tt)*pA.sx+2*(1-tt)*tt*mcx+tt*tt*pB.sx;
          const hy=(1-tt)*(1-tt)*pA.sy+2*(1-tt)*tt*mcy+tt*tt*pB.sy;
          ctx.beginPath();ctx.arc(hx,hy,2.2,0,Math.PI*2);
          ctx.fillStyle=`rgba(255,255,255,${arc.alpha*.8})`;ctx.fill();
        }
      });
      // dots
      DOTS.forEach(pt=>{
        const p=proj(pt.phi,pt.theta,rotRef.current,t.cx,t.cy,cx,cy,R);
        if(!p.vis) return;
        const df=(p.depth+1)/2,al=pt.bright*df*.8,sz=pt.size*(0.4+df*.6);
        ctx.beginPath();ctx.arc(p.sx,p.sy,sz,0,Math.PI*2);ctx.fillStyle=`rgba(0,255,178,${al})`;ctx.fill();
      });
      // specular
      const spec=ctx.createRadialGradient(cx-R*.3,cy-R*.35,0,cx-R*.15,cy-R*.2,R*.55);
      spec.addColorStop(0,'rgba(255,255,255,.09)');spec.addColorStop(1,'transparent');
      ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fillStyle=spec;ctx.fill();
      const rim=ctx.createRadialGradient(cx,cy,R*.7,cx,cy,R);
      rim.addColorStop(0,'transparent');rim.addColorStop(1,'rgba(0,255,178,.2)');
      ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fillStyle=rim;ctx.fill();
      rotRef.current+=.0007;
      rafRef.current=requestAnimationFrame(draw);
    };
    rafRef.current=requestAnimationFrame(draw);
    return ()=>{cancelAnimationFrame(rafRef.current);window.removeEventListener('mousemove',handleMouse);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={canvasRef} style={{display:'block',width:'100%',height:'100%'}} />;
}

// ─── useIntersect ────────────────────────────────────────────────────────────
function useIntersect() {
  useEffect(()=>{
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('visible');});
    },{threshold:0.1});
    document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
    return ()=>obs.disconnect();
  });
}

// ─── AI Chat ─────────────────────────────────────────────────────────────────
const SYS = `You are DSPHERY's AI marketing expert. You represent DSPHERY, a premium digital marketing agency founded in 2018. Services: SEO, Paid Media & PPC, Brand Strategy, Social Media, Content Marketing, Analytics. Stats: 240+ clients, $4.2B revenue, 97% retention, 8+ years. Located in New York. Email: hello@dsphery.com. Keep answers concise (2-4 sentences). Be enthusiastic and expert. Never say you're Claude or mention Anthropic.`;

function AIChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{role:'bot',text:"Hey! 👋 I'm DSPHERY's AI expert. Ask me anything about growing your digital presence."}]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const msgsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(()=>{ if(msgsRef.current) msgsRef.current.scrollTop=msgsRef.current.scrollHeight; },[msgs,loading]);

  const send = useCallback(async(text)=>{
    const msg = text||input.trim();
    if(!msg||loading) return;
    setInput('');
    setMsgs(p=>[...p,{role:'user',text:msg}]);
    const nh=[...history,{role:'user',content:msg}];
    setHistory(nh);
    setLoading(true);
    try {
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:SYS,messages:nh})
      });
      const data=await res.json();
      const reply=data.content?.[0]?.text||"Reach out at hello@dsphery.com!";
      setMsgs(p=>[...p,{role:'bot',text:reply}]);
      setHistory(h=>[...h,{role:'assistant',content:reply}].slice(-20));
    } catch {
      setMsgs(p=>[...p,{role:'bot',text:"Connection issue! Email hello@dsphery.com for help."}]);
    }
    setLoading(false);
  },[input,loading,history]);

  const quickPrompts = [
    {label:'SEO Tips', prompt:'How can you improve my SEO?'},
    {label:'Brand Strategy', prompt:'What does a brand strategy include?'},
    {label:'Paid Ads', prompt:'How do paid ads work?'},
  ];

  return (
    <div className="ai-fab">
      <button className="ai-fab-btn" onClick={()=>{setOpen(o=>!o);setTimeout(()=>inputRef.current?.focus(),300);}}>💬</button>
      <div className={`ai-bubble${open?' open':''}`}>
        <div className="ai-bubble-head">
          <div className="ai-head-info">
            <div className="ai-dot-avatar">🤖</div>
            <div>
              <div className="ai-head-name">DSPHERY AI</div>
              <div className="ai-head-status">● Online — Marketing Expert</div>
            </div>
          </div>
          <button className="ai-close" onClick={()=>setOpen(false)}>✕</button>
        </div>
        <div className="ai-msgs" ref={msgsRef}>
          {msgs.map((m,i)=><div key={i} className={`ai-msg ${m.role}`}>{m.text}</div>)}
          {loading&&<div className="ai-typing"><span/><span/><span/></div>}
        </div>
        <div className="ai-footer">
          <div className="ai-quick">
            {quickPrompts.map((q,i)=>(
              <button key={i} className="ai-qbtn" onClick={()=>send(q.prompt)}>{q.label}</button>
            ))}
          </div>
          <div className="ai-input-row">
            <textarea
              ref={inputRef}
              className="ai-input"
              placeholder="Ask about marketing..."
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
              rows={1}
            />
            <button className="ai-send" onClick={()=>send()} disabled={loading||!input.trim()}>↑</button>
          </div>
          <div className="ai-powered">Powered by Claude AI</div>
        </div>
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({page, setPage}) {
  const [mob, setMob] = useState(false);
  const navLinks = ['home','services','portfolio','about','pricing'];
  const go = (p) => { setPage(p); setMob(false); window.scrollTo({top:0,behavior:'smooth'}); };
  return (
    <>
      <nav className="nav">
        <div className="nav-logo" onClick={()=>go('home')}>
          <div className="logo-gem"/>
          DSPHERY
        </div>
        <ul className="nav-links">
          {navLinks.map(l=>(
            <li key={l}>
              <a href="#" className={page===l?'active':''} onClick={e=>{e.preventDefault();go(l);}} style={{textTransform:'capitalize'}}>{l}</a>
            </li>
          ))}
        </ul>
        <button className="nav-cta" onClick={()=>go('pricing')}>Get Started</button>
        <button className={`nav-mobile-btn${mob?' open':''}`} onClick={()=>setMob(o=>!o)}>
          <span/><span/><span/>
        </button>
      </nav>
      <div className={`mobile-menu${mob?' open':''}`}>
        {navLinks.map(l=>(
          <a key={l} href="#" onClick={e=>{e.preventDefault();go(l);}} style={{textTransform:'capitalize'}}>{l}</a>
        ))}
      </div>
    </>
  );
}

// ─── Marquee ──────────────────────────────────────────────────────────────────
function Marquee() {
  const items = ['SEO Strategy','Paid Media','Social Media','Brand Identity','Content Marketing','Email Campaigns','Analytics','Growth Hacking','CRO','Influencer Marketing'];
  const doubled = [...items,...items];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {doubled.map((it,i)=>(
          <span key={i} style={{display:'inline-flex',alignItems:'center'}}>
            <span className="marquee-item">{it}</span>
            {i%3===2&&<span className="marquee-dot"/>}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({setPage}) {
  const go = (p) => { setPage(p); window.scrollTo({top:0,behavior:'smooth'}); };
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="nav-logo" style={{cursor:'pointer'}} onClick={()=>go('home')}>
            <div className="logo-gem"/>
            DSPHERY
          </div>
          <p>A digital marketing agency obsessed with performance, precision, and measurable results for ambitious brands.</p>
          <div className="social-row" style={{marginTop:24}}>
            {[['𝕏','Twitter'],['in','LinkedIn'],['ig','Instagram'],['▶','YouTube']].map(([icon,title])=>(
              <a key={title} href="#" title={title}>{icon}</a>
            ))}
          </div>
        </div>
        <div className="footer-col">
          <h5>Services</h5>
          <ul>{['SEO','Paid Media','Social Media','Content','Analytics'].map(s=>(
            <li key={s}><a href="#" onClick={e=>{e.preventDefault();go('services');}}>{s}</a></li>
          ))}</ul>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <ul>{[['About','about'],['Portfolio','portfolio'],['Pricing','pricing'],['Contact','pricing']].map(([l,p])=>(
            <li key={l}><a href="#" onClick={e=>{e.preventDefault();go(p);}}>{l}</a></li>
          ))}</ul>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <ul>
            <li><a href="mailto:hello@dsphery.com">hello@dsphery.com</a></li>
            <li><a href="tel:+15550000000">+1 (555) 000-0000</a></li>
            <li><a href="#">New York, NY</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 DSPHERY. All rights reserved.</p>
        <p>Crafted with ✦ precision</p>
      </div>
    </footer>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────
function CTASection({setPage}) {
  return (
    <section className="cta-section">
      <div className="cta-bg"/>
      <p className="cta-eyebrow">Ready to grow?</p>
      <h2 className="cta-h2">
        Let's Build<br/>
        <span>Something</span><br/>
        Great
      </h2>
      <div className="cta-btns">
        <button className="btn-primary" onClick={()=>{setPage('pricing');window.scrollTo({top:0,behavior:'smooth'});}}>Start a Project ↗</button>
        <button className="btn-outline" onClick={()=>{setPage('about');window.scrollTo({top:0,behavior:'smooth'});}}>Learn About Us</button>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── HOME PAGE ────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function HomePage({setPage}) {
  useIntersect();
  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"/>
        <div className="hero-grid-bg"/>
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="hero-badge">Est. 2018 — New York</span>
          </div>
          <h1 className="hero-h1">
            <span className="line"><span>We Build</span></span>
            <span className="line"><span className="stroke">Brands</span></span>
            <span className="line"><span className="hi">That Win</span></span>
          </h1>
          <p className="hero-desc">We craft data-driven digital strategies that transform your online presence and drive measurable, compounding growth.</p>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={()=>{setPage('services');window.scrollTo({top:0,behavior:'smooth'});}}>Explore Services ↗</button>
            <button className="btn-outline" onClick={()=>{setPage('portfolio');window.scrollTo({top:0,behavior:'smooth'});}}>View Our Work</button>
          </div>
          <div className="hero-stats">
            {[
              {n:'240',suf:'+',lbl:'Clients Served'},
              {n:'$4.2B',suf:'',lbl:'Revenue Generated'},
              {n:'97',suf:'%',lbl:'Client Retention'},
            ].map((s,i)=>(
              <div key={i} className="stat-item">
                <div className="stat-num">
                  {s.n.startsWith('$') ? <><em>{s.n}</em></> : <><em>{s.n}</em>{s.suf}</>}
                </div>
                <div className="stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual"><Globe/></div>
        <div className="scroll-hint">
          <div className="scroll-line"/>
          <span>Scroll</span>
        </div>
      </section>

      <Marquee/>

      {/* BENTO STATS */}
      <div className="bento">
        {[
          {n:'240+',lbl:'Clients Worldwide',desc:'From startups to Fortune 500 companies across 30+ industries.'},
          {n:'$4.2B',lbl:'Revenue Generated',desc:'Collective client revenue attributable to our digital strategies.'},
          {n:'97%',lbl:'Client Retention',desc:'We become long-term partners because results speak louder.'},
          {n:'8+',lbl:'Years of Excellence',desc:'A decade of staying ahead in the rapidly evolving digital landscape.'},
        ].map((s,i)=>(
          <div key={i} className={`bento-card fade-in fade-d${i+1}`}>
            <div className="bento-num"><em>{s.n}</em></div>
            <div className="bento-lbl">{s.lbl}</div>
            <div className="bento-desc">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* CLIENTS */}
      <div className="clients-section">
        <p className="clients-label">Trusted by forward-thinking brands</p>
        <div style={{overflow:'hidden'}}>
          <div className="clients-track">
            {['TECHVAULT','LUMINARY','ORBITCO','NEXGEN','PULSE','MERIDIAN','VANTA','AXIOM','NOVA','QUANTA',
              'TECHVAULT','LUMINARY','ORBITCO','NEXGEN','PULSE','MERIDIAN','VANTA','AXIOM','NOVA','QUANTA'].map((c,i)=>(
              <span key={i} className="client-name">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES — fixed two-column grid */}
      <section className="features-section">
        {/* Left column: label + title + description + CTA */}
        <div className="features-left fade-in">
          <p className="label">What sets us apart</p>
          <h2 className="section-title" style={{marginTop:16}}>
            Why Choose<br/><span className="outline">DSPHERY</span>
          </h2>
          <p style={{fontSize:15,color:'var(--fg2)',marginTop:24,lineHeight:1.75,maxWidth:380,fontWeight:300}}>
            We combine deep expertise with cutting-edge technology to deliver strategies that outperform the market.
          </p>
          <div style={{marginTop:36}}>
            <button className="btn-primary" onClick={()=>{setPage('about');window.scrollTo({top:0,behavior:'smooth'});}}>About Us ↗</button>
          </div>
          {/* Feature list sits in left column below intro */}
          <div className="features-list" style={{marginTop:48}}>
            {[
              {n:'01',title:'Data-First Approach',desc:'Every decision we make is grounded in real data, not guesswork. We track and measure everything to maximize ROI.'},
              {n:'02',title:'Custom Strategy',desc:"No cookie-cutter solutions. We craft bespoke strategies tailored to your brand's unique goals and competitive landscape."},
              {n:'03',title:'Full-Funnel Expertise',desc:'From awareness to conversion and retention, we own the entire customer journey and optimize every touchpoint.'},
              {n:'04',title:'Transparent Reporting',desc:'Deep-dive monthly reports with real metrics that actually matter to your business growth and bottom line.'},
            ].map((f,i)=>(
              <div key={i} className="feature-item">
                <div className="fi-num">{f.n}</div>
                <div>
                  <div className="fi-title">{f.title}</div>
                  <div className="fi-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: visual card — sticky */}
        <div className="features-visual fade-in fade-d2" style={{position:'sticky',top:'calc(var(--nav-h) + 24px)'}}>
          <div className="fv-card">
            <div className="fv-metric">
              <div className="fv-label">Avg. Organic Growth</div>
              <div className="fv-value">+312%</div>
            </div>
            <div className="fv-bars">
              {[
                ['SEO',     88,'var(--accent)'],
                ['Paid Media',95,'var(--accent2)'],
                ['Social',  76,'var(--accent3)'],
                ['Content', 82,'var(--accent)'],
              ].map(([label,pct,color],i)=>(
                <div key={i} className="fv-bar-row">
                  <div className="fv-bar-label">{label}</div>
                  <div className="fv-bar-bg">
                    <div className="fv-bar-fill" style={{width:`${pct}%`,background:color}}/>
                  </div>
                  <div className="fv-bar-pct">{pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL TEASE */}
      <section className="tease-section">
        <div className="tease-inner">
          <div className="fade-in">
            <p className="label">Social proof</p>
            <h2 className="section-title" style={{marginTop:16,fontSize:'clamp(44px,5vw,70px)'}}>
              What Clients<br/><span className="accent">Say</span>
            </h2>
            <p style={{fontSize:15,color:'var(--fg2)',marginTop:20,lineHeight:1.75,fontWeight:300}}>
              Don't take our word for it — here's what our clients say about working with DSPHERY.
            </p>
          </div>
          <div className="tease-cards fade-in fade-d2">
            {[
              {bg:'linear-gradient(135deg,#00ffb2,#00d080)',color:'#04050a',init:'JM',name:'James Mitchell',role:'CEO, TechVault',text:'DSPHERY transformed our SEO into our #1 revenue channel. 420% growth in 8 months.'},
              {bg:'linear-gradient(135deg,#6e44ff,#4020cc)',color:'#fff',init:'SK',name:'Sarah Kim',role:'CMO, Luminary',text:'Scaled from $50K to $400K monthly ad spend while keeping a 4.2x ROAS. Exceptional.'},
              {bg:'linear-gradient(135deg,#ff3d6a,#cc0040)',color:'#fff',init:'RP',name:'Ryan Park',role:'Founder, Orbit Commerce',text:'800K engaged followers in 12 months. Our community actively champions our brand now.'},
              {bg:'linear-gradient(135deg,#00d4ff,#0080cc)',color:'#fff',init:'LC',name:'Lisa Chen',role:'VP Marketing, Nexgen',text:"Best marketing investment we've ever made. ROI was visible within the first 60 days."},
            ].map((t,i)=>(
              <div key={i} className="tease-card">
                <div className="tease-stars">★★★★★</div>
                <p className="tease-text">{t.text}</p>
                <div className="tease-author">
                  <div className="ta-av" style={{background:t.bg,color:t.color}}>{t.init}</div>
                  <div>
                    <div className="ta-name">{t.name}</div>
                    <div className="ta-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection setPage={setPage}/>
      <Footer setPage={setPage}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── SERVICES PAGE ────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function ServicesPage({setPage}) {
  useIntersect();
  const svcs = [
    {n:'01',icon:'🔍',title:'Search Engine Optimization',desc:'Dominate search rankings with advanced technical SEO, content strategy, and authority building that drives lasting organic growth.',tags:['On-Page SEO','Technical SEO','Link Building','Local SEO']},
    {n:'02',icon:'🎯',title:'Paid Media & PPC',desc:'Precision-targeted advertising across Google, Meta, TikTok and beyond. AI-optimized campaigns that convert at scale while continuously reducing cost per acquisition.',tags:['Google Ads','Meta Ads','TikTok Ads','Programmatic']},
    {n:'03',icon:'💡',title:'Brand Strategy',desc:"Build a brand that resonates deeply and stands apart. From identity systems to brand voice and visual language — we craft brands people remember, trust, and advocate for.",tags:['Brand Identity','Positioning','Messaging','Voice & Tone']},
    {n:'04',icon:'📱',title:'Social Media Management',desc:'Platform-native content that builds engaged communities, drives meaningful conversations, and converts followers into loyal brand advocates and paying customers.',tags:['Content Calendar','Community','Influencer','Reporting']},
    {n:'05',icon:'✍️',title:'Content Marketing',desc:'Strategic content that educates, entertains, and converts. From blog posts and whitepapers to video scripts and podcasts — we tell your story compellingly across every channel.',tags:['Blog Writing','Video Scripts','Email','Whitepapers']},
    {n:'06',icon:'📊',title:'Analytics & Growth',desc:'Data is our obsession. We track every meaningful metric, uncover every hidden opportunity, and continuously optimize to compound your growth over time.',tags:['Dashboards','CRO','A/B Testing','Attribution']},
  ];
  return (
    <div className="page">
      <section className="services-hero">
        <div className="services-hero-inner">
          <div className="fade-in">
            <p className="label">What we do</p>
            <h1 className="section-title" style={{marginTop:16}}>
              Full-Stack<br/>
              <span className="outline">Digital</span><br/>
              <span className="accent">Marketing</span>
            </h1>
          </div>
          <div className="fade-in fade-d2">
            <p className="services-intro">
              End-to-end digital marketing solutions designed to work together as a unified growth engine — not isolated tactics. Every service we offer is built on data, driven by creativity, and measured relentlessly.
            </p>
            <div style={{display:'flex',gap:14,marginTop:36,flexWrap:'wrap',alignItems:'center'}}>
              <button className="btn-primary" onClick={()=>{setPage('pricing');window.scrollTo({top:0,behavior:'smooth'});}}>View Pricing ↗</button>
              <button className="btn-outline" onClick={()=>{setPage('portfolio');window.scrollTo({top:0,behavior:'smooth'});}}>See Results</button>
            </div>
          </div>
        </div>
      </section>

      <Marquee/>

      <div style={{padding:'64px 0 0'}}>
        <div className="services-grid fade-in">
          {svcs.map((s,i)=>(
            <div key={i} className="svc-card">
              <div className="svc-num">{s.n}</div>
              <div className="svc-icon">{s.icon}</div>
              <div className="svc-title">{s.title}</div>
              <div className="svc-desc">{s.desc}</div>
              <div className="svc-tags">{s.tags.map(t=><span key={t} className="svc-tag">{t}</span>)}</div>
              <span className="svc-arrow">↗</span>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <section className="process-section">
        <div className="section-header-center">
          <p className="label" style={{justifyContent:'center'}}>How we work</p>
          <h2 className="section-title" style={{marginTop:16,textAlign:'center'}}>
            Our <span className="accent">Process</span>
          </h2>
          <p style={{fontSize:15,color:'var(--fg2)',marginTop:16,maxWidth:480,marginInline:'auto',fontWeight:300,lineHeight:1.7}}>
            Every engagement follows a proven, repeatable framework designed to maximize results from day one.
          </p>
        </div>
        <div className="process-grid">
          {[
            {n:'01',title:'Discovery & Audit',desc:'We dissect your digital presence, analyze competitors, and map out the biggest growth opportunities hiding in plain sight.'},
            {n:'02',title:'Strategy Blueprint',desc:'A bespoke roadmap with clear KPIs, channel mix, budget allocation, and 90-day sprints built to compound over time.'},
            {n:'03',title:'Launch & Optimize',desc:'Rapid deployment, continuous A/B testing, and relentless iteration. We move fast and double down on what works.'},
            {n:'04',title:'Scale & Report',desc:'Monthly deep-dive reports, quarterly strategy reviews, and proactive scaling when we find winning signals in your data.'},
          ].map((s,i)=>(
            <div key={i} className="proc-step fade-in">
              <div className="proc-step-num">{s.n}</div>
              <div className="proc-step-title">{s.title}</div>
              <div className="proc-step-desc">{s.desc}</div>
              {i<3&&<div className="proc-connector">→</div>}
            </div>
          ))}
        </div>
      </section>

      <CTASection setPage={setPage}/>
      <Footer setPage={setPage}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── PORTFOLIO PAGE ───────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const PROJECTS = [
  {cat:'seo brand',tag:'Brand Strategy + SEO',title:'TechVault Rebrand',meta:'Enterprise SaaS — B2B',result:'420% organic growth · 8 months',bg:'linear-gradient(135deg,#091a0f,#030f07)',
    svg:<svg viewBox="0 0 500 280" style={{width:'100%',height:'100%',position:'absolute',inset:0,opacity:.7}}><circle cx="250" cy="140" r="120" fill="none" stroke="#00ffb2" strokeWidth="40" strokeDasharray="350 450" opacity=".15"/><text x="250" y="155" textAnchor="middle" fontFamily="Bebas Neue" fontSize="64" fill="#00ffb2" opacity=".6" letterSpacing="4">LAUNCH</text></svg>},
  {cat:'paid',tag:'Paid Media & PPC',title:'Luminary Growth',meta:'DTC Consumer Goods',result:'4.2x ROAS at $400K/mo',bg:'linear-gradient(135deg,#0d0a1f,#050215)',
    svg:<svg viewBox="0 0 500 280" style={{width:'100%',height:'100%',position:'absolute',inset:0,opacity:.7}}>{[100,160,130,90,70,55,40].map((y,i)=><rect key={i} x={60+i*52} y={y} width="36" height={220-y} fill="#6e44ff" opacity={.15+i*.04} rx="4"/>)}<text x="390" y="80" textAnchor="middle" fontFamily="Bebas Neue" fontSize="42" fill="#6e44ff" opacity=".5">+320%</text></svg>},
  {cat:'social',tag:'Social Media',title:'Orbit Commerce',meta:'E-Commerce Retail',result:'800K community in 12 months',bg:'linear-gradient(135deg,#1a0a14,#0f0009)',
    svg:<svg viewBox="0 0 500 280" style={{width:'100%',height:'100%',position:'absolute',inset:0,opacity:.7}}><circle cx="250" cy="140" r="100" fill="none" stroke="#ff3d6a" strokeWidth="30" strokeDasharray="280 350" opacity=".2"/><text x="250" y="152" textAnchor="middle" fontFamily="Bebas Neue" fontSize="44" fill="#00ffb2" opacity=".7">800K</text><text x="250" y="178" textAnchor="middle" fontFamily="Bebas Neue" fontSize="14" fill="#00ffb2" opacity=".4" letterSpacing="5">FOLLOWERS</text></svg>},
  {cat:'seo content',tag:'SEO + Content',title:'Nexgen Digital',meta:'FinTech Platform',result:'5x organic traffic · 6 months',bg:'linear-gradient(135deg,#081520,#030d18)',
    svg:<svg viewBox="0 0 500 280" style={{width:'100%',height:'100%',position:'absolute',inset:0,opacity:.7}}>{[[60,220],[110,180],[160,160],[210,130],[260,100],[310,80],[360,50]].map(([x,y],i,arr)=>i>0&&<line key={i} x1={arr[i-1][0]} y1={arr[i-1][1]} x2={x} y2={y} stroke="#00ffb2" strokeWidth="2" opacity=".4"/>)}<text x="380" y="40" textAnchor="middle" fontFamily="Bebas Neue" fontSize="32" fill="#00ffb2" opacity=".6">5x</text></svg>},
  {cat:'brand',tag:'Brand Strategy',title:'Pulse Health Co.',meta:'Health & Wellness',result:'Full rebrand + 180% revenue lift',bg:'linear-gradient(135deg,#1a0f04,#120a02)',
    svg:<svg viewBox="0 0 500 280" style={{width:'100%',height:'100%',position:'absolute',inset:0,opacity:.7}}><path d="M60,140 L110,90 L160,140 L210,60 L260,140 L310,100 L360,140 L410,120" fill="none" stroke="#ff3d6a" strokeWidth="2.5" opacity=".4"/><text x="250" y="220" textAnchor="middle" fontFamily="Bebas Neue" fontSize="28" fill="#ff3d6a" opacity=".5" letterSpacing="4">PULSE</text></svg>},
  {cat:'paid social',tag:'Paid Media + Social',title:'Vanta Apparel',meta:'Fashion & Lifestyle',result:'12x ROAS launch campaign',bg:'linear-gradient(135deg,#0f1a0a,#080e05)',
    svg:<svg viewBox="0 0 500 280" style={{width:'100%',height:'100%',position:'absolute',inset:0,opacity:.7}}><rect x="80" y="60" width="340" height="160" fill="none" stroke="#00ffb2" strokeWidth="1" opacity=".15" rx="8"/><text x="250" y="152" textAnchor="middle" fontFamily="Bebas Neue" fontSize="52" fill="#00ffb2" opacity=".55" letterSpacing="6">12x ROAS</text></svg>},
];

function PortfolioPage({setPage}) {
  const [filter, setFilter] = useState('all');
  useIntersect();
  return (
    <div className="page">
      <section className="portfolio-hero">
        <div className="fade-in">
          <p className="label">Selected work</p>
          <h1 className="section-title" style={{marginTop:16}}>
            Cases That<br/>
            <span className="outline">Speak</span><br/>
            <span className="accent">Volumes</span>
          </h1>
          <p style={{fontSize:16,color:'var(--fg2)',marginTop:20,maxWidth:480,lineHeight:1.7,fontWeight:300}}>
            A curated selection of campaigns, strategies, and transformations that drove real, measurable results for ambitious brands.
          </p>
        </div>
        <div className="portfolio-filters fade-in fade-d2">
          {[['all','All Work'],['seo','SEO'],['paid','Paid Media'],['brand','Brand'],['social','Social'],['content','Content']].map(([v,l])=>(
            <button key={v} className={`pf-btn${filter===v?' active':''}`} onClick={()=>setFilter(v)}>{l}</button>
          ))}
        </div>
      </section>
      <div className="portfolio-grid">
        {PROJECTS.map((p,i)=>{
          const visible = filter==='all'||p.cat.split(' ').includes(filter);
          return (
            <div key={i} className={`portfolio-item fade-in${visible?'':' hidden'}`}>
              <div className="pi-img">
                <div className="pi-img-inner" style={{background:p.bg,position:'relative'}}>
                  {p.svg}
                </div>
                <div className="pi-overlay">
                  <span className="pi-overlay-btn">View Case Study ↗</span>
                </div>
              </div>
              <div className="pi-content">
                <div className="pi-tag">{p.tag}</div>
                <div className="pi-title">{p.title}</div>
                <div className="pi-meta">{p.meta}</div>
                <div className="pi-result">✦ {p.result}</div>
              </div>
            </div>
          );
        })}
      </div>
      <CTASection setPage={setPage}/>
      <Footer setPage={setPage}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function AboutPage({setPage}) {
  useIntersect();
  return (
    <div className="page">
      <section className="about-hero">
        <div className="fade-in">
          <p className="label">Our story</p>
          <h1 className="section-title" style={{marginTop:16}}>
            Built to<br/>
            <span className="outline">Drive</span><br/>
            <span className="accent">Results</span>
          </h1>
          <p className="about-content-text">
            DSPHERY was founded in 2018 with a single belief: that great marketing should be measurable, repeatable, and unfair to competitors. We started as a scrappy team of 4 performance marketers who were tired of agencies that prioritized aesthetics over outcomes. Today, we're a full-service powerhouse of 60+ specialists across strategy, creative, media, and analytics.
          </p>
          <p style={{fontSize:15,color:'var(--fg2)',lineHeight:1.75,fontWeight:300,marginBottom:36}}>
            Our clients don't hire us for pretty slide decks — they hire us because we move the needle in ways their last three agencies couldn't.
          </p>
          <div style={{display:'flex',gap:14,flexWrap:'wrap',alignItems:'center'}}>
            <button className="btn-primary" onClick={()=>{setPage('pricing');window.scrollTo({top:0,behavior:'smooth'});}}>Work With Us ↗</button>
            <button className="btn-outline" onClick={()=>{setPage('portfolio');window.scrollTo({top:0,behavior:'smooth'});}}>See Our Work</button>
          </div>
        </div>
        <div className="about-visual fade-in fade-d2">
          <div className="about-img-wrap" style={{fontSize:80}}>
            <span style={{position:'relative',zIndex:1}}>🌐</span>
            <div className="about-float about-float-1">
              <div className="af-num">240+</div>
              <div className="af-lbl">Clients Served</div>
            </div>
            <div className="about-float about-float-2">
              <div className="af-num">97%</div>
              <div className="af-lbl">Retention Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="section-header-center">
          <p className="label" style={{justifyContent:'center'}}>What we believe</p>
          <h2 className="section-title" style={{marginTop:16,textAlign:'center'}}>
            Our <span className="accent">Values</span>
          </h2>
        </div>
        <div className="values-grid">
          {[
            {icon:'🎯',title:'Results First',desc:"Every decision, every strategy, every creative choice is anchored to measurable outcomes. If it doesn't move the needle, we don't do it."},
            {icon:'🔬',title:'Data Obsessed',desc:'We instrument everything, test relentlessly, and follow the data wherever it leads — even when it challenges our assumptions.'},
            {icon:'🤝',title:'True Partnership',desc:"We become an extension of your team, not a vendor. Your wins are our wins, and we treat your budget like our own."},
            {icon:'🚀',title:'Bold Thinking',desc:"We don't follow the playbook — we write new ones. Our best ideas come from questioning what everyone else takes for granted."},
            {icon:'⚡',title:'Radical Speed',desc:'In digital marketing, speed is a competitive advantage. We move fast, iterate quickly, and beat competitors to market.'},
            {icon:'💎',title:'Relentless Quality',desc:"Good enough is never enough. We obsess over the details that others miss because that's where the biggest gains hide."},
          ].map((v,i)=>(
            <div key={i} className={`value-card fade-in fade-d${(i%4)+1}`}>
              <div className="value-icon">{v.icon}</div>
              <div className="value-title">{v.title}</div>
              <div className="value-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="team-section">
        <div className="section-header-center">
          <p className="label" style={{justifyContent:'center'}}>The people</p>
          <h2 className="section-title" style={{marginTop:16,textAlign:'center'}}>
            Meet the <span className="accent">Team</span>
          </h2>
          <p style={{fontSize:15,color:'var(--fg2)',marginTop:16,maxWidth:480,marginInline:'auto',fontWeight:300,lineHeight:1.7}}>
            World-class specialists who are as passionate about your growth as you are.
          </p>
        </div>
        <div className="team-grid">
          {[
            {emoji:'👩‍💼',bg:'linear-gradient(135deg,#091a0f,#030f07)',name:'Alex Rivera',role:'CEO & Founder',bio:'Former Google performance lead. Built DSPHERY from a 4-person shop to 60+ specialists.'},
            {emoji:'👨‍💻',bg:'linear-gradient(135deg,#0d0a1f,#050215)',name:'Marcus Chen',role:'Head of SEO',bio:'10 years of technical SEO. Responsible for over $1.2B in attributed organic revenue.'},
            {emoji:'👩‍🎨',bg:'linear-gradient(135deg,#1a0a14,#0f0009)',name:'Priya Sharma',role:'Creative Director',bio:'Ex-Wieden+Kennedy. Believes great creative and great data are two sides of the same coin.'},
            {emoji:'👨‍📊',bg:'linear-gradient(135deg,#081520,#030d18)',name:'Jake Thompson',role:'Head of Paid Media',bio:'Managed over $200M in ad spend. Specializes in multi-channel attribution and ROAS optimization.'},
          ].map((m,i)=>(
            <div key={i} className={`team-card fade-in fade-d${i+1}`}>
              <div className="team-photo" style={{background:m.bg}}>{m.emoji}</div>
              <div className="team-info">
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
                <div className="team-bio">{m.bio}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection setPage={setPage}/>
      <Footer setPage={setPage}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── PRICING PAGE ─────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function PricingPage({setPage}) {
  const [annual, setAnnual] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  useIntersect();

  const plans = [
    {tier:'Starter',name:'Growth',popular:false,desc:'Perfect for small businesses ready to scale their digital presence.',features:[
      {ok:true,txt:'SEO Audit + On-Page Optimization'},
      {ok:true,txt:'Monthly Content Strategy (4 pieces)'},
      {ok:true,txt:'Google Ads Management (up to $5K budget)'},
      {ok:true,txt:'Social Media Management (2 platforms)'},
      {ok:true,txt:'Monthly Performance Report'},
      {ok:true,txt:'Dedicated Account Manager'},
      {ok:false,txt:'Brand Strategy Workshop'},
      {ok:false,txt:'Advanced Analytics Dashboard'},
    ]},
    {tier:'Most Popular',name:'Scale',popular:true,desc:'Comprehensive marketing for growing companies ready to dominate.',features:[
      {ok:true,txt:'Everything in Growth, plus:'},
      {ok:true,txt:'Full Technical SEO Implementation'},
      {ok:true,txt:'Multi-Channel Paid Media (up to $30K)'},
      {ok:true,txt:'Social Media Management (4 platforms)'},
      {ok:true,txt:'Monthly Content Strategy (12 pieces)'},
      {ok:true,txt:'Brand Strategy Workshop (quarterly)'},
      {ok:true,txt:'Advanced Analytics Dashboard'},
      {ok:true,txt:'CRO Audit + A/B Testing'},
    ]},
    {tier:'Enterprise',name:'Dominate',popular:false,desc:'Full-service, white-glove marketing for market leaders.',features:[
      {ok:true,txt:'Everything in Scale, plus:'},
      {ok:true,txt:'Unlimited Paid Media Budget Management'},
      {ok:true,txt:'Custom Brand Strategy + Identity System'},
      {ok:true,txt:'Full Content Production Studio'},
      {ok:true,txt:'Weekly Strategy Calls'},
      {ok:true,txt:'Dedicated 4-person specialist team'},
      {ok:true,txt:'Priority Support (4-hour response)'},
      {ok:true,txt:'Quarterly Business Reviews + C-Suite Deck'},
    ]},
  ];

  // Prices calculated correctly
  const baseMonthly = [2990, 6990, 13990];
  const baseAnnual  = [2490, 5990, 11990];

  const faqs = [
    {q:'Do you offer custom packages?',a:'Absolutely. Every brand is different, and we frequently build custom retainers that combine specific services. Reach out for a custom quote.'},
    {q:"What's the minimum contract length?",a:'Our standard engagements are 3-month minimums. Annual contracts include a 15% discount and priority onboarding.'},
    {q:'How quickly can we expect to see results?',a:'Paid media campaigns typically show results within 30 days. SEO compounds over 3-6 months. We set honest expectations upfront.'},
    {q:'Do you work with international brands?',a:'Yes — we work with brands across North America, Europe, APAC, and the Middle East. We have multilingual capabilities.'},
    {q:'What industries do you specialize in?',a:'We have deep expertise in B2B SaaS, E-commerce, Health & Wellness, FinTech, and Consumer Goods, among others.'},
    {q:'Can I upgrade or downgrade my plan?',a:'Yes. You can upgrade anytime with a 30-day notice. Downgrades take effect at the next billing cycle.'},
  ];

  return (
    <div className="page">
      <section className="pricing-hero">
        <p className="label" style={{justifyContent:'center'}}>Transparent pricing</p>
        <h1 className="section-title" style={{marginTop:16,fontSize:'clamp(52px,8vw,100px)'}}>
          Simple,<br/>
          <span className="outline">Honest</span><br/>
          <span className="accent">Pricing</span>
        </h1>
        <p className="pricing-subtitle">No hidden fees, no surprise invoices. Just clear investment levels tied directly to your growth goals.</p>
        <div className="pricing-toggle">
          <span className="toggle-label">Monthly</span>
          <div className={`toggle-track${annual?' active':''}`} onClick={()=>setAnnual(a=>!a)}>
            <div className="toggle-thumb"/>
          </div>
          <span className="toggle-label">Annual</span>
          {annual&&<span className="toggle-save">Save 15%</span>}
        </div>
      </section>

      <div className="pricing-cards">
        {plans.map((p,i)=>{
          const price = annual ? baseAnnual[i] : baseMonthly[i];
          return (
            <div key={i} className={`pricing-card fade-in fade-d${i+1}${p.popular?' featured':''}`}>
              {p.popular&&<div className="pricing-badge">Most Popular</div>}
              <div className="pricing-tier">{p.tier}</div>
              <div className="pricing-name">{p.name}</div>
              <p style={{fontSize:13,color:'var(--fg2)',lineHeight:1.6,fontWeight:300}}>{p.desc}</p>
              <div className="pricing-price">
                <em>$</em>
                <span>{price.toLocaleString()}</span>
              </div>
              <div className="pricing-period">{annual?'per month, billed annually':'per month'}</div>
              <div className="pricing-divider"/>
              <div className="pricing-features">
                {p.features.map((f,j)=>(
                  <div key={j} className="pf-feature">
                    <span className={f.ok?'pf-check':'pf-cross'}>{f.ok?'✓':'✗'}</span>
                    <span style={{color:f.ok?'var(--fg2)':'var(--fg3)'}}>{f.txt}</span>
                  </div>
                ))}
              </div>
              <button
                className={p.popular?'btn-primary':'btn-outline'}
                style={{width:'100%',justifyContent:'center',marginTop:'auto'}}
              >
                Get Started ↗
              </button>
            </div>
          );
        })}
      </div>

      {/* Enterprise callout */}
      <div style={{padding:'0 var(--px) 80px'}}>
        <div style={{
          background:'var(--card)',border:'1px solid rgba(0,255,178,.15)',borderRadius:20,
          padding:'48px 40px',display:'flex',gap:40,alignItems:'center',
          justifyContent:'space-between',flexWrap:'wrap',position:'relative',overflow:'hidden'
        }}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at right,rgba(0,255,178,.04) 0%,transparent 60%)',pointerEvents:'none'}}/>
          <div style={{position:'relative'}}>
            <p className="label" style={{marginBottom:12}}>Need something custom?</p>
            <h3 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:36,letterSpacing:2,marginBottom:8}}>Let's Build Your Perfect Package</h3>
            <p style={{fontSize:15,color:'var(--fg2)',fontWeight:300,maxWidth:480,lineHeight:1.65}}>
              Tell us your goals and budget and we'll design a bespoke engagement that fits. No pressure, just clarity.
            </p>
          </div>
          <div style={{display:'flex',gap:12,flexShrink:0,flexWrap:'wrap',position:'relative'}}>
            <a href="mailto:hello@dsphery.com" className="btn-primary">Contact Sales ↗</a>
            <a href="tel:+15550000000" className="btn-outline">Book a Call</a>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="pricing-faq">
        <div className="section-header-center">
          <p className="label" style={{justifyContent:'center'}}>Common questions</p>
          <h2 className="section-title" style={{marginTop:16,textAlign:'center',fontSize:'clamp(44px,6vw,80px)'}}>FAQ</h2>
        </div>
        <div className="faq-grid">
          {faqs.map((f,i)=>(
            <div key={i} className={`faq-item fade-in${faqOpen===i?' open':''}`} onClick={()=>setFaqOpen(faqOpen===i?null:i)}>
              <div className="faq-q">
                <span>{f.q}</span>
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <CTASection setPage={setPage}/>
      <Footer setPage={setPage}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState('home');
  const [scrollPct, setScrollPct] = useState(0);

  // Inject CSS
  useEffect(()=>{
    if(!document.getElementById('dsglobal')){
      const s=document.createElement('style');
      s.id='dsglobal';
      s.textContent=GLOBAL_CSS;
      document.head.appendChild(s);
    }
    return ()=>{
      // clean up on unmount if needed
    };
  },[]);

  // Scroll progress
  useEffect(()=>{
    const fn=()=>{
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total>0?(scrolled/total)*100:0);
    };
    window.addEventListener('scroll',fn,{passive:true});
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  // Custom cursor
  useEffect(()=>{
    const cur=document.getElementById('dsCursor');
    const ring=document.getElementById('dsCursorRing');
    if(!cur||!ring) return;
    let rx=-200,ry=-200,mx=-200,my=-200;
    const onMove=e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';};
    document.addEventListener('mousemove',onMove);
    let raf;
    const anim=()=>{
      rx+=(mx-rx)*.15;ry+=(my-ry)*.15;
      ring.style.left=rx+'px';ring.style.top=ry+'px';
      raf=requestAnimationFrame(anim);
    };
    raf=requestAnimationFrame(anim);
    const addHov=()=>document.body.classList.add('hov');
    const remHov=()=>document.body.classList.remove('hov');
    document.querySelectorAll('a,button,.portfolio-item,.svc-card,.team-card,.bento-card,.value-card,.tease-card,.faq-item').forEach(el=>{
      el.addEventListener('mouseenter',addHov);
      el.addEventListener('mouseleave',remHov);
    });
    return()=>{document.removeEventListener('mousemove',onMove);cancelAnimationFrame(raf);};
  });

  const pages = {
    home:     <HomePage      setPage={setPage}/>,
    services: <ServicesPage  setPage={setPage}/>,
    portfolio:<PortfolioPage setPage={setPage}/>,
    about:    <AboutPage     setPage={setPage}/>,
    pricing:  <PricingPage   setPage={setPage}/>,
  };

  return (
    <>
      <div id="dsCursor"/>
      <div id="dsCursorRing"/>
      <div id="scrollBar" style={{width:scrollPct+'%'}}/>
      <Nav page={page} setPage={setPage}/>
      {pages[page]}
      <AIChat/>
    </>
  );
}