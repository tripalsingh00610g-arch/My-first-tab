import { useState, useEffect, useRef, useCallback } from "react";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Poppins:ital,wght@0,300;0,400;0,500;1,300&display=swap');

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
  background: #39ff14; border-radius: 50%;
  pointer-events: none; z-index: 99999;
  transform: translate(-50%,-50%);
  transition: transform 0.08s, width 0.25s, height 0.25s, background 0.25s;
  mix-blend-mode: screen;
}
#ds-cursor-ring {
  position: fixed; top: 0; left: 0;
  width: 40px; height: 40px;
  border: 1px solid rgba(57,255,20,0.4); border-radius: 50%;
  pointer-events: none; z-index: 99998;
  transform: translate(-50%,-50%);
  transition: left 0.12s ease, top 0.12s ease, width 0.3s, height 0.3s, opacity 0.3s;
}
body.hovered #ds-cursor { width: 8px; height: 8px; background: #39ff14; }
body.hovered #ds-cursor-ring { width: 56px; height: 56px; border-color: rgba(57,255,20,0.5); }

#scroll-prog { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 1001; background: transparent; }
#scroll-prog-bar { height: 100%; background: linear-gradient(90deg, #141a46, #39ff14, #fff); width: 0%; transition: width 0.1s; }

#ds-loader {
  position: fixed; inset: 0; background: #060810; z-index: 99997;
  display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 20px;
  transition: opacity 0.7s, visibility 0.7s;
}
#ds-loader.hidden { opacity: 0; visibility: hidden; }
.ld-word {
  font-family: 'Syne', sans-serif;
  font-size: clamp(32px, 6vw, 64px);
  font-weight: 800; letter-spacing: 10px; color: #fff; overflow: hidden;
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
  border: 1.5px solid #141a46; position: relative; overflow: hidden;
}
.ld-orb::before {
  content: ''; position: absolute; inset: -20px; border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0%, #141a46 30%, transparent 60%);
  animation: orbSpin 1.2s linear infinite;
}
.ld-orb::after { content: ''; position: absolute; inset: 3px; border-radius: 50%; background: #060810; }
@keyframes orbSpin { to { transform: rotate(360deg); } }
.ld-pct { font-family: 'Poppins', sans-serif; font-size: 11px; letter-spacing: 4px; color: rgba(255,255,255,0.3); font-weight: 300; }

.ds-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 52px; height: 70px;
  background: rgba(6,8,16,0.85); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.4s;
}
.ds-logo {
  font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800;
  letter-spacing: 5px; display: flex; align-items: center; gap: 10px; cursor: none;
}
.logo-orb {
  width: 24px; height: 24px; border-radius: 50%;
  background: linear-gradient(135deg, #141a46, #39ff14);
  box-shadow: 0 0 18px rgba(57,255,20,0.4);
  animation: orbPulse 3s ease-in-out infinite; flex-shrink: 0;
}
@keyframes orbPulse {
  0%,100%{box-shadow:0 0 18px rgba(57,255,20,0.3)}
  50%{box-shadow:0 0 30px rgba(57,255,20,0.6)}
}
.ds-nav-links { display: flex; align-items: center; gap: 32px; }
.ds-nav-links button {
  font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
  color: rgba(255,255,255,0.5); background: none; border: none;
  cursor: none; font-family: 'DM Sans', sans-serif; font-weight: 500;
  transition: color 0.2s; padding: 4px 0;
}
.ds-nav-links button:hover, .ds-nav-links button.active { color: #fff; }
.nav-cta-btn {
  border: 1px solid #39ff14 !important; color: #39ff14 !important;
  padding: 7px 18px !important; border-radius: 100px !important;
  transition: background 0.2s, color 0.2s !important;
}
.nav-cta-btn:hover { background: #39ff14 !important; color: #060810 !important; }
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
  font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700;
  letter-spacing: 3px; color: #fff; background: none; border: none; cursor: none; text-align: left;
}

.page-enter { animation: pageIn 0.5s cubic-bezier(0.23,1,0.32,1) both; }
@keyframes pageIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

.reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.8s cubic-bezier(0.23,1,0.32,1), transform 0.8s cubic-bezier(0.23,1,0.32,1); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.rd1{transition-delay:0.1s}.rd2{transition-delay:0.2s}.rd3{transition-delay:0.3s}.rd4{transition-delay:0.4s}

.btn-primary {
  display: inline-flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, #141a46, #0a0f2e);
  color: #39ff14; padding: 12px 26px; border-radius: 100px;
  font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;
  cursor: none; transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #39ff14; box-shadow: 0 4px 24px rgba(57,255,20,0.2);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(57,255,20,0.35); }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 10px;
  border: 1px solid rgba(255,255,255,0.12); color: #fff;
  padding: 12px 26px; border-radius: 100px;
  font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 400;
  cursor: none; transition: border-color 0.2s, background 0.2s; background: transparent;
}
.btn-ghost:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }

.sec-label {
  font-size: 10px; letter-spacing: 5px; text-transform: uppercase;
  color: #39ff14; margin-bottom: 12px; display: flex; align-items: center; gap: 10px;
}
.sec-label::before { content:''; display:inline-block; width:20px; height:1px; background:#39ff14; }
.sec-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 800; letter-spacing: -0.5px; line-height: 1.05; color: #fff;
}

.mq-strip {
  padding: 13px 0;
  border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(20,26,70,0.3); overflow: hidden; white-space: nowrap;
}
.mq-track { display: inline-flex; align-items: center; animation: mqAnim 32s linear infinite; }
.mq-strip:hover .mq-track { animation-play-state: paused; }
.mq-item { font-family: 'Poppins', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.35); padding: 0 20px; }
.mq-dot { width: 3px; height: 3px; border-radius: 50%; background: #39ff14; flex-shrink: 0; }
@keyframes mqAnim { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

.ds-footer { padding: 72px 52px 36px; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(20,26,70,0.15); }
.ft-top { display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; margin-bottom: 48px; }
.ft-tagline { font-family: 'Poppins', sans-serif; font-size: 13px; line-height: 1.75; color: rgba(255,255,255,0.4); margin-top: 14px; max-width: 260px; font-weight: 300; }
.ft-links-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 40px; }
.ft-col h4 { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #39ff14; margin-bottom: 16px; font-family: 'Syne', sans-serif; }
.ft-col ul { display: flex; flex-direction: column; gap: 10px; }
.ft-col ul li { font-family: 'Poppins', sans-serif; font-size: 13px; color: rgba(255,255,255,0.4); cursor: none; transition: color 0.2s; font-weight: 300; }
.ft-col ul li:hover { color: #fff; }
.ft-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); }
.ft-copy { font-family: 'Poppins', sans-serif; font-size: 12px; color: rgba(255,255,255,0.2); }
.social-row { display: flex; gap: 12px; }
.soc-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 12px; color: rgba(255,255,255,0.4); cursor: none; transition: border-color 0.2s, color 0.2s; background: none; }
.soc-btn:hover { border-color: #39ff14; color: #39ff14; }

/* HERO */
.hero-section {
  min-height: 100vh; padding: 110px 52px 72px;
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
    radial-gradient(ellipse 55% 65% at 68% 48%, rgba(20,26,70,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 45% 45% at 22% 72%, rgba(20,26,70,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 35% 35% at 82% 18%, rgba(57,255,20,0.04) 0%, transparent 50%);
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
  width: min(600px, 70vw); height: min(600px, 70vw);
  z-index: 1; pointer-events: none;
}
.globe-wrap canvas { display: block; width: 100% !important; height: 100% !important; }
.fpills { position: absolute; inset: 0; pointer-events: none; }
.fpill {
  position: absolute; font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
  color: rgba(255,255,255,0.4); border: 1px solid rgba(57,255,20,0.15);
  padding: 5px 13px; border-radius: 100px;
  background: rgba(20,26,70,0.5); backdrop-filter: blur(12px);
  animation: fpFloat 7s ease-in-out infinite; white-space: nowrap;
}
.fpill:nth-child(1){top:22%;right:8%;animation-delay:0s}
.fpill:nth-child(2){top:42%;right:4%;animation-delay:2s}
.fpill:nth-child(3){top:62%;right:10%;animation-delay:4s}
.fpill:nth-child(4){top:32%;right:22%;animation-delay:1s}
@keyframes fpFloat { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-14px) rotate(1deg)} }
.hero-content { position: relative; z-index: 2; max-width: 60%; }
.hero-eyebrow {
  font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #39ff14;
  font-weight: 500; margin-bottom: 24px; display: flex; align-items: center; gap: 10px;
}
.eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #39ff14; animation: orbPulse 2s ease-in-out infinite; }
.hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(40px, 6.5vw, 96px);
  line-height: 0.95; font-weight: 800; letter-spacing: -1.5px;
}
.tl { display: block; overflow: hidden; }
.tl span { display: inline-block; animation: tlIn 1.1s cubic-bezier(0.23,1,0.32,1) both; }
.tl:nth-child(1) span{animation-delay:0.3s}
.tl:nth-child(2) span{animation-delay:0.45s}
.tl:nth-child(3) span{animation-delay:0.6s}
@keyframes tlIn { from{transform:translateY(110%)} to{transform:translateY(0)} }
.t-outline { -webkit-text-stroke: 2px #fff; color: transparent; }
.t-accent { background: linear-gradient(90deg, #141a46, #39ff14); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-bottom { display: flex; align-items: flex-end; justify-content: space-between; position: relative; z-index: 2; gap: 40px; flex-wrap: wrap; padding-top: 44px; }
.hero-desc { font-family: 'Poppins', sans-serif; max-width: 400px; font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.5); font-weight: 300; }
.hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-top: 22px; }
.hero-stats { display: flex; gap: 40px; }
.stat-n { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: #fff; line-height: 1; }
.stat-n span { color: #39ff14; }
.stat-l { font-family: 'Poppins', sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 5px; }
.scroll-ind { position: absolute; bottom: 28px; left: 52px; display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.25); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; z-index: 2; }
.scroll-ln { width: 32px; height: 1px; background: rgba(255,255,255,0.15); overflow: hidden; position: relative; }
.scroll-ln::after { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:#39ff14; animation: sln 2s ease-in-out infinite; }
@keyframes sln { to { left: 100%; } }

.counter-strip { padding: 48px 52px; background: rgba(20,26,70,0.2); border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); display: grid; grid-template-columns: repeat(4,1fr); gap: 32px; text-align: center; }
.counter-n { font-family: 'Syne', sans-serif; font-size: clamp(28px, 3.5vw, 48px); font-weight: 700; color: #fff; letter-spacing: 1px; }
.counter-n span { color: #39ff14; }
.counter-l { font-family: 'Poppins', sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 6px; }

.sv-grid { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
.sv-card {
  padding: 32px 28px; border-right: 1px solid rgba(255,255,255,0.07); border-bottom: 1px solid rgba(255,255,255,0.07);
  cursor: none; position: relative; overflow: hidden; transition: background 0.4s cubic-bezier(0.23,1,0.32,1);
}
.sv-card:nth-child(3n){ border-right: none; }
.sv-card:nth-child(4),.sv-card:nth-child(5),.sv-card:nth-child(6){ border-bottom: none; }
.sv-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg, rgba(20,26,70,0.3) 0%, transparent 60%); opacity:0; transition:opacity 0.3s; }
.sv-card:hover::before { opacity:1; }
.sv-card:hover { background: rgba(20,26,70,0.4); }
.sv-card:hover .sv-arrow { transform: translate(4px,-4px); color: #39ff14; }
.sv-num { font-family: 'Syne', sans-serif; font-size: 10px; letter-spacing: 3px; color: rgba(255,255,255,0.2); margin-bottom: 14px; font-weight: 600; }
.sv-icon { font-size: 24px; margin-bottom: 12px; }
.sv-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; color: #fff; font-family: 'Syne', sans-serif; }
.sv-desc { font-family: 'Poppins', sans-serif; font-size: 12px; line-height: 1.72; color: rgba(255,255,255,0.45); font-weight: 300; }
.sv-arrow { position: absolute; top: 24px; right: 24px; font-size: 16px; color: rgba(255,255,255,0.2); transition: transform 0.3s, color 0.3s; }
.sv-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 12px; }
.sv-tag { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 8px; border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; color: rgba(255,255,255,0.3); }

.pf-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.pf-item { position: relative; overflow: hidden; border-radius: 12px; cursor: none; background: rgba(13,17,32,0.9); border: 1px solid rgba(255,255,255,0.07); }
.mock-img { width: 100%; transition: transform 0.6s cubic-bezier(0.23,1,0.32,1); }
.pf-item:hover .mock-img { transform: scale(1.04); }
.pf-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px 22px; background: linear-gradient(to top, rgba(6,8,16,0.95) 0%, transparent 100%); }
.pf-tag { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #39ff14; margin-bottom: 4px; }
.pf-name { font-size: 17px; font-weight: 700; color: #fff; font-family: 'Syne', sans-serif; }
.pf-meta { font-family: 'Poppins', sans-serif; font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 3px; }
.ftabs { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 28px; }
.ftab { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.45); cursor: none; background: transparent; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
.ftab.active,.ftab:hover { background: #141a46; color: #39ff14; border-color: #39ff14; }

.proc-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
.proc-body { font-family: 'Poppins', sans-serif; font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.45); margin: 18px 0 28px; font-weight: 300; }
.step-item { display: flex; gap: 20px; padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,0.07); cursor: none; transition: padding-left 0.3s; }
.step-item:first-child { border-top: 1px solid rgba(255,255,255,0.07); }
.step-item:hover { padding-left: 12px; }
.step-item:hover .step-num { color: #39ff14; }
.step-num { font-family: 'Syne', sans-serif; font-size: 10px; letter-spacing: 3px; color: rgba(255,255,255,0.2); padding-top: 4px; flex-shrink: 0; font-weight: 700; }
.step-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; color: #fff; font-family: 'Syne', sans-serif; }
.step-desc { font-family: 'Poppins', sans-serif; font-size: 12px; line-height: 1.72; color: rgba(255,255,255,0.45); font-weight: 300; }

.testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 40px; }
.testi-card { background: rgba(20,26,70,0.25); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 32px 26px; position: relative; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; }
.testi-card:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
.testi-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, #141a46, #39ff14, #fff); opacity:0; transition:opacity 0.3s; }
.testi-card:hover::before { opacity:1; }
.testi-q { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; color: rgba(255,255,255,0.08); line-height: 0.7; margin-bottom: 14px; }
.testi-text { font-family: 'Poppins', sans-serif; font-size: 13px; line-height: 1.72; color: rgba(255,255,255,0.5); font-weight: 300; margin-bottom: 24px; }
.testi-author { display: flex; align-items: center; gap: 12px; }
.t-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.av-a{background:linear-gradient(135deg,#141a46,#39ff14);color:#060810}
.av-b{background:linear-gradient(135deg,#0a0f2e,#141a46);color:#39ff14}
.av-c{background:linear-gradient(135deg,#39ff14,#a0ff80);color:#141a46}
.t-name { font-size: 12px; font-weight: 700; color: #fff; font-family: 'Syne', sans-serif; }
.t-role { font-family: 'Poppins', sans-serif; font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.stars { color: #39ff14; font-size: 10px; margin-bottom: 8px; letter-spacing: 2px; }

.cta-section { padding: 110px 52px; text-align: center; position: relative; overflow: hidden; }
.cta-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 65% 65% at 50% 50%, rgba(20,26,70,0.2) 0%, transparent 70%); pointer-events: none; }
.cta-lbl { font-family: 'Poppins', sans-serif; font-size: 10px; letter-spacing: 5px; text-transform: uppercase; color: #39ff14; margin-bottom: 20px; }
.cta-title { font-family: 'Syne', sans-serif; font-size: clamp(40px, 7vw, 100px); font-weight: 800; letter-spacing: -1.5px; line-height: 0.95; color: #fff; margin-bottom: 40px; }
.cta-title span { -webkit-text-stroke: 2px #fff; color: transparent; }

.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; margin-bottom: 80px; }
.about-img-wrap { position: relative; }
.about-img-box { width: 100%; aspect-ratio: 4/5; border-radius: 16px; background: linear-gradient(135deg, rgba(20,26,70,0.8), rgba(57,255,20,0.08)); border: 1px solid rgba(255,255,255,0.08); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.about-float-stat { position: absolute; padding: 14px 20px; background: rgba(6,8,16,0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; backdrop-filter: blur(12px); }
.about-float-stat.top-right { top: 24px; right: -20px; }
.about-float-stat.bottom-left { bottom: 40px; left: -24px; }
.afs-n { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #fff; }
.afs-n span { color: #39ff14; }
.afs-l { font-family: 'Poppins', sans-serif; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-top: 3px; }
.team-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; margin-top: 40px; }
.team-card { background: rgba(20,26,70,0.2); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 26px 20px; text-align: center; transition: transform 0.3s, background 0.3s; cursor: none; }
.team-card:hover { transform: translateY(-5px); background: rgba(20,26,70,0.4); }
.team-avatar { width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; }
.team-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #fff; }
.team-role { font-family: 'Poppins', sans-serif; font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 4px; letter-spacing: 1px; }
.values-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.val-card { padding: 28px 24px; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; background: rgba(20,26,70,0.15); transition: border-color 0.3s; }
.val-card:hover { border-color: rgba(57,255,20,0.3); }
.val-icon { font-size: 22px; margin-bottom: 12px; }
.val-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 7px; }
.val-desc { font-family: 'Poppins', sans-serif; font-size: 12px; line-height: 1.72; color: rgba(255,255,255,0.45); font-weight: 300; }

.contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 72px; align-items: start; }
.contact-info { position: sticky; top: 100px; }
.c-info-item { display: flex; gap: 14px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
.c-info-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(20,26,70,0.5); border: 1px solid rgba(57,255,20,0.2); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
.c-info-label { font-family: 'Poppins', sans-serif; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 3px; }
.c-info-val { font-family: 'Poppins', sans-serif; font-size: 13px; color: #fff; font-weight: 400; }
.contact-form-wrap { background: rgba(20,26,70,0.2); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 40px 36px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-family: 'Poppins', sans-serif; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 7px; }
.form-group input, .form-group select, .form-group textarea {
  width: 100%; background: rgba(6,8,16,0.6); border: 1px solid rgba(255,255,255,0.1);
  color: #fff; border-radius: 10px; padding: 11px 14px; font-size: 13px;
  font-family: 'Poppins', sans-serif; outline: none; transition: border-color 0.2s;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #39ff14; }
.form-group input::placeholder, .form-group textarea::placeholder { color: rgba(255,255,255,0.2); }
.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
}
.form-group select option { background: #0d1120; color: #fff; }
.form-group textarea { resize: vertical; min-height: 120px; }
.form-success { text-align: center; padding: 40px 0; }
.form-success-icon { font-size: 44px; margin-bottom: 14px; }
.form-success h3 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.form-success p { font-family: 'Poppins', sans-serif; font-size: 13px; color: rgba(255,255,255,0.45); }

/* AI CHAT */
.ai-btn {
  position: fixed; bottom: 28px; right: 28px; z-index: 900;
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, #141a46, #0a0f2e);
  color: #39ff14; border: 1px solid #39ff14; cursor: none; font-size: 17px;
  box-shadow: 0 4px 22px rgba(57,255,20,0.25);
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.3s, box-shadow 0.3s;
}
.ai-btn:hover { transform: scale(1.1); box-shadow: 0 8px 36px rgba(57,255,20,0.4); }
.ai-btn-badge {
  position: absolute; top: -3px; right: -3px;
  width: 13px; height: 13px; border-radius: 50%;
  background: #22c55e; border: 2px solid #060810;
  animation: badgePulse 2s infinite;
}
@keyframes badgePulse {
  0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)}
  50%{box-shadow:0 0 0 6px rgba(34,197,94,0)}
}
.ai-popup {
  position: fixed; bottom: 88px; right: 28px; z-index: 900;
  width: 340px; background: rgba(8,10,22,0.98);
  border: 1px solid rgba(57,255,20,0.2); border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(57,255,20,0.08);
  transform: scale(0.85) translateY(20px); transform-origin: bottom right;
  opacity: 0; pointer-events: none;
  transition: transform 0.35s cubic-bezier(0.23,1,0.32,1), opacity 0.35s;
  display: flex; flex-direction: column; max-height: 520px;
  overflow: hidden;
}
.ai-popup.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
.ai-header {
  padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex; align-items: center; gap: 9px; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(20,26,70,0.6), rgba(57,255,20,0.05));
}
.ai-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #141a46, #0a0f2e);
  border: 1px solid #39ff14;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0; position: relative; color: #39ff14;
}
.ai-avatar-dot {
  position: absolute; bottom: 1px; right: 1px;
  width: 8px; height: 8px; border-radius: 50%;
  background: #22c55e; border: 1.5px solid #080a16;
}
.ai-header-info { flex: 1; }
.ai-header-name { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #fff; }
.ai-header-status { font-family: 'Poppins', sans-serif; font-size: 9px; color: #39ff14; letter-spacing: 0.5px; margin-top: 1px; display: flex; align-items: center; gap: 4px; }
.ai-status-dot { width: 5px; height: 5px; border-radius: 50%; background: #39ff14; animation: badgePulse 2s infinite; }
.ai-close { background: none; border: none; color: rgba(255,255,255,0.3); cursor: none; font-size: 16px; padding: 2px; transition: color 0.2s; line-height: 1; }
.ai-close:hover { color: #fff; }
.ai-quick-chips {
  padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex; gap: 5px; flex-wrap: wrap; flex-shrink: 0;
  background: rgba(20,26,70,0.15);
}
.ai-chip {
  font-family: 'Poppins', sans-serif; font-size: 9px; letter-spacing: 0.5px; padding: 4px 9px;
  border: 1px solid rgba(57,255,20,0.25); border-radius: 100px;
  color: rgba(57,255,20,0.7); background: rgba(57,255,20,0.05);
  cursor: none; transition: all 0.2s; white-space: nowrap;
}
.ai-chip:hover { background: rgba(57,255,20,0.15); color: #39ff14; border-color: #39ff14; }
.ai-msgs {
  flex: 1; overflow-y: auto; padding: 14px 12px;
  display: flex; flex-direction: column; gap: 9px;
  scrollbar-width: thin; scrollbar-color: rgba(57,255,20,0.2) transparent;
}
.ai-msgs::-webkit-scrollbar { width: 3px; }
.ai-msgs::-webkit-scrollbar-thumb { background: rgba(57,255,20,0.2); border-radius: 3px; }
.ai-msg-wrap { display: flex; gap: 7px; align-items: flex-end; }
.ai-msg-wrap.user { flex-direction: row-reverse; }
.ai-msg-avatar {
  width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #141a46, #0a0f2e);
  border: 1px solid #39ff14;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; color: #39ff14; margin-bottom: 2px;
}
.ai-msg {
  font-family: 'Poppins', sans-serif; font-size: 12px; line-height: 1.6; padding: 9px 12px;
  border-radius: 13px; max-width: 82%; word-break: break-word;
}
.ai-msg.bot {
  background: rgba(20,26,70,0.6); color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 13px 13px 13px 3px;
}
.ai-msg.user {
  background: linear-gradient(135deg, #141a46, #0a0f2e);
  color: #fff; border: 1px solid rgba(57,255,20,0.2); border-radius: 13px 13px 3px 13px;
}
.ai-msg-time { font-family: 'Poppins', sans-serif; font-size: 9px; color: rgba(255,255,255,0.2); margin-top: 3px; text-align: right; }
.ai-typing {
  display: flex; align-items: center; gap: 4px;
  padding: 9px 12px; background: rgba(20,26,70,0.6);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 13px 13px 13px 3px; width: fit-content;
}
.ai-typing span {
  width: 4px; height: 4px; border-radius: 50%; background: #39ff14;
  animation: typingDot 1.2s ease-in-out infinite;
}
.ai-typing span:nth-child(2){animation-delay:0.2s}
.ai-typing span:nth-child(3){animation-delay:0.4s}
@keyframes typingDot {
  0%,60%,100%{transform:translateY(0);opacity:0.4}
  30%{transform:translateY(-4px);opacity:1}
}
.ai-footer {
  padding: 10px 12px; border-top: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0; background: rgba(8,10,22,0.5);
}
.ai-irow { display: flex; gap: 7px; align-items: flex-end; }
.ai-in {
  flex: 1; background: rgba(20,26,70,0.5);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff; border-radius: 9px; padding: 9px 12px;
  font-size: 12px; font-family: 'Poppins', sans-serif; outline: none;
  resize: none; min-height: 36px; max-height: 80px;
  transition: border-color 0.2s; line-height: 1.4;
  scrollbar-width: none;
}
.ai-in:focus { border-color: rgba(57,255,20,0.4); }
.ai-in::placeholder { color: rgba(255,255,255,0.2); }
.ai-send {
  width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(135deg, #141a46, #0a0f2e);
  border: 1px solid #39ff14; cursor: none; color: #39ff14; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.2s, opacity 0.2s;
}
.ai-send:hover:not(:disabled) { transform: scale(1.08); }
.ai-send:disabled { opacity: 0.5; }
.ai-powered { font-family: 'Poppins', sans-serif; font-size: 9px; color: rgba(255,255,255,0.15); text-align: center; margin-top: 7px; letter-spacing: 0.5px; }

.clients-track { display: inline-flex; gap: 64px; animation: mqAnim2 28s linear infinite; align-items: center; white-space: nowrap; }
@keyframes mqAnim2 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.cl-logo { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 3px; color: rgba(255,255,255,0.18); white-space: nowrap; transition: color 0.3s; cursor: none; }
.cl-logo:hover { color: rgba(255,255,255,0.4); }

.section { padding: 96px 52px; }
.section-sm { padding: 64px 52px; }

.svc-list { display: grid; gap: 20px; }
.svc-row {
  display: grid; gap: 36px; padding: 32px 36px;
  border: 1px solid rgba(255,255,255,0.07); border-radius: 16px;
  background: rgba(20,26,70,0.1); align-items: center;
  transition: background 0.3s, border-color 0.3s;
  grid-template-columns: 1fr 2.5fr auto;
}
.svc-row:hover { background: rgba(20,26,70,0.35); border-color: rgba(57,255,20,0.25); }
.svc-metric-n { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #39ff14; }
.svc-metric-l { font-family: 'Poppins', sans-serif; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 4px; }

/* FAQ */
.faq-list { display: grid; gap: 12px; }
.faq-item { border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; overflow: hidden; background: rgba(20,26,70,0.12); transition: border-color 0.3s; }
.faq-item.open { border-color: rgba(57,255,20,0.25); }
.faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; background: none; border: none; color: #fff; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; cursor: none; text-align: left; gap: 16px; }
.faq-icon { font-size: 18px; color: #39ff14; flex-shrink: 0; transition: transform 0.3s; }
.faq-item.open .faq-icon { transform: rotate(45deg); }
.faq-a { font-family: 'Poppins', sans-serif; font-size: 13px; line-height: 1.78; color: rgba(255,255,255,0.5); padding: 0 22px 20px; font-weight: 300; }

/* WHY US */
.why-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
.why-card { padding: 26px 22px; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; background: rgba(20,26,70,0.15); text-align: center; transition: border-color 0.3s, transform 0.3s; }
.why-card:hover { border-color: rgba(57,255,20,0.35); transform: translateY(-4px); }
.why-num { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: #39ff14; line-height: 1; }
.why-label { font-family: 'Poppins', sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 5px; }
.why-desc { font-family: 'Poppins', sans-serif; font-size: 12px; line-height: 1.7; color: rgba(255,255,255,0.45); margin-top: 10px; font-weight: 300; }

/* MAP HERO */
.map-hero {
  position: relative; width: 100%; height: 580px; overflow: hidden;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.map-hero iframe {
  position: absolute; inset: 0; width: 100%; height: 100%; border: none;
  filter: invert(88%) hue-rotate(198deg) saturate(0.65) brightness(0.8);
}
.map-hero::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to right, rgba(6,8,16,0.82) 0%, rgba(6,8,16,0.22) 52%, transparent 100%);
}
.map-panel {
  position: absolute; top: 50%; left: 52px; transform: translateY(-50%);
  z-index: 2; width: min(400px, calc(100% - 80px));
  background: rgba(6,8,16,0.92); border: 1px solid rgba(57,255,20,0.25);
  border-radius: 20px; padding: 32px 36px;
  backdrop-filter: blur(24px); box-shadow: 0 24px 80px rgba(0,0,0,0.6);
}
.map-panel-eyebrow { font-family: 'Poppins', sans-serif; font-size: 9px; letter-spacing: 4px; text-transform: uppercase; color: #39ff14; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
.map-panel-eyebrow::before { content:''; display:inline-block; width:16px; height:1px; background:#39ff14; }
.map-panel-title { font-family: 'Syne', sans-serif; font-size: clamp(18px, 2vw, 26px); font-weight: 800; color: #fff; line-height: 1.12; margin-bottom: 8px; }
.map-panel-title span { color: #39ff14; }
.map-panel-sub { font-family: 'Poppins', sans-serif; font-size: 12px; line-height: 1.7; color: rgba(255,255,255,0.4); font-weight: 300; margin-bottom: 20px; }
.map-info-rows { display: flex; flex-direction: column; margin-bottom: 20px; }
.map-info-row { display: flex; align-items: flex-start; gap: 11px; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
.map-info-row:first-child { border-top: 1px solid rgba(255,255,255,0.07); }
.map-info-icon { width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0; background: rgba(20,26,70,0.6); border: 1px solid rgba(57,255,20,0.2); display: flex; align-items: center; justify-content: center; font-size: 11px; }
.map-info-label { font-family: 'Poppins', sans-serif; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 1px; }
.map-info-val { font-family: 'Poppins', sans-serif; font-size: 12px; color: #fff; font-weight: 400; line-height: 1.4; }
.map-directions-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 10px 18px; border-radius: 100px; background: linear-gradient(135deg, #141a46, #0a0f2e); border: 1px solid #39ff14; color: #39ff14; font-family: 'Poppins', sans-serif; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 500; cursor: pointer; text-decoration: none; box-shadow: 0 4px 20px rgba(57,255,20,0.2); transition: transform 0.2s, box-shadow 0.2s; }
.map-directions-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(57,255,20,0.3); }
.map-pin-badge { position: absolute; bottom: 20px; right: 20px; z-index: 3; background: rgba(6,8,16,0.92); border: 1px solid rgba(57,255,20,0.2); border-radius: 100px; padding: 6px 14px; backdrop-filter: blur(12px); display: flex; align-items: center; gap: 7px; font-family: 'Poppins', sans-serif; font-size: 10px; color: rgba(255,255,255,0.55); }
.map-pin-dot { width: 7px; height: 7px; border-radius: 50%; background: #39ff14; animation: orbPulse 2s infinite; flex-shrink: 0; }

@media(max-width:768px){
  .map-hero { height: auto; display: flex; flex-direction: column; }
  .map-hero iframe { position: relative; height: 260px; flex-shrink: 0; }
  .map-hero::after { display: none; }
  .map-panel { position: relative; top: auto; left: auto; transform: none; width: 100%; border-radius: 0; border-left: none; border-right: none; border-bottom: none; padding: 24px 20px; }
  .map-pin-badge { display: none; }
}

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
  .why-grid{grid-template-columns:repeat(2,1fr)}
  .hero-content{max-width:80%}
}
@media(max-width:768px){
  .ds-nav{padding:0 20px}
  .ds-nav-links{display:none}
  .hamburger{display:flex}
  .section,.section-sm{padding:64px 20px}
  .hero-section{padding:96px 20px 56px}
  .counter-strip{padding:36px 20px}
  .cta-section{padding:80px 20px}
  .ds-footer{padding:48px 20px 24px}
  .sv-grid{grid-template-columns:1fr}
  .sv-card{border-right:none!important}
  .pf-grid{grid-template-columns:1fr}
  .testi-grid{grid-template-columns:1fr}
  .counter-strip{grid-template-columns:repeat(2,1fr)}
  .ft-top{grid-template-columns:1fr}
  .ft-links-grid{grid-template-columns:1fr 1fr}
  .hero-stats{flex-direction:column;gap:18px}
  .globe-wrap{opacity:0.25;right:-12%;width:min(400px,100vw);height:min(400px,100vw)}
  .ai-btn,.ai-popup{display:none}
  #ds-cursor,#ds-cursor-ring{display:none}
  .about-float-stat{display:none}
  .form-row{grid-template-columns:1fr}
  .contact-form-wrap{padding:24px 20px}
  .team-grid{grid-template-columns:repeat(2,1fr)}
  .values-grid{grid-template-columns:1fr}
  .svc-row{grid-template-columns:1fr;padding:22px 18px}
  .scroll-ind{left:20px}
  .why-grid{grid-template-columns:1fr 1fr}
  .hero-content{max-width:100%}
  .hero-title{font-size:clamp(32px,9vw,56px)}
}
`;

// ── GLOBE FIX: use ResizeObserver + delayed initial resize so canvas is sized
// correctly on the very first render (before the wrapper has painted).
function useHeroGlobe(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hCtx = canvas.getContext("2d");
    let animId;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const wrap = canvas.parentElement;
      if (!wrap) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return; // guard against 0-size on first paint
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    // Initial size — try immediately, then again after a frame to handle
    // cases where the wrapper hasn't laid out yet on first mount.
    resize();
    const rafId = requestAnimationFrame(() => { resize(); });

    // Also watch for any future size changes (page resize, etc.)
    const ro = new ResizeObserver(() => resize());
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener("resize", resize);

    const pts = [];
    for (let i = 0; i < 280; i++) {
      pts.push({ phi: Math.acos(2 * Math.random() - 1), theta: Math.random() * 2 * Math.PI, size: Math.random() * 2.2 + 0.4, alpha: Math.random() * 0.7 + 0.3 });
    }
    const arcs = [];
    for (let i = 0; i < 16; i++) {
      arcs.push({ a: pts[Math.floor(Math.random() * pts.length)], b: pts[Math.floor(Math.random() * pts.length)], progress: Math.random(), speed: 0.003 + Math.random() * 0.004, alpha: Math.random() * 0.4 + 0.2 });
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
      const W = canvas.width / dpr, H = canvas.height / dpr;
      // If canvas still has no size, skip this frame
      if (W === 0 || H === 0) { rot += 0.0015; animId = requestAnimationFrame(draw); return; }
      hCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hCtx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.44;
      const atmo = hCtx.createRadialGradient(cx, cy, r * 0.75, cx, cy, r * 1.15);
      atmo.addColorStop(0, "rgba(20,26,70,0.08)"); atmo.addColorStop(0.6, "rgba(20,26,70,0.07)"); atmo.addColorStop(1, "transparent");
      hCtx.beginPath(); hCtx.arc(cx, cy, r * 1.15, 0, Math.PI * 2); hCtx.fillStyle = atmo; hCtx.fill();
      const base = hCtx.createRadialGradient(cx - r * 0.28, cy - r * 0.28, r * 0.05, cx, cy, r);
      base.addColorStop(0, "rgba(20,26,70,0.9)"); base.addColorStop(0.5, "rgba(10,14,30,0.75)"); base.addColorStop(1, "rgba(6,8,16,0.85)");
      hCtx.beginPath(); hCtx.arc(cx, cy, r, 0, Math.PI * 2); hCtx.fillStyle = base; hCtx.fill();
      hCtx.save(); hCtx.beginPath(); hCtx.arc(cx, cy, r, 0, Math.PI * 2); hCtx.clip();
      for (let lat = -75; lat <= 75; lat += 15) {
        const phi2 = (90 - lat) * Math.PI / 180;
        hCtx.beginPath(); hCtx.ellipse(cx, cy - r * Math.cos(phi2), r * Math.sin(phi2), r * Math.sin(phi2) * 0.2, 0, 0, Math.PI * 2);
        hCtx.strokeStyle = "rgba(20,26,70,0.4)"; hCtx.lineWidth = 0.7; hCtx.stroke();
      }
      for (let lon = 0; lon < 180; lon += 15) {
        const angle = lon * Math.PI / 180 + rot;
        hCtx.beginPath(); hCtx.ellipse(cx, cy, r * Math.abs(Math.cos(angle)), r, 0, 0, Math.PI * 2);
        hCtx.strokeStyle = "rgba(20,26,70,0.35)"; hCtx.lineWidth = 0.7; hCtx.stroke();
      }
      hCtx.restore();
      arcs.forEach((arc) => {
        arc.progress += arc.speed; if (arc.progress > 1) arc.progress = 0;
        const pA = proj(arc.a.phi, arc.a.theta, r, cx, cy); const pB = proj(arc.b.phi, arc.b.theta, r, cx, cy);
        if (!pA.visible || !pB.visible) return;
        if (Math.hypot(pB.sx - pA.sx, pB.sy - pA.sy) > r * 0.8) return;
        const midX = (pA.sx + pB.sx) / 2, midY = (pA.sy + pB.sy) / 2 - r * 0.1;
        const g = hCtx.createLinearGradient(pA.sx, pA.sy, pB.sx, pB.sy);
        g.addColorStop(0, "rgba(57,255,20,0)"); g.addColorStop(arc.progress * 0.8, `rgba(57,255,20,${arc.alpha * 0.6})`);
        g.addColorStop(arc.progress, `rgba(57,255,20,${arc.alpha})`); g.addColorStop(Math.min(arc.progress + 0.15, 1), "rgba(57,255,20,0)"); g.addColorStop(1, "rgba(57,255,20,0)");
        hCtx.beginPath(); hCtx.moveTo(pA.sx, pA.sy); hCtx.quadraticCurveTo(midX, midY, pB.sx, pB.sy);
        hCtx.strokeStyle = g; hCtx.lineWidth = 1; hCtx.stroke();
      });
      pts.forEach((pt) => {
        const p = proj(pt.phi, pt.theta, r, cx, cy); if (!p.visible) return;
        const df = (p.depth + 1) / 2;
        hCtx.beginPath(); hCtx.arc(p.sx, p.sy, pt.size * (0.5 + df * 0.5), 0, Math.PI * 2);
        hCtx.fillStyle = `rgba(57,255,20,${pt.alpha * df * 0.7})`; hCtx.fill();
        if (pt.alpha > 0.85 && df > 0.6) {
          hCtx.beginPath(); hCtx.arc(p.sx, p.sy, pt.size * 3, 0, Math.PI * 2);
          const pg = hCtx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, pt.size * 3);
          pg.addColorStop(0, `rgba(57,255,20,${pt.alpha * df * 0.2})`); pg.addColorStop(1, "transparent");
          hCtx.fillStyle = pg; hCtx.fill();
        }
      });
      const spec = hCtx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, 0, cx - r * 0.3, cy - r * 0.35, r * 0.55);
      spec.addColorStop(0, "rgba(255,255,255,0.1)"); spec.addColorStop(1, "transparent");
      hCtx.beginPath(); hCtx.arc(cx, cy, r, 0, Math.PI * 2); hCtx.fillStyle = spec; hCtx.fill();
      const rim = hCtx.createRadialGradient(cx, cy, r * 0.72, cx, cy, r);
      rim.addColorStop(0, "transparent"); rim.addColorStop(0.7, "rgba(20,26,70,0.04)"); rim.addColorStop(1, "rgba(57,255,20,0.08)");
      hCtx.beginPath(); hCtx.arc(cx, cy, r, 0, Math.PI * 2); hCtx.fillStyle = rim; hCtx.fill();
      rot += 0.0015; animId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animId);
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [canvasRef]);
}

function useCursor() {
  useEffect(() => {
    const dot = document.getElementById("ds-cursor"); const ring = document.getElementById("ds-cursor-ring");
    if (!dot || !ring) return;
    let rx = -200, ry = -200;
    const onMove = (e) => {
      dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px";
      rx += (e.clientX - rx) * 0.14; ry += (e.clientY - ry) * 0.14;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
    };
    document.addEventListener("mousemove", onMove);
    const t = setTimeout(() => {
      document.querySelectorAll("a,button,.sv-card,.pf-item,.testi-card,.step-item,.ftab,.team-card,.val-card,.cl-logo,.svc-row,.why-card,.faq-item").forEach((el) => {
        el.addEventListener("mouseenter", () => document.body.classList.add("hovered"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("hovered"));
      });
    }, 300);
    return () => { clearTimeout(t); document.removeEventListener("mousemove", onMove); document.body.classList.remove("hovered"); };
  }, []);
}

function useReveal(key = "") {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach((el) => { el.classList.remove("visible"); obs.observe(el); });
    return () => obs.disconnect();
  }, [key]);
}

function useScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById("scroll-prog-bar"); if (!bar) return;
    const onScroll = () => { const total = document.documentElement.scrollHeight - window.innerHeight; bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + "%"; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

const MQ_ITEMS = ["SEO Strategy","Paid Media","Social Media","Brand Identity","Content Marketing","Email Campaigns","Analytics","Growth Hacking","CRO","Influencer Marketing"];

function Marquee() {
  const doubled = [...MQ_ITEMS, ...MQ_ITEMS];
  return (
    <div className="mq-strip">
      <div className="mq-track">
        {doubled.map((it, i) => (
          <span key={i} style={{ display:"inline-flex", alignItems:"center" }}>
            <span className="mq-item">{it}</span><span className="mq-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Footer({ navigate }) {
  const year = new Date().getFullYear();
  return (
    <footer className="ds-footer">
      <div className="ft-top">
        <div>
          <div className="ds-logo" onClick={() => navigate("home")}><div className="logo-orb" />DSPHERY</div>
          <p className="ft-tagline">A performance-driven digital marketing agency helping ambitious brands grow faster, smarter, and sustainably.</p>
          <div className="social-row" style={{ marginTop:20 }}>
            {["𝕏","in","ig","▶"].map((s,i) => <button key={i} className="soc-btn" aria-label={`Social ${i+1}`}>{s}</button>)}
          </div>
        </div>
        <div className="ft-links-grid">
          <div className="ft-col"><h4>Services</h4><ul>{["SEO","Paid Media","Social Media","Content","Analytics"].map((s) => <li key={s} onClick={() => navigate("services")} style={{ cursor:"none" }}>{s}</li>)}</ul></div>
          <div className="ft-col"><h4>Company</h4><ul>{["About","Portfolio","Contact"].map((s) => <li key={s} onClick={() => navigate(s.toLowerCase())} style={{ cursor:"none" }}>{s}</li>)}</ul></div>
          <div className="ft-col"><h4>Contact</h4><ul><li>hello@dsphery.com</li><li>+91 98874 47780</li><li>Udaipur, Rajasthan</li></ul></div>
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
  useEffect(() => { document.body.style.overflow = mob ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [mob]);
  const pages = [{ id:"home",label:"Home" },{ id:"services",label:"Services" },{ id:"portfolio",label:"Work" },{ id:"about",label:"About" },{ id:"contact",label:"Contact" }];
  const handleNav = (id) => { navigate(id); setMob(false); };
  return (
    <>
      <nav className="ds-nav">
        <div className="ds-logo" onClick={() => handleNav("home")}><div className="logo-orb" />DSPHERY</div>
        <div className="ds-nav-links">
          {pages.map((p) => <button key={p.id} className={page === p.id ? "active" : ""} onClick={() => handleNav(p.id)}>{p.label}</button>)}
          <button className="nav-cta-btn" onClick={() => handleNav("contact")}>Start a Project</button>
        </div>
        <button className={`hamburger${mob ? " open" : ""}`} onClick={() => setMob(!mob)} aria-label="Toggle menu"><span /><span /><span /></button>
      </nav>
      <div className={`mobile-menu${mob ? " open" : ""}`}>
        {pages.map((p) => <button key={p.id} onClick={() => handleNav(p.id)}>{p.label}</button>)}
      </div>
    </>
  );
}

const DSPHERY_SYSTEM_PROMPT = `You are DSPHERY's expert digital marketing assistant. DSPHERY is a premium digital marketing agency based in Udaipur, Rajasthan, India. Contact: hello@dsphery.com, +91 98874 47780.

DSPHERY's services:
1. SEO - Technical SEO, on-page, link building. Average: 420% organic growth.
2. Paid Media & PPC - Google Ads, Meta, TikTok, LinkedIn. Average ROAS: 4.2×.
3. Brand Strategy - Brand identity, positioning, voice, visual systems.
4. Social Media Management - Platform-native content, community building. Built 800K community in 12 months.
5. Content Marketing - Blog, video scripts, email, podcast.
6. Graphic Designing & Editing - Social media creatives, brand visuals, ad creative design.

Key stats: 120+ clients served, ₹8Cr+ revenue generated, 94% client retention, Est. 2026, Udaipur.

Pricing: Retainers start at ₹30,000/month for single-channel, ₹75,000/month for full-service. One-time projects also available.

Process: Market Research & Digital Audit → Strategy & Campaign Planning → Launch, Test & Optimise → Analyse, Scale & Report.

Personality: Expert, confident, helpful, concise. Give actionable digital marketing advice. Keep responses under 120 words — be punchy and direct. When someone wants to start a project, encourage them to fill the contact form or book a call. Never be salesy — be genuinely helpful first.`;

const QUICK_CHIPS = ["How does SEO work?","What's a good ROAS?","Social media tips","Content strategy","Budget for ads?","Improve conversions"];

function getTime() { return new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }); }

function AIChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ bot:true, text:"Hey! 👋 I'm DSPHERY's AI marketing assistant. Ask me anything about SEO, paid ads, social media, content strategy, or how we can grow your brand.", time:getTime() }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef(null);

  useEffect(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight; }, [msgs, loading]);

  const sendMessage = useCallback(async (text) => {
    const txt = (text || input).trim();
    if (!txt || loading) return;
    setMsgs((m) => [...m, { bot:false, text:txt, time:getTime() }]);
    setInput("");
    setLoading(true);
    const history = msgs.map((m) => ({ role: m.bot ? "assistant" : "user", content: m.text }));
    history.push({ role:"user", content:txt });
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:DSPHERY_SYSTEM_PROMPT, messages:history }),
      });
      const data = await response.json();
      const replyText = data.content?.find((b) => b.type === "text")?.text || "Sorry, I couldn't process that. Please try again or email us at hello@dsphery.com.";
      setMsgs((m) => [...m, { bot:true, text:replyText, time:getTime() }]);
    } catch {
      setMsgs((m) => [...m, { bot:true, text:"I'm having trouble connecting right now. Please email us at hello@dsphery.com or call +91 98874 47780.", time:getTime() }]);
    } finally { setLoading(false); }
  }, [input, loading, msgs]);

  return (
    <>
      <button className="ai-btn" onClick={() => setOpen((o) => !o)} aria-label="Toggle chat" style={{ position:"relative" }}>
        <span>{open ? "✕" : "💬"}</span>
        {!open && <div className="ai-btn-badge" />}
      </button>
      <div className={`ai-popup${open ? " open" : ""}`}>
        <div className="ai-header">
          <div className="ai-avatar">✦<div className="ai-avatar-dot" /></div>
          <div className="ai-header-info">
            <div className="ai-header-name">DSPHERY Assistant</div>
            <div className="ai-header-status"><div className="ai-status-dot" />AI-powered · Always online</div>
          </div>
          <button className="ai-close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="ai-quick-chips">
          {QUICK_CHIPS.map((chip) => <button key={chip} className="ai-chip" onClick={() => sendMessage(chip)}>{chip}</button>)}
        </div>
        <div className="ai-msgs" ref={msgsRef}>
          {msgs.map((m,i) => (
            <div key={i} className={`ai-msg-wrap${m.bot ? "" : " user"}`}>
              {m.bot && <div className="ai-msg-avatar" style={{ fontSize:10 }}>✦</div>}
              <div><div className={`ai-msg ${m.bot ? "bot" : "user"}`}>{m.text}</div><div className="ai-msg-time">{m.time}</div></div>
            </div>
          ))}
          {loading && (
            <div className="ai-msg-wrap">
              <div className="ai-msg-avatar" style={{ fontSize:10 }}>✦</div>
              <div className="ai-typing"><span /><span /><span /></div>
            </div>
          )}
        </div>
        <div className="ai-footer">
          <div className="ai-irow">
            <textarea className="ai-in" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Ask about SEO, ads, social media…" rows={1} disabled={loading} />
            <button className="ai-send" onClick={() => sendMessage()} disabled={loading || !input.trim()} aria-label="Send">↑</button>
          </div>
          <div className="ai-powered">Powered by Claude AI · DSPHERY © {new Date().getFullYear()}</div>
        </div>
      </div>
    </>
  );
}

/* ── HOME ── */
function Home({ navigate }) {
  const globeRef = useRef(null);
  useHeroGlobe(globeRef);
  useReveal("home");
  useScrollProgress();

  return (
    <div className="page-enter">
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-noise" /><div className="hero-glow" /><div className="hero-grid" />
          <div className="fpills">
            <span className="fpill">✦ SEO &amp; Content</span>
            <span className="fpill">✦ Paid Ads</span>
            <span className="fpill">✦ Brand Strategy</span>
            <span className="fpill">✦ Data Analytics</span>
          </div>
        </div>
        <div className="globe-wrap"><canvas ref={globeRef} id="heroGlobe" /></div>
        <div className="hero-content">
          <div className="hero-eyebrow"><div className="eyebrow-dot" />Digital Marketing Agency — Est. 2026</div>
          <h1 className="hero-title">
            <span className="tl"><span>We Build</span></span>
            <span className="tl"><span className="t-outline">Brands That</span></span>
            <span className="tl"><span className="t-accent">Dominate</span></span>
          </h1>
        </div>
        <div className="hero-bottom">
          <div>
            <p className="hero-desc">DSPHERY is a performance-driven digital marketing agency based in Udaipur. We combine sharp strategy, creative execution, and rigorous data analysis to help ambitious businesses grow their online presence and revenue — measurably, sustainably, and at scale.</p>
            <div className="hero-ctas">
              <button className="btn-primary" onClick={() => navigate("contact")}>Start a Project <span>↗</span></button>
              <button className="btn-ghost" onClick={() => navigate("portfolio")}>View Our Work</button>
            </div>
          </div>
          <div className="hero-stats">
            <div><div className="stat-n">120<span>+</span></div><div className="stat-l">Clients Served</div></div>
            <div><div className="stat-n">₹8Cr<span>+</span></div><div className="stat-l">Revenue Generated</div></div>
            <div><div className="stat-n">94<span>%</span></div><div className="stat-l">Client Retention</div></div>
          </div>
        </div>
        <div className="scroll-ind"><div className="scroll-ln" /><span>Scroll</span></div>
      </section>

      <Marquee />

      <div className="counter-strip">
        {[["120+","Clients Served"],["₹8Cr+","Revenue Generated"],["94%","Client Retention"],["1+","Year in Business"]].map(([n,l],i) => (
          <div key={i} className={`reveal rd${i+1}`}><div className="counter-n">{n}</div><div className="counter-l">{l}</div></div>
        ))}
      </div>

      <section className="section" style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:44 }}>
          <div className="sec-label" style={{ justifyContent:"center" }}>Why Choose Us</div>
          <h2 className="sec-title">The DSPHERY Difference</h2>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,0.45)", maxWidth:560, margin:"14px auto 0", fontWeight:300 }}>
            We don't just run campaigns — we build growth engines. Here's what sets us apart from every other agency in the market.
          </p>
        </div>
        <div className="why-grid">
          {[
            ["2×","Average ROI","Our campaigns consistently deliver 2× return on every rupee spent within the first 6 months."],
            ["48h","Onboarding","From signed contract to live campaigns in under 48 hours. Speed without sacrificing quality."],
            ["100%","Transparent Reporting","Real-time dashboards. No fluff, no vanity metrics. Just clear data that connects to revenue."],
            ["24/7","Dedicated Support","Your growth never sleeps and neither does our support. A dedicated manager is always on call."],
          ].map(([n,l,d]) => (
            <div className="why-card reveal" key={l}>
              <div className="why-num">{n}</div>
              <div className="why-label">{l}</div>
              <div className="why-desc">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:44, flexWrap:"wrap", gap:20 }}>
          <div className="reveal">
            <div className="sec-label">What We Do</div>
            <h2 className="sec-title">Our Core Services</h2>
            <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,0.45)", maxWidth:380, marginTop:12, fontWeight:300 }}>
              Six deeply specialised disciplines working in sync to accelerate your brand's digital growth.
            </p>
          </div>
          <button className="btn-ghost reveal" onClick={() => navigate("services")} style={{ alignSelf:"flex-end" }}>View All Services →</button>
        </div>
        <div className="sv-grid reveal">
          {[
            ["01","🔍","Search Engine Optimization","Dominate organic search with our full-stack SEO approach — technical audits, on-page optimisation, content strategy, and authoritative link building. We've helped clients achieve 4× organic traffic growth within 8 months.",["On-Page","Technical","Link Building"]],
            ["02","🎯","Paid Media & PPC","Precision-targeted advertising across Google, Meta, LinkedIn, and TikTok. Our AI-optimised bidding strategies and creative testing frameworks consistently deliver a 4× ROAS for our clients.",["Google Ads","Meta","TikTok"]],
            ["03","💡","Brand Strategy","From logo and identity to brand voice and visual systems — we build brands people remember. Every touchpoint is crafted to reflect your positioning and connect with your target audience emotionally.",["Identity","Positioning","Voice"]],
            ["04","📱","Social Media Management","Platform-native content calendars, community management, and influencer partnerships. We grow engaged audiences and convert followers into brand advocates and paying customers.",["Content","Community","Growth"]],
            ["05","✍️","Content Marketing","Strategic content that educates, entertains, and converts across blogs, video scripts, email sequences, and whitepapers. Every piece is built for search intent and audience engagement.",["Blog","Video","Email"]],
            ["06","📊","Analytics & Growth","We build custom dashboards, run A/B tests, analyse attribution, and continuously optimise every funnel stage. Because what gets measured, gets improved.",["Reporting","CRO","A/B Testing"]],
          ].map(([num,icon,title,desc,tags]) => (
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

      <div style={{ padding:"40px 52px", overflow:"hidden", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.2)", textAlign:"center", marginBottom:24 }} className="reveal">Trusted By Forward-Thinking Brands</div>
        <div style={{ overflow:"hidden" }}>
          <div className="clients-track">
            {["TECHVAULT","LUMINARY","ORBITCO","NEXGEN","PULSE","MERIDIAN","VANTA","AXIOM",
              "TECHVAULT","LUMINARY","ORBITCO","NEXGEN","PULSE","MERIDIAN","VANTA","AXIOM"].map((c,i) => <span className="cl-logo" key={i}>{c}</span>)}
          </div>
        </div>
      </div>

      <section className="section" style={{ background:"rgba(20,26,70,0.1)" }}>
        <div className="sec-label reveal">Client Success Stories</div>
        <h2 className="sec-title reveal" style={{ marginBottom:8 }}>Results That Speak</h2>
        <p className="reveal" style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,0.45)", maxWidth:480, fontWeight:300 }}>
          Real brands. Real campaigns. Real numbers. Here's what our clients say about working with DSPHERY.
        </p>
        <div className="testi-grid">
          {[
            ["SN","av-a","Ms. Saloni Nebhani","Founder, FFDL","DSPHERY transformed our SEO from an afterthought into our single largest revenue channel. Organic traffic grew 420% in just eight months. Their team is proactive, transparent, and deeply skilled."],
            ["KC","av-b","Mr. Kuldeep Chotrani","Founder, Digidev","Their paid media team is exceptional. We scaled from ₹5L to ₹40L in monthly ad spend while maintaining a 4.2× ROAS throughout. The ROI is remarkable and the reporting is crystal clear."],
            ["KT","av-c","Ms. Kashish Talreja","Founder, Ewolwl","DSPHERY built us a social media presence with 800K engaged followers and a community that actively champions our brand. They think like business owners, not just marketers."],
          ].map(([init,av,name,role,text]) => (
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
        <p className="reveal" style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,0.4)", maxWidth:440, margin:"0 auto 36px", fontWeight:300 }}>
          Whether you're launching a new brand or scaling an established business, DSPHERY has the strategy, talent, and tools to take you further.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-primary" onClick={() => navigate("contact")}>Start Your Project ↗</button>
          <button className="btn-ghost" onClick={() => navigate("contact")}>Book a Free Call</button>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}

/* ── SERVICES ── */
const SERVICES_DATA = [
  { num:"01", icon:"🔍", title:"Search Engine Optimization", desc:"We take a full-funnel approach to SEO — combining rigorous technical audits, keyword research, on-page optimisation, and strategic link acquisition. Our content-led SEO methodology ensures your brand appears for every query that matters to your audience, not just the high-volume vanity keywords. We've consistently driven 3–5× organic traffic growth for clients across e-commerce, SaaS, and local businesses.", tags:["On-Page","Technical","Link Building","Local SEO","E-commerce SEO"], metric:"40%", metricLabel:"Avg. Organic Growth" },
  { num:"02", icon:"🎯", title:"Paid Media & PPC", desc:"From Google Search and Shopping to Meta, LinkedIn, TikTok, and programmatic display — our paid media team manages every rupee with precision. We build full-funnel campaign architectures, develop creative testing frameworks, and use AI-assisted bidding to maximise your returns. Every campaign is built on audience data, competitive intelligence, and a relentless commitment to ROAS.", tags:["Google Ads","Meta Ads","TikTok Ads","LinkedIn Ads","Programmatic"], metric:"3.2×", metricLabel:"Average ROAS" },
  { num:"03", icon:"💡", title:"Brand Strategy & Identity", desc:"A strong brand is your most durable competitive advantage. We help businesses define their positioning, develop a distinctive visual identity, and build a brand voice that resonates authentically with target audiences. From brand naming and logo design to comprehensive brand guidelines and rollout strategy, we create the foundation every successful marketing campaign is built on.", tags:["Brand Identity","Positioning","Voice & Tone","Visual Systems","Guidelines"], metric:"98%", metricLabel:"Client Satisfaction" },
  { num:"04", icon:"📱", title:"Social Media Management", desc:"We manage your social presence end-to-end — content strategy, creative production, community management, influencer partnerships, and performance analysis. Our platform-native approach means we speak the language of each channel, whether it's Instagram Reels, LinkedIn thought leadership, or viral TikToks. We turn passive followers into active brand advocates.", tags:["Content Creation","Community Management","Influencer Marketing","Growth Strategy"], metric:"400K+", metricLabel:"Community Built" },
  { num:"05", icon:"✍️", title:"Content Marketing", desc:"Content is the engine behind long-term organic growth. We build editorial strategies rooted in audience research and search intent, then produce high-quality blog posts, video scripts, email sequences, lead magnets, and social content at scale. Every piece is optimised for discovery, engagement, and conversion — not just pageviews.", tags:["Blog & Articles","Video Scripts","Email Marketing","Lead Magnets","Podcast Content"], metric:"3.8×", metricLabel:"Avg. Engagement Lift" },
  { num:"06", icon:"📊", title:"Graphic Designing and Editing", desc:"We create visually compelling designs and high-quality edits that help brands communicate clearly and stand out across digital platforms. From social media creatives and marketing graphics to brand visuals and promotional designs, we focus on creativity, consistency, and brand identity. Our design approach ensures every visual aligns with your brand message, improves engagement, and enhances your overall digital presence.", tags:["Social Media Design","Ad Creative Design","Brand Visuals","Image Editing","Marketing Graphics"], metric:"120+", metricLabel:"Creatives Designed" },
];

const FAQ_DATA = [
  ["How long does it take to see results from SEO?", "SEO is a long-term investment. Most clients begin to see measurable improvements in rankings and organic traffic within 3–4 months, with significant growth typically visible at the 6–8 month mark. Paid media campaigns can deliver results much faster — often within the first 2–4 weeks of launch."],
  ["What is your minimum engagement budget?", "Our minimum monthly retainer starts at ₹30,000 for focused single-channel engagements. Full-service growth packages start at ₹75,000/month. We also offer project-based pricing for brand identity, website audits, and one-time campaign setups."],
  ["Do you work with businesses outside Rajasthan?", "Absolutely. We work with clients across India and internationally. Digital marketing is borderless — all of our services are delivered remotely, with regular video calls, shared dashboards, and dedicated Slack channels for communication."],
  ["How do you measure and report on campaign performance?", "Every client gets a custom real-time dashboard built on Google Looker Studio or similar tools, pulling data directly from ad platforms, GA4, and your CRM. We send detailed monthly reports and hold monthly strategy calls to review performance and adjust tactics."],
  ["Do you offer one-time projects or only retainers?", "We offer both. One-time projects include brand identity design, SEO audits, paid media account setups, and website CRO reviews. Retainer engagements are recommended for ongoing SEO, paid media management, and social media, where compounding effort produces the best results."],
];

function Services({ navigate }) {
  const [openFaq, setOpenFaq] = useState(null);
  useReveal("services");
  return (
    <div className="page-enter">
      <div style={{ padding:"130px 52px 56px", position:"relative", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 30% 60%, rgba(20,26,70,0.2) 0%, transparent 60%)", pointerEvents:"none" }} />
        <div className="sec-label reveal">What We Do</div>
        <h1 className="sec-title reveal" style={{ maxWidth:560, marginBottom:18 }}>Comprehensive Digital Services</h1>
        <p className="reveal" style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,0.45)", maxWidth:520, fontWeight:300, marginBottom:32 }}>
          End-to-end digital marketing solutions built around your growth ambitions. Every service is backed by data, powered by creativity, and delivered by specialists who live and breathe their discipline.
        </p>
        <button className="btn-primary reveal" onClick={() => navigate("contact")}>Start a Project ↗</button>
      </div>

      <div className="section">
        <div className="svc-list">
          {SERVICES_DATA.map((s) => (
            <div key={s.num} className="svc-row reveal">
              <div>
                <div style={{ fontSize:10, letterSpacing:3, color:"rgba(255,255,255,0.25)", marginBottom:8, fontFamily:"'Syne',sans-serif", fontWeight:700 }}>{s.num}</div>
                <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:"#fff", marginBottom:10 }}>{s.title}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:10 }}>{s.tags.map((t) => <span className="sv-tag" key={t}>{t}</span>)}</div>
              </div>
              <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, lineHeight:1.82, color:"rgba(255,255,255,0.45)", fontWeight:300 }}>{s.desc}</p>
              <div style={{ textAlign:"center", minWidth:90 }}>
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
            <h2 className="sec-title reveal">How We Grow Your Brand</h2>
            <p className="proc-body reveal">
              We don't believe in one-size-fits-all marketing strategies. Every business is unique and deserves a customised digital growth plan built on real data, market research, and creative execution. Our approach focuses on helping brands attract the right audience, increase engagement, and convert traffic into measurable business results.
            </p>
            <button className="btn-primary reveal" onClick={() => navigate("contact")}>Work With Us →</button>
          </div>
          <ul style={{ listStyle:"none" }}>
            {[
              ["01","Market Research & Digital Audit","We analyse your digital presence, competitors, target audience, and current marketing performance to identify opportunities for growth across SEO, social media, and paid advertising."],
              ["02","Strategy & Campaign Planning","We create a customised digital marketing strategy with clear objectives, channel selection, content direction, and campaign planning designed to maximise reach, engagement, and conversions."],
              ["03","Launch, Test & Optimise","Our team launches campaigns across search engines, social media platforms, and digital channels while continuously testing creatives, audiences, and strategies to improve performance."],
              ["04","Analyse, Scale & Report","Through performance tracking and detailed analytics, we identify what works best and scale winning campaigns while providing clear reports on traffic, leads, and growth."],
            ].map(([n,t,d]) => (
              <li key={n} className="step-item reveal">
                <div className="step-num">{n}</div>
                <div><div className="step-title">{t}</div><div className="step-desc">{d}</div></div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section">
        <div className="sec-label reveal">FAQs</div>
        <h2 className="sec-title reveal" style={{ marginBottom:32 }}>Common Questions</h2>
        <div className="faq-list reveal">
          {FAQ_DATA.map(([q,a],i) => (
            <div className={`faq-item${openFaq === i ? " open" : ""}`} key={i}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>{q}<span className="faq-icon">+</span></button>
              {openFaq === i && <div className="faq-a">{a}</div>}
            </div>
          ))}
        </div>
      </div>

      <Footer navigate={navigate} />
    </div>
  );
}

/* ── PORTFOLIO ── */
const PORTFOLIO_ITEMS = [
  { cat:["brand","seo"], tag:"Brand Strategy + SEO", name:"Ewolwl", meta:"40% organic growth in 8 months", color:"linear-gradient(135deg,#0a1230 0%,#050a18 100%)", accent:"#39ff14", desc:"Full brand overhaul and SEO foundation build for a B2B SaaS company. Repositioned brand, built topical authority through content, and restructured technical SEO — resulting in 420% organic traffic growth in 8 months." },
  { cat:["paid"], tag:"Paid Media", name:"FFDL", meta:"3.2× ROAS at ₹1L/mo ad spend", color:"linear-gradient(135deg,#100d28 0%,#060218 100%)", accent:"#39ff14", desc:"Scaled a D2C lifestyle brand from ₹1L to ₹5L in monthly paid media spend while maintaining a 4.2× blended ROAS. Achieved through creative testing frameworks, audience segmentation, and full-funnel campaign architecture." },
  { cat:["social"], tag:"Social Media", name:"Orbit Commerce", meta:"100K community built in 12 months", color:"linear-gradient(135deg,#1a0a20 0%,#0f0015 100%)", accent:"#39ff14", desc:"Built a 800K-strong social community across Instagram and YouTube from scratch for a consumer electronics brand. Included influencer partnerships, content strategy, and community-led growth loops that drove direct revenue." },
  { cat:["seo"], tag:"SEO", name:"Nexgen Platform", meta:"310% traffic increase YOY", color:"linear-gradient(135deg,#0d1828 0%,#060f1a 100%)", accent:"#39ff14", desc:"Comprehensive SEO programme for an ed-tech platform including content hub development, technical SEO fixes, and national link building. Grew organic traffic 310% year-on-year, reducing CAC by 42%." },
  { cat:["brand"], tag:"Brand Identity", name:"Vanta Labs", meta:"Complete brand system from zero", color:"linear-gradient(135deg,#150a25 0%,#0a0515 100%)", accent:"#39ff14", desc:"Built the entire brand identity for a biotech startup from naming through to full brand guidelines, website visual design, and pitch deck templates. The brand was instrumental in securing Series A funding." },
  { cat:["paid","social"], tag:"Paid + Social", name:"Institutes", meta:"4.5× ROI achieved in 6 months", color:"linear-gradient(135deg,#0a1520 0%,#050c14 100%)", accent:"#39ff14", desc:"Integrated paid social and organic social strategy for a fashion e-commerce brand. Combined TikTok UGC ads with Meta remarketing and Instagram community building to achieve 12× ROI within 6 months of engagement." },
];

function Portfolio({ navigate }) {
  const [filter, setFilter] = useState("all");
  useReveal(`portfolio-${filter}`);
  const visible = PORTFOLIO_ITEMS.filter((p) => filter === "all" || p.cat.includes(filter));
  return (
    <div className="page-enter">
      <div style={{ padding:"130px 52px 56px", position:"relative", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 50% 60% at 70% 50%, rgba(20,26,70,0.15) 0%, transparent 60%)", pointerEvents:"none" }} />
        <div className="sec-label reveal">Selected Work</div>
        <h1 className="sec-title reveal">Cases That Speak Volumes</h1>
        <p className="reveal" style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,0.45)", maxWidth:480, fontWeight:300, marginTop:16 }}>
          Real results for real brands. Each project represents a unique challenge solved with strategy, creativity, and disciplined execution. The numbers are real.
        </p>
      </div>
      <section className="section">
        <div className="ftabs">
          {[["all","All Work"],["seo","SEO"],["paid","Paid Media"],["brand","Brand"],["social","Social"]].map(([f,label]) => (
            <button key={f} className={`ftab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{label}</button>
          ))}
        </div>
        <div className="pf-grid">
          {visible.map((p,i) => (
            <div key={p.name} className="pf-item reveal">
              <div className="mock-img" style={{ height:260, background:p.color, position:"relative", overflow:"hidden" }}>
                <svg viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
                  <defs><radialGradient id={`rg${i}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={p.accent} stopOpacity="0.15" /><stop offset="100%" stopColor={p.accent} stopOpacity="0" /></radialGradient></defs>
                  <rect width="100%" height="100%" fill={`url(#rg${i})`} />
                  <circle cx="250" cy="130" r="90" fill="none" stroke={p.accent} strokeWidth="0.5" opacity="0.2" />
                  <circle cx="250" cy="130" r="55" fill="none" stroke={p.accent} strokeWidth="0.5" opacity="0.15" />
                  <text x="250" y="140" textAnchor="middle" fontFamily="Syne" fontSize="30" fill={p.accent} opacity="0.6" fontWeight="800">{p.meta.split(" ")[0]}</text>
                </svg>
              </div>
              <div style={{ padding:"18px 22px" }}>
                <div className="pf-tag">{p.tag}</div>
                <div className="pf-name">{p.name}</div>
                <div className="pf-meta" style={{ marginBottom:10 }}>{p.meta}</div>
                <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, lineHeight:1.72, color:"rgba(255,255,255,0.35)", fontWeight:300 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div style={{ padding:"72px 52px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(26px,4vw,48px)", fontWeight:800, color:"#fff", marginBottom:16 }}>Ready to be our next success story?</h2>
        <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, color:"rgba(255,255,255,0.4)", marginBottom:28, fontWeight:300 }}>Let's talk about your goals and build a plan to get you there.</p>
        <button className="btn-primary" onClick={() => navigate("contact")}>Start a Project ↗</button>
      </div>
      <Footer navigate={navigate} />
    </div>
  );
}

/* ── ABOUT ── */
function About({ navigate }) {
  useReveal("about");
  return (
    <div className="page-enter">
      <div style={{ padding:"130px 52px 56px", position:"relative", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 60% at 50% 50%, rgba(20,26,70,0.3) 0%, transparent 65%)", pointerEvents:"none" }} />
        <div className="sec-label reveal">Our Story</div>
        <h1 className="sec-title reveal">Built for Bold Brands</h1>
        <p className="reveal" style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,0.45)", maxWidth:520, fontWeight:300, marginTop:16 }}>
          DSPHERY was founded with one mission: to build a digital marketing agency that treats every client's business like its own — obsessed with results, allergic to vanity metrics.
        </p>
      </div>
      <section className="section">
        <div className="about-grid">
          <div className="about-img-wrap">
            <div className="about-img-box">
              <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" style={{ width:"80%", opacity:0.7 }}>
                <defs><radialGradient id="about-rg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#39ff14" stopOpacity="0.15" /><stop offset="100%" stopColor="#141a46" stopOpacity="0" /></radialGradient></defs>
                <rect width="400" height="500" fill="url(#about-rg)" />
                <circle cx="200" cy="250" r="140" fill="none" stroke="#39ff14" strokeWidth="0.8" opacity="0.2" />
                <circle cx="200" cy="250" r="100" fill="none" stroke="#39ff14" strokeWidth="0.6" opacity="0.15" />
                <circle cx="200" cy="250" r="60" fill="none" stroke="#39ff14" strokeWidth="0.5" opacity="0.1" />
                <text x="200" y="265" textAnchor="middle" fontFamily="Syne" fontSize="48" fill="#141a46" opacity="0.6" fontWeight="800">DS</text>
              </svg>
              <div className="about-float-stat top-right"><div className="afs-n">120<span>+</span></div><div className="afs-l">Clients Served</div></div>
              <div className="about-float-stat bottom-left"><div className="afs-n">94<span>%</span></div><div className="afs-l">Retention Rate</div></div>
            </div>
          </div>
          <div className="reveal">
            <div className="sec-label">Who We Are</div>
            <h2 className="sec-title" style={{ fontSize:"clamp(26px,3.5vw,48px)", marginBottom:20 }}>Performance-Obsessed Marketing Partners</h2>
            <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.82, color:"rgba(255,255,255,0.45)", fontWeight:300, marginBottom:16 }}>
              Founded in 2026 in Udaipur, Rajasthan, DSPHERY started with a simple but powerful belief: digital marketing should produce real, measurable results — not inflated reports and vanity metrics that don't connect to revenue.
            </p>
            <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.82, color:"rgba(255,255,255,0.45)", fontWeight:300, marginBottom:16 }}>
              We've grown from a small team of passionate strategists into a full-service digital agency serving clients across India and internationally. Our edge is that we think like business owners — every strategy is built with a commercial lens, not just a marketing one.
            </p>
            <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.82, color:"rgba(255,255,255,0.45)", fontWeight:300, marginBottom:28 }}>
              We work with ambitious startups, growing SMEs, and established brands looking for a sharper, more accountable marketing partner. If you want an agency that will own outcomes alongside you — DSPHERY is that agency.
            </p>
            <div style={{ display:"flex", gap:36, marginBottom:28, flexWrap:"wrap" }}>
              {[["2026","Founded in Udaipur"],["10+","Team Members"],["6","Services Offered"]].map(([n,l]) => (
                <div key={l}><div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:700, color:"#fff" }}>{n}</div><div style={{ fontFamily:"'Poppins',sans-serif", fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginTop:4 }}>{l}</div></div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => navigate("contact")}>Work With Us →</button>
          </div>
        </div>

        <div style={{ marginTop:72 }}>
          <div className="sec-label reveal">Core Values</div>
          <h2 className="sec-title reveal" style={{ marginBottom:32, fontSize:"clamp(24px,3vw,44px)" }}>What Drives Us</h2>
          <div className="values-grid">
            {[
              ["🎯","Results First","Every decision is filtered through one question: does this drive measurable growth? We don't spend your budget on activities that can't be tracked back to revenue."],
              ["🔬","Data-Driven Thinking","We build hypotheses, run structured tests, measure outcomes, and iterate relentlessly. Gut feel gets you started; data gets you scaled."],
              ["🤝","True Partnership","We embed ourselves in your business. Your wins are our wins, your challenges are our challenges. We don't just report metrics — we own outcomes with you."],
              ["💡","Creative Courage","We take bold creative swings backed by strategic thinking. In a world of noise, safe is the riskiest thing you can be."],
              ["⚡","Speed & Agility","Markets shift fast. Opportunities close fast. We're built to move quickly — from strategy to execution without the agency bloat."],
              ["📈","Compounding Growth","We build systems designed to compound. Short-term campaign spikes are nice; durable, accelerating growth is what we're actually building."],
            ].map(([icon,title,desc]) => (
              <div className="val-card reveal" key={title}><div className="val-icon">{icon}</div><div className="val-title">{title}</div><div className="val-desc">{desc}</div></div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:72 }}>
          <div className="sec-label reveal">The Team</div>
          <h2 className="sec-title reveal" style={{ marginBottom:8, fontSize:"clamp(24px,3vw,44px)" }}>Meet the Minds Behind DSPHERY</h2>
          <p className="reveal" style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,0.45)", maxWidth:480, fontWeight:300, marginBottom:32 }}>
            A tight-knit team of specialists who are obsessive about their craft and fanatical about client results.
          </p>
          <div className="team-grid">
            {[
              ["DS","linear-gradient(135deg,#141a46,#0a0f2e)","Dhruv Sharma","Founder & CEO"],
              ["AM","linear-gradient(135deg,#0a0f2e,#141a46)","Ananya Mehta","Head of Growth"],
              ["RC","linear-gradient(135deg,#141a46,#1e2a6e)","Rahul Chopra","Creative Director"],
              ["PM","linear-gradient(135deg,#0d1540,#141a46)","Priya Malhotra","Head of Analytics"],
              ["KS","linear-gradient(135deg,#141a46,#0a0f2e)","Karan Singh","SEO Lead"],
              ["NV","linear-gradient(135deg,#0a0f2e,#141a46)","Neha Verma","Paid Media Lead"],
              ["AJ","linear-gradient(135deg,#141a46,#1e2a6e)","Aditya Joshi","Content Strategist"],
              ["RP","linear-gradient(135deg,#0d1540,#141a46)","Riya Patel","Social Media Lead"],
            ].map(([initials,bg,name,role]) => (
              <div className="team-card reveal" key={name}><div className="team-avatar" style={{ background:bg, border:"1px solid rgba(57,255,20,0.2)", color:"#39ff14" }}>{initials}</div><div className="team-name">{name}</div><div className="team-role">{role}</div></div>
            ))}
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  );
}

/* ── CONTACT ── */
function Contact({ navigate }) {
  useReveal("contact");
  const [form, setForm] = useState({ name:"", email:"", company:"", budget:"", service:"", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]:e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "fef347a3-4537-454d-a945-3a372dc4a8bb",
          subject: `New enquiry from ${form.name} — DSPHERY`,
          from_name: "DSPHERY Contact Form",
          ...form,
        }),
      });
      const data = await response.json();
      if (data.success) { setSubmitted(true); } else { setError(data.message || "Something went wrong. Please try again."); }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally { setLoading(false); }
  };
  return (
    <div className="page-enter">
      <div style={{ padding:"130px 52px 56px", position:"relative", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 50% 60% at 25% 60%, rgba(20,26,70,0.15) 0%, transparent 60%)", pointerEvents:"none" }} />
        <div className="sec-label reveal">Get In Touch</div>
        <h1 className="sec-title reveal">Let's Build Something Great</h1>
        <p className="reveal" style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,0.45)", maxWidth:480, fontWeight:300, marginTop:16 }}>
          Ready to transform your digital presence? Fill in the form and one of our strategists will reach out within 24 hours to discuss your goals and how we can help.
        </p>
      </div>
      <section className="section">
        <div className="contact-grid">
          <div className="contact-info">
            <div className="sec-label reveal">Contact Info</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(22px,3vw,38px)", fontWeight:800, color:"#fff", marginBottom:28, lineHeight:1.1 }} className="reveal">We'd love to hear from you</h2>
            <p className="reveal" style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, lineHeight:1.8, color:"rgba(255,255,255,0.4)", fontWeight:300, marginBottom:24 }}>
              Whether you're just exploring, ready to start a project, or want to understand how DSPHERY can help your specific business — we're always happy to talk. No hard sell, ever.
            </p>
            {[["📧","Email","hello@dsphery.com"],["📞","Phone","+91 98874 47780"],["📍","Location","Udaipur, Rajasthan — India"],["⏰","Response Time","Within 24 hours (usually faster)"]].map(([icon,label,val]) => (
              <div className="c-info-item reveal" key={label}>
                <div className="c-info-icon">{icon}</div>
                <div><div className="c-info-label">{label}</div><div className="c-info-val">{val}</div></div>
              </div>
            ))}
            <div style={{ marginTop:28, padding:24, background:"rgba(20,26,70,0.3)", border:"1px solid rgba(57,255,20,0.15)", borderRadius:14 }} className="reveal">
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"#39ff14", marginBottom:8 }}>Free Strategy Session</div>
              <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, lineHeight:1.72, color:"rgba(255,255,255,0.45)", fontWeight:300, marginBottom:14 }}>
                Book a complimentary 30-minute strategy call with one of our growth experts. We'll audit your current digital presence and identify your biggest opportunities — no strings attached.
              </p>
              <button className="btn-primary" style={{ fontSize:11, padding:"9px 20px" }}>Book a Free Call →</button>
            </div>
          </div>
          <div className="contact-form-wrap reveal">
            {submitted ? (
              <div className="form-success">
                <div className="form-success-icon">🎉</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. A member of the DSPHERY team will be in touch within 24 hours.</p>
                <button className="btn-primary" style={{ marginTop:22 }} onClick={() => setSubmitted(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:700, color:"#fff", marginBottom:24 }}>Tell Us About Your Project</h3>
                <div className="form-row">
                  <div className="form-group"><label htmlFor="name">Full Name *</label><input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required /></div>
                  <div className="form-group"><label htmlFor="email">Email Address *</label><input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label htmlFor="company">Company / Brand</label><input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Your company name" /></div>
                  <div className="form-group">
                    <label htmlFor="budget">Monthly Budget</label>
                    <select id="budget" name="budget" value={form.budget} onChange={handleChange}>
                      <option value="">Select range</option>
                      <option>₹10K – ₹30K</option><option>₹30K – ₹75K</option><option>₹75K – ₹2L</option><option>₹2L+</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="service">Service You're Interested In</label>
                  <select id="service" name="service" value={form.service} onChange={handleChange}>
                    <option value="">Select a service</option>
                    <option>SEO</option><option>Paid Media & PPC</option><option>Brand Strategy & Identity</option>
                    <option>Social Media Management</option><option>Content Marketing</option>
                    <option>Analytics & CRO</option><option>Full-Service Package</option>
                    <option>Not sure yet — need guidance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Tell Us About Your Goals *</label>
                  <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Describe your business, current marketing situation, biggest challenges, and what success looks like for you in the next 12 months…" required />
                </div>
                {error && <p style={{ fontFamily:"'Poppins',sans-serif", color:"#f87171", fontSize:12, marginBottom:10 }}>{error}</p>}
                <button className="btn-primary" type="submit" style={{ width:"100%", justifyContent:"center" }} disabled={loading}>
                  {loading ? "Sending…" : "Send Message ↗"}
                </button>
                <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:"rgba(255,255,255,0.2)", textAlign:"center", marginTop:12 }}>We respond within 24 hours. No spam, ever.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <div className="map-hero">
        <iframe
          title="DSPHERY Office — Arawali Complex, Udaipur"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3627.631213368524!2d73.72863857392494!3d24.601920455556932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e502e5282287%3A0x80183086c9109d99!2sArawali%20complex!5e0!3m2!1sen!2sin!4v1773994958938!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="map-panel">
          <div className="map-panel-eyebrow">Find Our Office</div>
          <h2 className="map-panel-title">Visit Us at <span>Arawali Complex</span>, Udaipur</h2>
          <p className="map-panel-sub">Come meet our team in person or reach us anytime. We love connecting with ambitious brands.</p>
          <div className="map-info-rows">
            {[
              ["📍","Office Address","Arawali Complex, Udaipur, Rajasthan 313001"],
              ["📞","Phone","+91 98874 47780"],
              ["📧","Email","hello@dsphery.com"],
              ["⏰","Working Hours","Mon – Sat, 10:00 AM – 7:00 PM IST"],
            ].map(([icon,label,val]) => (
              <div className="map-info-row" key={label}>
                <div className="map-info-icon">{icon}</div>
                <div><div className="map-info-label">{label}</div><div className="map-info-val">{val}</div></div>
              </div>
            ))}
          </div>
          <a className="map-directions-btn" href="https://www.google.com/maps/place/Arawali+complex/@24.6019205,73.7286386,17z" target="_blank" rel="noopener noreferrer">
            📍 Get Directions on Google Maps ↗
          </a>
        </div>
        <div className="map-pin-badge"><div className="map-pin-dot" />Arawali Complex · Udaipur, Rajasthan</div>
      </div>

      <Footer navigate={navigate} />
    </div>
  );
}

/* ── ROOT ── */
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
    const iv = setInterval(() => { p = Math.min(p + Math.random() * 15, 99); setPct(Math.floor(p)); }, 100);
    const done = () => { clearInterval(iv); setPct(100); setTimeout(() => setLoaded(true), 350); };
    window.addEventListener("load", done);
    const fallback = setTimeout(done, 2200);
    return () => { clearInterval(iv); clearTimeout(fallback); window.removeEventListener("load", done); };
  }, []);

  useCursor();

  const navigate = useCallback((p) => { setPage(p); window.scrollTo({ top:0, behavior:"smooth" }); }, []);

  return (
    <>
      <div id="ds-cursor" />
      <div id="ds-cursor-ring" />
      <div id="scroll-prog"><div id="scroll-prog-bar" /></div>
      <div id="ds-loader" className={loaded ? "hidden" : ""}>
        <div className="ld-word">{"DSPHERY".split("").map((c,i) => <span key={i}>{c}</span>)}</div>
        <div className="ld-orb" />
        <div className="ld-pct">{pct}%</div>
      </div>
      <Nav page={page} navigate={navigate} />
      <main style={{ paddingTop:70 }}>
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