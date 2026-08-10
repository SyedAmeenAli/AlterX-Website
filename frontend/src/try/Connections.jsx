import React, { useState } from "react";
import { Plug, Check } from "lucide-react";
import { INTEGRATION_CATEGORIES } from "@/content/pages";
import { listWorkflows } from "@/lib/store";
import { InspectorPanel, InspectorEmpty } from "@/try/InspectorPanel";

const read = () => { try { return JSON.parse(localStorage.getItem("ax_connections")) || ["documents", "data", "communication"]; } catch { return []; } };

// real overlap check — a workflow "uses" a connection when one of its
// recorded inputs mentions the connection's label. Not a fabricated count.
const usedByWorkflows = (category, workflows) =>
  workflows.filter((w) => (w.inputs || []).some((i) => i.toLowerCase().includes(category.key) || i.toLowerCase().includes(category.label.toLowerCase())));

export default function Connections() {
  const [connected, setConnected] = useState(read);
  const [selectedKey, setSelectedKey] = useState(INTEGRATION_CATEGORIES[0].key);
  const workflows = listWorkflows();

  const toggle = (key) => {
    const next = connected.includes(key) ? connected.filter((k) => k !== key) : [...connected, key];
    setConnected(next);
    localStorage.setItem("ax_connections", JSON.stringify(next));
  };

  const selected = INTEGRATION_CATEGORIES.find((c) => c.key === selectedKey);
  const selUsage = selected ? usedByWorkflows(selected, workflows) : [];
  const selOn = selected && connected.includes(selected.key);
  const selActions = selected ? selected.actions.split(",").map((a) => a.trim()) : [];

  return (
    <div className="p-6 md:p-10" data-testid="connections-page">
      <h1 className="ax-display text-3xl mb-2">Define what Alter Engine is allowed to reach.</h1>
      <p className="text-white/50 text-[14px] mb-8 max-w-2xl">Generic connection types for this demonstration — each with explicit scope, permissions, actions, approval requirements and evidence behaviour. Specific systems are shown only once confirmed.</p>

      <div className="grid xl:grid-cols-[1fr_380px] gap-10 items-start">
        <div className="min-w-0 border border-white/12 rounded-[6px] divide-y divide-white/10">
          {INTEGRATION_CATEGORIES.map((c) => {
            const on = connected.includes(c.key);
            const isSel = selectedKey === c.key;
            return (
              <div
                key={c.key}
                onClick={() => setSelectedKey(c.key)}
                onMouseEnter={() => setSelectedKey(c.key)}
                className={`relative grid md:grid-cols-[1fr_140px_100px] gap-3 items-center px-5 py-4 cursor-pointer transition-colors ${isSel ? "bg-white/[.025]" : ""}`}
                data-testid={`connection-row-${c.key}`}
                role="button"
                tabIndex={0}
              >
                <span className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#ff4d0a] transition-opacity duration-200 ${isSel ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-[14px] font-bold text-white/90"><Plug size={13} className={on ? "text-[#ff4d0a]" : "text-white/35"} aria-hidden="true" />{c.label}</span>
                  <span className="block text-[12px] text-white/45 mt-0.5 truncate">{c.desc}</span>
                </span>
                <span className={`text-[11.5px] font-medium ${on ? "text-[#ff4d0a]" : "text-white/35"}`}>{on ? "Configured" : "Requires setup"}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(c.key); }}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-[4px] justify-self-end ${on ? "border border-[#ff4d0a]/60 text-[#ff4d0a]" : "bg-[#ff4d0a] text-black"}`}
                  data-testid={`connection-toggle-${c.key}`}
                >
                  {on ? "Disconnect" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>

        {selected ? (
          <InspectorPanel testId="connection-inspector" key={selected.key}>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40 mb-1.5">Selected connection</p>
            <p className="text-[16px] font-bold text-white/90 mb-1 flex items-center gap-2">{selected.label}{selOn && <Check size={13} className="text-[#ff4d0a]" aria-hidden="true" />}</p>
            <p className="text-[12.5px] text-white/50 mb-5">{selOn ? "Connected in this demonstration" : "Requires setup"}</p>

            <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40 mb-2">Permissions</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {selActions.map((a) => (
                <span key={a} className="text-[11px] font-medium text-[#ff8b45] border border-[#ff4d0a]/35 rounded-[4px] px-2 py-1">{a}</span>
              ))}
            </div>

            {[
              ["Scope", selected.permissions],
              ["Approval requirement", selected.approval],
              ["Evidence", selected.evidence],
              ["Used by workflows", selUsage.length ? selUsage.map((w) => w.name).join(", ") : "No saved workflow currently references this connection"],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-white/[.07] py-2.5">
                <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40">{k}</p>
                <p className="text-[13px] text-white/80 mt-1 leading-relaxed">{v}</p>
              </div>
            ))}
          </InspectorPanel>
        ) : (
          <InspectorEmpty testId="connection-inspector-empty">No connection selected. Select a connection to inspect its scope.</InspectorEmpty>
        )}
      </div>
    </div>
  );
}
