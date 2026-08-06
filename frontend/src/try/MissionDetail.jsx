import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleDot, Clock, ShieldCheck, X, Pause, Play, AlertTriangle, RotateCcw, Download, Repeat } from "lucide-react";
import { getMission, saveMission, getScenario, logEvent, exportEvidence, saveWorkflow } from "@/lib/store";
import { DemoBadge } from "@/components/kit";
import { EASE } from "@/lib/anim";

const STATE_LABEL = { clarify: "Understand", plan: "Plan", approval: "Approve", run: "Act", failure: "Recovery", verify: "Check", complete: "Complete", stopped: "Stopped" };

const Btn = ({ children, primary, onClick, testid, danger }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-[13px] font-bold transition-colors ${primary ? "bg-[#ff5a1f] text-black hover:bg-[#ff761f]" : danger ? "border border-[#bd3510] text-[#ff8a63] hover:bg-[#bd3510]/20" : "border border-white/25 text-white/80 hover:border-[#ff5a1f]/60"}`}
    data-testid={testid}
  >
    {children}
  </button>
);

const Graph = ({ steps, stepIndex, completed, onPick, selected }) => (
  <svg viewBox={`0 0 ${80 + steps.length * 95} 120`} className="w-full h-[110px]" role="group" aria-label="Mission dependency graph">
    {steps.map((s, i) => {
      const x = 50 + i * 95;
      const y = s.parallel ? 30 : 75;
      const prevY = i > 0 && steps[i - 1].parallel ? 30 : 75;
      const done = completed.includes(s.id);
      const active = i === stepIndex;
      return (
        <g key={s.id}>
          {i > 0 && <path d={`M ${x - 95 + 24} ${prevY} H ${x - 50} ${s.parallel || steps[i - 1].parallel ? `L ${x - 24} ${y}` : `H ${x - 24}`}`} stroke={done || active ? "#ff5a1f" : "rgba(255,255,255,.25)"} strokeWidth="1.4" fill="none" />}
          <circle
            cx={x} cy={y} r="15"
            fill={done ? "#ff5a1f" : active ? "#090909" : "#090909"}
            stroke={done || active ? "#ff5a1f" : selected === s.id ? "#fbfaf7" : "rgba(255,255,255,.3)"}
            strokeWidth={active ? 2.5 : 1.5}
            className="cursor-pointer"
            onClick={() => onPick(s)}
            role="button"
            tabIndex={0}
            aria-label={`Inspect step: ${s.label}`}
            onKeyDown={(e) => { if (e.key === "Enter") onPick(s); }}
            data-testid={`graph-node-${s.id}`}
          />
          <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={done ? "#000" : "#fbfaf7"} pointerEvents="none">{i + 1}</text>
          {s.approval && <text x={x} y={y - 22} textAnchor="middle" fontSize="7" fill="#ff761f" fontFamily="JetBrains Mono">APPROVAL</text>}
          <text x={x} y={y + 32} textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,.5)">{s.label.length > 18 ? s.label.slice(0, 17) + "…" : s.label}</text>
        </g>
      );
    })}
  </svg>
);

const Inspector = ({ step, mission, onClose }) => {
  if (!step) return null;
  const done = mission.completedSteps.includes(step.id);
  return (
    <aside className="w-full lg:w-[320px] shrink-0 border border-white/15 bg-black p-5 self-start lg:sticky lg:top-[76px]" aria-label="Step inspector" data-testid="step-inspector">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono-ax text-[10px] text-[#ff5a1f] uppercase tracking-wider">Step inspector</p>
        <button onClick={onClose} aria-label="Close inspector" className="text-white/50 hover:text-white" data-testid="inspector-close"><X size={15} /></button>
      </div>
      <p className="font-bold text-[15px] mb-4">{step.label}</p>
      {[
        ["Input", step.detail],
        ["Output", step.output],
        ["System", step.system],
        ["Permission", step.approval ? `Requires approval · ${step.approvalCard?.scope || "scoped"}` : "Scoped to granted connection permissions"],
        ["Evidence", done ? `Artifact recorded: ${step.output}` : "Produced when the step completes"],
        ["Quality state", done ? "Completed · pending final check" : "Not yet evaluated"],
      ].map(([k, v]) => (
        <div key={k} className="border-t border-white/10 py-2.5">
          <p className="font-mono-ax text-[9px] uppercase tracking-wider text-white/40">{k}</p>
          <p className="text-[12.5px] text-white/80 mt-1">{v}</p>
        </div>
      ))}
    </aside>
  );
};

export default function MissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(() => getMission(id));
  const [inspected, setInspected] = useState(null);
  const [paused, setPaused] = useState(false);
  const [answer, setAnswer] = useState("");
  const [editingObjective, setEditingObjective] = useState(false);
  const [changeNote, setChangeNote] = useState("");
  const [showChange, setShowChange] = useState(false);
  const [approvalMode, setApprovalMode] = useState(null);
  const [editScope, setEditScope] = useState("");
  const [clarifyRecovery, setClarifyRecovery] = useState("");
  const [savedWf, setSavedWf] = useState(false);
  const timer = useRef();
  const scenario = mission ? getScenario(mission.scenarioKey) : null;

  const update = useCallback((patch, log) => {
    setMission((m) => {
      const next = { ...m, ...patch };
      if (log) next.history = [...next.history, { ts: Date.now(), ...log }];
      saveMission(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!mission || mission.state !== "run" || paused) return undefined;
    const idx = mission.stepIndex;
    const steps = scenario.steps;
    if (idx >= steps.length) {
      update({ state: "verify" }, { type: "state", label: "All steps finished — checking result against criteria" });
      return undefined;
    }
    const step = steps[idx];
    if (step.approval && !mission.decisions.find((d) => d.stepId === step.id)) {
      update({ state: "approval" }, { type: "approval", label: `Approval requested: ${step.approvalCard.action}` });
      return undefined;
    }
    if (step.failure && mission.recovery?.stepId !== step.id && !mission.completedSteps.includes(step.id)) {
      timer.current = setTimeout(() => {
        update({ state: "failure" }, { type: "failure", label: `Step failed: ${step.failureCard.what}` });
      }, 1400);
      return () => clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      update(
        { completedSteps: [...mission.completedSteps, step.id], stepIndex: idx + 1 },
        { type: "step", label: `Completed: ${step.label}`, detail: `Output: ${step.output}` }
      );
    }, 1700);
    return () => clearTimeout(timer.current);
  }, [mission, paused, scenario, update]);

  if (!mission) {
    return (
      <div className="p-10" data-testid="mission-not-found">
        <p className="text-white/60">Mission not found in this browser's demo storage.</p>
        <Link to="/try-alter-engine/missions" className="text-[#ff5a1f] font-bold text-[14px] mt-3 inline-block">Back to missions</Link>
      </div>
    );
  }

  const steps = scenario.steps;
  const currentStep = steps[Math.min(mission.stepIndex, steps.length - 1)];
  const weakResolved = mission.history.some((h) => h.type === "revision");

  const decide = (decision) => {
    const step = currentStep;
    const d = { stepId: step.id, decision, action: step.approvalCard.action, at: Date.now(), editedScope: decision === "edited" ? editScope : undefined };
    setApprovalMode(null);
    update(
      {
        decisions: [...mission.decisions, d],
        state: "run",
        stepIndex: decision === "declined" ? mission.stepIndex + 1 : mission.stepIndex,
        completedSteps: decision === "declined" ? mission.completedSteps : mission.completedSteps,
      },
      { type: "decision", label: `Decision: ${decision} — ${step.approvalCard.action}`, detail: d.editedScope ? `Edited scope: ${d.editedScope}` : "" }
    );
  };

  const recover = (choice) => {
    const step = currentStep;
    if (choice === "stop") {
      update({ state: "stopped", recovery: { stepId: step.id, choice } }, { type: "recovery", label: "Mission stopped by user after failure" });
      return;
    }
    const labels = { retry: "Retry the step", alternate: "Use alternate route", clarify: "Clarification provided" };
    update(
      { state: "run", recovery: { stepId: step.id, choice, note: choice === "clarify" ? clarifyRecovery : undefined } },
      { type: "recovery", label: `Recovery: ${labels[choice]}`, detail: choice === "clarify" ? clarifyRecovery : `${step.failureCard.classification} handled via ${labels[choice].toLowerCase()}` }
    );
    setClarifyRecovery("");
  };

  const saveAsWorkflow = () => {
    saveWorkflow({
      id: `WF-${mission.id}`,
      name: scenario.title,
      objective: mission.objective,
      steps: steps.map((s) => s.label),
      approvals: steps.filter((s) => s.approval).length,
      createdAt: Date.now(),
      archived: false,
    });
    setSavedWf(true);
    logEvent(mission, "workflow", "Mission saved as reusable workflow");
  };

  return (
    <div className="p-5 md:p-8" data-testid="mission-detail">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Link to="/try-alter-engine/missions" className="font-mono-ax text-[11px] text-white/45 hover:text-[#ff5a1f]">MISSIONS /</Link>
        <span className="font-mono-ax text-[11px] text-white/80">{mission.id}</span>
        <span className="font-mono-ax text-[10px] uppercase tracking-wider border border-[#ff5a1f]/40 text-[#ff5a1f] px-2 py-0.5" data-testid="mission-state-badge">{STATE_LABEL[mission.state]}</span>
        <DemoBadge />
      </div>

      <div className="flex gap-1 mb-8 max-w-2xl" aria-hidden="true">
        {["clarify", "plan", "approval", "run", "verify"].map((s, i) => {
          const order = { clarify: 0, plan: 1, approval: 2, run: 3, failure: 3, verify: 4, complete: 5, stopped: 3 };
          const cur = order[mission.state];
          return <div key={s} className={`h-1 flex-1 ${i <= cur ? "bg-[#ff5a1f]" : "bg-white/12"}`} />;
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 max-w-[820px]">
          {/* CLARIFY */}
          {mission.state === "clarify" && (
            <div data-testid="state-clarify">
              <h1 className="ax-display text-2xl md:text-3xl mb-6">Understand the outcome.</h1>
              <div className="border border-white/15 p-5 mb-5">
                <p className="font-mono-ax text-[10px] uppercase tracking-wider text-white/40 mb-2">Objective</p>
                {editingObjective ? (
                  <div className="flex gap-2">
                    <input value={mission.objective} onChange={(e) => update({ objective: e.target.value })} className="flex-1 bg-black border border-white/25 px-3 py-2 text-[14px] text-white focus:border-[#ff5a1f] focus:outline-none" data-testid="objective-edit-input" />
                    <Btn primary onClick={() => { setEditingObjective(false); logEvent(mission, "edit", "Objective edited"); }} testid="objective-save-btn">Save</Btn>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[16px] text-white/90" data-testid="mission-objective">{mission.objective}</p>
                    <Btn onClick={() => setEditingObjective(true)} testid="objective-edit-btn">Edit objective</Btn>
                  </div>
                )}
              </div>
              <div className="grid sm:grid-cols-3 gap-3 mb-5">
                {[["Context", scenario.clarify.context], ["Constraints", scenario.clarify.constraints], ["Success criteria", scenario.clarify.criteria]].map(([t, items]) => (
                  <div key={t} className="border border-white/12 p-4">
                    <p className="font-mono-ax text-[9px] uppercase tracking-wider text-[#ff5a1f] mb-2">{t}</p>
                    <ul className="space-y-1.5">{items.map((c) => <li key={c} className="text-[12.5px] text-white/70">· {c}</li>)}</ul>
                  </div>
                ))}
              </div>
              <div className="border border-[#ff5a1f]/40 p-5 mb-6" data-testid="clarify-question-card">
                <p className="font-mono-ax text-[10px] uppercase tracking-wider text-[#ff5a1f] mb-2">One clarification before the plan</p>
                <p className="text-[15px] text-white/90 mb-3">{scenario.clarify.question}</p>
                {mission.clarifyAnswer ? (
                  <p className="text-[13px] text-white/70 border-l-2 border-[#ff5a1f] pl-3" data-testid="clarify-answer-display">Answered: {mission.clarifyAnswer}</p>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer..." className="flex-1 bg-black border border-white/25 px-3 py-2 text-[13px] text-white placeholder:text-white/35 focus:border-[#ff5a1f] focus:outline-none" data-testid="clarify-answer-input" />
                    <Btn primary onClick={() => { if (answer.trim()) { update({ clarifyAnswer: answer.trim() }, { type: "clarify", label: "Clarification answered", detail: answer.trim() }); setAnswer(""); } }} testid="clarify-answer-btn">Answer</Btn>
                  </div>
                )}
              </div>
              <Btn primary onClick={() => update({ state: "plan" }, { type: "state", label: "Objective understood — plan drafted" })} testid="continue-to-plan-btn">Continue to plan</Btn>
            </div>
          )}

          {/* PLAN */}
          {mission.state === "plan" && (
            <div data-testid="state-plan">
              <h1 className="ax-display text-2xl md:text-3xl mb-2">The route, before it runs.</h1>
              <p className="text-white/55 text-[14px] mb-6">Sequential and parallel steps, required systems, approval points and expected outputs.</p>
              <div className="border border-white/15 bg-black p-4 mb-5 overflow-x-auto">
                <Graph steps={steps} stepIndex={-1} completed={[]} onPick={setInspected} selected={inspected?.id} />
              </div>
              <div className="space-y-2 mb-6">
                {steps.map((s, i) => (
                  <button key={s.id} onClick={() => setInspected(s)} className={`w-full text-left flex items-center gap-4 border p-3.5 transition-colors ${s.approval ? "border-[#ff5a1f]/50" : "border-white/12"} hover:border-white/40`} data-testid={`plan-step-${s.id}`}>
                    <span className="font-mono-ax text-[10px] text-white/40 w-5">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[14px] font-bold text-white/90">{s.label}{s.parallel && <span className="font-mono-ax text-[9px] text-white/40 ml-2">PARALLEL</span>}</span>
                      <span className="block text-[11.5px] text-white/45">{s.system} → {s.output}</span>
                    </span>
                    {s.approval && <span className="font-mono-ax text-[9px] text-[#ff5a1f] border border-[#ff5a1f]/50 px-1.5 py-0.5 shrink-0">APPROVAL</span>}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn primary onClick={() => update({ state: "run", stepIndex: 0 }, { type: "decision", label: "Plan approved — execution started" })} testid="approve-plan-btn">Approve plan</Btn>
                <Btn onClick={() => setShowChange(!showChange)} testid="request-changes-btn">Request changes</Btn>
                <Btn onClick={() => setInspected(steps[0])} testid="edit-plan-btn">Inspect steps</Btn>
              </div>
              {showChange && (
                <div className="mt-4 flex flex-col sm:flex-row gap-2 max-w-xl" data-testid="change-request-box">
                  <input value={changeNote} onChange={(e) => setChangeNote(e.target.value)} placeholder="Describe the change you need..." className="flex-1 bg-black border border-white/25 px-3 py-2 text-[13px] text-white placeholder:text-white/35 focus:border-[#ff5a1f] focus:outline-none" data-testid="change-request-input" />
                  <Btn primary onClick={() => { if (changeNote.trim()) { logEvent(mission, "edit", "Plan change requested", changeNote.trim()); setMission(getMission(id)); setChangeNote(""); setShowChange(false); } }} testid="change-request-submit">Record change</Btn>
                </div>
              )}
            </div>
          )}

          {/* APPROVAL */}
          {mission.state === "approval" && currentStep?.approvalCard && (
            <div data-testid="state-approval">
              <h1 className="ax-display text-2xl md:text-3xl mb-6 flex items-center gap-3"><ShieldCheck size={26} className="text-[#ff5a1f]" aria-hidden="true" /> Your decision is required.</h1>
              <div className="border border-[#ff5a1f]/60 p-6 max-w-xl" data-testid="approval-card">
                <p className="font-mono-ax text-[10px] uppercase tracking-wider text-[#ff5a1f] mb-3">Proposed action</p>
                <p className="text-[17px] font-bold text-white/95 mb-5">{currentStep.approvalCard.action}</p>
                <dl className="space-y-2.5 text-[13px] mb-6">
                  {[["Affected system", currentStep.approvalCard.system], ["Reason", currentStep.approvalCard.reason], ["Scope", currentStep.approvalCard.scope], ["Risk", currentStep.approvalCard.risk], ["Rollback", currentStep.approvalCard.rollback], ["Evidence preview", `Will record: ${currentStep.output}`]].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[130px_1fr] gap-3 border-t border-white/10 pt-2">
                      <dt className="text-white/40">{k}</dt><dd className="text-white/85">{v}</dd>
                    </div>
                  ))}
                </dl>
                {mission.decisions.length > 0 && (
                  <div className="mb-5 border-t border-white/10 pt-3">
                    <p className="font-mono-ax text-[9px] uppercase text-white/40 mb-1.5">Decision history</p>
                    {mission.decisions.map((d, i) => <p key={i} className="text-[12px] text-white/55">· {d.decision} — {d.action}</p>)}
                  </div>
                )}
                {approvalMode === "edit" && (
                  <div className="mb-4" data-testid="approval-edit-box">
                    <label className="block text-[12px] text-white/60 mb-1.5" htmlFor="edit-scope">Edit the scope before approving</label>
                    <input id="edit-scope" value={editScope} onChange={(e) => setEditScope(e.target.value)} placeholder={currentStep.approvalCard.scope} className="w-full bg-black border border-white/25 px-3 py-2 text-[13px] text-white focus:border-[#ff5a1f] focus:outline-none" data-testid="approval-edit-input" />
                  </div>
                )}
                {approvalMode === "context" && (
                  <p className="mb-4 text-[13px] text-white/70 border-l-2 border-[#ff5a1f] pl-3" data-testid="approval-context">Additional context: {currentStep.detail} This action was planned in step {mission.stepIndex + 1} of {steps.length} and stays inside the granted connection scope.</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {approvalMode === "edit" ? (
                    <Btn primary onClick={() => decide("edited")} testid="approval-approve-edited-btn">Approve with edits</Btn>
                  ) : (
                    <Btn primary onClick={() => decide("approved")} testid="approval-approve-btn">Approve</Btn>
                  )}
                  <Btn onClick={() => { setApprovalMode(approvalMode === "edit" ? null : "edit"); setEditScope(currentStep.approvalCard.scope); }} testid="approval-edit-btn">Edit</Btn>
                  <Btn onClick={() => setApprovalMode(approvalMode === "context" ? null : "context")} testid="approval-context-btn">Request context</Btn>
                  <Btn danger onClick={() => decide("declined")} testid="approval-decline-btn">Decline</Btn>
                </div>
              </div>
            </div>
          )}

          {/* RUN + FAILURE */}
          {(mission.state === "run" || mission.state === "failure" || mission.state === "stopped") && (
            <div data-testid="state-run">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <h1 className="ax-display text-2xl md:text-3xl">Work in motion.</h1>
                {mission.state === "run" && (
                  <div className="flex gap-2">
                    <Btn onClick={() => setPaused(!paused)} testid="run-pause-btn">{paused ? <><Play size={12} className="inline mr-1" />Resume</> : <><Pause size={12} className="inline mr-1" />Pause demo</>}</Btn>
                    <Btn danger onClick={() => update({ state: "failure", simulated: true }, { type: "failure", label: `Simulated failure injected at: ${currentStep?.label}` })} testid="simulate-failure-btn"><AlertTriangle size={12} className="inline mr-1" />Simulate failure</Btn>
                  </div>
                )}
              </div>
              <div className="border border-white/15 bg-black p-4 mb-5 overflow-x-auto">
                <Graph steps={steps} stepIndex={mission.stepIndex} completed={mission.completedSteps} onPick={setInspected} selected={inspected?.id} />
              </div>
              <div className="space-y-2">
                {steps.map((s, i) => {
                  const done = mission.completedSteps.includes(s.id);
                  const running = i === mission.stepIndex && mission.state === "run";
                  const failed = i === mission.stepIndex && mission.state === "failure";
                  const declined = mission.decisions.find((d) => d.stepId === s.id && d.decision === "declined");
                  return (
                    <button key={s.id} onClick={() => setInspected(s)} className={`w-full text-left flex items-center gap-3 border p-3.5 ${failed ? "border-[#bd3510]" : running ? "border-[#ff5a1f]/60" : "border-white/12"} hover:border-white/40 transition-colors`} data-testid={`run-step-${s.id}`}>
                      {done ? <Check size={14} className="text-[#ff5a1f]" aria-hidden="true" /> : failed ? <AlertTriangle size={14} className="text-[#ff8a63]" aria-hidden="true" /> : running ? <CircleDot size={14} className="text-[#ff761f] animate-pulse" aria-hidden="true" /> : <Clock size={14} className="text-white/30" aria-hidden="true" />}
                      <span className={`flex-1 text-[14px] font-semibold ${done || running || failed ? "text-white/90" : "text-white/45"}`}>{s.label}{declined && <span className="font-mono-ax text-[9px] text-white/40 ml-2">DECLINED · SKIPPED</span>}</span>
                      <span className="font-mono-ax text-[9px] uppercase tracking-wider text-white/40">{failed ? "failed" : done ? "completed" : running ? "running" : s.approval && i === mission.stepIndex ? "waiting approval" : "queued"}</span>
                    </button>
                  );
                })}
              </div>
              {mission.state === "stopped" && (
                <div className="mt-6 border border-white/15 p-5" data-testid="stopped-notice">
                  <p className="text-white/75 text-[14px]">Mission stopped after failure. The evidence trail up to this point is preserved.</p>
                  <div className="mt-3 flex gap-2"><Btn onClick={() => exportEvidence(mission)} testid="stopped-export-btn"><Download size={12} className="inline mr-1" />Export evidence</Btn></div>
                </div>
              )}
              {mission.state === "failure" && currentStep && (
                <div className="mt-6 border border-[#bd3510] p-6 max-w-xl" data-testid="failure-card">
                  <p className="font-mono-ax text-[10px] uppercase tracking-wider text-[#ff8a63] mb-3 flex items-center gap-2"><AlertTriangle size={12} aria-hidden="true" /> Step failed</p>
                  <p className="text-[16px] font-bold text-white/95 mb-4">{currentStep.failureCard?.what || `${currentStep.label} was interrupted`}</p>
                  <dl className="space-y-2 text-[13px] mb-6">
                    {[["Classification", currentStep.failureCard?.classification || "Simulated interruption"], ["Impact", currentStep.failureCard?.impact || "The step's output would be incomplete"], ["Evidence", currentStep.failureCard?.evidence || "Partial output preserved in the mission trail"]].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[110px_1fr] gap-3 border-t border-white/10 pt-2">
                        <dt className="text-white/40">{k}</dt><dd className="text-white/85">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Btn primary onClick={() => recover("retry")} testid="recover-retry-btn"><RotateCcw size={12} className="inline mr-1" />Retry</Btn>
                    <Btn onClick={() => recover("alternate")} testid="recover-alternate-btn">Use alternate route</Btn>
                    <Btn danger onClick={() => recover("stop")} testid="recover-stop-btn">Stop mission</Btn>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input value={clarifyRecovery} onChange={(e) => setClarifyRecovery(e.target.value)} placeholder="Or answer a clarification to unblock..." className="flex-1 bg-black border border-white/25 px-3 py-2 text-[13px] text-white placeholder:text-white/35 focus:border-[#ff5a1f] focus:outline-none" data-testid="recover-clarify-input" />
                    <Btn onClick={() => clarifyRecovery.trim() && recover("clarify")} testid="recover-clarify-btn">Ask for clarification</Btn>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VERIFY / COMPLETE */}
          {(mission.state === "verify" || mission.state === "complete") && (
            <div data-testid="state-verify">
              <h1 className="ax-display text-2xl md:text-3xl mb-6">{mission.state === "complete" ? "Result accepted." : "Checked against the original requirement."}</h1>
              <div className="border border-white/15 p-5 mb-5 max-w-2xl">
                <p className="font-mono-ax text-[10px] uppercase tracking-wider text-[#ff5a1f] mb-2">Result</p>
                <p className="text-[15px] text-white/90">{scenario.verify.result}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mb-5 max-w-2xl">
                <div className="border border-white/12 p-4">
                  <p className="font-mono-ax text-[9px] uppercase tracking-wider text-white/40 mb-3">Checks vs success criteria</p>
                  {scenario.verify.checks.map((c) => {
                    const pass = c.state === "pass" || weakResolved;
                    return (
                      <div key={c.label} className="flex items-start gap-2.5 py-1.5" data-testid={`verify-check-${scenario.verify.checks.indexOf(c)}`}>
                        {pass ? <Check size={13} className="text-[#ff5a1f] mt-0.5 shrink-0" aria-hidden="true" /> : <RotateCcw size={13} className="text-[#ff8a63] mt-0.5 shrink-0" aria-hidden="true" />}
                        <div>
                          <p className={`text-[13px] ${pass ? "text-white/80" : "text-[#ff8a63]"}`}>{c.label}</p>
                          {!pass && c.note && <p className="text-[11.5px] text-white/45">{c.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border border-white/12 p-4">
                  <p className="font-mono-ax text-[9px] uppercase tracking-wider text-white/40 mb-3">Artifacts</p>
                  {scenario.verify.artifacts.map((a) => <p key={a} className="text-[13px] text-white/75 py-1">· {a}</p>)}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {mission.state === "verify" && !weakResolved && (
                  <Btn onClick={() => update({}, { type: "revision", label: "Weak step sent back for revision", detail: "The step ran again and the check now passes." })} testid="send-back-btn"><RotateCcw size={12} className="inline mr-1" />Send weak step back</Btn>
                )}
                {mission.state === "verify" && (
                  <Btn primary onClick={() => update({ state: "complete" }, { type: "state", label: "Result accepted" })} testid="accept-result-btn">Accept result</Btn>
                )}
                <Btn onClick={() => exportEvidence(mission)} testid="export-evidence-btn"><Download size={12} className="inline mr-1" />Export evidence</Btn>
                {!savedWf ? (
                  <Btn onClick={saveAsWorkflow} testid="save-workflow-btn"><Repeat size={12} className="inline mr-1" />Save as workflow</Btn>
                ) : (
                  <span className="px-4 py-2 text-[13px] text-[#ff5a1f] border border-[#ff5a1f]/40" data-testid="workflow-saved-note">Saved to workflows</span>
                )}
                {mission.state === "complete" && <Btn onClick={() => navigate("/try-alter-engine/new")} testid="complete-new-mission-btn">Start a new mission</Btn>}
              </div>
            </div>
          )}

          {/* HISTORY */}
          <div className="mt-10 border-t border-white/12 pt-6 max-w-2xl">
            <p className="font-mono-ax text-[10px] uppercase tracking-wider text-white/40 mb-4">Mission timeline</p>
            <div className="space-y-2" data-testid="mission-timeline">
              <AnimatePresence initial={false}>
                {[...mission.history].reverse().slice(0, 8).map((h, i) => (
                  <motion.div key={`${h.ts}-${h.label}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, ease: EASE }} className="flex gap-3 text-[12.5px]">
                    <span className="font-mono-ax text-[10px] text-white/35 shrink-0 pt-0.5 w-[62px]">{new Date(h.ts).toLocaleTimeString()}</span>
                    <span className={`w-1.5 h-1.5 mt-1.5 shrink-0 ${h.type === "failure" ? "bg-[#bd3510]" : "bg-[#ff5a1f]"}`} aria-hidden="true" />
                    <span className="text-white/70">{h.label}{h.detail && <span className="text-white/40"> — {h.detail}</span>}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Inspector step={inspected} mission={mission} onClose={() => setInspected(null)} />
      </div>
    </div>
  );
}
