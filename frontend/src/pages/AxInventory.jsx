import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, Eyebrow } from "@/components/kit";
import { usePageMeta, Reveal, MaskLines } from "@/lib/anim";

/* AxInventory — a real product built by the AlterX team, operational and
   business-oriented rather than abstract/systems-oriented like the Alter
   Engine pages. Same green family, mint-forward instead of deep-emerald.

   Content discipline: only the six figures and the one-paragraph
   description the user explicitly confirmed are stated as fact here.
   Everything more granular that the original brief described (POS offline
   sync mechanics, specific GST document types, double-entry accounting
   behaviour, tenant isolation specifics, named roles, named integrations,
   named tech stack) was NOT independently confirmed — it was only present
   in the brief text itself — so none of it is asserted as fact on this
   page. Those sections are deferred until confirmed. */

const AREAS = [
  { t: "Point of sale", d: "Take sales at the till." },
  { t: "Inventory", d: "Know what is in stock and how that stock got there." },
  { t: "Purchasing", d: "Manage incoming stock and suppliers." },
  { t: "GST", d: "Handle Indian tax records as part of the system." },
  { t: "Accounting", d: "Keep real books underneath the operation." },
  { t: "Analytics", d: "Understand what happened across the business." },
];

const FIGURES = [
  { n: "49", l: "Database tables" },
  { n: "162", l: "API routes" },
  { n: "39", l: "Migrations" },
  { n: "19", l: "Scheduled jobs" },
  { n: "739", l: "Unit tests" },
  { n: "518", l: "Live verification checks" },
];

export default function AxInventory() {
  usePageMeta("AxInventory", "Inventory, POS, GST and accounting for Indian retail — a real product built by the AlterX team.");
  return (
    <>
      <PageHero
        eyebrow="AxInventory"
        title="The software your shop runs on."
        body="Inventory, point of sale, purchasing, GST and accounting in one system built for Indian retail. From the till to the books, every part of the business stays connected."
        ctas={
          <>
            <a href="#under-the-hood" className="btn-primary">Explore AxInventory <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></a>
            <Link to="/contact" className="btn-ghost-light">Talk to us</Link>
          </>
        }
      />

      <section className="py-24 md:py-32 relative" style={{ background: "#020806" }} data-testid="axinventory-areas">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal><Eyebrow dark className="mb-6">What it covers</Eyebrow></Reveal>
          <MaskLines as="h2" lines={["One system,", "the whole operation."]} className="ax-display text-3xl md:text-[44px] text-[#e8f7ee] mb-14" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {AREAS.map((a, i) => (
              <Reveal key={a.t} delay={i * 0.05}>
                <div className="border-t border-[#9fffc0]/15 pt-5">
                  <span className="text-[12px] font-semibold text-[#9fffc0]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-xl font-bold tracking-tight text-[#e8f7ee] mt-2 mb-2">{a.t}</h3>
                  <p className="text-white/55 leading-relaxed">{a.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="under-the-hood" className="py-24 md:py-32 relative" style={{ background: "#d8ffe7", scrollMarginTop: "calc(var(--header-height) + 24px)" }} data-testid="axinventory-under-the-hood">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal><Eyebrow className="mb-6">Under the hood</Eyebrow></Reveal>
          <MaskLines as="h2" lines={["Real engineering,", "not a pitch deck."]} className="ax-display text-3xl md:text-[44px] text-[#090909] mb-14" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12">
            {FIGURES.map((f, i) => (
              <Reveal key={f.l} delay={i * 0.04}>
                <div>
                  <div className="ax-display text-4xl md:text-5xl font-semibold text-[#123d27]">{f.n}</div>
                  <p className="text-black/60 text-sm mt-2">{f.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="text-[#fbfaf7] py-24 text-center relative overflow-clip" style={{ background: "#06120c" }} data-testid="axinventory-final-cta">
        <div className="relative z-[1] max-w-[760px] mx-auto px-6">
          <MaskLines as="h2" lines={["Bring us your operation."]} className="ax-display text-3xl md:text-[46px]" />
          <p className="mt-5 text-white/60 max-w-xl mx-auto">Tell us what your business runs on today and where AxInventory could take over.</p>
          <div className="mt-9 flex justify-center">
            <Link to="/contact" className="btn-primary" data-testid="axinventory-final-cta-link">Talk to us <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
