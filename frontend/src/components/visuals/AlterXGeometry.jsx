import { useEffect, useRef, useState } from "react";
import "./AlterXGeometry.css";

/*
  AlterXGeometry — one reusable CSS 3D cube family, the AlterX product
  identity object. Not a looping loader: rest/active/named-substate only,
  driven entirely by CSS transitions (no per-frame JS/RAF), so it costs
  nothing while idle and nothing when off-screen or menu-closed.

  variant:
    "assemble"  — several blocks converge into one structure (Alter Engine,
                  Custom workflows)
    "wireframe" — thin-edge single cube, optional slow spin, pulse point
                  (Developers)
    "stack"     — vertically offset units, one can carry attention
                  (Cognitive AI)
    "split"     — one unit separates from the formed structure, moves back,
                  reconnects (Checking & recovery)
    "planes"    — thin flat 3D surfaces in perspective, calmer than a cube
                  (AI websites, Resources)
    "signal"    — two small clusters that briefly connect (Voice workflows)

  state: "rest" | "active" | variant-specific named states (see each block).
*/
export default function AlterXGeometry({ variant = "assemble", state = "rest", spin = false, className = "", label }) {
  const stageRef = useRef(null);
  // one controlled reveal on mount: paint at rest first, then transition to
  // the requested state a tick later. After that, state changes (hover
  // between links) apply immediately — no repeated "rest" replay.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    // setTimeout, not requestAnimationFrame — this only needs to fire once,
    // a frame-perfect callback isn't required, and it stays reliable in
    // environments that throttle/skip rAF.
    const t = setTimeout(() => setEntered(true), 20);
    return () => clearTimeout(t);
  }, []);
  const applied = entered ? state : "rest";

  const onPointerMove = (e) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tiltY", `${(px * 7).toFixed(2)}deg`);
    el.style.setProperty("--tiltX", `${(-py * 5).toFixed(2)}deg`);
  };
  const onPointerLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--tiltY", "0deg");
    el.style.setProperty("--tiltX", "0deg");
  };

  return (
    <div
      ref={stageRef}
      className={`axg-stage ${className}`}
      data-state={applied}
      onMouseMove={onPointerMove}
      onMouseLeave={onPointerLeave}
      aria-hidden="true"
    >
      <div className="axg-scene">
        {variant === "assemble" && <AssembleCube state={applied} />}
        {variant === "wireframe" && <WireframeCube state={applied} spin={spin} />}
        {variant === "stack" && <StackCubes state={applied} />}
        {variant === "split" && <SplitCube state={applied} />}
        {variant === "planes" && <PlanesObject state={applied} />}
        {variant === "signal" && <SignalObject state={applied} />}
      </div>
      {label && <span className="axg-domlabel" data-visible={applied !== "rest"}>{label}</span>}
    </div>
  );
}

const Cube = ({ className = "", style, wire = false }) => (
  <div className={`axg-cube ${wire ? "axg-cube--wire" : ""} ${className}`} style={style}>
    <span className="axg-face axg-face--front" />
    <span className="axg-face axg-face--back" />
    <span className="axg-face axg-face--top" />
    <span className="axg-face axg-face--bottom" />
    <span className="axg-face axg-face--right" />
    <span className="axg-face axg-face--left" />
  </div>
);

/* several blocks start loosely offset, converge to one structure. A small
   marker (translated dot) can travel through once assembled, or stop at a
   boundary, or peel one unit back out and return — covering rest / active /
   authority (approval-stop) / recovery (split-and-return) / platform
   (pull back to reveal a supervising frame) from one shared object. */
function AssembleCube({ state }) {
  return (
    <div className="axg-assemble" data-state={state}>
      <Cube className="axg-u axg-u--1" />
      <Cube className="axg-u axg-u--2" />
      <Cube className="axg-u axg-u--3" />
      <span className="axg-marker" />
      <div className="axg-platform-ring" />
    </div>
  );
}

function WireframeCube({ state, spin }) {
  return (
    <div className="axg-wireframe" data-state={state} data-spin={spin}>
      <Cube wire className="axg-u axg-u--wire" />
      <span className="axg-pulse" />
    </div>
  );
}

function StackCubes({ state }) {
  return (
    <div className="axg-stack" data-state={state}>
      <Cube className="axg-u axg-s--1" />
      <Cube className="axg-u axg-s--2" />
      <Cube className="axg-u axg-s--3" />
      <span className="axg-attention" />
    </div>
  );
}

/* thin flat 3D surfaces, not a cube — AI websites / Resources */
function PlanesObject({ state }) {
  return (
    <div className="axg-planes" data-state={state}>
      <span className="axg-plane axg-plane--1" />
      <span className="axg-plane axg-plane--2" />
      <span className="axg-plane axg-plane--3" />
    </div>
  );
}

/* two small clusters that briefly connect — Voice workflows */
function SignalObject({ state }) {
  return (
    <div className="axg-signal" data-state={state}>
      <Cube className="axg-u axg-sig--left" />
      <Cube className="axg-u axg-sig--right" />
      <span className="axg-sig-link" />
    </div>
  );
}

function SplitCube({ state }) {
  return (
    <div className="axg-split" data-state={state}>
      <Cube className="axg-u axg-sp--body" />
      <Cube className="axg-u axg-sp--piece" />
    </div>
  );
}
