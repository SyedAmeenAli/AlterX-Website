import { useEffect, useRef, useState } from "react";
import "./BuildWithAlterXGrid.css";

/*
  BuildWithAlterXGrid — nine blocks in a 3×3 field, each continuously
  sliding to a different valid slot on its own staggered timing, with the
  "active" orange state transferring between four of them over the cycle.
  Not a loader: this is the one product visual in the system that stays
  continuously active, by design — Build with AlterX is the integration
  route, "composable / always changing with context."

  Reused identically on the homepage Build with AlterX tile, the public
  mega-nav Developers featured visual (Build with AlterX / rest state
  only — the wireframe cube stays for the other Developer sub-states),
  and optionally larger on the Developers page.
*/

const CELLS = Array.from({ length: 9 }, (_, i) => i);
// four cells the "active" orange state travels through, in order
const ACTIVE_SEQUENCE = [4, 1, 7, 5]; // center, top-mid, bottom-mid, mid-right
// each cell swaps with its point-symmetric opposite (index 8-i) and back —
// center (4) has no opposite, so it just holds while everything moves
// around it.
const swapOffset = (i) => {
  const j = 8 - i;
  if (i === j) return { dx: 0, dy: 0 };
  return { dx: (j % 3) - (i % 3), dy: Math.floor(j / 3) - Math.floor(i / 3) };
};

export default function BuildWithAlterXGrid({ active = false, size = "tile", className = "" }) {
  const stageRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const l = () => setReducedMotion(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", l) : mq.addListener(l);

    // continuous animation is real cost — pause it whenever the tile
    // isn't actually on screen, and whenever the tab isn't visible.
    const el = stageRef.current;
    let io;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? true), { threshold: 0.1 });
      io.observe(el);
    }
    // fallback — some environments never fire IntersectionObserver; don't
    // leave the visual permanently paused because of that.
    const fallback = setTimeout(() => setVisible(true), 500);
    const onVis = () => setVisible((v) => v && !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearTimeout(fallback);
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      mq.removeEventListener ? mq.removeEventListener("change", l) : mq.removeListener(l);
    };
  }, []);

  const paused = reducedMotion || !visible;

  return (
    <div ref={stageRef} className={`bwx-stage bwx-stage--${size} ${className}`} data-active={active} data-paused={paused} aria-hidden="true">
      <div className="bwx-glow" />
      <div className="bwx-grid">
        {CELLS.map((i) => {
          const activeIdx = ACTIVE_SEQUENCE.indexOf(i);
          const { dx, dy } = swapOffset(i);
          return (
            <div
              key={i}
              className="bwx-cell"
              data-slot={i}
              data-active-phase={activeIdx >= 0 ? activeIdx : undefined}
              style={{ "--i": i, "--row": Math.floor(i / 3), "--col": i % 3, "--dx": dx, "--dy": dy }}
            />
          );
        })}
      </div>
    </div>
  );
}
