import React from "react";
import { PageHero, FillLink, ChapterHead } from "@/components/kit";
import { PRICING_SHAPES, COST_FACTORS } from "@/content/pages";
import { usePageMeta, Reveal } from "@/lib/anim";
import { Check } from "lucide-react";

export default function Pricing() {
  usePageMeta("Pricing", "Start with one mission. Scale with the work. Three engagement shapes: Pilot, Team, Enterprise.");
  return (
    <>
      <PageHero dark eyebrow="Pricing" title={["Start with one mission.", "Scale with the work."]} body="AlterX engagements take three shapes. Public amounts are not listed — the shape of the work defines the shape of the cost." />
      <section className="bg-black text-[#fbfaf7] pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-3 border-t border-l border-white/15">
          {PRICING_SHAPES.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div className={`border-r border-b border-white/15 p-8 h-full ${i === 1 ? "bg-[#ff4d0a]/[.07]" : ""}`} data-testid={`pricing-shape-${p.name.toLowerCase()}`}>
                <p className="text-[12px] font-medium text-[#ff4d0a] uppercase tracking-wider mb-3">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="text-3xl font-bold tracking-tight">{p.name}</h2>
                <p className="text-white/60 mt-2 mb-7">{p.lead}</p>
                <ul className="space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-[14px] text-white/80">
                      <Check size={14} className="text-[#ff4d0a] mt-1 shrink-0" aria-hidden="true" /> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="bg-[#fbfaf7] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <ChapterHead num="02" eyebrow="What changes cost" title="Cost follows the work, not the seat count alone." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/15 border border-black/15">
            {COST_FACTORS.map((f) => (
              <div key={f.t} className="bg-[#fbfaf7] p-7">
                <p className="font-bold text-[17px]">{f.t}</p>
                <p className="text-[14px] text-black/60 mt-2">{f.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12"><FillLink to="/contact" data-testid="pricing-cta">Discuss pricing</FillLink></div>
        </div>
      </section>
    </>
  );
}
