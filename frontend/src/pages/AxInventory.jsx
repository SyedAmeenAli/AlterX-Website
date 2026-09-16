import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, Eyebrow } from "@/components/kit";
import { usePageMeta, Reveal, MaskLines } from "@/lib/anim";

/* AxInventory — the real business product built by the AlterX team.
   Operational and practical, not abstract like the Alter Engine pages.

   Content discipline: the six engineering figures, the described business
   areas (inventory, POS, purchasing, suppliers, GST, e-invoicing, e-way
   bills, accounting, analytics) and the double-entry accounting statement
   are all as given directly by the user for this page. Nothing beyond
   that — no named integrations, no named tech stack, no team/role names,
   no filing-automation claims — is asserted. The "Still building" section
   states real gaps instead of hiding them. */

const SHOP_DAY = [
  "A sale happens.",
  "Stock changes.",
  "Payment is recorded.",
  "The accounting entry is created.",
  "GST information stays attached.",
  "The owner can see what happened.",
];

const INVENTORY_LAYERS = [
  { t: "Products", d: "The catalogue — what you sell." },
  { t: "Variants", d: "Size, colour and other real differences within a product." },
  { t: "Stock", d: "What is actually on hand, right now." },
  { t: "Movement", d: "Every change to stock, in order." },
  { t: "History", d: "A record you can go back and check." },
];

const PURCHASING_STEPS = ["Supplier", "Purchase order", "Goods received", "Inventory updated"];

const CONNECTED = ["POS", "Inventory", "Purchasing", "GST", "Accounting"];

const FIGURES = [
  { n: "49", l: "Database tables" },
  { n: "162", l: "API routes" },
  { n: "39", l: "Migrations" },
  { n: "19", l: "Scheduled jobs" },
  { n: "739", l: "Unit tests" },
  { n: "518", l: "Live verification checks" },
];

const STILL_BUILDING = [
  "AI catalogue search is not active yet.",
  "The conversational assistant is not built yet.",
  "Forecasting needs more real trading history.",
];

