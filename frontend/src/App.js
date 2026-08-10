import React, { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketingGrainientBackground from "@/components/marketing/MarketingGrainientBackground";

import Home from "@/pages/Home";
import AlterEngine from "@/pages/AlterEngine";
import Platform from "@/pages/Platform";
import CognitiveAI from "@/pages/CognitiveAI";
import Solutions from "@/pages/Solutions";
import SolutionDetail from "@/pages/SolutionDetail";
import CustomWorkflows from "@/pages/CustomWorkflows";
import VoiceWorkflows from "@/pages/VoiceWorkflows";
import Developers from "@/pages/Developers";
import Integrations from "@/pages/Integrations";
import Security from "@/pages/Security";
import Work from "@/pages/Work";
import WorkDetail from "@/pages/WorkDetail";
import Resources from "@/pages/Resources";
import ResourceDetail from "@/pages/ResourceDetail";
import Company from "@/pages/Company";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import Pricing from "@/pages/Pricing";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/NotFound";

import TryLayout from "@/try/TryLayout";
import TryHome from "@/try/TryHome";
import NewMission from "@/try/NewMission";
import Missions from "@/try/Missions";
import MissionDetail from "@/try/MissionDetail";
import Approvals from "@/try/Approvals";
import Workflows from "@/try/Workflows";
import WorkflowComposer from "@/try/WorkflowComposer";
import WorkflowDetail from "@/try/WorkflowDetail";
import Connections from "@/try/Connections";
import Knowledge from "@/try/Knowledge";
import Evidence from "@/try/Evidence";
import Usage from "@/try/Usage";
import TrySettings from "@/try/TrySettings";

// Single deterministic scroll controller for the whole app — nothing else
// (no native hash auto-scroll, no per-page effect) should move the
// viewport on navigation. Rule: cross-route = instant/auto positioning,
// same-page anchor = smooth scroll. Cross-route hash links (e.g. the
// footer's /alter-engine#faq from any other page) previously always used
// "smooth", which animated from wherever the OLD page had scrolled to —
// visually reading as "stuck near the footer" when that old position
// happened to overlap the new page's footer-ish region.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const routeChanged = prevPathname.current !== pathname;
    prevPathname.current = pathname;

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // route just changed underneath this hash — the target section may
      // not be laid out yet in the same tick (fonts/images/animated
      // entrances can still shift it); wait two frames so its position is
      // final, then jump instantly. Never animate across a route change.
      if (routeChanged) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
          });
        });
        return;
      }
      // same route, just the hash changed (e.g. clicking another in-page
      // anchor) — smooth scroll makes sense here.
      document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      return;
    }

    // route change to a different page with no hash — land at top
    // instantly, never a long smooth scroll back up from wherever the
    // previous page left off. Explicit "auto" is required: with global
    // `scroll-behavior: smooth` on <html>, an unqualified scrollTo would
    // otherwise inherit that and animate.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <MarketingGrainientBackground />
      <div className="marketingContent">
        <Header />
        <main id="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/alter-engine" element={<AlterEngine />} />
          <Route path="/platform" element={<Platform />} />
          {/* /products was a duplicate index of Alter Engine content; no
              longer part of primary navigation — redirect, don't 404. */}
          <Route path="/products" element={<Navigate to="/alter-engine" replace />} />
          <Route path="/cognitive-ai" element={<CognitiveAI />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/cognitive-ai" element={<CognitiveAI />} />
          <Route path="/solutions/custom-workflows" element={<CustomWorkflows />} />
          <Route path="/solutions/voice-workflows" element={<VoiceWorkflows />} />
          <Route path="/solutions/:slug" element={<SolutionDetail />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/security" element={<Security />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:slug" element={<ResourceDetail />} />
          <Route path="/company" element={<Company />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Legal slug="privacy" />} />
          <Route path="/cookie-policy" element={<Legal slug="cookie-policy" />} />
          <Route path="/terms" element={<Legal slug="terms" />} />
          <Route path="/acceptable-use" element={<Legal slug="acceptable-use" />} />
          <Route path="/dpa" element={<Legal slug="dpa" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/try-alter-engine" element={<TryLayout />}>
          <Route index element={<TryHome />} />
          <Route path="new" element={<NewMission />} />
          <Route path="missions" element={<Missions />} />
          <Route path="missions/:id" element={<MissionDetail />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="workflows/new" element={<WorkflowComposer />} />
          <Route path="workflows/:id" element={<WorkflowDetail />} />
          <Route path="connections" element={<Connections />} />
          <Route path="knowledge" element={<Knowledge />} />
          <Route path="evidence" element={<Evidence />} />
          <Route path="usage" element={<Usage />} />
          <Route path="settings" element={<TrySettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
