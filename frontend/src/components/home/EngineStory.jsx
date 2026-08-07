import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { ENGINE_STORY } from "@/content/home";
import { Eyebrow } from "@/components/kit";
import { EASE } from "@/lib/anim";
import NetSegment from "@/components/home/NetworkThread";

/* ------------------------------------------------------------------ */
/* AlterEngineLiveStory                                                */
/* One realistic objective — "Prepare a decision-ready supplier        */
/* comparison." — transformed in front of the visitor through          */
/* Understand → Plan → Approve → Act → Check. Deterministic frontend    */
/* demonstration. Scene stays stable; the right rail explains what      */
/* just happened. Stage is scroll-driven (native sticky, discrete).     */
/* ------------------------------------------------------------------ */

const C = {
  orange: "#ff5a1f",
  blue: "#6f8cff",
  mint: "#69c7aa",
  amber: "#e9ad4f",
  lavender: "#a89be8",
  warm: "#f7f5f0",
};
const OBJECTIVE = "Prepare a decision-ready supplier comparison.";

const SCENE_BG =
  "radial-gradient(ellipse at 18% 62%, rgba(255,90,31,0.30), transparent 42%)," +
  "radial-gradient(ellipse at 84% 26%, rgba(32,54,95,0.26), transparent 46%)," +
  "radial-gradient(ellipse at 78% 80%, rgba(13,69,66,0.22), transparent 40%)," +
  "radial-gradient(ellipse at 40% 12%, rgba(216,135,40,0.14), transparent 44%)," +
  "#070707";

/* work objects positioned on the scene (percent coordinates) */
const STEPS = [
  { id: "collect", title: "Collect supplier records", out: "Supplier set", tint: C.blue, x: 13, y: 50 },
  { id: "normalize", title: "Normalize pricing", out: "Comparable costs", tint: C.blue, x: 32, y: 50 },
  { id: "commercial", title: "Commercial comparison", out: "Cost scorecard", tint: C.orange, x: 58, y: 24 },
  { id: "quality", title: "Quality comparison", out: "Quality scorecard", tint: C.mint, x: 58, y: 76 },
  { id: "score", title: "Score suppliers", out: "Weighted ranking", tint: C.lavender, x: 80, y: 50 },
];
const GATE = { x: 45, y: 50 };

const SOURCES = [
  { id: "profiles", label: "Supplier profiles", tint: C.blue, from: { x: -8, y: 30 } },
  { id: "quotes", label: "Current quotes", tint: C.blue, from: { x: 108, y: 24 } },
  { id: "notes", label: "Quality notes", tint: C.mint, from: { x: 112, y: 78 } },
];
const CONTEXT = [
  "3 candidate suppliers",
  "Q3 contract",
  "No commitments without approval",
  "Side-by-side comparison + recommendation",
  "Every conclusion keeps its source",
];
const ACT_PHRASES = [
  "Reading current quote…",
  "Matching contract terms…",
  "Checking delivery notes…",
  "Comparing quality evidence…",
];

const stepStatus = (id, stage) => {
  if (stage <= 2) return "planned";
  if (stage === 3) {
    if (id === "collect" || id === "normalize") return "complete";
    if (id === "commercial" || id === "quality") return "running";
    return "upcoming";
  }
  return "complete";
};

/* ----- scripted demonstration pointer ----- */
const Pointer = ({ show, click }) => (
  <motion.svg
    width="26" height="26" viewBox="0 0 26 26"
    className="absolute z-40 pointer-events-none"
    style={{ right: "8%", top: "62%" }}
    initial={{ opacity: 0, x: 46, y: 46, scale: 1 }}
    animate={show ? { opacity: 1, x: 0, y: 0, scale: click ? [1, 0.82, 1] : 1 } : { opacity: 0, x: 46, y: 46 }}
    transition={{ duration: 0.7, ease: EASE }}
    aria-hidden="true"
  >
    <path d="M3 2 L3 20 L8 15 L11 22 L14 21 L11 14 L18 14 Z" fill="#f7f5f0" stroke="#111" strokeWidth="1.1" strokeLinejoin="round" />
  </motion.svg>
);

