import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, FillLink, Eyebrow } from "@/components/kit";
import { usePageMeta, Reveal, MaskLines } from "@/lib/anim";
import SolutionsRotatingCube from "@/components/visuals/SolutionsRotatingCube";
import CustomWorkflowStack from "@/components/visuals/CustomWorkflowStack";
import AIWebsiteAdaptiveGrid from "@/components/visuals/AIWebsiteAdaptiveGrid";
import VoiceAgentOrb from "@/components/visuals/VoiceAgentOrb";

/* Same parent Solutions identity as the mega-nav preview, floating
   directly in the hero — no container. */
const SolutionsHeroVisual = () => (
  <div className="hidden lg:block absolute pointer-events-auto" style={{ top: "50%", right: "8%", width: "340px", height: "340px", transform: "translateY(-50%)" }} aria-hidden="true" data-testid="solutions-hero-visual">
    <SolutionsRotatingCube size="hero" interactive />
  </div>
);

/* What kind of work ALTERX is built to hold — not an industry grid
   (Healthcare/Finance/Retail…), and not six cards. A typographic list,
   one line each, reads as a scope statement rather than a feature matrix.
   These aren't routed individually; they describe the shape of the work
   the three real solution pages below actually cover. */
const WORK_KINDS = [
  "Customer operations",
  "Sales",
  "Order coordination",
  "Documents",
  "Internal operations",
  "Software delivery",
];

/* The three real, routed solutions — full-width editorial rows instead
   of a boxed card grid. No card background; the visual itself is the
   object. */
const ZONES = [
  {
    key: "voice",
    title: "Voice workflows",
    kicker: "Conversational work",
    copy: "Turn a conversation into structured work while keeping important actions subject to human authority.",
    cta: "See voice workflows",
    to: "/solutions/voice-workflows",
    render: (active) => <VoiceAgentOrb active={active} size="nav" />,
  },
  {
    key: "websites",
    title: "AI websites",
    kicker: "Digital experiences",
    copy: "Digital experiences where AI can understand intent, work with context and help move the user toward an outcome.",
    cta: "Explore AI websites",
    to: "/solutions/ai-websites",
    render: (active) => <AIWebsiteAdaptiveGrid active={active} size="nav" />,
  },
  {
    key: "workflows",
    title: "Custom workflows",
    kicker: "Enterprise operations",
    copy: "Controlled workflows built around your existing systems, permissions, processes and approval points.",
    cta: "Discuss a workflow",
    to: "/solutions/custom-workflows",
    render: (active) => <CustomWorkflowStack active={active} size="tile" />,
  },
];

export default function Solutions() {
  usePageMeta("Solutions", "The kinds of work ALTERX is built to hold — voice workflows, AI websites and custom workflows.");
  const [active, setActive] = useState(null);
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={["Different contexts.", "The same need for visible work."]}
        body="Apply AlterX to conversations, digital experiences or workflows shaped around the way your organisation already works."
      >
        <SolutionsHeroVisual />
      </PageHero>

      {/* THE SHAPE OF THE WORK — typography, not cards */}
      <section className="py-20 md:py-28 relative" style={{ background: "var(--marketing-light-medium)" }} data-testid="solutions-work-kinds">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal><Eyebrow className="mb-8 text-black/55">Kinds of work</Eyebrow></Reveal>
          <div className="border-t border-black/15">
            {WORK_KINDS.map((w, i) => (
              <Reveal key={w} delay={i * 0.04}>
                <div className="flex items-baseline gap-6 py-5 border-b border-black/15">
                  <span className="text-[12px] font-semibold text-black/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ax-display text-2xl md:text-[34px] tracking-tight">{w}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE THREE REAL SOLUTIONS — full-width rows, no boxed grid */}
      <section className="pb-28" style={{ background: "var(--marketing-light-medium)" }} data-testid="solutions-map">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="border-t border-black/15">
            {ZONES.map((z, i) => {
              const on = active === z.key;
              return (
                <Link
                  key={z.key}
                  to={z.to}
                  onMouseEnter={() => setActive(z.key)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(z.key)}
                  onBlur={() => setActive(null)}
                  className="group grid md:grid-cols-[1fr_260px] items-center gap-8 py-12 border-b border-black/15"
                  data-testid={`solutions-zone-${z.key}`}
                >
                  <div>
                    <Eyebrow className="mb-3 text-black/55">{z.kicker}</Eyebrow>
                    <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight">{z.title}</h2>
                    <p className={`text-[15px] mt-3 max-w-md leading-relaxed transition-opacity duration-300 ${on ? "opacity-90" : "opacity-60"}`}>{z.copy}</p>
                    <span className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${on ? "text-[#5BEA99]" : "text-[#123D27]"}`}>
                      {z.cta} <ArrowRight size={14} className={`transition-transform duration-200 ${on ? "translate-x-1" : ""}`} aria-hidden="true" />
                    </span>
                  </div>
                  <div
                    className="relative overflow-clip transition-[background] duration-300 h-[180px]"
                    style={{ background: `radial-gradient(circle at 58% 42%, rgba(91,234,153,${on ? ".16" : ".09"}), transparent 45%)` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      {z.render(on)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-16"><FillLink to="/contact" data-testid="solutions-cta">Discuss a workflow</FillLink></div>
        </div>
      </section>
    </>
  );
}
