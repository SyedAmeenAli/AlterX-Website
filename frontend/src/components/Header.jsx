import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { NAV } from "@/content/navigation";
import { EASE } from "@/lib/anim";
import LetterGlitch from "@/components/ui/LetterGlitch";
import ParticleLogo from "@/components/ui/ParticleLogo";
import CognitiveCubeMatrix from "@/components/visuals/CognitiveCubeMatrix";
import AlterEngineAssembly from "@/components/visuals/AlterEngineAssembly";
import CustomWorkflowStack from "@/components/visuals/CustomWorkflowStack";
import BuildWithAlterXGrid from "@/components/visuals/BuildWithAlterXGrid";
import AIWebsiteAdaptiveGrid from "@/components/visuals/AIWebsiteAdaptiveGrid";
import SolutionsRotatingCube from "@/components/visuals/SolutionsRotatingCube";
import VoiceAgentOrb from "@/components/visuals/VoiceAgentOrb";
import AlterXResourcesFolder from "@/components/visuals/AlterXResourcesFolder";

const DARK_HERO_ROUTES = ["/", "/alter-engine", "/platform", "/security", "/company", "/pricing", "/developers"];

/* nav hover activation — orange gooey fill + a few tight particles,
   layered on the existing enter/leave + mega-menu state machine below.
   Does not touch menu timing or positioning. */
const GOOEY_COLORS = ["#F97316", "#FF5A1F", "#F9F9F9", "#C94312"];

const Wordmark = ({ light }) => <ParticleLogo light={light} size={40} textSize={25} />;

/* Solutions — one small scene, reused across all four solution rows, only
   the emphasized element changes on hover. Same shape language as the
   destination pages (attention dot / particle pair / reorganizing surface
   / gated flow) — not four unrelated icons. */
const SolutionsVisual = ({ emphasis }) => {
  // One shared AlterXGeometry family across all four — cognitive/workflows
  // use the cube variants already built; voice/websites use the calmer
  // signal/planes variants. No flat SVG illustration for any of the four.
  if (emphasis === "cognitive") return <div className="w-full h-32" style={{ background: "#090909", borderRadius: 6 }}><CognitiveCubeMatrix active size="home" interactive={false} /></div>;
  if (emphasis === "workflows") return <div className="w-full h-32"><CustomWorkflowStack active size="nav" /></div>;
  if (emphasis === "voice") return <div className="w-full h-40 flex items-center justify-center"><VoiceAgentOrb active size="nav" /></div>;
  if (emphasis === "websites") return <div className="w-full h-32"><AIWebsiteAdaptiveGrid active size="nav" /></div>;
  // nothing hovered — the parent Solutions identity itself
  return <div className="w-full h-32"><SolutionsRotatingCube size="preview" /></div>;
};

/* Company — typography as the visual, not a diagram. */
const CompanyVisual = ({ emphasis }) => (
  <svg viewBox="0 0 220 140" className="w-full h-32" aria-hidden="true">
    <text x="14" y="90" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="52" fill="#090909" letterSpacing="-0.01em">
      ALTER<tspan fill={emphasis ? "#ff4d0a" : "#c9360a"}>X</tspan>
    </text>
    <text x="14" y="112" fontSize="10.5" fill="rgba(9,9,9,.45)" fontFamily="Hanken Grotesk" fontWeight="500" letterSpacing="0.1em">EST. HYDERABAD</text>
  </svg>
);

const MenuVisual = ({ kind, emphasis }) => {
  if (kind === "solutions") return <SolutionsVisual emphasis={emphasis} />;
  if (kind === "company") return <CompanyVisual emphasis={emphasis} />;
  if (kind === "build") {
    // Same continuously-shuffling grid identity for every Developers link —
    // one consistent interaction across the whole menu, not a different
    // visual per sub-item.
    return (
      <div className="relative w-full h-32" style={{ background: "#090909", borderRadius: 6 }}>
        <BuildWithAlterXGrid active size="nav" />
      </div>
    );
  }
  if (kind === "resources") {
    // Same folder identity for every Resources sub-link — only the paper
    // arrangement changes per hovered link, so the object itself visibly
    // reconfigures on each hover instead of swapping to a different visual.
    const RES_STATE_MAP = { matrix: "all", guides: "guides", insights: "insights", featured: "featured" };
    const resState = RES_STATE_MAP[emphasis] || "rest";
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <AlterXResourcesFolder size="nav" active={!!emphasis} state={resState} />
      </div>
    );
  }
  /* engine — the same AlterEngineAssembly identity used on the homepage
     tile and the Alter Engine page hero. Nav version is compact, no
     pointer tilt (interactive=false inside the component for size="nav").
     "How it works" and "Human approvals" get real distinct states, not
     just the same object re-hovered. */
  const ENGINE_STATE_MAP = { lifecycle: "sequence", authority: "boundary", platform: "platform", recovery: "split", try: "assemble" };
  const engineVisState = ENGINE_STATE_MAP[emphasis] || "core";
  return (
    <div className="w-full h-32">
      <AlterEngineAssembly active={!!emphasis} size="nav" state={engineVisState} label={emphasis === "authority" ? "Approval required" : null} />
    </div>
  );
};

