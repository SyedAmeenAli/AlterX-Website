import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, EditorialRow, FillLink } from "@/components/kit";
import { SOLUTIONS } from "@/content/pages";
import { usePageMeta, Reveal } from "@/lib/anim";

/* Operating map — three large zones, each a different way Alter Engine enters the work. */

const ZONES = [
  {
    key: "cognitive",
    title: "Cognitive AI",
    kicker: "Inventory operations",
    copy: "Inventory operations powered by Alter Engine — product truth, stock attention and decisions in one connected view.",
    cta: "Explore Cognitive AI",
    to: "/cognitive-ai",
    visual: (active) => (
      <svg viewBox="0 0 220 140" className="w-full h-28" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M30 ${96 - i * 22} L110 ${66 - i * 22} L190 ${96 - i * 22} L110 ${126 - i * 22} Z`} fill="none" stroke={i === 1 && active ? "#ff4d0a" : "currentColor"} strokeWidth="1.5" opacity={i === 1 ? 0.95 : 0.4} />
        ))}
        <circle cx="126" cy="52" r="4.5" fill={active ? "#ff4d0a" : "currentColor"} />
        <path d="M126 57 L126 92" stroke={active ? "#ff4d0a" : "currentColor"} strokeWidth="1.5" strokeDasharray="3 4" opacity=".8" />
      </svg>
    ),
  },
  {
    key: "workflows",
    title: "Custom workflows",
    kicker: "Enterprise",
    copy: "Shape Alter Engine around your process, systems, permissions and human decision points.",
    cta: "Discuss a workflow",
    to: "/solutions/custom-workflows",
    visual: (active) => (
      <svg viewBox="0 0 220 140" className="w-full h-28" aria-hidden="true">
        <path d="M14 70 L80 70" stroke={active ? "#ff4d0a" : "currentColor"} strokeWidth="1.8" opacity=".9" fill="none" />
        <rect x="92" y="58" width="24" height="24" transform="rotate(45 104 70)" fill="none" stroke={active ? "#ff4d0a" : "currentColor"} strokeWidth="1.8" />
        <path d="M128 70 L206 70" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 4" opacity=".45" fill="none" />
        <circle cx="14" cy="70" r="4" fill={active ? "#ff4d0a" : "currentColor"} />
        <circle cx="206" cy="70" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".6" />
      </svg>
    ),
  },
  {
    key: "build",
    title: "Build with AlterX",
    kicker: "Developers",
    copy: "Bring approval-aware Engine workflows into an existing product or internal environment.",
    cta: "Explore developer access",
    to: "/developers",
    visual: (active) => (
      <svg viewBox="0 0 220 140" className="w-full h-28" aria-hidden="true">
        <path d="M52 34 L40 34 L40 106 L52 106" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".5" />
        <path d="M168 34 L180 34 L180 106 L168 106" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".5" />
        <rect x="84" y="52" width="52" height="36" fill="none" stroke={active ? "#ff4d0a" : "currentColor"} strokeWidth="1.8" />
        <path d="M20 70 L84 70" stroke="currentColor" strokeWidth="1.4" opacity=".5" />
        <path d="M136 70 L200 70" stroke={active ? "#ff4d0a" : "currentColor"} strokeWidth="1.6" opacity=".9" />
        <circle cx="200" cy="70" r="4.5" fill={active ? "#ff4d0a" : "currentColor"} />
      </svg>
    ),
  },
];

export default function Solutions() {
  usePageMeta("Solutions", "Apply Alter Engine to a defined operating problem, shape it around an existing process or bring it into a product your team already uses.");
  const [active, setActive] = useState(null);
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={["Work that does not fit", "inside one tool."]}
        body="Apply Alter Engine to a defined operating problem, shape it around an existing process or bring it into a product your team already uses."
      />
      <section className="bg-[#fbfaf7] pb-20" data-testid="solutions-map">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-3 gap-px bg-black/15 border border-black/15">
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
                  className={`block p-8 min-h-[340px] flex flex-col transition-colors duration-300 ${on ? "bg-black text-[#fbfaf7]" : "bg-[#f3f0e9] text-[#090909]"}`}
                  data-testid={`solutions-zone-${z.key}`}
                >
                  {z.visual(on)}
                  <span className="ax-eyebrow opacity-55 text-[11px] mt-5">{z.kicker}</span>
                  <h2 className="text-2xl font-semibold tracking-tight mt-1.5">{z.title}</h2>
                  <p className={`text-sm mt-3 leading-relaxed transition-opacity duration-300 ${on ? "opacity-80" : "opacity-60"}`}>{z.copy}</p>
                  <span className={`mt-auto pt-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${on ? "text-[#ff4d0a]" : "text-[#c9360a]"}`}>
                    {z.cta} <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-[#fbfaf7] pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal>
            <h2 className="ax-display text-2xl md:text-3xl mb-8">More ways teams apply the Engine.</h2>
          </Reveal>
          <div className="border-b border-black/15">
            {SOLUTIONS.map((s, i) => (
              <EditorialRow key={s.slug} to={`/solutions/${s.slug}`} index={i} kicker="Solution" title={s.title} desc={s.lead} />
            ))}
          </div>
          <div className="mt-12"><FillLink to="/contact" data-testid="solutions-cta">Discuss a workflow</FillLink></div>
        </div>
      </section>
    </>
  );
}
