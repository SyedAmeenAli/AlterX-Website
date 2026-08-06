import React, { useEffect, useState, useLayoutEffect, useCallback } from "react";
import { setTourDone } from "@/lib/store";

const STEPS = [
  { target: '[data-tour="composer"]', title: "Outcome composer", body: "Every mission starts here. Describe the result that must be true at the end — not the tool you think you need." },
  { target: '[data-tour="nav-missions"]', title: "Mission lifecycle", body: "Missions move through Understand, Plan, Approve, Act and Check. Follow every mission's current state from here." },
  { target: '[data-tour="nav-workflows"]', title: "Plan and graph", body: "Every mission shows its plan and dependency graph before it runs. Successful missions can be saved here as reusable workflows." },
  { target: '[data-tour="nav-approvals"]', title: "Approval point", body: "When a step needs human authority, it pauses and appears here — with the action, reason, scope, risk and rollback." },
  { target: '[data-tour="nav-evidence"]', title: "Evidence", body: "Decisions, artifacts, checks and recovery events keep their trail. Export a mission's evidence as a real JSON file." },
  { target: '[data-tour="help"]', title: "Come back anytime", body: "Restart this tour from the help button, or press ⌘K for search and commands." },
];

export default function Tour({ onClose }) {
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState(null);

  const close = useCallback((finished) => {
    if (finished) setTourDone();
    onClose();
  }, [onClose]);

  useLayoutEffect(() => {
    const el = document.querySelector(STEPS[idx].target);
    if (el) {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top - 6, left: r.left - 6, width: r.width + 12, height: r.height + 12 });
    } else setRect(null);
  }, [idx]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") close(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const step = STEPS[idx];
  const last = idx === STEPS.length - 1;
  const tipTop = rect ? Math.min(window.innerHeight - 210, rect.top + rect.height + 14) : window.innerHeight / 2 - 100;
  const tipLeft = rect ? Math.min(window.innerWidth - 340, Math.max(16, rect.left)) : window.innerWidth / 2 - 160;

  return (
    <div className="fixed inset-0 z-[110]" role="dialog" aria-label="Product tour" data-testid="tour-overlay">
      <div className="absolute inset-0 bg-black/45" style={{ backdropFilter: "blur(1.5px)" }} onClick={() => close(false)} />
      {rect && (
        <div
          className="absolute border-2 border-[#ff5a1f] pointer-events-none transition-all duration-300"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, boxShadow: "0 0 0 9999px rgba(0,0,0,.55)" }}
          aria-hidden="true"
          data-testid="tour-spotlight"
        />
      )}
      <div className="absolute w-[320px] bg-[#fbfaf7] text-[#090909] p-5 transition-all duration-300" style={{ top: tipTop, left: tipLeft }} data-testid="tour-tooltip">
        <p className="font-mono-ax text-[10px] text-[#bd3510] uppercase tracking-wider mb-1.5">Step {idx + 1} of {STEPS.length}</p>
        <p className="font-bold text-[16px] tracking-tight">{step.title}</p>
        <p className="text-[13px] text-black/65 mt-1.5">{step.body}</p>
        <div className="flex items-center justify-between mt-5">
          <button onClick={() => close(false)} className="text-[12px] font-semibold text-black/50 hover:text-black" data-testid="tour-skip">Skip</button>
          <div className="flex gap-2">
            {idx > 0 && <button onClick={() => setIdx(idx - 1)} className="border border-black/25 px-3.5 py-1.5 text-[12px] font-bold" data-testid="tour-back">Back</button>}
            <button onClick={() => (last ? close(true) : setIdx(idx + 1))} className="bg-[#ff5a1f] text-black px-3.5 py-1.5 text-[12px] font-bold" data-testid="tour-next">
              {last ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
