import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PRODUCT_PANELS } from "@/content/home";
import { PANEL_ICONS } from "@/components/home/icons";
import { ChapterHead } from "@/components/kit";
import { Reveal } from "@/lib/anim";
import { GradientRibbon } from "@/components/thread";

/* Mixed surfaces — not four identical cards */
const SURFACES = {
  engine: "bg-[#141414] text-[#fbfaf7]",
  cognitive: "bg-[#f3f0e9] text-[#090909]",
  workflows: "bg-[#fbfaf7] text-[#090909]",
  build: "bg-[#1d1d1b] text-[#fbfaf7]",
};

export default function ProductPanels() {
  return (
    <section className="bg-[#fbfaf7] pt-28 pb-24 md:pt-36 md:pb-36 relative overflow-clip" data-testid="products-section">
      <GradientRibbon className="-top-24 left-0 w-full h-[380px]" opacity={0.5} id="axrb-products" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-atmo-light)" }} aria-hidden="true" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        <ChapterHead
          eyebrow="Products and solutions"
          title={["One Engine.", "Four ways to put it to work."]}
          body="Alter Engine is the foundation. Use it directly, apply it to inventory operations, shape it around an enterprise process or bring it into an existing product."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/15 border border-black/15">
          {PRODUCT_PANELS.map((p, i) => {
            const Icon = PANEL_ICONS[p.key];
            return (
              <Reveal key={p.key} delay={i * 0.07} className="h-full">
                <Link
                  to={p.to}
                  className={`ax-panel group h-[480px] flex flex-col p-7 ${SURFACES[p.key]} hover:!bg-black focus-visible:!bg-black hover:!text-[#fbfaf7] focus-visible:!text-[#fbfaf7]`}
                  data-testid={`product-panel-${p.key}`}
                >
                  <div className="ax-icon-stage h-[230px] flex items-center justify-center overflow-hidden mb-6" aria-hidden="true">
                    <div className="w-[86%] h-[92%]"><Icon /></div>
                  </div>
                  <span className="ax-eyebrow opacity-55 text-[11px]">{p.category}</span>
                  <h3 className="text-2xl font-semibold tracking-tight mt-2">{p.title}</h3>
                  <div className="ax-panel-reveal mt-3 flex-1 flex flex-col">
                    <p className="text-sm opacity-75 leading-relaxed">{p.description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#ff4d0a] pt-4">
                      {p.cta} <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
