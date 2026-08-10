import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, FillLink, Eyebrow } from "@/components/kit";
import { usePageMeta } from "@/lib/anim";
import SolutionsRotatingCube from "@/components/visuals/SolutionsRotatingCube";
import CognitiveCubeMatrix from "@/components/visuals/CognitiveCubeMatrix";
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

/* Four ways AlterX applies the Engine — not four equal flagship products.
   Source of truth for the solutions taxonomy: this file and the mega menu
   (content/navigation.js) share the same four names/destinations, and the
   same visual language (AlterXGeometry for cognitive/workflows, abstract
   marks for voice, adaptive-surface for websites) — nav is the abstract
   preview, this page is where it becomes concrete. No card background
   around the item; the image itself is the object. */

const ZONES = [
  {
    key: "cognitive",
    title: "Cognitive AI",
    kicker: "Inventory operations",
    copy: "Inventory operations powered by Alter Engine — product truth, stock attention and decisions in one connected view.",
    cta: "Explore Cognitive AI",
    to: "/cognitive-ai",
    render: (active) => <CognitiveCubeMatrix active={active} size="home" interactive={false} />,
  },
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
  usePageMeta("Solutions", "Different contexts, the same need for visible work — Cognitive AI, voice workflows, AI websites and custom workflows.");
  const [active, setActive] = useState(null);
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={["Different contexts.", "The same need for visible work."]}
        body="Apply AlterX to inventory operations, conversations, digital experiences or workflows shaped around the way your organisation already works."
      >
        <SolutionsHeroVisual />
      </PageHero>
      <section className="pb-28" style={{ background: "var(--marketing-light-medium)" }} data-testid="solutions-map">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-20">
            {ZONES.map((z) => {
              const on = active === z.key;
              return (
                <Link
                  key={z.key}
                  to={z.to}
                  onMouseEnter={() => setActive(z.key)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(z.key)}
                  onBlur={() => setActive(null)}
                  className="group block"
                  data-testid={`solutions-zone-${z.key}`}
                >
                  <div
                    className="relative overflow-clip transition-[background] duration-300"
                    style={{
                      height: 300,
                      background: `radial-gradient(circle at 58% 42%, rgba(249,115,22,${on ? ".16" : ".09"}), transparent 45%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-10">
                      {z.render(on)}
                    </div>
                  </div>
                  <div className="mt-6">
                    <Eyebrow className="mb-2.5 text-black/55">{z.kicker}</Eyebrow>
                    <h2 className="text-2xl md:text-[28px] font-semibold tracking-tight">{z.title}</h2>
                    <p className={`text-sm mt-2.5 max-w-md leading-relaxed transition-opacity duration-300 ${on ? "opacity-90" : "opacity-60"}`}>{z.copy}</p>
                    <span className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${on ? "text-[#ff4d0a]" : "text-[#c9360a]"}`}>
                      {z.cta} <ArrowRight size={14} className={`transition-transform duration-200 ${on ? "translate-x-1" : ""}`} aria-hidden="true" />
                    </span>
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
