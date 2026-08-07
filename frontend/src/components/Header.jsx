import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { NAV } from "@/content/navigation";
import { EASE } from "@/lib/anim";

const DARK_HERO_ROUTES = ["/", "/alter-engine", "/platform", "/security", "/company", "/pricing", "/developers"];

const Wordmark = ({ light }) => (
  <Link to="/" className="flex items-center shrink-0" aria-label="AlterX home" data-testid="header-logo">
    <span className="text-[20px] font-semibold tracking-[-0.03em] leading-none" style={{ color: light ? "#fbfaf7" : "#090909" }}>
      ALTER<span className="text-[#ff4d0a]">X</span>
    </span>
  </Link>
);

const MenuVisual = ({ kind }) => {
  const stroke = "#ff4d0a";
  if (kind === "inventory")
    return (
      <svg viewBox="0 0 220 140" className="w-full h-32" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${34 + i * 12} ${84 - i * 20})`}>
            <path d={`M0 0 L66 -16 L132 0 L66 16 Z`} fill={i === 1 ? "rgba(255,77,10,.06)" : "none"} stroke={i === 1 ? stroke : "rgba(9,9,9,.3)"} strokeWidth="1.5" />
          </g>
        ))}
        <circle cx="112" cy="44" r="4.5" fill={stroke} />
        <path d="M112 49 L112 96" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 4" fill="none" />
      </svg>
    );
  if (kind === "build")
    return (
      <svg viewBox="0 0 220 140" className="w-full h-32" aria-hidden="true">
        <path d="M64 34 L52 34 L52 106 L64 106" fill="none" stroke="rgba(9,9,9,.4)" strokeWidth="1.5" />
        <path d="M156 34 L168 34 L168 106 L156 106" fill="none" stroke="rgba(9,9,9,.4)" strokeWidth="1.5" />
        <rect x="84" y="52" width="52" height="36" fill="rgba(255,77,10,.07)" stroke={stroke} strokeWidth="1.5" />
        <path d="M20 62 L84 62 M20 80 L84 80" stroke="rgba(9,9,9,.35)" strokeWidth="1.5" />
        <path d="M136 70 L200 70" stroke={stroke} strokeWidth="1.5" />
        <circle cx="200" cy="70" r="4.5" fill={stroke} />
      </svg>
    );
  if (kind === "company" || kind === "resources")
    return (
      <svg viewBox="0 0 220 140" className="w-full h-32" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M28 ${38 + i * 22} L${192 - i * 30} ${38 + i * 22}`} stroke={i === 0 ? stroke : "rgba(9,9,9,.3)"} strokeWidth="1.5" fill="none" />
        ))}
        <circle cx="192" cy="38" r="4.5" fill={stroke} />
      </svg>
    );
  /* engine — five-stage route with approval gate */
  return (
    <svg viewBox="0 0 220 140" className="w-full h-32" aria-hidden="true">
      <path d="M14 70 L58 70 C 70 70 74 50 88 50 L110 50" fill="none" stroke={stroke} strokeWidth="2" />
      <path d="M58 70 C 70 70 74 92 88 92 L110 92" fill="none" stroke="rgba(9,9,9,.35)" strokeWidth="1.5" />
      <path d="M110 50 C 128 50 130 70 144 70" fill="none" stroke="rgba(9,9,9,.35)" strokeWidth="1.5" />
      <path d="M110 92 C 128 92 130 70 144 70" fill="none" stroke="rgba(9,9,9,.35)" strokeWidth="1.5" />
      <rect x="144" y="58" width="24" height="24" fill="none" stroke={stroke} strokeWidth="2" transform="rotate(45 156 70)" />
      <path d="M168 70 L206 70" fill="none" stroke="rgba(9,9,9,.35)" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="14" cy="70" r="4" fill={stroke} />
      <circle cx="206" cy="70" r="4.5" fill="none" stroke={stroke} strokeWidth="2" />
      <text x="14" y="124" fontSize="11" fill="rgba(9,9,9,.6)" fontFamily="Hanken Grotesk" fontWeight="500" letterSpacing="0.06em">Understand · Plan · Approve · Act · Check</text>
    </svg>
  );
};

