import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { usePageMeta, Reveal, MaskLines } from "@/lib/anim";
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

/* "What ALTERX is" — immediately after the hero, before any product
   detail. The six-stage progression is one connected visual sequence,
   not six cards. */
const UNDERSTAND_STAGES = ["Understand", "Plan", "Assemble", "Execute", "Verify", "Recover"];

const WhatAlterXIsSection = () => (
  <section className="text-[#e8f7ee] py-24 md:py-32 relative" style={{ background: "#020806" }} data-testid="what-alterx-is-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <div className="max-w-2xl">
        <Reveal><Eyebrow dark className="mb-6">What ALTERX is</Eyebrow></Reveal>
        <MaskLines as="h2" lines={["Not another AI assistant."]} className="ax-display text-3xl md:text-[44px] mb-8" />
        <Reveal delay={0.1}>
          <p className="text-white/70 text-lg leading-relaxed mb-4">ALTERX is being built as an execution system. You give it an objective. It works out what needs to happen, assembles the workflow, runs it, checks the result and responds when something goes wrong.</p>
          <p className="text-white/70 text-lg leading-relaxed">The important part is not simply getting an AI model to perform a task. The important part is everything around that task. State. Verification. Recovery. Human approval. External systems. Cost. Continuity.</p>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <div className="mt-16 flex flex-wrap items-center gap-x-2 gap-y-4" data-testid="what-alterx-is-sequence">
          {UNDERSTAND_STAGES.map((s, i) => (
            <React.Fragment key={s}>
              <span className="text-sm md:text-base font-semibold tracking-tight text-[#9fffc0]">{s}</span>
              {i < UNDERSTAND_STAGES.length - 1 && <span className="w-6 md:w-10 h-px bg-white/20" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* "The hard part" — the problem section. Plain narrative, emotionally
   legible without prior AI-systems knowledge. */
const ProblemSection = () => (
  <section className="text-[#090909] py-24 md:py-32 relative" style={{ background: "#e8f7ee" }} data-testid="problem-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <div className="max-w-2xl">
        <Reveal><Eyebrow className="mb-6">The problem</Eyebrow></Reveal>
        <MaskLines as="h2" lines={["The hard part isn't getting AI", "to do something once."]} className="ax-display text-3xl md:text-[44px] mb-5" />
        <Reveal delay={0.1}>
          <p className="text-black/60 text-lg mb-10">The hard part is trusting it with something that matters.</p>
        </Reveal>
      </div>
      <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 max-w-4xl">
        <Reveal delay={0.15}>
          <p className="text-black/70 leading-relaxed">A customer message comes in. Someone needs to understand it, check company data, check availability, prepare the quote, update the system, send the response, trigger whatever happens next.</p>
          <p className="text-black/70 leading-relaxed mt-4">AI can participate in every part of that process.</p>
        </Reveal>
        <Reveal delay={0.22}>
          <p className="text-black/70 leading-relaxed">The difficult part begins when one step goes wrong. A model misunderstands something. An API times out. A system returns bad data. The next step continues using incorrect information.</p>
          <p className="text-black/70 leading-relaxed mt-4">The result still looks convincing. Nobody notices.</p>
        </Reveal>
      </div>
      <Reveal delay={0.3}>
        <p className="mt-10 text-[19px] font-semibold text-[#123d27] max-w-2xl">That is the problem ALTERX is being built to solve.</p>
      </Reveal>
    </div>
  </section>
);

const SecuritySection = () => (
  <section className="text-[#fbfaf7] relative overflow-clip isolate" style={{ background: "#000", minHeight: "88vh" }} data-testid="security-section">
    {/* full-bleed glitch field — the dominant visual across the whole section */}
    <div className="absolute inset-0 z-0">
      <LetterGlitch glitchSpeed={50} centerVignette={true} outerVignette={false} smooth={true} colors={["#ffffff", "#5BEA99", "#62686a"]} />
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
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5BEA99] inline-block" aria-hidden="true" />{w.label}
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

/* Product ecosystem — one engine, one real product built on the same
   engineering discipline. */
const ProductEcosystemSection = () => (
  <section className="py-24 md:py-32 relative" style={{ background: "#0d2117" }} data-testid="product-ecosystem-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <Reveal><Eyebrow dark className="mb-6">Product ecosystem</Eyebrow></Reveal>
      <MaskLines as="h2" lines={["One engine.", "Different kinds of work."]} className="ax-display text-3xl md:text-[44px] text-[#e8f7ee] mb-14" />
      <div className="grid md:grid-cols-2 gap-10">
        <Reveal delay={0.05}>
          <Link to="/alter-engine" className="block border-t border-[#9fffc0]/15 pt-6 group" data-testid="ecosystem-alter-engine">
            <Eyebrow dark className="mb-3">Alter Engine</Eyebrow>
            <h3 className="text-2xl font-bold tracking-tight text-[#e8f7ee] mb-3">The execution layer.</h3>
            <p className="text-white/60 leading-relaxed mb-4">It plans, runs, checks and recovers.</p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#9fffc0]">Explore Alter Engine <ArrowRight size={14} className="ax-arrow" aria-hidden="true" /></span>
          </Link>
        </Reveal>
        <Reveal delay={0.12}>
          <Link to="/axinventory" className="block border-t border-[#9fffc0]/15 pt-6 group" data-testid="ecosystem-axinventory">
            <Eyebrow dark className="mb-3">AxInventory</Eyebrow>
            <h3 className="text-2xl font-bold tracking-tight text-[#e8f7ee] mb-3">A real business product built by the same team.</h3>
            <p className="text-white/60 leading-relaxed mb-4">Inventory, POS, purchasing, GST and accounting for Indian retail — a real application of the engineering mindset behind AlterX.</p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#9fffc0]">Explore AxInventory <ArrowRight size={14} className="ax-arrow" aria-hidden="true" /></span>
          </Link>
        </Reveal>
      </div>
    </div>
  </section>
);

/* "Why ALTERX" — the company's belief, quiet and direct, not a manifesto. */
const WhyAlterXSection = () => (
  <section className="text-[#e8f7ee] py-24 md:py-32 relative" style={{ background: "#06120c" }} data-testid="why-alterx-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <div className="max-w-2xl">
        <Reveal><Eyebrow dark className="mb-6">Why ALTERX</Eyebrow></Reveal>
        <MaskLines as="h2" lines={["We care about what happens", "after the demo."]} className="ax-display text-3xl md:text-[44px] mb-8" />
        <Reveal delay={0.1}>
          <p className="text-white/70 text-lg leading-relaxed mb-4">It is easy to show an AI system doing something clever once. It is much harder to hand it a business process and leave it alone.</p>
          <p className="text-white/70 text-lg leading-relaxed mb-4">The gap is not simply model intelligence. It is everything around the model. State. Verification. Recovery. Isolation. Cost. Human judgement. Continuity.</p>
          <p className="text-[19px] font-semibold text-[#9fffc0] mt-8">We think software should be honest about what it did.</p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* Vision — future tense, no invented milestones or years. */
const VisionSection = () => (
  <section className="text-[#090909] py-24 md:py-32 relative" style={{ background: "#d8ffe7" }} data-testid="vision-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <div className="max-w-2xl">
        <Reveal><Eyebrow className="mb-6">Vision</Eyebrow></Reveal>
        <MaskLines as="h2" lines={["Where this goes next."]} className="ax-display text-3xl md:text-[44px] mb-6" />
        <Reveal delay={0.1}>
          <p className="text-black/70 text-lg leading-relaxed mb-4">A business should be able to describe an outcome and trust that the system can work toward it reliably.</p>
          <p className="text-black/70 text-lg leading-relaxed">ALTERX is currently building deterministic execution. The direction is toward systems that can improve their judgement using verified outcomes, while keeping those changes controlled and reversible.</p>
        </Reveal>
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
            className="flex-1 bg-[#090909] border border-white/20 px-5 py-4 text-[15px] text-white placeholder:text-white/35 focus:border-[#5BEA99] focus:outline-none"
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
      <WhatAlterXIsSection />
      <ProblemSection />
      <ProductPanels />
      <EngineStory />
      <Runway />
      <Orbit />
      <VoiceDemo />
      <SecuritySection />
      <WorkSection />
      <ResourcesSection />
      <ProductEcosystemSection />
      <WhyAlterXSection />
      <VisionSection />
      <Composer />
    </>
  );
}
