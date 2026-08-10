import { SCENARIOS, matchScenario } from "@/data/demoMissions";

const read = (k, fb) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const listMissions = () => read("ax_missions", []);
export const getMission = (id) => listMissions().find((m) => m.id === id);

export function saveMission(mission) {
  const all = listMissions();
  const i = all.findIndex((m) => m.id === mission.id);
  if (i >= 0) all[i] = mission; else all.unshift(mission);
  write("ax_missions", all);
  return mission;
}

export function createMission(objective) {
  const scenario = matchScenario(objective);
  const n = read("ax_mission_counter", 0) + 1;
  write("ax_mission_counter", n);
  const mission = {
    id: `AX-M-${String(n).padStart(3, "0")}`,
    objective: objective || scenario.objective,
    scenarioKey: scenario.key,
    state: "clarify",
    clarifyAnswer: null,
    decisions: [],
    recovery: null,
    stepIndex: -1,
    completedSteps: [],
    history: [{ ts: Date.now(), type: "created", label: "Mission created", detail: objective || scenario.objective }],
    createdAt: Date.now(),
  };
  return saveMission(mission);
}

export function logEvent(mission, type, label, detail = "") {
  mission.history.push({ ts: Date.now(), type, label, detail });
  return saveMission({ ...mission });
}

export const listWorkflows = () => read("ax_workflows", []);
export function saveWorkflow(wf) {
  const all = listWorkflows();
  const i = all.findIndex((w) => w.id === wf.id);
  if (i >= 0) all[i] = wf; else all.unshift(wf);
  write("ax_workflows", all);
}
export function deleteWorkflow(id) {
  write("ax_workflows", listWorkflows().filter((w) => w.id !== id));
}

export const getScenario = (key) => SCENARIOS.find((s) => s.key === key) || SCENARIOS[0];

export const tourDone = () => read("ax_tour_done", false);
export const setTourDone = () => write("ax_tour_done", true);

function evidencePayload(mission) {
  const scenario = getScenario(mission.scenarioKey);
  return {
    label: "Illustrative frontend demonstration — no real external action occurred",
    mission: { id: mission.id, objective: mission.objective, state: mission.state, createdAt: new Date(mission.createdAt).toISOString() },
    plan: scenario.steps.map((s) => ({ id: s.id, label: s.label, system: s.system, approval: !!s.approval })),
    decisions: mission.decisions,
    recovery: mission.recovery,
    timeline: mission.history.map((h) => ({ at: new Date(h.ts).toISOString(), type: h.type, label: h.label, detail: h.detail })),
  };
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportEvidence(mission) {
  downloadJson(evidencePayload(mission), `${mission.id}-evidence.json`);
}

// Bulk export — every mission's evidence trail in this workspace, one file.
export function exportAllEvidence(missions) {
  downloadJson(
    { label: "Illustrative frontend demonstration — no real external action occurred", exportedAt: new Date().toISOString(), missions: missions.map(evidencePayload) },
    `evidence-export-${new Date().toISOString().slice(0, 10)}.json`
  );
}
