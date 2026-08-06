import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHero, EditorialRow } from "@/components/kit";
import { RESOURCES } from "@/content/home";
import { usePageMeta } from "@/lib/anim";

const FILTERS = ["All", "Insight", "Guide", "Video"];

export default function Resources() {
  usePageMeta("Resources", "The system behind visible work — guides and insights on human checkpoints, evidence and governed execution.");
  const [params] = useSearchParams();
  const initial = params.get("type");
  const [filter, setFilter] = useState(initial ? initial.charAt(0).toUpperCase() + initial.slice(1) : "All");
  const shown = filter === "All" ? RESOURCES : RESOURCES.filter((r) => r.type === filter);
  return (
    <>
      <PageHero eyebrow="Resources" title="The system behind visible work." body="Guides and insights on human checkpoints, evidence, governed execution and connected inventory." />
      <section className="bg-[#fbfaf7] pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex flex-wrap gap-1 mb-10" role="tablist" aria-label="Resource filters">
            {FILTERS.map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className="ax-fill px-4 py-2 text-[13px] font-bold border border-black/15" data-active={filter === f} data-testid={`resources-filter-${f.toLowerCase()}`}>
                {f}
              </button>
            ))}
          </div>
          {shown.length === 0 ? (
            <p className="text-black/55 py-10" data-testid="resources-empty">No {filter.toLowerCase()} resources are published yet.</p>
          ) : (
            <div className="border-b border-black/15">
              {shown.map((r, i) => (
                <EditorialRow key={r.slug} to={`/resources/${r.slug}`} index={i} kicker={`${r.type} · ${r.read}`} title={r.title} desc={r.value} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
