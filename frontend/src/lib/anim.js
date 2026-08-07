import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";

export const EASE = [0.25, 1, 0.5, 1];

export const Reveal = ({ children, delay = 0, y = 14, className, once = true, ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0.001, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: "-60px" }}
    transition={{ duration: 0.55, delay, ease: EASE }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const MaskLines = ({ lines, className, lineClass, delay = 0, as: Tag = "div" }) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const MTag = motion[Tag] || motion.div;
  return (
    <MTag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className={`block ${lineClass || ""}`}
            initial={reduce ? false : { y: "104%", opacity: 0.82 }}
            animate={reduce || inView ? { y: 0, opacity: 1 } : { y: "104%", opacity: 0.82 }}
            transition={{ duration: 0.66, delay: delay + i * 0.08, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </MTag>
  );
};

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — AlterX` : "AlterX — From intent to completed, reviewable work";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.name = "description"; document.head.appendChild(m); }
    m.content = description || "AlterX builds Alter Engine — turn an outcome into planned, approved, visible and checked work.";
    let c = document.querySelector('link[rel="canonical"]');
    if (!c) { c = document.createElement("link"); c.rel = "canonical"; document.head.appendChild(c); }
    c.href = `https://alterx.co.in${window.location.pathname}`;
  }, [title, description]);
}

export function useOnScreen(ref, rootMargin = "0px") {
  const visible = useRef(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { rootMargin });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return visible;
}
