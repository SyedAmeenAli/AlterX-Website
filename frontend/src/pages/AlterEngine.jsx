import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ShieldCheck, GitBranch, RefreshCcw, FileCheck, Repeat, Lock, Eye, ClipboardList } from "lucide-react";
import { PageHero, ChapterHead, FillLink, Marquee } from "@/components/kit";
import { STAGES } from "@/content/home";
import { usePageMeta, Reveal } from "@/lib/anim";

const SECTIONS = [
  { id: "outcome", icon: ClipboardList, t: "Outcome input", h: "Start with the result, not the tool.", d: "A mission begins with the outcome that must be true at the end — plus the context that shapes it, the constraints that bound it and the criteria that will judge it." },
  { id: "plan", icon: GitBranch, t: "Visible plan", h: "See the route before it runs.", d: "Tasks, dependencies, required approvals and expected outputs appear before any important action moves. The plan is an object you can read, edit and approve." },
  { id: "execution", icon: Eye, t: "Coordinated execution", h: "Parallel where it can be. Ordered where it must be.", d: "Independent steps run side by side; dependent steps wait their turn. The dependency graph stays visible with one selected node inspectable at any time." },
  { id: "authority", icon: ShieldCheck, t: "Human authority", h: "Important actions pause for the right person.", d: "An approval carries the proposed action, the affected system, the reason, the scope, the risk and the rollback. Approve, edit, request context or decline." },
  { id: "recovery", icon: RefreshCcw, t: "Recovery", h: "When reality changes, the route can change with it.", d: "Failures are classified — missing data, connection interruption, conflict — then routed: retry, alternate route, clarification or stop. Nothing fails silently." },
  { id: "verification", icon: Check, t: "Verification", h: "Nothing important disappears into a spinner.", d: "The result is compared against the original success criteria. Checks, sources and output quality state come back with the work." },
  { id: "evidence", icon: FileCheck, t: "Evidence", h: "Every outcome keeps the trail behind it.", d: "Artifacts, decisions, timing and checks stay attached to the mission — reviewable while it runs and exportable when it is done." },
  { id: "reuse", icon: Repeat, t: "Reuse", h: "Turn successful work into a reusable system.", d: "A mission that worked becomes a workflow: same structure, same approval points, ready to run again with new inputs." },
  { id: "governance", icon: Lock, t: "Governance", h: "Built for governed work.", d: "Identity, permissions, budgets, retention and observability surround every mission. Control is the operating model, not a setting." },
];

