import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePageMeta } from "@/lib/anim";

export default function NotFound() {
  usePageMeta("Page not found", "The page you are looking for does not exist.");
  return (
    <section className="bg-black text-[#fbfaf7] min-h-[100svh] flex items-center relative overflow-clip" style={{ paddingTop: "var(--header-height)" }} data-testid="not-found-page">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--ax-atmo-dark)" }} aria-hidden="true" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        <p className="font-mono-ax text-[12px] text-[#ff5a1f] mb-5">ERROR 404 · ROUTE NOT FOUND</p>
        <h1 className="ax-display text-5xl sm:text-6xl lg:text-[84px]">This route was<br />never planned.</h1>
        <p className="mt-6 text-white/60 max-w-md">The page you are looking for does not exist. Every good mission starts from a clear objective — pick one below.</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link to="/" className="btn-primary" data-testid="notfound-home-cta">Back to home <ArrowRight size={15} className="ax-arrow" aria-hidden="true" /></Link>
          <Link to="/try-alter-engine" className="btn-ghost-dark ax-fill">Try Alter Engine</Link>
        </div>
      </div>
    </section>
  );
}
