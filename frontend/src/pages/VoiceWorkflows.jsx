import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/kit";
import { usePageMeta, Reveal, MaskLines } from "@/lib/anim";
import VoiceDemo from "@/components/home/VoiceDemo";
import VoiceWorkflowDisclosure from "@/components/voice/VoiceWorkflowDisclosure";
import VoiceAgentOrb from "@/components/visuals/VoiceAgentOrb";

/* Same layered-sphere identity as the mega-nav preview, floating behind the
   real VoiceWorkflowDisclosure — that component stays, this is atmosphere
   supporting it, not a replacement. No container. */
const VoiceHeroVisual = () => (
  <div className="hidden lg:block absolute pointer-events-none" style={{ top: "50%", right: "3%", width: "540px", height: "540px", transform: "translateY(-50%)" }} aria-hidden="true" data-testid="voice-hero-visual">
    <VoiceAgentOrb active size="hero" />
  </div>
);

/* Voice workflows — same visual DNA as the rest of the site (dark atmosphere,
   orange accent, editorial rows) built around the EXACT existing VoiceDemo
   component (same audio, transcript, waveform, approval interaction) —
   not a rebuilt or copied version of it. */

const PRINCIPLES = [
  { t: "A conversation, not a form", d: "A customer speaks in one channel. The workflow understands the request, the account and the policy behind it — without asking them to repeat themselves in a form." },
  { t: "Consequential actions wait", d: "Anything that changes a record — a dispute, a re-grant, a delivery address, a rebooking — pauses for a person before it happens. The conversation can continue while the decision waits." },
  { t: "Evidence stays attached", d: "What was understood, what was proposed and who approved it stay attached to the conversation — reviewable after the call ends, not just during it." },
  { t: "The agent explains itself", d: "Before acting, the workflow states what it understood and what it's about to do. Nothing consequential happens silently in the background." },
];

export default function VoiceWorkflows() {
  usePageMeta("Voice workflows", "Turn a conversation into structured work while keeping important actions subject to human authority.");
  return (
    <>
      <section className="text-[#fbfaf7] relative overflow-clip isolate" style={{ minHeight: "72svh", background: "#000" }} data-testid="voice-page-hero">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-atmo-dark)" }} aria-hidden="true" />
        <VoiceHeroVisual />
        <div className="relative z-[1] max-w-[1400px] mx-auto px-6 md:px-10 pb-20" style={{ paddingTop: "calc(var(--header-height) + 72px)" }}>
          <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-end">
            <div className="max-w-2xl">
              <Reveal><Eyebrow dark className="mb-7">Voice workflows</Eyebrow></Reveal>
              <MaskLines as="h1" lines={["A conversation can still", "contain real work."]} className="ax-display text-4xl sm:text-5xl lg:text-[64px] text-[#fbfaf7]" />
              <Reveal delay={0.15}>
                <p className="mt-7 text-white/70 max-w-xl text-lg">A customer may speak in one channel, but the answer can depend on identity, policy, systems, approvals and follow-up actions. Voice workflows apply Alter Engine to keep all of that connected — and consequential actions subject to human authority.</p>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#demo" className="btn-primary" data-testid="voice-page-hero-cta">See it work <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></a>
                  <Link to="/contact" className="btn-ghost-dark" data-testid="voice-page-contact-cta">Discuss a workflow</Link>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.3}>
              <VoiceWorkflowDisclosure />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="text-[#090909] py-24 md:py-32 relative" style={{ background: "var(--marketing-light-medium)" }} data-testid="voice-principles">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal><Eyebrow className="mb-6">How it works</Eyebrow></Reveal>
          <h2 className="ax-display text-3xl md:text-[44px] max-w-2xl mb-16">The conversation and the work stay connected.</h2>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.06}>
                <div className="border-t border-black/15 pt-5" data-testid={`voice-principle-${i}`}>
                  {i === 1 && <ShieldCheck size={16} className="text-[#ff4d0a] mb-3" aria-hidden="true" />}
                  <h3 className="text-xl font-bold tracking-tight mb-2">{p.t}</h3>
                  <p className="text-black/65 leading-relaxed">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* the actual voice agent demo — same component, same audio, same
          approval interaction as the homepage. Anchor target for #voice
          links that point here from nav/footer. */}
      <div id="demo">
        <VoiceDemo />
      </div>

      <section className="text-[#fbfaf7] py-24 text-center relative overflow-clip" style={{ background: "rgba(0,0,0,0.55)" }} data-testid="voice-final-cta">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-atmo-dark)" }} aria-hidden="true" />
        <div className="relative z-[1] max-w-[760px] mx-auto px-6">
          <MaskLines as="h2" lines={["Bring us the conversation."]} className="ax-display text-3xl md:text-[46px]" />
          <p className="mt-5 text-white/60 max-w-xl mx-auto">Tell us what the conversation needs to accomplish, which systems are involved and where approval belongs.</p>
          <div className="mt-9 flex justify-center">
            <Link to="/contact" className="btn-primary" data-testid="voice-page-final-cta">Discuss a workflow <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
