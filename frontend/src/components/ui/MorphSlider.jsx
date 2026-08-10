import { useEffect, useState } from "react";
import "./MorphSlider.css";

/*
  MorphSlider — DOM/SVG scenes only, no imagery. Manual selector drives
  it; autoplay (if left on) holds each slide 5.5-6.5s and pauses on
  hover/offscreen. The morph itself takes ~700ms then holds.
*/
export default function MorphSlider({ items, activeIndex, interval = 6000, autoplay = false, onChange }) {
  const [internalIndex, setInternalIndex] = useState(activeIndex ?? 0);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const index = activeIndex ?? internalIndex;

  useEffect(() => {
    if (!autoplay || activeIndex != null || items.length < 2 || hovered || !visible) return;
    const timer = window.setInterval(() => setInternalIndex((c) => (c + 1) % items.length), interval);
    return () => clearInterval(timer);
  }, [autoplay, activeIndex, interval, items.length, hovered, visible]);

  const select = (next) => { setInternalIndex(next); onChange?.(next, items[next]); };

  return (
    <div
      className="ax-morph-slider"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={(el) => {
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
        io.observe(el);
      }}
    >
      <div className="ax-morph-slider__stage">
        {items.map((item, i) => (
          <div key={item.id ?? i} className={`ax-morph-slide ${i === index ? "is-active" : ""}`}>
            {item.render()}
          </div>
        ))}
      </div>
      <div className="ax-morph-slider__controls" role="tablist" aria-label="Scene selector">
        {items.map((item, i) => (
          <button
            type="button"
            key={item.id ?? i}
            role="tab"
            aria-selected={i === index}
            className={i === index ? "is-active" : ""}
            onClick={() => select(i)}
            data-testid={`morph-slider-${item.id ?? i}`}
          >
            {item.caption}
          </button>
        ))}
      </div>
    </div>
  );
}
