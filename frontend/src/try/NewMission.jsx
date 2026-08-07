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
    <div className="min-h-[calc(100vh-56px)] flex flex-col justify-center items-center px-6 py-16 relative" data-testid="new-mission-page">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,77,10,.09) 0%, rgba(255,77,10,.025) 40%, rgba(0,0,0,0) 68%)" }} aria-hidden="true" />
      <div className="relative w-full max-w-[720px]">
        <h1 className="ax-display text-3xl md:text-[42px] text-center">What outcome do you need?</h1>
        <p className="text-white/55 mt-4 text-center max-w-xl mx-auto text-[15px]">Start with the result, not the software. The mission is created locally — no network request is made.</p>
        <form onSubmit={(e) => { e.preventDefault(); start(); }} className="mt-10" data-tour="composer">
          <label htmlFor="nm-composer" className="sr-only">Describe the outcome</label>
          <div className="relative">
            <textarea
              id="nm-composer"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe the outcome…"
              className="w-full bg-black/70 border border-white/20 rounded-[6px] px-6 py-5 text-[16px] text-white placeholder:text-white/35 focus:border-[#ff4d0a] focus:outline-none transition-colors resize-none"
              data-testid="new-mission-input"
            />
          </div>
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={!text.trim()}
              className={`inline-flex items-center gap-2 rounded-[4px] px-5 py-3 text-[14px] font-semibold transition-colors ${text.trim() ? "bg-[#ff4d0a] text-black hover:bg-[#ff641d]" : "bg-white/[.07] text-white/45 cursor-not-allowed"}`}
              data-testid="new-mission-submit"
            >
              Create mission <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </form>
        <div className="mt-8">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/40 mb-3 text-center">Or start from an example</p>
          <div className="flex flex-wrap justify-center gap-2">
            {COMPOSER_CHIPS.map((c, i) => (
              <button key={c} onClick={() => start(c)} className="ax-fill text-[12.5px] font-medium text-white/65 border border-white/12 rounded-[4px] px-4 py-2.5" data-testid={`new-mission-example-${i}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
