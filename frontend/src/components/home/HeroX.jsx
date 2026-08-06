import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HERO } from "@/content/home";
import useParticleX from "@/lib/useParticleX";
import { EASE } from "@/lib/anim";

const PHRASE_HOLD = 5200;

export default function HeroX() {
  const canvasRef = useRef(null);
  const headRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();
  useParticleX(canvasRef, reduce);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % HERO.phrases.length), PHRASE_HOLD + 480);
    return () => clearInterval(id);
  }, [reduce]);

  const onMove = (e) => {
    const el = headRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      className="relative bg-black text-[#fbfaf7] overflow-clip"
      style={{ height: "100svh", minHeight: "640px", paddingTop: "var(--header-height)" }}
      data-testid="hero-section"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" data-testid="hero-canvas" />
      <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ background: "linear-gradient(95deg, rgba(0,0,0,.9) 0%, rgba(0,0,0,.62) 38%, rgba(0,0,0,0) 58%)" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none md:hidden" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.9) 0%, rgba(0,0,0,.55) 52%, rgba(0,0,0,.05) 78%)" }} aria-hidden="true" />
      <div className="relative h-full max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col justify-center pointer-events-none">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: EASE }}>
          <div className="ax-eyebrow text-[#ff5a1f] flex items-center gap-3 mb-7">
            <span className="inline-block w-6 h-[2px] bg-[#ff5a1f]" aria-hidden="true" />
            {HERO.eyebrow}
          </div>
        </motion.div>

        <h1
          ref={headRef}
          onPointerMove={onMove}
          className="ax-mask-headline ax-display text-4xl sm:text-6xl lg:text-[74px] max-w-[13ch] pointer-events-auto"
          data-testid="hero-headline"
        >
          <span className="block overflow-hidden">
            <motion.span className="block" initial={reduce ? false : { y: "108%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: EASE }}>
              {HERO.line1}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span className="block" initial={reduce ? false : { y: "108%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.38, ease: EASE }}>
              {HERO.line2}
            </motion.span>
          </span>
          <span className="block relative" style={{ height: "1.08em" }} data-testid="hero-phrase-line">
            {reduce ? (
              <span className="text-[#ff5a1f]">{HERO.phrases[0]}</span>
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={idx}
                  className="absolute left-0 top-0 text-[#ff5a1f] whitespace-nowrap"
                  initial={{ opacity: 0, y: "40%" }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.28, delay: 0.05, ease: EASE } }}
                  exit={{ opacity: 0, y: "-30%", transition: { duration: 0.15 } }}
                >
                  {HERO.phrases[idx]}
                </motion.span>
              </AnimatePresence>
            )}
          </span>
          <span className="ax-mask-orange ax-display" aria-hidden="true">
            <span className="block">{HERO.line1}</span>
            <span className="block">{HERO.line2}</span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
          className="mt-7 text-base md:text-lg text-white/65 max-w-xl"
        >
          {HERO.paragraph}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.68, ease: EASE }}
          className="mt-9 flex flex-wrap gap-4 pointer-events-auto"
        >
          <Link to="/try-alter-engine" className="btn-primary" data-testid="hero-primary-cta">
            Try Alter Engine <ArrowRight size={16} className="ax-arrow" aria-hidden="true" />
          </Link>
          <a href="#how-it-works" className="btn-ghost-dark ax-fill" data-testid="hero-secondary-cta">
            See how it works
          </a>
        </motion.div>
      </div>
    </section>
  );
}
