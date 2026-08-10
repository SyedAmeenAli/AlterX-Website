import { useEffect, useRef, useState } from "react";
import "./CustomWorkflowStack.css";

/*
  CustomWorkflowStack — four translucent isometric layers that alternate in
  from left/right, settle into a vertical stack, then sit calm. Not a
  loader: the assembly plays once on mount, hover only makes the settled
  object reactive (layers separate/glow), it never disappears/resets.

  Each layer is the classic 3-face isometric "box" (side-left/side-right/
  top only — no front/back needed at this angle), which is what makes the
  alternating left/right entrance read clearly.

  Reused identically on the homepage Custom workflows tile, the mega-nav
  Solutions > Custom workflows preview, and the Custom Workflows page hero
  (floating, no container). `size` only scales it.
*/

const LAYERS = [
  { key: "outcome", label: "Outcome", from: "left" },
  { key: "systems", label: "Systems", from: "right" },
  { key: "authority", label: "Authority", from: "left" },
  { key: "checks", label: "Checks", from: "right" },
];

export default function CustomWorkflowStack({ active = false, interactive = true, size = "tile", showLabels = false, className = "" }) {
  const stageRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const l = () => setReducedMotion(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", l) : mq.addListener(l);

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

  const canTrackPointer = interactive && !reducedMotion && size === "hero";

  const onPointerMove = (e) => {
    if (!canTrackPointer) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--cws-tiltY", `${(px * 5).toFixed(2)}deg`);
    el.style.setProperty("--cws-tiltX", `${(-py * 3).toFixed(2)}deg`);
  };
  const onPointerLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--cws-tiltY", "0deg");
    el.style.setProperty("--cws-tiltX", "0deg");
  };

  const isEntered = entered || reducedMotion;
  const isActive = (active || reducedMotion) && isEntered;

  return (
    <div
      ref={stageRef}
      className={`cws-stage cws-stage--${size} ${className}`}
      data-entered={isEntered}
      data-active={isActive}
      onMouseMove={onPointerMove}
      onMouseLeave={onPointerLeave}
      aria-hidden="true"
    >
      <div className="cws-glow" />
      <div className="cws-tilt">
        <div className="cws-tower">
          {LAYERS.map((l, i) => (
            <div key={l.key} className="cws-layer" data-from={l.from} style={{ "--i": i }}>
              <span className="cws-face cws-face--top" />
              <span className="cws-face cws-face--left" />
              <span className="cws-face cws-face--right" />
            </div>
          ))}
        </div>
      </div>
      {showLabels && (
        <div className="cws-labels">
          {LAYERS.map((l, i) => (
            <span key={l.key} className="cws-label" data-visible={isEntered} style={{ "--i": i }}>{l.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
