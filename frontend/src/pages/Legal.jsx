import React from "react";
import { Printer } from "lucide-react";
import { LEGAL } from "@/content/legal";
import { BUSINESS } from "@/content/navigation";
import { usePageMeta } from "@/lib/anim";

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function Legal({ slug }) {
  const doc = LEGAL[slug];
  usePageMeta(doc.title, doc.summary);
  return (
    <div className="bg-[#fbfaf7] text-[#090909]" style={{ paddingTop: "calc(var(--header-height) + 56px)" }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pb-24">
        <div className="border-b border-black/15 pb-8 mb-10">
          <p className="ax-eyebrow text-[#bd3510] mb-4">Legal</p>
          <h1 className="ax-display text-4xl sm:text-5xl">{doc.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 text-[13px] text-black/55">
            <span>Last updated: {doc.updated}</span>
            <span className="font-mono-ax text-[11px] uppercase tracking-wider border border-[#bd3510]/40 text-[#bd3510] px-2 py-0.5" data-testid="legal-status">{doc.status}</span>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 font-semibold hover:text-[#bd3510] transition-colors" data-testid="legal-print-btn">
              <Printer size={13} aria-hidden="true" /> Print / download
            </button>
          </div>
          <div className="mt-6 bg-[#f3f0e9] border border-black/10 p-5 max-w-3xl">
            <p className="ax-eyebrow text-black/50 mb-2 text-[10px]">Plain-language summary</p>
            <p className="text-[15px] text-black/75">{doc.summary}</p>
          </div>
          <p className="mt-4 text-[13px] text-black/55">Contact and grievance: {BUSINESS.email} · {BUSINESS.phone1} · {BUSINESS.address}</p>
        </div>
        <div className="grid lg:grid-cols-[260px_1fr] gap-12">
          <nav className="hidden lg:block sticky top-[110px] self-start" aria-label="Document index">
            <p className="ax-eyebrow text-black/45 mb-4 text-[10px]">Document index</p>
            <ul className="space-y-2 border-l border-black/15">
              {doc.sections.map((s, i) => (
                <li key={s.h}>
                  <a href={`#${slugify(s.h)}`} className="block pl-4 py-0.5 text-[13px] text-black/60 hover:text-[#bd3510] hover:border-l-2 hover:border-[#ff5a1f] hover:-ml-[1px] transition-colors">
                    {i + 1}. {s.h}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <article className="ax-prose max-w-3xl" data-testid="legal-body">
            {doc.sections.map((s, i) => (
              <section key={s.h} id={slugify(s.h)}>
                <h2>{i + 1}. {s.h}</h2>
                {s.body.map((b, j) =>
                  typeof b === "string" ? <p key={j}>{b}</p> : (
                    <ul key={j}>{b.ul.map((li) => <li key={li}>{li}</li>)}</ul>
                  )
                )}
              </section>
            ))}
            <section className="mt-12 pt-6 border-t border-black/15">
              <p className="text-[13px] text-black/55">Contact and grievance: {BUSINESS.email} · alternate {BUSINESS.backupEmail} · {BUSINESS.phone1}</p>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}
