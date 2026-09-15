import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePageMeta, Reveal, MaskLines } from "@/lib/anim";
import { Eyebrow } from "@/components/kit";
import HeroX from "@/components/home/HeroX";
import EngineStory from "@/components/home/EngineStory";
import AlterEngineAssembly from "@/components/visuals/AlterEngineAssembly";
import NetSegment from "@/components/home/NetworkThread";

/* Content reset — homepage cut to 7 sections. Every deeper explanation
   (security detail, work samples, resources, voice demo, capability
   grids, company vision) now lives on its own page instead of on the
   homepage. See /axinventory, /security, /work, /resources, /company. */

const ProblemSection = () => (
  <section className="text-[#090909] py-24 md:py-32 relative" style={{ background: "#e8f7ee" }} data-testid="problem-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <div className="max-w-2xl">
        <Reveal><Eyebrow className="mb-6">The problem</Eyebrow></Reveal>
        <MaskLines as="h2" lines={["AI can do a task.", "Real work is harder."]} className="ax-display text-3xl md:text-[44px] mb-8" />
        <Reveal delay={0.1}>
          <p className="text-black/70 text-lg leading-relaxed">AI can write the message. Look something up. Create a quote. Update a system. The problem starts when all of those things have to happen together. One step goes wrong. The next step carries on. The result can still look completely fine.</p>
          <p className="mt-6 text-[19px] font-semibold text-[#123d27]">ALTERX is being built around that problem.</p>
        </Reveal>
      </div>
    </div>
  </section>
);

const AlterEngineSection = () => (
  <section className="text-[#fbfaf7] py-24 md:py-32 relative overflow-clip" style={{ background: "rgba(0,0,0,0.7)" }} data-testid="alter-engine-section">
    <NetSegment name="engine-intro" />
    <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 items-center">
      <div>
        <Reveal><Eyebrow dark className="mb-6">Alter Engine</Eyebrow></Reveal>
        <MaskLines as="h2" lines={["The engine underneath", "the work."]} className="ax-display text-3xl md:text-[44px] mb-6" />
        <Reveal delay={0.1}>
          <p className="text-white/70 text-lg leading-relaxed">Alter Engine turns an objective into executable work. It plans the process, runs it, checks the result and knows what to do when something fails.</p>
        </Reveal>
        <Reveal delay={0.18}>
          <Link to="/alter-engine" className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-[#9fffc0]">
            Explore Alter Engine <ArrowRight size={14} className="ax-arrow" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
      <Reveal delay={0.1}>
        <div className="w-full aspect-square max-w-[420px] mx-auto">
          <AlterEngineAssembly active interactive={false} size="tile" />
        </div>
      </Reveal>
    </div>
  </section>
);

const AxInventorySection = () => (
  <section className="py-24 md:py-32 relative" style={{ background: "#0d2117" }} data-testid="axinventory-home-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <Reveal><Eyebrow dark className="mb-6">AxInventory</Eyebrow></Reveal>
      <MaskLines as="h2" lines={["Built for real business."]} className="ax-display text-3xl md:text-[44px] text-[#e8f7ee] mb-6" />
      <Reveal delay={0.1}>
        <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-12">AxInventory brings inventory, point of sale, purchasing, GST and accounting into one system for Indian retail. Everything stays connected.</p>
      </Reveal>
      <Reveal delay={0.18}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-4 mb-12" data-testid="axinventory-home-sequence">
          {["Sell", "Track", "Buy", "Account", "Understand"].map((s, i, arr) => (
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

const WhyAlterXSection = () => (
  <section className="text-[#e8f7ee] py-24 md:py-32 relative" style={{ background: "#06120c" }} data-testid="why-alterx-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <div className="max-w-2xl">
        <Reveal><Eyebrow dark className="mb-6">Why ALTERX</Eyebrow></Reveal>
        <MaskLines as="h2" lines={["We care about what happens", "after the demo."]} className="ax-display text-3xl md:text-[44px] mb-8" />
        <Reveal delay={0.1}>
          <p className="text-white/70 text-lg leading-relaxed mb-4">It is easy to show AI doing something clever once. It is harder to trust it with work that matters. So we are building around the difficult part: what happens when something goes wrong. Can the system notice? Can the work continue? Can someone understand what happened?</p>
          <p className="text-[19px] font-semibold text-[#9fffc0] mt-6">That is where ALTERX is focused.</p>
        </Reveal>
      </div>
    </div>
  </section>
);

const FinalCTASection = () => (
  <section className="text-[#fbfaf7] py-28 md:py-40 text-center relative overflow-clip" style={{ background: "rgba(0,0,0,0.46)" }} data-testid="final-cta-section">
    <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-atmo-dark)" }} aria-hidden="true" />
    <NetSegment name="final-cta" />
    <div className="relative z-10 max-w-[760px] mx-auto px-6">
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
      <ProblemSection />
      <AlterEngineSection />
      <EngineStory />
      <AxInventorySection />
      <WhyAlterXSection />
      <FinalCTASection />
    </>
  );
}
