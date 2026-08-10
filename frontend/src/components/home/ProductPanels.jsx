import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCT_PANELS } from "@/content/home";
import { PRODUCT_VISUALS } from "@/components/home/ProductVisuals";
import { ChapterHead } from "@/components/kit";
import { EASE } from "@/lib/anim";
import NetSegment from "@/components/home/NetworkThread";

/* Neutral tile surfaces — mixed, not four identical cards */
const SURFACES = {
  engine: "bg-[#141414] text-[#fbfaf7]",
  cognitive: "bg-[#f3f0e9] text-[#090909]",
  workflows: "bg-[#fbfaf7] text-[#090909]",
  build: "bg-[#1d1d1b] text-[#fbfaf7]",
};

/* One shared detail stage — content swaps with the active product */
const DETAILS = {
  engine: {
    statement: "Turn one objective into a visible path through the work.",
    description: "Turn one objective into a clear sequence of work. Review the plan, approve important actions and inspect the result.",
    points: [
      { t: "Plan", d: "See the work before it begins." },
      { t: "Approval", d: "Important decisions return to people." },
      { t: "Check", d: "Inspect the result and evidence." },
    ],
    cta: "Explore Alter Engine",
    to: "/alter-engine",
  },
  cognitive: {
    statement: "See what needs attention. Understand what should happen next.",
    description: "Bring product information, stock attention, location activity and inventory decisions into one operating view.",
    points: [
      { t: "Attention", d: "Surface what needs review." },
      { t: "Context", d: "See why it matters." },
      { t: "Decision", d: "Move the next action forward." },
    ],
    cta: "Explore Cognitive AI",
    to: "/cognitive-ai",
  },
  workflows: {
    statement: "Your process. Your systems. Your approval rules.",
    description: "Shape Alter Engine around your existing systems, permissions, handoffs and operating rules.",
    points: [
      { t: "Map", d: "Represent the actual process." },
      { t: "Authority", d: "Keep human decisions where required." },
      { t: "Systems", d: "Work through approved connections." },
    ],
    cta: "Discuss a workflow",
    to: "/contact",
  },
  build: {
    statement: "Bring approval-aware execution into your product.",
    description: "Bring planned, approval-aware Alter Engine workflows into an existing product or internal environment.",
    points: [
      { t: "Objective", d: "Submit the required outcome." },
      { t: "Execution", d: "Follow the workflow state." },
      { t: "Result", d: "Receive a reviewable result." },
    ],
    cta: "Explore developer access",
    to: "/developers",
  },
};

const DEFAULT_KEY = "engine";

export default function ProductPanels() {
  const [active, setActive] = useState(DEFAULT_KEY);
  const areaRef = useRef(null);
  const leaveTimer = useRef();

  const activate = (key) => {
    clearTimeout(leaveTimer.current);
    setActive(key);
  };

  const scheduleReset = () => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      const el = areaRef.current;
      if (el && el.contains(document.activeElement)) return; // keep active while focus is inside
      setActive(DEFAULT_KEY);
    }, 220);
  };

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const d = DETAILS[active];

  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-28 relative overflow-clip" style={{ background: "var(--marketing-light-medium)" }} data-testid="products-section">
      <NetSegment name="products" />
      {/* hero → products: Grainient eases in instead of cutting straight from opaque black */}
      <div
        className="absolute inset-x-0 top-0 h-[200px] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0.75) 22%, rgba(249,249,249,0.5) 64%, rgba(249,249,249,0) 100%)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-atmo-light)" }} aria-hidden="true" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <ChapterHead
          eyebrow="Products and solutions"
          title={["One Engine.", "Four ways to put it to work."]}
          body="Alter Engine is the foundation. Use it directly, apply it to inventory operations, shape it around an enterprise process or bring it into an existing product."
        />

        <div
          ref={areaRef}
          onMouseEnter={() => clearTimeout(leaveTimer.current)}
          onMouseLeave={scheduleReset}
          data-testid="products-interactive-area"
        >
          {/* ---------- product tile row ---------- */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/15 border border-black/15">
            {PRODUCT_PANELS.map((p) => {
              const Visual = PRODUCT_VISUALS[p.key];
              const isActive = active === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onMouseEnter={() => activate(p.key)}
                  onFocus={() => activate(p.key)}
                  onClick={() => activate(p.key)}
                  aria-pressed={isActive}
                  data-active={isActive}
                  className={`group relative h-[480px] flex flex-col text-left ${SURFACES[p.key]}`}
                  data-testid={`product-panel-${p.key}`}
                >
                  {/* visual stage — top ~68% */}
                  <div
                    className="productVisual relative flex items-center justify-center overflow-hidden transition-colors duration-200"
                    style={{ height: "68%", backgroundColor: isActive ? "#000000" : "transparent", color: isActive ? "#fbfaf7" : undefined }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                      <div
                        className="w-[54%] h-[54%] rounded-full transition-opacity duration-300"
                        style={{ opacity: isActive ? 0.55 : 0, background: "radial-gradient(circle, rgba(255,77,10,.4) 0%, rgba(255,77,10,0) 70%)" }}
                      />
                    </div>
                    <div className="relative w-[72%] h-[72%]">
                      <Visual active={isActive} />
                    </div>
                  </div>

                  {/* label — bottom ~32% */}
                  <div className="flex flex-col justify-center px-6" style={{ height: "32%" }}>
                    <span className="text-[11px] font-medium uppercase tracking-[0.16em] opacity-60">{p.category}</span>
                    <h3 className="text-[21px] md:text-[23px] font-semibold tracking-tight mt-1.5 leading-tight">{p.title}</h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ---------- one stable shared detail stage ---------- */}
          <div
            className="border border-t-0 border-black/15 bg-black text-[#fbfaf7] overflow-hidden"
            style={{ minHeight: 244 }}
            data-testid="product-detail-stage"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE } }}
                exit={{ opacity: 0, transition: { duration: 0.12, ease: EASE } }}
                className="grid md:grid-cols-[1.15fr_1fr_1fr] gap-8 md:gap-12 p-7 md:p-10 items-start"
                style={{ minHeight: 244 }}
              >
                {/* LEFT — active-product statement */}
                <div>
                  <span className="ax-eyebrow text-[#ff8a3d] flex items-center gap-3 mb-4">
                    <span className="inline-block w-6 h-[2px] bg-[#ff4d0a]" aria-hidden="true" />
                    {DETAILS[active] && PRODUCT_PANELS.find((p) => p.key === active)?.title}
                  </span>
                  <p className="text-[22px] md:text-[27px] font-semibold tracking-tight leading-snug max-w-[16ch]" data-testid="product-detail-statement">
                    {d.statement}
                  </p>
                </div>

                {/* CENTRE — description */}
                <div className="md:pt-9">
                  <p className="text-[15px] text-white/70 leading-relaxed" data-testid="product-detail-description">
                    {d.description}
                  </p>
                </div>

                {/* RIGHT — supporting points + CTA */}
                <div className="md:pt-9">
                  <dl className="space-y-3 mb-7">
                    {d.points.map((pt) => (
                      <div key={pt.t} className="flex gap-3 items-baseline">
                        <dt className="text-[13px] font-semibold text-[#ff8a3d] w-[86px] shrink-0">{pt.t}</dt>
                        <dd className="text-[13px] text-white/65">{pt.d}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    to={d.to}
                    className="ax-fill inline-flex items-center gap-2 font-semibold text-[14px] px-5 py-3 border border-white/25 text-[#fbfaf7]"
                    data-testid="product-detail-cta"
                  >
                    <span>{d.cta}</span>
                    <ArrowRight size={15} className="ax-arrow" aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
