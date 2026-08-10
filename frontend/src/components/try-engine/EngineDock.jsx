import { Target, ListTree, ShieldCheck, Cog, CheckCircle2, FileCheck, Flag } from "lucide-react";
import { DOCK_STAGES, deriveStage } from "./missionStage";
import "./engine-dock.css";

/*
  EngineDock — mechanics absorbed from an Apple-style dock reference (row of
  icons, current item emphasized, subtle magnify on hover). Re-skinned:
  black/warm-white/orange, thin border, no glass/glow. Represents mission
  position, not site navigation. Driven entirely by deriveStage(missionState)
  — no independent state of its own.
*/

const ICONS = [Target, ListTree, ShieldCheck, Cog, CheckCircle2, FileCheck, Flag];

export default function EngineDock({ missionState }) {
  const { dockIndex, evidenceReady } = deriveStage(missionState);
  return (
    <nav className="axd-dock" aria-label="Mission position" data-testid="engine-dock">
      {DOCK_STAGES.map((label, i) => {
        const Icon = ICONS[i];
        const done = i < dockIndex || (label === "Evidence" && evidenceReady && i <= dockIndex + 2);
        const active = i === dockIndex;
        return (
          <div key={label} className={`axd-item ${active ? "is-active" : ""} ${done ? "is-done" : ""}`} data-testid={`dock-stage-${label.toLowerCase()}`}>
            <Icon size={15} aria-hidden="true" />
            <span className="axd-label">{label}</span>
          </div>
        );
      })}
    </nav>
  );
}
