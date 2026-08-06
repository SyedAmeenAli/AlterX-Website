import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { listMissions, getScenario } from "@/lib/store";

const STATE_LABEL = { clarify: "Understand", plan: "Plan", approval: "Approve", run: "Act", failure: "Recovery", verify: "Check", complete: "Complete", stopped: "Stopped" };
const STATE_COLOR = { complete: "text-white/50 border-white/20", stopped: "text-white/40 border-white/15" };

export default function Missions() {
  const missions = listMissions();
  return (
    <div className="p-6 md:p-10 max-w-[1100px]" data-testid="missions-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="ax-display text-3xl">Missions</h1>
          <p className="text-white/50 text-[14px] mt-1.5">Every mission is an illustrative frontend demonstration stored locally.</p>
        </div>
        <Link to="/try-alter-engine/new" className="btn-primary !py-2.5 !text-[13px]" data-testid="missions-new-btn">
          <Plus size={14} aria-hidden="true" /> New mission
        </Link>
      </div>
      {missions.length === 0 ? (
        <div className="border border-white/12 p-12 text-center" data-testid="missions-empty">
          <p className="text-white/55">No missions yet. Create one from an outcome.</p>
        </div>
      ) : (
        <div className="border border-white/12 divide-y divide-white/10">
          {missions.map((m) => {
            const sc = getScenario(m.scenarioKey);
            return (
              <Link key={m.id} to={`/try-alter-engine/missions/${m.id}`} className="ax-fill grid md:grid-cols-[110px_1fr_150px_130px] gap-3 items-center px-5 py-4 text-white/85" data-testid={`mission-row-${m.id}`}>
                <span className="font-mono-ax text-[11px] text-white/50">{m.id}</span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold truncate">{m.objective}</span>
                  <span className="block text-[11px] text-white/40 mt-0.5">Scenario: {sc.title} · {new Date(m.createdAt).toLocaleString()}</span>
                </span>
                <span className="text-[11px] text-white/45 hidden md:block">{m.history.length} events</span>
                <span className={`font-mono-ax text-[10px] uppercase tracking-wider border px-2 py-1 text-center ${STATE_COLOR[m.state] || "text-[#ff5a1f] border-[#ff5a1f]/40"}`}>
                  {STATE_LABEL[m.state] || m.state}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
