import React, { useState, useEffect, useCallback } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { Plus, ListChecks, ShieldCheck, Repeat, Plug, BookOpen, FileCheck, BarChart3, Settings, HelpCircle, PanelLeft, ChevronDown } from "lucide-react";
import CommandBar from "@/try/CommandBar";
import Tour from "@/try/Tour";
import { tourDone } from "@/lib/store";
import { DemoBadge } from "@/components/kit";

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
  const [collapsed, setCollapsed] = useState(false);
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
      <header className="h-[56px] shrink-0 border-b border-white/12 bg-black flex items-center justify-between px-4 gap-4 sticky top-0 z-[60]" data-testid="try-topbar">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 text-white/60 hover:text-[#ff5a1f] transition-colors" aria-label="Toggle sidebar" data-testid="try-sidebar-toggle">
            <PanelLeft size={17} />
          </button>
          <Link to="/" className="shrink-0" aria-label="AlterX home">
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900 }} className="text-[15px]">ALTER<span className="text-[#ff5a1f]">X</span></span>
          </Link>
          <span className="text-white/25">/</span>
          <span className="font-mono-ax text-[11px] text-white/55 truncate" data-testid="try-workspace-label">
            {localStorage.getItem("ax_workspace_name") || "Demo workspace"}
          </span>
        </div>
        <DemoBadge className="hidden md:inline-flex" />
        <div className="flex items-center gap-2">
          <button onClick={() => setCmdOpen(true)} className="hidden sm:flex items-center gap-2 border border-white/15 px-3 py-1.5 text-[12px] text-white/50 hover:border-[#ff5a1f]/50 transition-colors" data-testid="try-search-trigger">
            Search <kbd className="font-mono-ax text-[10px] border border-white/20 px-1">⌘K</kbd>
          </button>
          <button onClick={() => setTourOpen(true)} className="p-1.5 text-white/60 hover:text-[#ff5a1f] transition-colors" aria-label="Start product tour" data-testid="try-tour-btn" data-tour="help">
            <HelpCircle size={17} />
          </button>
          <div className="relative">
            <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-1.5 pl-1" aria-haspopup="true" aria-expanded={userOpen} data-testid="try-user-menu">
              <span className="w-7 h-7 bg-[#ff5a1f] text-black font-bold text-[12px] flex items-center justify-center">DV</span>
              <ChevronDown size={13} className="text-white/50" />
            </button>
            {userOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-black border border-white/15 py-1 z-50" role="menu">
                <p className="px-4 py-2 text-[12px] text-white/45 border-b border-white/10">Demo visitor · illustrative session</p>
                <Link to="/try-alter-engine/settings" className="block px-4 py-2 text-[13px] hover:bg-white/5" role="menuitem">Settings</Link>
                <Link to="/" className="block px-4 py-2 text-[13px] hover:bg-white/5" role="menuitem">Exit to website</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <nav className={`${collapsed ? "w-[52px]" : "w-[210px]"} shrink-0 border-r border-white/12 bg-black transition-[width] duration-200 py-3 flex flex-col sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto z-[50]`} aria-label="Application" data-testid="try-sidebar">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              data-tour={`nav-${item.key}`}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold border-l-2 transition-colors ${isActive ? "border-[#ff5a1f] text-[#ff5a1f] bg-white/[.04]" : "border-transparent text-white/60 hover:text-white"}`}
              data-testid={`try-nav-${item.key}`}
              title={item.label}
            >
              <item.icon size={16} className="shrink-0" aria-hidden="true" />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>
        <main id="try-main" className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <CommandBar open={cmdOpen} onClose={() => setCmdOpen(false)} onStartTour={() => { setCmdOpen(false); setTourOpen(true); }} onToggleSidebar={() => setCollapsed((c) => !c)} />
      {tourOpen && <Tour onClose={() => setTourOpen(false)} />}
    </div>
  );
}
