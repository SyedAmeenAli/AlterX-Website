import React, { useState } from "react";
import { BookOpen, Trash2 } from "lucide-react";

const DEFAULTS = [
  { id: "k1", name: "Supplier evaluation criteria", scope: "Missions in this workspace", kind: "Policy document" },
  { id: "k2", name: "Inventory attention thresholds", scope: "Cognitive AI scenarios", kind: "Configuration" },
  { id: "k3", name: "Approved communication templates", scope: "Communication steps", kind: "Template set" },
];

const read = () => { try { return JSON.parse(localStorage.getItem("ax_knowledge")) || DEFAULTS; } catch { return DEFAULTS; } };

export default function Knowledge() {
  const [items, setItems] = useState(read);
  const [name, setName] = useState("");
  const persist = (next) => { setItems(next); localStorage.setItem("ax_knowledge", JSON.stringify(next)); };
  const add = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    persist([{ id: `k${Date.now()}`, name: name.trim(), scope: "Missions in this workspace", kind: "Workspace note" }, ...items]);
    setName("");
  };
  return (
    <div className="p-6 md:p-10 max-w-[900px]" data-testid="knowledge-page">
      <h1 className="ax-display text-3xl mb-2">Knowledge</h1>
      <p className="text-white/50 text-[14px] mb-8 max-w-2xl">What the Engine is allowed to know in this workspace. Missions draw on these sources — and only these — within their scope.</p>
      <form onSubmit={add} className="flex flex-col sm:flex-row gap-2 mb-8 max-w-xl">
        <label htmlFor="knowledge-add" className="sr-only">Add a knowledge source</label>
        <input id="knowledge-add" value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a knowledge source (demo, stored locally)..." className="flex-1 bg-black border border-white/20 px-4 py-2.5 text-[13px] text-white placeholder:text-white/35 focus:border-[#ff5a1f] focus:outline-none" data-testid="knowledge-add-input" />
        <button type="submit" className="btn-primary !py-2.5 !text-[13px] justify-center" data-testid="knowledge-add-btn">Add source</button>
      </form>
      <div className="border border-white/12 divide-y divide-white/10">
        {items.map((k) => (
          <div key={k.id} className="flex items-center gap-4 px-5 py-4" data-testid={`knowledge-row-${k.id}`}>
            <BookOpen size={15} className="text-[#ff5a1f] shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-white/90 truncate">{k.name}</p>
              <p className="text-[11.5px] text-white/45">{k.kind} · Scope: {k.scope}</p>
            </div>
            <button onClick={() => persist(items.filter((i) => i.id !== k.id))} className="text-white/40 hover:text-[#ff8a63] transition-colors" aria-label={`Remove ${k.name}`} data-testid={`knowledge-remove-${k.id}`}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="px-5 py-6 text-[13px] text-white/45" data-testid="knowledge-empty">No knowledge sources. Missions will ask for clarification more often.</p>}
      </div>
    </div>
  );
}
