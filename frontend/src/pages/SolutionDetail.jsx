import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { PageHero, FillLink, ChapterHead } from "@/components/kit";
import { SOLUTIONS } from "@/content/pages";
import { STAGES } from "@/content/home";
import { usePageMeta, Reveal } from "@/lib/anim";

export default function SolutionDetail() {
  const { slug } = useParams();
  const sol = SOLUTIONS.find((s) => s.slug === slug);
  usePageMeta(sol ? sol.title : "Solution", sol ? sol.lead : "");
  if (!sol) return <Navigate to="/solutions" replace />;
  return (
    <>
      <PageHero eyebrow="Solution" title={sol.title} body={sol.lead} />
      <section className="bg-[#fbfaf7] pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-px bg-black/15 border border-black/15 mb-20">
            <div className="bg-[#f3f0e9] p-8">
              <p className="ax-eyebrow text-black/50 mb-3 text-[10px]">The business condition</p>
              <p className="text-[16px] text-black/75">{sol.condition}</p>
            </div>
            <div className="bg-black text-[#fbfaf7] p-8">
              <p className="ax-eyebrow text-[#ff5a1f] mb-3 text-[10px]">The required outcome</p>
              <p className="text-[16px] text-white/85">{sol.outcome}</p>
            </div>
          </div>

          <ChapterHead num="02" eyebrow="The mission path" title="How the work moves." />
          <div className="grid md:grid-cols-4 gap-px bg-black/15 border border-black/15 mb-8">
            {sol.path.map((p, i) => (
              <Reveal key={p} delay={i * 0.06}>
                <div className="bg-[#fbfaf7] p-6 h-full relative" data-testid={`solution-path-${i}`}>
                  <p className="font-mono-ax text-[11px] text-[#bd3510] mb-2">{String(i + 1).padStart(2, "0")}</p>
                  <p className="font-bold text-[15px]">{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="h-1 bg-black/10 relative mb-20 overflow-hidden" aria-hidden="true">
            <Reveal className="absolute inset-y-0 left-0 w-full" y={0}>
              <div className="h-full" style={{ background: "var(--ax-grad-orange)" }} />
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-black/15 border border-black/15 mb-20">
            <div className="bg-[#fbfaf7] p-8">
              <p className="ax-eyebrow text-black/50 mb-4 text-[10px]">Systems involved</p>
              <ul className="space-y-2">
                {sol.systems.map((s) => <li key={s} className="text-[14px] font-semibold border-l-2 border-[#ff5a1f] pl-3">{s}</li>)}
              </ul>
            </div>
            <div className="bg-[#fbfaf7] p-8">
              <p className="ax-eyebrow text-black/50 mb-4 text-[10px]">The human decision point</p>
              <p className="text-[14px] text-black/70">{sol.decision}</p>
            </div>
            <div className="bg-[#fbfaf7] p-8">
              <p className="ax-eyebrow text-black/50 mb-4 text-[10px]">Result and evidence</p>
              <p className="text-[14px] text-black/70">The outcome returns checked against its criteria, with the decisions and artifacts that produced it. The lifecycle is always {STAGES.join(" · ")}.</p>
            </div>
          </div>

          <FillLink to="/contact" data-testid="solution-detail-cta">Discuss this outcome</FillLink>
        </div>
      </section>
    </>
  );
}
