import React from "react";
import { InspectorPanel, InspectorRow, InspectorEyebrow } from "@/try/InspectorPanel";
import { estimateMissionUsage } from "@/lib/demoCredits";

const STAGE_LABEL = { clarify: "Understand", plan: "Plan", approval: "Approve", run: "Act", failure: "Act", stopped: "Act", verify: "Check", complete: "Result" };

const Section = ({ title, children, testId }) => (
  <div className="border-t border-white/[.07] py-3.5" data-testid={testId}>
    <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40 mb-2">{title}</p>
    {children}
  </div>
);

const Dot = ({ ok }) => <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ok ? "bg-[#ff4d0a]" : "bg-white/20"}`} aria-hidden="true" />;

function ReadinessRow({ label, ok }) {
  return (
    <div className="flex items-center gap-2.5 py-1" data-testid={`readiness-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <Dot ok={ok} />
      <span className={`text-[12.5px] ${ok ? "text-white/80" : "text-white/40"}`}>{label}</span>
    </div>
  );
}

function ActivityRows({ mission, n = 3 }) {
  const rows = [...mission.history].reverse().slice(0, n);
  if (!rows.length) return <p className="text-[12.5px] text-white/30">No activity yet.</p>;
  return (
    <div className="space-y-1.5">
      {rows.map((h) => (
        <div key={`${h.ts}-${h.label}`} className="flex items-start gap-2 text-[12.5px]" data-testid="mission-context-activity-row">
          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${h.type === "failure" ? "bg-[#c9360a]" : "bg-[#ff4d0a]"}`} aria-hidden="true" />
          <span className="text-white/65 leading-snug">{h.label}</span>
        </div>
      ))}
    </div>
  );
}

/* Unique systems this mission's plan actually touches — real data pulled
   from scenario.steps, never invented integration names. */
function sourceSystems(steps) {
  const map = new Map();
  steps.forEach((s) => map.set(s.system, (map.get(s.system) || 0) + 1));
  return [...map.entries()];
}

export default function MissionContextPanel({ mission, scenario, currentStep, steps, weakResolved }) {
  return (
    <InspectorPanel testId="mission-context-panel">
      <InspectorEyebrow>Mission context</InspectorEyebrow>
      <p className="text-[16px] font-bold text-white/90 mb-4 leading-snug">{mission.id}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-white/50 mb-1">
        <span>Workspace: <b className="text-white/75 font-medium">Demo workspace</b></span>
        <span>Stage: <b className="text-white/75 font-medium">{STAGE_LABEL[mission.state] || mission.state}</b></span>
      </div>

      {mission.state === "clarify" && (
        <>
          <Section title="Source systems" testId="ctx-sources">
            <div className="space-y-1.5">
              {sourceSystems(steps).map(([sys, count]) => (
                <div key={sys} className="flex items-center justify-between text-[12.5px]">
                  <span className="text-white/80">{sys}</span>
                  <span className="text-white/35">{count} step{count === 1 ? "" : "s"} · demo</span>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Decision needed" testId="ctx-decision">
            <p className="text-[13px] text-white/80 leading-relaxed mb-1.5">{scenario.clarify.question}</p>
            <p className="text-[11.5px] text-white/35">{mission.clarifyAnswer ? "Answered — ready to continue" : "Clarify before plan"}</p>
          </Section>
          <Section title="Readiness for planning" testId="ctx-readiness">
            <ReadinessRow label="Sources connected" ok />
            <ReadinessRow label="Boundaries acknowledged" ok />
            <ReadinessRow label="Question answered" ok={!!mission.clarifyAnswer} />
            <ReadinessRow label="Ready for planning" ok={!!mission.clarifyAnswer} />
          </Section>
          <Section title="Recent activity" testId="ctx-activity"><ActivityRows mission={mission} /></Section>
        </>
      )}

      {mission.state === "plan" && (
        <>
          <Section title="Plan summary" testId="ctx-plan-summary">
            <InspectorRow label="Steps" value={steps.length} />
            <InspectorRow label="Approval points" value={steps.filter((s) => s.approval).length} />
            <InspectorRow label="Expected checks" value={scenario.verify.checks.length} />
          </Section>
          <Section title="Systems used" testId="ctx-plan-inputs">
            <div className="space-y-1">
              {sourceSystems(steps).map(([sys]) => <p key={sys} className="text-[12.5px] text-white/75">{sys}</p>)}
            </div>
          </Section>
          <Section title="Open questions" testId="ctx-plan-open">
            <p className="text-[12.5px] text-white/60 leading-relaxed">{mission.clarifyAnswer ? `Resolved — ${mission.clarifyAnswer}` : "None recorded"}</p>
          </Section>
          <Section title="Plan readiness" testId="ctx-plan-readiness">
            <ReadinessRow label="Structure complete" ok />
            <ReadinessRow label="Authority defined" ok={steps.some((s) => s.approval)} />
            <ReadinessRow label="Required inputs available" ok />
            <ReadinessRow label="Ready to run" ok />
          </Section>
        </>
      )}

      {mission.state === "approval" && currentStep?.approvalCard && (
        <>
          <div className="flex items-center gap-2.5 my-3.5">
            <span className="w-6 h-[2px] bg-[#ff4d0a] inline-block shrink-0" aria-hidden="true" />
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#ff4d0a]">Approval required</p>
          </div>
          <InspectorRow label="Action" value={currentStep.approvalCard.action} />
          <InspectorRow label="Why approval is required" value={currentStep.approvalCard.reason} />
          <InspectorRow label="What will change" value={`${currentStep.approvalCard.system} · ${currentStep.approvalCard.scope}`} />
          <InspectorRow label="What will not change" value="Prior decisions and existing evidence on this mission" />
          <InspectorRow label="Evidence" value={`${mission.history.length} item${mission.history.length === 1 ? "" : "s"} attached`} />
        </>
      )}

      {(mission.state === "run" || mission.state === "failure" || mission.state === "stopped") && (
        <>
          <Section title="Live execution" testId="ctx-run-live">
            <InspectorRow label="Current step" value={mission.state === "stopped" ? "Stopped" : currentStep?.label || "—"} />
            <InspectorRow label="Completed" value={`${mission.completedSteps.length} / ${steps.length}`} />
            <InspectorRow label="Waiting" value={`${Math.max(0, steps.length - mission.completedSteps.length - (mission.state === "run" ? 1 : 0))} step(s)`} />
          </Section>
          <Section title="System activity" testId="ctx-run-activity">
            <div className="space-y-1.5">
              {steps.map((s, i) => {
                const done = mission.completedSteps.includes(s.id);
                const running = i === mission.stepIndex && mission.state === "run";
                const status = done ? "Complete" : running ? "Running" : "Waiting";
                return (
                  <div key={s.id} className="flex items-center justify-between text-[12.5px]">
                    <span className={done || running ? "text-white/80" : "text-white/40"}>{s.label}</span>
                    <span className={`text-[11px] font-medium ${done ? "text-[#ff8b45]" : running ? "text-[#ff4d0a]" : "text-white/30"}`}>{status}</span>
                  </div>
                );
              })}
            </div>
          </Section>
          <Section title="Recent activity" testId="ctx-run-recent"><ActivityRows mission={mission} /></Section>
          <Section title="Next expected step" testId="ctx-run-next">
            <p className="text-[12.5px] text-white/70">{steps[mission.stepIndex + (mission.completedSteps.includes(currentStep?.id) ? 1 : 0)]?.label || "Final step of this mission"}</p>
          </Section>
        </>
      )}

      {mission.state === "verify" && (
        <>
          <Section title="Checking result" testId="ctx-verify-summary">
            <InspectorRow label="Objective" value={mission.objective} />
            <InspectorRow label="Result received" value={scenario.verify.result} />
          </Section>
          <Section title="Checks" testId="ctx-verify-checks">
            <div className="space-y-1.5">
              {scenario.verify.checks.map((c) => {
                const pass = c.state === "pass" || weakResolved;
                return (
                  <div key={c.label} className="flex items-center justify-between text-[12.5px]">
                    <span className={pass ? "text-white/80" : "text-[#ff8a63]"}>{c.label}</span>
                    <span className={`text-[11px] font-medium ${pass ? "text-[#ff8b45]" : "text-[#ff8a63]"}`}>{pass ? "Checked" : "Needs review"}</span>
                  </div>
                );
              })}
            </div>
          </Section>
          {!weakResolved && scenario.verify.checks.some((c) => c.state === "weak") && (
            <Section title="Attention" testId="ctx-verify-attention">
              <p className="text-[12.5px] text-[#ff8a63] leading-relaxed">{scenario.verify.checks.find((c) => c.state === "weak")?.note}</p>
            </Section>
          )}
          <Section title="Evidence used" testId="ctx-verify-evidence">
            <div className="space-y-1">
              {scenario.verify.artifacts.map((a) => <p key={a} className="text-[12.5px] text-white/70">{a}</p>)}
            </div>
          </Section>
          <Section title="Ready for review" testId="ctx-verify-ready">
            <p className={`text-[12.5px] font-medium ${weakResolved || scenario.verify.checks.every((c) => c.state === "pass") ? "text-[#ff8b45]" : "text-white/40"}`}>{weakResolved || scenario.verify.checks.every((c) => c.state === "pass") ? "Yes" : "Waiting"}</p>
          </Section>
        </>
      )}

      {mission.state === "complete" && (
        <>
          <Section title="Result summary" testId="ctx-complete-summary">
            <InspectorRow label="Objective" value={mission.objective} />
            <InspectorRow label="Outcome" value={scenario.verify.result} />
            <InspectorRow label="Final state" value="Complete" />
          </Section>
          <Section title="What was completed" testId="ctx-complete-steps">
            <div className="space-y-1">
              {steps.map((s) => <p key={s.id} className="text-[12.5px] text-white/75">{s.label}</p>)}
            </div>
          </Section>
          <Section title="Human decisions" testId="ctx-complete-decisions">
            {mission.decisions.length ? (
              <div className="space-y-1">
                {mission.decisions.map((d, i) => <p key={i} className="text-[12.5px] text-white/70">{d.decision} — {d.action}</p>)}
              </div>
            ) : <p className="text-[12.5px] text-white/30">None recorded</p>}
          </Section>
          <Section title="Checks passed" testId="ctx-complete-checks">
            <p className="text-[12.5px] text-white/75">{scenario.verify.checks.filter((c) => c.state === "pass" || weakResolved).length} / {scenario.verify.checks.length}</p>
          </Section>
          <Section title="Evidence" testId="ctx-complete-evidence">
            <p className="text-[12.5px] text-white/75">{scenario.verify.artifacts.length} artifacts · {mission.history.length} events</p>
          </Section>
          <Section title="Usage" testId="ctx-complete-usage">
            <p className="text-[12.5px] text-[#ff8b45]">~{estimateMissionUsage(mission, scenario).total} demo credits</p>
            <p className="text-[10.5px] text-white/30 mt-0.5">Demo estimate — no billing attached</p>
          </Section>
        </>
      )}
    </InspectorPanel>
  );
}
