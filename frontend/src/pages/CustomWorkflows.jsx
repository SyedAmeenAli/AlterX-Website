import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/kit";
import { ThreadPath } from "@/components/thread";
import { usePageMeta, Reveal, MaskLines } from "@/lib/anim";
import WorkflowSetup from "@/components/custom-workflows/WorkflowSetup";
import CustomWorkflowStack from "@/components/visuals/CustomWorkflowStack";

/* Floating directly in the hero — no card, no background box, no border.
   Self-hovers to react (layer separation + glow). */
const CustomWorkflowsHeroVisual = () => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className="hidden lg:block absolute pointer-events-auto"
      style={{ top: "62%", right: "7%", width: "380px", height: "460px", transform: "translateY(-50%) rotate(-1deg)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid="cw-hero-visual"
    >
      <CustomWorkflowStack active={hovered} size="hero" showLabels />
    </div>
  );
};

/* The page itself is a workflow — one execution thread travels top to bottom. */

const CHAPTERS = [
  { key: "process", side: "left", eyebrow: "Existing process", h: "Start from the work your team already performs.", d: "Handoffs, systems, decision points and exceptions are mapped as they actually happen — not as a diagram wishes they happened." },
  { key: "outcome", side: "right", eyebrow: "Required outcome", h: "Define what must be true at the end.", d: "The workflow is anchored to a result and its success criteria, so every step answers to the same objective." },
  { key: "systems", side: "left", eyebrow: "Systems involved", h: "Connect the systems with explicit scope.", d: "Each connection carries the permissions it was granted — nothing more. Steps run only inside that scope." },
  { key: "authority", side: "right", eyebrow: "Human authority", h: "The route stops where judgment belongs.", d: "Approval points are designed into the workflow. Sensitive actions wait for the person with authority — with the action, reason, scope and risk in front of them.", gate: true },
  { key: "run", side: "left", eyebrow: "Run and observe", h: "Approved work moves. Progress stays visible.", d: "Running, waiting and completed steps remain observable while the workflow moves through its route." },
  { key: "recover", side: "right", eyebrow: "Checking and recovery", h: "Weak or failed steps get a visible next action.", d: "Failures are classified and routed — retry, alternate route, clarification or stop. Results are checked before they are accepted.", branch: true },
  { key: "evidence", side: "left", eyebrow: "Evidence", h: "The result keeps the decisions behind it.", d: "Approvals, artifacts, checks and recoveries stay attached to the work — reviewable while it runs, exportable when it is done.", end: true },
];

