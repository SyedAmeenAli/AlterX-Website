import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FOOTER_COLS, BUSINESS, SOCIALS } from "@/content/navigation";
import { EASE } from "@/lib/anim";
import NetSegment from "@/components/home/NetworkThread";

const LEGAL_ROUTES = ["/privacy", "/cookie-policy", "/terms", "/acceptable-use", "/dpa"];

export default function Footer() {
  const { pathname } = useLocation();
  const simplified = LEGAL_ROUTES.includes(pathname);
  const wrapRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting), { rootMargin: "120px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer className="text-[#fbfaf7] relative overflow-clip" style={{ background: "rgba(0,0,0,0.36)" }} data-testid="site-footer">
      <NetSegment name="footer" />
      <div className="relative z-10 max-w-[1500px] mx-auto px-6 md:px-10 pt-20">
        <p className="text-xl md:text-2xl font-semibold tracking-tight text-white/90 max-w-md">From intent to completed, reviewable work.</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mt-14 pt-12 border-t border-white/12">
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h3 className="ax-eyebrow text-white/45 mb-5">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[14px] text-white/70 hover:text-[#ff4d0a] transition-colors duration-150" data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/12 grid md:grid-cols-2 gap-8 text-[13px] text-white/55 pb-4">
          <div className="space-y-1.5">
            <p className="font-semibold text-white/75">{BUSINESS.name}</p>
            <p className="max-w-md">{BUSINESS.address}</p>
            <p>
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-[#ff4d0a] transition-colors" data-testid="footer-email">{BUSINESS.email}</a>
            </p>
            <p>
              <a href={`tel:${BUSINESS.phone1.replace(/\s/g, "")}`} className="hover:text-[#ff4d0a] transition-colors">{BUSINESS.phone1}</a>
              {" · "}
              <a href={`tel:${BUSINESS.phone2.replace(/\s/g, "")}`} className="hover:text-[#ff4d0a] transition-colors">{BUSINESS.phone2}</a>
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-end gap-3">
            {SOCIALS.length > 0 && (
              <div className="flex gap-5">
                {SOCIALS.map((s) => (
                  <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#ff4d0a] transition-colors font-medium">
                    {s.key}
                  </a>
                ))}
              </div>
            )}
            <p>© {new Date().getFullYear()} AlterX · <a href={BUSINESS.site} className="hover:text-[#ff4d0a] transition-colors">alterx.co.in</a></p>
          </div>
        </div>
      </div>

      {!simplified && (
        <div ref={wrapRef} className="relative z-10 select-none overflow-clip" data-testid="footer-wordmark">
          <motion.div
            initial={reduce ? false : { y: 28, opacity: 0.9 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Link
              to="/"
              aria-label="AlterX — Home"
              className="ax-footer-wordmark-link"
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
              }}
            >
              <div
                className={`ax-footer-wordmark ax-footer-wordmark-stack ${reduce ? "" : "ax-footer-drift"}`}
                data-paused={paused}
                style={{ fontSize: "clamp(160px, 30vw, 560px)", marginLeft: "-4vw", paddingTop: "0.06em" }}
                aria-hidden="true"
              >
                <span className="ax-footer-wordmark-outline">AlterX</span>
                <span className="ax-footer-wordmark-fill">AlterX</span>
              </div>
            </Link>
          </motion.div>
        </div>
      )}
    </footer>
  );
}
