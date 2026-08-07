import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Repeat, Play, Copy, Archive, Pencil } from "lucide-react";
import { listWorkflows, saveWorkflow, createMission } from "@/lib/store";

const Card = ({ w, renaming, name, setName, onRenameSave, onRenameStart, onDuplicate, onArchive, onRun }) => (
  <div className="border border-white/12 rounded-[4px] p-5" data-testid={`workflow-card-${w.id}`}>
    <div className="flex items-start justify-between gap-3 mb-2">
      {renaming === w.id ? (
        <div className="flex gap-2 flex-1">
          <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-black border border-white/25 rounded-[4px] px-2 py-1 text-[13px] text-white focus:border-[#ff4d0a] focus:outline-none" data-testid="workflow-rename-input" />
          <button onClick={() => onRenameSave(w)} className="bg-[#ff4d0a] text-black text-[11px] font-semibold rounded-[3px] px-3" data-testid="workflow-rename-save">Save</button>
        </div>
      ) : (
        <p className="font-semibold text-[15px] flex items-center gap-2"><Repeat size={14} className="text-[#ff4d0a]" aria-hidden="true" />{w.name}</p>
      )}
      <span className="font-mono-ax text-[10px] text-white/40 shrink-0">{w.id}</span>
    </div>
    <p className="text-[12.5px] text-white/55 mb-3">{w.objective}</p>
    <svg viewBox="0 0 220 22" className="w-[200px] h-[20px] mb-2" aria-hidden="true">
      {w.steps.map((s, i) => {
        const gap = 196 / Math.max(1, w.steps.length - 1);
        const x = 12 + i * gap;
        return (
          <g key={i}>
            {i > 0 && <line x1={x - gap + 6} y1="11" x2={x - 6} y2="11" stroke="rgba(255,255,255,.25)" strokeWidth="1.2" />}
            <circle cx={x} cy="11" r="4" fill="none" stroke={i === Math.floor(w.steps.length / 2) && w.approvals > 0 ? "#ff4d0a" : "rgba(255,255,255,.4)"} strokeWidth="1.4" />
          </g>
        );
      })}
    </svg>
    <p className="text-[11px] text-white/40 mb-4">{w.steps.length} steps · {w.approvals} approval point{w.approvals !== 1 ? "s" : ""}</p>
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onRun(w)} className="bg-[#ff4d0a] text-black text-[12px] font-semibold rounded-[3px] px-3 py-1.5 flex items-center gap-1.5" data-testid={`workflow-run-${w.id}`}><Play size={11} aria-hidden="true" />Start mission</button>
      <button onClick={() => onRenameStart(w)} className="border border-white/20 rounded-[3px] text-white/70 text-[12px] px-3 py-1.5 flex items-center gap-1.5" data-testid={`workflow-rename-${w.id}`}><Pencil size={11} aria-hidden="true" />Rename</button>
      <button onClick={() => onDuplicate(w)} className="border border-white/20 rounded-[3px] text-white/70 text-[12px] px-3 py-1.5 flex items-center gap-1.5" data-testid={`workflow-duplicate-${w.id}`}><Copy size={11} aria-hidden="true" />Duplicate</button>
      <button onClick={() => onArchive(w)} className="border border-white/20 rounded-[3px] text-white/70 text-[12px] px-3 py-1.5 flex items-center gap-1.5" data-testid={`workflow-archive-${w.id}`}><Archive size={11} aria-hidden="true" />{w.archived ? "Restore" : "Archive"}</button>
    </div>
  </div>
);

export default function Workflows() {
  const [, force] = useState(0);
  const [renaming, setRenaming] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const wfs = listWorkflows();
  const active = wfs.filter((w) => !w.archived);
  const archived = wfs.filter((w) => w.archived);

  const refresh = () => force((n) => n + 1);
  const cardProps = {
    renaming, name, setName,
    onRenameSave: (w) => { saveWorkflow({ ...w, name: name || w.name }); setRenaming(null); refresh(); },
    onRenameStart: (w) => { setRenaming(w.id); setName(w.name); },
    onDuplicate: (w) => { saveWorkflow({ ...w, id: `${w.id}-copy-${Date.now() % 1000}`, name: `${w.name} (copy)` }); refresh(); },
    onArchive: (w) => { saveWorkflow({ ...w, archived: !w.archived }); refresh(); },
    onRun: (wf) => { const m = createMission(wf.objective); navigate(`/try-alter-engine/missions/${m.id}`); },
  };

  return (
    <div className="p-6 md:p-10 max-w-[1000px]" data-testid="workflows-page">
      <h1 className="ax-display text-3xl mb-2">Workflows</h1>
      <p className="text-white/50 text-[14px] mb-8">Successful missions saved as reusable, approval-aware structures.</p>
      {active.length === 0 ? (
        <div className="py-14 text-center" data-testid="workflows-empty">
          <Repeat size={20} className="mx-auto text-white/30 mb-3" aria-hidden="true" />
          <p className="text-white/55 text-[14px] max-w-md mx-auto">No workflows yet. Complete a mission and choose “Save as workflow” at the Check stage.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">{active.map((w) => <Card key={w.id} w={w} {...cardProps} />)}</div>
      )}
      {archived.length > 0 && (
        <>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40 mt-10 mb-3">Archived</h2>
          <div className="grid md:grid-cols-2 gap-3 opacity-60">{archived.map((w) => <Card key={w.id} w={w} {...cardProps} />)}</div>
        </>
      )}
    </div>
  );
}
