import React, { useState } from "react";
import { BookOpen, Trash2, Layers } from "lucide-react";
import { InspectorPanel, InspectorEmpty } from "@/try/InspectorPanel";

const DEFAULTS = [
  { id: "k1", name: "Supplier evaluation criteria", scope: "Missions in this workspace", kind: "Policy document", updated: "2026-07-28" },
  { id: "k2", name: "Inventory attention thresholds", scope: "Cognitive AI scenarios", kind: "Configuration", updated: "2026-08-01" },
  { id: "k3", name: "Approved communication templates", scope: "Communication steps", kind: "Template set", updated: "2026-07-15" },
];

const read = () => { try { return JSON.parse(localStorage.getItem("ax_knowledge")) || DEFAULTS; } catch { return DEFAULTS; } };

export default function Knowledge() {
  const [items, setItems] = useState(read);
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState(DEFAULTS[0]?.id || null);
  const persist = (next) => { setItems(next); localStorage.setItem("ax_knowledge", JSON.stringify(next)); };
  const add = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const item = { id: `k${Date.now()}`, name: name.trim(), scope: "Missions in this workspace", kind: "Workspace note", updated: new Date().toISOString().slice(0, 10) };
    persist([item, ...items]);
    setSelectedId(item.id);
    setName("");
  };
  const remove = (id) => {
    persist(items.filter((i) => i.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const selected = items.find((k) => k.id === selectedId) || null;

  return (
    <div className="p-6 md:p-10" data-testid="knowledge-page">
      <h1 className="ax-display text-3xl mb-2">Context available to the work.</h1>
      <p className="text-white/50 text-[14px] mb-6 max-w-2xl">What the Engine is allowed to know in this workspace. Missions draw on these sources — and only these — within their scope. Demo sources shown here are illustrative, stored locally in your browser.</p>

      <form onSubmit={add} className="flex flex-col sm:flex-row gap-2 mb-8 max-w-xl">
        <label htmlFor="knowledge-add" className="sr-only">Add a knowledge source</label>
        <input id="knowledge-add" value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a knowledge source (demo, stored locally)..." className="flex-1 bg-black border border-white/20 rounded-[5px] px-4 py-2.5 text-[13px] text-white placeholder:text-white/35 focus:border-[#ff4d0a] focus:outline-none" data-testid="knowledge-add-input" />
        <button type="submit" className="btn-primary !py-2.5 !text-[13px] justify-center" data-testid="knowledge-add-btn">Add source</button>
      </form>

      <div className="grid xl:grid-cols-[1fr_360px] gap-10 items-start">
        <div className="min-w-0 border border-white/12 rounded-[6px] divide-y divide-white/10">
          {items.map((k) => {
            const isSel = selectedId === k.id;
            return (
              <div
                key={k.id}
                onClick={() => setSelectedId(k.id)}
                onMouseEnter={() => setSelectedId(k.id)}
                className={`relative flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors ${isSel ? "bg-white/[.025]" : ""}`}
                data-testid={`knowledge-row-${k.id}`}
                role="button"
                tabIndex={0}
              >
                <span className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#ff4d0a] transition-opacity duration-200 ${isSel ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                <BookOpen size={15} className="text-[#ff4d0a] shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-white/90 truncate">{k.name}</p>
                  <p className="text-[11.5px] text-white/45">{k.kind} · Scope: {k.scope}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); remove(k.id); }} className="text-white/40 hover:text-[#ff8a63] transition-colors shrink-0" aria-label={`Remove ${k.name}`} data-testid={`knowledge-remove-${k.id}`}>
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          {items.length === 0 && <p className="px-5 py-6 text-[13px] text-white/45" data-testid="knowledge-empty">No knowledge sources. Missions will ask for clarification more often.</p>}
        </div>

        {selected ? (
          <InspectorPanel testId="knowledge-inspector" key={selected.id}>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40 mb-1.5 flex items-center gap-1.5"><Layers size={12} className="text-[#ff4d0a]" aria-hidden="true" />Selected source</p>
            <p className="text-[16px] font-bold text-white/90 mb-5">{selected.name}</p>
            {[
              ["Source", selected.kind],
              ["Updated", selected.updated],
              ["Used by", selected.scope],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-white/[.07] py-2.5">
                <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40">{k}</p>
                <p className="text-[13px] text-white/80 mt-1">{v}</p>
              </div>
            ))}
          </InspectorPanel>
        ) : (
          <InspectorEmpty testId="knowledge-inspector-empty">No source selected. Select a source to inspect it.</InspectorEmpty>
        )}
      </div>
    </div>
  );
}
