import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Check, MapPin, TrendingDown } from "lucide-react";
import { PageHero, ChapterHead, DemoBadge, FillLink } from "@/components/kit";
import { usePageMeta, Reveal } from "@/lib/anim";

const CAPTURE_STEPS = ["Capture", "Structure", "Confirm"];

const CaptureDemo = () => {
  const [step, setStep] = useState(0);
  return (
    <div className="border border-black/15 bg-white" data-testid="capture-demo">
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-2.5">
        <span className="text-[11px] font-medium text-black/50">COGNITIVE AI · PRODUCT CAPTURE</span>
        <DemoBadge />
      </div>
      <div className="flex border-b border-black/10">
        {CAPTURE_STEPS.map((s, i) => (
          <button key={s} onClick={() => setStep(i)} className={`ax-fill flex-1 py-3 text-[13px] font-bold ${step === i ? "text-[#c9360a]" : "text-black/50"}`} data-active={step === i} data-testid={`capture-step-${s.toLowerCase()}`}>
            {i + 1}. {s}
          </button>
        ))}
      </div>
      <div className="p-6 min-h-[290px]">
        {step === 0 && (
          <div className="text-center py-8">
            <div className="w-40 h-40 mx-auto border-2 border-dashed border-black/25 flex items-center justify-center mb-5">
              <Camera size={38} className="text-black/35" aria-hidden="true" />
            </div>
            <p className="text-[15px] text-black/70 mb-5">A product photo enters. Attributes are extracted for confirmation.</p>
            <button onClick={() => setStep(1)} className="btn-primary !py-2.5" data-testid="capture-analyze-btn">Analyse the image <ArrowRight size={14} className="ax-arrow" aria-hidden="true" /></button>
          </div>
        )}
        {step === 1 && (
          <div className="max-w-md mx-auto">
            <p className="text-[11px] font-medium text-[#c9360a] uppercase tracking-[0.14em] mb-4">Extracted for confirmation</p>
            {[["Name", "Linen overshirt — relaxed fit"], ["Colour", "Rust"], ["Material", "100% linen"], ["Category", "Apparel · Outerwear"], ["Type", "Overshirt"], ["Proposed SKU", "AP-OVS-RST-014"]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5 border-b border-black/10 text-[14px]">
                <span className="text-black/50">{k}</span>
                <span className={`font-semibold ${k === "Proposed SKU" ? "text-[12px] font-medium text-[#c9360a]" : ""}`}>{v}</span>
              </div>
            ))}
            <button onClick={() => setStep(2)} className="btn-primary !py-2.5 mt-5" data-testid="capture-confirm-btn">Confirm and enter catalogue</button>
          </div>
        )}
        {step === 2 && (
          <div className="max-w-md mx-auto text-center py-8">
            <Check size={40} className="mx-auto text-[#c9360a] mb-4" aria-hidden="true" />
            <p className="text-lg font-bold">Confirmed by a person. Entered into the record.</p>
            <p className="text-[14px] text-black/60 mt-2 mb-6">Human confirmation happens before catalogue entry — extraction proposes, people decide.</p>
            <button onClick={() => setStep(0)} className="btn-ghost-light ax-fill !py-2.5" data-testid="capture-restart-btn">Run it again</button>
          </div>
        )}
      </div>
    </div>
  );
};

const SECTIONS = [
  { t: "Track", d: "Stock and locations, movement history, attention signals — the inventory that quietly stops moving becomes visible.", icon: MapPin },
  { t: "Decide", d: "Cognitive AI explains what needs attention, proposes an action and pauses for approval before anything changes.", icon: TrendingDown },
  { t: "Campaign connection", d: "Campaign and merchandising work answers to inventory truth — what exists, where it is and what is moving." },
  { t: "Analytics", d: "Decision-ready operational information with every figure traceable. No invented business outcomes." },
  { t: "Governance", d: "Roles, permissions, approvals and evidence — the same accountability spine as every AlterX product." },
];

export default function CognitiveAI() {
  usePageMeta("Cognitive AI", "Take a picture. Start with the product. Cognitive AI turns product information into a structured inventory record ready for human confirmation.");
  return (
    <>
      <PageHero
        eyebrow="A product by AlterX"
        title={["Take a picture.", "Start with the product."]}
        body="Cognitive AI turns product information into a structured inventory record ready for human confirmation, then keeps stock, locations, campaigns and decisions connected."
        ctas={<Link to="/contact" className="btn-primary" data-testid="cognitive-hero-cta">Request a walkthrough <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>}
      />
      <section className="bg-[#fbfaf7] pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-24">
            <Reveal><CaptureDemo /></Reveal>
            <div className="lg:pt-8">
              <ChapterHead num="01" eyebrow="Capture and structure" title="From photo to confirmable record." body="A product image enters. Name, colour, material, category, type and a proposed SKU are extracted — and a person confirms before anything enters the catalogue." />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/15 border border-black/15">
            {SECTIONS.map((s, i) => (
              <div key={s.t} className="bg-[#fbfaf7] p-8" data-testid={`cognitive-section-${i}`}>
                <p className="text-[12px] font-medium text-[#c9360a] mb-3">{String(i + 2).padStart(2, "0")}</p>
                <h2 className="text-xl font-bold tracking-tight mb-2">{s.t}</h2>
                <p className="text-[14px] text-black/60">{s.d}</p>
              </div>
            ))}
            <div className="bg-black text-[#fbfaf7] p-8 flex flex-col justify-between">
              <p className="text-xl font-bold tracking-tight">See it around your inventory.</p>
              <FillLink to="/contact" dark className="mt-6 self-start" data-testid="cognitive-final-cta">Request a walkthrough</FillLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
