import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/kit";
import { DEV_SECTIONS } from "@/content/pages";
import { usePageMeta, Reveal } from "@/lib/anim";

export default function Developers() {
  usePageMeta("Developers", "Build approval-aware execution into a product or internal system with AlterX.");
  return (
    <>
      <PageHero
        eyebrow="Developers"
        title={["Build approval-aware execution", "into a product or system."]}
        body="Use AlterX to submit an objective, receive a visible plan, observe execution states, handle approval events and return a reviewable result."
        ctas={<Link to="/contact" className="btn-primary" data-testid="dev-hero-cta">Request developer access <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>}
      />
      <section className="bg-[#fbfaf7] pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#c9360a] border border-[#c9360a]/40 inline-block px-3 py-1.5 mb-14" data-testid="dev-managed-notice">
            Conceptual preview — API access is managed. No public SDK or endpoints are published yet.
          </p>
          <div className="space-y-16">
            {DEV_SECTIONS.map((s, i) => (
              <Reveal key={s.id}>
                <div id={s.id} className="grid lg:grid-cols-[340px_1fr] gap-8 border-t border-black/15 pt-10" data-testid={`dev-section-${s.id}`}>
                  <div>
                    <p className="text-[12px] font-medium text-[#c9360a] mb-2">{String(i + 1).padStart(2, "0")}</p>
                    <h2 className="text-2xl font-bold tracking-tight">{s.t}</h2>
                  </div>
                  <div>
                    <p className="text-[16px] text-black/70 max-w-2xl">{s.d}</p>
                    {s.code && (
                      <pre className="mt-6 bg-black text-white/85 p-6 overflow-x-auto text-[13px] font-mono-ax leading-relaxed border-l-2 border-[#ff4d0a]"><code>{s.code}</code></pre>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-20 border border-black/15 bg-black text-[#fbfaf7] p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Developer access</h2>
              <p className="text-white/60 mt-2 max-w-lg">API access is managed. Tell us what you are integrating and where approvals belong.</p>
            </div>
            <Link to="/contact" className="btn-primary shrink-0" data-testid="dev-final-cta">Request developer access <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
