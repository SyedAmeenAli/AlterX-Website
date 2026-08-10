import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Play, Pencil, Copy, Archive, ArrowLeft, Check } from "lucide-react";
import { listWorkflows, saveWorkflow, createMission } from "@/lib/store";
import { StructureStrip } from "@/try/InspectorPanel";

export default function WorkflowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const wf = listWorkflows().find((w) => w.id === id);

  if (!wf) {
    return (
      <div className="p-8" data-testid="workflow-not-found">
        <p className="text-white/60">Workflow not found in this browser&apos;s demo storage.</p>
        <Link to="/try-alter-engine/workflows" className="text-[#ff4d0a] font-semibold text-[14px] mt-3 inline-block">Back to workflows</Link>
      </div>
    );
  }

  const run = () => {
    const m = createMission(wf.objective);
    saveWorkflow({ ...wf, runs: (wf.runs || 0) + 1 });
    navigate(`/try-alter-engine/missions/${m.id}`);
  };
  const duplicate = () => {
    const copy = { ...wf, id: `${wf.id}-copy-${Date.now() % 1000}`, name: `${wf.name} (copy)`, runs: 0, createdAt: Date.now() };
    saveWorkflow(copy);
    navigate(`/try-alter-engine/workflows/${copy.id}`);
  };
  const archive = () => { saveWorkflow({ ...wf, archived: !wf.archived }); navigate(0); };

  return (
    <div className="p-6 md:p-10" data-testid="workflow-detail">
      <Link to="/try-alter-engine/workflows" className="text-[13px] font-medium text-white/45 hover:text-[#ff4d0a] flex items-center gap-1.5 mb-5"><ArrowLeft size={13} aria-hidden="true" />Workflows</Link>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="ax-display text-2xl md:text-3xl">{wf.name}</h1>
            {wf.archived && <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40 border border-white/15 rounded-[4px] px-2 py-1">Archived</span>}
          </div>
          <p className="text-white/55 text-[14px] mb-8">{wf.objective}</p>

          {[
            ["Inputs", (wf.inputs || []).join(", ") || "None recorded"],
            ["Trigger", wf.trigger ? (wf.trigger.type === "Scheduled" ? `${(wf.trigger.days || []).join(", ")} · ${wf.trigger.time} · ${wf.trigger.timezone}` : wf.trigger.type) : "Manual"],
            ["Authority", (wf.authority || []).length ? wf.authority.map((a) => `${a.action} → ${a.approver}`).join(", ") : "None recorded"],
            ["Checks", (wf.checks || []).join(", ") || "None recorded"],
            ["Runs", `${wf.runs || 0} demo run${wf.runs === 1 ? "" : "s"}`],
            ["Estimated usage", `${wf.usage || 0} demo credits`],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-white/10 py-3" data-testid={`workflow-detail-${k.toLowerCase().replace(/\s+/g, "-")}`}>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">{k}</p>
              <p className="text-[13.5px] text-white/85 mt-1">{v}</p>
            </div>
          ))}

          <div className="flex flex-wrap gap-2 mt-7">
            <button onClick={run} className="bg-[#ff4d0a] text-black text-[13px] font-semibold rounded-[5px] px-4 py-2.5 flex items-center gap-1.5" data-testid="workflow-detail-run"><Play size={12} aria-hidden="true" />Run workflow</button>
            <button onClick={() => navigate(`/try-alter-engine/workflows/new?edit=${wf.id}`)} className="border border-white/20 text-white/75 text-[13px] font-semibold rounded-[5px] px-4 py-2.5 flex items-center gap-1.5" data-testid="workflow-detail-edit"><Pencil size={12} aria-hidden="true" />Edit</button>
            <button onClick={duplicate} className="border border-white/20 text-white/75 text-[13px] font-semibold rounded-[5px] px-4 py-2.5 flex items-center gap-1.5" data-testid="workflow-detail-duplicate"><Copy size={12} aria-hidden="true" />Duplicate</button>
            <button onClick={archive} className="border border-white/20 text-white/75 text-[13px] font-semibold rounded-[5px] px-4 py-2.5 flex items-center gap-1.5" data-testid="workflow-detail-archive"><Archive size={12} aria-hidden="true" />{wf.archived ? "Restore" : "Archive"}</button>
          </div>
        </div>

        <aside
          className="sticky top-6 rounded-[8px] overflow-hidden border-l border-white/[.07] p-6"
          style={{ background: "radial-gradient(circle at 72% 18%, rgba(249,115,22,.09), transparent 34%), linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.012)), #0D0D0D" }}
          data-testid="workflow-detail-summary"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40 mb-4">Workflow structure</p>
          <StructureStrip
            stages={[
              { label: "Outcome", done: true },
              { label: "Inputs", done: (wf.inputs || []).length > 0 },
              { label: "Authority", done: (wf.authority || []).length > 0 },
              { label: "Checks", done: (wf.checks || []).length > 0 },
              { label: "Ready", done: true },
            ]}
          />
          <div className="border-t border-white/[.07] pt-3.5">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40 mb-2">Checks</p>
            <div className="space-y-1.5 text-[13px]">
              {(wf.checks || []).length ? (wf.checks || []).map((c) => (
                <div key={c} className="flex items-center gap-2 text-white/75"><Check size={11} className="text-[#ff4d0a]" aria-hidden="true" />{c}</div>
              )) : <p className="text-white/30">None recorded</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
