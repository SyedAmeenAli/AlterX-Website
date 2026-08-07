import React from "react";
import { motion } from "framer-motion";

/*
  Large reactive product visuals for the "One Engine" section.
  Each accepts an `active` prop and plays one short, non-looping reaction.
  Structure strokes use currentColor (set by the tile stage); orange parts stay orange.
*/

const O = "#ff4d0a";
const OB = "#ff641d";
const EASE = [0.25, 1, 0.5, 1];
const NODE_BG = "#0b0b0a";

const Structure = ({ active, children }) => (
  <g
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: "opacity .42s cubic-bezier(.25,1,.5,1)", opacity: active ? 0.92 : 0.4 }}
  >
    {children}
  </g>
);

/* ------------------------------------------------------------------ */
/* ALTER ENGINE — five-part execution route; signal draws, pauses at   */
/* the approval gate, then completes.                                  */
/* ------------------------------------------------------------------ */
export const AlterEngineVisual = ({ active }) => {
  const route = "M26 150 L84 150 L130 96 L176 150 L234 150";
  return (
    <svg viewBox="0 0 260 190" className="w-full h-full" aria-hidden="true">
      <Structure active={active}>
        <path d={route} />
        <circle cx="26" cy="150" r="6" fill={NODE_BG} />
        <circle cx="84" cy="150" r="6" fill={NODE_BG} />
        <circle cx="176" cy="150" r="6" fill={NODE_BG} />
      </Structure>

      <motion.path
        d={route}
        fill="none"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: [0, 0.44, 0.44, 1] } : { pathLength: 0 }}
        transition={active ? { duration: 1, times: [0, 0.42, 0.6, 1], ease: EASE } : { duration: 0.3, ease: EASE }}
      />

      {/* approval gate */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 1 }}
        animate={active ? { scale: [1, 1, 1.3, 1] } : { scale: 1 }}
        transition={active ? { duration: 1, times: [0, 0.44, 0.6, 0.8], ease: EASE } : { duration: 0.3 }}
      >
        <path d="M130 78 L149 96 L130 114 L111 96 Z" fill="none" stroke={O} strokeWidth="2.6" />
      </motion.g>

      {/* result */}
      <circle cx="234" cy="150" r="9" fill="none" stroke={OB} strokeWidth="2.4" />
      <motion.circle
        cx="234"
        cy="150"
        r="4.5"
        fill={O}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        transition={{ duration: 0.32, delay: active ? 0.85 : 0, ease: EASE }}
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* COGNITIVE AI — layered inventory planes separate, an attention      */
/* signal appears, then layers organize around it.                     */
/* ------------------------------------------------------------------ */
export const CognitiveVisual = ({ active }) => {
  const plane = (y) => `M56 ${y} L130 ${y - 28} L204 ${y} L130 ${y + 28} Z`;
  return (
    <svg viewBox="0 0 260 190" className="w-full h-full" aria-hidden="true">
      <Structure active={active}>
        <motion.path
          d={plane(148)}
          initial={{ y: 0 }}
          animate={active ? { y: [0, 12, 4] } : { y: 0 }}
          transition={active ? { duration: 0.7, times: [0, 0.5, 1], ease: EASE } : { duration: 0.35, ease: EASE }}
        />
        <motion.path
          d={plane(112)}
          opacity="0.7"
          initial={{ y: 0 }}
          animate={active ? { y: [0, 0, 0] } : { y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
        <motion.path
          d={plane(76)}
          opacity="0.5"
          initial={{ y: 0 }}
          animate={active ? { y: [0, -12, -4] } : { y: 0 }}
          transition={active ? { duration: 0.7, times: [0, 0.5, 1], ease: EASE } : { duration: 0.35, ease: EASE }}
        />
      </Structure>

      {/* attention signal */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.35, delay: active ? 0.28 : 0, ease: EASE }}
      >
        <line x1="130" y1="30" x2="130" y2="56" stroke={OB} strokeWidth="2" strokeDasharray="3 4" />
        <circle cx="130" cy="24" r="6" fill={O} />
      </motion.g>

      {/* attention markers organizing on the active plane */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: active ? 0.4 : 0, ease: EASE }}
      >
        <circle cx="130" cy="112" r="4.5" fill={O} />
        <circle cx="100" cy="120" r="3" fill={OB} />
        <circle cx="160" cy="120" r="3" fill={OB} />
      </motion.g>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* CUSTOM WORKFLOWS — orange path enters, branches, stops at approval,  */
/* then continues to the output module.                                */
/* ------------------------------------------------------------------ */
export const WorkflowsVisual = ({ active }) => {
  const main = "M34 100 L92 100 L130 66 L168 100 L226 100";
  const branch = "M92 100 L130 134 L168 100";
  return (
    <svg viewBox="0 0 260 190" className="w-full h-full" aria-hidden="true">
      <Structure active={active}>
        <rect x="14" y="86" width="30" height="28" rx="2" />
        <rect x="216" y="86" width="30" height="28" rx="2" />
        <path d={branch} opacity="0.55" />
        <rect x="120" y="124" width="20" height="20" rx="2" opacity="0.55" />
      </Structure>

      <motion.path
        d={main}
        fill="none"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: [0, 0.45, 0.45, 1] } : { pathLength: 0 }}
        transition={active ? { duration: 1, times: [0, 0.42, 0.6, 1], ease: EASE } : { duration: 0.3, ease: EASE }}
      />

      {/* approval gate at apex */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 1 }}
        animate={active ? { scale: [1, 1, 1.32, 1] } : { scale: 1 }}
        transition={active ? { duration: 1, times: [0, 0.44, 0.6, 0.8], ease: EASE } : { duration: 0.3 }}
      >
        <path d="M130 50 L148 66 L130 82 L112 66 Z" fill="none" stroke={O} strokeWidth="2.6" />
      </motion.g>

      {/* output activates */}
      <motion.rect
        x="216"
        y="86"
        width="30"
        height="28"
        rx="2"
        fill="none"
        stroke={O}
        strokeWidth="2.6"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: active ? 0.85 : 0, ease: EASE }}
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* BUILD WITH ALTERX — external connectors align, an orange signal      */
/* enters the central Engine, approval activates, result exits.        */
/* ------------------------------------------------------------------ */
export const BuildVisual = ({ active }) => {
  const connectorY = [72, 96, 120];
  return (
    <svg viewBox="0 0 260 190" className="w-full h-full" aria-hidden="true">
      <Structure active={active}>
        <rect x="104" y="66" width="52" height="52" rx="4" />
        <rect x="118" y="80" width="24" height="24" rx="2" opacity="0.55" />
      </Structure>

      {/* connectors align */}
      {connectorY.map((y, i) => (
        <motion.g
          key={y}
          initial={{ x: -12, opacity: 0.25 }}
          animate={active ? { x: 0, opacity: 0.95 } : { x: -12, opacity: 0.25 }}
          transition={{ duration: 0.4, delay: active ? i * 0.06 : 0, ease: EASE }}
          style={{ color: "currentColor" }}
        >
          <line x1="26" y1={y} x2="104" y2={y} stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <circle cx="26" cy={y} r="4" fill="currentColor" />
        </motion.g>
      ))}

      {/* orange signal into engine */}
      <motion.line
        x1="26"
        y1="96"
        x2="104"
        y2="96"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
        pathLength="1"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.4, delay: active ? 0.24 : 0, ease: EASE }}
      />

      {/* approval point activates */}
      <motion.circle
        cx="130"
        cy="92"
        r="6"
        fill={O}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={active ? { opacity: 1, scale: [0.4, 1.3, 1] } : { opacity: 0, scale: 0.4 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        transition={{ duration: 0.4, delay: active ? 0.5 : 0, ease: EASE }}
      />

      {/* result exits right */}
      <motion.line
        x1="156"
        y1="96"
        x2="230"
        y2="96"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
        pathLength="1"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.4, delay: active ? 0.68 : 0, ease: EASE }}
      />
      <motion.circle
        cx="234"
        cy="96"
        r="5"
        fill={OB}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: active ? 0.95 : 0, ease: EASE }}
      />
    </svg>
  );
};

export const PRODUCT_VISUALS = {
  engine: AlterEngineVisual,
  cognitive: CognitiveVisual,
  workflows: WorkflowsVisual,
  build: BuildVisual,
};
