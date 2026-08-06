import React from "react";
import { PageHero, EditorialRow, FillLink } from "@/components/kit";
import { SOLUTIONS } from "@/content/pages";
import { usePageMeta } from "@/lib/anim";

export default function Solutions() {
  usePageMeta("Solutions", "AlterX designs practical systems around the required outcome, existing systems, decision points and evidence.");
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={["Solutions for work that", "does not fit in one tool."]}
        body="AlterX designs practical systems around the required outcome, existing systems, decision points and evidence."
      />
      <section className="bg-[#fbfaf7] pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="border-b border-black/15">
            {SOLUTIONS.map((s, i) => (
              <EditorialRow key={s.slug} to={`/solutions/${s.slug}`} index={i} kicker="Solution" title={s.title} desc={s.lead} />
            ))}
          </div>
          <div className="mt-12"><FillLink to="/contact" data-testid="solutions-cta">Discuss a workflow</FillLink></div>
        </div>
      </section>
    </>
  );
}
