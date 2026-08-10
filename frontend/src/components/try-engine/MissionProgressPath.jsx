import { PATH_STAGES, deriveStage } from "./missionStage";

/*
  MissionProgressPath — the useful idea absorbed from a race-track SVG
  reference (a path + a moving marker), completely re-skinned: no lap/sector/
  race styling. Five stages, one orange marker. Position comes ONLY from the
  real mission state via deriveStage() — never an independent loop. Holds
  still at "Approve" while a decision is pending, exactly like the dock.
*/

const NODE_X = [20, 130, 240, 350, 460];
const Y = 20;

export default function MissionProgressPath({ missionState }) {
  const { pathIndex, stopped } = deriveStage(missionState);
  const completedX = NODE_X[pathIndex];
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div data-testid="mission-progress-path">
      <svg viewBox="0 0 480 40" className="w-full" style={{ maxWidth: 480, height: 40 }} role="img" aria-label={`Mission progress: ${PATH_STAGES[pathIndex]}${stopped ? ", waiting for approval" : ""}`}>
        <path d={`M ${NODE_X[0]} ${Y} L ${NODE_X[4]} ${Y}`} stroke="rgba(255,255,255,.15)" strokeWidth="2" fill="none" />
        <path
          d={`M ${NODE_X[0]} ${Y} L ${completedX} ${Y}`}
          stroke="#ff4d0a"
          strokeWidth="2"
          fill="none"
          style={{ transition: "d 500ms cubic-bezier(.25,1,.5,1)" }}
        />
        {NODE_X.map((x, i) => {
          const done = i < pathIndex;
          const current = i === pathIndex;
          return (
            <g key={PATH_STAGES[i]}>
              <circle
                cx={x} cy={Y} r={current ? 6 : 4.5}
                fill={done ? "#ff4d0a" : current ? "#090909" : "rgba(255,255,255,.12)"}
                stroke={current ? "#ff4d0a" : "none"}
                strokeWidth="2"
                style={{ transition: "r 300ms cubic-bezier(.25,1,.5,1), fill 300ms ease" }}
              />
              <text x={x} y={Y + 18} textAnchor="middle" fontSize="9.5" fontWeight="600" fill={current ? "#ff8b45" : done ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.35)"} fontFamily="Hanken Grotesk, sans-serif">
                {PATH_STAGES[i]}
              </text>
            </g>
          );
        })}
        {stopped && (
          <circle cx={completedX} cy={Y} r="9" fill="none" stroke="#ff4d0a" strokeWidth="1.4" opacity="0.5">
            {!reduced && <animate attributeName="r" values="6;10;6" dur="1.6s" repeatCount="indefinite" />}
            {!reduced && <animate attributeName="opacity" values="0.5;0;0.5" dur="1.6s" repeatCount="indefinite" />}
          </circle>
        )}
      </svg>
    </div>
  );
}
