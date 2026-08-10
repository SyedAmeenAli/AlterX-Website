import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { listMissions, getScenario } from "@/lib/store";
import { estimateMissionUsage } from "@/lib/demoCredits";
import MissionProgressPath from "@/components/try-engine/MissionProgressPath";
import { InspectorPanel, InspectorRow } from "@/try/InspectorPanel";

const STATE_LABEL = { clarify: "Understand", plan: "Plan", approval: "Approve", run: "Act", failure: "Recovery", verify: "Check", complete: "Complete", stopped: "Stopped" };
const STATE_COLOR = { complete: "text-white/50", stopped: "text-white/40" };

const GROUPS = [
  { key: "active", title: "Active", match: (s) => s === "run" },
  { key: "waiting", title: "Waiting", match: (s) => s === "approval" },
  { key: "review", title: "Needs review", match: (s) => s === "failure" || s === "verify" },
  { key: "other", title: "Understand & plan", match: (s) => s === "clarify" || s === "plan" },
  { key: "done", title: "Completed", match: (s) => s === "complete" || s === "stopped" },
];

export default function Missions() {
  const navigate = useNavigate();
  const missions = listMissions();
  const [hovered, setHovered] = useState(missions[0]?.id || null);
  const selected = missions.find((m) => m.id === hovered) || null;
  const selScenario = selected ? getScenario(selected.scenarioKey) : null;
  const selUsage = selected ? estimateMissionUsage(selected, selScenario) : null;

  return (
    <div className="p-6 md:p-10" data-testid="missions-page">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <div>
          <h1 className="ax-display text-3xl mb-1.5">Work that is moving.</h1>
          <p className="text-white/50 text-[14px]">Every mission is an illustrative frontend demonstration stored locally.</p>
        </div>
        <Link to="/try-alter-engine/new" className="btn-primary !py-2.5 !text-[13px]" data-testid="missions-new-btn">
          <Plus size={14} aria-hidden="true" /> Create mission
        </Link>
      </div>

      {missions.length === 0 ? (
        <div className="border border-white/12 rounded-[8px] p-12 text-center mt-8" data-testid="missions-empty">
          <p className="text-white/55">No missions yet. Create one from an outcome.</p>
        </div>
      ) : (
        <div className="grid xl:grid-cols-[1fr_360px] gap-10 mt-8 items-start">
          <div className="min-w-0">
            {GROUPS.map((g) => {
              const rows = missions.filter((m) => g.match(m.state));
              if (rows.length === 0) return null;
              return (
                <div key={g.key} className="mb-8" data-testid={`mission-group-${g.key}`}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40 mb-2.5">{g.title}</p>
                  <div className="border border-white/12 rounded-[6px] divide-y divide-white/10">
                    {rows.map((m) => {
                      const sc = getScenario(m.scenarioKey);
                      const isSel = hovered === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => navigate(`/try-alter-engine/missions/${m.id}`)}
                          onMouseEnter={() => setHovered(m.id)}
                          onFocus={() => setHovered(m.id)}
                          className={`relative grid md:grid-cols-[110px_1fr_150px_130px] gap-3 items-center px-5 py-3.5 cursor-pointer transition-colors ${isSel ? "bg-white/[.025]" : ""}`}
                          data-testid={`mission-row-${m.id}`}
                          role="button"
                          tabIndex={0}
                        >
                          <span className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#ff4d0a] transition-all duration-200 ${isSel ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                          <span className="font-mono-ax text-[11px] text-white/50">{m.id}</span>
                          <span className={`min-w-0 transition-transform duration-200 ${isSel ? "translate-x-[3px]" : ""}`}>
                            <span className="block text-[14px] font-bold truncate text-white/90">{m.objective}</span>
                            <span className={`block text-[11px] mt-0.5 transition-opacity duration-200 ${isSel ? "opacity-70" : "opacity-48"} text-white/70`}>Scenario: {sc.title} · {new Date(m.createdAt).toLocaleString()}</span>
                          </span>
                          <span className="text-[11px] text-white/45 hidden md:block">{m.history.length} events</span>
                          <span className={`text-[11px] font-medium uppercase tracking-[0.14em] text-right ${STATE_COLOR[m.state] || "text-[#ff8a3d]"}`}>
                            {STATE_LABEL[m.state] || m.state}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {selected && (
            <InspectorPanel testId="mission-inspector" key={selected.id}>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#ff4d0a] mb-1">{selected.id}</p>
              <h2 className="text-[16px] font-bold text-white/90 mb-4 leading-snug">{selected.objective}</h2>

              <div className="mb-5">
                <MissionProgressPath missionState={selected.state} />
              </div>

              <InspectorRow label="Scenario" value={selScenario.title} />
              <InspectorRow label="Current stage" value={STATE_LABEL[selected.state] || selected.state} />
              <InspectorRow label="Boundaries" value={selScenario.clarify?.constraints?.join(" · ") || "—"} />
              <InspectorRow label="Estimated usage" value={`~${selUsage.total} demo credits`} />
              <InspectorRow label="Latest event" value={selected.history[selected.history.length - 1]?.label || "—"} />

              <Link to={`/try-alter-engine/missions/${selected.id}`} className="inline-block mt-5 text-[13px] font-semibold text-[#ff4d0a]" data-testid="mission-inspector-open">Open mission →</Link>
            </InspectorPanel>
          )}
        </div>
      )}
    </div>
  );
}
