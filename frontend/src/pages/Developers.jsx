import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/kit";
import { DEV_SECTIONS } from "@/content/pages";
import { usePageMeta, Reveal } from "@/lib/anim";
import CardSwap, { Card } from "@/components/ui/CardSwap";
import MorphSlider from "@/components/ui/MorphSlider";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ConceptualEventSurface from "@/components/developers/ConceptualEventSurface";
import BuildWithAlterXGrid from "@/components/visuals/BuildWithAlterXGrid";

/* Same continuously-shuffling identity as the homepage tile and mega-nav —
   a supporting hero visual, not a redesign of the page. */
const DevHeroVisual = () => (
  <div className="hidden lg:block absolute pointer-events-none" style={{ top: "50%", right: "6%", width: "300px", height: "300px", transform: "translateY(-50%)" }} aria-hidden="true" data-testid="dev-hero-visual">
    <BuildWithAlterXGrid active size="hero" />
  </div>
);

const FILE_NAMES = {
  architecture: "architecture.md",
  "mission-model": "mission.ts",
  states: "states.ts",
  approvals: "approval.ts",
  evidence: "result.ts",
  connectors: "connector.ts",
  auth: "permissions.ts",
};

/* ---------- MorphSlider scenes — DOM/SVG only, no imagery ---------- */
const ORANGE = "#ff4d0a";
const OBJECTIVE = "Prepare a decision-ready supplier comparison.";

const SceneFrame = ({ children }) => (
  <div className="w-full h-full rounded-[8px] border border-white/10 bg-[#070707] p-7 flex flex-col justify-center" aria-hidden="true">
    {children}
  </div>
);

const ObjectiveScene = () => (
  <SceneFrame>
    <span className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-3">Outcome</span>
    <p className="text-white/90 text-[18px] font-medium max-w-md mb-6" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{OBJECTIVE}</p>
    <div className="flex gap-3">
      {["Supplier profiles", "Current quotes", "Quality notes"].map((s) => (
        <div key={s} className="flex-1 h-14 rounded-[4px] border border-white/10 bg-white/[.03] px-3 py-2">
          <span className="block h-[2px] w-[70%] rounded-full bg-white/20 mb-1.5" />
          <span className="block h-[2px] w-[50%] rounded-full bg-white/12" />
        </div>
      ))}
    </div>
    <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold" style={{ color: ORANGE }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: ORANGE }} /> Execution beginning
    </span>
  </SceneFrame>
);

const PlanScene = () => (
  <SceneFrame>
    <span className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-4">Plan</span>
    <div className="flex items-center gap-2 flex-wrap">
      {["Collect", "Normalize", "Compare", "Score", "Assemble"].map((step, i, arr) => (
        <React.Fragment key={step}>
          <span className="text-[13px] font-semibold text-white/85 border border-white/15 rounded-[4px] px-3 py-1.5">{step}</span>
          {i < arr.length - 1 && <span className="w-5 h-px" style={{ background: `${ORANGE}88` }} />}
        </React.Fragment>
      ))}
    </div>
    <p className="mt-6 text-[13px] text-white/45 max-w-sm">Objective stays attached at the top; each step carries its dependencies and expected output.</p>
  </SceneFrame>
);

const ApprovalScene = () => (
  <SceneFrame>
    <div className="flex items-center gap-2 mb-6">
      <span className="text-[13px] text-white/50">Route</span>
      <span className="flex-1 h-px bg-white/15" />
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: ORANGE }} />
      <span className="flex-1 h-px border-t border-dashed border-white/15" />
      <span className="text-[13px] text-white/30">Act</span>
    </div>
    <div className="rounded-[6px] border p-5 max-w-sm" style={{ borderColor: "rgba(233,173,79,0.4)" }}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#e9ad4f" }}>Human decision</span>
      <p className="text-white/95 text-[14px] font-semibold mt-2 mb-4">Approve comparison criteria?</p>
      <div className="flex gap-2">
        <span className="text-[12px] font-semibold px-3 py-1.5 rounded-[4px]" style={{ background: ORANGE, color: "#111" }}>Approve</span>
        <span className="text-[12px] font-medium px-3 py-1.5 rounded-[4px] border border-white/15 text-white/60">Review criteria</span>
      </div>
    </div>
  </SceneFrame>
);

const ResultScene = () => (
  <SceneFrame>
    <span className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-3">Supplier comparison</span>
    <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-2 text-[9px] uppercase tracking-[0.1em] text-white/35 mb-2">
      <span /><span>Commercial</span><span>Quality</span><span>Delivery</span>
    </div>
    {["A", "B", "C"].map((s) => (
      <div key={s} className="grid grid-cols-[60px_1fr_1fr_1fr] gap-2 items-center mb-1.5">
        <span className="text-[12px] font-semibold text-white/80">Supplier {s}</span>
        {[0.78, 0.62, 0.7].map((w, i) => (
          <div key={i} className="h-[5px] rounded-full bg-white/10 overflow-hidden">
            <span className="block h-full rounded-full" style={{ width: `${w * 100}%`, background: ORANGE }} />
          </div>
        ))}
      </div>
    ))}
    <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#69c7aa]">
      <Check size={12} aria-hidden="true" /> Ready to review
    </span>
  </SceneFrame>
);

