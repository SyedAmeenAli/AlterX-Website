import React, { useState } from "react";
import { PageHero, FillLink } from "@/components/kit";
import { INTEGRATION_CATEGORIES } from "@/content/pages";
import { usePageMeta } from "@/lib/anim";

export default function Integrations() {
  usePageMeta("Integrations", "Permissioned connection types for AlterX missions — scope, triggers, actions, approvals and evidence per category.");
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? INTEGRATION_CATEGORIES : INTEGRATION_CATEGORIES.filter((c) => c.key === filter);
  return (
    <>
      <PageHero
        eyebrow="Integrations"
        title={["Connections with scope,", "not blanket access."]}
        body="Specific systems and logos are published only once confirmed. Until then, these are the connection categories AlterX works with — each with explicit permissions, triggers, actions, approval requirements and evidence behaviour."
      />
      <section className="bg-[#fbfaf7] pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex flex-wrap gap-1 mb-10" role="tablist" aria-label="Integration categories">
            <button role="tab" aria-selected={filter === "all"} onClick={() => setFilter("all")} className="ax-fill px-4 py-2 text-[13px] font-bold border border-black/15" data-active={filter === "all"} data-testid="integrations-filter-all">All</button>
            {INTEGRATION_CATEGORIES.map((c) => (
              <button key={c.key} role="tab" aria-selected={filter === c.key} onClick={() => setFilter(c.key)} className="ax-fill px-4 py-2 text-[13px] font-bold border border-black/15" data-active={filter === c.key} data-testid={`integrations-filter-${c.key}`}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-black/15 border border-black/15">
            {shown.map((c) => (
              <div key={c.key} className="bg-[#fbfaf7] p-8" data-testid={`integration-card-${c.key}`}>
                <h2 className="text-xl font-bold tracking-tight">{c.label}</h2>
                <p className="text-[14px] text-black/60 mt-1.5 mb-5">{c.desc}</p>
                <dl className="space-y-2 text-[13px]">
                  {[["Permissions", c.permissions], ["Triggers", c.triggers], ["Actions", c.actions], ["Approval", c.approval], ["Evidence", c.evidence]].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[100px_1fr] gap-3 border-t border-black/10 pt-2">
                      <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#c9360a] pt-0.5">{k}</dt>
                      <dd className="text-black/70">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <div className="mt-12"><FillLink to="/contact" data-testid="integrations-cta">Discuss a connection</FillLink></div>
        </div>
      </section>
    </>
  );
}
