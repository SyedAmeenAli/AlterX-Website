import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { createMission } from "@/lib/store";
import { COMPOSER_CHIPS } from "@/content/home";

export default function NewMission() {
  const [params] = useSearchParams();
  const [text, setText] = useState(params.get("objective") || "");
  const navigate = useNavigate();

  useEffect(() => {
    const o = params.get("objective");
    if (o) setText(o);
  }, [params]);

  const start = (value) => {
    const v = (value || text).trim();
    if (!v) return;
    const m = createMission(v);
    navigate(`/try-alter-engine/missions/${m.id}`);
  };

  return (
    <div className="p-6 md:p-10 max-w-[860px]" data-testid="new-mission-page">
      <p className="font-mono-ax text-[11px] text-[#ff5a1f] uppercase tracking-wider mb-3">New mission</p>
      <h1 className="ax-display text-3xl md:text-[40px]">What outcome do you need?</h1>
      <p className="text-white/55 mt-3">Start with the result, not the software. The mission is created locally with a deterministic ID — no network request is made.</p>
      <form onSubmit={(e) => { e.preventDefault(); start(); }} className="mt-8" data-tour="composer">
        <label htmlFor="nm-composer" className="sr-only">Describe the result that must be true at the end</label>
        <textarea
          id="nm-composer"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the result that must be true at the end..."
          className="w-full bg-black border border-white/20 px-4 py-3.5 text-[15px] text-white placeholder:text-white/35 focus:border-[#ff5a1f] focus:outline-none"
          data-testid="new-mission-input"
        />
        <button type="submit" className="btn-primary mt-4" data-testid="new-mission-submit" disabled={!text.trim()}>
          Create mission <ArrowRight size={15} className="ax-arrow" aria-hidden="true" />
        </button>
      </form>
      <div className="mt-10">
        <p className="font-mono-ax text-[10px] uppercase tracking-wider text-white/45 mb-3">Example missions</p>
        <div className="flex flex-col gap-2 items-start">
          {COMPOSER_CHIPS.map((c, i) => (
            <button key={c} onClick={() => start(c)} className="ax-fill text-[13px] font-semibold text-white/65 border border-white/15 px-4 py-2.5" data-testid={`new-mission-example-${i}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
