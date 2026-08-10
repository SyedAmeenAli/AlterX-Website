import { useEffect, useMemo, useRef, useState } from "react";
import "./CognitiveCubeMatrix.css";

/*
  CognitiveCubeMatrix — a 3×3×3 field of small CSS-3D cubes (27 units),
  positioned with --x/--y/--z, built from real preserve-3d geometry. Each
  unit is a full 6-face cube (the ambient animation does a real 360° turn,
  so every side needs to exist, not just the faces visible at rest).

  Reused on the homepage Cognitive AI tile and the Cognitive AI page hero
  — same component, same "attention cube" behaviour, `size` just scales it.

  No per-frame JS: ambient motion and the hover sequence are pure CSS
  transitions/animation driven by data-active + [data-attn], pointer tilt
  is a single CSS custom-property write per pointermove (same pattern as
  AlterXGeometry).
*/

const AXES = [-1, 0, 1];
const UNITS = AXES.flatMap((x) => AXES.flatMap((y) => AXES.map((z) => ({ x, y, z }))));

// the "attention" unit + the neighbours that respond to it (front-right
// area, reads clearly within the small rotation range)
const ATTENTION = { x: 1, y: 0, z: 1 };
const isAttention = (u) => u.x === ATTENTION.x && u.y === ATTENTION.y && u.z === ATTENTION.z;
const isNeighbour = (u) => !isAttention(u) && Math.abs(u.x - ATTENTION.x) + Math.abs(u.y - ATTENTION.y) + Math.abs(u.z - ATTENTION.z) === 1;

export default function CognitiveCubeMatrix({ active = false, interactive = true, size = "home", className = "" }) {
  const stageRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 20);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const l = () => setReducedMotion(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", l) : mq.addListener(l);
    return () => {
      clearTimeout(t);
      mq.removeEventListener ? mq.removeEventListener("change", l) : mq.removeListener(l);
    };
  }, []);

  const units = useMemo(() => UNITS, []);
  const canTrackPointer = interactive && !reducedMotion;

  const onPointerMove = (e) => {
    if (!canTrackPointer) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ccm-tiltY", `${(px * 6).toFixed(2)}deg`);
    el.style.setProperty("--ccm-tiltX", `${(-py * 4).toFixed(2)}deg`);
  };
  const onPointerLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--ccm-tiltY", "0deg");
    el.style.setProperty("--ccm-tiltX", "0deg");
  };

  // Reduced motion: attention cube stays visible without needing hover, no
  // ambient/pointer motion. Otherwise driven by the `active` prop (hover).
  const isActive = entered && (active || reducedMotion);

  return (
    <div
      ref={stageRef}
      className={`ccm-stage ccm-stage--${size} ${reducedMotion ? "ccm-stage--static" : ""} ${className}`}
      data-active={isActive}
      onMouseMove={onPointerMove}
      onMouseLeave={onPointerLeave}
      aria-hidden="true"
    >
      <div className="ccm-glow" />
      <div className="ccm-orbit">
        <div className="ccm-tilt">
          <div className="ccm-viewer">
            {units.map((u) => (
              <div
                key={`${u.x}${u.y}${u.z}`}
                className="ccm-cube"
                data-attn={isAttention(u) ? "self" : isNeighbour(u) ? "near" : undefined}
                style={{
                  "--x": u.x, "--y": u.y, "--z": u.z,
                  "--nx": `${Math.sign(ATTENTION.x - u.x) * 5}px`,
                  "--ny": `${Math.sign(ATTENTION.y - u.y) * 5}px`,
                  "--nz": `${Math.sign(ATTENTION.z - u.z) * 5}px`,
                }}
              >
                <span className="ccm-face ccm-face--top" />
                <span className="ccm-face ccm-face--bottom" />
                <span className="ccm-face ccm-face--right" />
                <span className="ccm-face ccm-face--left" />
                <span className="ccm-face ccm-face--back" />
                <span className="ccm-face ccm-face--front" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
