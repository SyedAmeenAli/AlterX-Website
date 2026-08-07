import React, { useState, useEffect, useCallback } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { Plus, ListChecks, ShieldCheck, Repeat, Plug, BookOpen, FileCheck, BarChart3, Settings, HelpCircle, ChevronDown, Search } from "lucide-react";
import CommandBar from "@/try/CommandBar";
import Tour from "@/try/Tour";
import { tourDone } from "@/lib/store";

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

export default function TryLayout() {
  const [expanded, setExpanded] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/try-alter-engine" && !tourDone()) {
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

  return (
    <div className="min-h-screen bg-[#090909] text-[#fbfaf7] flex flex-col" style={{ fontSize: "15px" }}>
      <a href="#try-main" className="ax-skip">Skip to content</a>

      <header className="h-[56px] shrink-0 border-b border-white/10 bg-black flex items-center justify-between px-4 gap-4 sticky top-0 z-[60]" data-testid="try-topbar">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="shrink-0" aria-label="AlterX home">
            <span className="text-[16px] font-semibold tracking-[-0.03em]">ALTER<span className="text-[#ff4d0a]">X</span></span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-[13px] font-medium text-white/60 truncate" data-testid="try-workspace-label">
            {localStorage.getItem("ax_workspace_name") || "Demo workspace"}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-white/40 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d0a] inline-block" aria-hidden="true" />
            Demo
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
                <p className="px-4 py-2.5 text-[12px] text-white/50 border-b border-white/10 leading-relaxed">This is an illustrative frontend demonstration. It does not execute external actions.</p>
                <Link to="/try-alter-engine/settings" className="block px-4 py-2 text-[13px] hover:bg-white/5" role="menuitem">Settings</Link>
                <Link to="/" className="block px-4 py-2 text-[13px] hover:bg-white/5" role="menuitem">Exit to website</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <nav
          className={`${expanded ? "w-[236px]" : "w-[68px]"} shrink-0 border-r border-white/10 bg-black transition-[width] duration-300 py-3 flex flex-col sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto overflow-x-hidden z-[50]`}
          aria-label="Application"
          data-testid="try-sidebar"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          onFocus={() => setExpanded(true)}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setExpanded(false); }}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              data-tour={`nav-${item.key}`}
              className={({ isActive }) =>
                `flex items-center gap-3.5 mx-2.5 my-0.5 px-[13px] py-2.5 rounded-[4px] text-[13.5px] font-medium whitespace-nowrap transition-colors ${
                  isActive ? "bg-[#ff4d0a] text-black" : "text-white/60 hover:text-white hover:bg-white/[.05]"
                }`
              }
              data-testid={`try-nav-${item.key}`}
              title={item.label}
            >
              <item.icon size={17} className="shrink-0" aria-hidden="true" />
              <span className={`transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0"}`}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <main id="try-main" className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <CommandBar open={cmdOpen} onClose={() => setCmdOpen(false)} onStartTour={() => { setCmdOpen(false); setTourOpen(true); }} onToggleSidebar={() => setExpanded((c) => !c)} />
      {tourOpen && <Tour onClose={() => setTourOpen(false)} />}
    </div>
  );
}
