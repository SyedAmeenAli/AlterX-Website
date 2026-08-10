import { useEffect, useRef, useState } from "react";
import "./AlterXResourcesFolder.css";

/*
  AlterXResourcesFolder — the Resources collection identity: a folder that
  opens and fans three papers. Recolored from the supplied yellow reference
  into AlterX orange, "Documents / 128 items" and system-font labels
  removed entirely — the visual carries no text.

  size: "nav" | "hero"
  active: nav mega-menu hover state (bool) — nav has no independent state prop,
          it is either closed or open-to-"all".
  state: hero only — "rest" | "all" | "guides" | "insights" — driven by the
         page filter; hover always overrides to the fullest "all" fan.
  interactive: hero only — enables outer pointer-tilt wrapper.
*/

const VALID_STATES = ["rest", "all", "guides", "insights", "featured"];

export default function AlterXResourcesFolder({ size = "nav", active = false, state = "rest", interactive = false, className = "" }) {
  const wrapRef = useRef(null);
  const [entered, setEntered] = useState(size === "nav");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const l = () => setReducedMotion(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", l) : mq.addListener(l);

    if (size === "nav") return () => (mq.removeEventListener ? mq.removeEventListener("change", l) : mq.removeListener(l));

    const el = wrapRef.current;
    let io;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) setEntered(true); }, { threshold: 0.15 });
      io.observe(el);
    }
    const fallback = setTimeout(() => setEntered(true), 300);
    return () => {
      clearTimeout(fallback);
      if (io) io.disconnect();
      mq.removeEventListener ? mq.removeEventListener("change", l) : mq.removeListener(l);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const onPointerMove = (e) => {
    if (!interactive || reducedMotion) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rf-tiltY", `${(px * 8).toFixed(2)}deg`);
    el.style.setProperty("--rf-tiltX", `${(-py * 5).toFixed(2)}deg`);
    el.style.setProperty("--rf-tx", `${(px * 6).toFixed(2)}px`);
  };
  const resetTilt = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--rf-tiltY", "0deg");
    el.style.setProperty("--rf-tiltX", "0deg");
    el.style.setProperty("--rf-tx", "0px");
  };

  const resolvedState = VALID_STATES.includes(state) ? state : "rest";
  const dataOpen = size === "nav" ? active : hovered || resolvedState === "all";
  const dataState = size === "nav" ? resolvedState : (hovered ? "all" : resolvedState);

  return (
    <div
      ref={wrapRef}
      className={`rf-reactive rf-reactive--${size} ${className}`}
      onMouseEnter={() => { setHovered(true); }}
      onMouseMove={onPointerMove}
      onMouseLeave={() => { setHovered(false); resetTilt(); }}
      aria-hidden="true"
    >
      {size === "hero" && <div className="rf-shadow" data-open={dataOpen} />}
      <div className="resource-folder" data-size={size} data-entered={entered} data-open={dataOpen} data-state={dataState} data-reduced={reducedMotion}>
        <div className="folder__back" />
        <div className="folder__papers">
          <div className="paper paper--1" />
          <div className="paper paper--2" />
          <div className="paper paper--3" />
        </div>
        <div className="folder__front" />
      </div>
    </div>
  );
}
