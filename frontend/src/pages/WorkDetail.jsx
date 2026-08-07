import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { PageHero, FillLink } from "@/components/kit";
import { WORK_ENTRIES } from "@/content/home";
import { usePageMeta, Reveal } from "@/lib/anim";

export default function WorkDetail() {
  const { slug } = useParams();
  const w = WORK_ENTRIES.find((e) => e.slug === slug);
  usePageMeta(w ? w.name : "Work", w ? w.description : "");
  if (!w) return <Navigate to="/work" replace />;
  return (
    <>
      <PageHero eyebrow={w.category} title={w.title} body={w.description}>
        <Reveal delay={0.3}>
          <span className="inline-block mt-8 text-[11px] font-medium uppercase tracking-[0.16em] border border-black/30 px-2.5 py-1 text-black/60" data-testid="work-detail-label">{w.label}</span>
        </Reveal>
      </PageHero>
      <section className="bg-[#fbfaf7] pb-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="border border-black/15 bg-black text-[#fbfaf7] p-10 md:p-14 mb-16 relative overflow-clip" aria-hidden="true">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-atmo-dark)" }} />
            <p className="relative ax-display text-[16vw] md:text-[9vw] leading-none opacity-90" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900 }}>
              {w.name}<span className="text-[#ff4d0a]">.</span>
            </p>
            <p className="relative text-[11px] font-medium uppercase tracking-widest text-white/40 mt-4">Editorial treatment — approved project imagery pending customer review</p>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-black/15 border border-black/15 mb-16">
            <div className="bg-[#f3f0e9] p-8">
              <p className="ax-eyebrow text-black/50 mb-3 text-[10px]">The business condition</p>
              <p className="text-[16px] text-black/75">{w.condition}</p>
            </div>
            <div className="bg-black text-[#fbfaf7] p-8">
              <p className="ax-eyebrow text-[#ff4d0a] mb-3 text-[10px]">The required outcome</p>
              <p className="text-[16px] text-white/85">{w.outcome}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-black/15 border border-black/15 mb-16">
            <div className="bg-[#fbfaf7] p-8 md:col-span-1">
              <p className="ax-eyebrow text-black/50 mb-4 text-[10px]">The mission path</p>
              <ol className="space-y-3">
                {w.path.map((p, i) => (
                  <li key={p} className="flex gap-3 text-[14px] font-semibold">
                    <span className="text-[11px] font-medium text-[#c9360a] pt-0.5">{String(i + 1).padStart(2, "0")}</span>{p}
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-[#fbfaf7] p-8">
              <p className="ax-eyebrow text-black/50 mb-4 text-[10px]">The systems involved</p>
              <ul className="space-y-2">{w.systems.map((s) => <li key={s} className="text-[14px] font-semibold border-l-2 border-[#ff4d0a] pl-3">{s}</li>)}</ul>
            </div>
            <div className="bg-[#fbfaf7] p-8">
              <p className="ax-eyebrow text-black/50 mb-4 text-[10px]">The human decision point</p>
              <p className="text-[14px] text-black/70">{w.decision}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <FillLink to="/work" data-testid="work-detail-back">All work</FillLink>
            <FillLink to="/contact" data-testid="work-detail-cta">Discuss a similar outcome</FillLink>
          </div>
        </div>
      </section>
    </>
  );
}
