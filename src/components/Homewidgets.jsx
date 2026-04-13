import { useState, useEffect, useRef, useCallback } from "react";
import { useScrollStory } from "../hooks";

// ── ANIMATED GRAPH ──
export function AnimatedGraph({ visible }) {
  const bars = [
    { label: "Mo", pct: 25, val: "2K" }, { label: "Tu", pct: 38, val: "3.1K" },
    { label: "We", pct: 52, val: "4.2K" }, { label: "Th", pct: 65, val: "5.3K" },
    { label: "Fr", pct: 80, val: "6.5K" }, { label: "Sa", pct: 92, val: "7.4K" },
    { label: "Su", pct: 100, val: "8.1K" },
  ];
  return (
    <div className="animated-graph-wrap">
      <div className="graph-label-row">
        <div className="graph-title">Organic Traffic Growth</div>
        <div className="graph-live-badge"><div className="graph-live-dot" />Live</div>
      </div>
      <div className="graph-bars-row">
        {bars.map((b, i) => (
          <div key={b.label} className="graph-bar-wrap">
            <div className="graph-value">{visible ? b.val : ""}</div>
            <div className="graph-bar-inner" style={{ height: visible ? `${b.pct}%` : "4%", transitionDelay: `${i * 0.1}s` }} />
          </div>
        ))}
      </div>
      <div className="graph-x-label">Last 7 days — Week-on-week +420%</div>
    </div>
  );
}

