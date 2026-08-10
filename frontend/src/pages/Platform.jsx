import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, CircleDot, Clock } from "lucide-react";
import { PageHero, ChapterHead, DemoBadge } from "@/components/kit";
import { usePageMeta, Reveal } from "@/lib/anim";

const TABS = ["Conversation", "Plan", "Progress", "Decision", "Result"];

const Prototype = () => {
  const [tab, setTab] = useState(0);
  return (
    <div className="border border-white/15 bg-[#090909]" data-testid="platform-prototype">
      <div className="flex items-center justify-between border-b border-white/12 px-4 py-2.5">
        <span className="text-[11px] font-medium text-white/50">ALTERX PLATFORM · AX-M-014</span>
        <DemoBadge />
      </div>
      <div className="flex border-b border-white/12 overflow-x-auto">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`ax-fill px-5 py-3 text-[13px] font-semibold whitespace-nowrap ${tab === i ? "text-[#ff4d0a]" : "text-white/55"}`} data-active={tab === i} data-testid={`platform-tab-${t.toLowerCase()}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="p-6 min-h-[300px]">
        {tab === 0 && (
          <div className="space-y-3 max-w-lg">
            <div className="bg-white/[.07] px-4 py-3 text-[14px] text-white/85">Prepare a weekly operating report from our four source systems, exceptions first.</div>
            <div className="border border-[#ff4d0a]/30 bg-[#ff4d0a]/[.08] px-4 py-3 text-[14px] text-white/90">Understood. Before I draft the plan — should conflicting figures be flagged for review, or excluded entirely?</div>
            <div className="bg-white/[.07] px-4 py-3 text-[14px] text-white/85">Flagged, never averaged.</div>
            <p className="text-[11px] font-medium text-[#ff4d0a] pt-2">→ OBJECTIVE CLARIFIED · MOVING TO PLAN</p>
          </div>
        )}
        {tab === 1 && (
          <div className="space-y-2 max-w-lg">
            {[["Collect source extracts", "Data", false], ["Reconcile overlapping figures", "Data", false], ["Draft exception summary", "Documents", false], ["Publish to leadership channel", "Communication", true], ["Archive with sources", "Documents", false]].map(([t, s, ap], i) => (
              <div key={t} className={`flex items-center gap-3 border px-4 py-2.5 ${ap ? "border-[#ff4d0a]/50" : "border-white/12"}`}>
                <span className="text-[11px] font-medium text-white/40">{i + 1}</span>
                <span className="text-[13px] text-white/85 flex-1">{t}</span>
                <span className="text-[11px] text-white/40">{s}</span>
                {ap && <span className="text-[10px] font-medium text-[#ff8a3d]">approval</span>}
              </div>
            ))}
          </div>
        )}
        {tab === 2 && (
          <div className="space-y-2 max-w-lg">
            {[["Collect source extracts", "completed"], ["Reconcile overlapping figures", "running"], ["Draft exception summary", "queued"], ["Publish to leadership channel", "waiting approval"], ["Archive with sources", "queued"]].map(([t, st]) => (
              <div key={t} className="flex items-center gap-3 border border-white/12 px-4 py-2.5">
                {st === "completed" ? <Check size={13} className="text-[#ff4d0a]" /> : st === "running" ? <CircleDot size={13} className="text-[#ff641d] animate-pulse" /> : <Clock size={13} className="text-white/35" />}
                <span className="text-[13px] text-white/85 flex-1">{t}</span>
                <span className="text-[10px] font-medium uppercase text-white/45">{st}</span>
              </div>
            ))}
          </div>
        )}
        {tab === 3 && (
          <div className="border border-[#ff4d0a]/50 p-5 max-w-lg">
            <p className="text-[11px] font-medium text-[#ff4d0a] uppercase tracking-wider mb-2">Approval required</p>
            <p className="text-[14px] text-white/90 mb-4">Publish the weekly report to the leadership channel.</p>
            <p className="text-[12px] text-white/55 mb-4">Reason: the report becomes the operating record. Scope: one post. Risk: low. Rollback: retract and correct.</p>
            <div className="flex gap-2">
              <span className="bg-[#ff4d0a] text-black text-[12px] font-bold px-4 py-1.5">Approve</span>
              <span className="border border-white/25 text-white/70 text-[12px] px-4 py-1.5">Request context</span>
            </div>
          </div>
        )}
        {tab === 4 && (
          <div className="max-w-lg space-y-3">
            <div className="border border-white/15 p-4">
              <p className="text-[11px] font-medium text-[#ff4d0a] uppercase mb-1.5">Result</p>
              <p className="text-[14px] text-white/85">One-page decision-first report. All figures traceable. One conflict flagged for review.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["4 checks passed", "1 step revised", "Evidence exportable"].map((c) => (
                <span key={c} className="text-[11px] font-medium text-white/60 border border-white/15 px-2.5 py-1">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SECTIONS = [
  { t: "Conversation is the front door", d: "Describe the outcome in plain language. The Platform asks what it genuinely needs to know — then the conversation becomes a mission." },
  { t: "See the plan before it acts", d: "The route is an object: steps, dependencies, systems, approval points and expected outputs, readable before anything runs." },
  { t: "Live mission progress", d: "Running, queued, waiting and completed steps stay observable. Select any step to inspect its input, output and evidence." },
  { t: "Human decisions", d: "Approvals arrive with everything needed to decide — action, system, reason, scope, risk and rollback." },
  { t: "Failure and recovery", d: "When a step fails, the Platform shows what failed, why it matters and the recovery choices. The person picks the route." },
  { t: "Result and evidence", d: "The outcome returns with its checks, sources and full timeline — reviewable and exportable." },
  { t: "Reusable workflows", d: "Save a successful mission as a workflow and run the same governed structure again with new inputs." },
];

export default function Platform() {
  usePageMeta("AlterX Platform", "The interface for Alter Engine — where a goal becomes a mission with visible plans, approvals, progress and evidence.");
  return (
    <>
      <PageHero
        dark
        eyebrow="AlterX Platform"
        title={["A place where a goal", "becomes a mission."]}
        body="Start in conversation. Move into a visible plan. Watch work travel through systems, data and people while the Platform keeps context, decisions, approvals and evidence together."
        ctas={<Link to="/try-alter-engine" className="btn-primary" data-testid="platform-hero-cta">Try Alter Engine <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>}
      />
      <section className="text-[#fbfaf7] pb-24" style={{ background: "var(--marketing-dark-medium)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal><Prototype /></Reveal>
          <p className="mt-4 text-[13px] text-white/45 max-w-2xl">The AlterX Platform is the interface through which people describe outcomes, review plans, approve actions, observe work, inspect failures and review results. It is not a separate flagship product — it is how you use Alter Engine.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/12 border border-white/12 mt-20">
            {SECTIONS.map((s, i) => (
              <div key={s.t} className="bg-black p-8" data-testid={`platform-section-${i}`}>
                <p className="text-[12px] font-medium text-[#ff4d0a] mb-3">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="text-xl font-bold tracking-tight mb-2">{s.t}</h2>
                <p className="text-[14px] text-white/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24" style={{ background: "var(--marketing-light-medium)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <ChapterHead num="03" eyebrow="Next" title="Open the Platform experience." />
          <Link to="/try-alter-engine" className="btn-primary -mt-6" data-testid="platform-final-cta">Try Alter Engine <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