export default function Header() {
  const location = useLocation();
  const darkHero = DARK_HERO_ROUTES.includes(location.pathname);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const enterTimer = useRef();
  const leaveTimer = useRef();
  const navRef = useRef(null);
  const reduce = useReducedMotion();
  const itemRefs = useRef([]);
  const gooeyRef = useRef(null);
  const particleTimeouts = useRef([]);

  const prevOpen = useRef(null);

  const positionGooey = useCallback((key, coldStart) => {
    const nav = navRef.current;
    const idx = NAV.findIndex((n) => n.key === key);
    const item = itemRefs.current[idx];
    const gooey = gooeyRef.current;
    if (!nav || !item || !gooey) return;
    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    // cold start (nothing was active): slower, more visible formation.
    // moving between adjacent items: the surface morphs, quicker.
    gooey.style.transitionDuration = coldStart ? "520ms, 520ms, 520ms, 520ms, 220ms, 480ms" : "340ms, 340ms, 340ms, 340ms, 160ms, 300ms";
    gooey.style.left = `${itemRect.left - navRect.left}px`;
    gooey.style.top = `${itemRect.top - navRect.top}px`;
    gooey.style.width = `${itemRect.width}px`;
    gooey.style.height = `${itemRect.height}px`;
  }, []);

  const spawnParticles = useCallback(() => {
    const gooey = gooeyRef.current;
    if (!gooey || reduce) return;
    particleTimeouts.current.forEach(clearTimeout);
    particleTimeouts.current = [];
    gooey.querySelectorAll("[data-nav-particle]").forEach((n) => n.remove());
    const count = 11;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const distance = 24 + Math.random() * 22;
      p.dataset.navParticle = "true";
      p.className = "ax-nav-particle";
      p.style.setProperty("--px", `${Math.cos(angle) * distance}px`);
      p.style.setProperty("--py", `${Math.sin(angle) * distance}px`);
      p.style.setProperty("--psize", `${2.5 + Math.random() * 2.5}px`);
      // mostly orange — warm white rare
      p.style.setProperty("--pcolor", Math.random() < 0.82 ? GOOEY_COLORS[Math.floor(Math.random() * 2)] : GOOEY_COLORS[Math.random() < 0.6 ? 2 : 3]);
      p.style.setProperty("--pdelay", `${Math.random() * 100}ms`);
      gooey.appendChild(p);
      particleTimeouts.current.push(setTimeout(() => p.remove(), 850));
    }
  }, [reduce]);

  useLayoutEffect(() => {
    setHoveredLink(null);
    if (!open) { prevOpen.current = null; return; }
    positionGooey(open, prevOpen.current === null);
    spawnParticles();
    prevOpen.current = open;
  }, [open, positionGooey, spawnParticles]);

  useEffect(() => {
    const onResize = () => { if (open) positionGooey(open); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); particleTimeouts.current.forEach(clearTimeout); };
  }, [open, positionGooey]);

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
          <nav ref={navRef} className="hidden lg:flex items-center h-full justify-self-center relative" aria-label="Primary" onMouseLeave={leave}>
            <div ref={gooeyRef} className={`ax-nav-gooey ${open ? "is-active" : ""}`} aria-hidden="true" />
            {NAV.map((item, idx) => (
              <button
                key={item.key}
                data-nav-root
                ref={(el) => (itemRefs.current[idx] = el)}
                className="ax-nav-trigger relative z-[2] h-[42px] px-4 text-[15px] font-medium flex items-center gap-1.5"
                style={{ color: open === item.key ? "#090909" : light ? "#fbfaf7" : "#090909" }}
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
              initial={{ opacity: 0, y: -8, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -6, x: "-50%" }}
              transition={{ duration: 0.24, ease: EASE }}
              className="megaMenu hidden lg:block"
              style={{
                position: "fixed",
                top: "calc(var(--header-height) + 10px)",
                left: "50%",
                right: "auto",
                width: "min(1500px, calc(100vw - 48px))",
                maxHeight: "calc(100svh - var(--header-height) - 30px)",
                margin: 0,
              }}
              onMouseEnter={() => clearTimeout(leaveTimer.current)}
              onMouseLeave={leave}
              role="region"
              aria-label={`${activeMenu.label} menu`}
              data-testid={`mega-menu-${activeMenu.key}`}
            >
              <div className="bg-[#fbfaf7] border border-black/15 rounded-[4px] shadow-[0_40px_80px_rgba(0,0,0,.4)] grid grid-cols-[400px_1fr] max-h-[calc(100vh-var(--header-height)-40px)] overflow-y-auto">
                {activeMenu.key === "security" ? (
                  <Link to={activeMenu.featured.to} className="group relative block overflow-clip isolate border-r border-black/10" style={{ background: "#090909" }} data-testid="mega-menu-featured">
                    <div className="absolute inset-0 z-0" aria-hidden="true">
                      <LetterGlitch glitchSpeed={55} centerVignette={false} outerVignette={true} smooth={true} colors={["#ffffff", "#F97316", "#62686a"]} />
                    </div>
                    {/* extremely subtle black → burnt-orange, only near the active region — not over the whole field */}
                    <div
                      className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-300"
                      style={{ background: "radial-gradient(circle at 30% 70%, rgba(201,67,10,.16), transparent 45%)", opacity: hoveredLink ? 1 : 0 }}
                      aria-hidden="true"
                    />
                    <div className="relative z-[2] p-9">
                      <h3 className="text-[22px] font-semibold tracking-tight mt-[104px] text-[#fbfaf7] leading-snug">{activeMenu.featured.title}</h3>
                      <p className="text-sm text-white/65 mt-2.5 leading-relaxed">{activeMenu.featured.body}</p>
                      <span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#ff4d0a]">
                        Explore <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ) : ["engine", "developers", "solutions"].includes(activeMenu.key) ? (
                  // MegaVisualStage — controlled dark stage, one shared
                  // AlterXGeometry family object per section, atmospheric
                  // orange gradient concentrating toward the active region.
                  <Link to={activeMenu.featured.to} className="group relative block overflow-clip isolate border-r border-black/10" style={{ background: "#090909" }} data-testid="mega-menu-featured">
                    <div
                      className="absolute inset-0 z-0 pointer-events-none transition-[background] duration-300"
                      style={{ background: `radial-gradient(circle at 60% 42%, rgba(249,115,22,${hoveredLink ? ".22" : ".14"}), transparent 32%), #090909` }}
                      aria-hidden="true"
                    />
                    <div className="relative z-[1] p-9">
                      <MenuVisual kind={activeMenu.featured.visual} emphasis={hoveredLink} />
                      <h3 className="text-[22px] font-semibold tracking-tight mt-5 text-[#fbfaf7] leading-snug whitespace-pre-line">{activeMenu.featured.title}</h3>
                      <p className="text-sm text-white/65 mt-2.5 leading-relaxed">{activeMenu.featured.body}</p>
                      <span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#ff4d0a]">
                        Explore <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link to={activeMenu.featured.to} className="group block bg-[#f3f0e9] p-9 border-r border-black/10" data-testid="mega-menu-featured">
                    <MenuVisual kind={activeMenu.featured.visual} emphasis={hoveredLink} />
                    <h3 className="text-[22px] font-semibold tracking-tight mt-5 text-[#090909] leading-snug whitespace-pre-line">{activeMenu.featured.title}</h3>
                    <p className="text-sm text-black/65 mt-2.5 leading-relaxed">{activeMenu.featured.body}</p>
                    <span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#c9360a]">
                      Explore <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                )}
                <div className="p-7 grid grid-cols-2 gap-x-2 gap-y-1 content-start">
                  {activeMenu.links.map((l) => (
                    <Link
                      key={l.label}
                      to={l.to}
                      className="ax-fill block px-5 py-4 rounded-[3px]"
                      onMouseEnter={() => setHoveredLink(l.visualKey || null)}
                      onMouseLeave={() => setHoveredLink(null)}
                      onFocus={() => setHoveredLink(l.visualKey || null)}
                      onBlur={() => setHoveredLink(null)}
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
            initial={{ opacity: 0, pointerEvents: "none" }}
            animate={{ opacity: 1, pointerEvents: "auto" }}
            exit={{ opacity: 0, pointerEvents: "none" }}
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
