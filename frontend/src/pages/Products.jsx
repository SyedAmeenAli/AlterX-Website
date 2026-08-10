import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, ChapterHead, EditorialRow } from "@/components/kit";
import { PRODUCT_PANELS, STAGES } from "@/content/home";
import { usePageMeta, Reveal } from "@/lib/anim";

export default function Products() {
  usePageMeta("Products", "Alter Engine is the foundation. Cognitive AI, custom workflows and developer access put it to work.");
  return (
    <>
      <PageHero
        eyebrow="Products"
        title={["One Engine.", "Four ways to put it to work."]}
        body="Alter Engine is the flagship execution product. The AlterX Platform is the interface through which people describe outcomes, review plans, approve actions, observe work and review results — not a competing product."
      />
      <section className="pb-24" style={{ background: "var(--marketing-light-medium)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="border-b border-black/15 mb-20">
            {PRODUCT_PANELS.map((p, i) => (
              <EditorialRow key={p.key} to={p.to} index={i} kicker={p.category} title={p.title} desc={p.description} />
            ))}
          </div>
          <ChapterHead num="02" eyebrow="Product lifecycle" title="Every product follows the same spine." body="Whatever the surface — Engine, Cognitive AI, a custom workflow or an integration — the work moves through the same five accountable stages." />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-black/15 border border-black/15">
            {STAGES.map((s, i) => (
              <Reveal key={s} delay={i * 0.06}>
                <div className="bg-[#f3f0e9] p-6 h-full" data-testid={`lifecycle-stage-${s.toLowerCase()}`}>
                  <p className="text-[12px] font-medium text-[#c9360a] mb-2">0{i + 1}</p>
                  <p className="text-lg font-bold tracking-tight">{s}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-14">
            <Link to="/try-alter-engine" className="btn-primary" data-testid="products-try-cta">Try Alter Engine <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
