import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'DM Sans', sans-serif;
  background: #060810;
  color: #fff;
  overflow-x: hidden;
  cursor: none;
}
a { text-decoration: none; color: inherit; }
ul { list-style: none; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #060810; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }

#ds-cursor {
  position: fixed; top: 0; left: 0;
  width: 12px; height: 12px;
  background: #a78bfa; border-radius: 50%;
  pointer-events: none; z-index: 99999;
  transform: translate(-50%,-50%);
  transition: transform 0.08s, width 0.25s, height 0.25s, background 0.25s;
  mix-blend-mode: screen;
}
#ds-cursor-ring {
  position: fixed; top: 0; left: 0;
  width: 40px; height: 40px;
  border: 1px solid rgba(167,139,250,0.4); border-radius: 50%;
  pointer-events: none; z-index: 99998;
  transform: translate(-50%,-50%);
  transition: left 0.12s ease, top 0.12s ease, width 0.3s, height 0.3s, opacity 0.3s;
}
body.hovered #ds-cursor { width: 8px; height: 8px; background: #c4b5fd; }
body.hovered #ds-cursor-ring { width: 56px; height: 56px; border-color: rgba(196,181,253,0.5); }

#scroll-prog { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 1001; background: transparent; }
#scroll-prog-bar { height: 100%; background: linear-gradient(90deg, #141a46, #7c3aed, #a78bfa); width: 0%; transition: width 0.1s; }

