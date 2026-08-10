import React, { useState, useEffect, useCallback, useRef } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { Plus, ListChecks, ShieldCheck, Repeat, Plug, BookOpen, FileCheck, BarChart3, Settings, HelpCircle, ChevronDown, Search } from "lucide-react";
import CommandBar from "@/try/CommandBar";
import Tour from "@/try/Tour";
import { tourDone } from "@/lib/store";
import ParticleLogo from "@/components/ui/ParticleLogo";
import "@/try/sidebar-dock.css";

const NAV_ITEMS = [
  { to: "/try-alter-engine/new", label: "New mission", icon: Plus, key: "new" },
  { to: "/try-alter-engine/missions", label: "Missions", icon: ListChecks, key: "missions" },
  { to: "/try-alter-engine/approvals", label: "Approvals", icon: ShieldCheck, key: "approvals" },
  { to: "/try-alter-engine/workflows", label: "Workflows", icon: Repeat, key: "workflows" },
  { to: "/try-alter-engine/connections", label: "Connections", icon: Plug, key: "connections" },
  { to: "/try-alter-engine/knowledge", label: "Knowledge", icon: BookOpen, key: "knowledge" },
  { to: "/try-alter-engine/evidence", label: "Evidence", icon: FileCheck, key: "evidence" },
  { to: "/try-alter-engine/usage", label: "Usage", icon: BarChart3, key: "usage" },
  { to: "/try-alter-engine/settings", label: "Settings", icon: Settings, key: "settings" },
];

const MAG_RANGE = 78; // px — falloff radius for pointer-distance magnification
const MAG_MAX = 0.26; // hovered icon tops out at 1.26x

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const l = () => setReduced(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", l) : mq.addListener(l);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", l) : mq.removeListener(l));
  }, []);
  return reduced;
}