// ── ANIMATED TIMELINE ──
export function AnimatedTimeline({ visible }) {
  const steps = [
    { icon: "🔍", label: "Research", sub: "Market Analysis" },
    { icon: "💡", label: "Strategy", sub: "Campaign Plan" },
    { icon: "🚀", label: "Launch", sub: "Go Live" },
    { icon: "⚙️", label: "Optimise", sub: "Test & Improve" },
    { icon: "📈", label: "Scale", sub: "Grow Revenue" },
  ];
  return (
    <div className="process-timeline">
      <div className="timeline-header reveal">
        <div className="sec-label" style={{ justifyContent: "center" }}>Our Process</div>
        <h2 className="sec-title" style={{ textAlign: "center" }}>From Strategy to Scale</h2>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "14px auto 0", fontWeight: 300, textAlign: "center" }}>
          A disciplined five-stage growth framework applied consistently across every engagement.
        </p>
      </div>
      <div className="timeline-steps reveal">
        <div className={`timeline-progress-line${visible ? " animated" : ""}`} />
        {steps.map((s, i) => (
          <div key={s.label} className={`timeline-step${visible ? " activated" : ""}`} style={{ transitionDelay: `${i * 0.18}s` }}>
            <div className="ts-dot">{s.icon}</div>
            <div className="ts-label">{s.label}</div>
            <div className="ts-sub">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BEFORE / AFTER SLIDER ──
export function BeforeAfterSlider() {
  const [pct, setPct] = useState(50);
  const wrapRef = useRef(null);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setPct(x);
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => { if (dragging.current) handleMove(e.clientX); };
    const onTouchMove = (e) => { if (dragging.current) handleMove(e.touches[0].clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [handleMove]);

  return (
    <div className="before-after-section">
      <div style={{ textAlign: "center", marginBottom: 0 }}>
        <div className="sec-label reveal" style={{ justifyContent: "center" }}>The DSPHERY Effect</div>
        <h2 className="sec-title reveal" style={{ textAlign: "center" }}>Before vs After</h2>
        <p className="reveal" style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "14px auto 0", fontWeight: 300, textAlign: "center" }}>
          Drag the slider to see what DSPHERY's digital transformation looks like.
        </p>
      </div>
      <div
        className="before-after-wrap reveal" ref={wrapRef}
        onMouseDown={() => { dragging.current = true; }}
        onTouchStart={() => { dragging.current = true; }}
        onClick={(e) => handleMove(e.clientX)}
      >
        <div className="ba-side ba-before">
          <div className="ba-before-content">
            <span className="ba-icon">😟</span>
            <div className="ba-title">Without DSPHERY</div>
            <div className="ba-items">
              {["No SEO strategy", "Wasted ad budget", "Zero social presence", "Stagnant revenue"].map(t => (
                <div className="ba-item" key={t}><span>✕</span>{t}</div>
              ))}
            </div>
          </div>
          <div className="ba-label">BEFORE</div>
        </div>
        <div className="ba-side ba-after" style={{ clipPath: `inset(0 0 0 ${pct}%)` }}>
          <div className="ba-after-content">
            <span className="ba-icon">🚀</span>
            <div className="ba-title">With DSPHERY</div>
            <div className="ba-items">
              {["420% organic growth", "4.2× ROAS achieved", "800K+ community built", "₹8Cr+ revenue generated"].map(t => (
                <div className="ba-item" key={t}><span>✓</span>{t}</div>
              ))}
            </div>
          </div>
          <div className="ba-label">AFTER</div>
        </div>
        <div className="ba-divider" style={{ left: `${pct}%` }}>
          <div className="ba-handle">⇔</div>
        </div>
      </div>
    </div>
  );
}

// ── SCROLL STORY ──
export function ScrollStory() {
  const containerRef = useRef(null);
  const { activeScene, progress } = useScrollStory(containerRef, 4);

  const scenes = [
    {
      id: "broken", className: "scene-broken",
      icon: "⚠️", stepNum: "Step 01 of 04", stepLabel: "The Problem",
      title: <><span>Broken</span> Digital<br />Presence</>,
      desc: "Most brands are invisible online — leaking leads, wasting ad budget, and watching competitors win.",
      extra: (
        <div>
          <div className="scene-broken-glitch" />
          <div className="broken-bars">
            {[40, 20, 55, 10, 35, 15, 50].map((h, i) => <div key={i} className="broken-bar" style={{ height: h }} />)}
          </div>
        </div>
      ),
    },
    {
      id: "strategy", className: "",
      icon: "⚙️", stepNum: "Step 02 of 04", stepLabel: "The Strategy",
      title: <>We Build<br />Your Growth<br /><span style={{ color: "#39ff14" }}>Engine</span></>,
      desc: "Deep research, sharp positioning, and a channel-by-channel plan built around your specific goals.",
      extra: (
        <div className="strategy-grid">
          {["SEO Foundation", "Paid Media Plan", "Brand Voice", "Content Strategy", "Analytics Setup", "Growth Loops"].map((c, i) => (
            <div key={c} className="strategy-chip" style={{ animationDelay: `${i * 0.1}s` }}>{c}</div>
          ))}
        </div>
      ),
    },
    {
      id: "growth", className: "",
      icon: "📈", stepNum: "Step 03 of 04", stepLabel: "The Growth",
      title: <>Traffic<br /><span style={{ color: "#39ff14" }}>Explodes</span><br />Upward</>,
      desc: "Campaigns launch, content ranks, ads convert. Numbers move in the right direction — fast.",
      extra: (
        <div className="growth-bars">
          {[30, 45, 38, 60, 55, 78, 72, 90, 85, 100].map((h, i) => (
            <div key={i} className="growth-bar" style={{ "--h": `${h}%`, height: `${h}%`, animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      ),
    },
    {
      id: "convert", className: "",
      icon: "💰", stepNum: "Step 04 of 04", stepLabel: "The Revenue",
      title: <>Leads<br />Become<br /><span style={{ color: "#39ff14" }}>Revenue</span></>,
      desc: "Every funnel stage is optimised. Visitors convert. Revenue compounds. Your brand dominates.",
      extra: (
        <div>
          <div className="convert-ring"><span style={{ fontSize: 32 }}>₹</span></div>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {["₹8Cr+ Generated", "94% Retention", "4.2× ROAS"].map(s => (
              <div key={s} style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(57,255,20,0.8)", border: "1px solid rgba(57,255,20,0.2)", padding: "4px 12px", borderRadius: 100 }}>{s}</div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="scroll-story">
      <div className="scroll-story-sticky">
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(${activeScene === 0 ? "80,20,20" : activeScene === 1 ? "20,26,70" : activeScene === 2 ? "10,40,10" : "20,60,10"},0.15) 0%, transparent 65%)`, transition: "background 0.8s", pointerEvents: "none" }} />
        {scenes.map((scene, i) => (
          <div key={scene.id} className={`story-scene ${scene.className}${activeScene === i ? " active" : ""}`}>
            <div className="story-content">
              <span className="story-icon">{scene.icon}</span>
              <div className="story-step-num">
                <div style={{ width: 16, height: 1, background: "#39ff14" }} />
                {scene.stepNum} — {scene.stepLabel}
              </div>
              <h2 className="story-title">{scene.title}</h2>
              <p className="story-desc">{scene.desc}</p>
              {scene.extra}
            </div>
          </div>
        ))}
        <div className="story-dots">
          {scenes.map((_, i) => (
            <div key={i} className={`story-dot${activeScene === i ? " active" : ""}`} />
          ))}
        </div>
        <div className="story-progress-label">
          Scroll to explore
          <div className="story-progress-bar-wrap">
            <div className="story-progress-bar" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}