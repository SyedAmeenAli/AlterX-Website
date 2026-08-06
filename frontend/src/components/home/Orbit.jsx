import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ORBIT_NODES } from "@/content/home";
import { ChapterHead } from "@/components/kit";
import { EASE } from "@/lib/anim";

const R = 240;
const CX = 330, CY = 330;
const FOCUS = 0;

export default function Orbit() {
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));

  const pick = (i) => {
    setActive(i);
    setVisited((v) => new Set([...v, i]));
  };

  const nodeAngle = (i) => -90 + i * 72;
  const rotation = FOCUS - nodeAngle(active);

  return (
    <section className="bg-black text-[#fbfaf7] py-24 md:py-36 relative cv-auto" data-testid="orbit-section">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 60%, rgba(255,90,31,.14) 0%, rgba(241,90,36,.05) 40%, rgba(0,0,0,0) 70%)" }} aria-hidden="true" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        <ChapterHead
          num="04"
          eyebrow="Accountability orbit"
          title="What keeps Alter Engine different."
          body="The work can move, but authority, progress and evidence do not disappear."
          dark
        />
        <div className="grid lg:grid-cols-[55%_1fr] gap-12 items-center">
          <div className="max-w-[560px] mx-auto w-full">
            <svg viewBox="0 0 660 660" className="w-full h-auto" role="group" aria-label="Accountability orbit — five principles around the Alter Engine core">
              <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
              <circle cx={CX} cy={CY} r={R - 60} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1" strokeDasharray="2 6" />
              <motion.g
                animate={{ rotate: rotation }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{ originX: "330px", originY: "330px" }}
              >
                {ORBIT_NODES.map((n, i) => {
                  const a = (nodeAngle(i) * Math.PI) / 180;
                  const x = CX + Math.cos(a) * R;
                  const y = CY + Math.sin(a) * R;
                  const isA = i === active;
                  const seen = visited.has(i);
                  return (
                    <g key={n.key} transform={`translate(${x} ${y})`}>
                      <motion.g animate={{ rotate: -rotation }} transition={{ duration: 0.7, ease: EASE }}>
                        <circle
                          r="26"
                          fill={isA ? "#ff5a1f" : "#090909"}
                          stroke={isA ? "#ff5a1f" : seen ? "rgba(255,90,31,.45)" : "rgba(255,255,255,.25)"}
                          strokeWidth="1.5"
                          className="cursor-pointer"
                          onClick={() => pick(i)}
                          role="button"
                          tabIndex={0}
                          aria-label={n.label}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(i); } }}
                          data-testid={`orbit-node-${n.key}`}
                        />
                        <text textAnchor="middle" dy="4" fontSize="12" fontWeight="700" fill={isA ? "#000" : "#fbfaf7"} pointerEvents="none">{i + 1}</text>
                        <text textAnchor="middle" y="46" fontSize="12" fontWeight="600" fill={isA ? "#ff5a1f" : "rgba(255,255,255,.55)"} pointerEvents="none">{n.label}</text>
                      </motion.g>
                    </g>
                  );
                })}
              </motion.g>
              <line x1={CX + 32} y1={CY} x2={CX + R - 28} y2={CY} stroke="#ff5a1f" strokeWidth="1.5" strokeDasharray="3 4" />
              <g>
                <circle cx={CX} cy={CY} r="58" fill="#090909" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
                <circle cx={CX} cy={CY} r="46" fill="none" stroke="rgba(255,90,31,.5)" strokeWidth="1" />
                <path d={`M ${CX - 14} ${CY + 14} L ${CX + 14} ${CY - 14} M ${CX - 14} ${CY - 14} L ${CX + 14} ${CY + 14}`} stroke="#ff5a1f" strokeWidth="3" />
                <text x={CX} y={CY + 34} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,.5)" fontFamily="JetBrains Mono">{ORBIT_NODES[active].key.toUpperCase()}</text>
              </g>
            </svg>
          </div>
          <div>
            <div className="space-y-1 mb-8">
              {ORBIT_NODES.map((n, i) => (
                <button
                  key={n.key}
                  onClick={() => pick(i)}
                  onMouseEnter={() => pick(i)}
                  className={`ax-fill w-full text-left px-4 py-3 flex items-center gap-3 border-l-2 ${i === active ? "border-[#ff5a1f] text-[#fbfaf7]" : "border-white/10 text-white/50"}`}
                  data-active={i === active}
                  data-testid={`orbit-list-${n.key}`}
                >
                  <span className="font-mono-ax text-[10px]">{i + 1}</span>
                  <span className="font-bold text-[16px] tracking-tight">{n.label}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-white/15 pt-6 min-h-[120px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="text-white/70 text-[16px] leading-relaxed max-w-md"
                  data-testid="orbit-explanation"
                >
                  {ORBIT_NODES[active].copy}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
