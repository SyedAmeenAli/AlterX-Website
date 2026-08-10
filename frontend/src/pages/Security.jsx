import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePageMeta, Reveal, MaskLines } from "@/lib/anim";
import { Eyebrow } from "@/components/kit";
import LetterGlitch from "@/components/ui/LetterGlitch";
import "./Security.css";

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const SECTIONS = [
  { t: "Identity and access", d: "Access is identity-based. Roles define who can create missions, approve actions, connect systems and export evidence." },
  { t: "Workspace separation", d: "Missions, data, workflows and evidence stay inside their workspace. Separation is structural, not cosmetic." },
  { t: "Permissioned connections", d: "Every connected system carries explicit scope. Missions can be configured to never exceed the granted permissions." },
  { t: "Human approval boundaries", d: "Sensitive actions are designed to pause for the person with authority — with the action, reason, scope, risk and rollback in front of them." },
  { t: "Data handling and retention", d: "What is kept, and for how long, is a configuration. Retention supports the evidence model without becoming an accidental archive." },
  { t: "Audit and evidence", d: "Decisions, approvals, artifacts and checks keep their trail. The record is designed to survive review." },
  { t: "Availability and resilience", d: "The service is designed for graceful degradation — failures are classified and surfaced, not hidden." },
  { t: "Responsible AI and evaluation", d: "Outputs are designed to be checked against criteria before acceptance. Weak steps can be returned for revision instead of shipped." },
  { t: "Vulnerability reporting", d: "Security enquiries and suspected vulnerabilities can be reported to alterx@alterx.co.in with the subject line \"Security enquiry\"." },
  { t: "Legal and trust documents", d: "Privacy, terms, acceptable use and the DPA are published as review drafts. Certifications appear only when completed." },
];

export default function Security() {
  usePageMeta("Security", "Control is not an add-on. AlterX is designed so access, permissions, human checkpoints and evidence remain part of the mission.");
  const [tapped, setTapped] = useState(null); // mobile: tap keeps one item filled, no hover there
  return (
    <>
      <section className="relative overflow-clip isolate" style={{ minHeight: "95svh", background: "#000" }} data-testid="security-scene">
        {/* full-bleed glitch field — the dominant visual across the whole section */}
        <div className="absolute inset-0 z-0">
          <LetterGlitch glitchSpeed={50} centerVignette={true} outerVignette={false} smooth={true} colors={["#ffffff", "#F97316", "#62686a"]} />
        </div>
        {/* text-safe veil — only enough to keep the headline/copy readable, not a wall over the whole field */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{ background: "linear-gradient(90deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.55) 42%, rgba(0,0,0,.12) 68%, rgba(0,0,0,.05) 100%)" }}
          aria-hidden="true"
        />
        <div className="relative z-[2] max-w-[1400px] mx-auto px-6 md:px-10 pb-24 text-[#fbfaf7]" style={{ paddingTop: "calc(var(--header-height) + 60px)" }}>
          <div className="max-w-xl relative">
            <Reveal><Eyebrow dark className="mb-6">Security</Eyebrow></Reveal>
            <MaskLines as="h1" lines={["Control is", "not an add-on."]} className="ax-display text-5xl sm:text-6xl lg:text-[72px] text-[#fbfaf7]" />
            <Reveal delay={0.2}>
              <p className="mt-7 text-white/70 max-w-lg text-lg">AlterX is designed so that access, permissions, human checkpoints and evidence remain part of the mission, not separate from it.</p>
              <p className="mt-4 text-[13px] text-white/45 max-w-lg">AlterX is designed to support and enforce these controls. Formal audits and certifications will be published only when completed.</p>
            </Reveal>
            <Reveal delay={0.3}>
              <Link to="/contact" className="btn-primary mt-9" data-testid="security-hero-cta">Request security information <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="text-[#fbfaf7] pb-28 pt-8" style={{ background: "var(--marketing-security)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2">
            {SECTIONS.map((s, i) => (
              <button
                type="button"
                key={s.t}
                id={slugify(s.t)}
                style={{ scrollMarginTop: "calc(var(--header-height) + 16px)" }}
                className={`securityItem ${tapped === i ? "is-tapped" : ""}`}
                onClick={() => setTapped((cur) => (cur === i ? null : i))}
                data-testid={`security-topic-${i}`}
              >
                <span className="securityItem__fill" aria-hidden="true" />
                <span className="securityItem__content">
                  <span className="securityItem__index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="securityItem__title">{s.t}</span>
                  <span className="securityItem__desc">{s.d}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-8 text-[13px] text-white/40 max-w-2xl">Language on this page is deliberately qualified — “designed to”, “supports”, “can be configured to”. Security and retention behaviour depends on the configured plan and deployment. Additional security information is available during evaluation.</p>
          <p className="mt-4 text-[13px] text-white/40 max-w-2xl">Security enquiries: <a href="mailto:alterx@alterx.co.in?subject=Security%20enquiry" className="underline decoration-white/30 hover:decoration-white/70" data-testid="security-contact-mailto">alterx@alterx.co.in</a></p>
        </div>
      </section>
    </>
  );
}
