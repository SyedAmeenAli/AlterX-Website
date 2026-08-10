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

const setMetaByProp = (attr, key, content) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
};

export function usePageMeta(title, description) {
  useEffect(() => {
    const fullTitle = title ? `${title} — AlterX` : "AlterX — Turn outcomes into visible work";
    const desc = description || "AlterX builds Alter Engine — turn an outcome into planned, approved, visible and checked work.";
    const url = `https://alterx.co.in${window.location.pathname}`;
    const image = "https://alterx.co.in/og/alterx-social.png";

    document.title = fullTitle;
    setMetaByProp("name", "description", desc);

    let c = document.querySelector('link[rel="canonical"]');
    if (!c) { c = document.createElement("link"); c.rel = "canonical"; document.head.appendChild(c); }
    c.href = url;

    // Open Graph / Twitter — same title/description/canonical, one source of
    // truth, no per-page metadata logic. Social image is a single static
    // asset shared across routes.
    setMetaByProp("property", "og:type", "website");
    setMetaByProp("property", "og:site_name", "AlterX");
    setMetaByProp("property", "og:url", url);
    setMetaByProp("property", "og:title", fullTitle);
    setMetaByProp("property", "og:description", desc);
    setMetaByProp("property", "og:image", image);
    setMetaByProp("name", "twitter:card", "summary_large_image");
    setMetaByProp("name", "twitter:title", fullTitle);
    setMetaByProp("name", "twitter:description", desc);
    setMetaByProp("name", "twitter:image", image);
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