export default function AxInventory() {
  usePageMeta("AxInventory", "Inventory, POS, purchasing, GST and accounting for Indian retail — a real product built by the AlterX team.");
  return (
    <>
      <PageHero
        eyebrow="AxInventory"
        title="The software your shop runs on."
        body="Inventory, point of sale, purchasing, GST and accounting in one system built for Indian retail."
        ctas={
          <>
            <a href="#under-the-hood" className="btn-primary">Explore AxInventory <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></a>
            <Link to="/contact" className="btn-ghost-light">Talk to us</Link>
          </>
        }
      />

      {/* THE SHOP'S DAY */}
      <section className="py-24 md:py-32 relative" style={{ background: "#020806" }} data-testid="axinventory-shops-day">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal><Eyebrow dark className="mb-6">The shop's day</Eyebrow></Reveal>
          <MaskLines as="h2" lines={["One system,", "not six separate tools."]} className="ax-display text-3xl md:text-[44px] text-[#e8f7ee] mb-14" />
          <div className="max-w-md">
            {SHOP_DAY.map((f, i) => (
              <Reveal key={f} delay={i * 0.06}>
                <div className="flex items-start gap-4 py-3">
                  <span className="text-[12px] font-semibold text-[#9fffc0] mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-lg text-[#e8f7ee]">{f}</p>
                </div>
                {i < SHOP_DAY.length - 1 && <div className="ml-[26px] h-5 w-px bg-[#9fffc0]/20" aria-hidden="true" />}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POINT OF SALE */}
      <section className="py-24 md:py-32 relative" style={{ background: "#0a1711" }} data-testid="axinventory-pos">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <Reveal><Eyebrow dark className="mb-6">Point of sale</Eyebrow></Reveal>
            <MaskLines as="h2" lines={["The till, done properly."]} className="ax-display text-3xl md:text-[40px] text-[#e8f7ee] mb-6" />
            <Reveal delay={0.1}>
              <p className="text-white/65 text-lg leading-relaxed">A sale at the till is not a separate event from the rest of the business. The moment it happens, stock, payment and the books all move together.</p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="border border-[#9fffc0]/15 bg-black/40 rounded-[10px] p-6 max-w-sm" aria-hidden="true">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#9fffc0] mb-4">New sale</p>
              <div className="space-y-2.5 mb-4">
                {[["Notebook A5", "₹240"], ["Gel pen (2)", "₹60"], ["Sticky notes", "₹90"]].map(([n, p]) => (
                  <div key={n} className="flex justify-between text-[14px] text-white/75">
                    <span>{n}</span><span>{p}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[15px] font-semibold text-[#e8f7ee] border-t border-white/10 pt-3">
                <span>Total</span><span>₹390</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INVENTORY */}
      <section className="py-24 md:py-32 relative" style={{ background: "#020806" }} data-testid="axinventory-inventory">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal><Eyebrow dark className="mb-6">Inventory</Eyebrow></Reveal>
          <MaskLines as="h2" lines={["What's on hand,", "and how it got there."]} className="ax-display text-3xl md:text-[40px] text-[#e8f7ee] mb-14 max-w-2xl" />
          <div className="border-t border-[#9fffc0]/15">
            {INVENTORY_LAYERS.map((l, i) => (
              <Reveal key={l.t} delay={i * 0.05}>
                <div className="grid md:grid-cols-[160px_1fr] gap-4 py-5 border-b border-[#9fffc0]/15">
                  <p className="text-[16px] font-semibold text-[#9fffc0]">{l.t}</p>
                  <p className="text-white/60">{l.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PURCHASING */}
      <section className="py-24 md:py-32 relative" style={{ background: "#0a1711" }} data-testid="axinventory-purchasing">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal><Eyebrow dark className="mb-6">Purchasing</Eyebrow></Reveal>
          <MaskLines as="h2" lines={["Stock in, tracked", "from the start."]} className="ax-display text-3xl md:text-[40px] text-[#e8f7ee] mb-14" />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-4" data-testid="axinventory-purchasing-flow">
            {PURCHASING_STEPS.map((s, i, arr) => (
              <React.Fragment key={s}>
                <span className="text-base md:text-lg font-semibold tracking-tight text-[#e8f7ee]">{s}</span>
                {i < arr.length - 1 && <span className="w-6 md:w-10 h-px bg-white/20" aria-hidden="true" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* GST */}
      <section className="py-24 md:py-32 relative" style={{ background: "#020806" }} data-testid="axinventory-gst">
        <div className="max-w-2xl mx-auto px-6 md:px-10">
          <Reveal><Eyebrow dark className="mb-6">GST</Eyebrow></Reveal>
          <MaskLines as="h2" lines={["Tax stays attached", "to the transaction."]} className="ax-display text-3xl md:text-[40px] text-[#e8f7ee] mb-6" />
          <Reveal delay={0.1}>
            <p className="text-white/65 text-lg leading-relaxed">Sales are classified when they happen. The system keeps the information needed for tax invoices, credit notes, debit notes, e-invoicing, e-way bills and return preparation.</p>
          </Reveal>
        </div>
      </section>

      {/* ACCOUNTING */}
      <section className="py-24 md:py-32 relative" style={{ background: "#0d2117" }} data-testid="axinventory-accounting">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <Reveal><Eyebrow dark className="mb-6">Accounting</Eyebrow></Reveal>
            <MaskLines as="h2" lines={["The books", "actually balance."]} className="ax-display text-3xl md:text-[40px] text-[#e8f7ee] mb-6" />
            <Reveal delay={0.1}>
              <p className="text-white/65 text-lg leading-relaxed">AxInventory uses real double-entry bookkeeping. Every entry keeps debits and credits balanced, and corrections do not rewrite history.</p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="flex flex-col items-center gap-3" aria-hidden="true">
              <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">Sale</span>
              <span className="w-px h-6 bg-white/20" />
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-[12px] uppercase tracking-[0.1em] text-[#9fffc0] mb-1">Debit</p>
                  <p className="text-white/70 text-sm">Cash / bank</p>
                </div>
                <span className="text-white/30 text-lg self-center">+</span>
                <div className="text-center">
                  <p className="text-[12px] uppercase tracking-[0.1em] text-[#9fffc0] mb-1">Credit</p>
                  <p className="text-white/70 text-sm">Sales revenue</p>
                </div>
              </div>
              <span className="w-px h-6 bg-white/20" />
              <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#5BEA99]">Balanced</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONNECTED SYSTEM */}
      <section className="py-24 md:py-32 relative" style={{ background: "#020806" }} data-testid="axinventory-connected">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal><Eyebrow dark className="mb-6">Connected system</Eyebrow></Reveal>
          <MaskLines as="h2" lines={["Five parts.", "One record."]} className="ax-display text-3xl md:text-[44px] text-[#e8f7ee] mb-14" />
          <div className="relative max-w-2xl mx-auto h-[260px] md:h-[300px]" data-testid="axinventory-connected-diagram">
            <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" aria-hidden="true">
              {CONNECTED.map((_, i) => {
                const angle = (i / CONNECTED.length) * 2 * Math.PI - Math.PI / 2;
                const x = 200 + Math.cos(angle) * 130;
                const y = 150 + Math.sin(angle) * 110;
                return <line key={i} x1="200" y1="150" x2={x} y2={y} stroke="rgba(159,255,192,0.25)" strokeWidth="1.4" />;
              })}
              <circle cx="200" cy="150" r="10" fill="#5BEA99" />
            </svg>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9fffc0]">Record</span>
            {CONNECTED.map((c, i) => {
              const angle = (i / CONNECTED.length) * 2 * Math.PI - Math.PI / 2;
              const x = 50 + Math.cos(angle) * 33;
              const y = 50 + Math.sin(angle) * 37;
              return (
                <span
                  key={c}
                  className="absolute text-[13px] font-semibold text-[#e8f7ee] -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {c}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ENGINEERING PROOF */}
      <section id="under-the-hood" className="py-24 md:py-32 relative" style={{ background: "#d8ffe7", scrollMarginTop: "calc(var(--header-height) + 24px)" }} data-testid="axinventory-under-the-hood">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal><Eyebrow className="mb-6">Engineering proof</Eyebrow></Reveal>
          <MaskLines as="h2" lines={["Real engineering,", "not a pitch deck."]} className="ax-display text-3xl md:text-[44px] text-[#090909] mb-14" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12">
            {FIGURES.map((f, i) => (
              <Reveal key={f.l} delay={i * 0.04}>
                <div>
                  <div className="ax-display text-4xl md:text-5xl font-semibold text-[#123d27]">{f.n}</div>
                  <p className="text-black/60 text-sm mt-2">{f.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STILL BUILDING */}
      <section className="py-16 md:py-20 relative" style={{ background: "#06120c" }} data-testid="axinventory-still-building">
        <div className="max-w-xl mx-auto px-6 md:px-10">
          <Eyebrow dark className="mb-4">Still building</Eyebrow>
          <ul className="space-y-2">
            {STILL_BUILDING.map((s) => (
              <li key={s} className="text-white/55 text-[15px]">{s}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-[#fbfaf7] py-24 text-center relative overflow-clip" style={{ background: "#0d2117" }} data-testid="axinventory-final-cta">
        <div className="relative z-[1] max-w-[760px] mx-auto px-6">
          <MaskLines as="h2" lines={["Bring us your operation."]} className="ax-display text-3xl md:text-[46px]" />
          <p className="mt-5 text-white/60 max-w-xl mx-auto">Tell us what your business runs on today and where AxInventory could take over.</p>
          <div className="mt-9 flex justify-center">
            <Link to="/contact" className="btn-primary" data-testid="axinventory-final-cta-link">Talk to us <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
