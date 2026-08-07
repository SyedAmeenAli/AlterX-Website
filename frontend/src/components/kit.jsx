import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, MaskLines } from "@/lib/anim";

export const Eyebrow = ({ children, dark, className = "" }) => (
  <div className={`ax-eyebrow flex items-center gap-3 ${dark ? "text-[#ff4d0a]" : "text-[#c9360a]"} ${className}`}>
    <span className="inline-block w-6 h-[2px] bg-[#ff4d0a]" aria-hidden="true" />
    {children}
  </div>
);

export const ChapterHead = ({ num, eyebrow, title, body, dark, wide }) => (
  <div className={`mb-14 md:mb-20 ${wide ? "" : "max-w-3xl"}`}>
    <Reveal>
      <Eyebrow dark={dark} className="mb-6">{eyebrow}</Eyebrow>
    </Reveal>
    <MaskLines
      as="h2"
      lines={Array.isArray(title) ? title : [title]}
      className={`ax-display text-3xl sm:text-4xl lg:text-[54px] ${dark ? "text-[#fbfaf7]" : "text-[#090909]"}`}
    />
    {body && (
      <Reveal delay={0.12}>
        <p className={`mt-6 text-base md:text-lg max-w-2xl ${dark ? "text-white/70" : "text-black/70"}`}>{body}</p>
      </Reveal>
    )}
  </div>
);

export const FillLink = ({ to, children, dark, className = "", ...rest }) => (
  <Link
    to={to}
    className={`ax-fill inline-flex items-center gap-2 font-semibold text-[15px] px-5 py-3 border ${dark ? "text-[#fbfaf7] border-white/20" : "text-[#090909] border-black/20"} ${className}`}
    {...rest}
  >
    <span>{children}</span>
    <ArrowRight size={16} className="ax-arrow" aria-hidden="true" />
  </Link>
);

export const PageHero = ({ eyebrow, title, body, dark, ctas, children, tall }) => (
  <section className={`${dark ? "bg-black text-[#fbfaf7]" : "bg-[#fbfaf7] text-[#090909]"} relative overflow-clip`} style={{ paddingTop: "calc(var(--header-height) + 64px)" }}>
    {dark && <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-edge-burn)" }} aria-hidden="true" />}
    {!dark && <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-atmo-light)" }} aria-hidden="true" />}
    <div className={`relative max-w-[1400px] mx-auto px-6 md:px-10 ${tall ? "pb-28 md:pb-36" : "pb-20 md:pb-28"}`}>
      {eyebrow && <Reveal><Eyebrow dark={dark} className="mb-7">{eyebrow}</Eyebrow></Reveal>}
      <MaskLines
        as="h1"
        lines={Array.isArray(title) ? title : [title]}
        className="ax-display text-4xl sm:text-5xl lg:text-[72px] max-w-4xl"
      />
      {body && (
        <Reveal delay={0.15}>
          <p className={`mt-7 text-base md:text-lg max-w-2xl ${dark ? "text-white/70" : "text-black/70"}`}>{body}</p>
        </Reveal>
      )}
      {ctas && (
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap gap-4">{ctas}</div>
        </Reveal>
      )}
      {children}
    </div>
  </section>
);

export const EditorialRow = ({ to, index, kicker, title, desc, dark }) => (
  <Link
    to={to}
    className={`ax-fill group grid grid-cols-[1fr_auto] md:grid-cols-[240px_1fr_auto] items-center gap-4 md:gap-8 py-8 px-4 md:px-6 border-t ${dark ? "border-white/15 text-[#fbfaf7]" : "border-black/15 text-[#090909]"}`}
    data-testid={`editorial-row-${index}`}
  >
    <span className="ax-eyebrow hidden md:block opacity-60">{kicker}</span>
    <span className="min-w-0">
      <span className="block text-xl md:text-2xl font-semibold tracking-tight">{title}</span>
      {desc && <span className="block text-sm opacity-65 mt-1 max-w-xl">{desc}</span>}
    </span>
    <ArrowUpRight size={22} className="ax-arrow shrink-0" aria-hidden="true" />
  </Link>
);

export const Marquee = ({ items, dark }) => (
  <div className={`overflow-hidden py-6 border-y ${dark ? "border-white/10 bg-black" : "border-black/10 bg-[#f3f0e9]"}`} aria-hidden="true">
    <div className="ax-marquee-track">
      {[0, 1].map((rep) => (
        <div key={rep} className="flex shrink-0 items-center">
          {items.map((it, i) => (
            <span key={`${rep}-${i}`} className={`flex items-center gap-8 px-8 ax-display text-2xl md:text-4xl whitespace-nowrap ${dark ? "text-white/25" : "text-black/20"}`}>
              {it}
              <span className="w-2 h-2 bg-[#ff4d0a] inline-block" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const DemoBadge = ({ className = "" }) => (
  <span className={`inline-flex items-center gap-2 text-[12px] font-medium text-current opacity-60 ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d0a] inline-block" aria-hidden="true" />
    Demo
  </span>
);
