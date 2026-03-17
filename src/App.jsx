import { useState, useEffect, useRef, useCallback } from "react";

// ─── CSS-in-JS via injected <style> ──────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

:root {
  --bg:#060810;--bg2:#0c0f1a;--bg3:#131729;
  --fg:#ffffff;--fg2:rgba(255,255,255,0.55);--fg3:rgba(255,255,255,0.18);
  --accent:#5dffb8;--accent2:#7b5fff;--accent3:#ff5d9e;
  --border:rgba(255,255,255,0.07);--card-bg:#0d1120;--card-hover:#131829;
  --nav-bg:rgba(6,8,16,0.82);--shadow:0 24px 80px rgba(0,0,0,0.6);
  --transition:0.4s cubic-bezier(0.23,1,0.32,1);
  --glow:0 0 40px rgba(93,255,184,0.2);
}
.ds-light {
  --bg:#f0f2f8;--bg2:#e8eaf4;--bg3:#dde0f0;
  --fg:#050810;--fg2:rgba(5,8,16,0.55);--fg3:rgba(5,8,16,0.2);
  --accent:#00a86b;--accent2:#6040e0;--accent3:#e0206e;
  --border:rgba(0,0,0,0.09);--card-bg:#e8eaf4;--card-hover:#dde0f0;
  --nav-bg:rgba(240,242,248,0.88);--shadow:0 24px 80px rgba(0,0,0,0.12);
  --glow:0 0 40px rgba(0,168,107,0.15);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
.ds-root{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--fg);overflow-x:hidden;transition:background .4s,color .4s;cursor:none}
a{text-decoration:none;color:inherit}
ul{list-style:none}

/* CURSOR */
#dsCursorDot{position:fixed;top:0;left:0;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);mix-blend-mode:screen}
#dsCursorDotInner{width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 12px var(--accent),0 0 24px rgba(93,255,184,.4);transition:width .2s,height .2s,background .2s}
#dsCursorRing{position:fixed;top:0;left:0;width:40px;height:40px;border-radius:50%;border:1.5px solid rgba(93,255,184,.5);pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:width .35s cubic-bezier(.23,1,.32,1),height .35s cubic-bezier(.23,1,.32,1),border-color .3s,opacity .3s}
#dsCursorRing2{position:fixed;top:0;left:0;width:70px;height:70px;border-radius:50%;border:1px solid rgba(93,255,184,.15);pointer-events:none;z-index:99997;transform:translate(-50%,-50%);transition:width .5s cubic-bezier(.23,1,.32,1),height .5s cubic-bezier(.23,1,.32,1)}
.ds-root.cur-hover #dsCursorRing{width:56px;height:56px;border-color:var(--accent3);opacity:.7}
.ds-root.cur-hover #dsCursorDotInner{width:6px;height:6px;background:var(--accent3)}
.ds-root.cur-hover #dsCursorRing2{width:90px;height:90px}

/* LOADER */
.ds-loader{position:fixed;inset:0;background:var(--bg);z-index:99990;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:24px;transition:opacity .7s,visibility .7s}
.ds-loader.hidden{opacity:0;visibility:hidden;pointer-events:none}
.loader-word{font-family:'Syne',sans-serif;font-size:clamp(48px,8vw,80px);font-weight:800;letter-spacing:12px;color:var(--fg);overflow:hidden}
.loader-word span{display:inline-block;animation:wordIn .9s cubic-bezier(.23,1,.32,1) both}
.loader-word span:nth-child(1){animation-delay:0s}.loader-word span:nth-child(2){animation-delay:.06s}.loader-word span:nth-child(3){animation-delay:.12s}.loader-word span:nth-child(4){animation-delay:.18s}.loader-word span:nth-child(5){animation-delay:.24s}.loader-word span:nth-child(6){animation-delay:.3s}.loader-word span:nth-child(7){animation-delay:.36s}
@keyframes wordIn{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
.loader-orb{width:60px;height:60px;border-radius:50%;border:1.5px solid var(--accent);position:relative;overflow:hidden}
.loader-orb::before{content:'';position:absolute;inset:-20px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0%,var(--accent) 30%,transparent 60%);animation:orbSpin 1.2s linear infinite}
.loader-orb::after{content:'';position:absolute;inset:3px;border-radius:50%;background:var(--bg)}
@keyframes orbSpin{to{transform:rotate(360deg)}}
.loader-pct{font-size:11px;letter-spacing:4px;color:var(--fg3);font-weight:300}

/* SCROLL BAR */
.ds-root ::-webkit-scrollbar{width:5px}
.ds-root ::-webkit-scrollbar-track{background:var(--bg)}
.ds-root ::-webkit-scrollbar-thumb{background:var(--fg3);border-radius:3px}

/* SCROLL PROGRESS */
.scroll-prog{position:fixed;top:0;left:0;right:0;height:2px;z-index:1001}
.scroll-prog-bar{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2),var(--accent3));transition:width .1s}

/* NAV */
nav.ds-nav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:0 52px;height:72px;background:var(--nav-bg);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);transition:background .4s,border-color .4s}
.ds-logo{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;letter-spacing:6px;color:var(--fg);display:flex;align-items:center;gap:10px;cursor:none}
.logo-orb{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));box-shadow:0 0 16px rgba(93,255,184,.4);animation:orbPulse 3s ease-in-out infinite;flex-shrink:0}
@keyframes orbPulse{0%,100%{box-shadow:0 0 16px rgba(93,255,184,.4)}50%{box-shadow:0 0 28px rgba(93,255,184,.7)}}
.nav-links{display:flex;align-items:center;gap:36px}
.nav-links a{font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:var(--fg2);transition:color .2s;font-weight:500;cursor:none}
.nav-links a:hover{color:var(--fg)}
.nav-cta{border:1px solid var(--accent)!important;color:var(--accent)!important;padding:8px 22px;border-radius:100px;transition:background .2s,color .2s!important;cursor:none}
.nav-cta:hover{background:var(--accent)!important;color:var(--bg)!important}
.nav-right{display:flex;align-items:center;gap:16px}
.theme-toggle{width:48px;height:26px;border-radius:13px;border:1.5px solid var(--border);background:var(--bg3);position:relative;cursor:none;transition:background .3s,border-color .3s}
.theme-toggle::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:var(--fg);transition:transform .3s,background .3s}
.ds-light .theme-toggle::after{transform:translateX(22px);background:var(--accent)}
.t-icon{font-size:12px;position:absolute;top:50%;transform:translateY(-50%);pointer-events:none}
.t-icon.sun{right:5px;opacity:0;transition:opacity .3s}.t-icon.moon{left:5px;opacity:1;transition:opacity .3s}
.ds-light .t-icon.sun{opacity:1}.ds-light .t-icon.moon{opacity:0}
.hamburger{display:none;flex-direction:column;gap:5px;cursor:none;padding:4px;background:none;border:none}
.hamburger span{display:block;width:24px;height:2px;background:var(--fg);border-radius:2px;transition:.3s}
.hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger.open span:nth-child(2){opacity:0}
.hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.mobile-nav{display:none;position:fixed;top:72px;left:0;right:0;bottom:0;background:var(--bg);z-index:999;flex-direction:column;padding:48px;gap:32px}
.mobile-nav.open{display:flex}
.mobile-nav a{font-family:'Syne',sans-serif;font-size:36px;font-weight:700;letter-spacing:4px;color:var(--fg);cursor:none}

