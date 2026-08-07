import React from "react";
import { PageHero, ChapterHead, FillLink } from "@/components/kit";
import { PRINCIPLES } from "@/content/pages";
import { usePageMeta, Reveal } from "@/lib/anim";

const ANCHORS = [
  { t: "Mission", d: "Governed AI built for practical business impact." },
  { t: "Focus", d: "Measurable, repeatable outcomes." },
  { t: "Promise", d: "Important decisions remain visible." },
];

export default function Company() {
  usePageMeta("Company", "AlterX exists to turn objectives into outcomes — orchestration, intelligence and governance keeping important work visible and reviewable.");
  return (
    <>
      <PageHero
        dark
        eyebrow="About AlterX"
        title={["We build AI systems with", "control, clarity and proof."]}
        body="AlterX exists to turn objectives into outcomes. We combine orchestration, intelligence and governance to build systems that keep important work visible and reviewable."
      />
      <section className="bg-black text-[#fbfaf7] pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-3 border border-white/15 mb-28">
            {ANCHORS.map((a, i) => (
              <div key={a.t} className={`p-8 ${i < 2 ? "md:border-r border-white/15" : ""} ${i < 2 ? "border-b md:border-b-0" : ""}`}>
                <p className="text-[12px] font-medium text-[#ff4d0a] uppercase tracking-wider mb-3">{a.t}</p>
                <p className="text-xl font-bold tracking-tight">{a.d}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-16 items-start" id="principles">
            <div>
              <ChapterHead num="02" eyebrow="Principles" title="How we decide what to build." dark />
              <div className="border-b border-white/15">
                {PRINCIPLES.map((p, i) => (
                  <Reveal key={p.t} delay={i * 0.05}>
                    <div className="grid md:grid-cols-[70px_260px_1fr] gap-4 py-7 border-t border-white/15" data-testid={`principle-${i}`}>
                      <span className="text-[12px] font-medium text-white/40">{String(i + 1).padStart(2, "0")}</span>
                      <p className="text-xl font-bold tracking-tight">{p.t}</p>
                      <p className="text-[15px] text-white/60">{p.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal delay={0.2}>
              <div className="border border-white/15 bg-[#090909] p-7 sticky top-[110px]" aria-hidden="true">
                <div className="flex items-center justify-between mb-8">
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900 }} className="text-2xl">ALTER<span className="text-[#ff4d0a]">X</span></span>
                  <span className="text-[11px] font-medium text-white/40">EST. HYDERABAD</span>
                </div>
                <div className="h-[2px] bg-[#ff4d0a] w-14 mb-8" />
                <p className="text-[12px] font-medium text-white/45 leading-loose">
                  OUTCOME → PLAN<br />PLAN → APPROVAL<br />APPROVAL → ACTION<br />ACTION → CHECK<br />CHECK → EVIDENCE
                </p>
                <div className="mt-8 pt-6 border-t border-white/12">
                  <p className="text-[13px] text-white/55">From intent to completed, reviewable work.</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-24"><FillLink to="/work" dark data-testid="company-work-cta">See the work</FillLink></div>
        </div>
      </section>
    </>
  );
}
