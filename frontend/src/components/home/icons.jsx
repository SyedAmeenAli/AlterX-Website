import React from "react";

const O = "#ff4d0a";
const OB = "#ff641d";

/* Original dimensional icon family — shared isometric depth, line weight and lighting logic. */

export const EngineIcon = () => (
  <svg viewBox="0 0 240 200" className="w-full h-full" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.6" fill="none">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${28 + i * 40} ${132 - i * 22})`}>
          <path d="M0 0 L26 -13 L52 0 L26 13 Z" />
          <path d="M0 0 L0 10 L26 23 L26 13" opacity=".55" />
          <path d="M52 0 L52 10 L26 23" opacity=".55" />
        </g>
      ))}
    </g>
    <g className="ico-signal">
      <path d="M54 125 L94 103 L134 81 L174 59 L214 37" stroke={O} strokeWidth="2" fill="none" strokeDasharray="4 5" />
      <g transform="translate(108 88)">
        <rect x="-9" y="-9" width="18" height="18" fill={O} transform="rotate(45)" />
      </g>
      <circle cx="54" cy="125" r="4" fill={OB} />
      <circle cx="214" cy="37" r="4" fill={OB} />
    </g>
  </svg>
);

export const CognitiveIcon = () => (
  <svg viewBox="0 0 240 200" className="w-full h-full" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.6" fill="none">
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M40 ${140 - i * 34} L120 ${100 - i * 34} L200 ${140 - i * 34} L120 ${180 - i * 34} Z`} opacity={i === 2 ? 1 : 0.6} />
      ))}
    </g>
    <g stroke="currentColor" strokeWidth="1.4" opacity=".7">
      <circle cx="88" cy="118" r="3" fill="currentColor" />
      <circle cx="150" cy="130" r="3" fill="currentColor" />
    </g>
    <g className="ico-signal">
      <line x1="120" y1="30" x2="120" y2="66" stroke={O} strokeWidth="2" strokeDasharray="3 4" />
      <circle cx="120" cy="26" r="5" fill={O} />
      <circle cx="120" cy="72" r="4" fill="none" stroke={OB} strokeWidth="2" />
      <path d="M40 106 L120 66 L200 106" stroke={O} strokeWidth="1.6" fill="none" />
    </g>
  </svg>
);

export const WorkflowsIcon = () => (
  <svg viewBox="0 0 240 200" className="w-full h-full" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.6" fill="none">
      <rect x="24" y="36" width="52" height="36" />
      <rect x="24" y="128" width="52" height="36" />
      <rect x="164" y="82" width="52" height="36" />
      <path d="M76 54 H108 V92 H132" />
      <path d="M76 146 H108 V108 H132" />
    </g>
    <g className="ico-signal">
      <rect x="126" y="86" width="28" height="28" fill="none" stroke={O} strokeWidth="2" transform="rotate(45 140 100)" />
      <circle cx="140" cy="100" r="4" fill={O} />
      <line x1="158" y1="100" x2="164" y2="100" stroke={O} strokeWidth="2" />
    </g>
  </svg>
);

export const BuildIcon = () => (
  <svg viewBox="0 0 240 200" className="w-full h-full" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.6" fill="none">
      <rect x="88" y="64" width="64" height="64" />
      <rect x="102" y="78" width="36" height="36" opacity=".6" />
      <line x1="20" y1="80" x2="88" y2="80" />
      <line x1="20" y1="112" x2="88" y2="112" />
      <circle cx="20" cy="80" r="3.5" fill="currentColor" />
      <circle cx="20" cy="112" r="3.5" fill="currentColor" />
    </g>
    <g className="ico-signal">
      <line x1="152" y1="96" x2="222" y2="96" stroke={O} strokeWidth="2" />
      <circle cx="222" cy="96" r="5" fill={O} />
      <path d="M120 64 V40 H104 M120 64 V40 H136" stroke={OB} strokeWidth="1.6" fill="none" />
      <rect x="112" y="30" width="16" height="10" fill="none" stroke={OB} strokeWidth="1.6" />
    </g>
  </svg>
);

export const PANEL_ICONS = {
  engine: EngineIcon,
  cognitive: CognitiveIcon,
  workflows: WorkflowsIcon,
  build: BuildIcon,
};
