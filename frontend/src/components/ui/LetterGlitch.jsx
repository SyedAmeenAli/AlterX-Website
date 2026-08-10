import { useEffect, useRef } from "react";
import "./LetterGlitch.css";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/*
  LetterGlitch — AlterX security atmosphere. Canvas-based (not hundreds of
  DOM nodes). Orange/off-white/grey field, paused offscreen and when the
  tab is hidden, static single frame under reduced motion.
*/
export default function LetterGlitch({
  glitchSpeed = 70,
  colors = ["#F97316", "#FF5A1F", "#F9F9F9", "#62686A", "#2A130A"],
  centerVignette = true,
  outerVignette = true,
}) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");

    let raf = 0, visible = true, pageVisible = !document.hidden, lastUpdate = 0, cells = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    const randomLetter = () => LETTERS[Math.floor(Math.random() * LETTERS.length)];

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cellW = mobile ? 22 : 16;
      const cellH = mobile ? 24 : 18;
      const cols = Math.ceil(rect.width / cellW);
      const rows = Math.ceil(rect.height / cellH);
      cells = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          cells.push({
            x: x * cellW + Math.random() * 3,
            y: y * cellH + Math.random() * 3,
            value: randomLetter(),
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.5 + Math.random() * 0.48,
          });
        }
      }
    };

    const mutate = () => {
      const amount = Math.max(1, Math.floor(cells.length * (mobile ? 0.03 : 0.05)));
      for (let i = 0; i < amount; i++) {
        const cell = cells[Math.floor(Math.random() * cells.length)];
        cell.value = randomLetter();
        cell.color = colors[Math.floor(Math.random() * colors.length)];
      }
    };

    const draw = () => {
      const rect = wrapper.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = mobile ? "700 15px Hanken Grotesk, sans-serif" : "700 16px Hanken Grotesk, sans-serif";
      ctx.textBaseline = "middle";
      for (const cell of cells) {
        ctx.globalAlpha = cell.alpha;
        ctx.fillStyle = cell.color;
        ctx.fillText(cell.value, cell.x, cell.y);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t) => {
      if (!visible || !pageVisible) { raf = 0; return; }
      const speed = mobile ? glitchSpeed * 1.8 : glitchSpeed;
      if (!reduced && t - lastUpdate > speed) { mutate(); lastUpdate = t; }
      draw();
      if (!reduced) raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf) return;
      if (visible && pageVisible && !reduced) raf = requestAnimationFrame(loop);
      else draw();
    };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(wrapper);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); });
    io.observe(wrapper);
    const onVisibility = () => { pageVisible = !document.hidden; pageVisible ? start() : stop(); };
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    draw();
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [glitchSpeed, colors]);

  return (
    <div ref={wrapperRef} className={`ax-letter-glitch ${centerVignette ? "has-center-vignette" : ""} ${outerVignette ? "has-outer-vignette" : ""}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
