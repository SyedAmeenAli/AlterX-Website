import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Repeat, Play, Copy, Archive, Pencil, Plus, Check } from "lucide-react";
import { listWorkflows, saveWorkflow, createMission } from "@/lib/store";
import { InspectorPanel, InspectorEmpty, InspectorEyebrow } from "@/try/InspectorPanel";

function Row({ w, isSel, renaming, name, setName, onSelect, onRenameSave, onRenameStart, onDuplicate, onArchive, onRun, onOpen }) {
  return (
    <div
      onClick={() => !renaming && onOpen(w)}
      onMouseEnter={() => onSelect(w.id)}
      className={`relative grid md:grid-cols-[1fr_120px_auto] gap-3 items-center px-5 py-4 cursor-pointer transition-colors ${isSel ? "bg-white/[.025]" : ""}`}
      data-testid={`workflow-row-${w.id}`}
      role="button"
      tabIndex={0}
    >
      <span className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#ff4d0a] transition-opacity duration-200 ${isSel ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
      <div className="min-w-0">
        {renaming === w.id ? (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-black border border-white/25 rounded-[4px] px-2 py-1 text-[13px] text-white focus:border-[#ff4d0a] focus:outline-none" data-testid="workflow-rename-input" />
            <button onClick={() => onRenameSave(w)} className="bg-[#ff4d0a] text-black text-[11px] font-semibold rounded-[3px] px-3" data-testid="workflow-rename-save">Save</button>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-[14px] font-bold text-white/90 truncate"><Repeat size={13} className="text-[#ff4d0a] shrink-0" aria-hidden="true" />{w.name}{w.archived && <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/40 border border-white/15 rounded-[3px] px-1.5 py-0.5 shrink-0">Archived</span>}</p>
        )}
        <p className="text-[12px] text-white/45 mt-0.5 truncate">{w.objective}</p>
      </div>
      <span className="text-[11.5px] text-white/45 hidden md:block">{w.runs || 0} demo run{w.runs === 1 ? "" : "s"}</span>
      <div className="flex flex-wrap gap-1.5 justify-end" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onRun(w)} className="bg-[#ff4d0a] text-black text-[11px] font-semibold rounded-[3px] px-2.5 py-1.5 flex items-center gap-1" data-testid={`workflow-run-${w.id}`}><Play size={10} aria-hidden="true" />Run</button>
        <button onClick={() => onRenameStart(w)} className="border border-white/20 rounded-[3px] text-white/70 text-[11px] px-2.5 py-1.5" data-testid={`workflow-rename-${w.id}`}><Pencil size={10} aria-hidden="true" /></button>
        <button onClick={() => onDuplicate(w)} className="border border-white/20 rounded-[3px] text-white/70 text-[11px] px-2.5 py-1.5" data-testid={`workflow-duplicate-${w.id}`}><Copy size={10} aria-hidden="true" /></button>
        <button onClick={() => onArchive(w)} className="border border-white/20 rounded-[3px] text-white/70 text-[11px] px-2.5 py-1.5" data-testid={`workflow-archive-${w.id}`}><Archive size={10} aria-hidden="true" /></button>
      </div>
    </div>
  );
}

export default function Workflows() {
  const [, force] = useState(0);
  const [renaming, setRenaming] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const wfs = listWorkflows();
  const active = wfs.filter((w) => !w.archived);
  const archived = wfs.filter((w) => w.archived);
  const [selectedId, setSelectedId] = useState(active[0]?.id || archived[0]?.id || null);
  const selected = wfs.find((w) => w.id === selectedId) || null;

  const refresh = () => force((n) => n + 1);
  const rowProps = {
    renaming, name, setName,
    onSelect: setSelectedId,
    onOpen: (w) => navigate(`/try-alter-engine/workflows/${w.id}`),
    onRenameSave: (w) => { saveWorkflow({ ...w, name: name || w.name }); setRenaming(null); refresh(); },
    onRenameStart: (w) => { setRenaming(w.id); setName(w.name); },
    onDuplicate: (w) => { const copy = { ...w, id: `${w.id}-copy-${Date.now() % 1000}`, name: `${w.name} (copy)`, runs: 0 }; saveWorkflow(copy); setSelectedId(copy.id); refresh(); },
    onArchive: (w) => { saveWorkflow({ ...w, archived: !w.archived }); refresh(); },
    onRun: (wf) => { const m = createMission(wf.objective); saveWorkflow({ ...wf, runs: (wf.runs || 0) + 1 }); navigate(`/try-alter-engine/missions/${m.id}`); },
  };

  return (
    <div className="p-6 md:p-10" data-testid="workflows-page">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
        <div>
          <h1 className="ax-display text-3xl mb-2">Define work once. Run it with control.</h1>
          <p className="text-white/50 text-[14px]">Your workflows — configured once, saved to this demo workspace, reusable.</p>
        </div>
        <button onClick={() => navigate("/try-alter-engine/workflows/new")} className="bg-[#ff4d0a] text-black text-[13px] font-semibold rounded-[5px] px-4 py-2.5 flex items-center gap-1.5 shrink-0" data-testid="workflows-create-btn"><Plus size={14} aria-hidden="true" />Create workflow</button>
      </div>

      {wfs.length === 0 ? (
        <div className="mt-8 border border-white/10 rounded-[8px] p-8 max-w-[560px]" data-testid="workflows-empty">
          <p className="text-white/85 text-[16px] font-semibold mb-2">No workflows yet.</p>
          <p className="text-white/55 text-[14px] mb-5">Start from an outcome and define where systems and people stay in control — or complete a mission and save it as one from the Check stage.</p>
          <button onClick={() => navigate("/try-alter-engine/workflows/new")} className="bg-[#ff4d0a] text-black text-[13px] font-semibold rounded-[5px] px-4 py-2.5" data-testid="workflows-empty-create-btn">Create workflow</button>
        </div>
      ) : (
        <div className="grid xl:grid-cols-[1fr_360px] gap-10 mt-8 items-start">
          <div className="min-w-0">
            {active.length > 0 && (
              <div className="border border-white/12 rounded-[6px] divide-y divide-white/10 mb-8">
                {active.map((w) => <Row key={w.id} w={w} isSel={selectedId === w.id} {...rowProps} />)}
              </div>
            )}
            {archived.length > 0 && (
              <>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40 mb-2.5">Archived</p>
                <div className="border border-white/12 rounded-[6px] divide-y divide-white/10 opacity-60">
                  {archived.map((w) => <Row key={w.id} w={w} isSel={selectedId === w.id} {...rowProps} />)}
                </div>
              </>
            )}
          </div>

          {selected ? (
            <InspectorPanel testId="workflow-inspector" key={selected.id}>
              <InspectorEyebrow>Workflow summary</InspectorEyebrow>
              <p className="text-[16px] font-bold text-white/90 mb-4 leading-snug">{selected.name}</p>

              <div className="border-t border-white/[.07] py-2.5">
                <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40">Outcome</p>
                <p className="text-[13px] text-white/80 mt-1 leading-relaxed">{selected.objective}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-white/[.07] py-2.5 text-center">
                <div><p className="text-[15px] font-bold text-white/90">{(selected.inputs || []).length}</p><p className="text-[10px] text-white/40 uppercase tracking-[0.08em] mt-0.5">Inputs</p></div>
                <div><p className="text-[15px] font-bold text-white/90">{(selected.authority || []).length}</p><p className="text-[10px] text-white/40 uppercase tracking-[0.08em] mt-0.5">Approvals</p></div>
                <div><p className="text-[15px] font-bold text-white/90">{(selected.checks || []).length}</p><p className="text-[10px] text-white/40 uppercase tracking-[0.08em] mt-0.5">Checks</p></div>
              </div>
              <div className="border-t border-white/[.07] py-2.5">
                <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40">Runs · demo usage</p>
                <p className="text-[13px] text-white/80 mt-1">{selected.runs || 0} demo run{selected.runs === 1 ? "" : "s"}{selected.usage ? ` · ${selected.usage} demo credits per run (estimate)` : ""}</p>
              </div>
              <div className="border-t border-white/[.07] py-2.5">
                <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40">Last run</p>
                <p className="text-[13px] text-white/80 mt-1">{selected.runs ? "Ready to review" : "Not yet run"}</p>
              </div>

              {["inputs", "checks"].map((field) =>
                (selected[field] || []).length ? (
                  <div key={field} className="border-t border-white/[.07] py-2.5">
                    <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40 mb-1.5 capitalize">{field}</p>
                    <div className="flex flex-col gap-1">
                      {selected[field].map((v) => (
                        <span key={v} className="flex items-center gap-1.5 text-[12.5px] text-white/75"><Check size={10} className="text-[#ff4d0a] shrink-0" aria-hidden="true" />{v}</span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
              {(selected.authority || []).length > 0 && (
                <div className="border-t border-white/[.07] py-2.5">
                  <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40 mb-1.5">Authority</p>
                  <div className="flex flex-col gap-1">
                    {selected.authority.map((a) => (
                      <span key={a.action} className="text-[12.5px] text-[#ff8b45]">{a.action} → {a.approver}</span>
                    ))}
                  </div>
                </div>
              )}

              <Link to={`/try-alter-engine/workflows/${selected.id}`} className="inline-block mt-5 text-[13px] font-semibold text-[#ff4d0a]" data-testid="workflow-inspector-open">Open workflow →</Link>
            </InspectorPanel>
          ) : (
            <InspectorEmpty testId="workflow-inspector-empty">No workflow selected. Select a workflow to inspect it.</InspectorEmpty>
          )}
        </div>
      )}
    </div>
  );
}
