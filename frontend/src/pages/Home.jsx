import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { usePageMeta, Reveal } from "@/lib/anim";
import { ChapterHead, EditorialRow, Eyebrow, FillLink } from "@/components/kit";
import { ThreadPath } from "@/components/thread";
import HeroX from "@/components/home/HeroX";
import ProductPanels from "@/components/home/ProductPanels";
import EngineStory from "@/components/home/EngineStory";
import Runway from "@/components/home/Runway";
import Orbit from "@/components/home/Orbit";
import VoiceDemo from "@/components/home/VoiceDemo";
import { SECURITY_PRINCIPLES, WORK_ENTRIES, RESOURCES, COMPOSER_CHIPS } from "@/content/home";
import NetSegment from "@/components/home/NetworkThread";
import ScrollReveal from "@/components/ui/ScrollReveal";
import LetterGlitch from "@/components/ui/LetterGlitch";

const SecuritySection = () => (
  <section className="text-[#fbfaf7] relative overflow-clip isolate" style={{ background: "#000", minHeight: "88vh" }} data-testid="security-section">
    {/* full-bleed glitch field — the dominant visual across the whole section */}
    <div className="absolute inset-0 z-0">
      <LetterGlitch glitchSpeed={50} centerVignette={true} outerVignette={false} smooth={true} colors={["#ffffff", "#F97316", "#62686a"]} />
    </div>
    {/* text-safe veil — only enough to keep the copy readable, not a wall over the whole field */}
    <div
      className="absolute inset-0 pointer-events-none z-[1]"
      style={{ background: "linear-gradient(90deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.55) 42%, rgba(0,0,0,.12) 68%, rgba(0,0,0,.05) 100%)" }}
      aria-hidden="true"
    />
    <NetSegment name="security" />
    <div className="relative z-[2] max-w-[1400px] mx-auto px-6 md:px-10 py-28 md:py-44">
      <div className="max-w-xl relative security-readable">
        <ChapterHead num="06" eyebrow="Security" title="Control is built into the work." body="Approvals, permissions, workspace separation, evidence and clear ownership are part of the operating model, not an add-on." dark />
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mb-10">
          {SECURITY_PRINCIPLES.map((p) => (
            <div key={p.t} className="border-t border-white/15 pt-3">
              <p className="font-bold text-[15px]">{p.t}</p>
              <p className="text-[13px] text-white/55 mt-1">{p.d}</p>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-white/45 mb-8 max-w-md">AlterX is designed to support and enforce these controls. Formal audits and certifications will be published only when completed.</p>
        <FillLink to="/security" dark data-testid="security-section-cta">Explore security</FillLink>
      </div>
    </div>
  </section>
);

const WorkSection = () => (
  <section className="bg-[#fbfaf7] py-24 md:py-36 cv-auto relative" data-testid="work-section">
    <NetSegment name="work" />
    <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
      <ChapterHead num="07" eyebrow="Selected work" title="Real work. Carefully built." body="AlterX builds practical systems around real business needs, from intelligent digital experiences to connected inventory and operational software." />
      <div className="border-b border-black/15">
        {WORK_ENTRIES.map((w, i) => (
          <Reveal key={w.slug} delay={i * 0.06}>
            <Link to={`/work/${w.slug}`} className="ax-fill group grid md:grid-cols-[200px_1fr_auto] items-center gap-4 md:gap-8 py-8 px-4 md:px-6 border-t border-black/15 text-[#090909]" data-testid={`work-row-${w.slug}`}>
              <span className="ax-eyebrow opacity-60 hidden md:block">{w.category}</span>
              <span className="min-w-0">
                <span className="block text-xl md:text-[26px] font-semibold tracking-tight leading-snug">{w.title}</span>
                <span className="block text-sm opacity-65 mt-1.5 max-w-2xl">{w.description}</span>
                <span className="inline-flex items-center gap-2 text-[12px] font-medium mt-3 opacity-60">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d0a] inline-block" aria-hidden="true" />{w.label}
                </span>
              </span>
              <ArrowUpRight size={22} className="ax-arrow shrink-0" aria-hidden="true" />
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const ResourcesSection = () => (
  <section className="py-24 md:py-36 cv-auto relative" style={{ background: "rgba(243,240,233,0.67)" }} data-testid="resources-section">
    <NetSegment name="resources" />
    <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
      <ChapterHead num="08" eyebrow="Resources" title="The system behind visible work." body="Built for operations leaders, transformation teams and enterprise decision-makers working on tasks that cross systems, need real decisions, need visible progress and can't fail silently." />
      <div className="border-b border-black/15">
        {RESOURCES.slice(0, 5).map((r, i) => (
          <EditorialRow key={r.slug} to={`/resources/${r.slug}`} index={i} kicker={r.type} title={r.title} desc={r.value} />
        ))}
      </div>
      <div className="mt-10">
        <FillLink to="/resources" data-testid="resources-all-cta">All resources</FillLink>
      </div>
    </div>
  </section>
);

const Composer = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const go = (value) => {
    const v = (value || text).trim();
    if (!v) return;
    navigate(`/try-alter-engine/new?objective=${encodeURIComponent(v)}`);
  };
  return (
    <section className="text-[#fbfaf7] py-28 md:py-40 relative overflow-clip" style={{ background: "rgba(0,0,0,0.46)" }} data-testid="composer-section">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-atmo-dark)" }} aria-hidden="true" />
      <NetSegment name="composer" />
      <div className="relative z-10 max-w-[900px] mx-auto px-6 md:px-10 text-center">
        <Eyebrow dark className="justify-center mb-6">Start here</Eyebrow>
        <ScrollReveal baseOpacity={0} enableBlur baseRotation={1.5} blurStrength={4}>
          <h2 className="ax-display text-3xl sm:text-4xl lg:text-[56px]">What should AlterX organize first?</h2>
        </ScrollReveal>
        <p className="mt-5 text-white/60 max-w-xl mx-auto">Describe one business outcome. Start with the result, not the software — the goal is work that's easier to carry out without becoming harder to understand or control.</p>
        <form
          onSubmit={(e) => { e.preventDefault(); go(); }}
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
        >
          <label htmlFor="home-composer" className="sr-only">Describe the outcome you need</label>
          <input
            id="home-composer"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe the outcome you need..."
            className="flex-1 bg-[#090909] border border-white/20 px-5 py-4 text-[15px] text-white placeholder:text-white/35 focus:border-[#ff4d0a] focus:outline-none"
            data-testid="composer-input"
          />
          <button type="submit" className="btn-primary justify-center" data-testid="composer-submit">
            Open in Alter Engine <ArrowRight size={15} className="ax-arrow" aria-hidden="true" />
          </button>
        </form>
        <svg className="max-w-2xl mx-auto w-full h-3 -mt-1" viewBox="0 0 600 12" preserveAspectRatio="none" aria-hidden="true">
          <ThreadPath d="M0 6 L600 6" strokeWidth={2} duration={1.1} />
        </svg>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {COMPOSER_CHIPS.map((c) => (
            <button key={c} onClick={() => go(c)} className="ax-fill text-[13px] font-semibold text-white/60 border border-white/15 px-4 py-2" data-testid={`composer-chip-${COMPOSER_CHIPS.indexOf(c)}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  usePageMeta(null, "AlterX builds Alter Engine — turn an outcome into planned, approved, visible and checked work.");
  return (
    <>
      <HeroX />
      <ProductPanels />
      <EngineStory />
      <Runway />
      <Orbit />
      <VoiceDemo />
      <SecuritySection />
      <WorkSection />
      <ResourcesSection />
      <Composer />
    </>
  );
}
