import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHero, EditorialRow } from "@/components/kit";
import { RESOURCES } from "@/content/home";
import { usePageMeta } from "@/lib/anim";
import AlterXResourcesFolder from "@/components/visuals/AlterXResourcesFolder";

// Filters are generated from actually published resource types — a
// category tab only appears once at least one resource exists in it.
const FILTERS = ["All", ...Array.from(new Set(RESOURCES.map((r) => r.type)))];

// same folder identity as the mega-nav "All resources" preview, floating
// directly in the hero — no container. Arrangement follows the active
// filter (All = same widest-fan state as the nav preview); hover always
// fans to the fullest regardless of filter.
const RESOURCES_FOLDER_STATE = { All: "all", Guide: "guides", Insight: "insights" };
const ResourcesHeroVisual = ({ filter }) => (
  <>
    <div className="hidden lg:block absolute pointer-events-auto" style={{ top: "50%", right: "6%", width: "410px", height: "296px", transform: "translateY(-50%)" }} aria-hidden="true" data-testid="resources-hero-visual">
      <AlterXResourcesFolder size="hero" interactive state={RESOURCES_FOLDER_STATE[filter] || "rest"} />
    </div>
    {/* mobile — below hero copy, no pointer tracking, resting state only */}
    <div className="lg:hidden mt-10" aria-hidden="true" data-testid="resources-hero-visual-mobile">
      <AlterXResourcesFolder size="hero" state="rest" />
    </div>
  </>
);

export default function Resources() {
  usePageMeta("Resources", "The system behind visible work — guides and insights on human checkpoints, evidence and governed execution.");
  const [params] = useSearchParams();
  const initial = params.get("type");
  const initialFilter = initial ? initial.charAt(0).toUpperCase() + initial.slice(1) : "All";
  const [filter, setFilter] = useState(FILTERS.includes(initialFilter) ? initialFilter : "All");
  const shown = filter === "All" ? RESOURCES : RESOURCES.filter((r) => r.type === filter);
  return (
    <>
      <PageHero eyebrow="Resources" title="The system behind visible work." body="Guides and insights on human checkpoints, evidence, governed execution and connected inventory.">
        <ResourcesHeroVisual filter={filter} />
      </PageHero>
      <section className="pb-24" style={{ background: "rgba(249,249,249,0.67)" }}>
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
