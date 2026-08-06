import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { listMissions, createMission } from "@/lib/store";
import { COMPOSER_CHIPS } from "@/content/home";
import { STAGES } from "@/content/home";

const STATE_LABEL = { clarify: "Understand", plan: "Plan", approval: "Approve", run: "Act", failure: "Recovery", verify: "Check", complete: "Complete", stopped: "Stopped" };

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
    <div className="p-6 md:p-10 max-w-[1100px]" data-testid="try-home">
      <p className="font-mono-ax text-[11px] text-[#ff5a1f] uppercase tracking-wider mb-3">Alter Engine · Illustrative frontend demonstration</p>
      <h1 className="ax-display text-3xl md:text-[44px] max-w-2xl">What outcome do you need?</h1>
      <p className="text-white/55 mt-3 max-w-xl">Describe the result that must be true at the end. Alter Engine will clarify, plan, pause for approvals, act and check — all simulated locally, with no real external action.</p>

      <form onSubmit={(e) => { e.preventDefault(); start(); }} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl" data-tour="composer">
        <label htmlFor="try-composer" className="sr-only">Describe the result that must be true at the end</label>
        <input
          id="try-composer"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the result that must be true at the end..."
          className="flex-1 bg-black border border-white/20 px-4 py-3.5 text-[14px] text-white placeholder:text-white/35 focus:border-[#ff5a1f] focus:outline-none"
          data-testid="try-home-composer"
        />
        <button type="submit" className="btn-primary justify-center !text-[14px]" data-testid="try-home-submit">
          Start mission <ArrowRight size={14} className="ax-arrow" aria-hidden="true" />
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2 max-w-2xl">
        {COMPOSER_CHIPS.map((c, i) => (
          <button key={c} onClick={() => start(c)} className="ax-fill text-[12px] font-semibold text-white/60 border border-white/15 px-3.5 py-1.5" data-testid={`try-chip-${i}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-14 grid md:grid-cols-[1fr_320px] gap-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[17px]">Recent missions</h2>
            <Link to="/try-alter-engine/missions" className="text-[12px] font-bold text-[#ff5a1f]">All missions</Link>
          </div>
          {missions.length === 0 ? (
            <div className="border border-white/12 p-8 text-center" data-testid="try-home-empty">
              <Plus size={20} className="mx-auto text-white/30 mb-3" aria-hidden="true" />
              <p className="text-white/50 text-[14px]">No missions yet. Start with the outcome above, or pick an example.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {missions.slice(0, 4).map((m) => (
                <Link key={m.id} to={`/try-alter-engine/missions/${m.id}`} className="ax-fill flex items-center gap-4 border border-white/12 px-4 py-3.5 text-white/85" data-testid={`try-home-mission-${m.id}`}>
                  <span className="font-mono-ax text-[11px] text-white/45">{m.id}</span>
                  <span className="flex-1 text-[13px] font-semibold truncate">{m.objective}</span>
                  <span className="font-mono-ax text-[10px] uppercase text-[#ff5a1f]">{STATE_LABEL[m.state] || m.state}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <aside className="border border-white/12 p-6 self-start">
          <p className="font-mono-ax text-[10px] uppercase tracking-wider text-white/45 mb-4">The lifecycle</p>
          {STAGES.map((s, i) => (
            <p key={s} className="flex items-center gap-3 py-1.5 text-[13px] text-white/70">
              <span className="font-mono-ax text-[10px] text-[#ff5a1f]">0{i + 1}</span> {s}
            </p>
          ))}
          <p className="text-[12px] text-white/40 mt-4 pt-4 border-t border-white/10">Every simulated mission is an illustrative frontend demonstration. No real external action occurs.</p>
        </aside>
      </div>
    </div>
  );
}
