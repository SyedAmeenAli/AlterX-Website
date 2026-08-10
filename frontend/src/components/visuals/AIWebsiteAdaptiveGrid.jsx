import { useEffect, useRef, useState } from "react";
import "./AIWebsiteAdaptiveGrid.css";

/*
  AIWebsiteAdaptiveGrid — five interface regions that continuously
  reorganize through irregular, individually-different routes, one "active"
  orange region moving through the structure as it does. Represents an
  interface reorganizing around intent — not a loader.

  Reused identically on the mega-nav Solutions > AI websites preview and
  the AI Websites destination hero (no container there — floats directly
  in the page). `size` only scales it.
*/

// five base positions in step units — deliberately irregular, not a clean
// symmetric grid (three across the top, two offset beneath)
const BASE = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 0.5, y: 1 },
  { x: 1.5, y: 1 },
];
// each block's own distinct route — not a shared formula, five different paths
const TARGET = [
  { x: 1.5, y: 1 },
  { x: 0.5, y: 1 },
  { x: 0, y: 0.6 },
  { x: 2, y: 0.4 },
  { x: 1, y: 0 },
];
// the active orange state travels: square3 → square5 → square2 → square4 → (square3)
const ACTIVE_SEQUENCE = [2, 4, 1, 3];

export default function AIWebsiteAdaptiveGrid({ active = false, interactive = false, size = "nav", className = "" }) {
  const stageRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const l = () => setReducedMotion(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", l) : mq.addListener(l);

    // nav instance only exists in the DOM while its menu item is hovered —
    // mount/unmount already is the pause, so it should animate immediately
    // (spec: responsive within ~80ms). The hero instance pauses offscreen.
    if (size === "nav") { setVisible(true); return undefined; }

    const el = stageRef.current;
    let io;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? true), { threshold: 0.1 });
      io.observe(el);
    }
    const fallback = setTimeout(() => setVisible(true), 300);
    const onVis = () => setVisible((v) => v && !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearTimeout(fallback);
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      mq.removeEventListener ? mq.removeEventListener("change", l) : mq.removeListener(l);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerMove = (e) => {
    if (!interactive || reducedMotion) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--aiw-px", `${(px * 4).toFixed(1)}px`);
    el.style.setProperty("--aiw-py", `${(py * 3).toFixed(1)}px`);
  };
  const onPointerLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--aiw-px", "0px");
    el.style.setProperty("--aiw-py", "0px");
  };

  const paused = reducedMotion || !visible;

  return (
    <div
      ref={stageRef}
      className={`aiw-stage aiw-stage--${size} ${className}`}
      data-active={active}
      data-paused={paused}
      onMouseMove={onPointerMove}
      onMouseLeave={onPointerLeave}
      aria-hidden="true"
    >
      <div className="aiw-glow" />
      <div className="aiw-field">
        {BASE.map((pos, i) => {
          const dx = TARGET[i].x - pos.x;
          const dy = TARGET[i].y - pos.y;
          const phase = ACTIVE_SEQUENCE.indexOf(i);
          return (
            <div
              key={i}
              className="aiw-block"
              data-slot={i}
              data-active-phase={phase >= 0 ? phase : undefined}
              style={{ "--x": pos.x, "--y": pos.y, "--dx": dx, "--dy": dy, "--i": i }}
            >
              {i === 1 && <span className="aiw-mark aiw-mark--lines" />}
              {i === 3 && <span className="aiw-mark aiw-mark--dot" />}
              {i === 4 && <span className="aiw-mark aiw-mark--rect" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
