import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RUNWAY_ROWS } from "@/content/home";
import { ChapterHead } from "@/components/kit";
import { EASE } from "@/lib/anim";
import NetSegment from "@/components/home/NetworkThread";

const Lane = ({ label, status, stop, active, engine }) => (
  <div className="min-w-0">
    <div className="flex items-baseline justify-between gap-2">
      <span className={`text-[11px] font-medium uppercase tracking-[0.14em] ${engine ? "text-[#c9360a]" : "text-black/40"}`}>{label}</span>
      <span className={`text-[13px] font-semibold truncate ${status === "Yes" ? (engine ? "text-[#c9360a]" : "text-black/75") : "text-black/55"}`}>{status}</span>
    </div>
    <div className="h-[3px] bg-black/10 mt-1.5 relative overflow-hidden">
      <div
        className="ax-runway-signal absolute left-0 top-0 h-full"
        style={{ width: active ? `${stop * 100}%` : "0%", background: engine ? "var(--ax-grad-orange)" : "rgba(9,9,9,.45)" }}
      />
    </div>
  </div>
);

export default function Runway() {
  const [active, setActive] = useState(null);
  return (
    <section className="py-24 md:py-36 relative cv-auto" style={{ background: "rgba(249,249,249,0.70)" }} data-testid="runway-section">
      <NetSegment name="runway" />
      <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none" style={{ background: "var(--ax-atmo-light)" }} aria-hidden="true" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <ChapterHead
          num="03"
          eyebrow="Capability runway"
          title="Different tools stop at different points."
          body="An assistant can suggest the work. An automation can repeat it. Alter Engine is designed to structure, follow and check it."
        />
        <div className="border-t border-black/15" role="list">
          {RUNWAY_ROWS.map((row, i) => {
            const isActive = active === i;
            return (
              <div
                key={row.cap}
                role="listitem"
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={`border-b border-black/15 px-4 md:px-6 transition-colors duration-300 cursor-default ${isActive ? "bg-[#f3f0e9]" : ""}`}
                data-testid={`runway-row-${i}`}
              >
                <div className={`grid md:grid-cols-[minmax(200px,1.2fr)_1fr_1fr_1fr] gap-x-8 gap-y-3 items-center transition-[padding] duration-300 ${isActive ? "py-6" : "py-5"}`}>
                  <p className="font-bold text-[16px] md:text-[17px] tracking-tight text-[#090909]">{row.cap}</p>
                  <Lane label="AI Assistant" status={row.a[0]} stop={row.a[1]} active={isActive} />
                  <Lane label="Fixed Automation" status={row.f[0]} stop={row.f[1]} active={isActive} />
                  <Lane label="Alter Engine" status={row.e[0]} stop={row.e[1]} active={isActive} engine />
                </div>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-[14px] text-black/60 max-w-3xl">{row.why}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
