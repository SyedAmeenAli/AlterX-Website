import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download, ChevronDown } from "lucide-react";
import { listMissions, exportEvidence } from "@/lib/store";

export default function Evidence() {
  const missions = listMissions();
  const [open, setOpen] = useState(missions[0]?.id || null);
  return (
    <div className="p-6 md:p-10 max-w-[1000px]" data-testid="evidence-page">
      <h1 className="ax-display text-3xl mb-2">Evidence</h1>
      <p className="text-white/50 text-[14px] mb-8 max-w-2xl">The trail behind every mission — decisions, approvals, artifacts, checks, failures and recoveries. Export produces a real local JSON file.</p>
      {missions.length === 0 ? (
        <div className="border border-white/12 p-10 text-center" data-testid="evidence-empty">
          <p className="text-white/55 text-[14px]">No evidence yet. Run a mission and its trail will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map((m) => (
            <div key={m.id} className="border border-white/12" data-testid={`evidence-mission-${m.id}`}>
              <button onClick={() => setOpen(open === m.id ? null : m.id)} className="w-full flex items-center gap-4 px-5 py-4 text-left" aria-expanded={open === m.id} data-testid={`evidence-toggle-${m.id}`}>
                <span className="font-mono-ax text-[11px] text-white/50">{m.id}</span>
                <span className="flex-1 text-[14px] font-bold text-white/85 truncate">{m.objective}</span>
                <span className="font-mono-ax text-[10px] text-white/40">{m.history.length} events</span>
                <ChevronDown size={14} className={`text-white/40 transition-transform ${open === m.id ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {open === m.id && (
                <div className="border-t border-white/10 px-5 py-4">
                  <div className="space-y-2 mb-4">
                    {m.history.map((h, i) => (
                      <div key={i} className="flex gap-3 text-[12.5px]" data-testid={`evidence-event-${m.id}-${i}`}>
                        <span className="font-mono-ax text-[10px] text-white/35 w-[130px] shrink-0">{new Date(h.ts).toLocaleString()}</span>
                        <span className={`font-mono-ax text-[9px] uppercase w-[70px] shrink-0 ${h.type === "failure" ? "text-[#ff8a63]" : h.type === "decision" || h.type === "approval" ? "text-[#ff5a1f]" : "text-white/45"}`}>{h.type}</span>
                        <span className="text-white/70">{h.label}{h.detail && <span className="text-white/40"> — {h.detail}</span>}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => exportEvidence(m)} className="bg-[#ff5a1f] text-black text-[12px] font-bold px-3.5 py-1.5 flex items-center gap-1.5" data-testid={`evidence-export-${m.id}`}>
                      <Download size={11} aria-hidden="true" /> Export JSON
                    </button>
                    <Link to={`/try-alter-engine/missions/${m.id}`} className="border border-white/20 text-white/70 text-[12px] px-3.5 py-1.5">Open mission</Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
