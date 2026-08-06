import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PRODUCT_PANELS } from "@/content/home";
import { PANEL_ICONS } from "@/components/home/icons";
import { ChapterHead } from "@/components/kit";
import { Reveal } from "@/lib/anim";

export default function ProductPanels() {
  return (
    <section className="bg-[#fbfaf7] py-24 md:py-36 relative" data-testid="products-section">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-atmo-light)" }} aria-hidden="true" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        <ChapterHead
          num="01"
          eyebrow="Products and solutions"
          title={["One Engine.", "Four ways to put it to work."]}
          body="Alter Engine is the foundation. Use it directly, apply it to inventory operations, shape it around an enterprise process or bring it into an existing product."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-black/15">
          {PRODUCT_PANELS.map((p, i) => {
            const Icon = PANEL_ICONS[p.key];
            return (
              <Reveal key={p.key} delay={i * 0.08}>
                <Link
                  to={p.to}
                  className="ax-panel group block bg-[#f3f0e9] hover:bg-black focus-visible:bg-black border-r border-b border-black/15 p-7 h-[460px] flex flex-col text-[#090909] hover:text-[#fbfaf7] focus-visible:text-[#fbfaf7] transition-colors duration-300"
                  data-testid={`product-panel-${p.key}`}
                >
                  <div className="ax-icon-stage h-[190px] flex items-center justify-center overflow-hidden mb-6" aria-hidden="true">
                    <div className="w-[68%] h-[80%]"><Icon /></div>
                  </div>
                  <span className="ax-eyebrow opacity-55 text-[11px]">{p.category}</span>
                  <h3 className="text-2xl font-bold tracking-tight mt-2">{p.title}</h3>
                  <div className="ax-panel-reveal mt-3 flex-1 flex flex-col">
                    <p className="text-sm opacity-70 leading-relaxed">{p.description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#ff5a1f] pt-4">
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
