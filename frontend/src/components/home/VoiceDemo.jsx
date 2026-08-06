import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Play, RotateCcw, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { VOICE_INDUSTRIES } from "@/content/home";
import { ChapterHead } from "@/components/kit";
import { EASE } from "@/lib/anim";

const VOICE_ENABLED = process.env.REACT_APP_VOICE_WORKFLOWS_ENABLED === "true";

export default function VoiceDemo() {
  const [tab, setTab] = useState(0);
  const [line, setLine] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [awaiting, setAwaiting] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef();
  const ind = VOICE_INDUSTRIES[tab];

  const reset = useCallback(() => {
    clearTimeout(timer.current);
    setLine(-1); setPlaying(false); setAwaiting(false); setDone(false);
  }, []);

  useEffect(() => { reset(); }, [tab, reset]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const advance = useCallback((from) => {
    const next = from + 1;
    if (next >= ind.transcript.length) { setPlaying(false); setDone(true); return; }
    setLine(next);
    if (ind.transcript[next].approval) { setAwaiting(true); setPlaying(false); return; }
    timer.current = setTimeout(() => advance(next), 1500);
  }, [ind]);

  const play = () => {
    reset();
    setPlaying(true);
    timer.current = setTimeout(() => advance(-1), 300);
  };

  const approve = () => {
    setAwaiting(false); setPlaying(true);
    timer.current = setTimeout(() => advance(line), 400);
  };

  return (
    <section className="bg-[#fbfaf7] py-24 md:py-36 cv-auto" data-testid="voice-section">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <ChapterHead
          num="05"
          eyebrow="Voice workflows"
          title="One conversation can still contain real work."
          body="A customer may speak in one channel, but the answer can depend on identity, policy, systems, approvals and follow-up actions."
        />
        <div className="flex flex-wrap gap-1 mb-8" role="tablist" aria-label="Industry examples">
          {VOICE_INDUSTRIES.map((v, i) => (
            <button
              key={v.key}
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={`ax-fill px-5 py-2.5 font-semibold text-[14px] border ${tab === i ? "border-[#ff5a1f]" : "border-black/15"} text-[#090909]`}
              data-active={tab === i}
              data-testid={`voice-tab-${v.key}`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="text-black/60 max-w-2xl mb-8 text-[16px]" data-testid="voice-scenario">{ind.scenario}</p>

        <div className="grid lg:grid-cols-[1.4fr_1fr] border border-black/15 bg-black text-[#fbfaf7]">
          <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-white/12">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono-ax text-[10px] uppercase tracking-wider text-[#ff5a1f]">Illustrative customer-conversation workflow</span>
              <div className="flex gap-2">
                <button onClick={play} className="btn-primary !py-1.5 !px-3.5 !text-[12px]" disabled={playing || awaiting} data-testid="voice-play-btn">
                  <Play size={12} aria-hidden="true" /> {line >= 0 ? "Restart" : "Play"}
                </button>
                <button onClick={reset} className="btn-ghost-dark !py-1.5 !px-3.5 !text-[12px]" aria-label="Replay from start" data-testid="voice-replay-btn">
                  <RotateCcw size={12} aria-hidden="true" /> Reset
                </button>
              </div>
            </div>
            <div className={`flex items-center gap-[3px] h-9 mb-6 ${playing ? "ax-wave-on" : ""}`} aria-hidden="true" data-testid="voice-waveform">
              {Array.from({ length: 36 }).map((_, i) => (
                <span key={i} className="ax-wave-bar w-[3px] bg-[#ff5a1f]" style={{ height: `${28 + (i % 5) * 12}%`, animationDelay: `${(i % 7) * 0.09}s` }} />
              ))}
            </div>
            <div className="space-y-3 min-h-[280px]" aria-live="polite">
              {ind.transcript.map((t, i) => (
                <AnimatePresence key={`${tab}-${i}`}>
                  {i <= line && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className={`max-w-[85%] ${t.who === "customer" ? "" : t.who === "sys" ? "mx-auto w-full max-w-full" : "ml-auto"}`}
                    >
                      {t.who === "sys" ? (
                        <div className={`border px-4 py-2.5 text-[12px] font-mono-ax ${t.approval ? "border-[#ff5a1f]/60 text-[#ff761f]" : "border-white/15 text-white/55"}`}>
                          {t.approval && <ShieldCheck size={11} className="inline mr-2 -mt-0.5" aria-hidden="true" />}{t.text}
                        </div>
                      ) : (
                        <div className={`px-4 py-3 text-[14px] ${t.who === "customer" ? "bg-white/[.07] text-white/85" : "bg-[#ff5a1f]/[.12] border border-[#ff5a1f]/25 text-white/90"}`}>
                          <span className="block font-mono-ax text-[9px] uppercase tracking-wider opacity-50 mb-1">{t.who === "customer" ? "Customer" : "Workflow"}</span>
                          {t.text}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
              {line < 0 && <p className="text-white/35 text-[14px]">Press Play to walk through the conversation.</p>}
            </div>
          </div>

          <div className="p-6 md:p-8 bg-[#090909]">
            <p className="font-mono-ax text-[10px] uppercase tracking-wider text-white/45 mb-4">What the system understood</p>
            <ul className="space-y-2.5 mb-8">
              {ind.understood.map((u, i) => (
                <li key={u} className={`flex items-start gap-2.5 text-[14px] transition-opacity duration-300 ${line >= i + 1 ? "opacity-100 text-white/85" : "opacity-30 text-white/50"}`}>
                  <Check size={13} className="text-[#ff5a1f] mt-1 shrink-0" aria-hidden="true" /> {u}
                </li>
              ))}
            </ul>
            <AnimatePresence>
              {awaiting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border border-[#ff5a1f]/60 p-4 mb-6"
                  data-testid="voice-approval-card"
                >
                  <p className="font-mono-ax text-[10px] text-[#ff5a1f] uppercase tracking-wider mb-2">Human approval required</p>
                  <p className="text-[13px] text-white/80 mb-4">{ind.transcript[line]?.text}</p>
                  <button onClick={approve} className="btn-primary !py-2 !px-4 !text-[13px]" data-testid="voice-approve-btn">
                    Approve and continue
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {done && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-white/15 p-4" data-testid="voice-outcome">
                <p className="font-mono-ax text-[10px] text-[#ff5a1f] uppercase tracking-wider mb-2">Resolved outcome</p>
                <p className="text-[13px] text-white/80">{ind.outcome}</p>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <Link to="/contact" className="btn-primary" data-testid="voice-cta">
            {VOICE_ENABLED ? "Explore voice workflows" : "Discuss a customer workflow"} <ArrowRight size={15} className="ax-arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
