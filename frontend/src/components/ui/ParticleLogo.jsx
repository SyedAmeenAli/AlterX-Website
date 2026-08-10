import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/*
  ParticleLogo — header wordmark. "ALTER" in solid type, the "X" rendered as
  a reactive particle field (ported from the supplied reference: pixels of
  a rendered X sampled into nodes, molecular-bond lines between close nodes,
  mouse-repulsion, gentle orbiting drift). Scaled down to header size.
  Canvas-based, not hundreds of DOM nodes — same convention as LetterGlitch:
  paused offscreen/hidden-tab, static single frame under reduced motion.
*/
export default function ParticleLogo({ light, size = 28, textSize }) {
  const resolvedTextSize = textSize ?? Math.round(size * 0.88);
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // sample a rendered "X" into a small offscreen buffer to get particle seeds
    const off = document.createElement("canvas");
    off.width = size;
    off.height = size;
    const offCtx = off.getContext("2d");
    offCtx.font = `900 ${Math.round(size * 1.18)}px Montserrat, Arial, sans-serif`;
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    // the whole X is the brand orange, no white/dark portion
    offCtx.fillStyle = "#ff4d0a";
    offCtx.fillText("X", size / 2, size / 2 + size * 0.04);

    const imgData = offCtx.getImageData(0, 0, size, size).data;
    const particles = [];
    const gap = Math.max(2, Math.round(size / 16)); // density scales with size
    for (let y = 0; y < size; y += gap) {
      for (let x = 0; x < size; x += gap) {
        const i = (y * size + x) * 4;
        if (imgData[i + 3] > 128) {
          particles.push({
            x, y, baseX: x, baseY: y,
            angle: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.012,
            radius: 0.5 + Math.random() * 0.9,
            color: `rgb(${imgData[i]},${imgData[i + 1]},${imgData[i + 2]})`,
            r: 0.5 + Math.random() * 0.5,
          });
        }
      }
    }

    const mouse = { x: null, y: null, radius: size * 0.4 };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = null; mouse.y = null; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    let raf = 0;
    let pageVisible = !document.hidden;
    const onVisibility = () => { pageVisible = !document.hidden; if (pageVisible && !reduced) tick(); };
    document.addEventListener("visibilitychange", onVisibility);

    const bondDist = size * 0.22;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i], p2 = particles[j];
          const dx = p1.x - p2.x, dy = p1.y - p2.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < bondDist) {
            ctx.beginPath();
            ctx.globalAlpha = 1 - d / bondDist;
            ctx.strokeStyle = p1.color;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      if (!pageVisible) return;
      for (const p of particles) {
        p.angle += p.speed;
        let tx = p.baseX + Math.cos(p.angle) * p.radius;
        let ty = p.baseY + Math.sin(p.angle) * p.radius;
        if (mouse.x != null) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < mouse.radius && d > 0.01) {
            const force = (mouse.radius - d) / mouse.radius;
            tx -= (dx / d) * force * (size * 0.35);
            ty -= (dy / d) * force * (size * 0.35);
          }
        }
        p.x += (tx - p.x) * 0.14;
        p.y += (ty - p.y) * 0.14;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      draw();
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [light, size]);

  return (
    <Link to="/" className="flex items-center shrink-0" aria-label="AlterX home" data-testid="header-logo">
      <span ref={wrapperRef} className="flex items-center leading-none">
        <span
          className="tracking-[-0.03em]"
          style={{ fontSize: resolvedTextSize, fontWeight: 900, color: light ? "#fbfaf7" : "#090909" }}
        >
          ALTER
        </span>
        <canvas ref={canvasRef} aria-hidden="true" style={{ marginLeft: -1, cursor: "default" }} />
      </span>
    </Link>
  );
}