/* ----- one work strip (editorial, not a node) ----- */
const WorkStrip = ({ step, status, delay }) => {
  const running = status === "running";
  const complete = status === "complete";
  const bar = running ? C.orange : complete ? C.mint : step.tint;
  return (
    <motion.div
      className="absolute w-[150px]"
      style={{ left: `${step.x}%`, top: `${step.y}%` }}
      initial={{ opacity: 0, x: "-50%", y: "calc(-50% + 10px)" }}
      animate={{ opacity: status === "upcoming" ? 0.4 : 1, x: "-50%", y: "-50%" }}
      transition={{ duration: 0.4, delay, ease: EASE }}
    >
      <div
        className="rounded-[7px] border bg-[#0d0d0d]/85 backdrop-blur-[2px] px-3 py-2.5"
        style={{ borderColor: running ? "rgba(255,90,31,0.55)" : "rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: bar }} />
          <span className="text-[12.5px] font-semibold text-white/90 leading-tight">{step.title}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[10.5px] text-white/40">{step.out}</span>
          {complete ? (
            <Check size={11} style={{ color: C.mint }} aria-hidden="true" />
          ) : running ? (
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.orange }} />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ----- execution route segments ----- */
const seg = (a, b) => `M${a.x} ${a.y} L${b.x} ${b.y}`;
const curve = (a, b) => `M${a.x} ${a.y} C ${(a.x + b.x) / 2} ${a.y}, ${(a.x + b.x) / 2} ${b.y}, ${b.x} ${b.y}`;
const byId = (id) => STEPS.find((s) => s.id === id);

const Route = ({ stage }) => {
  const skeleton = stage >= 1 ? 1 : 0;
  const trunk = stage >= 2 ? 1 : 0;
  const exec = stage >= 3 ? 1 : 0;
  const segs = [
    { d: seg(byId("collect"), byId("normalize")), on: trunk },
    { d: seg(byId("normalize"), GATE), on: trunk },
    { d: curve(GATE, byId("commercial")), on: exec },
    { d: curve(GATE, byId("quality")), on: exec },
    { d: curve(byId("commercial"), byId("score")), on: exec },
    { d: curve(byId("quality"), byId("score")), on: exec },
  ];
  const skel = [
    seg(byId("collect"), byId("normalize")),
    seg(byId("normalize"), GATE),
    curve(GATE, byId("commercial")),
    curve(GATE, byId("quality")),
    curve(byId("commercial"), byId("score")),
    curve(byId("quality"), byId("score")),
  ];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
      {skel.map((d, i) => (
        <motion.path key={`s${i}`} d={d} fill="none" stroke="rgba(247,245,240,0.16)" strokeWidth="0.5"
          vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: skeleton }}
          transition={{ duration: 0.5, delay: stage === 1 ? 0.15 + i * 0.12 : 0, ease: EASE }} />
      ))}
      {segs.map((s, i) => (
        <motion.path key={`e${i}`} d={s.d} fill="none" stroke={C.orange} strokeWidth="1.4"
          vectorEffect="non-scaling-stroke" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: s.on }}
          transition={{ duration: 0.5, delay: s.on && stage === 3 && i > 1 ? (i - 2) * 0.12 : 0, ease: EASE }} />
      ))}
      {/* approval gate */}
      <motion.circle cx={GATE.x} cy={GATE.y} r="1.6" vectorEffect="non-scaling-stroke"
        fill={stage >= 3 ? C.orange : "none"} stroke={stage === 2 ? C.amber : C.orange} strokeWidth="1.4"
        initial={{ scale: 0 }} animate={{ scale: stage >= 2 ? 1 : 0, opacity: stage >= 2 ? 1 : 0 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }} transition={{ duration: 0.4, ease: EASE }} />
      {stage === 2 && (
        <motion.circle cx={GATE.x} cy={GATE.y} r="1.6" fill="none" stroke={C.amber} strokeWidth="1"
          vectorEffect="non-scaling-stroke" style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={{ scale: [1, 2.4], opacity: [0.6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }} />
      )}
    </svg>
  );
};