const SectionVisual = ({ id }) => {
  const base = "border border-white/15 bg-[#090909] p-5 h-full";
  if (id === "plan" || id === "execution")
    return (
      <div className={base} aria-hidden="true">
        <svg viewBox="0 0 300 170" className="w-full h-full">
          <g stroke="rgba(255,255,255,.3)" strokeWidth="1.4" fill="none">
            <rect x="10" y="70" width="56" height="28" />
            <rect x="120" y="20" width="56" height="28" />
            <rect x="120" y="70" width="56" height="28" stroke="#ff5a1f" />
            <rect x="120" y="120" width="56" height="28" />
            <rect x="230" y="70" width="56" height="28" />
            <path d="M66 84 H96 V34 H120 M96 84 H120 M96 84 V134 H120 M176 34 H206 V84 H230 M176 84 H230 M176 134 H206 V84" />
          </g>
          <circle cx="148" cy="84" r="3.5" fill="#ff5a1f" />
          <text x="126" y="112" fontSize="8" fill="#ff761f" fontFamily="JetBrains Mono">SELECTED</text>
        </svg>
      </div>
    );
  if (id === "authority")
    return (
      <div className={base}>
        <p className="font-mono-ax text-[10px] text-[#ff5a1f] uppercase tracking-wider mb-3">Decision anatomy</p>
        {[["Proposed action", "Send quote requests to 3 suppliers"], ["Affected system", "Communication"], ["Scope", "3 outbound messages"], ["Risk / rollback", "Low · withdrawal message"]].map(([t, d]) => (
          <div key={t} className="flex justify-between gap-4 py-2 border-b border-white/10 text-[12px]">
            <span className="text-white/45">{t}</span><span className="text-white/85 text-right">{d}</span>
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <span className="bg-[#ff5a1f] text-black text-[11px] font-bold px-3 py-1">Approve</span>
          <span className="border border-white/25 text-white/70 text-[11px] px-3 py-1">Edit</span>
          <span className="border border-white/25 text-white/70 text-[11px] px-3 py-1">Decline</span>
        </div>
      </div>
    );
  if (id === "recovery")
    return (
      <div className={base}>
        <p className="font-mono-ax text-[10px] text-[#ff5a1f] uppercase tracking-wider mb-3">Failure classified</p>
        <p className="text-[13px] text-white/85 mb-3">Quality-history data incomplete — missing input data</p>
        <div className="grid grid-cols-2 gap-2">
          {["Retry", "Alternate route", "Ask for clarification", "Stop mission"].map((c) => (
            <span key={c} className="border border-white/20 text-white/75 text-[11px] px-3 py-1.5 text-center">{c}</span>
          ))}
        </div>
      </div>
    );
  return (
    <div className={base}>
      <p className="font-mono-ax text-[10px] text-[#ff5a1f] uppercase tracking-wider mb-3">Mission record</p>
      {["Objective clarified", "Plan approved", "3 steps completed", "1 step returned for revision", "Result checked against criteria"].map((r, i) => (
        <p key={r} className="flex items-center gap-2 text-[12px] text-white/75 py-1.5 border-b border-white/10">
          <span className="font-mono-ax text-[9px] text-white/35">{String(i + 1).padStart(2, "0")}</span> {r}
        </p>
      ))}
    </div>
  );
};

export default function AlterEngine() {
  usePageMeta("Alter Engine", "Turn an outcome into visible, reviewable work. Alter Engine structures the work, keeps decisions with people, carries out approved steps and checks the result.");
  return (
    <>
      <PageHero
        dark
        eyebrow="Alter Engine"
        title={["Turn an outcome into", "visible, reviewable work."]}
        body="Alter Engine structures the work, keeps important decisions with people, carries out approved steps and checks what comes back."
        ctas={<>
          <Link to="/try-alter-engine" className="btn-primary" data-testid="engine-hero-cta">Try Alter Engine <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
          <a href="#lifecycle" className="btn-ghost-dark ax-fill">See the lifecycle</a>
        </>}
      />
      <div id="lifecycle"><Marquee dark items={STAGES.map((s) => s.toUpperCase())} /></div>
      <section className="bg-black text-[#fbfaf7] py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 space-y-24">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.id}>
              <div id={s.id} className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`} data-testid={`engine-section-${s.id}`}>
                <div>
                  <p className="flex items-center gap-3 font-mono-ax text-[11px] text-[#ff5a1f] uppercase tracking-wider mb-4">
                    <s.icon size={14} aria-hidden="true" /> {String(i + 1).padStart(2, "0")} · {s.t}
                  </p>
                  <h2 className="ax-display text-3xl lg:text-4xl max-w-md">{s.h}</h2>
                  <p className="mt-5 text-white/60 max-w-lg">{s.d}</p>
                </div>
                <div className="h-[260px]"><SectionVisual id={s.id} /></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="bg-[#fbfaf7] py-24 text-center">
        <div className="max-w-[900px] mx-auto px-6">
          <ChapterHead wide num="10" eyebrow="Next" title={["Start with the outcome.", "Review the mission before it runs."]} />
          <div className="flex justify-center gap-4 -mt-6">
            <Link to="/try-alter-engine" className="btn-primary" data-testid="engine-final-cta">Try Alter Engine <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
            <FillLink to="/contact">Discuss a workflow</FillLink>
          </div>
        </div>
      </section>
    </>
  );
}
