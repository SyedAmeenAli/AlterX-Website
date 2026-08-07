import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Eyebrow, FillLink } from "@/components/kit";
import { ThreadPath, GradientRibbon } from "@/components/thread";
import { usePageMeta, Reveal, MaskLines, EASE } from "@/lib/anim";
import EngineStory from "@/components/home/EngineStory";

/* ------------------------------------------------------------------ */
/* Hero — one outcome enters the system. The thread builds the path.  */
/* ------------------------------------------------------------------ */

const HERO_STAGES = [
  { key: "understand", label: "Understand", copy: "The outcome enters with its context and constraints attached." },
  { key: "plan", label: "Plan", copy: "The route branches into dependent and parallel work." },
  { key: "approve", label: "Approve", copy: "The route stops at a human decision gate." },
  { key: "act", label: "Act", copy: "Approved steps carry the work forward." },
  { key: "check", label: "Check", copy: "The result is checked — with a visible path back for weak work." },
];

const HERO_PATHS = {
  understand: "M16 90 L120 90",
  plan: "M120 90 C 170 90, 180 46, 236 46 M120 90 C 170 90, 180 134, 236 134",
  approve: "M236 46 C 292 46, 300 90, 336 90 M236 134 C 292 134, 300 90, 336 90",
  act: "M372 90 L474 90",
  check: "M474 90 L520 90 M544 66 C 520 30, 420 30, 396 62",
};

