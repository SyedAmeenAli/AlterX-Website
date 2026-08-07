import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HERO } from "@/content/home";
import useParticleX from "@/lib/useParticleX";
import { EASE } from "@/lib/anim";
import NetSegment from "@/components/home/NetworkThread";

const PHRASE_HOLD = 5200;

function FallbackCanvas() {
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();
  useParticleX(canvasRef, reduce);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" data-testid="hero-canvas" />;
}

export default function HeroX() {
  const headRef = useRef(null);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const [inView, setInView] = useState(true);
  const reduce = useReducedMotion();

  /* observe hero visibility — pauses video and phrase rotation offscreen */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* video play/pause control */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => {
      if (reduce || !inView || document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [reduce, inView, videoFailed]);

  /* phrase rotation — paused when hidden, offscreen or reduced motion */
  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setIdx((i) => (i + 1) % HERO.phrases.length);
    }, PHRASE_HOLD + 490);
    return () => clearInterval(id);
  }, [reduce, inView]);

  const onMove = (e) => {
    const el = headRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-[#fbfaf7] overflow-clip"
      style={{ height: "100svh", minHeight: "620px", paddingTop: "var(--header-height)" }}
      data-testid="hero-section"
    >
      {videoFailed ? (
        <FallbackCanvas />
      ) : (
        <div
          className="absolute top-0 bottom-0 right-0 w-full md:w-[62%]"
          style={{ WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 26%)", maskImage: "linear-gradient(to right, transparent 0%, black 26%)" }}
          aria-hidden="true"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/assets/particle-x.mp4"
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
            data-testid="hero-video"
          />
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ background: "linear-gradient(95deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.55) 36%, rgba(0,0,0,0) 55%)" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none md:hidden" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.92) 0%, rgba(0,0,0,.6) 52%, rgba(0,0,0,.12) 80%)" }} aria-hidden="true" />

      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col justify-center pointer-events-none">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: EASE }}>
          <div className="ax-eyebrow text-[#ff4d0a] flex items-center gap-3 mb-6">
            <span className="inline-block w-6 h-[2px] bg-[#ff4d0a]" aria-hidden="true" />
            {HERO.eyebrow}
          </div>
        </motion.div>

        <h1
          ref={headRef}
          onPointerMove={onMove}
          className="ax-mask-headline ax-display pointer-events-auto"
          style={{ fontSize: "clamp(42px, 5.8vw, 88px)", maxWidth: "13ch" }}
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
              <span className="text-[#ff4d0a]">{HERO.phrases[0]}</span>
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={idx}
                  className="absolute left-0 top-0 text-[#ff4d0a] whitespace-nowrap"
                  initial={{ opacity: 0, y: "36%" }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.04, ease: EASE } }}
                  exit={{ opacity: 0, y: "-28%", transition: { duration: 0.15 } }}
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
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
          className="mt-6 text-base md:text-lg text-white/70 max-w-xl"
        >
          {HERO.paragraph}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.62, ease: EASE }}
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
