import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { ENGINE_STORY } from "@/content/home";
import { Eyebrow } from "@/components/kit";
import { EASE } from "@/lib/anim";

/* ------------------------------------------------------------------ */
/* One stable execution canvas. The route geometry never changes —     */
/* only the state of the orange execution thread moving through it.    */
/* ------------------------------------------------------------------ */

const NODES = [
  { id: "n1", x: 130, y: 215, label: "Collect supplier records", out: "Supplier profile set" },
  { id: "n2", x: 330, y: 128, label: "Request updated quotes", out: "Three current quotes", gate: true },
  { id: "n3", x: 330, y: 302, label: "Normalize pricing data", out: "Comparable cost model", parallel: true },
  { id: "n4", x: 560, y: 215, label: "Score suppliers", out: "Weighted scorecard" },
  { id: "n5", x: 772, y: 215, label: "Assemble decision brief", out: "Decision-ready brief", result: true },
];

const PATHS = {
  stub: "M24 215 L104 215",
  p1: "M156 215 C 214 215, 246 128, 304 128",
  p2: "M156 215 C 214 215, 246 302, 304 302",
  p3: "M356 128 C 434 128, 474 215, 534 215",
  p4: "M356 302 C 434 302, 474 215, 534 215",
  p5: "M586 215 L 746 215",
  revision: "M756 192 C 710 128, 620 128, 578 192",
};

const QUIET = "rgba(255,255,255,.22)";
const DONE = "rgba(251,250,247,.85)";
const ORANGE = "#ff4d0a";

/* per-stage stroke state for each path segment */
const pathState = (stage) => {
  switch (stage) {
    case 0: return { stub: ORANGE, p1: "none", p2: "none", p3: "none", p4: "none", p5: "none" };
    case 1: return { stub: ORANGE, p1: QUIET, p2: QUIET, p3: QUIET, p4: QUIET, p5: QUIET };
    case 2: return { stub: DONE, p1: ORANGE, p2: QUIET, p3: "dim", p4: "dim", p5: "dim" };
    case 3: return { stub: DONE, p1: DONE, p2: DONE, p3: DONE, p4: ORANGE, p5: QUIET };
    default: return { stub: DONE, p1: DONE, p2: DONE, p3: DONE, p4: DONE, p5: DONE };
  }
};

const nodeState = (stage, n) => {
  if (stage === 0) return n.id === "n1" ? "quiet" : "hidden";
  if (stage === 1) return n.gate ? "gate" : "quiet";
  if (stage === 2) {
    if (n.id === "n1") return "done";
    if (n.gate) return "gate-active";
    return "dim";
  }
  if (stage === 3) {
    if (n.id === "n1" || n.id === "n2") return "done";
    if (n.id === "n3") return "active";
    return "quiet";
  }
  if (n.result) return "result";
  return "done";
};

const Seg = ({ d, state, dash }) => {
  if (state === "none") return null;
  const stroke = state === "dim" ? "rgba(255,255,255,.1)" : state;
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={state === ORANGE ? 2.4 : 1.8}
      strokeDasharray={dash}
      vectorEffect="non-scaling-stroke"
      initial={false}
      animate={{ stroke }}
      transition={{ duration: 0.45, ease: EASE }}
    />
  );
};