export default function Header() {
  const location = useLocation();
  const darkHero = DARK_HERO_ROUTES.includes(location.pathname);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const enterTimer = useRef();
  const leaveTimer = useRef();
  const navRef = useRef(null);

  useEffect(() => {
    let threshold = window.innerHeight * 0.72;
    const onScroll = () => {
      const s = window.scrollY > threshold;
      setScrolled((prev) => (prev === s ? prev : s));
      if (open) setOpen(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => { setOpen(null); setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setOpen(null); setMobileOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const light = darkHero && !scrolled;

  const enter = useCallback((key) => {
    clearTimeout(leaveTimer.current);
    clearTimeout(enterTimer.current);
    enterTimer.current = setTimeout(() => setOpen(key), 70);
  }, []);
  const leave = useCallback(() => {
    clearTimeout(enterTimer.current);
    leaveTimer.current = setTimeout(() => setOpen(null), 150);
  }, []);

  const onNavKey = (e, idx) => {
    const buttons = navRef.current?.querySelectorAll("button[data-nav-root]");
    if (!buttons) return;
    if (e.key === "ArrowRight") { e.preventDefault(); buttons[(idx + 1) % buttons.length]?.focus(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); buttons[(idx - 1 + buttons.length) % buttons.length]?.focus(); }
    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      document.querySelector(`[data-testid="mega-menu-${open}"] a`)?.focus();
    }
  };

  const activeMenu = NAV.find((n) => n.key === open);

  return (
    <>
      <a href="#main" className="ax-skip">Skip to content</a>
      <header
        className="fixed top-0 left-0 right-0 z-[100] transition-colors duration-500"
        style={{ height: "var(--header-height)", background: light ? "#000" : "#fbfaf7", borderBottom: `1px solid ${light ? "rgba(255,255,255,.12)" : "rgba(9,9,9,.12)"}` }}
        data-testid="site-header"
      >
        <div className="max-w-[1500px] mx-auto h-full px-6 md:px-8 grid items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
          <div className="justify-self-start"><Wordmark light={light} /></div>
          <nav ref={navRef} className="hidden lg:flex items-center h-full justify-self-center" aria-label="Primary" onMouseLeave={leave}>
            {NAV.map((item, idx) => (
              <button
                key={item.key}
                data-nav-root
                className={`ax-fill h-[42px] px-4 text-[15px] font-medium flex items-center gap-1.5 ${light ? "text-[#fbfaf7]" : "text-[#090909]"}`}
                data-active={open === item.key}
                onMouseEnter={() => enter(item.key)}
                onFocus={() => enter(item.key)}
                onKeyDown={(e) => onNavKey(e, idx)}
                onClick={() => setOpen(open === item.key ? null : item.key)}
                aria-expanded={open === item.key}
                aria-haspopup="true"
                data-testid={`nav-trigger-${item.key}`}
              >
                {item.label}
                <ChevronDown size={13} className={`transition-transform duration-200 ${open === item.key ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 justify-self-end">
            <Link to="/try-alter-engine" className="btn-primary !hidden sm:!inline-flex !py-2.5 !px-5 text-[14px] whitespace-nowrap" data-testid="header-try-cta">
              Try Alter Engine <ArrowRight size={15} className="ax-arrow" aria-hidden="true" />
            </Link>
            <button
              className={`lg:hidden p-2 ${light ? "text-[#fbfaf7]" : "text-[#090909]"}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              data-testid="mobile-menu-toggle"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: EASE }}
              className="hidden lg:block absolute left-1/2 -translate-x-1/2"
              style={{ width: "min(1500px, calc(100vw - 48px))", top: "calc(var(--header-height) + 10px)" }}
              onMouseEnter={() => clearTimeout(leaveTimer.current)}
              onMouseLeave={leave}
              role="region"
              aria-label={`${activeMenu.label} menu`}
              data-testid={`mega-menu-${activeMenu.key}`}
            >
              <div className="bg-[#fbfaf7] border border-black/15 rounded-[4px] shadow-[0_40px_80px_rgba(0,0,0,.4)] grid grid-cols-[400px_1fr] max-h-[calc(100vh-var(--header-height)-40px)] overflow-y-auto">
                <Link to={activeMenu.featured.to} className="group block bg-[#f3f0e9] p-9 border-r border-black/10" data-testid="mega-menu-featured">
                  <MenuVisual kind={activeMenu.featured.visual} />
                  <h3 className="text-[22px] font-semibold tracking-tight mt-5 text-[#090909] leading-snug">{activeMenu.featured.title}</h3>
                  <p className="text-sm text-black/65 mt-2.5 leading-relaxed">{activeMenu.featured.body}</p>
                  <span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#c9360a]">
                    Explore <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
                <div className="p-7 grid grid-cols-2 gap-x-2 gap-y-1 content-start">
                  {activeMenu.links.map((l) => (
                    <Link
                      key={l.label}
                      to={l.to}
                      className="ax-fill block px-5 py-4 rounded-[3px]"
                      data-testid={`mega-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <span className={`flex items-center gap-2 font-semibold text-[15px] ${l.accent ? "text-[#c9360a]" : "text-[#090909]"}`}>
                        {l.label} <ArrowRight size={13} className="ax-arrow" aria-hidden="true" />
                      </span>
                      <span className="block text-[13px] text-black/60 mt-0.5">{l.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="hidden lg:block fixed inset-0 z-[90] bg-black/55"
            style={{ top: "var(--header-height)" }}
            onClick={() => setOpen(null)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-[95] bg-[#fbfaf7] overflow-y-auto"
            style={{ top: "var(--header-height)" }}
            data-testid="mobile-menu"
          >
            <nav className="p-6" aria-label="Mobile">
              {NAV.map((item) => (
                <details key={item.key} className="border-b border-black/10">
                  <summary className="py-4 font-semibold text-lg cursor-pointer flex items-center justify-between text-[#090909]">
                    {item.label} <ChevronDown size={16} aria-hidden="true" />
                  </summary>
                  <div className="pb-4">
                    {item.links.map((l) => (
                      <NavLink key={l.label} to={l.to} className="block py-2.5 pl-4 text-[15px] font-medium text-black/70">
                        {l.label}
                      </NavLink>
                    ))}
                  </div>
                </details>
              ))}
              <Link to="/try-alter-engine" className="btn-primary w-full justify-center mt-6" data-testid="mobile-try-cta">
                Try Alter Engine <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
