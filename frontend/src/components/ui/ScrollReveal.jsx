import { useEffect, useRef, useState } from "react";

/*
  ScrollReveal — for major editorial statements only, not body copy.
  Resolves into focus once on scroll-into-view; immediate under
  reduced motion.
*/
export default function ScrollReveal({
  children,
  baseOpacity = 0,
  enableBlur = true,
  baseRotation = 2,
  blurStrength = 5,
  className = "",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : baseOpacity,
        transform: visible ? "translateY(0) rotate(0deg)" : `translateY(16px) rotate(${baseRotation}deg)`,
        filter: visible || !enableBlur ? "blur(0px)" : `blur(${blurStrength}px)`,
        transition: "opacity 720ms cubic-bezier(.25,1,.5,1), transform 820ms cubic-bezier(.25,1,.5,1), filter 720ms cubic-bezier(.25,1,.5,1)",
      }}
    >
      {children}
    </div>
  );
}