const RouteSVG = ({ stage }) => {
  const ps = pathState(stage);
  return (
    <svg viewBox="0 0 900 430" className="w-full h-full" aria-hidden="true" data-testid="story-route-svg">
      <Seg d={PATHS.stub} state={ps.stub} />
      <Seg d={PATHS.p1} state={ps.p1} />
      <Seg d={PATHS.p2} state={ps.p2} />
      <Seg d={PATHS.p3} state={ps.p3} />
      <Seg d={PATHS.p4} state={ps.p4} />
      <Seg d={PATHS.p5} state={ps.p5} />
      {stage === 4 && (
        <motion.path
          d={PATHS.revision}
          fill="none"
          stroke={ORANGE}
          strokeWidth="1.8"
          strokeDasharray="5 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
        />
      )}
      {stage === 4 && (
        <motion.text x="668" y="118" textAnchor="middle" fontSize="12" fontWeight="500" fill={ORANGE} fontFamily="Hanken Grotesk"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          weak step returned for revision
        </motion.text>
      )}
      <circle cx="24" cy="215" r="4.5" fill={stage === 0 ? ORANGE : "rgba(251,250,247,.6)"} />
      {NODES.map((n) => {
        const st = nodeState(stage, n);
        if (st === "hidden") return null;
        const dim = st === "dim";
        const active = st === "active" || st === "gate-active";
        const done = st === "done";
        const result = st === "result";
        const strokeC = active ? ORANGE : done || result ? DONE : dim ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.4)";
        return (
          <g key={n.id} opacity={dim ? 0.35 : 1}>
            {n.gate ? (
              <motion.rect
                x={n.x - 13} y={n.y - 13} width="26" height="26"
                transform={`rotate(45 ${n.x} ${n.y})`}
                fill={st === "gate-active" ? ORANGE : done ? "rgba(251,250,247,.12)" : "none"}
                stroke={st === "gate-active" ? ORANGE : st === "gate" ? ORANGE : strokeC}
                strokeWidth="2"
                initial={false}
                animate={{ scale: st === "gate-active" ? 1.12 : 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
            ) : result ? (
              <>
                <circle cx={n.x} cy={n.y} r="16" fill="none" stroke={stage === 4 ? ORANGE : strokeC} strokeWidth="2" />
                <circle cx={n.x} cy={n.y} r="7" fill={stage === 4 ? ORANGE : "none"} stroke={strokeC} strokeWidth="1.5" />
              </>
            ) : (
              <>
                <circle cx={n.x} cy={n.y} r="12" fill={done ? "rgba(251,250,247,.1)" : "#0b0b0a"} stroke={strokeC} strokeWidth="2" />
                {active && <circle cx={n.x} cy={n.y} r="5" fill={ORANGE} />}
                {done && <path d={`M${n.x - 5} ${n.y} l3.5 3.5 l6.5 -7`} fill="none" stroke={DONE} strokeWidth="2" strokeLinecap="round" />}
              </>
            )}
            <text
              x={n.x} y={n.gate ? n.y - 26 : n.parallel ? n.y + 34 : n.y + 32}
              textAnchor="middle" fontSize="13" fontWeight="500"
              fill={active ? "#fbfaf7" : dim ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.72)"}
              fontFamily="Hanken Grotesk"
            >
              {n.label}
            </text>
            {stage === 1 && (
              <text x={n.x} y={n.gate ? n.y - 42 : n.parallel ? n.y + 52 : n.y + 50} textAnchor="middle" fontSize="11" fontWeight="400" fill="rgba(255,255,255,.4)" fontFamily="Hanken Grotesk">
                {n.gate ? "human approval gate" : n.out}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* HTML overlays that live on the same stable canvas */
const StageOverlay = ({ stage }) => {
  if (stage === 0)
    return (
      <div className="absolute inset-0 p-6 md:p-9 flex flex-col" data-testid="story-visual-understand">
        <p className="text-[22px] md:text-[27px] font-semibold tracking-tight text-white/95 max-w-[19ch] leading-snug">
          Prepare a decision-ready supplier comparison.
        </p>
        <div className="mt-4 flex items-center gap-3 text-[13px] text-white/60">
          <span className="w-4 h-[2px] bg-[#ff4d0a] inline-block" aria-hidden="true" />
          3 candidate suppliers · Q3 contract window
        </div>
        <div className="absolute right-6 md:right-9 top-1/2 -translate-y-1/2 max-w-[220px] border-l-2 border-[#ff4d0a] pl-4">
          <p className="text-[12px] uppercase tracking-[0.14em] text-[#ff8a3d] font-medium">Constraint</p>
          <p className="text-[13px] text-white/70 mt-1">No commitments without approval.</p>
        </div>
        <div className="mt-auto">
          <p className="text-[15px] text-white/80">Done means: side-by-side comparison with a recommendation.</p>
          <div className="flex flex-wrap gap-2 mt-3" aria-label="Evidence sources">
            {["Supplier records", "Current quotes", "Pricing data"].map((s) => (
              <span key={s} className="text-[12px] text-white/55 border-b border-[#ff4d0a]/50 pb-0.5">{s}</span>
            ))}
            <span className="text-[12px] text-white/40">— every data point keeps its source</span>
          </div>
        </div>
      </div>
    );
  if (stage === 2)
    return (
      <div className="absolute inset-y-0 right-0 w-full sm:w-[46%] bg-[#141414] border-l border-white/12 p-6 md:p-7 flex flex-col justify-center" data-testid="story-visual-approve">
        <p className="text-[12px] uppercase tracking-[0.16em] text-[#ff4d0a] font-medium mb-3">Needs your decision</p>
        <p className="text-[16px] font-semibold text-white/95 leading-snug">Send quote request emails to 3 supplier contacts</p>
        <dl className="mt-4 space-y-2 text-[13px]">
          {[["Why", "Existing quotes are 40+ days old"], ["Scope", "3 outbound messages, no commitments"], ["If approved", "Requests go out; replies feed the cost model"]].map(([t, d]) => (
            <div key={t} className="flex gap-3"><dt className="text-white/45 w-20 shrink-0">{t}</dt><dd className="text-white/80">{d}</dd></div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-2 mt-5" aria-hidden="true">
          <span className="bg-[#ff4d0a] text-black text-[12px] font-semibold px-4 py-1.5 rounded-[3px]">Approve</span>
          {["Edit", "Request context", "Decline"].map((b) => (
            <span key={b} className="border border-white/25 text-white/70 text-[12px] font-medium px-4 py-1.5 rounded-[3px]">{b}</span>
          ))}
        </div>
      </div>
    );
  if (stage === 3)
    return (
      <div className="absolute left-6 md:left-9 bottom-5 flex items-center gap-4" data-testid="story-visual-act">
        <span className="flex items-center gap-2 text-[13px] text-white/75">
          <span className="w-2 h-2 rounded-full bg-[#ff4d0a] animate-pulse inline-block" aria-hidden="true" />
          Normalizing pricing data
        </span>
        <span className="text-[13px] text-white/40">2 complete · 1 running · 2 waiting</span>
      </div>
    );
  if (stage === 4)
    return (
      <div className="absolute left-6 md:left-9 bottom-5 max-w-[430px]" data-testid="story-visual-check">
        <p className="text-[15px] text-white/90 font-medium">Decision-ready comparison with weighted scorecard and recommendation.</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5">
          {["All suppliers covered", "Quotes current", "Sources attached"].map((c) => (
            <span key={c} className="flex items-center gap-1.5 text-[12.5px] text-white/65">
              <Check size={12} className="text-[#ff4d0a]" aria-hidden="true" />{c}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-[12.5px] text-[#ff8a3d]">
            <RotateCcw size={11} aria-hidden="true" />Lead-time weighting ran again before acceptance
          </span>
        </div>
      </div>
    );
  return null;
};


const Rail = ({ activeStage }) => (
    <div className="space-y-1">
      {ENGINE_STORY.map((s, i) => (
        <div
          key={s.stage}
          className={`p-4 border-l-2 transition-colors duration-300 ${i === activeStage ? "border-[#ff4d0a] bg-white/[.04]" : "border-white/10"}`}
          data-testid={`story-stage-${s.stage.toLowerCase()}`}
          aria-current={i === activeStage}
        >
          <span className={`block text-lg font-semibold tracking-tight ${i === activeStage ? "text-[#fbfaf7]" : "text-white/45"}`}>{s.stage}</span>
          <AnimatePresence initial={false}>
            {i === activeStage && (
              <motion.span
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="block text-[14px] text-white/65 overflow-hidden"
              >
                <span className="block pt-1.5">{s.copy}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );


const Canvas = ({ activeStage }) => (
    <div className="border border-white/12 bg-[#0b0b0a] h-full flex flex-col relative overflow-hidden rounded-[4px]" data-testid="story-canvas">
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 relative z-10">
        <span className="text-[13px] font-medium text-white/60">Mission — supplier comparison</span>
        <span className="text-[13px] font-semibold text-[#ff4d0a]">{ENGINE_STORY[activeStage].stage}</span>
      </div>
      <div className="flex-1 relative">
        <div className={`absolute inset-0 transition-opacity duration-500 ${activeStage === 0 ? "opacity-0" : "opacity-100"}`}>
          <RouteSVG stage={activeStage} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <StageOverlay stage={activeStage} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex border-t border-white/10 relative z-10" aria-hidden="true">
        {ENGINE_STORY.map((s, i) => (
          <div key={s.stage} className={`h-1 flex-1 ${i <= activeStage ? "bg-[#ff4d0a]" : "bg-white/10"} transition-colors duration-500`} />
        ))}
      </div>
    </div>
);

export default function EngineStory() {
  const wrapRef = useRef(null);
  const [stage, setStage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const set = () => setIsDesktop(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / total));
        const s = Math.min(4, Math.floor(progress * 5));
        setStage((prev) => (prev === s ? prev : s));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  return (
    <section id="how-it-works" className="bg-black text-[#fbfaf7] relative" data-testid="engine-story-section">
      <div className="absolute inset-y-0 right-0 w-[40%] pointer-events-none" style={{ background: "var(--ax-edge-burn)", transform: "scaleX(-1)" }} aria-hidden="true" />
      {isDesktop ? (
        <div ref={wrapRef} style={{ height: "520vh" }}>
          <div className="sticky top-0 h-screen flex flex-col justify-center" style={{ paddingTop: "var(--header-height)" }}>
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full">
              <div className="mb-10">
                <Eyebrow dark className="mb-4">How Alter Engine works</Eyebrow>
                <h2 className="ax-display text-3xl lg:text-5xl">One outcome. A visible path through the work.</h2>
                <p className="mt-4 text-white/65 max-w-2xl">Alter Engine keeps the objective, plan, decisions, progress and result connected from beginning to end.</p>
              </div>
              <div className="grid grid-cols-[62%_1fr] gap-10 items-stretch" style={{ height: "min(52vh, 520px)" }}>
                <Canvas activeStage={stage} />
                <div className="overflow-y-auto pr-1"><Rail activeStage={stage} /></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto px-6 py-24 relative">
          <Eyebrow dark className="mb-4">How Alter Engine works</Eyebrow>
          <h2 className="ax-display text-3xl sm:text-4xl">One outcome. A visible path through the work.</h2>
          <p className="mt-4 text-white/65">Alter Engine keeps the objective, plan, decisions, progress and result connected from beginning to end.</p>
          <div className="mt-10 space-y-10">
            {ENGINE_STORY.map((s, i) => (
              <div key={s.stage}>
                <p className="text-[14px] font-semibold text-[#ff4d0a] mb-1.5">{s.stage}</p>
                <p className="text-white/70 mb-4">{s.copy}</p>
                <div className="border border-white/12 bg-[#0b0b0a] rounded-[4px] relative overflow-hidden" style={{ height: 300 }}>
                  {i > 0 && <div className="absolute inset-0"><RouteSVG stage={i} /></div>}
                  <StageOverlay stage={i} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
