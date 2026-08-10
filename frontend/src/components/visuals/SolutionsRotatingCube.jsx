import { useEffect, useRef, useState } from "react";
import "./SolutionsRotatingCube.css";

/*
  SolutionsRotatingCube — a real CSS-3D cube (4 side faces + top),
  continuously rotating on Y, transparent orange architectural-glass
  material. The parent visual identity for "Solutions" as a whole — the
  mega-nav featured panel default state and the /solutions hero. Individual
  solutions (Cognitive AI, Voice, AI websites, Custom workflows) keep their
  own distinct visuals; this cube never replaces those.

  Continuous rotation is intentional here (unlike most other product
  visuals) — paused offscreen / tab-hidden / reduced-motion.
*/

const FACES = [0, 1, 2, 3];

export default function SolutionsRotatingCube({ size = "preview", interactive = false, className = "" }) {
  const stageRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const l = () => setReducedMotion(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", l) : mq.addListener(l);

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
  }, []);

  const onPointerMove = (e) => {
    if (!interactive || reducedMotion) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--sc-tiltX", `${(-py * 3).toFixed(2)}deg`);
    el.style.setProperty("--sc-tiltPx", `${(px * 3).toFixed(1)}px`);
  };
  const onPointerLeave = () => {
    setHovered(false);
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--sc-tiltX", "0deg");
    el.style.setProperty("--sc-tiltPx", "0px");
  };

  const paused = reducedMotion || !visible;

  return (
    <div
      ref={stageRef}
      className={`sc-stage sc-stage--${size} ${className}`}
      data-hover={hovered}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={onPointerMove}
      onMouseLeave={onPointerLeave}
      aria-hidden="true"
    >
      <div className="sc-atmosphere" />
      <div className="sc-tilt">
        <div className="sc-cube-loader" data-paused={paused}>
          <div className="sc-cube-wrapper">
            {FACES.map((i) => (
              <span key={i} className="sc-cube-span" style={{ "--i": i }} />
            ))}
            <div className="sc-cube-top" />
          </div>
        </div>
        <div className="sc-shadow" />
      </div>
    </div>
  );
}
