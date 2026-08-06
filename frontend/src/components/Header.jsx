import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { NAV } from "@/content/navigation";
import { EASE } from "@/lib/anim";

const DARK_HERO_ROUTES = ["/", "/alter-engine", "/platform", "/security", "/company", "/pricing"];

const Wordmark = ({ light }) => (
  <Link to="/" className="flex items-center shrink-0" aria-label="AlterX home" data-testid="header-logo">
    <svg width="104" height="28" viewBox="0 0 104 28" aria-hidden="true">
      <defs>
        <clipPath id="ax-x-clip"><rect x="80" y="2" width="10.5" height="12" /></clipPath>
      </defs>
      <text x="0" y="22" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="21" letterSpacing="-0.5" fill={light ? "#fbfaf7" : "#090909"}>ALTER</text>
      <text x="79" y="22" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="23" fill={light ? "#fbfaf7" : "#090909"}>X</text>
      <text x="79" y="22" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="23" fill="#ff5a1f" clipPath="url(#ax-x-clip)">X</text>
    </svg>
  </Link>
);

const MenuVisual = ({ kind }) => {
  const stroke = "#ff5a1f";
  if (kind === "inventory")
    return (
      <svg viewBox="0 0 200 120" className="w-full h-28" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${30 + i * 12} ${70 - i * 18})`}>
            <path d={`M0 0 L60 -14 L120 0 L60 14 Z`} fill="none" stroke={i === 1 ? stroke : "rgba(9,9,9,.35)"} strokeWidth="1.5" />
          </g>
        ))}
        <circle cx="102" cy="38" r="4" fill={stroke} />
        <line x1="102" y1="42" x2="102" y2="84" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    );
  if (kind === "build")
    return (
      <svg viewBox="0 0 200 120" className="w-full h-28" aria-hidden="true">
        <rect x="75" y="40" width="50" height="40" fill="none" stroke={stroke} strokeWidth="1.5" />
        <line x1="20" y1="50" x2="75" y2="50" stroke="rgba(9,9,9,.4)" strokeWidth="1.5" />
        <line x1="20" y1="70" x2="75" y2="70" stroke="rgba(9,9,9,.4)" strokeWidth="1.5" />
        <line x1="125" y1="60" x2="180" y2="60" stroke={stroke} strokeWidth="1.5" />
        <circle cx="180" cy="60" r="4" fill={stroke} />
        <rect x="93" y="22" width="14" height="10" fill="none" stroke={stroke} strokeWidth="1.5" />
        <line x1="100" y1="32" x2="100" y2="40" stroke={stroke} strokeWidth="1.5" />
      </svg>
    );
  if (kind === "company" || kind === "resources")
    return (
      <svg viewBox="0 0 200 120" className="w-full h-28" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="24" y1={30 + i * 20} x2={176 - i * 26} y2={30 + i * 20} stroke={i === 0 ? stroke : "rgba(9,9,9,.35)"} strokeWidth="1.5" />
        ))}
        <circle cx={176} cy={30} r="4" fill={stroke} />
      </svg>
    );
  return (
    <svg viewBox="0 0 200 120" className="w-full h-28" aria-hidden="true">
      {["U", "P", "A", "A", "C"].map((c, i) => (
        <g key={i}>
          <rect x={16 + i * 36} y={48} width={26} height={26} fill={i === 2 ? stroke : "none"} stroke={i === 2 ? stroke : "rgba(9,9,9,.4)"} strokeWidth="1.5" />
          {i < 4 && <line x1={42 + i * 36} y1={61} x2={52 + i * 36} y2={61} stroke="rgba(9,9,9,.4)" strokeWidth="1.5" />}
        </g>
      ))}
      <text x="16" y="96" fontSize="9" fill="rgba(9,9,9,.55)" fontFamily="JetBrains Mono">UNDERSTAND · PLAN · APPROVE · ACT · CHECK</text>
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
    leaveTimer.current = setTimeout(() => setOpen(null), 160);
  }, []);

  const activeMenu = NAV.find((n) => n.key === open);

  return (
    <>
      <a href="#main" className="ax-skip">Skip to content</a>
      <header
        className="fixed top-0 left-0 right-0 z-[100] transition-colors duration-500"
        style={{ height: "var(--header-height)", background: light ? "#000" : "#fbfaf7", borderBottom: `1px solid ${light ? "rgba(255,255,255,.12)" : "rgba(9,9,9,.12)"}` }}
        data-testid="site-header"
      >
        <div className="max-w-[1500px] mx-auto h-full px-6 md:px-8 flex items-center justify-between gap-6">
          <Wordmark light={light} />
          <nav className="hidden lg:flex items-center h-full" aria-label="Primary" onMouseLeave={leave}>
            {NAV.map((item) => (
              <button
                key={item.key}
                className={`ax-fill h-[42px] px-4 text-[15px] font-semibold flex items-center gap-1.5 ${light ? "text-[#fbfaf7]" : "text-[#090909]"}`}
                data-active={open === item.key}
                onMouseEnter={() => enter(item.key)}
                onFocus={() => enter(item.key)}
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
          <div className="flex items-center gap-3">
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
              className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-full"
              style={{ width: "min(1500px, calc(100vw - 64px))" }}
              onMouseEnter={() => clearTimeout(leaveTimer.current)}
              onMouseLeave={leave}
              role="region"
              aria-label={`${activeMenu.label} menu`}
              data-testid={`mega-menu-${activeMenu.key}`}
            >
              <div className="bg-[#fbfaf7] border border-black/12 shadow-[0_40px_80px_rgba(0,0,0,.35)] grid grid-cols-[380px_1fr] max-h-[calc(100vh-120px)] overflow-y-auto">
                <Link to={activeMenu.featured.to} className="group block bg-[#f3f0e9] p-8 border-r border-black/10" data-testid="mega-menu-featured">
                  <MenuVisual kind={activeMenu.featured.visual} />
                  <h3 className="text-xl font-bold tracking-tight mt-4 text-[#090909]">{activeMenu.featured.title}</h3>
                  <p className="text-sm text-black/60 mt-2 leading-relaxed">{activeMenu.featured.body}</p>
                  <span className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-[#bd3510]">
                    Explore <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
                <div className="p-6 grid grid-cols-2 gap-1 content-start">
                  {activeMenu.links.map((l) => (
                    <Link
                      key={l.label}
                      to={l.to}
                      className={`ax-fill block px-5 py-4 ${l.accent ? "border border-[#ff5a1f]/50" : ""}`}
                      data-testid={`mega-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <span className={`flex items-center gap-2 font-bold text-[15px] ${l.accent ? "text-[#bd3510]" : "text-[#090909]"}`}>
                        {l.label} <ArrowRight size={13} className="ax-arrow" aria-hidden="true" />
                      </span>
                      <span className="block text-[13px] text-black/55 mt-0.5">{l.desc}</span>
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
                  <summary className="py-4 font-bold text-lg cursor-pointer flex items-center justify-between text-[#090909]">
                    {item.label} <ChevronDown size={16} aria-hidden="true" />
                  </summary>
                  <div className="pb-4">
                    {item.links.map((l) => (
                      <NavLink key={l.label} to={l.to} className="block py-2.5 pl-4 text-[15px] font-semibold text-black/70">
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
