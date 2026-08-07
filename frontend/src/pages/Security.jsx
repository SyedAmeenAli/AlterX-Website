import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CipherField from "@/components/home/CipherField";
import { usePageMeta, Reveal, MaskLines } from "@/lib/anim";
import { Eyebrow } from "@/components/kit";

const SECTIONS = [
  { t: "Identity and access", d: "Access is identity-based. Roles define who can create missions, approve actions, connect systems and export evidence." },
  { t: "Workspace separation", d: "Missions, data, workflows and evidence stay inside their workspace. Separation is structural, not cosmetic." },
  { t: "Permissioned connections", d: "Every connected system carries explicit scope. Missions can be configured to never exceed the granted permissions." },
  { t: "Human approval boundaries", d: "Sensitive actions are designed to pause for the person with authority — with the action, reason, scope, risk and rollback in front of them." },
  { t: "Data handling and retention", d: "What is kept, and for how long, is a configuration. Retention supports the evidence model without becoming an accidental archive." },
  { t: "Audit and evidence", d: "Decisions, approvals, artifacts and checks keep their trail. The record is designed to survive review." },
  { t: "Availability and resilience", d: "The service is designed for graceful degradation — failures are classified and surfaced, not hidden." },
  { t: "Responsible AI and evaluation", d: "Outputs are designed to be checked against criteria before acceptance. Weak steps can be returned for revision instead of shipped." },
  { t: "Vulnerability reporting", d: "Suspected vulnerabilities can be reported to alterx@alterx.co.in until a tested security alias is published." },
  { t: "Legal and trust documents", d: "Privacy, terms, acceptable use and the DPA are published as review drafts. Certifications appear only when completed." },
];

export default function Security() {
  usePageMeta("Security", "Control is not an add-on. AlterX is designed so access, permissions, human checkpoints and evidence remain part of the mission.");
  return (
    <>
      <section className="relative bg-black text-[#fbfaf7] overflow-clip" style={{ minHeight: "88svh", paddingTop: "calc(var(--header-height) + 60px)" }}>
        <div className="absolute inset-0"><CipherField /></div>
        <div className="absolute inset-y-0 left-0 w-full lg:w-[58%] pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(0,0,0,.96) 0%, rgba(0,0,0,.9) 55%, rgba(0,0,0,.55) 80%, rgba(0,0,0,0) 100%)" }} aria-hidden="true" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 pb-24">
          <div className="max-w-xl relative">
            <div className="relative">
              <Reveal><Eyebrow dark className="mb-6">Security</Eyebrow></Reveal>
              <MaskLines as="h1" lines={["Control is", "not an add-on."]} className="ax-display text-5xl sm:text-6xl lg:text-[72px]" />
              <Reveal delay={0.2}>
                <p className="mt-7 text-white/70 max-w-lg text-lg">AlterX is designed so that access, permissions, human checkpoints and evidence remain part of the mission, not separate from it.</p>
                <p className="mt-4 text-[13px] text-white/45 max-w-lg">AlterX is designed to support and enforce these controls. Formal audits and certifications will be published only when completed.</p>
              </Reveal>
              <Reveal delay={0.3}>
                <Link to="/contact" className="btn-primary mt-9" data-testid="security-hero-cta">Request security information <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-black text-[#fbfaf7] pb-28 pt-8">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-px bg-white/12 border border-white/12">
            {SECTIONS.map((s, i) => (
              <div key={s.t} className="bg-black p-8" data-testid={`security-topic-${i}`}>
                <p className="text-[12px] font-medium text-[#ff4d0a] mb-3">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="text-xl font-bold tracking-tight mb-2">{s.t}</h2>
                <p className="text-[14px] text-white/60">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[13px] text-white/40 max-w-2xl">Language on this page is deliberately qualified — “designed to”, “supports”, “can be configured to”. Security and retention behaviour depends on the configured plan and deployment. Additional security information is available during evaluation.</p>
        </div>
      </section>
    </>
  );
}
