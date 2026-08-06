import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FOOTER_COLS, BUSINESS, SOCIALS } from "@/content/navigation";
import { EASE } from "@/lib/anim";

const LETTERS = ["A", "L", "T", "E", "R", "X"];

export default function Footer() {
  return (
    <footer className="bg-black text-[#fbfaf7] relative overflow-clip" data-testid="site-footer">
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 pt-20 pb-10">
        <div className="overflow-hidden select-none" aria-hidden="true">
          <div className="flex justify-between items-end">
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                initial={{ y: "60%", opacity: 0, x: i % 2 ? 24 : -24 }}
                whileInView={{ y: 0, opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
                className={`text-[17vw] md:text-[13vw] leading-[0.85] tracking-tight ${l === "X" ? "relative text-[#fbfaf7]" : "text-[#fbfaf7]"}`}
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900 }}
              >
                {l === "X" ? (
                  <span className="relative inline-block">
                    X
                    <motion.span
                      initial={{ clipPath: "inset(100% 0 0 0)" }}
                      whileInView={{ clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)", "inset(0 0 100% 0)"] }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 1.4, delay: 0.6, times: [0, 0.5, 1], ease: "easeInOut" }}
                      className="absolute inset-0 text-[#ff5a1f]"
                      aria-hidden="true"
                    >
                      X
                    </motion.span>
                  </span>
                ) : l}
              </motion.span>
            ))}
          </div>
        </div>

        <p className="mt-10 text-lg md:text-xl font-semibold text-white/80 max-w-md">From intent to completed, reviewable work.</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mt-16 pt-12 border-t border-white/12">
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h3 className="ax-eyebrow text-white/45 mb-5">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[14px] text-white/70 hover:text-[#ff5a1f] transition-colors duration-150" data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/12 grid md:grid-cols-2 gap-8 text-[13px] text-white/50">
          <div className="space-y-1.5">
            <p className="font-bold text-white/70">{BUSINESS.name}</p>
            <p className="max-w-md">{BUSINESS.address}</p>
            <p>
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-[#ff5a1f] transition-colors" data-testid="footer-email">{BUSINESS.email}</a>
            </p>
            <p>
              <a href={`tel:${BUSINESS.phone1.replace(/\s/g, "")}`} className="hover:text-[#ff5a1f] transition-colors">{BUSINESS.phone1}</a>
              {" · "}
              <a href={`tel:${BUSINESS.phone2.replace(/\s/g, "")}`} className="hover:text-[#ff5a1f] transition-colors">{BUSINESS.phone2}</a>
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-end gap-3">
            {SOCIALS.length > 0 && (
              <div className="flex gap-5">
                {SOCIALS.map((s) => (
                  <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#ff5a1f] transition-colors font-semibold">
                    {s.key}
                  </a>
                ))}
              </div>
            )}
            <p>© {new Date().getFullYear()} AlterX · <a href={BUSINESS.site} className="hover:text-[#ff5a1f] transition-colors">alterx.co.in</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