export default function TryLayout() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mouseY, setMouseY] = useState(null);
  const [hoverKey, setHoverKey] = useState(null);
  const itemRefs = useRef([]);
  const reducedMotion = useReducedMotion();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/try-alter-engine") && !tourDone()) {
      const t = setTimeout(() => setTourOpen(true), 900);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  const onKey = useCallback((e) => {
    const tag = document.activeElement?.tagName;
    const typing = tag === "INPUT" || tag === "TEXTAREA";
    if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
      e.preventDefault();
      setCmdOpen((o) => !o);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  useEffect(() => { setUserOpen(false); }, [location.pathname]);

  // Apple-Dock-principle proximity magnification: continuous falloff from
  // pointer Y, not a per-item :hover scale. Rail itself never moves or
  // resizes — icons scale from their own center only.
  const scaleFor = (i) => {
    if (reducedMotion || mouseY == null) return 1;
    const el = itemRefs.current[i];
    if (!el) return 1;
    const r = el.getBoundingClientRect();
    const center = r.top + r.height / 2;
    const dist = Math.abs(mouseY - center);
    const t = Math.max(0, 1 - dist / MAG_RANGE);
    return 1 + MAG_MAX * t;
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#fbfaf7] flex flex-col" style={{ fontSize: "15px" }}>
      <a href="#try-main" className="ax-skip">Skip to content</a>

      <header className="h-[56px] shrink-0 border-b border-white/10 bg-black flex items-center justify-between px-4 gap-4 sticky top-0 z-[60]" data-testid="try-topbar">
        <div className="flex items-center gap-3 min-w-0">
          <ParticleLogo light size={30} textSize={19} />
          <span className="text-white/20">/</span>
          <span className="text-[13px] font-medium text-white/60 truncate" data-testid="try-workspace-label">
            {localStorage.getItem("ax_workspace_name") || "My workspace"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCmdOpen(true)} className="hidden sm:flex items-center gap-2.5 border border-white/12 rounded-[4px] px-3 py-1.5 text-[12px] text-white/50 hover:border-[#ff4d0a]/50 transition-colors" data-testid="try-search-trigger">
            <Search size={12} aria-hidden="true" /> Search <kbd className="font-mono-ax text-[10px] border border-white/15 rounded-[3px] px-1">⌘K</kbd>
          </button>
          <button onClick={() => setTourOpen(true)} className="p-1.5 text-white/60 hover:text-[#ff4d0a] transition-colors" aria-label="Start product tour" data-testid="try-tour-btn" data-tour="help">
            <HelpCircle size={17} />
          </button>
          <div className="relative">
            <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-1.5 pl-1" aria-haspopup="true" aria-expanded={userOpen} data-testid="try-user-menu">
              <span className="w-7 h-7 rounded-[4px] bg-[#ff4d0a] text-black font-semibold text-[12px] flex items-center justify-center">DV</span>
              <ChevronDown size={13} className="text-white/50" />
            </button>
            {userOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-black border border-white/15 rounded-[4px] py-1 z-50" role="menu">
                <p className="px-4 py-2.5 text-[12px] text-white/50 border-b border-white/10 leading-relaxed">This workspace runs locally in your browser and does not perform real external actions.</p>
                <Link to="/try-alter-engine/settings" className="block px-4 py-2 text-[13px] hover:bg-white/5" role="menuitem">Settings</Link>
                <Link to="/" className="block px-4 py-2 text-[13px] hover:bg-white/5" role="menuitem">Exit to website</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <nav
          className={`axd-rail ${expanded ? "w-[212px]" : "w-[72px]"} shrink-0 border-r border-white/10 bg-black py-3 flex flex-col items-stretch sticky top-[56px] h-[calc(100vh-56px)] z-[50] transition-[width] duration-200 ease-out`}
          aria-label="Application"
          data-testid="try-sidebar"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => { setExpanded(false); setMouseY(null); setHoverKey(null); }}
          onMouseMove={(e) => setMouseY(e.clientY)}
        >
          {NAV_ITEMS.map((item, i) => (
            <div key={item.key} className="relative my-0.5 px-2.5" onMouseEnter={() => setHoverKey(item.key)} onMouseLeave={() => setHoverKey((k) => (k === item.key ? null : k))}>
              <NavLink
                to={item.to}
                end={item.key === "missions" || item.key === "workflows"}
                data-tour={`nav-${item.key}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 rounded-[9px] transition-colors duration-150 ${
                    isActive ? "bg-[#ff4d0a] text-black" : hoverKey === item.key ? "text-[#ff4d0a] bg-[#ff4d0a]/[.08]" : "text-white/55"
                  }`
                }
                data-testid={`try-nav-${item.key}`}
                aria-label={item.label}
                onFocus={() => setHoverKey(item.key)}
                onBlur={() => setHoverKey((k) => (k === item.key ? null : k))}
              >
                {({ isActive }) => (
                  <>
                    <span
                      ref={(el) => (itemRefs.current[i] = el)}
                      className="axd-item flex items-center justify-center w-9 h-9 shrink-0"
                      style={{ transform: `scale(${scaleFor(i)})`, transition: "transform 200ms cubic-bezier(.22,1,.36,1)" }}
                    >
                      <item.icon
                        size={28}
                        strokeWidth={1.8}
                        aria-hidden="true"
                        style={hoverKey === item.key ? { filter: `drop-shadow(0 0 9px rgba(249,115,22,${isActive ? ".5" : ".35"}))` } : undefined}
                      />
                    </span>
                    <span className={`text-[13.5px] font-medium whitespace-nowrap transition-opacity duration-150 ${expanded ? "opacity-100 delay-100" : "opacity-0"}`}>{item.label}</span>
                  </>
                )}
              </NavLink>
              {!expanded && hoverKey === item.key && (
                <span className="axd-tooltip pointer-events-none absolute left-full ml-2.5 top-1/2 z-50 whitespace-nowrap text-[12.5px] font-medium text-[#fbfaf7] bg-[#171717] border border-white/[.08] rounded-[6px] px-[9px] py-[6px]" role="tooltip">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
        <main id="try-main" className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <CommandBar open={cmdOpen} onClose={() => setCmdOpen(false)} onStartTour={() => { setCmdOpen(false); setTourOpen(true); }} />
      {tourOpen && <Tour onClose={() => setTourOpen(false)} />}
    </div>
  );
}
