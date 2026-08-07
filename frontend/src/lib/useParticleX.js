import { useEffect } from "react";
import { seededRandom } from "@/lib/scramble";

/* Adapted from the supplied AlterX particle logo asset (authoritative):
   particles sampled from the X glyph, orange triangle region top-left,
   fluid organic drift, molecular bonds, pointer repulsion. */
export default function useParticleX(canvasRef, reduce) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, running = true, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0, particles = [], pairs = [], startTime = 0;
    const mouse = { x: null, y: null, radius: 70 };

    const build = () => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = W < 768;
      const S = Math.round(Math.min(H * (mobile ? 0.42 : 0.68), W * (mobile ? 0.8 : 0.4)));
      const off = document.createElement("canvas");
      off.width = S; off.height = S;
      const octx = off.getContext("2d");
      octx.font = `900 ${Math.round(S * 0.96)}px Montserrat, 'Hanken Grotesk', sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillStyle = "#FFFFFF";
      octx.fillText("X", S / 2, S * 0.54);
      octx.globalCompositeOperation = "source-atop";
      octx.fillStyle = "#FF5A1F";
      octx.fillRect(0, 0, S * 0.42, S * 0.5);
      const img = octx.getImageData(0, 0, S, S).data;
      const gap = Math.max(4, Math.round(S / (mobile ? 30 : 46)));
      const ox = mobile ? (W - S) / 2 : W * 0.92 - S;
      const oy = mobile ? H * 0.8 - S / 2 : (H - S) / 2 + H * 0.04;
      const rnd = seededRandom(80081);
      particles = [];
      for (let y = 0; y < S; y += gap) {
        for (let x = 0; x < S; x += gap) {
          const idx = (y * S + x) * 4;
          if (img[idx + 3] > 128) {
            const orange = img[idx] > 200 && img[idx + 2] < 120;
            particles.push({
              bx: ox + x, by: oy + y,
              x: rnd() * W, y: rnd() * H,
              angle: rnd() * Math.PI * 2,
              speed: 0.01 + rnd() * 0.04,
              drift: 2 + rnd() * 3,
              color: orange ? "#ff4d0a" : "#f5f2ea",
              size: (1.2 + rnd() * 1.5) * (mobile ? 0.8 : 1),
              delay: rnd() * 0.35,
            });
          }
        }
      }
      const th = gap * 2.7;
      pairs = [];
      for (let i = 0; i < particles.length && pairs.length < 3200; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].bx - particles[j].bx;
          const dy = particles[i].by - particles[j].by;
          if (dx * dx + dy * dy < th * th) pairs.push([i, j, th]);
        }
      }
      startTime = performance.now();
    };

    const drawStatic = () => {
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 0.6;
      for (const [i, j, th] of pairs) {
        const p1 = particles[i], p2 = particles[j];
        const d = Math.hypot(p1.bx - p2.bx, p1.by - p2.by);
        ctx.globalAlpha = (1 - d / th) * 0.5;
        ctx.strokeStyle = p1.color;
        ctx.beginPath(); ctx.moveTo(p1.bx, p1.by); ctx.lineTo(p2.bx, p2.by); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.bx, p.by, p.size, 0, Math.PI * 2); ctx.fill();
      }
    };

    const easeOut = (x) => 1 - Math.pow(1 - x, 3);

    const frame = (now) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const elapsed = (now - startTime) / 1000;
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      for (const p of particles) {
        const k = easeOut(Math.min(1, Math.max(0, (elapsed - p.delay - 0.2) / 2.2)));
        p.angle += p.speed;
        let tx = p.bx + Math.cos(p.angle) * p.drift;
        let ty = p.by + Math.sin(p.angle) * p.drift;
        if (mouse.x != null && k > 0.9) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius && dist > 0.5) {
            const force = (mouse.radius - dist) / mouse.radius;
            tx -= (dx / dist) * force * 55;
            ty -= (dy / dist) * force * 55;
          }
        }
        const gx = p.x * (1 - k) + tx * k + (1 - k) * Math.sin(now / 900 + p.angle) * 14;
        const gy = p.y * (1 - k) + ty * k + (1 - k) * Math.cos(now / 1100 + p.angle) * 12;
        p.x += (gx - p.x) * (k > 0.99 ? 0.12 : 1);
        p.y += (gy - p.y) * (k > 0.99 ? 0.12 : 1);
        p.k = k;
      }
      ctx.lineWidth = 0.6;
      for (const [i, j, th] of pairs) {
        const p1 = particles[i], p2 = particles[j];
        const bond = Math.min(p1.k, p2.k);
        if (bond < 0.85) continue;
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (d >= th * 1.15) continue;
        ctx.globalAlpha = (1 - d / (th * 1.15)) * bond * 0.55;
        ctx.strokeStyle = p1.color;
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      for (const p of particles) {
        ctx.globalAlpha = 0.35 + p.k * 0.65;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      build();
      if (reduce) drawStatic();
      else raf = requestAnimationFrame(frame);
    };

    if (document.fonts && document.fonts.load) {
      document.fonts.load("900 100px Montserrat").then(start).catch(start);
    } else start();

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = null; mouse.y = null; };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    obs.observe(canvas);
    let rt;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (reduce) drawStatic(); }, 200); };
    window.addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      obs.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      clearTimeout(rt);
    };
  }, [canvasRef, reduce]);
}