const HeroThread = () => {
  const [hov, setHov] = useState(null);
  const active = hov || "act";
  const col = (k) => (hov === null || hov === k ? "#ff4d0a" : "rgba(255,255,255,.25)");
  return (
    <div data-testid="engine-hero-thread">
      <p className="text-[15px] text-white/85 font-medium mb-4">“Prepare a decision-ready supplier comparison.”</p>
      <svg viewBox="0 0 600 180" className="w-full h-auto" aria-hidden="true">
        {Object.entries(HERO_PATHS).map(([k, d]) =>
          d.split(" M").map((seg, i) => (
            <ThreadPath key={`${k}-${i}`} d={i === 0 ? seg : `M${seg}`} stroke={col(k)} strokeWidth={2} delay={0.15 * Object.keys(HERO_PATHS).indexOf(k)} duration={0.7} />
          ))
        )}
        <circle cx="16" cy="90" r="4.5" fill="#ff4d0a" />
        <circle cx="236" cy="46" r="10" fill="#0b0b0a" stroke={col("plan")} strokeWidth="2" />
        <circle cx="236" cy="134" r="10" fill="#0b0b0a" stroke={col("plan")} strokeWidth="2" />
        <rect x="336" y="76" width="28" height="28" transform="rotate(45 350 90)" fill="#0b0b0a" stroke={col("approve")} strokeWidth="2" />
        <text x="350" y="48" textAnchor="middle" fontSize="11" fontWeight="500" fill="rgba(255,138,61,.9)" fontFamily="Hanken Grotesk">human gate</text>
        <circle cx="532" cy="90" r="15" fill="none" stroke={col("check")} strokeWidth="2" />
        <circle cx="532" cy="90" r="6" fill={col("check")} />
        {/* hover hit areas */}
        {[["understand", 0, 130], ["plan", 130, 130], ["approve", 260, 120], ["act", 380, 100], ["check", 480, 120]].map(([k, x, w]) => (
          <rect key={k} x={x} y="0" width={w} height="180" fill="transparent" onMouseEnter={() => setHov(k)} onMouseLeave={() => setHov(null)} style={{ cursor: "default" }} data-testid={`engine-hero-zone-${k}`} />
        ))}
      </svg>
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
        {HERO_STAGES.map((s) => (
          <button key={s.key} onMouseEnter={() => setHov(s.key)} onMouseLeave={() => setHov(null)} onFocus={() => setHov(s.key)} onBlur={() => setHov(null)} className={`text-[13px] font-medium transition-colors ${hov === s.key ? "text-[#ff4d0a]" : "text-white/50"}`}>
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-[13.5px] text-white/65 mt-2 min-h-[22px]" aria-live="polite">{HERO_STAGES.find((s) => s.key === active)?.copy}</p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Recovery — three route branches emerging from the failed point.     */
/* ------------------------------------------------------------------ */

const BRANCHES = [
  { key: "retry", label: "Retry", copy: "The same step runs again with the same scope — useful when the interruption was transient.", d: "M300 130 C 360 130, 420 70, 520 70" },
  { key: "alternate", label: "Alternate route", copy: "The Engine reaches the required output through a different path, without abandoning the mission.", d: "M300 130 L520 130" },
  { key: "clarify", label: "Ask for clarification", copy: "A missing decision or missing input goes back to a person. The route continues once answered.", d: "M300 130 C 360 130, 420 190, 520 190" },
];

const RecoveryBranches = () => {
  const [sel, setSel] = useState("alternate");
  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
      <svg viewBox="0 0 600 260" className="w-full h-auto" aria-hidden="true">
        <ThreadPath d="M20 130 L200 130" stroke="rgba(251,250,247,.7)" strokeWidth={2} duration={0.8} />
        <ThreadPath d="M200 130 L280 130" stroke="#ff8a63" strokeWidth={2} delay={0.5} duration={0.4} />
        <g>
          <circle cx="294" cy="130" r="13" fill="#0b0b0a" stroke="#ff8a63" strokeWidth="2" />
          <path d="M294 124 L294 132 M294 136.5 L294 137" stroke="#ff8a63" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <text x="294" y="162" textAnchor="middle" fontSize="12" fontWeight="500" fill="rgba(255,138,99,.9)" fontFamily="Hanken Grotesk">step failed</text>
        {BRANCHES.map((b) => (
          <motion.path
            key={b.key}
            d={b.d}
            fill="none"
            stroke={sel === b.key ? "#ff4d0a" : "rgba(255,255,255,.2)"}
            strokeWidth={sel === b.key ? 2.4 : 1.6}
            strokeDasharray={b.key === "clarify" ? "5 5" : undefined}
            initial={false}
            animate={{ stroke: sel === b.key ? "#ff4d0a" : "rgba(255,255,255,.2)" }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        ))}
        {[[520, 70], [520, 130], [520, 190]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill={sel === BRANCHES[i].key ? "#ff4d0a" : "rgba(255,255,255,.3)"} />
        ))}
      </svg>
      <div>
        <div className="space-y-1 mb-6">
          {BRANCHES.map((b) => (
            <button
              key={b.key}
              onMouseEnter={() => setSel(b.key)}
              onFocus={() => setSel(b.key)}
              onClick={() => setSel(b.key)}
              className={`block w-full text-left px-4 py-3 border-l-2 transition-colors ${sel === b.key ? "border-[#ff4d0a] text-[#fbfaf7] bg-white/[.04]" : "border-white/10 text-white/50"}`}
              data-testid={`recovery-branch-${b.key}`}
            >
              <span className="font-semibold text-[16px]">{b.label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="text-white/70 text-[15px] max-w-md" data-testid="recovery-branch-copy">
            {BRANCHES.find((b) => b.key === sel)?.copy}
          </motion.p>
        </AnimatePresence>
        <p className="text-white/45 text-[13px] mt-4 max-w-md">A fourth option always exists: stop, and keep the evidence of everything up to this point.</p>
      </div>
    </div>
  );
};

export default function AlterEngine() {
  usePageMeta("Alter Engine", "One outcome. A visible path through the work. Alter Engine turns a required result into a plan, keeps decisions visible, carries out approved work and returns the result with evidence.");
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const go = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    navigate(`/try-alter-engine/new?objective=${encodeURIComponent(text.trim())}`);
  };

  return (
    <>
      {/* HERO — fits the viewport */}
      <section className="bg-black text-[#fbfaf7] relative overflow-clip" style={{ minHeight: "100svh", paddingTop: "calc(var(--header-height) + 48px)" }} data-testid="engine-hero">
        <div className="absolute inset-y-0 left-0 w-[55%] pointer-events-none" style={{ background: "var(--ax-edge-burn)" }} aria-hidden="true" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-[46%_1fr] gap-14 items-center pb-20" style={{ minHeight: "calc(100svh - var(--header-height) - 48px)" }}>
          <div>
            <Reveal><Eyebrow dark className="mb-6">Alter Engine</Eyebrow></Reveal>
            <MaskLines as="h1" lines={["One outcome.", "A visible path", "through the work."]} className="ax-display text-4xl sm:text-5xl lg:text-[64px]" />
            <Reveal delay={0.15}>
              <p className="mt-6 text-white/70 max-w-md text-lg">Alter Engine turns a required result into a plan, keeps important decisions visible, carries out approved work and returns the result with evidence.</p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/try-alter-engine" className="btn-primary" data-testid="engine-hero-cta">Try Alter Engine <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
                <a href="#execution-model" className="btn-ghost-dark ax-fill">See the execution model</a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}><HeroThread /></Reveal>
        </div>
      </section>

      {/* THE FIVE-STAGE CINEMATIC STORY — shared execution canvas */}
      <div id="execution-model">
        <div id="lifecycle" />
        <EngineStory />
      </div>

      {/* RECOVERY — when the path breaks */}
      <section id="recovery" className="bg-black text-[#fbfaf7] py-24 md:py-36 relative overflow-clip border-t border-white/[.07]" data-testid="engine-recovery">
        <GradientRibbon className="-bottom-32 left-0 w-full h-[400px]" flip opacity={0.4} id="axrb-recovery" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal><Eyebrow dark className="mb-6">Failure has a path</Eyebrow></Reveal>
          <MaskLines as="h2" lines={["When the path breaks,", "the work should not disappear."]} className="ax-display text-3xl sm:text-4xl lg:text-[52px] mb-6" />
          <Reveal delay={0.1}>
            <p className="text-white/65 max-w-2xl mb-14">Failures are classified — missing data, connection interruption, conflict — then routed. Nothing fails silently, and every recovery keeps its trail.</p>
          </Reveal>
          <RecoveryBranches />
        </div>
      </section>

      {/* PLATFORM SUPERVISION */}
      <section id="authority" className="bg-[#fbfaf7] py-24 md:py-32" data-testid="engine-platform">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Reveal><Eyebrow className="mb-6">Supervised through AlterX Platform</Eyebrow></Reveal>
            <MaskLines as="h2" lines={["People stay in", "the operating seat."]} className="ax-display text-3xl sm:text-4xl lg:text-[48px]" />
            <Reveal delay={0.12}>
              <p className="mt-6 text-black/70 max-w-lg">AlterX Platform is the workspace where people define outcomes, review plans, approve important actions, follow live progress and keep the evidence behind every result. It is how you operate the Engine — not a separate product competing with it.</p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-4">
                <FillLink to="/platform">Explore the Platform experience</FillLink>
                <FillLink to="/developers">Build with AlterX</FillLink>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="bg-[#0b0b0a] text-[#fbfaf7] rounded-[6px] border border-black/20 p-7" aria-hidden="true">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[13px] font-medium text-white/60">Mission — supplier comparison</span>
                <span className="text-[12px] font-semibold text-[#ff8a3d] flex items-center gap-1.5"><ShieldCheck size={12} aria-hidden="true" /> Needs your decision</span>
              </div>
              <svg viewBox="0 0 420 90" className="w-full h-auto mb-5">
                <path d="M10 45 L120 45" stroke="rgba(251,250,247,.7)" strokeWidth="2" fill="none" />
                <path d="M120 45 L210 45" stroke="#ff4d0a" strokeWidth="2.4" fill="none" />
                <rect x="210" y="31" width="28" height="28" transform="rotate(45 224 45)" fill="none" stroke="#ff4d0a" strokeWidth="2" />
                <path d="M238 45 L410 45" stroke="rgba(255,255,255,.18)" strokeWidth="1.6" fill="none" />
                <circle cx="10" cy="45" r="4" fill="rgba(251,250,247,.7)" />
                <circle cx="120" cy="45" r="4" fill="#ff4d0a" />
                <circle cx="410" cy="45" r="5" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.6" />
              </svg>
              <p className="text-[15px] font-semibold text-white/95 mb-2">Send quote request emails to 3 supplier contacts</p>
              <p className="text-[13px] text-white/55 mb-4">3 outbound messages · no commitments · evidence recorded</p>
              <div className="flex gap-2">
                <span className="bg-[#ff4d0a] text-black text-[12px] font-semibold px-4 py-1.5 rounded-[3px]">Approve</span>
                <span className="border border-white/25 text-white/70 text-[12px] font-medium px-4 py-1.5 rounded-[3px]">Edit</span>
                <span className="border border-white/25 text-white/70 text-[12px] font-medium px-4 py-1.5 rounded-[3px]">Decline</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL COMPOSER — the thread resolves into the input underline */}
      <section className="bg-black text-[#fbfaf7] py-24 md:py-36 relative overflow-clip" data-testid="engine-composer">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(255,77,10,.12) 0%, rgba(255,77,10,0) 60%)" }} aria-hidden="true" />
        <div className="relative max-w-[820px] mx-auto px-6 text-center">
          <MaskLines as="h2" lines={["Start with the outcome."]} className="ax-display text-3xl sm:text-4xl lg:text-[54px]" />
          <p className="mt-5 text-white/60">Review the mission before it runs.</p>
          <form onSubmit={go} className="mt-10">
            <label htmlFor="engine-composer" className="sr-only">Describe the outcome</label>
            <input
              id="engine-composer"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe the outcome…"
              className="w-full bg-transparent border-0 border-b border-white/25 px-1 py-4 text-[18px] text-white text-center placeholder:text-white/35 focus:outline-none focus:border-white/25"
              data-testid="engine-composer-input"
            />
            <svg className="w-full h-2 -mt-[2px]" viewBox="0 0 600 8" preserveAspectRatio="none" aria-hidden="true">
              <ThreadPath d="M0 4 L600 4" strokeWidth={2} duration={1} />
            </svg>
            <div className="mt-8 flex justify-center gap-4">
              <button type="submit" className="btn-primary" data-testid="engine-final-cta">Try Alter Engine <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></button>
              <FillLink to="/contact" dark>Discuss a workflow</FillLink>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
