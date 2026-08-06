import React from "react";
import { PageHero, ChapterHead, FillLink } from "@/components/kit";
import { DISCIPLINES, OPEN_ROLES } from "@/content/pages";
import { BUSINESS } from "@/content/navigation";
import { usePageMeta, Reveal } from "@/lib/anim";

const SECTIONS = [
  { t: "Why AlterX", d: "We build systems where AI does real work and people keep real authority. Every mission is visible, every decision is owned, every result is checked. If you want your work to matter and to be inspectable, you will like it here." },
  { t: "How we work", d: "Small teams with full ownership. Written thinking before meetings. Prototypes before promises. Evidence before claims. We ship carefully because our product's entire promise is carefulness." },
  { t: "Hiring process", d: "One conversation about your work, one practical exercise drawn from real problems (never free labour), one conversation with the founding team. We give a decision and honest reasoning either way." },
  { t: "Equal opportunity", d: "AlterX evaluates candidates on capability and character. We do not discriminate on the basis of gender, religion, caste, disability, age, or background." },
  { t: "Candidate privacy", d: "Application materials are used only for recruitment, kept confidential and deleted on request. See the Privacy Policy for details." },
];

export default function Careers() {
  usePageMeta("Careers", "Build systems that move real work. Open roles and disciplines at AlterX.");
  return (
    <>
      <PageHero eyebrow="Careers" title="Build systems that move real work." body="AlterX is building governed AI execution from Hyderabad, for businesses everywhere." />
      <section className="bg-[#fbfaf7] pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-px bg-black/15 border border-black/15 mb-24">
            {SECTIONS.map((s) => (
              <div key={s.t} className="bg-[#fbfaf7] p-8">
                <h2 className="text-xl font-bold tracking-tight mb-2">{s.t}</h2>
                <p className="text-[15px] text-black/65">{s.d}</p>
              </div>
            ))}
            <div className="bg-black text-[#fbfaf7] p-8">
              <h2 className="text-xl font-bold tracking-tight mb-2">Disciplines</h2>
              <ul className="text-[15px] text-white/70 space-y-1.5 mt-3">
                {DISCIPLINES.map((d) => <li key={d} className="border-l-2 border-[#ff5a1f] pl-3">{d}</li>)}
              </ul>
            </div>
          </div>

          <ChapterHead num="02" eyebrow="Open roles" title="Current openings." />
          {OPEN_ROLES.length === 0 ? (
            <Reveal>
              <div className="border border-black/15 bg-[#f3f0e9] p-10 max-w-2xl" data-testid="careers-empty-state">
                <p className="text-xl font-bold tracking-tight mb-2">No open roles are published right now.</p>
                <p className="text-[15px] text-black/60 mb-7">We still read every serious introduction. Show us something you built and why it works.</p>
                <a href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent("Share your work with AlterX")}`} className="btn-primary" data-testid="careers-share-cta">Share your work with AlterX</a>
              </div>
            </Reveal>
          ) : (
            <div className="border-b border-black/15">
              {OPEN_ROLES.map((r, i) => (
                <div key={r.title} className="grid md:grid-cols-[70px_1fr_auto] gap-4 py-6 border-t border-black/15">
                  <span className="font-mono-ax text-xs opacity-50">{String(i + 1).padStart(2, "0")}</span>
                  <div><p className="text-xl font-bold">{r.title}</p><p className="text-sm text-black/60">{r.discipline} · {r.location}</p></div>
                  <FillLink to="/contact">Apply</FillLink>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
