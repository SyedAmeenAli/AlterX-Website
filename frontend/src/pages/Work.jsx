import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/kit";
import { WORK_ENTRIES } from "@/content/home";
import { usePageMeta } from "@/lib/anim";

export default function Work() {
  usePageMeta("Work", "Real work, carefully built — AI-enabled websites, Cognitive AI inventory systems and operational software by AlterX.");
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title={["Real work.", "Carefully built."]}
        body="AlterX builds practical systems around real business needs. Every project is labelled truthfully — no invented outcomes, percentages or hidden client identities."
      />
      <section className="bg-[#fbfaf7] pb-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 space-y-6">
          {WORK_ENTRIES.map((w, i) => (
            <Link
              key={w.slug}
              to={`/work/${w.slug}`}
              className="group block border border-black/15 bg-[#f3f0e9] hover:bg-black hover:text-[#fbfaf7] transition-colors duration-300 sticky"
              style={{ top: `calc(var(--header-height) + ${24 + i * 18}px)` }}
              data-testid={`work-card-${w.slug}`}
            >
              <div className="p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-5">
                    <span className="font-mono-ax text-[11px] opacity-50">{String(i + 1).padStart(2, "0")}</span>
                    <span className="ax-eyebrow opacity-60">{w.category}</span>
                    <span className="font-mono-ax text-[10px] uppercase tracking-wider border border-current px-2 py-0.5 opacity-60">{w.label}</span>
                  </div>
                  <h2 className="ax-display text-2xl md:text-4xl max-w-3xl">{w.title}</h2>
                  <p className="mt-4 opacity-65 max-w-2xl">{w.description}</p>
                  <div className="mt-8 border-t border-current/20 pt-5 max-w-3xl" style={{ borderColor: "currentcolor", opacity: 0.9 }}>
                    <p className="font-mono-ax text-[10px] uppercase tracking-wider opacity-50 mb-2">The condition</p>
                    <p className="text-[15px] opacity-75">{w.condition}</p>
                  </div>
                </div>
                <div className="flex md:flex-col items-center gap-4">
                  <span className="ax-display text-6xl md:text-8xl opacity-10 group-hover:opacity-100 group-hover:text-[#ff5a1f] transition-all duration-300" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900 }}>{w.name.charAt(0)}</span>
                  <ArrowUpRight size={26} className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
