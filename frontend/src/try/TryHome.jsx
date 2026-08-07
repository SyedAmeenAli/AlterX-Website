import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { listMissions, createMission } from "@/lib/store";
import { COMPOSER_CHIPS } from "@/content/home";

const STATE_LABEL = { clarify: "Understand", plan: "Plan", approval: "Needs your decision", run: "In progress", failure: "Needs recovery", verify: "Ready to review", complete: "Complete", stopped: "Stopped" };

export default function TryHome() {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const missions = listMissions();

  const start = (value) => {
    const v = (value || text).trim();
    if (!v) return;
    const m = createMission(v);
    navigate(`/try-alter-engine/missions/${m.id}`);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col" data-testid="try-home">
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-16 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(255,77,10,.09) 0%, rgba(255,77,10,.025) 40%, rgba(0,0,0,0) 68%)" }} aria-hidden="true" />
        <div className="relative w-full max-w-[720px] text-center">
          <h1 className="ax-display text-3xl md:text-[46px]">What outcome do you need?</h1>
          <p className="text-white/55 mt-4 max-w-xl mx-auto text-[15px]">Describe the result that must be true at the end. Alter Engine will clarify, plan, pause for your decisions, act and check — all simulated locally.</p>

          <form onSubmit={(e) => { e.preventDefault(); start(); }} className="mt-10 relative" data-tour="composer">
            <label htmlFor="try-composer" className="sr-only">Describe the outcome</label>
            <input
              id="try-composer"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe the outcome…"
              className="w-full bg-black/70 border border-white/20 rounded-[6px] pl-6 pr-[132px] py-5 text-[16px] text-white placeholder:text-white/35 focus:border-[#ff4d0a] focus:outline-none transition-colors"
              data-testid="try-home-composer"
            />
            <button
              type="submit"
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-[4px] px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${text.trim() ? "bg-[#ff4d0a] text-black" : "bg-white/[.07] text-white/45"}`}
              data-testid="try-home-submit"
            >
              Start mission <ArrowRight size={14} aria-hidden="true" />
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {COMPOSER_CHIPS.map((c, i) => (
              <button key={c} onClick={() => setText(c)} className="ax-fill text-[12.5px] font-medium text-white/60 border border-white/12 rounded-[4px] px-3.5 py-2" data-testid={`try-chip-${i}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 pb-12 max-w-[880px] w-full mx-auto">
        {missions.length === 0 ? (
          <p className="text-white/35 text-[13.5px] text-center" data-testid="try-home-empty">No missions yet. Start with the outcome above, or pick an example.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2 px-1">
              <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/45">Recent missions</h2>
              <Link to="/try-alter-engine/missions" className="text-[12.5px] font-semibold text-[#ff4d0a]">All missions</Link>
            </div>
            <div>
              {missions.slice(0, 4).map((m) => (
                <Link key={m.id} to={`/try-alter-engine/missions/${m.id}`} className="ax-fill group flex items-center gap-4 border-t border-white/10 px-1 py-4 text-white/85" data-testid={`try-home-mission-${m.id}`}>
                  <span className="flex-1 text-[14.5px] font-medium truncate">{m.objective}</span>
                  <span className="text-[12px] font-medium text-[#ff8a3d] shrink-0">{STATE_LABEL[m.state] || m.state}</span>
                  <ArrowUpRight size={15} className="ax-arrow shrink-0 opacity-50" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
