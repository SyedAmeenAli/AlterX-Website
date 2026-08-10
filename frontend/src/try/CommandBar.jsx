import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CornerDownLeft } from "lucide-react";
import { listMissions, listWorkflows } from "@/lib/store";

export default function CommandBar({ open, onClose, onStartTour }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef();
  const navigate = useNavigate();

  const items = useMemo(() => {
    const commands = [
      { type: "Command", label: "New mission", run: () => navigate("/try-alter-engine/new") },
      { type: "Command", label: "Open approvals", run: () => navigate("/try-alter-engine/approvals") },
      { type: "Command", label: "Open evidence", run: () => navigate("/try-alter-engine/evidence") },
      { type: "Command", label: "Start tour", run: onStartTour },
    ];
    const nav = ["missions", "workflows", "connections", "knowledge", "usage", "settings"].map((n) => ({
      type: "Navigate", label: n.charAt(0).toUpperCase() + n.slice(1), run: () => navigate(`/try-alter-engine/${n}`),
    }));
    const missions = listMissions().map((m) => ({ type: "Mission", label: `${m.id} · ${m.objective}`, run: () => navigate(`/try-alter-engine/missions/${m.id}`) }));
    const wfs = listWorkflows().map((w) => ({ type: "Workflow", label: w.name, run: () => navigate("/try-alter-engine/workflows") }));
    const all = [...commands, ...nav, ...missions, ...wfs];
    if (!q.trim()) return all.slice(0, 10);
    return all.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())).slice(0, 10);
  }, [q, navigate, onStartTour]);

  useEffect(() => { if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current?.focus(), 40); } }, [open]);
  useEffect(() => { setSel(0); }, [q]);

  if (!open) return null;

  const runItem = (item) => { item.run(); onClose(); };

  const onKey = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(items.length - 1, s + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    if (e.key === "Enter" && items[sel]) runItem(items[sel]);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 flex items-start justify-center pt-[14vh]" onClick={onClose} data-testid="command-bar-overlay">
      <div className="w-[min(620px,calc(100vw-32px))] bg-[#090909] border border-white/20" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search and commands" data-testid="command-bar">
        <div className="flex items-center gap-3 px-4 border-b border-white/12">
          <Search size={15} className="text-white/40" aria-hidden="true" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search missions, approvals, workflows — or run a command..."
            className="flex-1 bg-transparent py-3.5 text-[14px] text-white placeholder:text-white/35 focus:outline-none"
            data-testid="command-bar-input"
          />
          <kbd className="font-mono-ax text-[10px] text-white/40 border border-white/15 px-1.5 py-0.5">ESC</kbd>
        </div>
        <ul className="py-2 max-h-[320px] overflow-y-auto" role="listbox">
          {items.length === 0 && <li className="px-4 py-3 text-[13px] text-white/40">No matches.</li>}
          {items.map((item, i) => (
            <li key={`${item.type}-${item.label}`} role="option" aria-selected={i === sel}>
              <button
                onClick={() => runItem(item)}
                onMouseEnter={() => setSel(i)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left ${i === sel ? "bg-[#ff4d0a] text-black" : "text-white/80"}`}
                data-testid={`command-item-${i}`}
              >
                <span className="text-[13px] font-semibold truncate">{item.label}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-medium uppercase ${i === sel ? "text-black/60" : "text-white/35"}`}>{item.type}</span>
                  {i === sel && <CornerDownLeft size={12} aria-hidden="true" />}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
