import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ORBIT_NODES } from "@/content/home";
import { ChapterHead } from "@/components/kit";
import { EASE } from "@/lib/anim";
import NetSegment from "@/components/home/NetworkThread";
import OptionWheel from "@/components/ui/OptionWheel";
import WhyAlterParticleSculpture from "@/components/home/WhyAlterParticleSculpture";

const WHEEL_ITEMS = ORBIT_NODES.map((n) => n.label);

export default function Orbit() {
  const [active, setActive] = useState(0);

  return (
    <section className="text-[#fbfaf7] py-24 md:py-36 relative cv-auto overflow-clip" style={{ background: "rgba(0,0,0,0.66)" }} data-testid="orbit-section">
      <NetSegment name="orbit" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <ChapterHead
          num="04"
          eyebrow="Accountability"
          title="What keeps Alter Engine different."
          body="The work can move, but authority, progress and evidence do not disappear."
          dark
        />
        <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-center">
          <div className="flex items-center shrink-0 w-full lg:w-[300px]">
            <OptionWheel
              items={WHEEL_ITEMS}
              activeIndex={active}
              onSelect={setActive}
              textColor="rgba(249,249,249,.32)"
              activeColor="#f9f9f9"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center flex-1 min-w-0">
            {/* particle stage — compact black box, one persistent sculpture */}
            <motion.div
              className="relative shrink-0 rounded-[16px] border w-full md:w-[600px] h-[340px]"
              style={{ overflow: "clip", background: "#030303", borderColor: "rgba(255,255,255,.08)", boxShadow: "0 20px 50px rgba(0,0,0,.45)" }}
              initial={{ opacity: 0, scale: 0.985 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
              data-testid="why-alter-particle-stage"
            >
              <WhyAlterParticleSculpture activeIndex={active} />
            </motion.div>

            {/* editorial explanation — thin rule, no card/blur */}
            <div className="w-full md:flex-1 md:max-w-[280px]" aria-live="polite">
              <div className="border-t border-white/15 pt-4">
                {/* non-blocking crossfade — new copy is never gated behind
                    the old copy's exit finishing, so a selection can never
                    appear "stuck" on a previous principle */}
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.06, ease: EASE } }}
                    exit={{ opacity: 0, position: "absolute", transition: { duration: 0.16, ease: EASE } }}
                    data-testid="orbit-explanation"
                  >
                    <span className="block text-[#ff4d0a] text-[12px] font-semibold uppercase tracking-[0.14em] mb-2">
                      {String(active + 1).padStart(2, "0")} · {ORBIT_NODES[active].label}
                    </span>
                    <p className="text-white/70 text-[15px] leading-relaxed">{ORBIT_NODES[active].copy}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
