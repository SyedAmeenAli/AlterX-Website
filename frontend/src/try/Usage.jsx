import React from "react";
import { Link } from "react-router-dom";
import { listMissions, listWorkflows, getScenario } from "@/lib/store";
import { estimateMissionUsage, DEMO_CREDIT_POOL } from "@/lib/demoCredits";
import { InspectorPanel, InspectorRow } from "@/try/InspectorPanel";

const isToday = (ts) => new Date(ts).toDateString() === new Date().toDateString();

export default function Usage() {
  const missions = listMissions();
  const wfs = listWorkflows();
  const byState = missions.reduce((acc, m) => ({ ...acc, [m.state]: (acc[m.state] || 0) + 1 }), {});
  const stateMax = Math.max(1, ...Object.values(byState), 0);

  const perMission = missions.map((m) => ({ m, usage: estimateMissionUsage(m, getScenario(m.scenarioKey)) }));
  const totals = perMission.reduce(
    (acc, { usage }) => ({ planning: acc.planning + usage.planning, action: acc.action + usage.action, checking: acc.checking + usage.checking, total: acc.total + usage.total }),
    { planning: 0, action: 0, checking: 0, total: 0 }
  );
  const evidenceEvents = missions.reduce((n, m) => n + m.history.length, 0);
  const catMax = Math.max(1, totals.planning, totals.action, totals.checking, evidenceEvents);

  const current = perMission[0] || null;
  const today = perMission.filter(({ m }) => isToday(m.createdAt)).reduce((n, { usage }) => n + usage.total, 0);
  const available = Math.max(0, DEMO_CREDIT_POOL - totals.total);

  const CATEGORIES = [
    ["Planning", totals.planning],
    ["Work", totals.action],
    ["Checks", totals.checking],
    ["Evidence", evidenceEvents],
  ];

  return (
    <div className="p-6 md:p-10" data-testid="usage-page">
      <h1 className="ax-display text-3xl mb-2">Where demo credits are being spent.</h1>
      <p className="text-white/50 text-[14px] mb-8 max-w-2xl">Activity in this local demonstration workspace. Nothing leaves the browser — figures are an illustrative estimate, not a billing statement.</p>

      <div className="grid xl:grid-cols-[1fr_360px] gap-10 items-start">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40 mb-3">Missions by stage</p>
          {missions.length === 0 ? (
            <p className="text-white/40 text-[13px] mb-10" data-testid="usage-empty">No activity yet.</p>
          ) : (
            <div className="space-y-2.5 mb-10 max-w-lg">
              {Object.entries(byState).map(([state, count]) => (
                <div key={state} className="flex items-center gap-4" data-testid={`usage-state-${state}`}>
                  <span className="text-[11px] font-medium uppercase text-white/55 w-[90px] shrink-0">{state}</span>
                  <div className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff4d0a]" style={{ width: `${(count / stateMax) * 100}%` }} />
                  </div>
                  <span className="text-[13px] text-white/70 w-6 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40 mb-3">Usage by mission</p>
          {perMission.length === 0 ? (
            <p className="text-white/40 text-[13px]">No missions yet.</p>
          ) : (
            <div className="border border-white/12 rounded-[6px] divide-y divide-white/10">
              {perMission.map(({ m, usage }) => (
                <Link key={m.id} to={`/try-alter-engine/missions/${m.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[.02] transition-colors" data-testid={`usage-mission-${m.id}`}>
                  <span className="font-mono-ax text-[11px] text-white/45 shrink-0">{m.id}</span>
                  <span className="flex-1 min-w-0 text-[13.5px] text-white/85 truncate">{m.objective}</span>
                  <span className="text-[12px] text-[#ff8b45] font-semibold shrink-0">~{usage.total} credits</span>
                </Link>
              ))}
            </div>
          )}

          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40 mt-10 mb-1">Saved workflows</p>
          <p className="text-[13px] text-white/60">{wfs.length} workflow{wfs.length === 1 ? "" : "s"} configured in this demo workspace.</p>
        </div>

        <InspectorPanel testId="usage-inspector">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40 mb-4">Demo usage</p>

          <div className="mb-1">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40">Available</p>
            <p className="text-[20px] font-bold text-white/90 mt-1">{available.toLocaleString("en-IN")} <span className="text-[13px] text-white/40 font-medium">/ {DEMO_CREDIT_POOL.toLocaleString("en-IN")}</span></p>
          </div>
          <InspectorRow label="Current mission" value={current ? `${current.usage.total} credits · ${current.m.id}` : "No missions yet"} />
          <InspectorRow label="Today" value={`${today} credits`} />

          <div className="border-t border-white/[.07] pt-4 mt-2.5">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40 mb-3">By category</p>
            <div className="space-y-2.5">
              {CATEGORIES.map(([label, v]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-[11.5px] text-white/60 w-[62px] shrink-0">{label}</span>
                  <div className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff4d0a]" style={{ width: `${(v / catMax) * 100}%` }} />
                  </div>
                  <span className="text-[11.5px] text-white/70 w-6 text-right shrink-0">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10.5px] text-white/30 mt-4">Demo estimate — no billing attached</p>
        </InspectorPanel>
      </div>
    </div>
  );
}
