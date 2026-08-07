import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/anim";

/*
  OrangeExecutionThread primitives.
  Each section owns its own SVG segment, clipped inside the section.
  Stroke animation only — no per-frame JS.
*/

export const ThreadPath = ({ d, stroke = "var(--ax-orange)", strokeWidth = 2, delay = 0, duration = 1.1, dash, className = "", once = true }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-80px" });
  const reduce = useReducedMotion();
  return (
    <motion.path
      ref={ref}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={dash}
      vectorEffect="non-scaling-stroke"
      className={className}
      initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
      animate={inView || reduce ? { pathLength: 1 } : { pathLength: 0 }}
      transition={{ duration, delay, ease: EASE }}
    />
  );
};

/* Broad curved orange ribbon used at major chapter transitions. Section-scoped, clipped. */
export const GradientRibbon = ({ className = "", flip = false, opacity = 1, id = "axrb" }) => (
  <svg
    className={`pointer-events-none absolute ${className}`}
    viewBox="0 0 1440 420"
    preserveAspectRatio="none"
    aria-hidden="true"
    style={{ opacity, transform: flip ? "scaleX(-1)" : undefined }}
  >
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ff8a3d" stopOpacity="0" />
        <stop offset="0.22" stopColor="#ff8a3d" stopOpacity="0.55" />
        <stop offset="0.5" stopColor="#ff4d0a" stopOpacity="0.9" />
        <stop offset="0.78" stopColor="#c9360a" stopOpacity="0.5" />
        <stop offset="1" stopColor="#c9360a" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M-40 330 C 240 130, 520 40, 780 120 C 1030 196, 1200 210, 1480 96 L 1480 190 C 1210 296, 1020 282, 760 210 C 520 144, 260 240, -40 420 Z"
      fill={`url(#${id})`}
    />
  </svg>
);

/* Small evidence mark — a closed loop the thread resolves into. */
export const EvidenceMark = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" className={className} aria-hidden="true">
    <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(251,250,247,.8)" strokeWidth="1.6" />
    <path d="M6.4 10.2 L9 12.8 L13.8 7.6" fill="none" stroke="var(--ax-orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