/* ----- approval decision sheet ----- */
const ApprovalSheet = ({ show, approved }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="absolute right-[3%] top-1/2 w-[46%] max-w-[320px] z-30"
        initial={{ opacity: 0, x: 30, y: "-50%" }} animate={{ opacity: 1, x: 0, y: "-50%" }} exit={{ opacity: 0, x: 30, y: "-50%" }}
        transition={{ duration: 0.45, ease: EASE }} data-testid="story-approval-sheet"
      >
        <div className="rounded-[10px] border p-5 bg-[#0e0d0c]/95 backdrop-blur-sm" style={{ borderColor: "rgba(233,173,79,0.4)" }}>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.amber }}>Human decision</span>
          <p className="text-[15px] font-semibold text-white/95 mt-2 leading-snug">Approve supplier comparison criteria?</p>
          <div className="mt-4 space-y-2">
            {[["Commercial weight", C.orange], ["Quality weight", C.mint], ["Delivery confidence", C.blue]].map(([t, col]) => (
              <div key={t} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: col }} />
                <span className="text-[12.5px] text-white/70">{t}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-5">
            <div className="relative overflow-hidden rounded-[5px] text-[12.5px] font-semibold px-4 py-2" style={{ border: `1px solid ${C.amber}` }}>
              <motion.span className="absolute inset-0" style={{ background: C.orange, transformOrigin: "left" }}
                initial={{ scaleX: 0 }} animate={{ scaleX: approved ? 1 : 0 }} transition={{ duration: 0.2, ease: EASE }} />
              <span className="relative" style={{ color: approved ? "#111" : C.amber }} data-testid="story-approve-btn">Approve</span>
            </div>
            <span className="text-[12.5px] font-medium px-4 py-2 rounded-[5px] border border-white/15 text-white/55">Review criteria</span>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ----- final decision brief ----- */
const BAR = { A: { com: 0.82, qual: 0.6, del: 0.7 }, B: { com: 0.64, qual: 0.86, del: 0.44 }, C: { com: 0.7, qual: 0.72, del: 0.66 } };
const DecisionBrief = ({ checkPhase }) => {
  const needsReview = checkPhase >= 1 && checkPhase < 3;
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-[74%] max-w-[440px] z-20"
      initial={{ opacity: 0, x: "-50%", y: "-50%", scale: 0.98 }} animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }} data-testid="story-brief"
    >
      <div className="rounded-[10px] border border-white/12 bg-[#0c0c0c]/95 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Supplier comparison</span>
          <span className="text-[10.5px] flex items-center gap-1.5" style={{ color: checkPhase >= 3 ? C.mint : C.orange }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: checkPhase >= 3 ? C.mint : C.orange }} />
            {checkPhase >= 3 ? "Ready to review" : "Checking"}
          </span>
        </div>
        <div className="p-5 space-y-3.5">
          <div className="grid grid-cols-[70px_1fr_1fr_1fr] gap-2 text-[10px] uppercase tracking-[0.12em] text-white/35">
            <span></span><span>Commercial</span><span>Quality</span><span>Delivery</span>
          </div>
          {["A", "B", "C"].map((s) => {
            const flag = needsReview && s === "B";
            return (
              <div key={s} className="grid grid-cols-[70px_1fr_1fr_1fr] gap-2 items-center">
                <span className="text-[12.5px] font-semibold text-white/85">Supplier {s}</span>
                {[["com", C.orange], ["qual", C.mint], ["del", C.blue]].map(([k, col]) => {
                  const isDel = k === "del";
                  const showFlag = flag && isDel;
                  return (
                    <div key={k} className="h-[6px] rounded-full bg-white/10 relative overflow-hidden">
                      <motion.span className="absolute inset-y-0 left-0 rounded-full"
                        style={{ background: showFlag ? C.amber : col }}
                        initial={{ width: 0 }} animate={{ width: `${(showFlag ? 0.44 : BAR[s][k]) * 100}%` }}
                        transition={{ duration: 0.6, ease: EASE }} />
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: C.lavender }}>Recommendation</span>
              <span className="text-[11px] text-white/45">· evidence attached</span>
            </div>
            <p className="text-[13.5px] text-white/85 mt-1.5 leading-snug">
              Supplier A leads on cost with acceptable quality; Supplier C is the balanced alternative.
            </p>
            <AnimatePresence>
              {needsReview && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden">
                  <p className="text-[12px] mt-2.5 flex items-center gap-1.5" style={{ color: C.amber }} data-testid="story-needs-review">
                    <RotateCcw size={11} aria-hidden="true" /> Needs review — re-check delivery evidence.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
          {checkPhase >= 3 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-5 py-3.5 border-t border-white/10 bg-white/[.03]">
              <Link to="/try-alter-engine" className="ax-fill inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-4 py-2 border border-white/20 text-white" data-testid="story-cta-try">
                Try Alter Engine <ArrowRight size={13} className="ax-arrow" aria-hidden="true" />
              </Link>
              <span className="text-[12px] text-white/45">View evidence</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ----- the stable product scene ----- */
const Scene = ({ stage, typed, submitted, approved, phrase, checkPhase, reduce }) => {
  const showSources = stage >= 0 && stage < 2 && submitted;
  return (
    <div
      className="relative w-full h-full rounded-[12px] border border-white/10 overflow-hidden"
      style={{ background: SCENE_BG }}
      data-testid="story-scene"
    >
      {/* execution route + strips (Plan → Check) */}
      <AnimatePresence>
        {stage >= 1 && stage < 4 && (
          <motion.div key="plan" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="absolute inset-[7%]">
              <Route stage={stage} />
              {STEPS.map((s, i) => (
                <WorkStrip key={s.id} step={s} status={stepStatus(s.id, stage)} delay={stage === 1 ? 0.2 + i * 0.16 : 0} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* objective composer — persistent */}
      <motion.div
        className="absolute left-[10%] w-[80%] z-20"
        initial={false}
        animate={{ top: submitted ? "5%" : "44%" }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="rounded-[9px] border border-white/12 bg-white/[.05] backdrop-blur-[3px] px-4 py-3 flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/40 shrink-0">Outcome</span>
          <span className="flex-1 text-[14px] md:text-[16px] text-white/90 truncate" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }} data-testid="story-objective">
            {typed ? typed : <span className="text-white/35">Describe the outcome…</span>}
            {stage === 0 && !submitted && !reduce && <span className="ax-caret" />}
          </span>
          <motion.span
            className="w-7 h-7 rounded-[6px] grid place-items-center shrink-0"
            animate={{ background: submitted ? C.orange : "rgba(255,90,31,0.22)" }}
            transition={{ duration: 0.25 }}
          >
            <ArrowRight size={14} style={{ color: submitted ? "#111" : C.orange }} aria-hidden="true" />
          </motion.span>
        </div>
      </motion.div>

      {/* source objects (Understand) */}
      <AnimatePresence>
        {showSources &&
          SOURCES.map((src, i) => (
            <motion.div
              key={src.id}
              className="absolute z-10"
              style={{ left: `${18 + i * 24}%`, top: "34%" }}
              initial={{ opacity: 0, left: `${src.from.x}%`, top: `${src.from.y}%` }}
              animate={{ opacity: 1, left: `${18 + i * 24}%`, top: "34%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
            >
              <div className="w-[104px]">
                <div className="h-14 rounded-[6px] border relative" style={{ borderColor: `${src.tint}66`, background: "#0d0d0d" }}>
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full" style={{ background: src.tint }} />
                  <div className="pl-4 pr-2 pt-2 space-y-1">
                    <span className="block h-[3px] w-[70%] rounded-full" style={{ background: "rgba(255,255,255,0.22)" }} />
                    <span className="block h-[3px] w-[52%] rounded-full" style={{ background: "rgba(255,255,255,0.14)" }} />
                    <span className="block h-[3px] w-[60%] rounded-full" style={{ background: "rgba(255,255,255,0.14)" }} />
                  </div>
                </div>
                <span className="block text-[10.5px] text-white/50 mt-1.5 text-center">{src.label}</span>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* context annotations (Understand) */}
      <AnimatePresence>
        {stage === 0 && submitted && (
          <motion.div key="ctx" className="absolute left-1/2 -translate-x-1/2 bottom-[7%] w-[86%] flex flex-wrap gap-2 justify-center z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
            {CONTEXT.map((c, i) => (
              <motion.span key={c} className="ax-mask-chip text-[11.5px] text-white/70 border-b pb-0.5"
                style={{ borderColor: `${C.orange}66` }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.6 + i * 0.1, ease: EASE }}>
                {c}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* approval (Approve) */}
      <ApprovalSheet show={stage === 2} approved={approved} />
      {stage === 2 && !reduce && <Pointer show={!approved} click={approved} />}

      {/* activity phrase (Act) */}
      <AnimatePresence>
        {stage === 3 && (
          <motion.div key="act" className="absolute left-1/2 -translate-x-1/2 bottom-[6%] z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-2.5 rounded-full border border-white/12 bg-black/50 px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.orange }} />
              <AnimatePresence mode="wait">
                <motion.span key={phrase} className="text-[12.5px] text-white/75"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: EASE }}>
                  {ACT_PHRASES[phrase % ACT_PHRASES.length]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* result (Check) */}
      <AnimatePresence>{stage === 4 && <DecisionBrief key="brief" checkPhase={checkPhase} />}</AnimatePresence>
    </div>
  );
};

/* ----- right explanation rail ----- */
const Rail = ({ stage, onHover, onSelect }) => (
  <div className="flex flex-col gap-1">
    {ENGINE_STORY.map((s, i) => {
      const active = i === stage;
      return (
        <button
          key={s.stage}
          type="button"
          onMouseEnter={() => onHover(i)}
          onFocus={() => onHover(i)}
          onClick={() => onSelect(i)}
          className="relative text-left pl-5 py-3 group"
          data-active={active}
          data-testid={`story-stage-${s.stage.toLowerCase()}`}
          aria-current={active}
        >
          <motion.span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full" style={{ background: C.orange }}
            initial={false} animate={{ scaleY: active ? 1 : 0, opacity: active ? 1 : 0 }} transition={{ duration: 0.3, ease: EASE }} />
          <span className="flex items-baseline gap-3">
            <span className={`text-[12px] font-semibold tabular-nums transition-colors duration-300 ${active ? "text-[#ff5a1f]" : "text-white/35"}`}>
              0{i + 1}
            </span>
            <span className={`text-[19px] font-semibold tracking-tight transition-colors duration-300 ${active ? "text-[#f7f5f0]" : "text-white/45"}`}>
              {s.stage}
            </span>
          </span>
          <AnimatePresence initial={false}>
            {active && (
              <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE }} className="block overflow-hidden pl-[27px]">
                <span className="block text-[14px] text-white/65 pt-1.5 max-w-[34ch]">{s.copy}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      );
    })}
  </div>
);

export default function AlterEngineLiveStory() {
  const wrapRef = useRef(null);
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(true);
  const [stage, setStage] = useState(0);
  const [inView, setInView] = useState(false);
  const [typed, setTyped] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [approved, setApproved] = useState(false);
  const [phrase, setPhrase] = useState(0);
  const [checkPhase, setCheckPhase] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const set = () => setIsDesktop(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  /* scroll → discrete stage */
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
        const p = Math.min(1, Math.max(0, -rect.top / total));
        const s = Math.min(4, Math.floor(p * 5));
        setStage((prev) => (prev === s ? prev : s));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  /* in-view gate for optional motion */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "-10% 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* human-style typing (Understand) */
  useEffect(() => {
    if (stage >= 1) { setTyped(OBJECTIVE); setSubmitted(true); return; }
    if (stage === 0 && inView) {
      if (reduce) { setTyped(OBJECTIVE); setSubmitted(true); return; }
      setSubmitted(false);
      let i = 0, t;
      setTyped("");
      const tick = () => {
        i++;
        setTyped(OBJECTIVE.slice(0, i));
        if (i >= OBJECTIVE.length) { t = setTimeout(() => setSubmitted(true), 520); return; }
        const ch = OBJECTIVE[i - 1];
        const pause = ch === " " || ch === "-" ? 120 + Math.random() * 140 : 40 + Math.random() * 45;
        t = setTimeout(tick, pause);
      };
      t = setTimeout(tick, 480);
      return () => clearTimeout(t);
    }
    if (stage < 0) return;
  }, [stage, inView, reduce]);

  /* approval (Approve) — scripted auto-approve */
  useEffect(() => {
    if (stage >= 3) { setApproved(true); return; }
    if (stage < 2) { setApproved(false); return; }
    if (stage === 2) {
      if (reduce) { setApproved(true); return; }
      setApproved(false);
      const t = setTimeout(() => setApproved(true), 1650);
      return () => clearTimeout(t);
    }
  }, [stage, inView, reduce]);

  /* activity phrase rotation (Act) */
  useEffect(() => {
    if (stage !== 3 || !inView || reduce) return;
    const id = setInterval(() => setPhrase((p) => p + 1), 2000);
    return () => clearInterval(id);
  }, [stage, inView, reduce]);

  /* check sequence (Check) */
  useEffect(() => {
    if (stage !== 4) { setCheckPhase(0); return; }
    if (!inView) return;
    if (reduce) { setCheckPhase(3); return; }
    setCheckPhase(0);
    const t1 = setTimeout(() => setCheckPhase(1), 900);
    const t2 = setTimeout(() => setCheckPhase(2), 1900);
    const t3 = setTimeout(() => setCheckPhase(3), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [stage, inView, reduce]);

  const goStage = (i) => {
    const el = wrapRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const y = el.offsetTop + (i / 4.6) * total + 6;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const Header = (
    <div className="mb-8">
      <Eyebrow dark className="mb-4">How Alter Engine works</Eyebrow>
      <h2 className="ax-display text-3xl lg:text-5xl">One outcome. A visible path through the work.</h2>
      <p className="mt-4 text-white/60 max-w-2xl">Alter Engine keeps the objective, plan, decisions, progress and result connected from beginning to end.</p>
    </div>
  );

  return (
    <section id="how-it-works" className="bg-black text-[#fbfaf7] relative" data-testid="engine-story-section">
      <NetSegment name="engine" />
      <div className="absolute inset-y-0 right-0 w-[40%] pointer-events-none" style={{ background: "var(--ax-edge-burn)", transform: "scaleX(-1)" }} aria-hidden="true" />

      {isDesktop ? (
        <div ref={wrapRef} style={{ height: "520vh" }}>
          <div className="sticky top-0 h-screen flex flex-col justify-center relative z-10" style={{ paddingTop: "var(--header-height)" }}>
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full">
              {Header}
              <div className="grid grid-cols-[63%_1fr] gap-8 items-center" style={{ height: "min(62vh, 580px)" }}>
                <div className="h-full">
                  <Scene stage={stage} typed={typed} submitted={submitted} approved={approved} phrase={phrase} checkPhase={checkPhase} reduce={reduce} />
                </div>
                <Rail stage={stage} onHover={(i) => setStage(i)} onSelect={goStage} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto px-6 py-24 relative z-10">
          {Header}
          <div className="mt-8 space-y-12">
            {ENGINE_STORY.map((s, i) => (
              <div key={s.stage}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-[12px] font-semibold text-[#ff5a1f]">0{i + 1}</span>
                  <span className="text-2xl font-semibold tracking-tight">{s.stage}</span>
                </div>
                <p className="text-white/65 mb-5 max-w-prose">{s.copy}</p>
                <div className="rounded-[12px] border border-white/10 overflow-hidden" style={{ height: 320 }}>
                  <MobileStage index={i} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* compact static representation of each stage for mobile */
const MobileStage = ({ index }) => {
  const submitted = index >= 1;
  const stage = index;
  return (
    <div className="relative w-full h-full" style={{ background: SCENE_BG }}>
      {stage >= 1 && stage < 4 && (
        <div className="absolute inset-[7%]">
          <Route stage={stage} />
          {STEPS.map((s) => (
            <WorkStrip key={s.id} step={s} status={stepStatus(s.id, stage)} delay={0} />
          ))}
        </div>
      )}
      <div className="absolute left-1/2 -translate-x-1/2 w-[86%]" style={{ top: submitted ? "6%" : "44%" }}>
        <div className="rounded-[8px] border border-white/12 bg-white/[.05] px-3 py-2.5 flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.16em] text-white/40">Outcome</span>
          <span className="flex-1 text-[12.5px] text-white/90 truncate">{OBJECTIVE}</span>
        </div>
      </div>
      {stage === 2 && <ApprovalSheet show approved={false} />}
      {stage === 4 && <DecisionBrief checkPhase={3} />}
    </div>
  );
};
