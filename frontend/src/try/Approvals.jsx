import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, FileCheck } from "lucide-react";
import { listMissions, getScenario, saveMission } from "@/lib/store";
import { InspectorPanel, InspectorEmpty } from "@/try/InspectorPanel";
import "@/try/try-inspector.css";

const isToday = (ts) => new Date(ts).toDateString() === new Date().toDateString();

export default function Approvals() {
  const navigate = useNavigate();
  const [, force] = useState(0);
  const missions = listMissions();
  const pending = missions.filter((m) => m.state === "approval");
  const decisions = missions.flatMap((m) => m.decisions.map((d) => ({ ...d, missionId: m.id })));
  const approvedToday = decisions.filter((d) => d.decision === "approved" && isToday(d.at)).length;
  const returned = decisions.filter((d) => d.decision === "declined").length;

  const [selectedId, setSelectedId] = useState(pending[0]?.id || null);
  const selected = pending.find((m) => m.id === selectedId) || null;
  const selScenario = selected ? getScenario(selected.scenarioKey) : null;
  const selStep = selected ? selScenario.steps[selected.stepIndex] : null;

  const act = (decision) => {
    if (!selected || !selStep) return;
    const m = { ...selected };
    if (decision === "stop") {
      m.state = "stopped";
      m.recovery = { stepId: selStep.id, choice: "stop" };
      m.history = [...m.history, { ts: Date.now(), type: "recovery", label: "Mission stopped from Approvals" }];
    } else {
      m.decisions = [...m.decisions, { stepId: selStep.id, decision, action: selStep.approvalCard.action, at: Date.now() }];
      m.state = "run";
      m.history = [...m.history, { ts: Date.now(), type: "decision", label: `Decision: ${decision} — ${selStep.approvalCard.action}` }];
      if (decision === "declined") m.stepIndex = m.stepIndex + 1;
    }
    saveMission(m);
    setSelectedId(null);
    force((n) => n + 1);
  };

  return (
    <div className="p-6 md:p-10" data-testid="approvals-page">
      <h1 className="ax-display text-3xl mb-1.5">Decisions waiting for authority.</h1>
      <p className="text-white/50 text-[14px] mb-6">Actions that pause for human judgment, and the decisions already made.</p>

      <div className="flex flex-wrap gap-8 mb-9 pb-6 border-b border-white/10">
        {[["Waiting", pending.length], ["Approved today", approvedToday], ["Returned", returned]].map(([k, v]) => (
          <div key={k}>
            <p className="text-[22px] font-bold text-white/90 leading-none">{v}</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40 mt-1.5">{k}</p>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-[1fr_380px] gap-10 items-start">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#ff4d0a] mb-3">Waiting for a decision</p>
          {pending.length === 0 ? (
            <div className="border border-white/12 rounded-[6px] p-8 mb-10" data-testid="approvals-empty">
              <p className="text-white/55 text-[14px]">Nothing is waiting for approval. Approvals appear here when a running mission reaches a step that needs human authority.</p>
            </div>
          ) : (
            <div className="space-y-2.5 mb-10">
              {pending.map((m) => {
                const sc = getScenario(m.scenarioKey);
                const step = sc.steps[m.stepIndex];
                const isSel = selectedId === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setSelectedId(m.id)}
                    onMouseEnter={() => setSelectedId(m.id)}
                    className={`block w-full text-left border rounded-[6px] p-5 transition-colors ${isSel ? "border-[#ff4d0a]/70 bg-white/[.025]" : "border-white/12 hover:bg-white/[.02]"}`}
                    data-testid={`approval-pending-${m.id}`}
                  >
                    <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#ff4d0a] mb-2"><ShieldCheck size={12} aria-hidden="true" /> {m.id} · Approval required</p>
                    <p className="text-[15px] font-bold text-white/90">{step?.approvalCard?.action}</p>
                    <p className="text-[12.5px] text-white/50 mt-1">{step?.approvalCard?.system} · {step?.approvalCard?.risk}</p>
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45 mb-3">Decision history</p>
          {decisions.length === 0 ? (
            <p className="text-white/40 text-[13px]">No decisions recorded yet.</p>
          ) : (
            <div className="border border-white/12 rounded-[6px] divide-y divide-white/10">
              {decisions.slice().reverse().map((d, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3 px-4 py-3" data-testid={`decision-row-${i}`}>
                  <Link to={`/try-alter-engine/missions/${d.missionId}`} className="font-mono-ax text-[11px] text-white/45 hover:text-[#ff4d0a]">{d.missionId}</Link>
                  <span className={`text-[11px] font-medium uppercase px-2 py-0.5 border rounded-[3px] ${d.decision === "declined" ? "text-[#ff8a63] border-[#c9360a]/50" : "text-[#ff4d0a] border-[#ff4d0a]/40"}`}>{d.decision}</span>
                  <span className="text-[13px] text-white/75 flex-1 min-w-0 truncate">{d.action}</span>
                  <span className="text-[11px] text-white/35">{new Date(d.at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && selStep ? (
          <InspectorPanel testId="approval-inspector" key={selected.id}>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="ax-pulse-once w-6 h-[2px] bg-[#ff4d0a] inline-block shrink-0" aria-hidden="true" />
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#ff4d0a]">Approval required</p>
            </div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40 mb-1.5">Action</p>
            <p className="text-[16px] font-bold text-white/90 mb-5 leading-snug">{selStep.approvalCard.action}</p>

            {[
              ["Why", selStep.approvalCard.reason],
              ["What will change", `${selStep.approvalCard.system} · ${selStep.approvalCard.scope}`],
              ["What will not change", "Prior decisions and existing evidence on this mission"],
              ["Evidence", `${selected.history.length} item${selected.history.length === 1 ? "" : "s"} attached`],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-white/[.07] py-2.5">
                <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40 flex items-center gap-1.5">{k === "Evidence" && <FileCheck size={11} aria-hidden="true" />}{k}</p>
                <p className="text-[13px] text-white/80 mt-1 leading-relaxed">{v}</p>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 mt-6">
              <button onClick={() => act("approved")} className="bg-[#ff4d0a] text-black text-[13px] font-semibold rounded-[5px] px-4 py-2.5" data-testid="approval-inspector-approve">Approve</button>
              <button onClick={() => act("declined")} className="border border-white/20 text-white/75 text-[13px] font-semibold rounded-[5px] px-4 py-2.5" data-testid="approval-inspector-return">Return for revision</button>
              <button onClick={() => act("stop")} className="border border-[#c9360a]/60 text-[#ff8a63] text-[13px] font-semibold rounded-[5px] px-4 py-2.5" data-testid="approval-inspector-stop">Stop mission</button>
            </div>
            <button onClick={() => navigate(`/try-alter-engine/missions/${selected.id}`)} className="block mt-4 text-[12.5px] font-medium text-white/40 hover:text-[#ff4d0a]" data-testid="approval-inspector-open">Open full mission →</button>
          </InspectorPanel>
        ) : pending.length === 0 ? null : (
          <InspectorEmpty testId="approval-inspector-empty">No approval selected.</InspectorEmpty>
        )}
      </div>
    </div>
  );
}
