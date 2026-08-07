import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShieldCheck, X, Pause, Play, AlertTriangle, RotateCcw, Download, Repeat } from "lucide-react";
import { getMission, saveMission, getScenario, logEvent, exportEvidence, saveWorkflow } from "@/lib/store";
import { EASE } from "@/lib/anim";

const STATE_LABEL = { clarify: "Understand", plan: "Plan ready for review", approval: "Needs your decision", run: "In progress", failure: "Needs recovery", verify: "Ready to review", complete: "Complete", stopped: "Stopped" };

const Btn = ({ children, primary, onClick, testid, danger }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-[13px] font-semibold rounded-[4px] transition-colors ${primary ? "bg-[#ff4d0a] text-black hover:bg-[#ff641d]" : danger ? "border border-[#c9360a] text-[#ff8a63] hover:bg-[#c9360a]/20" : "border border-white/25 text-white/80 hover:border-[#ff4d0a]/60"}`}
    data-testid={testid}
  >
    {children}
  </button>
);

/* Living route — task circles, approval diamonds, result ring. */
const Graph = ({ steps, stepIndex, completed, onPick, selected, failed }) => {
  const W = 90 + steps.length * 128;
  return (
    <svg viewBox={`0 0 ${W} 168`} className="w-full" style={{ minWidth: steps.length * 118, height: "auto", maxHeight: 176 }} role="group" aria-label="Mission route">
      {steps.map((s, i) => {
        const x = 64 + i * 128;
        const y = s.parallel ? 46 : 96;
        const prevY = i > 0 && steps[i - 1].parallel ? 46 : 96;
        const done = completed.includes(s.id);
        const active = i === stepIndex;
        const isFailed = failed && active;
        const last = i === steps.length - 1;
        const lineColor = done ? "rgba(251,250,247,.7)" : active ? "#ff4d0a" : "rgba(255,255,255,.18)";
        return (
          <g key={s.id}>
            {i > 0 && (
              <path
                d={`M ${x - 128 + 20} ${prevY} C ${x - 80} ${prevY}, ${x - 68} ${y}, ${x - 20} ${y}`}
                stroke={lineColor}
                strokeWidth={active ? 2.2 : 1.6}
                fill="none"
              />
            )}
            {s.approval ? (
              <rect
                x={x - 13} y={y - 13} width="26" height="26"
                transform={`rotate(45 ${x} ${y})`}
                fill={done ? "rgba(251,250,247,.12)" : active ? "#ff4d0a" : "#0d0d0c"}
                stroke={isFailed ? "#ff8a63" : done || active ? "#ff4d0a" : selected === s.id ? "#fbfaf7" : "rgba(255,255,255,.35)"}
                strokeWidth="2"
                className="cursor-pointer"
                onClick={() => onPick(s)}
                role="button"
                tabIndex={0}
                aria-label={`Inspect approval step: ${s.label}`}
                onKeyDown={(e) => { if (e.key === "Enter") onPick(s); }}
                data-testid={`graph-node-${s.id}`}
              />
            ) : last ? (
              <g
                className="cursor-pointer"
                onClick={() => onPick(s)}
                role="button"
                tabIndex={0}
                aria-label={`Inspect result step: ${s.label}`}
                onKeyDown={(e) => { if (e.key === "Enter") onPick(s); }}
                data-testid={`graph-node-${s.id}`}
              >
                <circle cx={x} cy={y} r="17" fill="none" stroke={isFailed ? "#ff8a63" : done ? "#ff4d0a" : active ? "#ff4d0a" : selected === s.id ? "#fbfaf7" : "rgba(255,255,255,.35)"} strokeWidth="2" />
                <circle cx={x} cy={y} r="7" fill={done ? "#ff4d0a" : "none"} stroke="rgba(255,255,255,.35)" strokeWidth="1.4" />
              </g>
            ) : (
              <circle
                cx={x} cy={y} r="14"
                fill={done ? "rgba(251,250,247,.12)" : "#0d0d0c"}
                stroke={isFailed ? "#ff8a63" : done || active ? "#ff4d0a" : selected === s.id ? "#fbfaf7" : "rgba(255,255,255,.35)"}
                strokeWidth={active ? 2.4 : 1.6}
                className="cursor-pointer"
                onClick={() => onPick(s)}
                role="button"
                tabIndex={0}
                aria-label={`Inspect step: ${s.label}`}
                onKeyDown={(e) => { if (e.key === "Enter") onPick(s); }}
                data-testid={`graph-node-${s.id}`}
              />
            )}
            {done && !s.approval && !last && <path d={`M${x - 5} ${y} l3.5 3.5 l6.5 -7`} fill="none" stroke="#fbfaf7" strokeWidth="2" strokeLinecap="round" pointerEvents="none" />}
            {active && !done && !s.approval && <circle cx={x} cy={y} r="5" fill={isFailed ? "#ff8a63" : "#ff4d0a"} pointerEvents="none" />}
            {s.approval && <text x={x} y={y - 26} textAnchor="middle" fontSize="10.5" fontWeight="500" fill="#ff8a3d" fontFamily="Hanken Grotesk" pointerEvents="none">approval</text>}
            <text x={x} y={y + (s.parallel ? -34 : 38)} textAnchor="middle" fontSize="11" fontWeight="500" fill={active ? "#fbfaf7" : "rgba(255,255,255,.55)"} fontFamily="Hanken Grotesk" pointerEvents="none">
              {s.label.length > 22 ? s.label.slice(0, 21) + "…" : s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* Contextual inspector — slides in from the right only after a node is selected. */
const Inspector = ({ step, mission, onClose }) => (
  <AnimatePresence>
    {step && (
      <>
        <motion.div
          className="fixed inset-0 z-[70] bg-black/50 lg:bg-black/30"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.aside
          className="fixed right-0 top-0 bottom-0 z-[80] w-[min(360px,92vw)] bg-[#0d0d0c] border-l border-white/12 p-6 overflow-y-auto"
          initial={{ x: "104%" }} animate={{ x: 0 }} exit={{ x: "104%" }}
          transition={{ duration: 0.32, ease: EASE }}
          aria-label="Step inspector"
          data-testid="step-inspector"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#ff4d0a]">Step</p>
            <button onClick={onClose} aria-label="Close inspector" className="text-white/50 hover:text-white p-1" data-testid="inspector-close"><X size={16} /></button>
          </div>
          <p className="font-semibold text-[17px] leading-snug mb-5">{step.label}</p>
          {[
            ["What goes in", step.detail],
            ["What comes out", step.output],
            ["System", step.system],
            ["Permission", step.approval ? `Requires approval · ${step.approvalCard?.scope || "scoped"}` : "Scoped to granted connection permissions"],
            ["Evidence", mission.completedSteps.includes(step.id) ? `Artifact recorded: ${step.output}` : "Produced when the step completes"],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-white/10 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">{k}</p>
              <p className="text-[13.5px] text-white/80 mt-1 leading-relaxed">{v}</p>
            </div>
          ))}
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);

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
        <p className="text-white/60">Mission not found in this browser&apos;s demo storage.</p>
        <Link to="/try-alter-engine/missions" className="text-[#ff4d0a] font-semibold text-[14px] mt-3 inline-block">Back to missions</Link>
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
    <div className="p-5 md:p-8 max-w-[1060px]" data-testid="mission-detail">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-5">
        <Link to="/try-alter-engine/missions" className="text-[13px] font-medium text-white/45 hover:text-[#ff4d0a]">Missions</Link>
        <span className="text-white/25">/</span>
        <span className="font-mono-ax text-[11.5px] text-white/50">{mission.id}</span>
        <span className="text-[13px] font-semibold text-[#ff8a3d]" data-testid="mission-state-badge">{STATE_LABEL[mission.state]}</span>
      </div>

      <div className="flex gap-1 mb-9 max-w-2xl" aria-hidden="true">
        {["clarify", "plan", "approval", "run", "verify"].map((s, i) => {
          const order = { clarify: 0, plan: 1, approval: 2, run: 3, failure: 3, verify: 4, complete: 5, stopped: 3 };
          const cur = order[mission.state];
          return <div key={s} className={`h-[3px] flex-1 rounded-full ${i <= cur ? "bg-[#ff4d0a]" : "bg-white/12"}`} />;
        })}
      </div>

      <div className="min-w-0">
        {/* CLARIFY — editorial composition, not four boxes */}
        {mission.state === "clarify" && (
          <div data-testid="state-clarify">
            {editingObjective ? (
              <div className="flex gap-2 mb-6 max-w-2xl">
                <input value={mission.objective} onChange={(e) => update({ objective: e.target.value })} className="flex-1 bg-black border border-white/25 rounded-[4px] px-4 py-3 text-[17px] text-white focus:border-[#ff4d0a] focus:outline-none" data-testid="objective-edit-input" />
                <Btn primary onClick={() => { setEditingObjective(false); logEvent(mission, "edit", "Objective edited"); }} testid="objective-save-btn">Save</Btn>
              </div>
            ) : (
              <div className="mb-6">
                <h1 className="ax-display text-2xl md:text-[38px] max-w-[24ch]" data-testid="mission-objective">{mission.objective}</h1>
                <button onClick={() => setEditingObjective(true)} className="text-[13px] font-medium text-white/45 hover:text-[#ff4d0a] mt-3" data-testid="objective-edit-btn">Edit objective</button>
              </div>
            )}

            <div className="grid md:grid-cols-[1fr_240px] gap-x-12 gap-y-6 mb-9 max-w-3xl">
              <div className="space-y-5">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/40 mb-2">What the Engine has</p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.clarify.context.map((c) => (
                      <span key={c} className="text-[13px] text-white/75 bg-white/[.05] rounded-[4px] px-3 py-1.5">{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/40 mb-2">Done means</p>
                  {scenario.clarify.criteria.map((c) => (
                    <p key={c} className="text-[14px] text-white/80 flex items-start gap-2 py-0.5"><Check size={13} className="text-[#ff4d0a] mt-1 shrink-0" aria-hidden="true" />{c}</p>
                  ))}
                </div>
              </div>
              <div className="border-l-2 border-[#ff4d0a] pl-4 self-start">
                <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#ff8a3d] mb-1.5">Boundaries</p>
                {scenario.clarify.constraints.map((c) => (
                  <p key={c} className="text-[13px] text-white/70 py-0.5">{c}</p>
                ))}
              </div>
            </div>

            <div className="max-w-2xl mb-8" data-testid="clarify-question-card">
              <p className="text-[15.5px] text-white/90 mb-3">
                <span className="text-[#ff4d0a] font-semibold">One question before the plan: </span>
                {scenario.clarify.question}
              </p>
              {mission.clarifyAnswer ? (
                <p className="text-[14px] text-white/70 border-l-2 border-[#ff4d0a] pl-3" data-testid="clarify-answer-display">Answered: {mission.clarifyAnswer}</p>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer…" className="flex-1 bg-black border border-white/25 rounded-[4px] px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/35 focus:border-[#ff4d0a] focus:outline-none" data-testid="clarify-answer-input" />
                  <Btn primary onClick={() => { if (answer.trim()) { update({ clarifyAnswer: answer.trim() }, { type: "clarify", label: "Clarification answered", detail: answer.trim() }); setAnswer(""); } }} testid="clarify-answer-btn">Answer</Btn>
                </div>
              )}
            </div>
            <Btn primary onClick={() => update({ state: "plan" }, { type: "state", label: "Objective understood — plan drafted" })} testid="continue-to-plan-btn">Continue to plan</Btn>
          </div>
        )}

        {/* PLAN — the route gets the full width; details live in the drawer */}
        {mission.state === "plan" && (
          <div data-testid="state-plan">
            <h1 className="ax-display text-2xl md:text-3xl mb-2">The route, before it runs.</h1>
            <p className="text-white/55 text-[14px] mb-8">Select any step to see its inputs, outputs, system and permissions. Approval diamonds pause for you.</p>
            <div className="mb-8 overflow-x-auto pb-2">
              <Graph steps={steps} stepIndex={-1} completed={[]} onPick={setInspected} selected={inspected?.id} />
            </div>
            <div className="mb-8 max-w-2xl">
              {steps.map((s, i) => (
                <button key={s.id} onClick={() => setInspected(s)} className="w-full text-left flex items-center gap-4 border-t border-white/10 py-3 px-1 group hover:bg-white/[.03] transition-colors" data-testid={`plan-step-${s.id}`}>
                  <span className="text-[12px] text-white/35 w-5">{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-medium text-white/90">
                      {s.label}
                      {s.parallel && <span className="text-[11px] text-white/40 ml-2">runs in parallel</span>}
                      {s.approval && <span className="text-[11px] text-[#ff8a3d] ml-2">pauses for approval</span>}
                    </span>
                    <span className="block text-[12px] text-white/45">{s.system} → {s.output}</span>
                  </span>
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
                <input value={changeNote} onChange={(e) => setChangeNote(e.target.value)} placeholder="Describe the change you need…" className="flex-1 bg-black border border-white/25 rounded-[4px] px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/35 focus:border-[#ff4d0a] focus:outline-none" data-testid="change-request-input" />
                <Btn primary onClick={() => { if (changeNote.trim()) { logEvent(mission, "edit", "Plan change requested", changeNote.trim()); setMission(getMission(id)); setChangeNote(""); setShowChange(false); } }} testid="change-request-submit">Record change</Btn>
              </div>
            )}
          </div>
        )}

        {/* APPROVAL — a large decision sheet */}
        {mission.state === "approval" && currentStep?.approvalCard && (
          <div data-testid="state-approval">
            <h1 className="ax-display text-2xl md:text-3xl mb-8 flex items-center gap-3"><ShieldCheck size={26} className="text-[#ff4d0a]" aria-hidden="true" /> Needs your decision.</h1>
            <div className="max-w-2xl" data-testid="approval-card">
              <p className="text-[20px] md:text-[24px] font-semibold text-white/95 leading-snug mb-7 border-l-2 border-[#ff4d0a] pl-5">{currentStep.approvalCard.action}</p>
              <dl className="space-y-3 text-[14px] mb-8">
                {[["Affected system", currentStep.approvalCard.system], ["Why approval is needed", currentStep.approvalCard.reason], ["Scope", currentStep.approvalCard.scope], ["Risk", currentStep.approvalCard.risk], ["If it goes wrong", currentStep.approvalCard.rollback], ["What will be recorded", currentStep.output]].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[170px_1fr] gap-4 border-t border-white/10 pt-2.5">
                    <dt className="text-white/45">{k}</dt><dd className="text-white/85">{v}</dd>
                  </div>
                ))}
              </dl>
              {mission.decisions.length > 0 && (
                <div className="mb-6 border-t border-white/10 pt-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40 mb-1.5">Earlier decisions on this mission</p>
                  {mission.decisions.map((d, i) => <p key={i} className="text-[12.5px] text-white/55">· {d.decision} — {d.action}</p>)}
                </div>
              )}
              {approvalMode === "edit" && (
                <div className="mb-5" data-testid="approval-edit-box">
                  <label className="block text-[12.5px] text-white/60 mb-1.5" htmlFor="edit-scope">Edit the scope before approving</label>
                  <input id="edit-scope" value={editScope} onChange={(e) => setEditScope(e.target.value)} placeholder={currentStep.approvalCard.scope} className="w-full bg-black border border-white/25 rounded-[4px] px-3.5 py-2.5 text-[13.5px] text-white focus:border-[#ff4d0a] focus:outline-none" data-testid="approval-edit-input" />
                </div>
              )}
              {approvalMode === "context" && (
                <p className="mb-5 text-[13.5px] text-white/70 border-l-2 border-[#ff4d0a] pl-3.5" data-testid="approval-context">Additional context: {currentStep.detail} This action was planned in step {mission.stepIndex + 1} of {steps.length} and stays inside the granted connection scope.</p>
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

        {/* RUN + FAILURE + STOPPED — the living route */}
        {(mission.state === "run" || mission.state === "failure" || mission.state === "stopped") && (
          <div data-testid="state-run">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
              <h1 className="ax-display text-2xl md:text-3xl">Work in motion.</h1>
              {mission.state === "run" && (
                <div className="flex gap-2">
                  <Btn onClick={() => setPaused(!paused)} testid="run-pause-btn">{paused ? <><Play size={12} className="inline mr-1" />Resume</> : <><Pause size={12} className="inline mr-1" />Pause demo</>}</Btn>
                  <Btn danger onClick={() => update({ state: "failure", simulated: true }, { type: "failure", label: `Simulated failure injected at: ${currentStep?.label}` })} testid="simulate-failure-btn"><AlertTriangle size={12} className="inline mr-1" />Simulate failure</Btn>
                </div>
              )}
            </div>
            <div className="mb-8 overflow-x-auto pb-2">
              <Graph steps={steps} stepIndex={mission.stepIndex} completed={mission.completedSteps} onPick={setInspected} selected={inspected?.id} failed={mission.state === "failure"} />
            </div>
            <div className="max-w-2xl">
              {steps.map((s, i) => {
                const done = mission.completedSteps.includes(s.id);
                const running = i === mission.stepIndex && mission.state === "run";
                const failed = i === mission.stepIndex && mission.state === "failure";
                const declined = mission.decisions.find((d) => d.stepId === s.id && d.decision === "declined");
                return (
                  <button key={s.id} onClick={() => setInspected(s)} className="w-full text-left flex items-center gap-3 border-t border-white/10 py-3 px-1 hover:bg-white/[.03] transition-colors" data-testid={`run-step-${s.id}`}>
                    {done ? <Check size={14} className="text-[#ff4d0a] shrink-0" aria-hidden="true" /> : failed ? <AlertTriangle size={14} className="text-[#ff8a63] shrink-0" aria-hidden="true" /> : running ? <span className="w-2 h-2 rounded-full bg-[#ff4d0a] animate-pulse shrink-0" aria-hidden="true" /> : <span className="w-2 h-2 rounded-full bg-white/20 shrink-0" aria-hidden="true" />}
                    <span className={`flex-1 text-[14px] font-medium ${done || running || failed ? "text-white/90" : "text-white/45"}`}>{s.label}{declined && <span className="text-[11px] text-white/40 ml-2">declined · skipped</span>}</span>
                    <span className={`text-[12px] font-medium ${failed ? "text-[#ff8a63]" : running ? "text-[#ff8a3d]" : "text-white/35"}`}>{failed ? "failed" : done ? "complete" : running ? "running" : s.approval && i === mission.stepIndex ? "waiting for you" : "waiting"}</span>
                  </button>
                );
              })}
            </div>
            {mission.state === "stopped" && (
              <div className="mt-8 max-w-xl" data-testid="stopped-notice">
                <p className="text-white/75 text-[14.5px]">Mission stopped after failure. The evidence trail up to this point is preserved.</p>
                <div className="mt-3 flex gap-2"><Btn onClick={() => exportEvidence(mission)} testid="stopped-export-btn"><Download size={12} className="inline mr-1" />Export evidence</Btn></div>
              </div>
            )}
            {mission.state === "failure" && currentStep && (
              <div className="mt-9 max-w-2xl" data-testid="failure-card">
                <p className="text-[18px] md:text-[21px] font-semibold text-white/95 leading-snug mb-2">
                  <AlertTriangle size={17} className="inline mr-2 text-[#ff8a63] -mt-1" aria-hidden="true" />
                  {currentStep.failureCard?.what || `${currentStep.label} was interrupted`}
                </p>
                <p className="text-[14px] text-white/60 mb-6">The path broke here — but the work does not disappear. Choose how the route continues.</p>
                <dl className="space-y-2.5 text-[13.5px] mb-7">
                  {[["What happened", currentStep.failureCard?.classification || "Simulated interruption"], ["Impact", currentStep.failureCard?.impact || "The step's output would be incomplete"], ["Preserved", currentStep.failureCard?.evidence || "Partial output preserved in the mission trail"]].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[130px_1fr] gap-3 border-t border-white/10 pt-2">
                      <dt className="text-white/40">{k}</dt><dd className="text-white/80">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="grid sm:grid-cols-3 gap-2 mb-4" role="group" aria-label="Recovery options">
                  <button onClick={() => recover("retry")} className="text-left rounded-[4px] border border-[#ff4d0a]/60 hover:bg-[#ff4d0a] hover:text-black transition-colors p-4 group" data-testid="recover-retry-btn">
                    <RotateCcw size={14} className="mb-2" aria-hidden="true" />
                    <span className="block text-[14px] font-semibold">Retry</span>
                    <span className="block text-[12px] opacity-65 mt-0.5">Run the same step again</span>
                  </button>
                  <button onClick={() => recover("alternate")} className="text-left rounded-[4px] border border-white/20 hover:border-[#ff4d0a] transition-colors p-4" data-testid="recover-alternate-btn">
                    <span className="block text-[14px] font-semibold">Alternate route</span>
                    <span className="block text-[12px] opacity-65 mt-0.5">Reach the output another way</span>
                  </button>
                  <button onClick={() => recover("stop")} className="text-left rounded-[4px] border border-[#c9360a]/70 text-[#ff8a63] hover:bg-[#c9360a]/15 transition-colors p-4" data-testid="recover-stop-btn">
                    <span className="block text-[14px] font-semibold">Stop mission</span>
                    <span className="block text-[12px] opacity-65 mt-0.5">Keep the evidence, stop here</span>
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input value={clarifyRecovery} onChange={(e) => setClarifyRecovery(e.target.value)} placeholder="Or answer a clarification to unblock…" className="flex-1 bg-black border border-white/25 rounded-[4px] px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/35 focus:border-[#ff4d0a] focus:outline-none" data-testid="recover-clarify-input" />
                  <Btn onClick={() => clarifyRecovery.trim() && recover("clarify")} testid="recover-clarify-btn">Ask for clarification</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VERIFY / COMPLETE */}
        {(mission.state === "verify" || mission.state === "complete") && (
          <div data-testid="state-verify">
            <h1 className="ax-display text-2xl md:text-3xl mb-3">{mission.state === "complete" ? "Result accepted." : "Checked against the original requirement."}</h1>
            <p className="text-[17px] text-white/85 max-w-2xl mb-8 border-l-2 border-[#ff4d0a] pl-4">{scenario.verify.result}</p>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-9 max-w-2xl">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/40 mb-3">Checks vs success criteria</p>
                {scenario.verify.checks.map((c) => {
                  const pass = c.state === "pass" || weakResolved;
                  return (
                    <div key={c.label} className="flex items-start gap-2.5 py-1.5" data-testid={`verify-check-${scenario.verify.checks.indexOf(c)}`}>
                      {pass ? <Check size={13} className="text-[#ff4d0a] mt-0.5 shrink-0" aria-hidden="true" /> : <RotateCcw size={13} className="text-[#ff8a63] mt-0.5 shrink-0" aria-hidden="true" />}
                      <div>
                        <p className={`text-[13.5px] ${pass ? "text-white/80" : "text-[#ff8a63]"}`}>{c.label}</p>
                        {!pass && c.note && <p className="text-[12px] text-white/45">{c.note}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/40 mb-3">Evidence behind this result</p>
                {scenario.verify.artifacts.map((a) => <p key={a} className="text-[13.5px] text-white/75 py-1 border-b border-white/[.06]">{a}</p>)}
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
                <span className="px-4 py-2 text-[13px] text-[#ff4d0a]" data-testid="workflow-saved-note">Saved to workflows</span>
              )}
              {mission.state === "complete" && <Btn onClick={() => navigate("/try-alter-engine/new")} testid="complete-new-mission-btn">Start a new mission</Btn>}
            </div>
          </div>
        )}

        {/* HISTORY */}
        <div className="mt-12 border-t border-white/10 pt-6 max-w-2xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/40 mb-4">Mission timeline</p>
          <div className="space-y-2" data-testid="mission-timeline">
            <AnimatePresence initial={false}>
              {[...mission.history].reverse().slice(0, 8).map((h) => (
                <motion.div key={`${h.ts}-${h.label}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, ease: EASE }} className="flex gap-3 text-[12.5px]">
                  <span className="font-mono-ax text-[10px] text-white/35 shrink-0 pt-0.5 w-[62px]">{new Date(h.ts).toLocaleTimeString()}</span>
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${h.type === "failure" ? "bg-[#c9360a]" : "bg-[#ff4d0a]"}`} aria-hidden="true" />
                  <span className="text-white/70">{h.label}{h.detail && <span className="text-white/40"> — {h.detail}</span>}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Inspector step={inspected} mission={mission} onClose={() => setInspected(null)} />
    </div>
  );
}