const MORPH_ITEMS = [
  { id: "objective", caption: "Objective", render: () => <ObjectiveScene /> },
  { id: "plan", caption: "Plan", render: () => <PlanScene /> },
  { id: "approval", caption: "Approval", render: () => <ApprovalScene /> },
  { id: "result", caption: "Result", render: () => <ResultScene /> },
];

export default function Developers() {
  usePageMeta("Developers", "Build approval-aware execution into a product or internal system with AlterX.");
  const [activeFile, setActiveFile] = useState(0);
  const active = DEV_SECTIONS[activeFile];

  return (
    <>
      <PageHero
        eyebrow="Developers"
        title={["Build approval-aware execution", "into a product or system."]}
        body="Use AlterX to submit an objective, receive a visible plan, observe execution states, handle approval events and return a reviewable result."
        ctas={<Link to="/contact" className="btn-primary" data-testid="dev-hero-cta">Request developer access <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>}
      >
        <DevHeroVisual />
      </PageHero>

      <section className="pb-24" style={{ background: "var(--marketing-light-medium)" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#c9360a] border border-[#c9360a]/40 inline-block px-3 py-1.5 mb-14" data-testid="dev-managed-notice">
            Conceptual preview — API access is managed. No public SDK or endpoints are published yet.
          </p>

          {/* the shape of a mission — one AlterX scene per stage, no imagery */}
          <Reveal>
            <div className="mb-20 rounded-[10px] border border-black/15 bg-[#070707] p-4 md:p-6" style={{ height: 420 }} data-testid="dev-morph-slider">
              <MorphSlider items={MORPH_ITEMS} />
            </div>
          </Reveal>

          {/* conceptual developer files — CardSwap stack, driven by selection */}
          <div className="grid lg:grid-cols-[340px_1fr] gap-10 items-start mb-20">
            <div className="lg:sticky lg:top-[120px]">
              <div className="flex flex-col gap-1 mb-6">
                {DEV_SECTIONS.map((s, i) => (
                  <button
                    key={s.id}
                    id={s.id}
                    type="button"
                    onClick={() => setActiveFile(i)}
                    className="text-left px-3 py-2.5 rounded-[4px] border-l-2 transition-colors"
                    style={{ borderColor: activeFile === i ? ORANGE : "rgba(9,9,9,.1)" }}
                    data-active={activeFile === i}
                    data-testid={`dev-file-select-${s.id}`}
                  >
                    <span className="block text-[10px] font-mono-ax text-black/40">{FILE_NAMES[s.id]}</span>
                    <span className={`block text-[15px] font-semibold tracking-tight ${activeFile === i ? "text-[#090909]" : "text-black/55"}`}>{s.t}</span>
                  </button>
                ))}
              </div>
              <p className="text-[15px] text-black/70 max-w-sm" data-testid="dev-file-body">{active.d}</p>
            </div>

            {/* overflow-x-hidden clips the card-fan's rightmost cascade on narrow
                viewports (cardDistance offset can exceed a shrunk container) without
                touching the sticky sidebar sibling or the vertical fan effect */}
            <div className="flex justify-center py-6 min-w-0 overflow-x-hidden">
              <CardSwap
                activeIndex={activeFile}
                onActiveChange={setActiveFile}
                cardDistance={36}
                verticalDistance={38}
                delay={7000}
                pauseOnHover
                skewAmount={2}
                easing="linear"
                width={520}
                height={380}
              >
                {DEV_SECTIONS.map((s) => (
                  <Card key={s.id}>
                    <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <span className="font-mono-ax text-[12.5px] text-white/85">{FILE_NAMES[s.id]}</span>
                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35">Conceptual preview</span>
                    </header>
                    <div className="p-5 overflow-y-auto" style={{ maxHeight: "calc(100% - 46px)" }}>
                      <h3 className="text-[15px] font-semibold text-white/90 mb-2">{s.t}</h3>
                      {s.code ? (
                        <pre className="text-[12px] font-mono-ax leading-relaxed text-white/70 whitespace-pre-wrap"><code>{s.code}</code></pre>
                      ) : (
                        <p className="text-[13px] text-white/55 leading-relaxed">{s.d}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>

          <div className="mb-20 max-w-[640px]">
            <Reveal><ConceptualEventSurface /></Reveal>
          </div>

          <div className="mt-20 border border-black/15 bg-black text-[#fbfaf7] p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <ScrollReveal baseOpacity={0} enableBlur baseRotation={1.5} blurStrength={4}>
                <h2 className="text-2xl font-bold tracking-tight">Developer access</h2>
              </ScrollReveal>
              <p className="text-white/60 mt-2 max-w-lg">API access is managed. Tell us what you are integrating and where approvals belong.</p>
            </div>
            <Link to="/contact" className="btn-primary shrink-0" data-testid="dev-final-cta">Request developer access <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
