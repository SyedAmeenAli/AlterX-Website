/*
  One source of truth for "where is this mission." Both EngineDock and
  MissionProgressPath derive from this — never maintain their own stage
  state. Driven entirely by the real mission.state from MissionDetail's
  actual state machine (clarify/plan/approval/run/failure/verify/complete/
  stopped) — no independent timers, no fake progress.
*/

// 7-stop dock — Objective/Plan/Approval/Work/Check/Evidence/Result.
export const DOCK_STAGES = ["Objective", "Plan", "Approval", "Work", "Check", "Evidence", "Result"];

// 5-stage progress path — Understand/Plan/Approve/Act/Check.
export const PATH_STAGES = ["Understand", "Plan", "Approve", "Act", "Check"];

const STATE_TO_DOCK = {
  clarify: 0,
  plan: 1,
  approval: 2,
  run: 3,
  failure: 3,
  stopped: 3,
  verify: 4,
  complete: 6,
};

const STATE_TO_PATH = {
  clarify: 0,
  plan: 1,
  approval: 2,
  run: 3,
  failure: 3,
  stopped: 3,
  verify: 4,
  complete: 4,
};

export function deriveStage(missionState) {
  const dockIndex = STATE_TO_DOCK[missionState] ?? 0;
  const pathIndex = STATE_TO_PATH[missionState] ?? 0;
  const stopped = missionState === "approval"; // marker holds at Approve, doesn't continue on its own
  const evidenceReady = missionState === "verify" || missionState === "complete";
  return { dockIndex, pathIndex, stopped, evidenceReady };
}
