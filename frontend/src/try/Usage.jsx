import React from "react";
import { listMissions, listWorkflows } from "@/lib/store";

export default function Usage() {
  const missions = listMissions();
  const wfs = listWorkflows();
  const decisions = missions.reduce((n, m) => n + m.decisions.length, 0);
  const events = missions.reduce((n, m) => n + m.history.length, 0);
  const steps = missions.reduce((n, m) => n + m.completedSteps.length, 0);
  const byState = missions.reduce((acc, m) => ({ ...acc, [m.state]: (acc[m.state] || 0) + 1 }), {});
  const max = Math.max(1, ...Object.values(byState));

  const stats = [
    ["Missions", missions.length], ["Steps completed", steps], ["Human decisions", decisions], ["Evidence events", events], ["Saved workflows", wfs.length],
  ];
  return (
    <div className="p-6 md:p-10 max-w-[900px]" data-testid="usage-page">
      <h1 className="ax-display text-3xl mb-2">Usage</h1>
      <p className="text-white/50 text-[14px] mb-8">Activity in this local demonstration workspace. Nothing leaves the browser.</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/12 border border-white/12 mb-10">
        {stats.map(([k, v]) => (
          <div key={k} className="bg-[#090909] p-5" data-testid={`usage-stat-${k.toLowerCase().replace(/\s/g, "-")}`}>
            <p className="ax-display text-3xl text-[#ff4d0a]">{v}</p>
            <p className="text-[12px] text-white/55 mt-1">{k}</p>
          </div>
        ))}
      </div>
      <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45 mb-4">Missions by state</h2>
      {missions.length === 0 ? (
        <p className="text-white/40 text-[13px]" data-testid="usage-empty">No activity yet.</p>
      ) : (
        <div className="space-y-2.5 max-w-lg">
          {Object.entries(byState).map(([state, count]) => (
            <div key={state} className="flex items-center gap-4" data-testid={`usage-state-${state}`}>
              <span className="text-[11px] font-medium uppercase text-white/55 w-[90px]">{state}</span>
              <div className="flex-1 h-3 bg-white/8">
                <div className="h-full" style={{ width: `${(count / max) * 100}%`, background: "var(--ax-grad-orange)" }} />
              </div>
              <span className="text-[13px] text-white/70 w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