/* HERO */
.ds-hero{min-height:100vh;padding:120px 52px 80px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;pointer-events:none;z-index:0}
.hero-noise{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");opacity:.6}
.hero-glow{position:absolute;inset:0;background:radial-gradient(ellipse 60% 70% at 65% 45%,rgba(93,255,184,.07) 0%,transparent 65%),radial-gradient(ellipse 50% 50% at 25% 75%,rgba(123,95,255,.06) 0%,transparent 55%),radial-gradient(ellipse 40% 40% at 80% 20%,rgba(255,93,158,.04) 0%,transparent 50%)}
.ds-light .hero-glow{background:radial-gradient(ellipse 60% 70% at 65% 45%,rgba(0,168,107,.08) 0%,transparent 65%),radial-gradient(ellipse 50% 50% at 25% 75%,rgba(96,64,224,.06) 0%,transparent 55%)}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,transparent,rgba(0,0,0,.25) 25%,rgba(0,0,0,.1) 70%,transparent)}
.globe-wrap{position:absolute;top:50%;right:0;transform:translate(10%,-50%);width:min(680px,75vw);height:min(680px,75vw);z-index:1;pointer-events:none}
.globe-wrap canvas{display:block;width:100%!important;height:100%!important}
.fpills{position:absolute;inset:0;pointer-events:none}
.fpill{position:absolute;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--fg2);border:1px solid var(--border);padding:6px 16px;border-radius:100px;background:rgba(13,17,32,.7);backdrop-filter:blur(12px);animation:fpFloat 7s ease-in-out infinite;white-space:nowrap}
.ds-light .fpill{background:rgba(232,234,244,.8)}
.fpill:nth-child(1){top:22%;right:8%;animation-delay:0s}.fpill:nth-child(2){top:42%;right:4%;animation-delay:2s}.fpill:nth-child(3){top:62%;right:10%;animation-delay:4s}.fpill:nth-child(4){top:32%;right:22%;animation-delay:1s}
@keyframes fpFloat{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-14px) rotate(1deg)}}
.hero-content{position:relative;z-index:2}
.hero-eyebrow{font-size:11px;letter-spacing:5px;text-transform:uppercase;color:var(--accent);font-weight:500;margin-bottom:28px;display:flex;align-items:center;gap:10px}
.eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:orbPulse 2s ease-in-out infinite}
.hero-title{font-family:'Syne',sans-serif;font-size:clamp(68px,10vw,140px);line-height:.92;font-weight:800;letter-spacing:-2px;position:relative;z-index:1}
.hero-title .tl{display:block;overflow:hidden}
.hero-title .tl span{display:inline-block;animation:tlIn 1.1s cubic-bezier(.23,1,.32,1) both}
.hero-title .tl:nth-child(1) span{animation-delay:.3s}.hero-title .tl:nth-child(2) span{animation-delay:.45s}.hero-title .tl:nth-child(3) span{animation-delay:.6s}
@keyframes tlIn{from{transform:translateY(110%)}to{transform:translateY(0)}}
.t-outline{-webkit-text-stroke:2px var(--fg);color:transparent}
.t-accent{background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-bottom{display:flex;align-items:flex-end;justify-content:space-between;position:relative;z-index:2;gap:40px;flex-wrap:wrap;padding-top:60px}
.hero-desc{max-width:420px;font-size:16px;line-height:1.75;color:var(--fg2);font-weight:300}
.hero-ctas{display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-top:28px}
.btn-primary{display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#050810;padding:14px 30px;border-radius:100px;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:600;cursor:none;transition:transform .2s,box-shadow .2s;border:none;box-shadow:0 4px 24px rgba(93,255,184,.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 40px rgba(93,255,184,.45)}
.btn-ghost{display:inline-flex;align-items:center;gap:10px;border:1px solid var(--border);color:var(--fg);padding:14px 30px;border-radius:100px;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:400;cursor:none;transition:border-color .2s,background .2s}
.btn-ghost:hover{border-color:var(--fg2);background:var(--bg2)}
.hero-stats{display:flex;gap:44px}
.stat-n{font-family:'Syne',sans-serif;font-size:38px;font-weight:700;color:var(--fg);line-height:1}
.stat-n span{color:var(--accent)}
.stat-l{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--fg3);margin-top:5px}
.scroll-ind{position:absolute;bottom:32px;left:52px;display:flex;align-items:center;gap:12px;color:var(--fg3);font-size:11px;letter-spacing:3px;text-transform:uppercase;z-index:2}
.scroll-ln{width:36px;height:1px;background:var(--fg3);overflow:hidden;position:relative}
.scroll-ln::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:var(--accent);animation:sln 2s ease-in-out infinite}
@keyframes sln{to{left:100%}}

/* MARQUEE */
.mq-strip{padding:14px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg2);overflow:hidden;white-space:nowrap}
.mq-track{display:inline-flex;align-items:center;animation:mqAnim 32s linear infinite}
.mq-strip:hover .mq-track{animation-play-state:paused}
.mq-item{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--fg2);padding:0 22px}
.mq-dot{width:4px;height:4px;border-radius:50%;background:var(--accent);flex-shrink:0;display:inline-block}
@keyframes mqAnim{to{transform:translateX(-50%)}}

/* COUNTER STRIP */
.counter-strip{padding:60px 52px;background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);display:grid;grid-template-columns:repeat(4,1fr);gap:40px;text-align:center}
.counter-n{font-family:'Syne',sans-serif;font-size:clamp(44px,5.5vw,68px);font-weight:700;color:var(--fg);letter-spacing:2px}
.counter-n span{color:var(--accent)}
.counter-l{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--fg2);margin-top:8px}

/* REVEAL */
.reveal{opacity:0;transform:translateY(36px);transition:opacity .8s cubic-bezier(.23,1,.32,1),transform .8s cubic-bezier(.23,1,.32,1)}
.reveal.visible{opacity:1;transform:translateY(0)}
.rd1{transition-delay:.1s}.rd2{transition-delay:.2s}.rd3{transition-delay:.3s}

/* SECTION */
.ds-section{padding:120px 52px}
.sec-label{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:var(--accent);margin-bottom:16px}
.sec-title{font-family:'Syne',sans-serif;font-size:clamp(44px,6.5vw,80px);font-weight:800;letter-spacing:-1px;line-height:.95;color:var(--fg)}

/* SERVICES */
.sv-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:64px;flex-wrap:wrap;gap:24px}
.sv-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--border);border-radius:16px;overflow:hidden}
.sv-card{padding:40px 36px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);cursor:none;position:relative;overflow:hidden;transition:background var(--transition)}
.sv-card:nth-child(3n){border-right:none}.sv-card:nth-child(4),.sv-card:nth-child(5),.sv-card:nth-child(6){border-bottom:none}
.sv-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(93,255,184,.05) 0%,transparent 60%);opacity:0;transition:opacity .3s}
.sv-card:hover::before{opacity:1}.sv-card:hover{background:var(--card-hover)}.sv-card:hover .sv-arrow{transform:translate(4px,-4px);color:var(--accent)}
.sv-num{font-family:'Syne',sans-serif;font-size:12px;letter-spacing:3px;color:var(--fg3);margin-bottom:20px;font-weight:600}
.sv-icon{font-size:30px;margin-bottom:16px}
.sv-title{font-size:19px;font-weight:600;margin-bottom:12px;color:var(--fg);font-family:'Syne',sans-serif}
.sv-desc{font-size:14px;line-height:1.72;color:var(--fg2);font-weight:300}
.sv-arrow{position:absolute;top:32px;right:32px;font-size:20px;color:var(--fg3);transition:transform .3s,color .3s}
.sv-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}
.sv-tag{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;padding:3px 10px;border:1px solid var(--border);border-radius:100px;color:var(--fg3)}

