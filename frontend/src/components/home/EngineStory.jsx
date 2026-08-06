import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleDot, Clock, ShieldCheck, RotateCcw } from "lucide-react";
import { ENGINE_STORY } from "@/content/home";
import { Eyebrow } from "@/components/kit";
import { EASE } from "@/lib/anim";

const StageVisual = ({ stage }) => {
  if (stage === 0)
    return (
      <div className="space-y-4" data-testid="story-visual-understand">
        <div>
          <p className="font-mono-ax text-[10px] text-white/40 uppercase tracking-wider mb-2">Outcome</p>
          <div className="border border-white/20 p-4 text-[15px] text-white/90">Prepare a decision-ready supplier comparison.</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[["Context", "3 candidate suppliers · Q3 contract"], ["Constraints", "No commitments without approval"], ["Success criteria", "Side-by-side comparison + recommendation"], ["Evidence", "Every data point keeps its source"]].map(([t, d]) => (
            <div key={t} className="border border-white/12 p-3">
              <p className="font-mono-ax text-[10px] text-[#ff5a1f] uppercase tracking-wider">{t}</p>
              <p className="text-[13px] text-white/65 mt-1">{d}</p>
            </div>
          ))}
        </div>
      </div>
    );
  if (stage === 1)
    return (
      <div className="space-y-2.5" data-testid="story-visual-plan">
        {[["Collect supplier records", "Documents", "Supplier profile set", false],
          ["Request updated quotes", "Communication", "Three current quotes", true],
          ["Normalize pricing data", "Data · parallel", "Comparable cost model", false],
          ["Score suppliers against criteria", "Data", "Weighted scorecard", false],
          ["Assemble decision brief", "Documents", "Decision-ready brief", false]].map(([t, s, o, ap], i) => (
          <div key={t} className={`flex items-center gap-4 border p-3 ${ap ? "border-[#ff5a1f]/60" : "border-white/12"}`}>
            <span className="font-mono-ax text-[10px] text-white/40 w-6">{String(i + 1).padStart(2, "0")}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-white/90">{t}</p>
              <p className="text-[11px] text-white/45">{s} → {o}</p>
            </div>
            {ap && <span className="font-mono-ax text-[9px] text-[#ff5a1f] border border-[#ff5a1f]/50 px-1.5 py-0.5 shrink-0">APPROVAL</span>}
          </div>
        ))}
      </div>
    );
  if (stage === 2)
    return (
      <div className="border border-[#ff5a1f]/50 p-5" data-testid="story-visual-approve">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={15} className="text-[#ff5a1f]" aria-hidden="true" />
          <span className="font-mono-ax text-[10px] text-[#ff5a1f] uppercase tracking-wider">Approval required</span>
        </div>
        <p className="text-[15px] font-semibold text-white/95">Send quote request emails to 3 supplier contacts</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-4 text-[12px]">
          {[["Affected system", "Communication (email)"], ["Reason", "Existing quotes are 40+ days old"], ["Scope", "3 outbound messages, no commitments"], ["Risk", "Low — outbound request only"]].map(([t, d]) => (
            <div key={t}><p className="text-white/40">{t}</p><p className="text-white/80">{d}</p></div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-5">
          <span className="bg-[#ff5a1f] text-black text-[12px] font-bold px-4 py-1.5">Approve</span>
          {["Edit", "Request context", "Decline"].map((b) => (
            <span key={b} className="border border-white/25 text-white/70 text-[12px] font-semibold px-4 py-1.5">{b}</span>
          ))}
        </div>
      </div>
    );
  if (stage === 3)
    return (
      <div className="space-y-2.5" data-testid="story-visual-act">
        {[["Collect supplier records", "done"], ["Request updated quotes", "done"], ["Normalize pricing data", "running"], ["Score suppliers against criteria", "waiting"], ["Assemble decision brief", "waiting"]].map(([t, st]) => (
          <div key={t} className={`flex items-center gap-3 border p-3 ${st === "running" ? "border-[#ff5a1f]/60" : "border-white/12"}`}>
            {st === "done" && <Check size={14} className="text-[#ff5a1f]" aria-hidden="true" />}
            {st === "running" && <CircleDot size={14} className="text-[#ff761f] animate-pulse" aria-hidden="true" />}
            {st === "waiting" && <Clock size={14} className="text-white/35" aria-hidden="true" />}
            <p className={`text-[14px] font-semibold flex-1 ${st === "waiting" ? "text-white/45" : "text-white/90"}`}>{t}</p>
            <span className="font-mono-ax text-[9px] uppercase tracking-wider text-white/40">{st}</span>
          </div>
        ))}
        <p className="text-[11px] text-white/40 pt-1">Connected systems: Documents · Communication · Data</p>
      </div>
    );
  return (
    <div className="space-y-4" data-testid="story-visual-check">
      <div className="border border-white/15 p-4">
        <p className="font-mono-ax text-[10px] text-[#ff5a1f] uppercase tracking-wider mb-1.5">Result</p>
        <p className="text-[14px] text-white/90">Decision-ready supplier comparison with weighted scorecard and recommendation.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-white/12 p-3">
          <p className="font-mono-ax text-[10px] text-white/40 uppercase tracking-wider mb-2">Checks</p>
          {["All suppliers covered", "Quotes current", "Sources attached"].map((c) => (
            <p key={c} className="flex items-center gap-2 text-[12px] text-white/75 mb-1"><Check size={11} className="text-[#ff5a1f]" aria-hidden="true" />{c}</p>
          ))}
        </div>
        <div className="border border-[#ff5a1f]/50 p-3">
          <p className="font-mono-ax text-[10px] text-[#ff5a1f] uppercase tracking-wider mb-2 flex items-center gap-1.5"><RotateCcw size={10} aria-hidden="true" />Returned for revision</p>
          <p className="text-[12px] text-white/75">Reasoning for lead-time weighting was thin — the step ran again before the result was accepted.</p>
        </div>
      </div>
    </div>
  );
};

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

  const Rail = ({ activeStage, onPick }) => (
    <div className="space-y-1">
      {ENGINE_STORY.map((s, i) => (
        <button
          key={s.stage}
          onClick={() => onPick && onPick(i)}
          className={`w-full text-left p-4 border-l-2 transition-colors duration-300 ${i === activeStage ? "border-[#ff5a1f] bg-white/[.04]" : "border-white/10"}`}
          data-testid={`story-stage-${s.stage.toLowerCase()}`}
          aria-current={i === activeStage}
        >
          <span className={`font-mono-ax text-[10px] tracking-wider ${i === activeStage ? "text-[#ff5a1f]" : "text-white/35"}`}>0{i + 1}</span>
          <span className={`block text-lg font-bold tracking-tight mt-0.5 ${i === activeStage ? "text-[#fbfaf7]" : "text-white/45"}`}>{s.stage}</span>
          <AnimatePresence initial={false}>
            {i === activeStage && (
              <motion.span
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="block text-[14px] text-white/60 overflow-hidden"
              >
                <span className="block pt-1.5">{s.copy}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      ))}
    </div>
  );

  const Canvas = ({ activeStage }) => (
    <div className="border border-white/15 bg-[#090909] h-full flex flex-col" data-testid="story-canvas">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/12">
        <span className="font-mono-ax text-[11px] text-white/55">AX-M-001 · Supplier comparison</span>
        <span className="font-mono-ax text-[10px] text-[#ff5a1f] uppercase tracking-wider">{ENGINE_STORY[activeStage].stage}</span>
      </div>
      <div className="p-5 md:p-7 flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <StageVisual stage={activeStage} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex border-t border-white/12" aria-hidden="true">
        {ENGINE_STORY.map((s, i) => (
          <div key={s.stage} className={`h-1 flex-1 ${i <= activeStage ? "bg-[#ff5a1f]" : "bg-white/10"} transition-colors duration-500`} />
        ))}
      </div>
    </div>
  );

  return (
    <section id="how-it-works" className="bg-black text-[#fbfaf7] relative" data-testid="engine-story-section">
      <div className="absolute inset-x-0 top-0 h-[80vh] pointer-events-none" style={{ background: "var(--ax-atmo-dark)" }} aria-hidden="true" />
      {isDesktop ? (
        <div ref={wrapRef} style={{ height: "520vh" }}>
          <div className="sticky top-0 h-screen flex flex-col justify-center" style={{ paddingTop: "var(--header-height)" }}>
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full">
              <div className="mb-10">
                <Eyebrow dark className="mb-4">02 · How Alter Engine works</Eyebrow>
                <h2 className="ax-display text-3xl lg:text-5xl">One outcome. A visible path through the work.</h2>
                <p className="mt-4 text-white/60 max-w-2xl">Alter Engine keeps the objective, plan, decisions, progress and result connected from beginning to end.</p>
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
          <Eyebrow dark className="mb-4">02 · How Alter Engine works</Eyebrow>
          <h2 className="ax-display text-3xl sm:text-4xl">One outcome. A visible path through the work.</h2>
          <p className="mt-4 text-white/60">Alter Engine keeps the objective, plan, decisions, progress and result connected from beginning to end.</p>
          <div className="mt-10 space-y-10">
            {ENGINE_STORY.map((s, i) => (
              <div key={s.stage}>
                <p className="font-mono-ax text-[11px] text-[#ff5a1f] mb-1.5">0{i + 1} · {s.stage.toUpperCase()}</p>
                <p className="text-white/70 mb-4">{s.copy}</p>
                <div className="border border-white/15 bg-[#090909] p-4"><StageVisual stage={i} /></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
