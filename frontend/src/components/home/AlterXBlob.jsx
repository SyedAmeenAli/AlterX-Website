import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* AlterXBlob — the hero's dominant visual, replacing the old particle-x
   hero video entirely. One organic, luminous green form built from two
   overlapping morph paths (soft-cross silhouette, close to the supplied
   logo mark), not a literal recreation of the logo. Slow breathing scale
   and a very slow rotation are the only constant motion; cursor movement
   adds a light parallax tilt on top. No spin, no loop video, no particle
   canvas — a calm, physical-feeling object. */

const PATHS_A = [
  "M250 40 C 320 60, 340 140, 300 200 C 360 220, 420 280, 400 350 C 380 420, 300 440, 250 400 C 200 440, 120 420, 100 350 C 80 280, 140 220, 200 200 C 160 140, 180 60, 250 40 Z",
  "M250 30 C 330 55, 335 150, 290 205 C 355 230, 415 270, 405 345 C 390 415, 305 445, 250 395 C 195 445, 110 415, 95 345 C 85 270, 145 230, 210 205 C 165 150, 170 55, 250 30 Z",
  "M250 40 C 320 60, 340 140, 300 200 C 360 220, 420 280, 400 350 C 380 420, 300 440, 250 400 C 200 440, 120 420, 100 350 C 80 280, 140 220, 200 200 C 160 140, 180 60, 250 40 Z",
];

export default function AlterXBlob({ className = "" }) {
  const reduce = useReducedMotion();
  const stageRef = useRef(null);

  const onMove = (e) => {
    if (reduce) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--bx", `${px * 14}px`);
    el.style.setProperty("--by", `${py * 14}px`);
  };

  const onLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--bx", "0px");
    el.style.setProperty("--by", "0px");
  };

  return (
    <div
      ref={stageRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative ${className}`}
      style={{ "--bx": "0px", "--by": "0px" }}
      data-testid="alterx-blob"
      aria-hidden="true"
    >
      <motion.div
        className="w-full h-full"
        style={{ transform: "translate(var(--bx), var(--by))", transition: "transform 0.4s ease-out" }}
        animate={reduce ? {} : { rotate: [0, 4, -3, 0], scale: [1, 1.035, 0.985, 1] }}
        transition={reduce ? {} : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 500 480" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id="alterx-blob-core" cx="42%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#D8FFE7" />
              <stop offset="35%" stopColor="#5BEA99" />
              <stop offset="75%" stopColor="#32C97A" />
              <stop offset="100%" stopColor="#123D27" />
            </radialGradient>
            <filter id="alterx-blob-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="18" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.path
            fill="url(#alterx-blob-core)"
            filter="url(#alterx-blob-glow)"
            opacity={0.96}
            animate={reduce ? {} : { d: PATHS_A }}
            transition={reduce ? {} : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
            d={PATHS_A[0]}
          />
        </svg>
      </motion.div>
    </div>
  );
}
