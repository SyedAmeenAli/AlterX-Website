import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePageMeta, Reveal, MaskLines } from "@/lib/anim";
import HeroX from "@/components/home/HeroX";
import EngineStory from "@/components/home/EngineStory";
import AlterXBlob from "@/components/home/AlterXBlob";

/* One continuous dark canvas from the hero to the final CTA — no chapter
   swaps to a bright fill colour, no eyebrow "section label" pill above
   every statement (Idea and Belief have no product name, so they get no
   label at all; Engine and AxInventory keep a plain small caps line
   because those ARE names, not pitch categories). A single soft green
   atmosphere spans Idea → Engine → AxInventory instead of each chapter
   getting its own background block, so the page reads as one experience
   scrolling past rather than a stack of slides. */

const IdeaSection = () => (
  <section className="text-[#fbfaf7] py-28 md:py-40 relative" style={{ background: "var(--alterx-bg)" }} data-testid="idea-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 max-w-2xl">
      <MaskLines as="h2" lines={["Doing one thing is easy."]} className="ax-display text-3xl md:text-[46px] mb-3 text-white/40" />
      <MaskLines as="p" lines={["Doing the whole job is different."]} className="ax-display text-3xl md:text-[46px] mb-14" />
      <Reveal delay={0.15}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-4 mb-10" data-testid="idea-sequence">
          {["Understand", "Decide", "Do", "Check", "Recover"].map((s, i, arr) => (
            <React.Fragment key={s}>
              <span className="text-sm md:text-base font-semibold tracking-tight text-[#9fffc0]">{s}</span>
              {i < arr.length - 1 && <span className="w-6 md:w-10 h-px bg-white/20" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.22}>
        <p className="text-white/55 text-lg">The hard part is keeping the whole process together.</p>
      </Reveal>
    </div>
  </section>
);

/* EngineStory carries its own heading and one-line context immediately
   below — this stays to a single small name label so the two don't read
   as two stacked slide headers. */
const EngineIntro = () => (
  <div className="pt-24 md:pt-32 relative" style={{ background: "var(--alterx-bg)" }} data-testid="engine-intro">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#9fffc0]">Alter Engine</p>
    </div>
  </div>
);

const EngineCTA = () => (
  <div className="text-center pb-28 md:pb-40 relative" style={{ background: "var(--alterx-bg)" }} data-testid="engine-cta">
    <Link to="/alter-engine" className="inline-flex items-center gap-2 text-sm font-semibold text-[#9fffc0]">
      Explore Alter Engine <ArrowRight size={14} className="ax-arrow" aria-hidden="true" />
    </Link>
  </div>
);

const AxInventorySection = () => (
  <section className="text-[#fbfaf7] pt-8 pb-28 md:pb-40 relative" style={{ background: "var(--alterx-bg)" }} data-testid="axinventory-home-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#9fffc0] mb-5">AxInventory</p>
      <MaskLines as="h2" lines={["The software your shop runs on."]} className="ax-display text-3xl md:text-[46px] mb-6 max-w-2xl" />
      <Reveal delay={0.1}>
        <p className="text-white/60 text-lg max-w-2xl mb-12">Inventory, point of sale, purchasing, GST and accounting in one system built for Indian retail.</p>
      </Reveal>
      <Reveal delay={0.18}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-4 mb-12" data-testid="axinventory-home-sequence">
          {["Sell", "Stock", "Payment", "GST", "Books"].map((s, i, arr) => (
            <React.Fragment key={s}>
              <span className="text-sm md:text-base font-semibold tracking-tight text-[#9fffc0]">{s}</span>
              {i < arr.length - 1 && <span className="w-6 md:w-10 h-px bg-white/20" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.24}>
        <Link to="/axinventory" className="inline-flex items-center gap-2 text-sm font-semibold text-[#9fffc0]">
          Explore AxInventory <ArrowRight size={14} className="ax-arrow" aria-hidden="true" />
        </Link>
      </Reveal>
    </div>
  </section>
);

const BeliefSection = () => (
  <section className="text-[#fbfaf7] py-28 md:py-40 relative" style={{ background: "var(--alterx-bg-soft)" }} data-testid="belief-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 max-w-2xl">
      <MaskLines as="h2" lines={["We care about what happens", "after the demo."]} className="ax-display text-3xl md:text-[46px] mb-8" />
      <Reveal delay={0.1}>
        <p className="text-white/55 text-lg leading-relaxed">It is easy to show AI doing something clever once. It is harder to trust it with work that matters. That is the part ALTERX is building around.</p>
      </Reveal>
    </div>
  </section>
);

const FinalCTASection = () => (
  <section className="text-[#fbfaf7] py-28 md:py-40 text-center relative overflow-clip" style={{ background: "var(--alterx-bg)" }} data-testid="final-cta-section">
    <div className="relative z-[1] max-w-[760px] mx-auto px-6">
      <MaskLines as="h2" lines={["Bring us something you", "wish you could automate."]} className="ax-display text-3xl md:text-[48px]" />
      <p className="mt-5 text-white/60 max-w-xl mx-auto">Tell us about the process. We'll show you where ALTERX fits.</p>
      <div className="mt-9 flex justify-center">
        <Link to="/contact" className="btn-primary" data-testid="final-cta-link">Talk to us <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
      </div>
    </div>
  </section>
);

export default function Home() {
  usePageMeta(null, "ALTERX builds systems that turn business objectives into work that runs, checks and recovers itself.");
  return (
    <>
      <HeroX />

      {/* Idea → Engine → AxInventory ride one continuous dark canvas and one
          shared atmosphere instead of each getting its own background
          block — the thing that made the previous pass read as slides. */}
      <div className="relative overflow-clip" style={{ background: "var(--alterx-bg)" }}>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[1400px] pointer-events-none opacity-[0.5]" aria-hidden="true">
          <AlterXBlob className="w-full h-full blur-[60px] opacity-30" />
        </div>
        <div className="relative z-[1]">
          <IdeaSection />
          <EngineIntro />
          <EngineStory />
          <EngineCTA />
          <AxInventorySection />
        </div>
      </div>

      <BeliefSection />
      <FinalCTASection />
    </>
  );
}