#ds-loader {
  position: fixed; inset: 0; background: #060810; z-index: 99997;
  display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 20px;
  transition: opacity 0.7s, visibility 0.7s;
}
#ds-loader.hidden { opacity: 0; visibility: hidden; }
.ld-word {
  font-family: 'Syne', sans-serif;
  font-size: clamp(44px, 8vw, 80px);
  font-weight: 800; letter-spacing: 14px; color: #fff; overflow: hidden;
}
.ld-word span { display: inline-block; animation: ldIn 0.9s cubic-bezier(0.23,1,0.32,1) both; }
.ld-word span:nth-child(1){animation-delay:0s}
.ld-word span:nth-child(2){animation-delay:0.06s}
.ld-word span:nth-child(3){animation-delay:0.12s}
.ld-word span:nth-child(4){animation-delay:0.18s}
.ld-word span:nth-child(5){animation-delay:0.24s}
.ld-word span:nth-child(6){animation-delay:0.3s}
.ld-word span:nth-child(7){animation-delay:0.36s}
@keyframes ldIn { from{transform:translateY(110%);opacity:0} to{transform:translateY(0);opacity:1} }
.ld-orb {
  width: 52px; height: 52px; border-radius: 50%;
  border: 1.5px solid #7c3aed; position: relative; overflow: hidden;
}
.ld-orb::before {
  content: ''; position: absolute; inset: -20px; border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0%, #7c3aed 30%, transparent 60%);
  animation: orbSpin 1.2s linear infinite;
}
.ld-orb::after { content: ''; position: absolute; inset: 3px; border-radius: 50%; background: #060810; }
@keyframes orbSpin { to { transform: rotate(360deg); } }
.ld-pct { font-size: 11px; letter-spacing: 4px; color: rgba(255,255,255,0.3); font-weight: 300; }

.ds-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 52px; height: 70px;
  background: rgba(6,8,16,0.85); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.4s;
}
.ds-logo {
  font-family: 'Syne', sans-serif; font-size: 21px; font-weight: 800;
  letter-spacing: 6px; display: flex; align-items: center; gap: 10px; cursor: none;
}
.logo-orb {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #141a46);
  box-shadow: 0 0 18px rgba(124,58,237,0.5);
  animation: orbPulse 3s ease-in-out infinite; flex-shrink: 0;
}
@keyframes orbPulse {
  0%,100%{box-shadow:0 0 18px rgba(124,58,237,0.4)}
  50%{box-shadow:0 0 30px rgba(124,58,237,0.7)}
}
.ds-nav-links { display: flex; align-items: center; gap: 32px; }
.ds-nav-links button {
  font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;
  color: rgba(255,255,255,0.5); background: none; border: none;
  cursor: none; font-family: 'DM Sans', sans-serif; font-weight: 500;
  transition: color 0.2s; padding: 4px 0;
}
.ds-nav-links button:hover, .ds-nav-links button.active { color: #fff; }
.nav-cta-btn {
  border: 1px solid #7c3aed !important; color: #a78bfa !important;
  padding: 8px 20px !important; border-radius: 100px !important;
  transition: background 0.2s, color 0.2s !important;
}
.nav-cta-btn:hover { background: #7c3aed !important; color: #fff !important; }
.hamburger { display: none; flex-direction: column; gap: 5px; cursor: none; padding: 4px; background: none; border: none; }
.hamburger span { display: block; width: 22px; height: 2px; background: #fff; border-radius: 2px; transition: 0.3s; }
.hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger.open span:nth-child(2){opacity:0}
.hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.mobile-menu {
  display: none; position: fixed; inset: 0; top: 70px;
  background: #060810; z-index: 999; overflow-y: auto;
  flex-direction: column; padding: 48px; gap: 28px;
}
.mobile-menu.open { display: flex; }
.mobile-menu button {
  font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 700;
  letter-spacing: 4px; color: #fff; background: none; border: none; cursor: none; text-align: left;
}

.page-enter { animation: pageIn 0.5s cubic-bezier(0.23,1,0.32,1) both; }
@keyframes pageIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

.reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.8s cubic-bezier(0.23,1,0.32,1), transform 0.8s cubic-bezier(0.23,1,0.32,1); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.rd1{transition-delay:0.1s}.rd2{transition-delay:0.2s}.rd3{transition-delay:0.3s}.rd4{transition-delay:0.4s}

.btn-primary {
  display: inline-flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, #7c3aed, #141a46);
  color: #fff; padding: 14px 30px; border-radius: 100px;
  font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;
  cursor: none; transition: transform 0.2s, box-shadow 0.2s;
  border: none; box-shadow: 0 4px 24px rgba(124,58,237,0.35);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(124,58,237,0.5); }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 10px;
  border: 1px solid rgba(255,255,255,0.12); color: #fff;
  padding: 14px 30px; border-radius: 100px;
  font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 400;
  cursor: none; transition: border-color 0.2s, background 0.2s; background: transparent;
}
.btn-ghost:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }

.sec-label {
  font-size: 10px; letter-spacing: 5px; text-transform: uppercase;
  color: #a78bfa; margin-bottom: 14px; display: flex; align-items: center; gap: 10px;
}
.sec-label::before { content:''; display:inline-block; width:20px; height:1px; background:#7c3aed; }
.sec-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(40px, 6vw, 76px);
  font-weight: 800; letter-spacing: -1px; line-height: 0.95; color: #fff;
}

.mq-strip {
  padding: 13px 0;
  border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(20,26,70,0.3); overflow: hidden; white-space: nowrap;
}
.mq-track { display: inline-flex; align-items: center; animation: mqAnim 32s linear infinite; }
.mq-strip:hover .mq-track { animation-play-state: paused; }
.mq-item { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.35); padding: 0 20px; }
.mq-dot { width: 3px; height: 3px; border-radius: 50%; background: #7c3aed; flex-shrink: 0; }
@keyframes mqAnim { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

.ds-footer { padding: 80px 52px 36px; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(20,26,70,0.15); }
.ft-top { display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; margin-bottom: 56px; }
.ft-tagline { font-size: 14px; line-height: 1.75; color: rgba(255,255,255,0.4); margin-top: 14px; max-width: 260px; font-weight: 300; }
.ft-links-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 40px; }
.ft-col h4 { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #a78bfa; margin-bottom: 18px; font-family: 'Syne', sans-serif; }
.ft-col ul { display: flex; flex-direction: column; gap: 11px; }
.ft-col ul li { font-size: 13px; color: rgba(255,255,255,0.4); cursor: none; transition: color 0.2s; font-weight: 300; }
.ft-col ul li:hover { color: #fff; }
.ft-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; padding-top: 36px; border-top: 1px solid rgba(255,255,255,0.06); }
.ft-copy { font-size: 12px; color: rgba(255,255,255,0.2); }
.social-row { display: flex; gap: 12px; }
.soc-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 13px; color: rgba(255,255,255,0.4); cursor: none; transition: border-color 0.2s, color 0.2s; background: none; }
.soc-btn:hover { border-color: #7c3aed; color: #a78bfa; }

.hero-section {
  min-height: 100vh; padding: 120px 52px 80px;
  display: flex; flex-direction: column; justify-content: space-between;
  position: relative; overflow: hidden;
}
.hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.hero-noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  opacity: 0.5;
}
.hero-glow {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 55% 65% at 68% 48%, rgba(124,58,237,0.09) 0%, transparent 60%),
    radial-gradient(ellipse 45% 45% at 22% 72%, rgba(20,26,70,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 35% 35% at 82% 18%, rgba(167,139,250,0.05) 0%, transparent 50%);
}
.hero-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, transparent, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.08) 70%, transparent);
}
.globe-wrap {
  position: absolute; top: 50%; right: 0;
  transform: translate(15%, -50%);
  width: min(680px, 80vw); height: min(680px, 80vw);
  z-index: 1; pointer-events: none;
}
.globe-wrap canvas { display: block; width: 100% !important; height: 100% !important; }
.fpills { position: absolute; inset: 0; pointer-events: none; }
.fpill {
  position: absolute; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
  color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.08);
  padding: 6px 15px; border-radius: 100px;
  background: rgba(20,26,70,0.5); backdrop-filter: blur(12px);
  animation: fpFloat 7s ease-in-out infinite; white-space: nowrap;
}
.fpill:nth-child(1){top:22%;right:8%;animation-delay:0s}
.fpill:nth-child(2){top:42%;right:4%;animation-delay:2s}
.fpill:nth-child(3){top:62%;right:10%;animation-delay:4s}
.fpill:nth-child(4){top:32%;right:22%;animation-delay:1s}
@keyframes fpFloat { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-14px) rotate(1deg)} }
.hero-content { position: relative; z-index: 2; }
.hero-eyebrow {
  font-size: 10px; letter-spacing: 5px; text-transform: uppercase; color: #a78bfa;
  font-weight: 500; margin-bottom: 28px; display: flex; align-items: center; gap: 10px;
}
.eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #7c3aed; animation: orbPulse 2s ease-in-out infinite; }
.hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(64px, 10vw, 136px);
  line-height: 0.92; font-weight: 800; letter-spacing: -2px;
}
.tl { display: block; overflow: hidden; }
.tl span { display: inline-block; animation: tlIn 1.1s cubic-bezier(0.23,1,0.32,1) both; }
.tl:nth-child(1) span{animation-delay:0.3s}
.tl:nth-child(2) span{animation-delay:0.45s}
.tl:nth-child(3) span{animation-delay:0.6s}
@keyframes tlIn { from{transform:translateY(110%)} to{transform:translateY(0)} }
.t-outline { -webkit-text-stroke: 2px #fff; color: transparent; }
.t-accent { background: linear-gradient(90deg, #7c3aed, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-bottom { display: flex; align-items: flex-end; justify-content: space-between; position: relative; z-index: 2; gap: 40px; flex-wrap: wrap; padding-top: 56px; }
.hero-desc { max-width: 400px; font-size: 15px; line-height: 1.78; color: rgba(255,255,255,0.5); font-weight: 300; }
.hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-top: 26px; }
.hero-stats { display: flex; gap: 44px; }
.stat-n { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 700; color: #fff; line-height: 1; }
.stat-n span { color: #a78bfa; }
.stat-l { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 5px; }
.scroll-ind { position: absolute; bottom: 28px; left: 52px; display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.25); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; z-index: 2; }
.scroll-ln { width: 32px; height: 1px; background: rgba(255,255,255,0.15); overflow: hidden; position: relative; }
.scroll-ln::after { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:#7c3aed; animation: sln 2s ease-in-out infinite; }
@keyframes sln { to { left: 100%; } }

.counter-strip { padding: 56px 52px; background: rgba(20,26,70,0.2); border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); display: grid; grid-template-columns: repeat(4,1fr); gap: 40px; text-align: center; }
.counter-n { font-family: 'Syne', sans-serif; font-size: clamp(42px, 5vw, 64px); font-weight: 700; color: #fff; letter-spacing: 2px; }
.counter-n span { color: #a78bfa; }
.counter-l { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 7px; }

.sv-grid { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
.sv-card {
  padding: 38px 32px; border-right: 1px solid rgba(255,255,255,0.07); border-bottom: 1px solid rgba(255,255,255,0.07);
  cursor: none; position: relative; overflow: hidden; transition: background 0.4s cubic-bezier(0.23,1,0.32,1);
}
.sv-card:nth-child(3n){ border-right: none; }
.sv-card:nth-child(4),.sv-card:nth-child(5),.sv-card:nth-child(6){ border-bottom: none; }
.sv-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg, rgba(124,58,237,0.06) 0%, transparent 60%); opacity:0; transition:opacity 0.3s; }
.sv-card:hover::before { opacity:1; }
.sv-card:hover { background: rgba(20,26,70,0.4); }
.sv-card:hover .sv-arrow { transform: translate(4px,-4px); color: #a78bfa; }
.sv-num { font-family: 'Syne', sans-serif; font-size: 11px; letter-spacing: 3px; color: rgba(255,255,255,0.2); margin-bottom: 18px; font-weight: 600; }
.sv-icon { font-size: 28px; margin-bottom: 14px; }
.sv-title { font-size: 18px; font-weight: 600; margin-bottom: 10px; color: #fff; font-family: 'Syne', sans-serif; }
.sv-desc { font-size: 13px; line-height: 1.72; color: rgba(255,255,255,0.45); font-weight: 300; }
.sv-arrow { position: absolute; top: 28px; right: 28px; font-size: 18px; color: rgba(255,255,255,0.2); transition: transform 0.3s, color 0.3s; }
.sv-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 14px; }
.sv-tag { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 9px; border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; color: rgba(255,255,255,0.3); }

.pf-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.pf-item { position: relative; overflow: hidden; border-radius: 12px; cursor: none; background: rgba(13,17,32,0.9); border: 1px solid rgba(255,255,255,0.07); }
.mock-img { width: 100%; transition: transform 0.6s cubic-bezier(0.23,1,0.32,1); }
.pf-item:hover .mock-img { transform: scale(1.04); }
.pf-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 22px 26px; background: linear-gradient(to top, rgba(6,8,16,0.95) 0%, transparent 100%); }
.pf-tag { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #a78bfa; margin-bottom: 5px; }
.pf-name { font-size: 19px; font-weight: 700; color: #fff; font-family: 'Syne', sans-serif; }
.pf-meta { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 3px; }
.ftabs { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 28px; }
.ftab { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 7px 18px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.45); cursor: none; background: transparent; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
.ftab.active,.ftab:hover { background: #7c3aed; color: #fff; border-color: #7c3aed; }

.proc-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
.proc-body { font-size: 15px; line-height: 1.78; color: rgba(255,255,255,0.45); margin: 22px 0 32px; font-weight: 300; }
.step-item { display: flex; gap: 22px; padding: 28px 0; border-bottom: 1px solid rgba(255,255,255,0.07); cursor: none; transition: padding-left 0.3s; }
.step-item:first-child { border-top: 1px solid rgba(255,255,255,0.07); }
.step-item:hover { padding-left: 12px; }
.step-item:hover .step-num { color: #a78bfa; }
.step-num { font-family: 'Syne', sans-serif; font-size: 11px; letter-spacing: 3px; color: rgba(255,255,255,0.2); padding-top: 4px; flex-shrink: 0; font-weight: 700; }
.step-title { font-size: 17px; font-weight: 700; margin-bottom: 7px; color: #fff; font-family: 'Syne', sans-serif; }
.step-desc { font-size: 13px; line-height: 1.72; color: rgba(255,255,255,0.45); font-weight: 300; }

.testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 44px; }
.testi-card { background: rgba(20,26,70,0.25); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 36px 28px; position: relative; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; }
.testi-card:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
.testi-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, #141a46, #7c3aed, #a78bfa); opacity:0; transition:opacity 0.3s; }
.testi-card:hover::before { opacity:1; }
.testi-q { font-family: 'Syne', sans-serif; font-size: 60px; font-weight: 800; color: rgba(255,255,255,0.08); line-height: 0.7; margin-bottom: 16px; }
.testi-text { font-size: 14px; line-height: 1.72; color: rgba(255,255,255,0.5); font-weight: 300; margin-bottom: 28px; }
.testi-author { display: flex; align-items: center; gap: 12px; }
.t-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.av-a{background:linear-gradient(135deg,#141a46,#7c3aed);color:#fff}
.av-b{background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#fff}
.av-c{background:linear-gradient(135deg,#a78bfa,#c4b5fd);color:#141a46}
.t-name { font-size: 13px; font-weight: 700; color: #fff; font-family: 'Syne', sans-serif; }
.t-role { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.stars { color: #a78bfa; font-size: 11px; margin-bottom: 9px; letter-spacing: 2px; }

.cta-section { padding: 130px 52px; text-align: center; position: relative; overflow: hidden; }
.cta-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 65% 65% at 50% 50%, rgba(124,58,237,0.07) 0%, transparent 70%); pointer-events: none; }
.cta-lbl { font-size: 10px; letter-spacing: 5px; text-transform: uppercase; color: #a78bfa; margin-bottom: 22px; }
.cta-title { font-family: 'Syne', sans-serif; font-size: clamp(66px, 12vw, 160px); font-weight: 800; letter-spacing: -2px; line-height: 0.9; color: #fff; margin-bottom: 44px; }
.cta-title span { -webkit-text-stroke: 2px #fff; color: transparent; }

.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; margin-bottom: 100px; }
.about-img-wrap { position: relative; }
.about-img-box { width: 100%; aspect-ratio: 4/5; border-radius: 16px; background: linear-gradient(135deg, rgba(20,26,70,0.8), rgba(124,58,237,0.2)); border: 1px solid rgba(255,255,255,0.08); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.about-float-stat { position: absolute; padding: 16px 22px; background: rgba(6,8,16,0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; backdrop-filter: blur(12px); }
.about-float-stat.top-right { top: 24px; right: -20px; }
.about-float-stat.bottom-left { bottom: 40px; left: -24px; }
.afs-n { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: #fff; }
.afs-n span { color: #a78bfa; }
.afs-l { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-top: 3px; }
.team-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-top: 44px; }
.team-card { background: rgba(20,26,70,0.2); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 28px 22px; text-align: center; transition: transform 0.3s, background 0.3s; cursor: none; }
.team-card:hover { transform: translateY(-5px); background: rgba(20,26,70,0.4); }
.team-avatar { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 14px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; }
.team-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #fff; }
.team-role { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 4px; letter-spacing: 1px; }
.values-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.val-card { padding: 32px 28px; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; background: rgba(20,26,70,0.15); transition: border-color 0.3s; }
.val-card:hover { border-color: rgba(124,58,237,0.4); }
.val-icon { font-size: 26px; margin-bottom: 14px; }
.val-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.val-desc { font-size: 13px; line-height: 1.7; color: rgba(255,255,255,0.45); font-weight: 300; }

.contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: start; }
.contact-info { position: sticky; top: 100px; }
.c-info-item { display: flex; gap: 16px; padding: 22px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
.c-info-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.25); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.c-info-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
.c-info-val { font-size: 14px; color: #fff; font-weight: 400; }
.contact-form-wrap { background: rgba(20,26,70,0.2); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 44px 40px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
.form-group input, .form-group select, .form-group textarea {
  width: 100%; background: rgba(6,8,16,0.6); border: 1px solid rgba(255,255,255,0.1);
  color: #fff; border-radius: 10px; padding: 13px 16px; font-size: 14px;
  font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #7c3aed; }
.form-group input::placeholder, .form-group textarea::placeholder { color: rgba(255,255,255,0.2); }
.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
}
.form-group select option { background: #0d1120; color: #fff; }
.form-group textarea { resize: vertical; min-height: 130px; }
.form-success { text-align: center; padding: 40px 0; }
.form-success-icon { font-size: 48px; margin-bottom: 16px; }
.form-success h3 { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.form-success p { font-size: 14px; color: rgba(255,255,255,0.45); }

.ai-btn { position: fixed; bottom: 28px; right: 28px; z-index: 900; width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #141a46); color: #fff; border: none; cursor: none; font-size: 18px; box-shadow: 0 4px 22px rgba(124,58,237,0.45); display: flex; align-items: center; justify-content: center; transition: transform 0.3s, box-shadow 0.3s; }
.ai-btn:hover { transform: scale(1.1); box-shadow: 0 8px 36px rgba(124,58,237,0.6); }
.ai-popup { position: fixed; bottom: 96px; right: 28px; z-index: 900; width: 310px; background: rgba(13,17,32,0.97); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 22px; box-shadow: 0 24px 80px rgba(0,0,0,0.6); transform: scale(0.85) translateY(20px); transform-origin: bottom right; opacity: 0; pointer-events: none; transition: transform 0.3s, opacity 0.3s; }
.ai-popup.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
.ai-hdr { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.ai-dot { width: 7px; height: 7px; border-radius: 50%; background: #7c3aed; animation: orbPulse 2s infinite; }
.ai-ttl { font-size: 13px; font-weight: 700; color: #fff; font-family: 'Syne', sans-serif; }
.ai-sub { font-size: 10px; color: rgba(255,255,255,0.3); margin-left: auto; }
.ai-msgs { display: flex; flex-direction: column; gap: 9px; margin-bottom: 12px; max-height: 190px; overflow-y: auto; }
.ai-msg { font-size: 12px; line-height: 1.5; padding: 9px 12px; border-radius: 9px; max-width: 85%; }
.ai-msg.bot { background: rgba(20,26,70,0.5); color: #fff; border-radius: 9px 9px 9px 2px; }
.ai-msg.user { background: linear-gradient(135deg, #7c3aed, #141a46); color: #fff; align-self: flex-end; border-radius: 9px 9px 2px 9px; }
.ai-irow { display: flex; gap: 7px; }
.ai-in { flex: 1; background: rgba(20,26,70,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 7px; padding: 9px 12px; font-size: 12px; font-family: inherit; outline: none; }
.ai-in::placeholder { color: rgba(255,255,255,0.2); }
.ai-send { width: 35px; height: 35px; border-radius: 7px; background: linear-gradient(135deg, #7c3aed, #141a46); border: none; cursor: none; color: #fff; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; flex-shrink: 0; }
.ai-send:hover { transform: scale(1.08); }

.clients-track { display: inline-flex; gap: 72px; animation: mqAnim2 28s linear infinite; align-items: center; white-space: nowrap; }
@keyframes mqAnim2 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.cl-logo { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; letter-spacing: 4px; color: rgba(255,255,255,0.18); white-space: nowrap; transition: color 0.3s; cursor: none; }
.cl-logo:hover { color: rgba(255,255,255,0.4); }

.section { padding: 110px 52px; }
.section-sm { padding: 70px 52px; }

.svc-list { display: grid; gap: 24px; }
.svc-row {
  display: grid; gap: 40px; padding: 36px 40px;
  border: 1px solid rgba(255,255,255,0.07); border-radius: 16px;
  background: rgba(20,26,70,0.1); align-items: center;
  transition: background 0.3s, border-color 0.3s;
  grid-template-columns: 1fr 2.5fr auto;
}
.svc-row:hover { background: rgba(20,26,70,0.35); border-color: rgba(124,58,237,0.3); }
.svc-metric-n { font-family: 'Syne', sans-serif; font-size: 34px; font-weight: 800; color: #a78bfa; }
.svc-metric-l { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 4px; }

@media(max-width:1024px){
  .sv-grid{grid-template-columns:repeat(2,1fr)}
  .sv-card:nth-child(3n){border-right:1px solid rgba(255,255,255,0.07)}
  .sv-card:nth-child(2n){border-right:none}
  .testi-grid{grid-template-columns:repeat(2,1fr)}
  .counter-strip{grid-template-columns:repeat(2,1fr)}
  .proc-inner{grid-template-columns:1fr;gap:44px}
  .about-grid{grid-template-columns:1fr;gap:44px}
  .contact-grid{grid-template-columns:1fr;gap:48px}
  .team-grid{grid-template-columns:repeat(2,1fr)}
  .contact-info{position:static}
  .pf-grid{grid-template-columns:repeat(2,1fr)}
  .svc-row{grid-template-columns:1fr 1fr;grid-template-rows:auto auto}
  .svc-row > div:last-child{grid-column:1/-1;text-align:left}
}
@media(max-width:768px){
  .ds-nav{padding:0 20px}
  .ds-nav-links{display:none}
  .hamburger{display:flex}
  .section,.section-sm{padding:72px 20px}
  .hero-section{padding:108px 20px 56px}
  .counter-strip{padding:44px 20px}
  .cta-section{padding:100px 20px}
  .ds-footer{padding:56px 20px 28px}
  .sv-grid{grid-template-columns:1fr}
  .sv-card{border-right:none!important}
  .pf-grid{grid-template-columns:1fr}
  .testi-grid{grid-template-columns:1fr}
  .counter-strip{grid-template-columns:repeat(2,1fr)}
  .ft-top{grid-template-columns:1fr}
  .ft-links-grid{grid-template-columns:1fr 1fr}
  .hero-stats{flex-direction:column;gap:18px}
  .globe-wrap{opacity:0.3;right:-12%;width:min(480px,100vw);height:min(480px,100vw)}
  .ai-btn,.ai-popup{display:none}
  #ds-cursor,#ds-cursor-ring{display:none}
  .about-float-stat{display:none}
  .form-row{grid-template-columns:1fr}
  .contact-form-wrap{padding:28px 22px}
  .team-grid{grid-template-columns:repeat(2,1fr)}
  .values-grid{grid-template-columns:1fr}
  .svc-row{grid-template-columns:1fr;padding:24px 20px}
  .scroll-ind{left:20px}
}
`;

/* ─────────────────────────────────────────────
   GLOBE HOOK  — FIX: prevent double-scaling on resize
───────────────────────────────────────────── */
function useHeroGlobe(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hCtx = canvas.getContext("2d");
    let animId;
    const dpr = window.devicePixelRatio || 1;

    // FIX: resize sets pixel dimensions from wrap size, does NOT call hCtx.scale
    // The scale is set once here and reset in each draw call via save/restore pattern
    function resize() {
      const wrap = canvas.parentElement;
      if (!wrap) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    resize();
    window.addEventListener("resize", resize);

    const pts = [];
    for (let i = 0; i < 280; i++) {
      pts.push({
        phi: Math.acos(2 * Math.random() - 1),
        theta: Math.random() * 2 * Math.PI,
        size: Math.random() * 2.2 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }
    const arcs = [];
    for (let i = 0; i < 16; i++) {
      arcs.push({
        a: pts[Math.floor(Math.random() * pts.length)],
        b: pts[Math.floor(Math.random() * pts.length)],
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }
    let rot = 0, tiltX = 0, tiltY = 0;
    const onMouse = (e) => {
      tiltX += ((e.clientY / window.innerHeight - 0.5) * 0.3 - tiltX) * 0.05;
      tiltY += ((e.clientX / window.innerWidth - 0.5) * 0.2 - tiltY) * 0.05;
    };
    window.addEventListener("mousemove", onMouse);

    function proj(phi, theta, r, cx, cy) {
      let x = Math.sin(phi) * Math.cos(theta + rot);
      let y = Math.cos(phi);
      let z = Math.sin(phi) * Math.sin(theta + rot);
      const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);
      const y2 = y * cosX - z * sinX, z2 = y * sinX + z * cosX;
      const cosY = Math.cos(tiltY), sinY = Math.sin(tiltY);
      const x3 = x * cosY + z2 * sinY, y3 = y2, z3 = -x * sinY + z2 * cosY;
      return { sx: cx + x3 * r, sy: cy - y3 * r, visible: z3 > -0.15, depth: z3 };
    }

    function draw() {
      // FIX: apply dpr scaling at the start of every draw call
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      hCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hCtx.clearRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.44;

      const atmo = hCtx.createRadialGradient(cx, cy, r * 0.75, cx, cy, r * 1.15);
      atmo.addColorStop(0, "rgba(124,58,237,0.04)");
      atmo.addColorStop(0.6, "rgba(20,26,70,0.07)");
      atmo.addColorStop(1, "transparent");
      hCtx.beginPath(); hCtx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      hCtx.fillStyle = atmo; hCtx.fill();

      const base = hCtx.createRadialGradient(cx - r * 0.28, cy - r * 0.28, r * 0.05, cx, cy, r);
      base.addColorStop(0, "rgba(20,26,70,0.9)");
      base.addColorStop(0.5, "rgba(10,14,30,0.75)");
      base.addColorStop(1, "rgba(6,8,16,0.85)");
      hCtx.beginPath(); hCtx.arc(cx, cy, r, 0, Math.PI * 2);
      hCtx.fillStyle = base; hCtx.fill();

      hCtx.save(); hCtx.beginPath(); hCtx.arc(cx, cy, r, 0, Math.PI * 2); hCtx.clip();
      for (let lat = -75; lat <= 75; lat += 15) {
        const phi2 = (90 - lat) * Math.PI / 180;
        hCtx.beginPath();
        hCtx.ellipse(cx, cy - r * Math.cos(phi2), r * Math.sin(phi2), r * Math.sin(phi2) * 0.2, 0, 0, Math.PI * 2);
        hCtx.strokeStyle = "rgba(124,58,237,0.1)"; hCtx.lineWidth = 0.7; hCtx.stroke();
      }
      for (let lon = 0; lon < 180; lon += 15) {
        const angle = lon * Math.PI / 180 + rot;
        hCtx.beginPath();
        hCtx.ellipse(cx, cy, r * Math.abs(Math.cos(angle)), r, 0, 0, Math.PI * 2);
        hCtx.strokeStyle = "rgba(124,58,237,0.08)"; hCtx.lineWidth = 0.7; hCtx.stroke();
      }
      hCtx.restore();

      arcs.forEach((arc) => {
        arc.progress += arc.speed;
        if (arc.progress > 1) arc.progress = 0;
        const pA = proj(arc.a.phi, arc.a.theta, r, cx, cy);
        const pB = proj(arc.b.phi, arc.b.theta, r, cx, cy);
        if (!pA.visible || !pB.visible) return;
        const len = Math.hypot(pB.sx - pA.sx, pB.sy - pA.sy);
        if (len > r * 0.8) return;
        const midX = (pA.sx + pB.sx) / 2, midY = (pA.sy + pB.sy) / 2 - r * 0.1;
        const g = hCtx.createLinearGradient(pA.sx, pA.sy, pB.sx, pB.sy);
        g.addColorStop(0, "rgba(124,58,237,0)");
        g.addColorStop(arc.progress * 0.8, `rgba(124,58,237,${arc.alpha * 0.8})`);
        g.addColorStop(arc.progress, `rgba(167,139,250,${arc.alpha})`);
        g.addColorStop(Math.min(arc.progress + 0.15, 1), "rgba(124,58,237,0)");
        g.addColorStop(1, "rgba(124,58,237,0)");
        hCtx.beginPath(); hCtx.moveTo(pA.sx, pA.sy);
        hCtx.quadraticCurveTo(midX, midY, pB.sx, pB.sy);
        hCtx.strokeStyle = g; hCtx.lineWidth = 1; hCtx.stroke();
      });

      pts.forEach((pt) => {
        const p = proj(pt.phi, pt.theta, r, cx, cy);
        if (!p.visible) return;
        const df = (p.depth + 1) / 2;
        hCtx.beginPath();
        hCtx.arc(p.sx, p.sy, pt.size * (0.5 + df * 0.5), 0, Math.PI * 2);
        hCtx.fillStyle = `rgba(167,139,250,${pt.alpha * df})`; hCtx.fill();
        if (pt.alpha > 0.85 && df > 0.6) {
          hCtx.beginPath(); hCtx.arc(p.sx, p.sy, pt.size * 3, 0, Math.PI * 2);
          const pg = hCtx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, pt.size * 3);
          pg.addColorStop(0, `rgba(167,139,250,${pt.alpha * df * 0.3})`);
          pg.addColorStop(1, "transparent");
          hCtx.fillStyle = pg; hCtx.fill();
        }
      });

      const spec = hCtx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, 0, cx - r * 0.3, cy - r * 0.35, r * 0.55);
      spec.addColorStop(0, "rgba(255,255,255,0.1)"); spec.addColorStop(1, "transparent");
      hCtx.beginPath(); hCtx.arc(cx, cy, r, 0, Math.PI * 2); hCtx.fillStyle = spec; hCtx.fill();

      const rim = hCtx.createRadialGradient(cx, cy, r * 0.72, cx, cy, r);
      rim.addColorStop(0, "transparent");
      rim.addColorStop(0.7, "rgba(124,58,237,0.04)");
      rim.addColorStop(1, "rgba(124,58,237,0.15)");
      hCtx.beginPath(); hCtx.arc(cx, cy, r, 0, Math.PI * 2); hCtx.fillStyle = rim; hCtx.fill();

      rot += 0.0015;
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [canvasRef]);
}

/* ─────────────────────────────────────────────
   SHARED HOOKS — all with [] deps to run once
───────────────────────────────────────────── */
function useCursor() {
  useEffect(() => {
    const dot = document.getElementById("ds-cursor");
    const ring = document.getElementById("ds-cursor-ring");
    if (!dot || !ring) return;
    let rx = -200, ry = -200;
    const onMove = (e) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      rx += (e.clientX - rx) * 0.14;
      ry += (e.clientY - ry) * 0.14;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
    };
    document.addEventListener("mousemove", onMove);

    // FIX: use a short delay so DOM is fully painted before querying
    const t = setTimeout(() => {
      document.querySelectorAll(
        "a,button,.sv-card,.pf-item,.testi-card,.step-item,.ftab,.team-card,.val-card,.cl-logo,.svc-row"
      ).forEach((el) => {
        el.addEventListener("mouseenter", () => document.body.classList.add("hovered"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("hovered"));
      });
    }, 300);

    return () => {
      clearTimeout(t);
      document.removeEventListener("mousemove", onMove);
      document.body.classList.remove("hovered");
    };
  }, []); // FIX: empty deps — run once on mount
}

// FIX: useReveal now accepts an optional key so pages can reset observers on navigation
function useReveal(key = "") {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target); // FIX: unobserve after triggering to free memory
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.remove("visible"); // reset so animation replays on page change
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, [key]); // FIX: re-run when key changes (i.e. page navigation)
}

function useScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById("scroll-prog-bar");
    if (!bar) return;
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = p + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []); // FIX: empty deps
}

/* ─────────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────────── */
const MQ_ITEMS = [
  "SEO Strategy","Paid Media","Social Media","Brand Identity",
  "Content Marketing","Email Campaigns","Analytics","Growth Hacking","CRO","Influencer Marketing",
];

function Marquee() {
  // FIX: duplicate once so the seamless loop works at -50%
  const doubled = [...MQ_ITEMS, ...MQ_ITEMS];
  return (
    <div className="mq-strip">
      <div className="mq-track">
        {doubled.map((it, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
            <span className="mq-item">{it}</span>
            <span className="mq-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Footer({ navigate }) {
  // FIX: dynamic copyright year
  const year = new Date().getFullYear();
  return (
    <footer className="ds-footer">
      <div className="ft-top">
        <div>
          <div className="ds-logo" onClick={() => navigate("home")}>
            <div className="logo-orb" />DSPHERY
          </div>
          <p className="ft-tagline">A digital marketing agency obsessed with performance, precision, and measurable results.</p>
          <div className="social-row" style={{ marginTop: 22 }}>
            {["𝕏", "in", "ig", "▶"].map((s, i) => (
              <button key={i} className="soc-btn" aria-label={`Social link ${i + 1}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="ft-links-grid">
          <div className="ft-col">
            <h4>Services</h4>
            <ul>
              {["SEO","Paid Media","Social Media","Content","Analytics"].map((s) => (
                <li key={s} onClick={() => navigate("services")} style={{ cursor: "none" }}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="ft-col">
            <h4>Company</h4>
            <ul>
              {["About","Portfolio","Contact"].map((s) => (
                <li key={s} onClick={() => navigate(s.toLowerCase())} style={{ cursor: "none" }}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="ft-col">
            <h4>Contact</h4>
            <ul>
              <li>hello@dsphery.com</li>
              <li>+1 (555) 000-0000</li>
              <li>New York, NY</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="ft-bottom">
        <p className="ft-copy">© {year} DSPHERY. All rights reserved.</p>
        <p className="ft-copy">Crafted with ✦ precision</p>
      </div>
    </footer>
  );
}

function Nav({ page, navigate }) {
  const [mob, setMob] = useState(false);

  // FIX: lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mob ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mob]);

  const pages = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Work" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const handleNav = (id) => { navigate(id); setMob(false); };

  return (
    <>
      <nav className="ds-nav">
        <div className="ds-logo" onClick={() => handleNav("home")}>
          <div className="logo-orb" />DSPHERY
        </div>
        <div className="ds-nav-links">
          {pages.map((p) => (
            <button key={p.id} className={page === p.id ? "active" : ""} onClick={() => handleNav(p.id)}>
              {p.label}
            </button>
          ))}
          <button className="nav-cta-btn" onClick={() => handleNav("contact")}>Start a Project</button>
        </div>
        <button className={`hamburger${mob ? " open" : ""}`} onClick={() => setMob(!mob)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu${mob ? " open" : ""}`}>
        {pages.map((p) => (
          <button key={p.id} onClick={() => handleNav(p.id)}>{p.label}</button>
        ))}
      </div>
    </>
  );
}

const BOT_REPLIES = [
  "Hey! 👋 Happy to help. Our team specializes in exactly that — let me connect you with a strategist.",
  "That's a smart area to invest in. DSPHERY has helped brands achieve 3–5× growth in that channel.",
  "We typically start with a free audit call. Want me to schedule one?",
  "Our SEO, Paid Media, and Content teams work together to drive compounding results.",
  "Average clients see meaningful lift within 90 days. Want to see our case studies?",
];

function AIChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ bot: true, text: "Hey! 👋 I'm DSPHERY's assistant. How can I help you grow?" }]);
  const [input, setInput] = useState("");
  const [rIdx, setRIdx] = useState(0);
  const msgsRef = useRef(null);

  const send = useCallback(() => {
    const txt = input.trim(); // FIX: trim before checking
    if (!txt) return;
    setMsgs((m) => [...m, { bot: false, text: txt }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { bot: true, text: BOT_REPLIES[rIdx % BOT_REPLIES.length] }]);
      setRIdx((r) => r + 1);
    }, 700);
  }, [input, rIdx]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs]);

  return (
    <>
      <button className="ai-btn" onClick={() => setOpen((o) => !o)} aria-label="Toggle chat">
        💬
      </button>
      <div className={`ai-popup${open ? " open" : ""}`}>
        <div className="ai-hdr">
          <div className="ai-dot" />
          <span className="ai-ttl">DSPHERY Assistant</span>
          <span className="ai-sub">Online</span>
        </div>
        <div className="ai-msgs" ref={msgsRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`ai-msg ${m.bot ? "bot" : "user"}`}>{m.text}</div>
          ))}
        </div>
        <div className="ai-irow">
          <input
            className="ai-in"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything…"
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="ai-send" onClick={send} aria-label="Send">↑</button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
function Home({ navigate }) {
  const globeRef = useRef(null);
  useHeroGlobe(globeRef);
  useReveal("home");
  useScrollProgress();

  return (
    <div className="page-enter">
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-noise" />
          <div className="hero-glow" />
          <div className="hero-grid" />
          <div className="fpills">
            <span className="fpill">✦ SEO &amp; Content</span>
            <span className="fpill">✦ Paid Ads</span>
            <span className="fpill">✦ Brand Strategy</span>
            <span className="fpill">✦ Data Analytics</span>
          </div>
        </div>
        <div className="globe-wrap">
          <canvas ref={globeRef} id="heroGlobe" />
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="eyebrow-dot" />Digital Marketing Agency — Est. 2018
          </div>
          <h1 className="hero-title">
            <span className="tl"><span>We Build</span></span>
            <span className="tl"><span className="t-outline">Brands That</span></span>
            <span className="tl"><span className="t-accent">Dominate</span></span>
          </h1>
        </div>
        <div className="hero-bottom">
          <div>
            <p className="hero-desc">
              We craft data-driven digital strategies that transform your online presence and drive measurable growth for ambitious businesses.
            </p>
            <div className="hero-ctas">
              <button className="btn-primary" onClick={() => navigate("contact")}>Start a Project <span>↗</span></button>
              <button className="btn-ghost" onClick={() => navigate("portfolio")}>View Our Work</button>
            </div>
          </div>
          <div className="hero-stats">
            <div><div className="stat-n">240<span>+</span></div><div className="stat-l">Clients Served</div></div>
            <div><div className="stat-n">$4.2B</div><div className="stat-l">Revenue Generated</div></div>
            <div><div className="stat-n">97<span>%</span></div><div className="stat-l">Client Retention</div></div>
          </div>
        </div>
        <div className="scroll-ind">
          <div className="scroll-ln" /><span>Scroll</span>
        </div>
      </section>

      <Marquee />

      <div className="counter-strip">
        {[["240+","Clients Served"],["$4.2B","Revenue Generated"],["97%","Client Retention"],["8+","Years in Business"]].map(([n, l], i) => (
          // FIX: rd classes start at rd1; use rd1–rd4 consistently
          <div key={i} className={`reveal rd${i + 1}`}>
            <div className="counter-n">{n}</div>
            <div className="counter-l">{l}</div>
          </div>
        ))}
      </div>

      <section className="section">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:56, flexWrap:"wrap", gap:24 }}>
          <div className="reveal">
            <div className="sec-label">What We Do</div>
            <h2 className="sec-title">Our<br />Services</h2>
          </div>
          <button className="btn-ghost reveal" onClick={() => navigate("services")} style={{ alignSelf:"flex-end" }}>
            View All Services →
          </button>
        </div>
        <div className="sv-grid reveal">
          {[
            ["01","🔍","Search Engine Optimization","Dominate search rankings with advanced technical SEO, content strategy, and authority building.",["On-Page","Technical","Link Building"]],
            ["02","🎯","Paid Media & PPC","Precision-targeted advertising across Google, Meta, TikTok and beyond. AI-optimized campaigns.",["Google Ads","Meta","TikTok"]],
            ["03","💡","Brand Strategy","Build a brand that resonates. From identity to voice and visual systems, we create brands people remember.",["Identity","Positioning","Voice"]],
            ["04","📱","Social Media Management","Platform-native content that builds communities and converts followers into loyal customers.",["Content","Community","Growth"]],
            ["05","✍️","Content Marketing","Strategic content that educates, entertains, and converts across blog posts, video scripts and more.",["Blog","Video","Email"]],
            ["06","📊","Analytics & Growth","Data is our obsession. We track every metric and continuously optimize to compound growth.",["Reporting","CRO","A/B Testing"]],
          ].map(([num, icon, title, desc, tags]) => (
            <div className="sv-card" key={num} onClick={() => navigate("services")}>
              <div className="sv-num">{num}</div>
              <div className="sv-icon">{icon}</div>
              <div className="sv-title">{title}</div>
              <div className="sv-desc">{desc}</div>
              <div className="sv-tags">{tags.map((t) => <span className="sv-tag" key={t}>{t}</span>)}</div>
              <span className="sv-arrow">↗</span>
            </div>
          ))}
        </div>
      </section>

      <div style={{ padding:"44px 52px", overflow:"hidden", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.2)", textAlign:"center", marginBottom:28 }} className="reveal">
          Trusted By Forward-Thinking Brands
        </div>
        {/* FIX: outer overflow:hidden wrapper needed for seamless marquee */}
        <div style={{ overflow:"hidden" }}>
          <div className="clients-track">
            {["TECHVAULT","LUMINARY","ORBITCO","NEXGEN","PULSE","MERIDIAN","VANTA","AXIOM",
              "TECHVAULT","LUMINARY","ORBITCO","NEXGEN","PULSE","MERIDIAN","VANTA","AXIOM"].map((c, i) => (
              <span className="cl-logo" key={i}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="section" style={{ background:"rgba(20,26,70,0.1)" }}>
        <div className="sec-label reveal">What Clients Say</div>
        <div className="testi-grid">
          {[
            ["JM","av-a","James Mitchell","CEO, TechVault","DSPHERY transformed our SEO from an afterthought into our #1 revenue channel. Organic traffic grew 420% in eight months — completely beyond our expectations."],
            ["SK","av-b","Sarah Kim","CMO, Luminary Co.","Their paid media team is exceptional. We scaled from $50K to $400K monthly ad spend while maintaining a 4.2× ROAS. The ROI speaks for itself."],
            ["RP","av-c","Ryan Park","Founder, Orbit Commerce","In 12 months DSPHERY built us a social presence with 800K engaged followers and a community that actively champions our brand."],
          ].map(([init, av, name, role, text]) => (
            <div className="testi-card reveal" key={name}>
              <div className="stars">★★★★★</div>
              <div className="testi-q">"</div>
              <p className="testi-text">{text}</p>
              <div className="testi-author">
                <div className={`t-avatar ${av}`}>{init}</div>
                <div><div className="t-name">{name}</div><div className="t-role">{role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-lbl">Ready to Grow?</div>
        <h2 className="cta-title reveal">Let's Build<br /><span>Something</span><br />Great</h2>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-primary" onClick={() => navigate("contact")}>Start Your Project ↗</button>
          <button className="btn-ghost" onClick={() => navigate("contact")}>Book a Call</button>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SERVICES PAGE
───────────────────────────────────────────── */
const SERVICES_DATA = [
  { num:"01", icon:"🔍", title:"Search Engine Optimization", desc:"Dominate search rankings with advanced technical SEO, content strategy, and authority building that drives lasting organic growth.", tags:["On-Page","Technical","Link Building","Local SEO"], metric:"420%", metricLabel:"Avg. Organic Growth" },
  { num:"02", icon:"🎯", title:"Paid Media & PPC", desc:"Precision-targeted advertising across Google, Meta, TikTok and beyond. AI-optimized campaigns that convert at scale.", tags:["Google Ads","Meta","TikTok","LinkedIn"], metric:"4.2×", metricLabel:"Average ROAS" },
  { num:"03", icon:"💡", title:"Brand Strategy", desc:"Build a brand that resonates. From identity and positioning to voice and visual systems, we create brands people remember.", tags:["Identity","Positioning","Voice","Visual Systems"], metric:"98%", metricLabel:"Client Satisfaction" },
  { num:"04", icon:"📱", title:"Social Media Management", desc:"Platform-native content that builds communities, drives engagement, and converts followers into loyal customers.", tags:["Content","Community","Growth","Influencer"], metric:"800K", metricLabel:"Community Built" },
  { num:"05", icon:"✍️", title:"Content Marketing", desc:"Strategic content that educates, entertains, and converts. From blog posts to video scripts, we tell your story compellingly.", tags:["Blog","Video","Email","Podcast"], metric:"3.8×", metricLabel:"Avg. Engagement Lift" },
  { num:"06", icon:"📊", title:"Analytics & Growth", desc:"Data is our obsession. We track every metric, find every opportunity, and continuously optimize to compound growth.", tags:["Reporting","CRO","A/B Testing","BI Dashboards"], metric:"40%", metricLabel:"Conversion Rate Lift" },
];

function Services({ navigate }) {
  useReveal("services");
  return (
    <div className="page-enter">
      <div style={{ padding:"140px 52px 60px", position:"relative", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 30% 60%, rgba(124,58,237,0.07) 0%, transparent 60%)", pointerEvents:"none" }} />
        <div className="sec-label reveal">What We Do</div>
        <h1 className="sec-title reveal" style={{ maxWidth:600, marginBottom:24 }}>Comprehensive<br />Digital Services</h1>
        <p className="reveal" style={{ fontSize:15, lineHeight:1.78, color:"rgba(255,255,255,0.45)", maxWidth:480, fontWeight:300, marginBottom:36 }}>
          End-to-end digital marketing solutions tailored to your growth ambitions. Every service backed by data, powered by creativity.
        </p>
        <button className="btn-primary reveal" onClick={() => navigate("contact")}>Start a Project ↗</button>
      </div>

      <div className="section">
        {/* FIX: use className svc-list for responsive grid */}
        <div className="svc-list">
          {SERVICES_DATA.map((s) => (
            <div key={s.num} className="svc-row reveal">
              <div>
                <div style={{ fontSize:10, letterSpacing:3, color:"rgba(255,255,255,0.25)", marginBottom:10, fontFamily:"'Syne',sans-serif", fontWeight:700 }}>{s.num}</div>
                <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:"#fff" }}>{s.title}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:12 }}>
                  {s.tags.map((t) => <span className="sv-tag" key={t}>{t}</span>)}
                </div>
              </div>
              <p style={{ fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,0.45)", fontWeight:300 }}>{s.desc}</p>
              <div style={{ textAlign:"center", minWidth:100 }}>
                <div className="svc-metric-n">{s.metric}</div>
                <div className="svc-metric-l">{s.metricLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{ background:"rgba(20,26,70,0.12)", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div className="proc-inner">
          <div>
            <div className="sec-label reveal">Our Approach</div>
            <h2 className="sec-title reveal">How We<br />Make Magic</h2>
            <p className="proc-body reveal">We don't believe in cookie-cutter strategies. Every brand is unique and deserves a tailored approach built on real data and sharp creative thinking.</p>
            <button className="btn-primary reveal" onClick={() => navigate("contact")}>Work With Us →</button>
          </div>
          <ul style={{ listStyle:"none" }}>
            {[
              ["01","Discovery & Audit","We dissect your digital presence, analyze competitors, and identify the biggest growth opportunities."],
              ["02","Strategy Blueprint","A bespoke roadmap with clear KPIs, channel mix, budget allocation, and 90-day sprints."],
              ["03","Launch & Optimize","Rapid deployment, A/B testing, and relentless iteration. We move fast and double down on what works."],
              ["04","Scale & Report","Monthly deep-dive reports, quarterly strategy reviews, and proactive scaling on winning signals."],
            ].map(([n, t, d]) => (
              <li key={n} className="step-item reveal">
                <div className="step-num">{n}</div>
                <div><div className="step-title">{t}</div><div className="step-desc">{d}</div></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer navigate={navigate} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   PORTFOLIO PAGE
───────────────────────────────────────────── */
const PORTFOLIO_ITEMS = [
  { cat:["brand","seo"], tag:"Brand Strategy + SEO", name:"TechVault Rebrand",  meta:"420% organic growth in 8 months",    color:"linear-gradient(135deg,#0a1230 0%,#050a18 100%)", accent:"#7c3aed" },
  { cat:["paid"],        tag:"Paid Media",            name:"Luminary Growth",    meta:"4.2× ROAS at $400K/mo",              color:"linear-gradient(135deg,#100d28 0%,#060218 100%)", accent:"#a78bfa" },
  { cat:["social"],      tag:"Social Media",          name:"Orbit Commerce",     meta:"800K community in 12 months",        color:"linear-gradient(135deg,#1a0a20 0%,#0f0015 100%)", accent:"#c4b5fd" },
  { cat:["seo"],         tag:"SEO",                   name:"Nexgen Platform",    meta:"310% traffic increase YOY",          color:"linear-gradient(135deg,#0d1828 0%,#060f1a 100%)", accent:"#818cf8" },
  { cat:["brand"],       tag:"Brand Identity",        name:"Vanta Labs",         meta:"Complete brand system from scratch", color:"linear-gradient(135deg,#150a25 0%,#0a0515 100%)", accent:"#a78bfa" },
  { cat:["paid","social"],tag:"Paid + Social",        name:"Pulse Commerce",     meta:"12× ROI in 6 months",                color:"linear-gradient(135deg,#0a1520 0%,#050c14 100%)", accent:"#6d28d9" },
];

function Portfolio({ navigate }) {
  const [filter, setFilter] = useState("all");
  // FIX: pass filter as key so reveal re-triggers when filter changes
  useReveal(`portfolio-${filter}`);

  const visible = PORTFOLIO_ITEMS.filter((p) => filter === "all" || p.cat.includes(filter));

  return (
    <div className="page-enter">
      <div style={{ padding:"140px 52px 60px", position:"relative", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 50% 60% at 70% 50%, rgba(124,58,237,0.07) 0%, transparent 60%)", pointerEvents:"none" }} />
        <div className="sec-label reveal">Selected Work</div>
        <h1 className="sec-title reveal">Cases That<br />Speak Volumes</h1>
        <p className="reveal" style={{ fontSize:15, lineHeight:1.78, color:"rgba(255,255,255,0.45)", maxWidth:440, fontWeight:300, marginTop:20 }}>
          Real results for real brands. Every project tells a story of strategy, creativity, and measurable growth.
        </p>
      </div>
      <section className="section">
        <div className="ftabs">
          {[["all","All"],["seo","SEO"],["paid","Paid Media"],["brand","Brand"],["social","Social"]].map(([f, label]) => (
            <button key={f} className={`ftab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{label}</button>
          ))}
        </div>
        {/* FIX: use .pf-grid className (defined in CSS) instead of inline style */}
        <div className="pf-grid">
          {visible.map((p, i) => (
            <div key={p.name} className="pf-item reveal">
              <div className="mock-img" style={{ height:280, background:p.color, position:"relative", overflow:"hidden" }}>
                <svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
                  <defs>
                    <radialGradient id={`rg${i}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={p.accent} stopOpacity="0.15" />
                      <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#rg${i})`} />
                  <circle cx="250" cy="140" r="100" fill="none" stroke={p.accent} strokeWidth="0.5" opacity="0.2" />
                  <circle cx="250" cy="140" r="60" fill="none" stroke={p.accent} strokeWidth="0.5" opacity="0.15" />
                  <text x="250" y="150" textAnchor="middle" fontFamily="Syne" fontSize="36" fill={p.accent} opacity="0.7" fontWeight="800">
                    {p.meta.split(" ")[0]}
                  </text>
                </svg>
              </div>
              <div className="pf-overlay">
                <div className="pf-tag">{p.tag}</div>
                <div className="pf-name">{p.name}</div>
                <div className="pf-meta">{p.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div style={{ padding:"80px 52px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,5vw,60px)", fontWeight:800, color:"#fff", marginBottom:20 }}>
          Ready to be our next success story?
        </h2>
        <button className="btn-primary" onClick={() => navigate("contact")}>Start a Project ↗</button>
      </div>
      <Footer navigate={navigate} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ABOUT PAGE
───────────────────────────────────────────── */
function About({ navigate }) {
  useReveal("about");
  return (
    <div className="page-enter">
      <div style={{ padding:"140px 52px 60px", position:"relative", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 60% at 50% 50%, rgba(20,26,70,0.3) 0%, transparent 65%)", pointerEvents:"none" }} />
        <div className="sec-label reveal">Our Story</div>
        <h1 className="sec-title reveal">Built for<br />Bold Brands</h1>
      </div>
      <section className="section">
        <div className="about-grid">
          <div className="about-img-wrap">
            <div className="about-img-box">
              <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" style={{ width:"80%", opacity:0.7 }}>
                <defs>
                  <radialGradient id="about-rg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#141a46" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="400" height="500" fill="url(#about-rg)" />
                <circle cx="200" cy="250" r="140" fill="none" stroke="#7c3aed" strokeWidth="0.8" opacity="0.3" />
                <circle cx="200" cy="250" r="100" fill="none" stroke="#a78bfa" strokeWidth="0.6" opacity="0.2" />
                <circle cx="200" cy="250" r="60" fill="none" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.15" />
                <text x="200" y="265" textAnchor="middle" fontFamily="Syne" fontSize="52" fill="#7c3aed" opacity="0.5" fontWeight="800">DS</text>
              </svg>
              <div className="about-float-stat top-right">
                <div className="afs-n">240<span>+</span></div><div className="afs-l">Clients Served</div>
              </div>
              <div className="about-float-stat bottom-left">
                <div className="afs-n">97<span>%</span></div><div className="afs-l">Retention Rate</div>
              </div>
            </div>
          </div>
          <div className="reveal">
            <div className="sec-label">Who We Are</div>
            <h2 className="sec-title" style={{ fontSize:"clamp(36px,4.5vw,60px)", marginBottom:24 }}>Performance-Obsessed<br />Marketing Partners</h2>
            <p style={{ fontSize:15, lineHeight:1.8, color:"rgba(255,255,255,0.45)", fontWeight:300, marginBottom:18 }}>
              Founded in 2018, DSPHERY started with a simple belief: digital marketing should produce real, measurable results — not vanity metrics or inflated reports.
            </p>
            <p style={{ fontSize:15, lineHeight:1.8, color:"rgba(255,255,255,0.45)", fontWeight:300, marginBottom:32 }}>
              We've grown from a 3-person team to a 60+ specialist agency, helping over 240 brands dominate their categories. Our edge? We think like business owners, not marketers.
            </p>
            <div style={{ display:"flex", gap:40, marginBottom:32, flexWrap:"wrap" }}>
              {[["2018","Founded"],["60+","Team Members"],["12","Industries"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:700, color:"#fff" }}>{n}</div>
                  <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => navigate("contact")}>Work With Us →</button>
          </div>
        </div>

        <div style={{ marginTop:80 }}>
          <div className="sec-label reveal">Core Values</div>
          <h2 className="sec-title reveal" style={{ marginBottom:40, fontSize:"clamp(32px,4vw,56px)" }}>What Drives Us</h2>
          <div className="values-grid">
            {[
              ["🎯","Results First","Every decision is filtered through a single question: does this drive measurable growth?"],
              ["🔬","Data-Driven","We build hypotheses, run tests, measure outcomes, and iterate relentlessly. Opinions don't win — data does."],
              ["🤝","True Partnership","We treat your business like our own. Your wins are our wins. Your growth is our north star."],
              ["💡","Creative Courage","We take bold creative swings backed by strategic thinking. Safe is the riskiest thing you can be in marketing."],
              ["⚡","Speed & Agility","Markets move fast. We move faster. Rapid experimentation and deployment is baked into everything we do."],
              ["📈","Compounding Growth","We build systems and strategies designed to compound over time. Short-term spikes don't interest us."],
            ].map(([icon, title, desc]) => (
              <div className="val-card reveal" key={title}>
                <div className="val-icon">{icon}</div>
                <div className="val-title">{title}</div>
                <div className="val-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:80 }}>
          <div className="sec-label reveal">The Team</div>
          <h2 className="sec-title reveal" style={{ marginBottom:40, fontSize:"clamp(32px,4vw,56px)" }}>Meet the Minds</h2>
          <div className="team-grid">
            {[
              ["AM","linear-gradient(135deg,#141a46,#7c3aed)","Alex Morgan","CEO & Founder"],
              ["JL","linear-gradient(135deg,#7c3aed,#a78bfa)","Jamie Lee","Head of Growth"],
              ["SC","linear-gradient(135deg,#a78bfa,#c4b5fd)","Sara Chen","Creative Director"],
              ["MR","linear-gradient(135deg,#6d28d9,#7c3aed)","Mike Ross","Head of Analytics"],
              ["LP","linear-gradient(135deg,#141a46,#4c1d95)","Lisa Park","SEO Lead"],
              ["DK","linear-gradient(135deg,#5b21b6,#7c3aed)","David Kim","Paid Media Lead"],
              ["NW","linear-gradient(135deg,#7c3aed,#8b5cf6)","Nina Walsh","Content Strategist"],
              ["RJ","linear-gradient(135deg,#4c1d95,#6d28d9)","Ryan James","Social Lead"],
            ].map(([initials, bg, name, role]) => (
              <div className="team-card reveal" key={name}>
                <div className="team-avatar" style={{ background:bg }}>{initials}</div>
                <div className="team-name">{name}</div>
                <div className="team-role">{role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONTACT PAGE
───────────────────────────────────────────── */
function Contact({ navigate }) {
  useReveal("contact");
  const [form, setForm] = useState({ name:"", email:"", company:"", budget:"", service:"", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // FIX: handle both success and error states, always reset loading
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      try {
        setLoading(false);
        setSubmitted(true);
      } catch (err) {
        setLoading(false);
        setError("Something went wrong. Please try again.");
      }
    }, 1400);
  };

  return (
    <div className="page-enter">
      <div style={{ padding:"140px 52px 60px", position:"relative", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 50% 60% at 25% 60%, rgba(124,58,237,0.07) 0%, transparent 60%)", pointerEvents:"none" }} />
        <div className="sec-label reveal">Get In Touch</div>
        <h1 className="sec-title reveal">Let's Build<br />Something Great</h1>
        <p className="reveal" style={{ fontSize:15, lineHeight:1.78, color:"rgba(255,255,255,0.45)", maxWidth:440, fontWeight:300, marginTop:20 }}>
          Ready to transform your digital presence? Tell us about your project and we'll get back to you within 24 hours.
        </p>
      </div>
      <section className="section">
        <div className="contact-grid">
          <div className="contact-info">
            <div className="sec-label reveal">Contact Info</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,3.5vw,44px)", fontWeight:800, color:"#fff", marginBottom:32, lineHeight:1.05 }} className="reveal">
              We'd love to<br />hear from you
            </h2>
            {[["📧","Email","hello@dsphery.com"],["📞","Phone","+1 (555) 000-0000"],["📍","Location","New York, NY 10001"],["⏰","Response Time","Within 24 hours"]].map(([icon, label, val]) => (
              <div className="c-info-item reveal" key={label}>
                <div className="c-info-icon">{icon}</div>
                <div><div className="c-info-label">{label}</div><div className="c-info-val">{val}</div></div>
              </div>
            ))}
            <div style={{ marginTop:36, padding:28, background:"rgba(20,26,70,0.3)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:14 }} className="reveal">
              <div style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"#a78bfa", marginBottom:10 }}>Free Strategy Call</div>
              <p style={{ fontSize:13, lineHeight:1.7, color:"rgba(255,255,255,0.45)", fontWeight:300, marginBottom:16 }}>
                Book a no-obligation 30-minute strategy session with one of our growth experts.
              </p>
              <button className="btn-primary" style={{ fontSize:11, padding:"10px 22px" }}>Book a Call →</button>
            </div>
          </div>

          <div className="contact-form-wrap reveal">
            {submitted ? (
              <div className="form-success">
                <div className="form-success-icon">🎉</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll be in touch within 24 hours.</p>
                <button className="btn-primary" style={{ marginTop:24 }} onClick={() => setSubmitted(false)}>Send Another</button>
              </div>
            ) : (
              // FIX: use onSubmit on form; no <form> is a React artifact constraint but here
              // we're in a standard JSX app so <form> is fine — kept as-is
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:"#fff", marginBottom:28 }}>Tell Us About Your Project</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="John Smith" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@company.com" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Your Company" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="budget">Monthly Budget</label>
                    <select id="budget" name="budget" value={form.budget} onChange={handleChange}>
                      <option value="">Select range</option>
                      <option>$1K – $5K</option>
                      <option>$5K – $15K</option>
                      <option>$15K – $50K</option>
                      <option>$50K+</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="service">Service Interested In</label>
                  <select id="service" name="service" value={form.service} onChange={handleChange}>
                    <option value="">Select service</option>
                    <option>SEO</option>
                    <option>Paid Media</option>
                    <option>Brand Strategy</option>
                    <option>Social Media</option>
                    <option>Content Marketing</option>
                    <option>Analytics &amp; Growth</option>
                    <option>Full-Service Package</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Tell Us About Your Goals *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Describe your business, current challenges, and what you'd like to achieve…"
                    required
                  />
                </div>
                {error && (
                  <p style={{ color:"#f87171", fontSize:13, marginBottom:12 }}>{error}</p>
                )}
                <button className="btn-primary" type="submit" style={{ width:"100%", justifyContent:"center" }} disabled={loading}>
                  {loading ? "Sending…" : "Send Message ↗"}
                </button>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.25)", textAlign:"center", marginTop:14 }}>
                  We respond within 24 hours. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("home");
  const [loaded, setLoaded] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!document.getElementById("ds-global-css")) {
      const style = document.createElement("style");
      style.id = "ds-global-css";
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(p + Math.random() * 15, 99);
      setPct(Math.floor(p));
    }, 100);
    const done = () => {
      clearInterval(iv);
      setPct(100);
      setTimeout(() => setLoaded(true), 350);
    };
    window.addEventListener("load", done);
    const fallback = setTimeout(done, 2200);
    return () => {
      clearInterval(iv);
      clearTimeout(fallback);
      window.removeEventListener("load", done);
    };
  }, []);

  useCursor();

  const navigate = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div id="ds-cursor" />
      <div id="ds-cursor-ring" />
      <div id="scroll-prog"><div id="scroll-prog-bar" /></div>
      <div id="ds-loader" className={loaded ? "hidden" : ""}>
        <div className="ld-word">
          {"DSPHERY".split("").map((c, i) => <span key={i}>{c}</span>)}
        </div>
        <div className="ld-orb" />
        <div className="ld-pct">{pct}%</div>
      </div>
      <Nav page={page} navigate={navigate} />
      <main style={{ paddingTop: 70 }}>
        {page === "home"      && <Home      navigate={navigate} />}
        {page === "services"  && <Services  navigate={navigate} />}
        {page === "portfolio" && <Portfolio navigate={navigate} />}
        {page === "about"     && <About     navigate={navigate} />}
        {page === "contact"   && <Contact   navigate={navigate} />}
      </main>
      <AIChat />
    </>
  );
}