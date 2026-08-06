import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function TrySettings() {
  const [name, setName] = useState(localStorage.getItem("ax_workspace_name") || "Demo workspace");
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
      <h1 className="ax-display text-3xl mb-2">Settings</h1>
      <p className="text-white/50 text-[14px] mb-8">Demonstration workspace configuration. Everything is stored locally in this browser.</p>

      <form onSubmit={save} className="border border-white/12 p-6 mb-6">
        <label htmlFor="ws-name" className="block text-[13px] font-bold mb-2">Workspace name</label>
        <div className="flex gap-2 max-w-md">
          <input id="ws-name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-black border border-white/20 px-4 py-2.5 text-[14px] text-white focus:border-[#ff5a1f] focus:outline-none" data-testid="settings-workspace-input" />
          <button type="submit" className="btn-primary !py-2.5 !text-[13px]" data-testid="settings-workspace-save">Save</button>
        </div>
        {saved && <p className="text-[12px] text-[#ff5a1f] mt-2" role="status" data-testid="settings-saved-note">Saved. The top bar updates on the next navigation.</p>}
      </form>

      <div className="border border-white/12 p-6 mb-6">
        <p className="text-[13px] font-bold mb-3">Feature configuration</p>
        <dl className="space-y-2 text-[13px]">
          {[
            ["Voice workflows", process.env.REACT_APP_VOICE_WORKFLOWS_ENABLED === "true" ? "Enabled" : "Disabled (default)"],
            ["Contact endpoint", process.env.REACT_APP_CONTACT_ENDPOINT ? "Configured" : "Not configured — email fallback in use"],
            ["Execution backend", "None — deterministic frontend demonstration"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[160px_1fr] gap-3 border-t border-white/10 pt-2">
              <dt className="text-white/45">{k}</dt><dd className="text-white/80 font-mono-ax text-[12px]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border border-[#bd3510]/60 p-6">
        <p className="text-[13px] font-bold mb-2">Reset demonstration data</p>
        <p className="text-[13px] text-white/55 mb-4">Removes all local missions, workflows, connections, knowledge and tour state from this browser.</p>
        {cleared ? (
          <p className="text-[13px] text-[#ff5a1f]" role="status" data-testid="settings-reset-done">Demo data cleared. Start a new mission to begin again.</p>
        ) : (
          <button onClick={reset} className="border border-[#bd3510] text-[#ff8a63] text-[13px] font-bold px-4 py-2 flex items-center gap-2 hover:bg-[#bd3510]/15 transition-colors" data-testid="settings-reset-btn">
            <Trash2 size={13} aria-hidden="true" /> Reset demo data
          </button>
        )}
      </div>
    </div>
  );
}