export default function CustomWorkflows() {
  usePageMeta("Custom workflows", "AlterX shapes Alter Engine around the work your team already performs — its handoffs, approval points and connected systems.");
  return (
    <>
      <section className="text-[#090909] relative overflow-clip" style={{ paddingTop: "calc(var(--header-height) + 72px)", background: "var(--marketing-light-medium)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-atmo-light)" }} aria-hidden="true" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 pb-20 lg:pr-[420px]">
          <Reveal><Eyebrow className="mb-7">Custom workflows</Eyebrow></Reveal>
          <MaskLines as="h1" lines={["Your process. Your systems.", "Human authority where it belongs."]} className="ax-display text-4xl sm:text-5xl lg:text-[64px] max-w-5xl" />
          <Reveal delay={0.15}>
            <p className="mt-7 text-black/70 max-w-2xl text-lg">AlterX can shape Alter Engine around the work your team already performs, including its handoffs, approval points and connected systems.</p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-9">
              <Link to="/contact" className="btn-primary" data-testid="cw-hero-cta">Discuss a workflow <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
            </div>
          </Reveal>
        </div>
        <CustomWorkflowsHeroVisual />
      </section>

      <section className="pb-24" style={{ background: "var(--marketing-light-medium)" }} data-testid="cw-setup-section">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <Reveal><WorkflowSetup /></Reveal>
        </div>
      </section>

      <section className="pb-28 relative" style={{ background: "var(--marketing-light-medium)" }} data-testid="cw-thread-page">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 relative">
          {/* the spine */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden sm:block" aria-hidden="true">
            <svg className="w-[24px] h-full -ml-[11px]" viewBox="0 0 24 1000" preserveAspectRatio="none">
              <ThreadPath d="M12 0 L12 1000" strokeWidth={2} duration={1.6} />
            </svg>
          </div>
          <div className="space-y-20 md:space-y-28 relative">
            {CHAPTERS.map((c, i) => (
              <Reveal key={c.key} delay={0.05}>
                <div className={`relative grid md:grid-cols-2 gap-8 items-center`} data-testid={`cw-chapter-${c.key}`}>
                  <div className={`${c.side === "right" ? "md:order-2" : ""} md:px-10`}>
                    <Eyebrow className="mb-4">{c.eyebrow}</Eyebrow>
                    <h2 className="ax-display text-2xl md:text-[34px] max-w-md">{c.h}</h2>
                    <p className="mt-4 text-black/70 max-w-md">{c.d}</p>
                  </div>
                  <div className={`${c.side === "right" ? "md:order-1" : ""} hidden md:flex justify-center`} aria-hidden="true">
                    {c.gate ? (
                      <svg viewBox="0 0 120 120" className="w-[110px]">
                        <rect x="38" y="38" width="44" height="44" transform="rotate(45 60 60)" fill="rgba(255,77,10,.06)" stroke="#ff4d0a" strokeWidth="2.4" />
                        <path d="M60 0 L60 30" stroke="#ff4d0a" strokeWidth="2" />
                        <path d="M60 90 L60 120" stroke="rgba(9,9,9,.25)" strokeWidth="2" strokeDasharray="4 4" />
                      </svg>
                    ) : c.branch ? (
                      <svg viewBox="0 0 140 120" className="w-[130px]">
                        <path d="M20 60 L70 60" stroke="#ff4d0a" strokeWidth="2" fill="none" />
                        <path d="M70 60 C 90 60, 95 30, 120 30" stroke="#ff4d0a" strokeWidth="2" fill="none" />
                        <path d="M70 60 C 90 60, 95 90, 120 90" stroke="rgba(9,9,9,.3)" strokeWidth="1.6" strokeDasharray="4 4" fill="none" />
                        <circle cx="120" cy="30" r="5" fill="#ff4d0a" />
                        <circle cx="120" cy="90" r="5" fill="none" stroke="rgba(9,9,9,.35)" strokeWidth="1.6" />
                      </svg>
                    ) : c.end ? (
                      <svg viewBox="0 0 120 120" className="w-[110px]">
                        <circle cx="60" cy="60" r="26" fill="none" stroke="#ff4d0a" strokeWidth="2.4" />
                        <path d="M48 60 L57 69 L74 50" fill="none" stroke="#ff4d0a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 140 90" className="w-[130px]">
                        <circle cx="70" cy="45" r="10" fill="none" stroke="#ff4d0a" strokeWidth="2.2" />
                        <path d="M10 45 L58 45 M82 45 L130 45" stroke="rgba(9,9,9,.3)" strokeWidth="1.8" fill="none" />
                        <circle cx="10" cy="45" r="3.5" fill="#ff4d0a" />
                      </svg>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="text-[#fbfaf7] py-24 text-center" style={{ background: "rgba(0,0,0,0.46)" }}>
        <div className="max-w-[760px] mx-auto px-6">
          <MaskLines as="h2" lines={["Bring us the process."]} className="ax-display text-3xl md:text-[46px]" />
          <p className="mt-5 text-white/60 max-w-xl mx-auto">The first conversation focuses on the outcome, the systems involved and where human judgment belongs.</p>
          <div className="mt-9 flex justify-center">
            <Link to="/contact" className="btn-primary" data-testid="cw-final-cta">Discuss a workflow <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
