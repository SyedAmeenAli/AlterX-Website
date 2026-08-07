import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { listMissions, getScenario } from "@/lib/store";

export default function Approvals() {
  const missions = listMissions();
  const pending = missions.filter((m) => m.state === "approval");
  const decisions = missions.flatMap((m) => m.decisions.map((d) => ({ ...d, missionId: m.id })));
  return (
    <div className="p-6 md:p-10 max-w-[1000px]" data-testid="approvals-page">
      <h1 className="ax-display text-3xl mb-2">Approvals</h1>
      <p className="text-white/50 text-[14px] mb-8">Actions waiting for human authority, and the decisions already made.</p>

      <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#ff4d0a] mb-3">Waiting for a decision</h2>
      {pending.length === 0 ? (
        <div className="border border-white/12 p-8 mb-10" data-testid="approvals-empty">
          <p className="text-white/55 text-[14px]">Nothing is waiting for approval. Approvals appear here when a running mission reaches a step that needs human authority.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-10">
          {pending.map((m) => {
            const sc = getScenario(m.scenarioKey);
            const step = sc.steps[m.stepIndex];
            return (
              <Link key={m.id} to={`/try-alter-engine/missions/${m.id}`} className="block border border-[#ff4d0a]/50 p-5 hover:bg-white/[.03] transition-colors" data-testid={`approval-pending-${m.id}`}>
                <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#ff4d0a] mb-2"><ShieldCheck size={12} aria-hidden="true" /> {m.id} · Approval required</p>
                <p className="text-[15px] font-bold text-white/90">{step?.approvalCard?.action}</p>
                <p className="text-[12.5px] text-white/50 mt-1">{step?.approvalCard?.system} · {step?.approvalCard?.risk}</p>
              </Link>
            );
          })}
        </div>
      )}

      <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45 mb-3">Decision history</h2>
      {decisions.length === 0 ? (
        <p className="text-white/40 text-[13px]">No decisions recorded yet.</p>
      ) : (
        <div className="border border-white/12 divide-y divide-white/10">
          {decisions.map((d, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 px-4 py-3" data-testid={`decision-row-${i}`}>
              <Link to={`/try-alter-engine/missions/${d.missionId}`} className="font-mono-ax text-[11px] text-white/45 hover:text-[#ff4d0a]">{d.missionId}</Link>
              <span className={`text-[11px] font-medium uppercase px-2 py-0.5 border ${d.decision === "declined" ? "text-[#ff8a63] border-[#c9360a]/50" : "text-[#ff4d0a] border-[#ff4d0a]/40"}`}>{d.decision}</span>
              <span className="text-[13px] text-white/75 flex-1 min-w-0 truncate">{d.action}</span>
              <span className="text-[11px] text-white/35">{new Date(d.at).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
