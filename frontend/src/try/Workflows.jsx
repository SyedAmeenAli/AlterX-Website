import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Repeat, Play, Copy, Archive, Pencil } from "lucide-react";
import { listWorkflows, saveWorkflow, createMission } from "@/lib/store";

export default function Workflows() {
  const [, force] = useState(0);
  const [renaming, setRenaming] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const wfs = listWorkflows();
  const active = wfs.filter((w) => !w.archived);
  const archived = wfs.filter((w) => w.archived);

  const refresh = () => force((n) => n + 1);
  const run = (wf) => {
    const m = createMission(wf.objective);
    navigate(`/try-alter-engine/missions/${m.id}`);
  };

  const Card = ({ w }) => (
    <div className="border border-white/12 p-5" data-testid={`workflow-card-${w.id}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        {renaming === w.id ? (
          <div className="flex gap-2 flex-1">
            <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-black border border-white/25 px-2 py-1 text-[13px] text-white focus:border-[#ff5a1f] focus:outline-none" data-testid="workflow-rename-input" />
            <button onClick={() => { saveWorkflow({ ...w, name: name || w.name }); setRenaming(null); refresh(); }} className="bg-[#ff5a1f] text-black text-[11px] font-bold px-3" data-testid="workflow-rename-save">Save</button>
          </div>
        ) : (
          <p className="font-bold text-[15px] flex items-center gap-2"><Repeat size={14} className="text-[#ff5a1f]" aria-hidden="true" />{w.name}</p>
        )}
        <span className="font-mono-ax text-[10px] text-white/40 shrink-0">{w.id}</span>
      </div>
      <p className="text-[12.5px] text-white/55 mb-3">{w.objective}</p>
      <p className="font-mono-ax text-[10px] text-white/40 mb-4">{w.steps.length} steps · {w.approvals} approval point{w.approvals !== 1 ? "s" : ""}</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => run(w)} className="bg-[#ff5a1f] text-black text-[12px] font-bold px-3 py-1.5 flex items-center gap-1.5" data-testid={`workflow-run-${w.id}`}><Play size={11} aria-hidden="true" />Start mission</button>
        <button onClick={() => { setRenaming(w.id); setName(w.name); }} className="border border-white/20 text-white/70 text-[12px] px-3 py-1.5 flex items-center gap-1.5" data-testid={`workflow-rename-${w.id}`}><Pencil size={11} aria-hidden="true" />Rename</button>
        <button onClick={() => { saveWorkflow({ ...w, id: `${w.id}-copy-${Date.now() % 1000}`, name: `${w.name} (copy)` }); refresh(); }} className="border border-white/20 text-white/70 text-[12px] px-3 py-1.5 flex items-center gap-1.5" data-testid={`workflow-duplicate-${w.id}`}><Copy size={11} aria-hidden="true" />Duplicate</button>
        <button onClick={() => { saveWorkflow({ ...w, archived: !w.archived }); refresh(); }} className="border border-white/20 text-white/70 text-[12px] px-3 py-1.5 flex items-center gap-1.5" data-testid={`workflow-archive-${w.id}`}><Archive size={11} aria-hidden="true" />{w.archived ? "Restore" : "Archive"}</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-[1000px]" data-testid="workflows-page">
      <h1 className="ax-display text-3xl mb-2">Workflows</h1>
      <p className="text-white/50 text-[14px] mb-8">Successful missions saved as reusable, approval-aware structures.</p>
      {active.length === 0 ? (
        <div className="border border-white/12 p-10 text-center" data-testid="workflows-empty">
          <Repeat size={20} className="mx-auto text-white/30 mb-3" aria-hidden="true" />
          <p className="text-white/55 text-[14px] max-w-md mx-auto">No workflows yet. Complete a mission and choose “Save as workflow” at the Check stage.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">{active.map((w) => <Card key={w.id} w={w} />)}</div>
      )}
      {archived.length > 0 && (
        <>
          <h2 className="font-mono-ax text-[10px] uppercase tracking-wider text-white/40 mt-10 mb-3">Archived</h2>
          <div className="grid md:grid-cols-2 gap-3 opacity-60">{archived.map((w) => <Card key={w.id} w={w} />)}</div>
        </>
      )}
    </div>
  );
}
