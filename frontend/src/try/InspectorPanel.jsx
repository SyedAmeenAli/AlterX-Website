import React from "react";

/*
  InspectorPanel — shared right-context shell for every Try Alter Engine
  page. No 3D geometry, no card wall: a slightly lifted material surface
  with thin structure lines, used consistently across Missions, Approvals,
  Workflows, Connections, Knowledge, Evidence and Usage.
*/
export function InspectorPanel({ children, testId }) {
  return (
    <aside
      className="rounded-[8px] overflow-hidden sticky top-6 border-l border-white/[.07]"
      style={{
        background:
          "radial-gradient(circle at 72% 20%, rgba(249,115,22,.09), transparent 34%), linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.012)), #0D0D0D",
      }}
      data-testid={testId}
    >
      <div className="p-6">{children}</div>
    </aside>
  );
}

export function InspectorEmpty({ children, testId }) {
  return (
    <aside className="rounded-[8px] p-6 border-l border-white/[.07]" style={{ background: "#0D0D0D" }} data-testid={testId}>
      <p className="text-white/55 text-[13.5px]">{children}</p>
    </aside>
  );
}

export function InspectorEyebrow({ children }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#ff4d0a] mb-1.5 flex items-center gap-2">
      <span className="w-3 h-[1.5px] bg-[#ff4d0a] inline-block" aria-hidden="true" />
      {children}
    </p>
  );
}

export function InspectorRow({ label, value }) {
  return (
    <div className="border-t border-white/[.07] py-2.5">
      <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40">{label}</p>
      <p className="text-[13px] text-white/80 mt-1 leading-relaxed">{value}</p>
    </div>
  );
}

/* Restrained, non-3D structure strip: Outcome — Inputs — Authority — Checks — Ready.
   Orange = configured/current, warm gray = incomplete. ~48px tall. */
export function StructureStrip({ stages }) {
  return (
    <div className="flex items-center gap-1.5 mb-6" data-testid="structure-strip">
      {stages.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${s.done ? "bg-[#ff4d0a]" : s.current ? "bg-[#ff4d0a]" : "bg-white/20"}`} aria-hidden="true" />
            <span className={`text-[9.5px] font-medium uppercase tracking-[0.08em] whitespace-nowrap ${s.done || s.current ? "text-white/70" : "text-white/30"}`}>{s.label}</span>
          </div>
          {i < stages.length - 1 && <span className={`h-px flex-1 -mt-3.5 ${s.done ? "bg-[#ff4d0a]/50" : "bg-white/10"}`} aria-hidden="true" />}
        </React.Fragment>
      ))}
    </div>
  );
}
