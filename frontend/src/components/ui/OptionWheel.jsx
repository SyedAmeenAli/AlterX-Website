import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./OptionWheel.css";

/*
  OptionWheel — adapted for AlterX. Vertical selector, warm-white text,
  orange index/marker, no glow pill, no sound, no autoplay. Deliberate
  input only: click, keyboard, drag-and-release, threshold-guarded wheel.

  FULLY CONTROLLED: no internal selection state. `activeIndex` is the one
  source of truth, owned by the parent, shared with whatever else reads
  the same selection (particle sculpture, explanation text, ...). This
  component only ever calls `onSelect` — it never decides the value itself.

  Wheel: accumulates deltaY and only fires ONE selection change past a
  90 threshold, then locks for 650ms — one trackpad/mouse-wheel gesture
  moves one option, not five. Boundary gestures (already at first/last,
  scrolling further past it) are never consumed, so page scroll is free.

  Drag: tracked visually via a live offset; the actual selection only
  commits once, on pointer release, snapped to the nearest option.
*/
export default function OptionWheel({
  items,
  activeIndex,
  defaultSelected = 0,
  onSelect,
  onChange, // back-compat alias for onSelect
  textColor = "rgba(249,249,249,.32)",
  activeColor = "#f9f9f9",
}) {
  const selected = activeIndex ?? defaultSelected;
  const select = onSelect ?? onChange;

  const [dragY, setDragY] = useState(0);
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef(null);
  const dragRef = useRef({ active: false, startY: 0 });
  const wheelAccum = useRef(0);
  const wheelLocked = useRef(false);
  const wheelUnlockTimer = useRef(null);
  const hoverTimer = useRef(null);

  const clamp = useCallback((i) => Math.max(0, Math.min(items.length - 1, i)), [items.length]);

  const go = useCallback(
    (i) => {
      const next = clamp(i);
      if (next === selected) return;
      select?.(next, items[next]);
    },
    [clamp, items, select, selected]
  );

  useEffect(() => () => { clearTimeout(wheelUnlockTimer.current); clearTimeout(hoverTimer.current); }, []);

  const rendered = useMemo(
    () => items.map((item, index) => ({ item, index, relative: index - selected })),
    [items, selected]
  );

  return (
    <div
      ref={rootRef}
      className="ax-option-wheel"
      role="listbox"
      aria-label="Options"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onWheel={(e) => {
        // never block the page's own scroll — the wheel selection rides
        // along on top of normal scrolling instead of fighting it.
        if (wheelLocked.current) return;

        const atTop = selected === 0 && e.deltaY < 0;
        const atBottom = selected === items.length - 1 && e.deltaY > 0;
        if (atTop || atBottom) { wheelAccum.current = 0; return; }

        wheelAccum.current += e.deltaY;
        if (Math.abs(wheelAccum.current) < 90) return;

        const direction = wheelAccum.current > 0 ? 1 : -1;
        wheelAccum.current = 0;
        wheelLocked.current = true;
        go(selected + direction);
        wheelUnlockTimer.current = setTimeout(() => { wheelLocked.current = false; }, 650);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); go(selected + 1); }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); go(selected - 1); }
      }}
      onPointerDown={(e) => {
        dragRef.current = { active: true, startY: e.clientY };
        setDragY(0);
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragRef.current.active) return;
        setDragY(e.clientY - dragRef.current.startY);
      }}
      onPointerUp={(e) => {
        if (dragRef.current.active) {
          const stepPx = 80; // px per option — snap to nearest on release only
          const offset = Math.round(-dragY / stepPx);
          if (offset !== 0) go(selected + offset);
        }
        dragRef.current.active = false;
        setDragY(0);
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      }}
      onPointerCancel={() => { dragRef.current.active = false; setDragY(0); }}
    >
      {rendered.map(({ item, index, relative }) => {
        const distance = Math.abs(relative);
        // curved wheel — position/scale/opacity only, no literal circle drawn
        const y = relative * 68 + (dragRef.current.active ? dragY * 0.68 : 0);
        const x = distance === 0 ? 0 : distance === 1 ? -18 : distance === 2 ? -48 : -82;
        const scale = distance === 0 ? 1 : distance === 1 ? 0.92 : 0.84;
        // active 1 / 1-away .48 (.55 on hover, hints more choices exist) / 2-away .22 / far .10–.15
        const opacity = distance === 0 ? 1 : distance === 1 ? (hovered ? 0.55 : 0.48) : distance === 2 ? 0.22 : 0.12;
        const blur = distance <= 1 ? 0 : Math.min(1, (distance - 1) * 0.4);
        return (
          <button
            type="button"
            key={item}
            role="option"
            aria-selected={index === selected}
            className={`ax-option-wheel__item ${index === selected ? "is-active" : ""}`}
            style={{
              "--wheel-y": `${y}px`,
              "--wheel-x": `${x}px`,
              "--wheel-scale": scale,
              "--wheel-opacity": opacity,
              "--wheel-blur": `${blur}px`,
              "--wheel-color": index === selected ? activeColor : textColor,
              transition: dragRef.current.active ? "none" : undefined,
            }}
            onClick={() => { clearTimeout(hoverTimer.current); go(index); }}
            onMouseEnter={() => {
              // hover-intent: only commits after a real pause on the item,
              // so a cursor merely passing through on its way elsewhere
              // (previous behavior) no longer flips the selection.
              clearTimeout(hoverTimer.current);
              hoverTimer.current = setTimeout(() => go(index), 350);
            }}
            onMouseLeave={() => clearTimeout(hoverTimer.current)}
            data-testid={`option-wheel-item-${index}`}
          >
            {index === selected && <span className="ax-option-wheel__active-mark" aria-hidden="true" />}
            <span className="ax-option-wheel__index">{String(index + 1).padStart(2, "0")}</span>
            <span>{item}</span>
          </button>
        );
      })}
    </div>
  );
}
