import { useEffect, useRef, useState } from "react";
import "./event-surface.css";

/*
  ConceptualEventSurface — mechanics absorbed from a terminal-typing
  reference, fully re-skinned: no shell prompt, no fake CLI commands (npx/npm
  install/deploy — AlterX has no confirmed public CLI). Types real conceptual
  event names ONCE when scrolled into view, not looping. Mono only for the
  event strings themselves; everything else is Hanken Grotesk.
*/

const EVENTS = [
  { name: "mission.created", note: "Objective received" },
  { name: "plan.ready", note: "Route visible before any action runs" },
  { name: "approval.requested", note: "Execution pauses for a person", pause: true },
  { name: "approval.granted", note: "Decision recorded" },
  { name: "result.ready", note: "Checked result, evidence attached" },
];

export default function ConceptualEventSurface() {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(0); // how many events are printed
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    // fallback: this component sits well within the fold on the Developers
    // page — if the observer hasn't fired shortly after mount (e.g. it's
    // already in view before the observer's first callback), start anyway.
    const fallback = setTimeout(() => setVisible(true), 400);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);

  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setShown(EVENTS.length); return; }

    let cancelled = false;
    const timers = [];
    const printNext = (i) => {
      if (cancelled || i >= EVENTS.length) { setTyping(false); return; }
      setTyping(true);
      timers.push(setTimeout(() => {
        setShown(i + 1);
        setTyping(false);
        const gap = EVENTS[i].pause ? 900 : 420;
        timers.push(setTimeout(() => printNext(i + 1), gap));
      }, 260));
    };
    printNext(0);
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [visible]);

  return (
    <div className="axe-surface" ref={ref} data-testid="conceptual-event-surface">
      <div className="axe-head">
        <span className="axe-title">Execution events</span>
        <span className="axe-secondary">Conceptual preview</span>
      </div>
      <div className="axe-stream">
        {EVENTS.slice(0, shown).map((e) => (
          <div key={e.name} className="axe-line">
            <span className="axe-event">{e.name}</span>
            <span className="axe-note">{e.note}</span>
          </div>
        ))}
        {typing && <span className="axe-cursor" aria-hidden="true" />}
      </div>
      <p className="axe-footnote">Conceptual preview — developer access is managed.</p>
    </div>
  );
}
