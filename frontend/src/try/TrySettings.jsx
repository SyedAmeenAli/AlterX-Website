import React, { useState } from "react";
import { Trash2, Check, Layers, Sliders, Database } from "lucide-react";

const Section = ({ icon: Icon, title, children, testId, danger }) => (
  <div
    className={`rounded-[8px] p-6 mb-5 border ${danger ? "border-[#c9360a]/45" : "border-white/[.07]"}`}
    style={danger ? undefined : { background: "linear-gradient(145deg, rgba(255,255,255,.025), rgba(255,255,255,.006)), #0B0B0B" }}
    data-testid={testId}
  >
    <p className={`text-[11px] font-medium uppercase tracking-[0.16em] mb-4 flex items-center gap-2 ${danger ? "text-[#ff8a63]" : "text-white/40"}`}>
      <Icon size={13} aria-hidden="true" />{title}
    </p>
    {children}
  </div>
);

export default function TrySettings() {
  const [name, setName] = useState(localStorage.getItem("ax_workspace_name") || "My workspace");
  const [saved, setSaved] = useState(false);
  const [cleared, setCleared] = useState(false);

  const save = (e) => {
    e.preventDefault();
    localStorage.setItem("ax_workspace_name", name);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };
  const reset = () => {
    ["ax_missions", "ax_workflows", "ax_mission_counter", "ax_tour_done", "ax_connections", "ax_knowledge"].forEach((k) => localStorage.removeItem(k));
    setCleared(true);
  };

  return (
    <div className="p-6 md:p-10 max-w-[760px]" data-testid="settings-page">
      <h1 className="ax-display text-3xl mb-2">Workspace and preferences.</h1>
      <p className="text-white/50 text-[14px] mb-8">Everything below is stored locally in this browser — nothing leaves your device.</p>

      <Section icon={Layers} title="Workspace" testId="settings-workspace-section">
        <label htmlFor="ws-name" className="block text-[12.5px] text-white/55 mb-2">Workspace name</label>
        <form onSubmit={save} className="flex gap-2 max-w-md">
          <input id="ws-name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-black border border-white/20 rounded-[5px] px-4 py-2.5 text-[13.5px] text-white focus:border-[#ff4d0a] focus:outline-none" data-testid="settings-workspace-input" />
          <button type="submit" className="bg-[#ff4d0a] text-black text-[13px] font-semibold rounded-[5px] px-4 py-2.5 flex items-center gap-1.5 shrink-0" data-testid="settings-workspace-save">
            {saved ? <><Check size={13} aria-hidden="true" />Saved</> : "Save"}
          </button>
        </form>
        {saved && <p className="text-[11.5px] text-white/40 mt-2" role="status" data-testid="settings-saved-note">The top bar updates on the next navigation.</p>}
      </Section>

      <Section icon={Sliders} title="Feature configuration" testId="settings-features-section">
        <div className="divide-y divide-white/[.06]">
          {[
            ["Voice workflows", process.env.REACT_APP_VOICE_WORKFLOWS_ENABLED === "true" ? "Enabled" : "Disabled (default)"],
            ["Contact endpoint", process.env.REACT_APP_CONTACT_ENDPOINT ? "Configured" : "Not configured — email fallback in use"],
            ["Execution backend", "None — deterministic frontend demonstration"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <span className="text-[12.5px] text-white/50">{k}</span>
              <span className="text-[12.5px] text-white/80 text-right">{v}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Trash2} title="Reset demo data" testId="settings-reset-section" danger>
        <p className="text-[13px] text-white/60 mb-4 leading-relaxed">Removes all local missions, workflows, connections, knowledge and tour state from this browser. Cannot be undone.</p>
        {cleared ? (
          <p className="text-[13px] text-[#ff4d0a] flex items-center gap-1.5" role="status" data-testid="settings-reset-done"><Check size={13} aria-hidden="true" />Cleared. Start a new mission to begin again.</p>
        ) : (
          <button onClick={reset} className="border border-[#c9360a] text-[#ff8a63] text-[13px] font-bold rounded-[5px] px-4 py-2 flex items-center gap-2 hover:bg-[#c9360a]/15 transition-colors" data-testid="settings-reset-btn">
            <Trash2 size={13} aria-hidden="true" /> Reset demo data
          </button>
        )}
      </Section>

      <p className="text-[11px] text-white/25 flex items-center gap-1.5 mt-2"><Database size={11} aria-hidden="true" />All data lives in this browser's local storage only.</p>
    </div>
  );
}