/* PORTFOLIO */
.work-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;flex-wrap:wrap;gap:20px}
.view-all{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--fg3);padding-bottom:4px;transition:color .2s,border-color .2s;cursor:none}
.view-all:hover{color:var(--accent);border-color:var(--accent)}
.ftabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:32px}
.ftab{font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:8px 20px;border-radius:100px;border:1px solid var(--border);color:var(--fg2);cursor:none;background:transparent;transition:background .2s,color .2s,border-color .2s;font-family:'DM Sans',sans-serif}
.ftab.active,.ftab:hover{background:var(--accent);color:#050810;border-color:var(--accent)}
.pf-grid{display:grid;grid-template-columns:2fr 1fr;grid-template-rows:auto auto;gap:16px}
.pf-item{position:relative;overflow:hidden;border-radius:12px;cursor:none;background:var(--card-bg);border:1px solid var(--border);transition:opacity .3s,transform .3s}
.pf-item.large{grid-row:span 2}
.mock-img{width:100%;background:var(--bg3);transition:transform .6s cubic-bezier(.23,1,.32,1)}
.mi-a{background:linear-gradient(135deg,#091a0f 0%,#030f07 100%)}
.mi-b{background:linear-gradient(135deg,#0d0a1f 0%,#050215 100%)}
.mi-c{background:linear-gradient(135deg,#1a0a14 0%,#0f0009 100%)}
.ds-light .mi-a{background:linear-gradient(135deg,#b8f0d4 0%,#80e0b0 100%)}
.ds-light .mi-b{background:linear-gradient(135deg,#c8c0f8 0%,#a090ec 100%)}
.ds-light .mi-c{background:linear-gradient(135deg,#f8c0d8 0%,#ec90b4 100%)}
.pf-item:hover .mock-img{transform:scale(1.04)}
.pf-overlay{position:absolute;bottom:0;left:0;right:0;padding:24px 28px;background:linear-gradient(to top,rgba(6,8,16,.9) 0%,transparent 100%)}
.ds-light .pf-overlay{background:linear-gradient(to top,rgba(240,242,248,.88) 0%,transparent 100%)}
.pf-tag{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:6px}
.pf-name{font-size:20px;font-weight:700;color:var(--fg);font-family:'Syne',sans-serif}
.pf-meta{font-size:12px;color:var(--fg2);margin-top:4px}

/* CLIENTS */
.clients-strip{padding:48px 52px;overflow:hidden}
.clients-lbl{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--fg3);text-align:center;margin-bottom:32px}
.clients-track{display:flex;gap:80px;animation:mqAnim2 28s linear infinite;align-items:center}
@keyframes mqAnim2{to{transform:translateX(-50%)}}
.cl-logo{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;letter-spacing:4px;color:var(--fg3);white-space:nowrap;transition:color .3s;cursor:default}
.cl-logo:hover{color:var(--fg2)}

/* PROCESS */
.proc-inner{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.proc-body{font-size:16px;line-height:1.75;color:var(--fg2);margin:24px 0 36px;font-weight:300}
.steps-list{display:flex;flex-direction:column;gap:0}
.step-item{display:flex;gap:24px;padding:32px 0;border-bottom:1px solid var(--border);cursor:none;transition:padding-left .3s;position:relative}
.step-item:first-child{border-top:1px solid var(--border)}
.step-item:hover{padding-left:14px}.step-item:hover .step-num{color:var(--accent)}
.step-num{font-family:'Syne',sans-serif;font-size:13px;letter-spacing:3px;color:var(--fg3);padding-top:4px;flex-shrink:0;font-weight:700}
.step-title{font-size:18px;font-weight:700;margin-bottom:8px;color:var(--fg);font-family:'Syne',sans-serif}
.step-desc{font-size:14px;line-height:1.72;color:var(--fg2);font-weight:300}

/* TESTIMONIALS */
.ds-testimonials{padding:120px 52px;background:var(--bg2);transition:background var(--transition)}
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px}
.testi-card{background:var(--card-bg);border:1px solid var(--border);border-radius:16px;padding:40px 32px;position:relative;overflow:hidden;transition:transform .3s,box-shadow .3s}
.testi-card:hover{transform:translateY(-6px);box-shadow:var(--shadow)}
.testi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--accent2),var(--accent3));opacity:0;transition:opacity .3s}
.testi-card:hover::before{opacity:1}
.testi-q{font-family:'Syne',sans-serif;font-size:72px;font-weight:800;color:var(--fg3);line-height:.7;margin-bottom:20px}
.testi-text{font-size:15px;line-height:1.72;color:var(--fg2);font-weight:300;margin-bottom:32px}
.testi-author{display:flex;align-items:center;gap:14px}
.t-avatar{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
.av-a{background:linear-gradient(135deg,#5dffb8,#00d080);color:#050810}
.av-b{background:linear-gradient(135deg,#7b5fff,#4020cc);color:#fff}
.av-c{background:linear-gradient(135deg,#ff5d9e,#cc003e);color:#fff}
.t-name{font-size:14px;font-weight:700;color:var(--fg);font-family:'Syne',sans-serif}
.t-role{font-size:12px;color:var(--fg2);margin-top:2px}
.stars{color:var(--accent);font-size:12px;margin-bottom:10px;letter-spacing:2px}

/* AI CHAT */
.ai-btn-pulse{position:fixed;bottom:32px;right:32px;z-index:899;width:56px;height:56px;border-radius:50%;background:rgba(93,255,184,.2);pointer-events:none;animation:aiPulse 2.5s ease-in-out infinite}
@keyframes aiPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.6);opacity:0}}
.ai-btn{position:fixed;bottom:32px;right:32px;z-index:900;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#050810;border:none;cursor:none;font-size:22px;box-shadow:0 4px 24px rgba(93,255,184,.4);display:flex;align-items:center;justify-content:center;transition:transform .3s,box-shadow .3s}
.ai-btn:hover{transform:scale(1.1);box-shadow:0 8px 40px rgba(93,255,184,.55)}
.ai-popup{position:fixed;bottom:100px;right:32px;z-index:900;width:380px;background:var(--bg2);border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.5),0 0 0 1px rgba(93,255,184,.05);transform:scale(.88) translateY(24px);transform-origin:bottom right;opacity:0;pointer-events:none;transition:transform .35s cubic-bezier(.23,1,.32,1),opacity .35s}
.ai-popup.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}
.ai-popup-header{padding:18px 20px;background:linear-gradient(135deg,rgba(93,255,184,.08),rgba(123,95,255,.08));border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.ai-header-left{display:flex;align-items:center;gap:10px}
.ai-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;position:relative}
.ai-avatar::after{content:'';position:absolute;bottom:1px;right:1px;width:9px;height:9px;border-radius:50%;background:#00e676;border:2px solid var(--bg2)}
.ai-ttl{font-size:14px;font-weight:700;color:var(--fg);font-family:'Syne',sans-serif}
.ai-status{font-size:11px;color:var(--accent);letter-spacing:1px}
.ai-close-btn{width:28px;height:28px;border-radius:50%;background:var(--bg3);border:1px solid var(--border);color:var(--fg2);cursor:none;font-size:12px;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
.ai-close-btn:hover{background:var(--fg3);color:var(--fg)}
.ai-msgs{display:flex;flex-direction:column;gap:12px;padding:20px;height:280px;overflow-y:auto;scroll-behavior:smooth}
.ai-msgs::-webkit-scrollbar{width:3px}.ai-msgs::-webkit-scrollbar-track{background:transparent}.ai-msgs::-webkit-scrollbar-thumb{background:var(--fg3);border-radius:2px}
.ai-msg{font-size:13px;line-height:1.6;padding:11px 15px;border-radius:14px;max-width:88%;position:relative;animation:msgIn .3s cubic-bezier(.23,1,.32,1)}
@keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.ai-msg.bot{background:var(--bg3);color:var(--fg);border-radius:4px 14px 14px 14px;border:1px solid var(--border)}
.ai-msg.user{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#050810;align-self:flex-end;border-radius:14px 14px 4px 14px;font-weight:500}
.ai-typing{display:flex;gap:5px;align-items:center;padding:12px 15px;background:var(--bg3);border:1px solid var(--border);border-radius:4px 14px 14px 14px;width:fit-content}
.ai-typing span{width:7px;height:7px;border-radius:50%;background:var(--accent);opacity:.5;animation:typingBounce 1.2s ease-in-out infinite}
.ai-typing span:nth-child(2){animation-delay:.2s}.ai-typing span:nth-child(3){animation-delay:.4s}
@keyframes typingBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px);opacity:1}}
.ai-footer{padding:14px 16px;background:var(--bg);border-top:1px solid var(--border)}
.ai-quick-btns{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.ai-quick-btn{font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:4px 12px;border-radius:100px;border:1px solid var(--border);color:var(--fg3);cursor:none;background:transparent;transition:border-color .2s,color .2s;font-family:'DM Sans',sans-serif}
.ai-quick-btn:hover{border-color:var(--accent);color:var(--accent)}
.ai-irow{display:flex;gap:8px;align-items:flex-end}
.ai-in{flex:1;background:var(--bg3);border:1px solid var(--border);color:var(--fg);border-radius:12px;padding:10px 14px;font-size:13px;font-family:inherit;outline:none;resize:none;height:42px;max-height:100px;transition:border-color .2s;line-height:1.5}
.ai-in:focus{border-color:rgba(93,255,184,.3)}.ai-in::placeholder{color:var(--fg3)}
.ai-send{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;cursor:none;color:#050810;font-size:16px;display:flex;align-items:center;justify-content:center;transition:transform .2s,opacity .2s;flex-shrink:0}
.ai-send:hover{transform:scale(1.07)}.ai-send:disabled{opacity:.4;transform:none}
.ai-powered{text-align:center;font-size:10px;color:var(--fg3);padding-top:10px;letter-spacing:1px;text-transform:uppercase}

/* CTA */
.cta-section{padding:140px 52px;text-align:center;position:relative;overflow:hidden}
.cta-bg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 70% at 50% 50%,rgba(93,255,184,.06) 0%,transparent 70%);pointer-events:none}
.cta-lbl{font-size:11px;letter-spacing:5px;text-transform:uppercase;color:var(--accent);margin-bottom:24px}
.cta-title{font-family:'Syne',sans-serif;font-size:clamp(72px,13vw,180px);font-weight:800;letter-spacing:-2px;line-height:.9;color:var(--fg);margin-bottom:48px}
.cta-title span{-webkit-text-stroke:2px var(--fg);color:transparent}
.btn-dark{display:inline-flex;align-items:center;gap:12px;background:var(--fg);color:var(--bg);padding:18px 44px;border-radius:100px;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:600;cursor:none;transition:transform .2s,box-shadow .2s;border:none}
.btn-dark:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.3)}

/* FOOTER */
.ds-footer{padding:80px 52px 40px;border-top:1px solid var(--border);background:var(--bg2);transition:background var(--transition)}
.ft-top{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-bottom:60px}
.ft-tl{font-size:14px;line-height:1.75;color:var(--fg2);margin-top:16px;max-width:280px;font-weight:300}
.ft-links{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
.ft-col h4{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--fg);margin-bottom:20px;font-family:'Syne',sans-serif}
.ft-col ul{display:flex;flex-direction:column;gap:12px}
.ft-col a{font-size:14px;color:var(--fg2);transition:color .2s;font-weight:300;cursor:none}
.ft-col a:hover{color:var(--fg)}
.ft-bottom{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;padding-top:40px;border-top:1px solid var(--border)}
.ft-copy{font-size:13px;color:var(--fg3)}
.social-links{display:flex;gap:16px}
.social-links a{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--fg2);transition:border-color .2s,color .2s;cursor:none}
.social-links a:hover{border-color:var(--accent);color:var(--accent)}

/* RESPONSIVE */
@media(max-width:1024px){
  .sv-grid{grid-template-columns:repeat(2,1fr)}
  .sv-card:nth-child(3n){border-right:1px solid var(--border)}.sv-card:nth-child(2n){border-right:none}
  .testi-grid{grid-template-columns:repeat(2,1fr)}.counter-strip{grid-template-columns:repeat(2,1fr)}
  .proc-inner{grid-template-columns:1fr;gap:48px}.ft-links{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:768px){
  nav.ds-nav{padding:0 24px}.nav-links{display:none}.hamburger{display:flex}
  .ds-hero{padding:112px 24px 60px}.ds-section,.ds-testimonials,.cta-section{padding:80px 24px}
  .counter-strip{padding:48px 24px}.clients-strip{padding:40px 24px}
  .ds-footer{padding:60px 24px 32px}.sv-grid{grid-template-columns:1fr}
  .sv-card{border-right:none!important}.pf-grid{grid-template-columns:1fr}.pf-item.large{grid-row:auto}
  .testi-grid{grid-template-columns:1fr}.counter-strip{grid-template-columns:repeat(2,1fr)}
  .ft-top{grid-template-columns:1fr}.ft-links{grid-template-columns:1fr 1fr}
  .hero-stats{flex-direction:column;gap:20px}
  .globe-wrap{opacity:.3;right:-10%;width:min(500px,100vw);height:min(500px,100vw)}
  .ai-popup{width:calc(100vw - 32px);right:16px;bottom:90px}
  #dsCursorDot,#dsCursorRing,#dsCursorRing2{display:none}.ds-root{cursor:auto}
  .ai-btn,.ai-btn-pulse{bottom:24px;right:16px}
}
`;

// ─── Globe seed helper ────────────────────────────────────────────────────────
const seed = (n) => { let x = Math.sin(n) * 43758.5453; return x - Math.floor(x); };

const LAND_DOTS = Array.from({ length: 400 }, (_, i) => ({
  phi: Math.acos(1 - 2 * seed(i * 7 + 1)),
  theta: seed(i * 13 + 3) * Math.PI * 2,
  size: seed(i * 17 + 5) * 2.0 + 0.5,
  bright: seed(i * 11 + 7),
}));

const ARCS_INIT = Array.from({ length: 22 }, (_, i) => ({
  a: LAND_DOTS[Math.floor(seed(i * 3) * LAND_DOTS.length)],
  b: LAND_DOTS[Math.floor(seed(i * 7 + 50) * LAND_DOTS.length)],
  progress: seed(i * 11),
  speed: 0.002 + seed(i * 5) * 0.003,
  alpha: 0.3 + seed(i * 9) * 0.5,
}));

// ─── Globe Canvas Component ───────────────────────────────────────────────────
function Globe() {
  const canvasRef = useRef(null);
  const arcsRef = useRef(ARCS_INIT.map(a => ({ ...a })));
  const rotRef = useRef(0);
  const tiltRef = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleMouse = (e) => {
      tiltRef.current.tx = (e.clientY / window.innerHeight - 0.5) * 0.4;
      tiltRef.current.ty = (e.clientX / window.innerWidth - 0.5) * 0.25;
    };
    window.addEventListener('mousemove', handleMouse);

    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const wrap = canvas.parentElement;
      canvas.width = wrap.clientWidth * dpr;
      canvas.height = wrap.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const project = (phi, theta, rot, tx, ty, cx, cy, R) => {
      let x = Math.sin(phi) * Math.cos(theta + rot);
      let y = Math.cos(phi);
      let z = Math.sin(phi) * Math.sin(theta + rot);
      const cosX = Math.cos(tx), sinX = Math.sin(tx);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const cosY = Math.cos(ty), sinY = Math.sin(ty);
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      return { sx: cx + x2 * R, sy: cy - y1 * R, depth: z2, visible: z2 > -0.05 };
    };

    const draw = () => {
      const W = canvas.width / dpr, H = canvas.height / dpr;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.43;

      tiltRef.current.cx += (tiltRef.current.tx - tiltRef.current.cx) * 0.03;
      tiltRef.current.cy += (tiltRef.current.ty - tiltRef.current.cy) * 0.03;
      const { cx: ctX, cy: ctY } = tiltRef.current;

      // Atmosphere
      const atmo = ctx.createRadialGradient(cx - R * 0.1, cy - R * 0.1, R * 0.65, cx, cy, R * 1.3);
      atmo.addColorStop(0, 'rgba(93,255,184,0.0)');
      atmo.addColorStop(0.5, 'rgba(93,255,184,0.03)');
      atmo.addColorStop(0.8, 'rgba(123,95,255,0.07)');
      atmo.addColorStop(1, 'rgba(93,255,184,0.12)');
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2); ctx.fillStyle = atmo; ctx.fill();

      const inner = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.08);
      inner.addColorStop(0, 'transparent'); inner.addColorStop(0.6, 'rgba(93,255,184,0.04)'); inner.addColorStop(1, 'rgba(93,255,184,0.15)');
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2); ctx.fillStyle = inner; ctx.fill();

      // Sphere
      const sg = ctx.createRadialGradient(cx - R * .25, cy - R * .3, R * .02, cx, cy, R);
      sg.addColorStop(0, 'rgba(20,35,65,0.95)'); sg.addColorStop(0.4, 'rgba(8,12,28,0.92)'); sg.addColorStop(0.8, 'rgba(4,6,16,0.88)'); sg.addColorStop(1, 'rgba(2,4,12,0.95)');
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = sg; ctx.fill();

      // Grid
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
      for (let ld = -75; ld <= 75; ld += 15) {
        const lr = ld * Math.PI / 180, slR = R * Math.cos(lr), slY = cy - R * Math.sin(lr);
        const tY = slY + ctX * R * 0.3, ry = slR * (0.18 + Math.abs(ctX) * 0.05);
        ctx.beginPath(); ctx.ellipse(cx + ctY * R * 0.1, tY, slR, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(93,255,184,0.055)'; ctx.lineWidth = 0.8; ctx.stroke();
      }
      for (let lo = 0; lo < 180; lo += 20) {
        const angle = lo * Math.PI / 180 + rotRef.current, rxE = R * Math.abs(Math.cos(angle));
        ctx.beginPath(); ctx.ellipse(cx, cy, rxE, R, ctX * 0.15, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(93,255,184,0.04)'; ctx.lineWidth = 0.8; ctx.stroke();
      }
      ctx.restore();

      // Arcs
      arcsRef.current.forEach(arc => {
        arc.progress += arc.speed;
        if (arc.progress > 1.2) arc.progress = -0.1;
        const pA = project(arc.a.phi, arc.a.theta, rotRef.current, ctX, ctY, cx, cy, R);
        const pB = project(arc.b.phi, arc.b.theta, rotRef.current, ctX, ctY, cx, cy, R);
        if (!pA.visible || !pB.visible) return;
        const dist = Math.hypot(pB.sx - pA.sx, pB.sy - pA.sy);
        if (dist > R * 0.9) return;
        const mcx = (pA.sx + pB.sx) / 2, mcy = (pA.sy + pB.sy) / 2 - dist * 0.28;
        const t0 = Math.max(0, arc.progress - 0.25), t1 = Math.min(1, arc.progress);
        if (t0 >= t1) return;
        ctx.beginPath(); let first = true;
        for (let s = 0; s <= 20; s++) {
          const t = t0 + (t1 - t0) * (s / 20);
          const bx = (1-t)*(1-t)*pA.sx + 2*(1-t)*t*mcx + t*t*pB.sx;
          const by = (1-t)*(1-t)*pA.sy + 2*(1-t)*t*mcy + t*t*pB.sy;
          if (first) { ctx.moveTo(bx, by); first = false; } else ctx.lineTo(bx, by);
        }
        const al = arc.alpha * Math.min(arc.progress, 1 - arc.progress + 0.5) * 0.8;
        ctx.strokeStyle = `rgba(93,255,184,${Math.max(0, al)})`; ctx.lineWidth = 1.2; ctx.stroke();
        if (arc.progress > 0 && arc.progress < 1) {
          const t = arc.progress, hx = (1-t)*(1-t)*pA.sx + 2*(1-t)*t*mcx + t*t*pB.sx, hy = (1-t)*(1-t)*pA.sy + 2*(1-t)*t*mcy + t*t*pB.sy;
          ctx.beginPath(); ctx.arc(hx, hy, 2.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${arc.alpha * 0.9})`; ctx.fill();
          const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 8); hg.addColorStop(0, `rgba(93,255,184,${arc.alpha * .5})`); hg.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.arc(hx, hy, 8, 0, Math.PI * 2); ctx.fillStyle = hg; ctx.fill();
        }
      });

      // Dots
      LAND_DOTS.forEach(pt => {
        const p = project(pt.phi, pt.theta, rotRef.current, ctX, ctY, cx, cy, R);
        if (!p.visible) return;
        const df = (p.depth + 1) / 2, al = pt.bright * df * 0.85, sz = pt.size * (0.4 + df * 0.6);
        ctx.beginPath(); ctx.arc(p.sx, p.sy, sz, 0, Math.PI * 2); ctx.fillStyle = `rgba(93,255,184,${al})`; ctx.fill();
        if (pt.bright > 0.75 && df > 0.65) {
          const gr = sz * 4, glo = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, gr);
          glo.addColorStop(0, `rgba(93,255,184,${al * .35})`); glo.addColorStop(0.5, `rgba(93,255,184,${al * .08})`); glo.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.arc(p.sx, p.sy, gr, 0, Math.PI * 2); ctx.fillStyle = glo; ctx.fill();
        }
      });

      // Specular
      const spec = ctx.createRadialGradient(cx - R * .32, cy - R * .38, 0, cx - R * .2, cy - R * .22, R * .6);
      spec.addColorStop(0, 'rgba(255,255,255,0.10)'); spec.addColorStop(0.4, 'rgba(255,255,255,0.03)'); spec.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = spec; ctx.fill();

      // Rim
      const rim = ctx.createRadialGradient(cx, cy, R * .7, cx, cy, R);
      rim.addColorStop(0, 'transparent'); rim.addColorStop(0.75, 'rgba(93,255,184,0.03)'); rim.addColorStop(1, 'rgba(93,255,184,0.22)');
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = rim; ctx.fill();

      rotRef.current += 0.0008;
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="globe-wrap">
      <canvas ref={canvasRef} id="heroGlobe" />
    </div>
  );
}

// ─── useReveal hook ───────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── CounterStrip ─────────────────────────────────────────────────────────────
function CounterStrip() {
  const ref = useRef(null);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const targets = [240, 4, 97, 8];
  const suffixes = ['+', '.2B', '%', '+'];
  const prefixes = ['', '$', '', ''];

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        targets.forEach((target, i) => {
          let cur = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            cur = Math.min(cur + step, target);
            setCounts(prev => { const n = [...prev]; n[i] = cur; return n; });
            if (cur >= target) clearInterval(timer);
          }, 20);
        });
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const labels = ['Clients Served', 'Revenue Generated', 'Client Retention', 'Years in Business'];
  return (
    <div className="counter-strip" ref={ref}>
      {targets.map((_, i) => (
        <div key={i} className="counter-item reveal">
          <div className="counter-n">
            {prefixes[i]}{i === 1 ? counts[i].toFixed(1) : Math.floor(counts[i])}<span>{suffixes[i]}</span>
          </div>
          <div className="counter-l">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are DSPHERY's AI marketing expert assistant — a sharp, knowledgeable, and friendly digital marketing specialist representing DSPHERY, a premium digital marketing agency founded in 2018.

DSPHERY's services: SEO, Paid Media & PPC, Brand Strategy, Social Media Management, Content Marketing, Analytics & Growth.
Key facts: 240+ clients served, $4.2B in client revenue, 97% retention, 8+ years, New York NY, hello@dsphery.com.

Keep responses concise (2-4 sentences). Be enthusiastic, expert, helpful. Never say you are Claude or mention Anthropic. You are DSPHERY's AI assistant.`;

function AIChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: 'bot', text: "Hey! 👋 I'm DSPHERY's AI marketing expert. Ask me anything about SEO, paid ads, brand strategy, or how we can help grow your business." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const msgsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs, loading]);

  const send = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMsgs(p => [...p, { role: 'user', text: msg }]);
    const newHistory = [...history, { role: 'user', content: msg }];
    setHistory(newHistory);
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: SYSTEM_PROMPT, messages: newHistory }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm having a moment — try again or email hello@dsphery.com! 🙂";
      setMsgs(p => [...p, { role: 'bot', text: reply }]);
      setHistory(h => [...h, { role: 'assistant', content: reply }].slice(-20));
    } catch {
      setMsgs(p => [...p, { role: 'bot', text: "Connection hiccup! Reach out at hello@dsphery.com for immediate help." }]);
    }
    setLoading(false);
  }, [input, loading, history]);

  return (
    <>
      <div className="ai-btn-pulse" />
      <button className="ai-btn" onClick={() => { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 300); }}>💬</button>
      <div className={`ai-popup ${open ? 'open' : ''}`}>
        <div className="ai-popup-header">
          <div className="ai-header-left">
            <div className="ai-avatar">🤖</div>
            <div><div className="ai-ttl">DSPHERY AI</div><div className="ai-status">● Online — Marketing Expert</div></div>
          </div>
          <button className="ai-close-btn" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="ai-msgs" ref={msgsRef}>
          {msgs.map((m, i) => <div key={i} className={`ai-msg ${m.role}`}>{m.text}</div>)}
          {loading && <div className="ai-typing"><span /><span /><span /></div>}
        </div>
        <div className="ai-footer">
          <div className="ai-quick-btns">
            {['How can you improve my SEO?', 'What does a brand strategy include?', 'How do paid ads work?'].map((q, i) => (
              <button key={i} className="ai-quick-btn" onClick={() => send(q)}>{['SEO Tips', 'Brand Strategy', 'Paid Ads'][i]}</button>
            ))}
          </div>
          <div className="ai-irow">
            <textarea
              ref={inputRef}
              className="ai-in"
              placeholder="Ask about marketing..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
            />
            <button className="ai-send" onClick={() => send()} disabled={loading || !input.trim()}>↑</button>
          </div>
          <div className="ai-powered">Powered by Claude AI</div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DSPHERY() {
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('dsphery-theme') || 'dark' : 'dark'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [pfFilter, setPfFilter] = useState('all');
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [loaderPct, setLoaderPct] = useState(0);
  const rootRef = useRef(null);

  useReveal();

  // Inject CSS once
  useEffect(() => {
    if (!document.getElementById('dsphery-styles')) {
      const style = document.createElement('style');
      style.id = 'dsphery-styles';
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }, []);

  // Loader
  useEffect(() => {
    let pct = 0;
    const t = setInterval(() => {
      pct = Math.min(pct + Math.random() * 15, 99);
      setLoaderPct(Math.floor(pct));
    }, 100);
    const hide = () => { clearInterval(t); setLoaderPct(100); setTimeout(() => setLoaderHidden(true), 350); };
    window.addEventListener('load', hide);
    const fallback = setTimeout(hide, 2400);
    return () => { clearInterval(t); window.removeEventListener('load', hide); clearTimeout(fallback); };
  }, []);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      setScrollPct((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Custom cursor
  useEffect(() => {
    const dot = document.getElementById('dsCursorDot');
    const ring = document.getElementById('dsCursorRing');
    const ring2 = document.getElementById('dsCursorRing2');
    if (!dot || !ring || !ring2) return;
    let mx = -200, my = -200, rx = -200, ry = -200, rx2 = -200, ry2 = -200;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove);
    let raf;
    const animate = () => {
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      rx2 += (mx - rx2) * 0.09; ry2 += (my - ry2) * 0.09;
      ring2.style.left = rx2 + 'px'; ring2.style.top = ry2 + 'px';
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  // Hover cursor effect
  useEffect(() => {
    const add = () => rootRef.current?.classList.add('cur-hover');
    const rem = () => rootRef.current?.classList.remove('cur-hover');
    const els = document.querySelectorAll('a,button,.sv-card,.pf-item,.testi-card,.step-item,.ftab,.ai-quick-btn,.theme-toggle');
    els.forEach(el => { el.addEventListener('mouseenter', add); el.addEventListener('mouseleave', rem); });
    return () => els.forEach(el => { el.removeEventListener('mouseenter', add); el.removeEventListener('mouseleave', rem); });
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof window !== 'undefined') localStorage.setItem('dsphery-theme', next);
  };

  const portfolioItems = [
    { cat: 'brand seo', className: 'large', minH: 600, bgClass: 'mi-a', tag: 'Brand Strategy + SEO', name: 'TechVault Rebrand', meta: '420% organic growth in 8 months', svg: (
      <svg viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg" style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.6 }}>
        <defs><radialGradient id="rg1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#5dffb8" stopOpacity=".15"/><stop offset="100%" stopColor="#5dffb8" stopOpacity="0"/></radialGradient></defs>
        <rect width="100%" height="100%" fill="url(#rg1)"/>
        <circle cx="300" cy="400" r="200" fill="none" stroke="#5dffb8" strokeWidth=".6" opacity=".3"/>
        <circle cx="300" cy="400" r="140" fill="none" stroke="#5dffb8" strokeWidth=".5" opacity=".2"/>
        <circle cx="300" cy="400" r="80" fill="none" stroke="#5dffb8" strokeWidth=".5" opacity=".1"/>
        <text x="300" y="415" textAnchor="middle" fontFamily="Syne" fontSize="48" fill="#5dffb8" opacity=".85" fontWeight="800">LAUNCH</text>
        <text x="300" y="460" textAnchor="middle" fontFamily="DM Sans" fontSize="12" fill="#5dffb8" opacity=".5" letterSpacing="5">TECHVAULT 2024</text>
      </svg>
    )},
    { cat: 'paid', className: '', minH: 280, bgClass: 'mi-b', tag: 'Paid Media', name: 'Luminary Growth', meta: '4.2x ROAS at $400K/mo', svg: (
      <svg viewBox="0 0 500 375" xmlns="http://www.w3.org/2000/svg" style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.65 }}>
        <text x="60" y="280" fontFamily="Syne" fontSize="90" fill="rgba(123,95,255,.2)" fontWeight="800">300%</text>
        {[100,140,120,90,70,50].map((y,i) => <rect key={i} x={60+i*20} y={y} width="3" height={220-y} fill="#7b5fff" opacity={.3+i*.08}/>)}
      </svg>
    )},
    { cat: 'social', className: '', minH: 280, bgClass: 'mi-c', tag: 'Social Media', name: 'Orbit Commerce', meta: '800K community built in 12 months', svg: (
      <svg viewBox="0 0 500 375" xmlns="http://www.w3.org/2000/svg" style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.65 }}>
        <circle cx="250" cy="188" r="110" fill="none" stroke="#ff5d9e" strokeWidth="28" strokeDasharray="450 250" strokeDashoffset="-30" opacity=".35"/>
        <circle cx="250" cy="188" r="65" fill="rgba(255,93,158,.07)" stroke="#5dffb8" strokeWidth="1" opacity=".6"/>
        <text x="250" y="197" textAnchor="middle" fontFamily="Syne" fontSize="28" fill="#5dffb8" opacity=".9" fontWeight="800">+800K</text>
        <text x="250" y="218" textAnchor="middle" fontFamily="DM Sans" fontSize="10" fill="#5dffb8" opacity=".5" letterSpacing="3">FOLLOWERS</text>
      </svg>
    )},
  ];

  const isVisible = (cat) => pfFilter === 'all' || cat.split(' ').includes(pfFilter);

  return (
    <div ref={rootRef} className={`ds-root${theme === 'light' ? ' ds-light' : ''}`} id="dsphery-root">
      {/* Cursor */}
      <div id="dsCursorDot"><div id="dsCursorDotInner" /></div>
      <div id="dsCursorRing" />
      <div id="dsCursorRing2" />

      {/* Loader */}
      <div className={`ds-loader${loaderHidden ? ' hidden' : ''}`}>
        <div className="loader-word">{'DSPHERY'.split('').map((c, i) => <span key={i}>{c}</span>)}</div>
        <div className="loader-orb" />
        <div className="loader-pct">{loaderPct}%</div>
      </div>

      {/* Scroll Progress */}
      <div className="scroll-prog"><div className="scroll-prog-bar" style={{ width: scrollPct + '%' }} /></div>

      {/* NAV */}
      <nav className="ds-nav">
        <a href="#home" className="ds-logo"><div className="logo-orb" />DSPHERY</a>
        <ul className="nav-links">
          {['services','work','process','contact'].map(s => (
            <li key={s}><a href={`#${s}`} style={{ textTransform: 'capitalize' }}>{s}</a></li>
          ))}
          <li><a href="#contact" className="nav-cta">Start a Project</a></li>
        </ul>
        <div className="nav-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="t-icon sun">☀️</span>
            <span className="t-icon moon">🌙</span>
          </button>
          <button className={`hamburger${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(o => !o)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        {['services','work','process','contact'].map(s => (
          <a key={s} href={`#${s}`} onClick={() => setMobileOpen(false)} style={{ textTransform: 'capitalize' }}>{s}</a>
        ))}
      </div>

      {/* HERO */}
      <section className="ds-hero" id="home">
        <div className="hero-bg">
          <div className="hero-noise" />
          <div className="hero-glow" />
          <div className="hero-grid" />
          <div className="fpills">
            {['✦ SEO & Content','✦ Paid Ads','✦ Brand Strategy','✦ Data Analytics'].map((p,i) => (
              <span key={i} className="fpill">{p}</span>
            ))}
          </div>
        </div>
        <Globe />
        <div className="hero-content">
          <div className="hero-eyebrow"><div className="eyebrow-dot" />Digital Marketing Agency — Est. 2018</div>
          <h1 className="hero-title">
            <span className="tl"><span>We Build</span></span>
            <span className="tl"><span className="t-outline">Brands That</span></span>
            <span className="tl"><span className="t-accent">Dominate</span></span>
          </h1>
        </div>
        <div className="hero-bottom">
          <div>
            <p className="hero-desc">We craft data-driven digital strategies that transform your online presence and drive measurable growth for ambitious businesses.</p>
            <div className="hero-ctas">
              <a href="#contact" className="btn-primary">Start a Project <span>↗</span></a>
              <a href="#work" className="btn-ghost">View Our Work</a>
            </div>
          </div>
          <div className="hero-stats">
            <div><div className="stat-n"><span>240</span>+</div><div className="stat-l">Clients Served</div></div>
            <div><div className="stat-n">$4.2B</div><div className="stat-l">Revenue Generated</div></div>
            <div><div className="stat-n"><span>97</span>%</div><div className="stat-l">Client Retention</div></div>
          </div>
        </div>
        <div className="scroll-ind"><div className="scroll-ln" /><span>Scroll</span></div>
      </section>

      {/* MARQUEE */}
      <div className="mq-strip">
        <div className="mq-track">
          {['SEO Strategy','Paid Media','Social Media','Brand Identity','Content Marketing','Email Campaigns','Analytics','Growth Hacking','CRO','Influencer Marketing',
            'SEO Strategy','Paid Media','Social Media','Brand Identity','Content Marketing','Email Campaigns','Analytics','Growth Hacking'].map((item, i, arr) => (
            <span key={i}>{i % 2 === 0
              ? <span className="mq-item">{item}</span>
              : <><span className="mq-item">{item}</span><span className="mq-dot" /></>
            }</span>
          ))}
        </div>
      </div>

      {/* COUNTER */}
      <CounterStrip />

      {/* SERVICES */}
      <section className="ds-section" id="services">
        <div className="sv-header reveal">
          <div><div className="sec-label">What We Do</div><h2 className="sec-title">Our<br />Services</h2></div>
          <p style={{ maxWidth:320, fontSize:15, lineHeight:1.75, color:'var(--fg2)', fontWeight:300 }}>End-to-end digital marketing solutions tailored to your growth ambitions.</p>
        </div>
        <div className="sv-grid reveal">
          {[
            { n:'01', icon:'🔍', title:'Search Engine Optimization', desc:'Dominate search rankings with advanced technical SEO, content strategy, and authority building that drives lasting organic growth.', tags:['On-Page','Technical','Link Building'] },
            { n:'02', icon:'🎯', title:'Paid Media & PPC', desc:'Precision-targeted advertising across Google, Meta, TikTok and beyond. AI-optimized campaigns that convert at scale.', tags:['Google Ads','Meta','TikTok'] },
            { n:'03', icon:'💡', title:'Brand Strategy', desc:"Build a brand that resonates. From identity and positioning to voice and visual systems, we create brands people remember.", tags:['Identity','Positioning','Voice'] },
            { n:'04', icon:'📱', title:'Social Media Management', desc:'Platform-native content that builds communities, drives engagement, and converts followers into loyal customers.', tags:['Content','Community','Growth'] },
            { n:'05', icon:'✍️', title:'Content Marketing', desc:'Strategic content that educates, entertains, and converts. From blog posts to video scripts, we tell your story compellingly.', tags:['Blog','Video','Email'] },
            { n:'06', icon:'📊', title:'Analytics & Growth', desc:'Data is our obsession. We track every metric, find every opportunity, and continuously optimize to compound growth.', tags:['Reporting','CRO','A/B Testing'] },
          ].map((s, i) => (
            <div key={i} className="sv-card">
              <div className="sv-num">{s.n}</div>
              <div className="sv-icon">{s.icon}</div>
              <div className="sv-title">{s.title}</div>
              <div className="sv-desc">{s.desc}</div>
              <div className="sv-tags">{s.tags.map(t => <span key={t} className="sv-tag">{t}</span>)}</div>
              <span className="sv-arrow">↗</span>
            </div>
          ))}
        </div>
      </section>

      {/* CLIENTS */}
      <div className="clients-strip">
        <div className="clients-lbl reveal">Trusted By Forward-Thinking Brands</div>
        <div style={{ overflow:'hidden' }}>
          <div className="clients-track">
            {['TECHVAULT','LUMINARY','ORBITCO','NEXGEN','PULSE','MERIDIAN','VANTA','AXIOM',
              'TECHVAULT','LUMINARY','ORBITCO','NEXGEN','PULSE','MERIDIAN','VANTA','AXIOM'].map((c,i) => (
              <span key={i} className="cl-logo">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* PORTFOLIO */}
      <section className="ds-section" id="work">
        <div className="work-header reveal">
          <div><div className="sec-label">Selected Work</div><h2 className="sec-title">Cases That<br />Speak Volumes</h2></div>
          <a href="#" className="view-all">View All Projects →</a>
        </div>
        <div className="ftabs reveal">
          {[['all','All'],['seo','SEO'],['paid','Paid Media'],['brand','Brand'],['social','Social']].map(([v,l]) => (
            <button key={v} className={`ftab${pfFilter === v ? ' active' : ''}`} onClick={() => setPfFilter(v)}>{l}</button>
          ))}
        </div>
        <div className="pf-grid reveal">
          {portfolioItems.map((item, i) => (
            <div key={i} className={`pf-item${item.className ? ' ' + item.className : ''}`}
              style={{ opacity: isVisible(item.cat) ? 1 : .15, transform: isVisible(item.cat) ? 'scale(1)' : 'scale(.97)', pointerEvents: isVisible(item.cat) ? '' : 'none' }}>
              <div className={`mock-img ${item.bgClass}`} style={{ height:'100%', minHeight:item.minH, position:'relative' }}>
                {item.svg}
              </div>
              <div className="pf-overlay">
                <div className="pf-tag">{item.tag}</div>
                <div className="pf-name">{item.name}</div>
                <div className="pf-meta">{item.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="ds-section" id="process" style={{ paddingTop:0 }}>
        <div className="proc-inner">
          <div className="proc-text reveal">
            <div className="sec-label">Our Approach</div>
            <h2 className="sec-title">How We<br />Make Magic</h2>
            <p className="proc-body">We don't believe in cookie-cutter strategies. Every brand is unique and deserves a tailored approach built on real data and sharp creative thinking.</p>
            <a href="#contact" className="btn-primary">Work With Us <span>→</span></a>
          </div>
          <ul className="steps-list reveal">
            {[
              { n:'01', title:'Discovery & Audit', desc:"We dissect your current digital presence, analyze competitors, and identify the biggest growth opportunities hiding in plain sight." },
              { n:'02', title:'Strategy Blueprint', desc:"A bespoke roadmap with clear KPIs, channel mix, budget allocation, and 90-day sprints designed to compound results over time." },
              { n:'03', title:'Launch & Optimize', desc:"Rapid deployment, A/B testing, and relentless iteration. We move fast, measure everything, and double down on what works." },
              { n:'04', title:'Scale & Report', desc:"Monthly deep-dive reports, quarterly strategy reviews, and proactive scaling when we find winning signals in your data." },
            ].map((s, i) => (
              <li key={i} className="step-item">
                <div className="step-num">{s.n}</div>
                <div><div className="step-title">{s.title}</div><div className="step-desc">{s.desc}</div></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="ds-testimonials">
        <div className="sec-label reveal">What Clients Say</div>
        <div className="testi-grid">
          {[
            { cls:'av-a', init:'JM', name:'James Mitchell', role:'CEO, TechVault', text:"DSPHERY transformed our SEO from an afterthought into our #1 revenue channel. Organic traffic grew 420% in eight months — completely beyond our expectations." },
            { cls:'av-b', init:'SK', name:'Sarah Kim', role:'CMO, Luminary Co.', text:"Their paid media team is exceptional. We scaled from $50K to $400K monthly ad spend while maintaining a 4.2x ROAS. The ROI speaks for itself.", delay:'rd1' },
            { cls:'av-c', init:'RP', name:'Ryan Park', role:'Founder, Orbit Commerce', text:"In 12 months DSPHERY built us a social presence with 800K engaged followers and a community that actively champions our brand.", delay:'rd2' },
          ].map((t, i) => (
            <div key={i} className={`testi-card reveal${t.delay ? ' ' + t.delay : ''}`}>
              <div className="stars">★★★★★</div>
              <div className="testi-q">"</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-author">
                <div className={`t-avatar ${t.cls}`}>{t.init}</div>
                <div><div className="t-name">{t.name}</div><div className="t-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="contact">
        <div className="cta-bg" />
        <div className="cta-lbl">Ready to Grow?</div>
        <h2 className="cta-title reveal">Let's Build<br /><span>Something</span><br />Great</h2>
        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
          <a href="mailto:hello@dsphery.com" className="btn-dark">Start Your Project <span>↗</span></a>
          <a href="tel:+1234567890" className="btn-ghost" style={{ color:'var(--fg)', borderColor:'var(--border)' }}>Book a Call</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ds-footer">
        <div className="ft-top">
          <div>
            <a href="#home" className="ds-logo"><div className="logo-orb" />DSPHERY</a>
            <p className="ft-tl">A digital marketing agency obsessed with performance, precision, and measurable results.</p>
            <div className="social-links" style={{ marginTop:24 }}>
              {[['𝕏','Twitter'],['in','LinkedIn'],['ig','Instagram'],['▶','YouTube']].map(([icon,title]) => (
                <a key={title} href="#" title={title}>{icon}</a>
              ))}
            </div>
          </div>
          <div className="ft-links">
            <div className="ft-col"><h4>Services</h4><ul>{['SEO','Paid Media','Social Media','Content','Analytics'].map(s => <li key={s}><a href="#">{s}</a></li>)}</ul></div>
            <div className="ft-col"><h4>Company</h4><ul>{['About','Work','Blog','Careers','Contact'].map(s => <li key={s}><a href="#">{s}</a></li>)}</ul></div>
            <div className="ft-col"><h4>Contact</h4><ul><li><a href="#">hello@dsphery.com</a></li><li><a href="#">+1 (555) 000-0000</a></li><li><a href="#">New York, NY</a></li></ul></div>
          </div>
        </div>
        <div className="ft-bottom">
          <p className="ft-copy">© 2025 DSPHERY. All rights reserved.</p>
          <p className="ft-copy">Crafted with ✦ precision</p>
        </div>
      </footer>

      {/* AI CHAT */}
      <AIChat />
    </div>
  );
}