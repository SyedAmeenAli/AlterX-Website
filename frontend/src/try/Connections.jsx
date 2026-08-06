import React, { useState } from "react";
import { Plug, Check } from "lucide-react";
import { INTEGRATION_CATEGORIES } from "@/content/pages";

const read = () => { try { return JSON.parse(localStorage.getItem("ax_connections")) || ["documents", "data", "communication"]; } catch { return []; } };

export default function Connections() {
  const [connected, setConnected] = useState(read);
  const toggle = (key) => {
    const next = connected.includes(key) ? connected.filter((k) => k !== key) : [...connected, key];
    setConnected(next);
    localStorage.setItem("ax_connections", JSON.stringify(next));
  };
  return (
    <div className="p-6 md:p-10 max-w-[1100px]" data-testid="connections-page">
      <h1 className="ax-display text-3xl mb-2">Connections</h1>
      <p className="text-white/50 text-[14px] mb-8 max-w-2xl">Generic connection types for the demonstration — each with explicit scope, permissions, actions, approval requirements and evidence behaviour. Specific systems are shown only once confirmed.</p>
      <div className="grid md:grid-cols-2 gap-3">
        {INTEGRATION_CATEGORIES.map((c) => {
          const on = connected.includes(c.key);
          return (
            <div key={c.key} className={`border p-5 ${on ? "border-[#ff5a1f]/50" : "border-white/12"}`} data-testid={`connection-card-${c.key}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-[15px] flex items-center gap-2"><Plug size={14} className={on ? "text-[#ff5a1f]" : "text-white/40"} aria-hidden="true" />{c.label}</p>
                <button onClick={() => toggle(c.key)} className={`text-[11px] font-bold px-3 py-1.5 ${on ? "border border-[#ff5a1f]/60 text-[#ff5a1f]" : "bg-[#ff5a1f] text-black"}`} data-testid={`connection-toggle-${c.key}`}>
                  {on ? "Disconnect" : "Connect"}
                </button>
              </div>
              <p className="text-[12.5px] text-white/55 mb-4">{c.desc}</p>
              <dl className="space-y-1.5 text-[12px]">
                {[["Scope", c.permissions], ["Permissions", c.triggers], ["Available actions", c.actions], ["Approval", c.approval], ["Evidence", c.evidence]].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] gap-2 border-t border-white/10 pt-1.5">
                    <dt className="font-mono-ax text-[9px] uppercase tracking-wider text-white/40 pt-0.5">{k}</dt>
                    <dd className="text-white/70">{v}</dd>
                  </div>
                ))}
              </dl>
              {on && <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#ff5a1f]" data-testid={`connection-status-${c.key}`}><Check size={11} aria-hidden="true" /> Connected in this demonstration</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
