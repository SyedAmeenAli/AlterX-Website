import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { CIPHER_FRAGMENTS, scrambleString, seededRandom } from "@/lib/scramble";

export default function CipherField({ className = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, running = true, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0, bands = [], scramble = scrambleString(1), scrambleSeed = 1, lastScramble = 0;

    const build = () => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = W < 768;
      const nBands = mobile ? 6 : 10;
      const totalFrags = mobile ? 90 : 300;
      const perBand = Math.floor(totalFrags / nBands);
      const rnd = seededRandom(4242);
      bands = [];
      for (let b = 0; b < nBands; b++) {
        const t = b / (nBands - 1);
        const rx = (0.16 + t * 0.36) * W;
        const ry = (0.1 + t * 0.3) * H * 1.15;
        const inner = t < 0.5;
        const frags = [];
        for (let f = 0; f < perBand; f++) {
          frags.push({
            text: CIPHER_FRAGMENTS[Math.floor(rnd() * CIPHER_FRAGMENTS.length)],
            angle: rnd() * Math.PI * 2,
            alpha: inner ? 0.5 + rnd() * 0.45 : 0.12 + rnd() * 0.22,
          });
        }
        bands.push({ rx, ry, frags, speed: (inner ? -1 : 1) * (0.008 + (1 - t) * 0.012), inner });
      }
    };
    build();

    const draw = (now, dt) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      for (const band of bands) {
        for (const f of band.frags) {
          if (dt) f.angle += band.speed * dt;
          const x = cx + Math.cos(f.angle) * band.rx;
          const y = cy + Math.sin(f.angle) * band.ry;
          ctx.globalAlpha = f.alpha;
          ctx.fillStyle = band.inner ? "#ff641d" : "#ff4d0a";
          ctx.fillText(f.text, x, y);
        }
      }
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = "#ff4d0a";
      ctx.lineWidth = 1;
      for (const arc of [0.55, 0.8]) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, W * 0.24 * arc + W * 0.1, H * 0.24 * arc + H * 0.08, 0, 0.4, 2.2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255,77,10,.8)";
      ctx.lineWidth = 1.5;
      const r = Math.min(W, H) * 0.09;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#ff4d0a";
      ctx.lineWidth = 2.5;
      const xr = r * 0.4;
      ctx.beginPath();
      ctx.moveTo(cx - xr, cy - xr); ctx.lineTo(cx + xr, cy + xr);
      ctx.moveTo(cx - xr, cy + xr); ctx.lineTo(cx + xr, cy - xr);
      ctx.stroke();
      if (now - lastScramble > 1800) {
        lastScramble = now;
        scrambleSeed += 7;
        scramble = scrambleString(scrambleSeed);
      }
      ctx.fillStyle = "#ff641d";
      ctx.font = "13px 'JetBrains Mono', monospace";
      ctx.fillText(scramble, cx, cy + r * 1.9);
    };

    if (reduce) {
      draw(0, 0);
    } else {
      let last = performance.now();
      const frame = (now) => {
        if (!running) return;
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) { last = now; return; }
        const dt = Math.min(0.05, (now - last) / 16.7);
        last = now;
        draw(now, dt);
      };
      raf = requestAnimationFrame(frame);
    }

    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    obs.observe(canvas);
    const onResize = () => { build(); if (reduce) draw(0, 0); };
    window.addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [reduce]);

  return <canvas ref={ref} className={`w-full h-full ${className}`} aria-hidden="true" data-testid="cipher-canvas" />;
}
