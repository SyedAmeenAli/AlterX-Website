import { useEffect, useMemo, useRef, useState } from "react";
import "./AlterEngineAssembly.css";

/*
  AlterEngineAssembly — 8 transparent-orange CSS-3D cubes that enter from
  scattered positions and converge into one 2×2×2 structure once, then sit
  calm. Not a loader: assembly plays a single time on mount, hover only
  makes the already-assembled object reactive (separate/glow/tilt), it
  never replays the full entrance.

  The 8 units are the 8 corners of a cube — (x,y,z) each ±1 — which is both
  the natural "8 boxes converging into one structure" shape and reads as
  "pieces of work becoming one executable structure."

  Reused identically on the homepage Alter Engine tile, the public mega-nav
  Alter Engine preview and the Alter Engine page hero — same component,
  `size` only scales it, `interactive` disables pointer tilt for the fast
  nav context.
*/

const AXES = [-1, 1];
const UNITS = AXES.flatMap((x) => AXES.flatMap((y) => AXES.map((z) => ({ x, y, z }))));
const CORE = { x: 1, y: -1, z: 1 }; // front-top-right — the active core
const PIECE = { x: -1, y: 1, z: -1 }; // back-bottom-left — detaches for "recovery"

const isCore = (u) => u.x === CORE.x && u.y === CORE.y && u.z === CORE.z;
const isPiece = (u) => u.x === PIECE.x && u.y === PIECE.y && u.z === PIECE.z;

export default function AlterEngineAssembly({ active = false, interactive = true, size = "tile", state = "core", className = "", label }) {
  const stageRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const l = () => setReducedMotion(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", l) : mq.addListener(l);

    // run the assembly once when it actually enters the viewport (falls
    // back to a timer — IntersectionObserver doesn't fire in every
    // preview/sandbox context, real browsers get the real trigger)
    const el = stageRef.current;
    let done = false;
    const settle = () => { if (!done) { done = true; setEntered(true); } };
    let io;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) settle(); }, { threshold: 0.2 });
      io.observe(el);
    }
    const t = setTimeout(settle, 400);
    return () => {
      clearTimeout(t);
      if (io) io.disconnect();
      mq.removeEventListener ? mq.removeEventListener("change", l) : mq.removeListener(l);
    };
  }, []);

  const units = useMemo(() => UNITS, []);
  const canTrackPointer = interactive && !reducedMotion && size !== "nav";

  const onPointerMove = (e) => {
    if (!canTrackPointer) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--aea-tiltY", `${(px * 7).toFixed(2)}deg`);
    el.style.setProperty("--aea-tiltX", `${(-py * 4).toFixed(2)}deg`);
  };
  const onPointerLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--aea-tiltY", "0deg");
    el.style.setProperty("--aea-tiltX", "0deg");
  };

  const isEntered = entered || reducedMotion;
  const isActive = (active || reducedMotion) && isEntered;

  return (
    <div
      ref={stageRef}
      className={`aea-stage aea-stage--${size} ${className}`}
      data-entered={isEntered}
      data-active={isActive}
      data-state={state}
      onMouseMove={onPointerMove}
      onMouseLeave={onPointerLeave}
      aria-hidden="true"
    >
      <div className="aea-tilt">
        <div className="aea-group">
          {units.map((u, i) => (
            <div
              key={`${u.x}${u.y}${u.z}`}
              className="aea-cube"
              data-core={isCore(u) ? "true" : undefined}
              data-piece={isPiece(u) ? "true" : undefined}
              style={{ "--x": u.x, "--y": u.y, "--z": u.z, "--i": i, "--layer": i % 3 }}
            >
              <span className="aea-face aea-face--top" />
              <span className="aea-face aea-face--bottom" />
              <span className="aea-face aea-face--front" />
              <span className="aea-face aea-face--back" />
              <span className="aea-face aea-face--right" />
              <span className="aea-face aea-face--left" />
            </div>
          ))}
          <div className="aea-ground">
            <span className="aea-ground-shine" />
          </div>
        </div>
      </div>
      {state === "boundary" && <span className="aea-boundary-line" aria-hidden="true" />}
      {label && <span className="aea-domlabel" data-visible={isActive}>{label}</span>}
    </div>
  );
}
