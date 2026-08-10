import { Children, cloneElement, forwardRef, isValidElement, useCallback, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import "./CardSwap.css";

export const Card = forwardRef(({ className = "", ...props }, ref) => (
  <article ref={ref} {...props} className={`ax-swap-card ${className}`} />
));
Card.displayName = "Card";

const slotFor = (index, distanceX, distanceY) => ({ x: index * distanceX, y: -index * distanceY, z: -index * 46 });

/*
  CardSwap — conceptual developer-file stack. Controlled, not comedic:
  linear easing, small travel, no elastic bounce. Autoplay pauses on
  hover/focus/offscreen/hidden-tab, and is suppressed for a while after
  the visitor manually picks a file — their choice wins.
*/
export default function CardSwap({
  children,
  width = 520,
  height = 380,
  cardDistance = 36,
  verticalDistance = 38,
  delay = 7000,
  pauseOnHover = true,
  skewAmount = 2,
  easing = "linear",
  activeIndex,
  onActiveChange,
}) {
  const items = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(() => items.map(() => ({ current: null })), [items.length]);

  const rootRef = useRef(null);
  const orderRef = useRef(Array.from({ length: items.length }, (_, i) => i));
  const intervalRef = useRef(null);
  const visibleRef = useRef(true);
  const hoveredRef = useRef(false);
  const suppressUntil = useRef(0);

  const layout = useCallback(
    (animate = true) => {
      orderRef.current.forEach((itemIndex, stackIndex) => {
        const el = refs[itemIndex]?.current;
        if (!el) return;
        const slot = slotFor(stackIndex, cardDistance, verticalDistance);
        const params = {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          rotateY: stackIndex * -skewAmount,
          rotateX: stackIndex * (skewAmount * 0.3),
          zIndex: items.length - stackIndex,
          opacity: stackIndex > 4 ? 0 : 1 - stackIndex * 0.09,
        };
        if (animate) gsap.to(el, { ...params, duration: 0.6, ease: easing === "linear" ? "none" : "power3.out", overwrite: true });
        else gsap.set(el, params);
      });
    },
    [cardDistance, verticalDistance, skewAmount, easing, items.length, refs]
  );

  const select = useCallback(
    (index, { userDriven = false } = {}) => {
      if (index < 0 || index >= items.length) return;
      const current = orderRef.current;
      orderRef.current = [index, ...current.filter((i) => i !== index)];
      layout(true);
      onActiveChange?.(index);
      if (userDriven) suppressUntil.current = Date.now() + 10000; // pause autoplay 10s after manual pick
    },
    [items.length, layout, onActiveChange]
  );

  const rotate = useCallback(() => {
    const current = [...orderRef.current];
    if (current.length < 2) return;
    const first = current.shift();
    current.push(first);
    orderRef.current = current;
    layout(true);
    onActiveChange?.(current[0]);
  }, [layout, onActiveChange]);

  const stop = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const start = useCallback(() => {
    stop();
    if (!visibleRef.current || hoveredRef.current || delay <= 0) return;
    intervalRef.current = window.setInterval(() => {
      if (Date.now() < suppressUntil.current) return; // manual pick still in its quiet window
      rotate();
    }, delay);
  }, [delay, rotate, stop]);

  useEffect(() => { layout(false); start(); return stop; }, [layout, start, stop]);

  useEffect(() => {
    if (activeIndex == null) return;
    select(activeIndex, { userDriven: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; entry.isIntersecting ? start() : stop(); },
      { threshold: 0.1 }
    );
    observer.observe(root);
    const onVisibility = () => { if (document.hidden) stop(); else start(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, [start, stop]);

  return (
    <div
      ref={rootRef}
      className="ax-card-swap"
      style={{ width, height, maxWidth: "100%" }}
      onPointerEnter={() => { if (!pauseOnHover) return; hoveredRef.current = true; stop(); }}
      onPointerLeave={() => { hoveredRef.current = false; start(); }}
      onFocus={() => { hoveredRef.current = true; stop(); }}
      onBlur={() => { hoveredRef.current = false; start(); }}
    >
      {items.map((child, index) =>
        isValidElement(child)
          ? cloneElement(child, {
              // sizing comes from inset:0 against the (viewport-capped) container above —
              // forcing an explicit px width/height here overrode that inset and was the
              // actual overflow source on narrow viewports (explicit width wins over inset
              // per the absolute-positioning spec).
              ref: (node) => { refs[index].current = node; },
              style: { ...child.props.style },
              onClick: (e) => { child.props.onClick?.(e); select(index, { userDriven: true }); },
            })
          : child
      )}
    </div>
  );
}
