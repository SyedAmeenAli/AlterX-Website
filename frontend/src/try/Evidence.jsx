import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download, ChevronDown, FileCheck, Check } from "lucide-react";
import { listMissions, exportEvidence, exportAllEvidence } from "@/lib/store";
import { InspectorPanel, InspectorEmpty, InspectorRow } from "@/try/InspectorPanel";

const STATE_LABEL = { created: "Recorded", decision: "Decided", approval: "Approved", failure: "Failed", recovery: "Recovered", check: "Checked" };

export default function Evidence() {
  const missions = listMissions();
  const [open, setOpen] = useState(missions[0]?.id || null);
  const [selected, setSelected] = useState(missions[0] && missions[0].history.length ? { missionId: missions[0].id, index: missions[0].history.length - 1 } : null);
  const [exported, setExported] = useState(null); // mission id (or "all") that just exported
  const flashExported = (key) => { setExported(key); setTimeout(() => setExported((k) => (k === key ? null : k)), 1800); };

  const selMission = selected ? missions.find((m) => m.id === selected.missionId) : null;
  const selEvent = selMission ? selMission.history[selected.index] : null;

  return (
    <div className="p-6 md:p-10" data-testid="evidence-page">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="ax-display text-3xl mb-2">What the work used, and what happened.</h1>
          <p className="text-white/50 text-[14px] max-w-2xl">The trail behind every mission — decisions, approvals, artifacts, checks, failures and recoveries. Export produces a real local JSON file.</p>
        </div>
        {missions.length > 0 && (
          <button
            onClick={() => { exportAllEvidence(missions); flashExported("all"); }}
            className="border border-white/20 text-white/75 hover:border-[#ff4d0a]/50 text-[13px] font-semibold rounded-[5px] px-4 py-2.5 flex items-center gap-1.5 shrink-0 transition-colors"
            data-testid="evidence-export-all"
          >
            {exported === "all" ? <><Check size={13} className="text-[#ff4d0a]" aria-hidden="true" />Exported</> : <><Download size={13} aria-hidden="true" />Export all evidence</>}
          </button>
        )}
      </div>

      {missions.length === 0 ? (
        <div className="border border-white/12 rounded-[6px] p-10 text-center" data-testid="evidence-empty">
          <p className="text-white/55 text-[14px]">No evidence yet. Run a mission and its trail will appear here.</p>
        </div>
      ) : (
        <div className="grid xl:grid-cols-[1fr_360px] gap-10 items-start">
          <div className="min-w-0 space-y-3">
            {missions.map((m) => (
              <div key={m.id} className="border border-white/12 rounded-[6px]" data-testid={`evidence-mission-${m.id}`}>
                <button onClick={() => setOpen(open === m.id ? null : m.id)} className="w-full flex items-center gap-4 px-5 py-4 text-left" aria-expanded={open === m.id} data-testid={`evidence-toggle-${m.id}`}>
                  <span className="font-mono-ax text-[11px] text-white/50">{m.id}</span>
                  <span className="flex-1 text-[14px] font-bold text-white/85 truncate">{m.objective}</span>
                  <span className="text-[11px] text-white/40">{m.history.length} events</span>
                  <ChevronDown size={14} className={`text-white/40 transition-transform ${open === m.id ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {open === m.id && (
                  <div className="border-t border-white/10 divide-y divide-white/[.06]">
                    {m.history.map((h, i) => {
                      const isSel = selected?.missionId === m.id && selected?.index === i;
                      return (
                        <div
                          key={i}
                          onClick={() => setSelected({ missionId: m.id, index: i })}
                          onMouseEnter={() => setSelected({ missionId: m.id, index: i })}
                          className={`relative flex gap-3 text-[12.5px] px-5 py-2.5 cursor-pointer transition-colors ${isSel ? "bg-white/[.03]" : ""}`}
                          data-testid={`evidence-event-${m.id}-${i}`}
                          role="button"
                          tabIndex={0}
                        >
                          <span className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#ff4d0a] transition-opacity duration-200 ${isSel ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                          <span className="font-mono-ax text-[10px] text-white/35 w-[130px] shrink-0">{new Date(h.ts).toLocaleString()}</span>
                          <span className={`font-mono-ax text-[10px] font-medium w-[70px] shrink-0 ${h.type === "failure" ? "text-[#ff8a63]" : h.type === "decision" || h.type === "approval" ? "text-[#ff4d0a]" : "text-white/45"}`}>{h.type}</span>
                          <span className="text-white/70">{h.label}{h.detail && <span className="text-white/40"> — {h.detail}</span>}</span>
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-2 px-5 py-3.5">
                      <button onClick={() => { exportEvidence(m); flashExported(m.id); }} className="bg-[#ff4d0a] text-black text-[12px] font-bold px-3.5 py-1.5 rounded-[4px] flex items-center gap-1.5 transition-colors" data-testid={`evidence-export-${m.id}`}>
                        {exported === m.id ? <><Check size={11} aria-hidden="true" /> Exported</> : <><Download size={11} aria-hidden="true" /> Export JSON</>}
                      </button>
                      <Link to={`/try-alter-engine/missions/${m.id}`} className="border border-white/20 text-white/70 text-[12px] px-3.5 py-1.5 rounded-[4px]">Open mission</Link>
                      {exported === m.id && <span className="text-[11px] text-white/40" data-testid={`evidence-exported-note-${m.id}`}>Saved to your downloads</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selEvent ? (
            <InspectorPanel testId="evidence-inspector" key={`${selected.missionId}-${selected.index}`}>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40 mb-1.5 flex items-center gap-1.5"><FileCheck size={12} className="text-[#ff4d0a]" aria-hidden="true" />Selected evidence</p>
              <p className="text-[16px] font-bold text-white/90 mb-5 leading-snug">{selEvent.label}</p>
              <InspectorRow label="State" value={STATE_LABEL[selEvent.type] || selEvent.type} />
              <InspectorRow label="Source" value={`${selMission.id} · ${selMission.objective}`} />
              <InspectorRow label="Used by" value={`Mission ${selMission.id}`} />
              <InspectorRow label="Related event" value={<span className="font-mono-ax text-[12px]">{selEvent.type}{selEvent.detail ? ` — ${selEvent.detail}` : ""}</span>} />
              <Link to={`/try-alter-engine/missions/${selMission.id}`} className="inline-block mt-5 text-[13px] font-semibold text-[#ff4d0a]" data-testid="evidence-inspector-open">Open mission →</Link>
            </InspectorPanel>
          ) : (
            <InspectorEmpty testId="evidence-inspector-empty">No evidence selected. Select an event to inspect it.</InspectorEmpty>
          )}
        </div>
      )}
    </div>
  );
}
