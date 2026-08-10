import { useEffect, useRef } from "react";

/*
  WhyAlterParticleSculpture — one persistent particle set that morphs
  between five formations (Outcome/Authority/Progress/Checked/Recovery)
  as `activeIndex` changes. No connecting lines, no mesh — particles
  only. Paused offscreen and when the tab is hidden.
*/
export default function WhyAlterParticleSculpture({ activeIndex }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0, height = 0, raf = 0, visible = true, pageVisible = !document.hidden;

    const mobile = window.innerWidth < 640;
    const tablet = !mobile && window.innerWidth < 1024;
    const PARTICLE_COUNT = mobile ? 450 : tablet ? 800 : 1200;
    const maxDpr = mobile ? 1.25 : 1.5;

    const getColor = () => {
      const r = Math.random();
      if (r > 0.95) return "#F9F9F9"; // warm white — ~5%
      if (r > 0.85) return "#F97316"; // orange core — ~10%
      if (r > 0.72) return "#FF5A1F"; // bright orange — ~13% (~28% orange total)
      if (r > 0.38) return "#4a4a4a"; // charcoal
      return "#242424";               // deep dark
    };

    // size hierarchy — most particles small, a minority large enough to
    // read as focal points. Orange/white get a small boost over charcoal.
    const getSize = (color) => {
      const r = Math.random();
      const base = r < 0.65 ? 1.2 + Math.random() * 1.0
        : r < 0.9 ? 2.2 + Math.random() * 1.2
        : 3.4 + Math.random() * 1.6;
      const focal = color !== "#242424" && color !== "#4a4a4a";
      return focal ? base + 0.4 : base;
    };

    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const color = getColor();
      particles.push({
        id: i,
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        z: (Math.random() - 0.5) * 400,
        a: Math.random() * Math.PI * 2,
        rSeed: Math.random(),
        xSeed: Math.random(),
        band: i % 5,
        color,
        size: getSize(color),
      });
    }

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset, don't accumulate scale
    };
    resize();

    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, px: -9999, py: -9999, active: false };
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouse.px = e.clientX - rect.left;
      mouse.py = e.clientY - rect.top;
      mouse.active = true;
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", () => { mouse.targetX = 0; mouse.targetY = 0; mouse.active = false; mouse.px = -9999; mouse.py = -9999; });

    let time = 0;

    const frame = (staticFrame) => {
      time += reduced ? 0 : 0.015;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const idx = activeIndexRef.current;
      const minScale = width < 500 ? 0.55 : 1;

      particles.forEach((p) => {
        let tx, ty, tz;
        let pColor = p.color;
        let alphaTarget = 0.7;

        if (idx === 0) {
          // OUTCOME FIRST — wide loose entrance, compressed centre, focused tip
          tx = -150 + p.xSeed * 300;
          const taper = tx < 0 ? 70 : 70 * (1 - Math.pow(tx / 150, 1.5));
          const r = Math.pow(p.rSeed, 0.5) * taper;
          ty = Math.cos(p.a + time) * r;
          tz = Math.sin(p.a + time) * r;
          if (p.x > 80 && p.rSeed < 0.3) { pColor = "#F97316"; alphaTarget = 1; }
        } else if (idx === 1) {
          // HUMAN AUTHORITY — narrows toward a threshold, movement slows there
          tx = -180 + p.xSeed * 360;
          const pinch = 8 + Math.pow(Math.abs(tx) / 180, 2) * 90;
          const r = p.rSeed * pinch;
          ty = Math.cos(p.a + time * 0.5) * r;
          tz = Math.sin(p.a + time * 0.5) * r;
          if (Math.abs(p.x) < 25) { pColor = "#F9F9F9"; alphaTarget = 1; } else { alphaTarget = 0.4; }
        } else if (idx === 2) {
          // VISIBLE PROGRESS — five bands, an orange pulse sweeps through them
          tx = -140 + p.band * 70;
          const r = Math.pow(p.rSeed, 0.5) * 80;
          ty = Math.cos(p.a + time) * r;
          tz = Math.sin(p.a + time) * r;
          const activeBand = Math.floor((time * 3) % 6);
          if (p.band === activeBand) { alphaTarget = 1; if (Math.random() > 0.8) pColor = "#F97316"; } else { alphaTarget = 0.25; }
        } else if (idx === 3) {
          // CHECKED RESULTS — compact, ordered, a scan plane sweeps through
          const phi = Math.acos(1 - 2 * p.xSeed);
          const r = 70 * Math.cbrt(p.rSeed);
          tx = r * Math.sin(phi) * Math.cos(p.a + time * 0.2);
          ty = r * Math.sin(phi) * Math.sin(p.a + time * 0.2);
          tz = r * Math.cos(phi);
          const scanZ = Math.sin(time * 2.5) * 80;
          if (Math.abs(p.z - scanZ) < 15) { pColor = "#F9F9F9"; alphaTarget = 1; } else { alphaTarget = 0.4; }
        } else {
          // RECOVERY AND EVIDENCE — the route diverts; the old trace stays visible
          tx = -180 + p.xSeed * 360;
          if (tx < -40) {
            const r = p.rSeed * 25;
            ty = Math.cos(p.a + time) * r;
            tz = Math.sin(p.a + time) * r;
          } else if (p.id % 3 === 0) {
            const r = p.rSeed * 35;
            ty = (tx + 40) * 0.7 + Math.cos(p.a + time * 0.5) * r;
            tz = Math.sin(p.a + time * 0.5) * r;
            alphaTarget = Math.max(0, 0.6 - (p.x + 40) / 150);
            pColor = "#3a3a3a";
          } else {
            const r = p.rSeed * 25;
            ty = Math.cos(p.a + time) * r;
            tz = Math.sin(p.a + time) * r;
          }
        }

        tx += Math.sin(time * 2 + p.id * 0.05) * 3;
        ty += Math.cos(time * 2 + p.id * 0.05) * 3;
        tz += Math.sin(time * 2 + p.id * 0.05) * 3;

        if (staticFrame) { p.x = tx; p.y = ty; p.z = tz; }
        else {
          p.x += (tx - p.x) * 0.055;
          p.y += (ty - p.y) * 0.055;
          p.z += (tz - p.z) * 0.055;
        }

        let rx = p.x, ry = p.y, rz = p.z;
        // subtle parallax only — roughly ±3deg / ±2deg, not the wide swing of a demo
        const mRotY = mouse.x * 0.05 + time * 0.02;
        const mRotX = mouse.y * -0.035;
        let nx = rx * Math.cos(mRotY) - rz * Math.sin(mRotY);
        let nz = rx * Math.sin(mRotY) + rz * Math.cos(mRotY);
        rx = nx; rz = nz;
        let ny = ry * Math.cos(mRotX) - rz * Math.sin(mRotX);
        nz = ry * Math.sin(mRotX) + rz * Math.cos(mRotX);
        ry = ny; rz = nz;

        const fov = 350;
        const scale = (fov / (fov + rz + 150)) * minScale;
        if (scale > 0 && alphaTarget > 0.02) {
          let x2d = width / 2 + rx * scale;
          let y2d = height / 2 + ry * scale;
          let sizeBoost = 1, glowAlpha = 1;

          // real cursor interaction — nearby particles get pushed away and
          // brighten, not just the whole-field parallax above
          if (mouse.active) {
            const dx = x2d - mouse.px, dy = y2d - mouse.py;
            const dist = Math.hypot(dx, dy);
            const radius = 90;
            if (dist < radius) {
              const push = (1 - dist / radius);
              const ux = dist > 0.001 ? dx / dist : 0, uy = dist > 0.001 ? dy / dist : 0;
              x2d += ux * push * 22;
              y2d += uy * push * 22;
              sizeBoost = 1 + push * 0.6;
              glowAlpha = 1 + push * 0.5;
            }
          }

          const depthAlpha = Math.min(1, Math.max(0.1, (100 - rz) / 200));
          ctx.globalAlpha = Math.min(1, alphaTarget * depthAlpha * glowAlpha);
          ctx.fillStyle = pColor;
          ctx.beginPath();
          ctx.arc(x2d, y2d, p.size * scale * sizeBoost, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
    };

    const loop = (t) => {
      if (!visible || !pageVisible) { raf = 0; return; }
      frame(false);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf) return;
      if (reduced) { frame(true); return; }
      if (visible && pageVisible) raf = requestAnimationFrame(loop);
    };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    const ro = new ResizeObserver(() => { resize(); if (reduced) frame(true); });
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); });
    io.observe(wrap);
    const onVisibility = () => { pageVisible = !document.hidden; pageVisible ? start() : stop(); };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) frame(true); else start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      <canvas ref={canvasRef} style={{ touchAction: "none" }} />
    </div>
  );
}
