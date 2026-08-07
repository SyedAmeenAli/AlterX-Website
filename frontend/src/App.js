import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Home from "@/pages/Home";
import AlterEngine from "@/pages/AlterEngine";
import Platform from "@/pages/Platform";
import Products from "@/pages/Products";
import CognitiveAI from "@/pages/CognitiveAI";
import Solutions from "@/pages/Solutions";
import SolutionDetail from "@/pages/SolutionDetail";
import CustomWorkflows from "@/pages/CustomWorkflows";
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
import Connections from "@/try/Connections";
import Knowledge from "@/try/Knowledge";
import Evidence from "@/try/Evidence";
import Usage from "@/try/Usage";
import TrySettings from "@/try/TrySettings";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
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
          <Route path="/products" element={<Products />} />
          <Route path="/cognitive-ai" element={<CognitiveAI />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/cognitive-ai" element={<CognitiveAI />} />
          <Route path="/solutions/custom-workflows" element={<CustomWorkflows />} />
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
