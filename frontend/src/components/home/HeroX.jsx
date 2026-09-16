import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HERO } from "@/content/home";
import { EASE } from "@/lib/anim";
import NetSegment from "@/components/home/NetworkThread";
import AlterXBlob from "@/components/home/AlterXBlob";

const PHRASE_HOLD = 5200;

export default function HeroX() {
  const sectionRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [inView, setInView] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setIdx((i) => (i + 1) % HERO.phrases.length);
    }, PHRASE_HOLD + 490);
    return () => clearInterval(id);
  }, [reduce, inView]);

  return (
    <section
      ref={sectionRef}
      className="relative text-[#fbfaf7] overflow-clip"
      style={{ minHeight: "100svh", paddingTop: "var(--header-height)", background: "var(--alterx-bg)" }}
      data-testid="hero-section"
    >
      <NetSegment name="hero" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center" style={{ minHeight: "calc(100svh - var(--header-height))" }}>
        <div className="py-16 md:py-0">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: EASE }}>
            <div className="ax-eyebrow text-[#5BEA99] flex items-center gap-3 mb-6">
              <span className="inline-block w-6 h-[2px] bg-[#5BEA99]" aria-hidden="true" />
              {HERO.eyebrow}
            </div>
          </motion.div>

          <h1
            className="ax-display"
            style={{ fontSize: "clamp(38px, 5vw, 76px)", maxWidth: "13ch" }}
            data-testid="hero-headline"
          >
            <span className="block overflow-hidden">
              <motion.span className="block" initial={reduce ? false : { y: "106%" }} animate={{ y: 0 }} transition={{ duration: 0.75, delay: 0.22, ease: EASE }}>
                {HERO.line1}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span className="block" initial={reduce ? false : { y: "106%" }} animate={{ y: 0 }} transition={{ duration: 0.75, delay: 0.34, ease: EASE }}>
                {HERO.line2}
              </motion.span>
            </span>
            <span className="block relative" style={{ height: "1.06em" }} data-testid="hero-phrase-line">
              {reduce ? (
                <span className="text-[#5BEA99]">{HERO.phrases[0]}</span>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={idx}
                    className="absolute left-0 top-0 text-[#5BEA99] whitespace-nowrap"
                    initial={{ opacity: 0, y: "36%" }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.04, ease: EASE } }}
                    exit={{ opacity: 0, y: "-28%", transition: { duration: 0.15 } }}
                  >
                    {HERO.phrases[idx]}
                  </motion.span>
                </AnimatePresence>
              )}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
            className="mt-6 text-base md:text-lg text-white/70 max-w-md"
          >
            {HERO.paragraph}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.62, ease: EASE }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <a href="#how-it-works" className="btn-primary" data-testid="hero-primary-cta">
              See how it works <ArrowRight size={16} className="ax-arrow" aria-hidden="true" />
            </a>
            <Link to="/contact" className="btn-ghost-dark ax-fill" data-testid="hero-secondary-cta">
              Talk to us
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="relative w-full aspect-square max-w-[520px] mx-auto"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        >
          <AlterXBlob className="w-full h-full" />
        </motion.div>
      </div>
    </section>
  );
}
