import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { saveWorkflow, listWorkflows } from "@/lib/store";
import { estimateWorkflowUsage } from "@/lib/demoCredits";
import { StructureStrip } from "@/try/InspectorPanel";

/*
  WorkflowComposer — the real in-app tool (not the marketing illustration
  on /solutions/custom-workflows). Six steps, real localStorage persistence
  via saveWorkflow(). The right side is a LIVE WORKFLOW SUMMARY built from
  actual form state — no decorative geometry, updates as fields fill in.
*/

const STEPS = ["Outcome", "Inputs", "Trigger", "Authority", "Checks", "Review"];
const INPUT_OPTIONS = ["Supplier records", "Current quotes", "Quality notes", "ERP", "Uploaded files", "Manual input"];
const TRIGGER_OPTIONS = ["Manual", "Scheduled", "Event-based"];
const AUTHORITY_ACTIONS = ["Supplier commitment", "Order creation", "External communication", "Account change"];
const APPROVER_ROLES = ["Operations manager", "Finance lead", "Team owner"];
const CHECK_OPTIONS = ["Delivery reliability", "Quality evidence", "Commercial terms", "Required information present", "Result matches objective"];
const FAILURE_OPTIONS = ["Retry step", "Return to previous step", "Ask for clarification", "Stop and escalate"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export default function WorkflowComposer() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("edit");
  const existing = editId ? listWorkflows().find((w) => w.id === editId) : null;

  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState(existing?.outcome || "");
  const [doneWhen, setDoneWhen] = useState(existing?.doneWhen || "");
  const [inputs, setInputs] = useState(existing?.inputs || []);
  const [trigger, setTrigger] = useState(existing?.trigger?.type || "Manual");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleDays, setScheduleDays] = useState(existing?.trigger?.days || ["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [scheduleTime, setScheduleTime] = useState(existing?.trigger?.time || "08:30");
  const [authority, setAuthority] = useState(existing?.authority || []);
  const [checks, setChecks] = useState(existing?.checks || []);
  const [failureResponse, setFailureResponse] = useState(existing?.failureResponse || "Return to previous step");
  const [created, setCreated] = useState(null);

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const addAuthority = (action) => {
    setAuthority((prev) => (prev.find((a) => a.action === action) ? prev.filter((a) => a.action !== action) : [...prev, { action, approver: APPROVER_ROLES[0] }]));
  };
  const setApprover = (action, approver) => setAuthority((prev) => prev.map((a) => (a.action === action ? { ...a, approver } : a)));

  const usage = estimateWorkflowUsage({ inputs, checks, authority });

  const finish = () => {
    const id = existing?.id || `WF-${Date.now().toString(36).toUpperCase()}`;
    const wf = {
      id,
      name: existing?.name || outcome.slice(0, 48) || "Untitled workflow",
      objective: outcome,
      doneWhen,
      inputs,
      trigger: trigger === "Scheduled" ? { type: trigger, days: scheduleDays, time: scheduleTime, timezone: "Asia/Kolkata" } : { type: trigger },
      authority,
      checks,
      failureResponse,
      steps: [...inputs, ...authority.map((a) => a.action), ...checks], // keeps the existing Workflows-list dot visual working
      approvals: authority.length,
      runs: existing?.runs || 0,
      usage: usage.total,
      createdAt: existing?.createdAt || Date.now(),
      archived: false,
      source: "composer",
    };
    saveWorkflow(wf);
    setCreated(wf);
  };

  if (created) {
    return (
      <div className="p-6 md:p-10 max-w-[640px]" data-testid="workflow-composer-done">
        <Check size={22} className="text-[#ff4d0a] mb-4" aria-hidden="true" />
        <h1 className="ax-display text-2xl mb-2">Workflow {existing ? "updated" : "created"}.</h1>
        <p className="text-white/55 text-[14px] mb-8">“{created.name}” is saved to this demo workspace and appears in your workflows list.</p>
        <div className="flex gap-2">
          <button onClick={() => navigate("/try-alter-engine/workflows")} className="bg-[#ff4d0a] text-black text-[13px] font-semibold rounded-[4px] px-4 py-2.5" data-testid="composer-done-view-list">View workflows</button>
          <button onClick={() => navigate(`/try-alter-engine/workflows/${created.id}`)} className="border border-white/20 text-white/75 text-[13px] font-semibold rounded-[4px] px-4 py-2.5" data-testid="composer-done-view-detail">Open workflow</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10" data-testid="workflow-composer">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#ff4d0a] mb-2">{existing ? "Edit workflow" : "Define the workflow"}</p>
      <h1 className="ax-display text-2xl md:text-3xl mb-8">Configure work once. Run it with control.</h1>

      <div className="flex flex-wrap gap-1.5 mb-8" role="tablist" aria-label="Composer steps">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            className={`text-[10.5px] font-semibold px-2.5 py-1.5 rounded-[5px] border transition-colors ${i === step ? "text-[#ff4d0a] border-[#ff4d0a]/45" : i < step ? "text-white/60 border-white/20" : "text-white/30 border-white/10"}`}
            data-testid={`composer-step-${s.toLowerCase()}`}
          >
            {i + 1} / 6 · {s}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-10 items-start">
        <div className="min-w-0 max-w-[760px]">
          <div className="min-h-[220px] mb-8">
            {step === 0 && (
              <div data-testid="composer-panel-outcome">
                <label className="block text-[13.5px] font-semibold text-white/85 mb-2.5" htmlFor="wc-outcome">What needs to be completed?</label>
                <textarea id="wc-outcome" rows={3} value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Prepare a decision-ready supplier comparison before tomorrow's review." className="w-full bg-black border border-white/20 rounded-[6px] px-4 py-3 text-[14px] text-white placeholder:text-white/30 focus:border-[#ff4d0a] focus:outline-none resize-none" data-testid="composer-outcome-input" />
                <label className="block text-[13.5px] font-semibold text-white/85 mt-6 mb-2.5" htmlFor="wc-done">What should be true when this workflow is complete? <span className="text-white/35 font-normal">(optional)</span></label>
                <input id="wc-done" value={doneWhen} onChange={(e) => setDoneWhen(e.target.value)} placeholder="A ranked comparison with evidence, ready for review." className="w-full bg-black border border-white/20 rounded-[6px] px-4 py-2.5 text-[14px] text-white placeholder:text-white/30 focus:border-[#ff4d0a] focus:outline-none" data-testid="composer-done-input" />
              </div>
            )}
            {step === 1 && (
              <div data-testid="composer-panel-inputs">
                <p className="text-[13.5px] font-semibold text-white/85 mb-3">What information does the workflow need?</p>
                <div className="flex flex-wrap gap-2">
                  {INPUT_OPTIONS.map((o) => (
                    <button type="button" key={o} onClick={() => setInputs((prev) => toggle(prev, o))} className={`text-[12.5px] font-semibold px-3 py-2 rounded-[6px] border transition-colors ${inputs.includes(o) ? "bg-[#ff4d0a] text-black border-[#ff4d0a]" : "text-white/70 border-white/20"}`} data-testid={`composer-input-${o.toLowerCase().replace(/\s+/g, "-")}`}>
                      {inputs.includes(o) && <Check size={11} className="inline mr-1 -mt-0.5" aria-hidden="true" />}{o}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div data-testid="composer-panel-trigger">
                <p className="text-[13.5px] font-semibold text-white/85 mb-3">How should the workflow begin?</p>
                <div className="flex gap-2 mb-4">
                  {TRIGGER_OPTIONS.map((o) => (
                    <button type="button" key={o} onClick={() => { setTrigger(o); setScheduleOpen(o === "Scheduled"); }} className={`text-[12.5px] font-semibold px-3.5 py-2 rounded-[6px] border transition-colors ${trigger === o ? "bg-[#ff4d0a] text-black border-[#ff4d0a]" : "text-white/70 border-white/20"}`} data-testid={`composer-trigger-${o.toLowerCase().replace(/\s+/g, "-")}`}>
                      {o}
                    </button>
                  ))}
                </div>
                {trigger === "Scheduled" && (
                  <div className="border border-white/15 rounded-[6px] p-4" data-testid="composer-schedule-config">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/40 mb-3">Configuration preview</p>
                    <div className="flex gap-1.5 mb-4">
                      {DAYS.map((d) => (
                        <button type="button" key={d} onClick={() => setScheduleDays((prev) => toggle(prev, d))} className={`w-9 h-9 rounded-[5px] text-[11px] font-semibold border transition-colors ${scheduleDays.includes(d) ? "bg-[#ff4d0a] text-black border-[#ff4d0a]" : "text-white/50 border-white/15"}`} data-testid={`composer-schedule-day-${d.toLowerCase()}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-[13px] text-white/70">
                      <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="bg-black border border-white/20 rounded-[5px] px-2.5 py-1.5 text-white" data-testid="composer-schedule-time" />
                      <span>Asia/Kolkata</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {step === 3 && (
              <div data-testid="composer-panel-authority">
                <p className="text-[13.5px] font-semibold text-white/85 mb-3">Which actions require approval?</p>
                <div className="flex flex-col gap-2">
                  {AUTHORITY_ACTIONS.map((a) => {
                    const picked = authority.find((x) => x.action === a);
                    return (
                      <div key={a} className={`border rounded-[6px] p-3 ${picked ? "border-[#ff4d0a]/45" : "border-white/12"}`}>
                        <button type="button" onClick={() => addAuthority(a)} className="flex items-center gap-2 text-[13px] font-semibold text-white/85" data-testid={`composer-authority-${a.toLowerCase().replace(/\s+/g, "-")}`}>
                          <span className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center ${picked ? "bg-[#ff4d0a] border-[#ff4d0a]" : "border-white/25"}`}>{picked && <Check size={9} className="text-black" />}</span>
                          {a}
                        </button>
                        {picked && (
                          <div className="mt-2.5 pl-5.5 flex items-center gap-2 text-[12px]">
                            <span className="text-white/40">Approver</span>
                            <select value={picked.approver} onChange={(e) => setApprover(a, e.target.value)} className="bg-black border border-white/20 rounded-[4px] px-2 py-1 text-white/80" data-testid={`composer-approver-${a.toLowerCase().replace(/\s+/g, "-")}`}>
                              {APPROVER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {step === 4 && (
              <div data-testid="composer-panel-checks">
                <p className="text-[13.5px] font-semibold text-white/85 mb-3">What must be checked before this workflow is complete?</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {CHECK_OPTIONS.map((o) => (
                    <button type="button" key={o} onClick={() => setChecks((prev) => toggle(prev, o))} className={`text-[12.5px] font-semibold px-3 py-2 rounded-[6px] border transition-colors ${checks.includes(o) ? "bg-[#ff4d0a] text-black border-[#ff4d0a]" : "text-white/70 border-white/20"}`} data-testid={`composer-check-${o.toLowerCase().replace(/\s+/g, "-")}`}>
                      {checks.includes(o) && <Check size={11} className="inline mr-1 -mt-0.5" aria-hidden="true" />}{o}
                    </button>
                  ))}
                </div>
                <p className="text-[13px] text-white/50 mb-2.5">If a check fails</p>
                <div className="flex flex-wrap gap-2">
                  {FAILURE_OPTIONS.map((o) => (
                    <button type="button" key={o} onClick={() => setFailureResponse(o)} className={`text-[12px] font-semibold px-3 py-1.5 rounded-[6px] border transition-colors ${failureResponse === o ? "bg-[#ff4d0a] text-black border-[#ff4d0a]" : "text-white/60 border-white/15"}`} data-testid={`composer-failure-${o.toLowerCase().replace(/\s+/g, "-")}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 5 && (
              <div data-testid="composer-panel-review">
                {[
                  ["Outcome", outcome || "—"],
                  ["Inputs", inputs.length ? inputs.join(", ") : "None selected"],
                  ["Trigger", trigger === "Scheduled" ? `${scheduleDays.join(", ")} · ${scheduleTime} · Asia/Kolkata` : trigger],
                  ["Authority", authority.length ? authority.map((a) => `${a.action} → ${a.approver}`).join(", ") : "None selected"],
                  ["Checks", checks.length ? checks.join(", ") : "None selected"],
                  ["Failure response", failureResponse],
                ].map(([k, v]) => (
                  <div key={k} className="border-t border-white/10 py-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">{k}</p>
                    <p className="text-[13.5px] text-white/85 mt-1">{v}</p>
                  </div>
                ))}
                <div className="border-t border-white/10 py-4 mt-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#ff4d0a] mb-2">Estimated demo usage</p>
                  <div className="grid grid-cols-3 gap-3 text-[12.5px] text-white/70 mb-2">
                    <span>Planning <b className="text-white/90">~{usage.planning}</b></span>
                    <span>Action steps <b className="text-white/90">~{usage.action}</b></span>
                    <span>Checks <b className="text-white/90">~{usage.checking}</b></span>
                  </div>
                  <p className="text-[13px] text-white/50">Estimated run: <b className="text-[#ff8b45]">~{usage.total} demo credits</b> · Demo estimate, no billing attached</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {step > 0 && <button type="button" onClick={back} className="border border-white/20 text-white/70 text-[13px] font-semibold rounded-[5px] px-4 py-2.5 flex items-center gap-1.5" data-testid="composer-back-btn"><ArrowLeft size={13} aria-hidden="true" />Back</button>}
            {step < 5 ? (
              <button type="button" onClick={next} className="bg-[#ff4d0a] text-black text-[13px] font-semibold rounded-[5px] px-4 py-2.5 flex items-center gap-1.5" data-testid="composer-next-btn">Continue<ArrowRight size={13} aria-hidden="true" /></button>
            ) : (
              <button type="button" onClick={finish} className="bg-[#ff4d0a] text-black text-[13px] font-semibold rounded-[5px] px-5 py-2.5" data-testid="composer-finish-btn">{existing ? "Save workflow" : "Create workflow"}</button>
            )}
          </div>
        </div>

        <WorkflowStructurePreview step={step} outcome={outcome} inputs={inputs} trigger={trigger} authority={authority} checks={checks} />
      </div>
    </div>
  );
}

/* LIVE WORKFLOW SUMMARY — the right side reflects exactly what the user is
   configuring, no decorative geometry. A restrained structure strip up top,
   thin-rule sections below, estimated demo usage at the bottom. Every field
   appears/updates with a small 180-240ms fade+rise, driven by real state. */
function WorkflowStructurePreview({ step, outcome, inputs, trigger, authority, checks }) {
  const usage = estimateWorkflowUsage({ inputs, checks, authority });
  const stages = [
    { label: "Outcome", done: !!outcome.trim(), current: step === 0 },
    { label: "Inputs", done: inputs.length > 0, current: step === 1 },
    { label: "Authority", done: authority.length > 0, current: step === 3 },
    { label: "Checks", done: checks.length > 0, current: step === 4 },
    { label: "Ready", done: step === 5, current: step === 5 },
  ];

  const Section = ({ label, children, testId }) => (
    <div className="border-t border-white/[.07] py-3.5" data-testid={testId}>
      <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40 mb-1.5">{label}</p>
      {children}
    </div>
  );

  return (
    <aside
      className="sticky top-6 rounded-[8px] overflow-hidden border-l border-white/[.07] p-6"
      style={{ background: "radial-gradient(circle at 72% 18%, rgba(249,115,22,.09), transparent 34%), linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.012)), #0D0D0D" }}
      data-testid="workflow-structure-preview"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40 mb-4">Workflow preview</p>
      <StructureStrip stages={stages} />

      <Section label="Outcome" testId="preview-outcome">
        <p className="text-[13.5px] text-white/85 leading-snug transition-opacity duration-200" key={outcome}>
          {outcome.trim() || <span className="text-white/30">Not yet described</span>}
        </p>
      </Section>

      <Section label="Inputs" testId="preview-inputs">
        {inputs.length ? (
          <div className="flex flex-col gap-1.5">
            {inputs.map((i) => (
              <div key={i} className="flex items-center gap-2 text-[13px] text-white/80 animate-[axw-block-in_200ms_cubic-bezier(.25,1,.5,1)_both]" data-testid={`preview-input-${i.toLowerCase().replace(/\s+/g, "-")}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff8b45] shrink-0" aria-hidden="true" />{i}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-white/30">None selected</p>
        )}
      </Section>

      <Section label="Trigger" testId="preview-trigger">
        <p className="text-[13px] text-white/80">{trigger}</p>
      </Section>

      <Section label="Authority" testId="preview-authority">
        {authority.length ? (
          <div className="flex flex-col gap-1.5">
            {authority.map((a) => (
              <div key={a.action} className="flex items-center gap-2 text-[13px] text-[#ff8b45] animate-[axw-block-in_200ms_cubic-bezier(.25,1,.5,1)_both]" data-testid={`preview-authority-${a.action.toLowerCase().replace(/\s+/g, "-")}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d0a] shrink-0" aria-hidden="true" />{a.action} → {a.approver}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-white/30">None selected</p>
        )}
      </Section>

      <Section label="Checks" testId="preview-checks">
        {checks.length ? (
          <div className="flex flex-col gap-1.5">
            {checks.map((c) => (
              <div key={c} className="flex items-center gap-2 text-[13px] text-white/80 animate-[axw-block-in_200ms_cubic-bezier(.25,1,.5,1)_both]" data-testid={`preview-check-${c.toLowerCase().replace(/\s+/g, "-")}`}>
                <Check size={11} className="text-[#ff4d0a] shrink-0" aria-hidden="true" />{c}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-white/30">None selected</p>
        )}
      </Section>

      <div className="border-t border-white/[.07] pt-4 mt-1">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#ff4d0a] mb-2.5">Estimated demo usage</p>
        <div className="flex flex-col gap-1.5 text-[12.5px] text-white/65 mb-2.5">
          <span className="flex justify-between"><span>Planning</span><b className="text-white/90 font-semibold">~{usage.planning}</b></span>
          <span className="flex justify-between"><span>Work</span><b className="text-white/90 font-semibold">~{usage.action}</b></span>
          <span className="flex justify-between"><span>Checks</span><b className="text-white/90 font-semibold">~{usage.checking}</b></span>
        </div>
        <p className="text-[13px] text-white/50">Estimated run <b className="text-[#ff8b45]">~{usage.total} demo credits</b></p>
        <p className="text-[10.5px] text-white/30 mt-1">Demo estimate — no billing attached</p>
      </div>
    </aside>
  );
}
