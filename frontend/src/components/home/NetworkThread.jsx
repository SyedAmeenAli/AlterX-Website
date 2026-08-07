import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/*
  AlterXNetworkThread
  --------------------------------------------------------------
  One flowing digital molecular / geometric mesh that weaves behind the
  entire homepage. Each chapter renders its own lightweight canvas segment
  (<NetSegment name="..."/>), but entry/exit composition is coordinated so
  the whole thing reads as ONE living network travelling down the page.

  - Points sit along a curved "flow band" (organic silhouette, negative space).
  - Irregular triangles / polygons via nearest-neighbour connections (capped degree).
  - Scroll reveals structure along the flow direction (draws in / retracts).
  - Subtle idle life: breathing opacity, 1-3px drift, one travelling signal.
  - Text-safe zones dramatically reduce density behind headings.
  - Light vs dark palettes. IntersectionObserver + rAF, reduced-motion static.
*/

const PALETTES = {
  dark: {
    line: ["rgba(255,90,31,0.16)", "rgba(255,90,31,0.32)", "rgba(255,90,31,0.5)"],
    node: ["rgba(255,90,31,0.55)", "#ff5a1f", "#ff7a24"],
    warm: "rgba(251,250,247,0.9)",
    signal: "#ff7a24",
  },
  light: {
    line: ["rgba(241,90,36,0.14)", "rgba(241,90,36,0.26)", "rgba(241,90,36,0.4)"],
    node: ["rgba(241,90,36,0.42)", "#ff5a1f", "#b93610"],
    warm: "rgba(185,54,16,0.85)",
    signal: "#ff5a1f",
  },
};

/*  from / to / bow are viewport fractions (x can exceed 0..1 to leave screen).
    density = node count. distFrac = connection reach. safe = [x,y,w,h] text zone. */
const NET_CONFIG = {
  hero:      { from: [1.14, 0.12], to: [0.56, 1.06], bow: 0.20, density: 150, distFrac: 0.150, palette: "dark",  safe: [0.0, 0.12, 0.52, 0.72], seed: 1101, tall: false },
  products:  { from: [0.60, -0.06], to: [-0.14, 0.92], bow: -0.16, density: 190, distFrac: 0.150, palette: "light", safe: [0.04, 0.02, 0.56, 0.36], seed: 2202, tall: false },
  engine:    { from: [-0.16, 0.08], to: [1.14, 0.78], bow: 0.12, density: 210, distFrac: 0.120, palette: "dark",  safe: [0.10, 0.30, 0.80, 0.40], seed: 3303, tall: true },
  runway:    { from: [0.82, 0.55], to: [1.16, 1.14], bow: 0.10, density: 78,  distFrac: 0.170, palette: "light", safe: [0.0, 0.0, 0.72, 0.6], seed: 4404, tall: false },
  orbit:     { from: [1.16, 0.18], to: [0.34, 1.06], bow: 0.22, density: 150, distFrac: 0.150, palette: "dark",  safe: [0.55, 0.25, 0.45, 0.55], seed: 5505, tall: false },
  voice:     { from: [0.40, -0.06], to: [0.64, 1.06], bow: 0.08, density: 64,  distFrac: 0.180, palette: "light", safe: [0.05, 0.02, 0.6, 0.5], seed: 6606, tall: false },
  security:  { from: [0.18, -0.06], to: [0.72, 1.06], bow: 0.16, density: 210, distFrac: 0.140, palette: "dark",  safe: [0.28, 0.32, 0.44, 0.40], seed: 7707, tall: false },
  work:      { from: [0.72, -0.06], to: [0.40, 1.06], bow: 0.10, density: 72,  distFrac: 0.175, palette: "light", safe: [0.0, 0.0, 0.72, 0.7], seed: 8808, tall: false },
  resources: { from: [0.40, -0.06], to: [0.64, 1.06], bow: 0.12, density: 72,  distFrac: 0.175, palette: "light", safe: [0.0, 0.0, 0.72, 0.7], seed: 9909, tall: false },
  composer:  { from: [0.62, -0.08], to: [0.50, 1.08], bow: 0.14, density: 128, distFrac: 0.155, palette: "dark",  safe: [0.18, 0.18, 0.64, 0.5], seed: 1010, tall: false },
  footer:    { from: [0.12, -0.10], to: [0.92, 1.12], bow: 0.16, density: 140, distFrac: 0.150, palette: "dark",  safe: [0.0, 0.0, 0.0, 0.0], seed: 1212, tall: false },
};

const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};

const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const inRect = (x, y, r) => x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3];

function buildModel(cfg, W, H) {
  const rnd = mulberry32(cfg.seed);
  const min = Math.min(W, H);
  const from = [cfg.from[0] * W, cfg.from[1] * H];
  const to = [cfg.to[0] * W, cfg.to[1] * H];
  const mx = (from[0] + to[0]) / 2, my = (from[1] + to[1]) / 2;
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len; // perpendicular
  const c1 = [from[0] + dx * 0.33 + nx * cfg.bow * W, from[1] + dy * 0.33 + ny * cfg.bow * H];
  const c2 = [to[0] - dx * 0.33 + nx * cfg.bow * W * 0.6, to[1] - dy * 0.33 + ny * cfg.bow * H * 0.6];

  const band = min * (cfg.tall ? 0.16 : 0.22);
  const nodes = [];
  let guard = 0;
  while (nodes.length < cfg.density && guard < cfg.density * 6) {
    guard++;
    const t = Math.pow(rnd(), 0.82);
    const base = cubic(from, c1, c2, to, t);
    // gaussian-ish perpendicular + along jitter → flowing band with negative space
    const g = (rnd() + rnd() + rnd() - 1.5) / 1.5;
    const off = g * band * (0.5 + rnd() * 0.9);
    const px = base[0] + nx * off + (rnd() - 0.5) * band * 0.5;
    const py = base[1] + ny * off + (rnd() - 0.5) * band * 0.5;
    if (px < -0.15 * W || px > 1.15 * W || py < -0.12 * H || py > 1.12 * H) continue;
    if (inRect(px / W, py / H, cfg.safe) && rnd() < 0.88) continue; // text-safe thinning

    const tr = rnd();
    const tier = tr < 0.65 ? 0 : tr < 0.9 ? 1 : 2;
    const r = tier === 0 ? 1.2 + rnd() * 0.9 : tier === 1 ? 2 + rnd() * 1.1 : 3.4 + rnd() * 2.2;
    nodes.push({
      x: px, y: py, bx: px, by: py, r, tier, along: t,
      phase: rnd() * Math.PI * 2,
      drift: 1 + rnd() * 2,
      da: rnd() * Math.PI * 2,
      breathe: rnd() < 0.5,
      warm: cfg.palette === "dark" && tier === 2 && rnd() < 0.12,
    });
  }

  // edges — nearest neighbours within reach, capped degree, irregular
  const reach = min * cfg.distFrac;
  const edges = [];
  const deg = new Array(nodes.length).fill(0);
  for (let i = 0; i < nodes.length; i++) {
    const cand = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < reach) cand.push([d, j]);
    }
    cand.sort((a, b) => a[0] - b[0]);
    const cap = 2 + Math.floor(rnd() * 3.4); // 2..5
    for (const [d, j] of cand) {
      if (deg[i] >= cap) break;
      if (deg[j] >= 5) continue;
      if (j < i && edges.some((e) => e.a === j && e.b === i)) continue;
      const tier = Math.max(nodes[i].tier, nodes[j].tier) - (rnd() < 0.4 ? 1 : 0);
      edges.push({
        a: i, b: j,
        tier: Math.max(0, Math.min(2, tier)),
        along: (nodes[i].along + nodes[j].along) / 2,
        len: d,
      });
      deg[i]++; deg[j]++;
    }
  }

  // one travelling signal chain
  let chain = [];
  if (nodes.length > 6) {
    const adj = nodes.map(() => []);
    edges.forEach((e) => { adj[e.a].push(e.b); adj[e.b].push(e.a); });
    let cur = 0, best = -1;
    nodes.forEach((n, i) => { if (n.along < best || best < 0) { best = n.along; cur = i; } });
    const seen = new Set([cur]);
    chain = [cur];
    for (let h = 0; h < 7; h++) {
      const opts = adj[cur].filter((n) => !seen.has(n));
      if (!opts.length) break;
      cur = opts.sort((p, q) => nodes[q].along - nodes[p].along)[0];
      seen.add(cur); chain.push(cur);
    }
  }

  return { nodes, edges, chain, safe: cfg.safe, palette: PALETTES[cfg.palette], mx, my };
}

export const NetSegment = ({ name, className = "" }) => {
  const cfg = NET_CONFIG[name];
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!cfg) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0, running = true, visible = false;
    let W = 0, H = 0, dpr = 1, model = null, progress = 0, start = performance.now();

    const size = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      if (!W || !H) return;
      dpr = H > 2600 ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      model = buildModel(cfg, W, H);
    };

    const computeProgress = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = (vh - r.top) / (r.height * 0.55 + vh);
      return raw < 0 ? 0 : raw > 1 ? 1 : raw;
    };

    const draw = (time) => {
      if (!model || !W || !H) return;
      const { nodes, edges, chain, safe, palette } = model;
      ctx.clearRect(0, 0, W, H);
      const t = time * 0.001;

      // drift (subtle life)
      const idle = !reduce && visible;
      for (const n of nodes) {
        if (idle) {
          n.x = n.bx + Math.cos(t * 0.4 + n.da) * n.drift;
          n.y = n.by + Math.sin(t * 0.5 + n.phase) * n.drift;
        } else {
          n.x = n.bx; n.y = n.by;
        }
      }

      // edges
      ctx.lineCap = "round";
      for (const e of edges) {
        const A = nodes[e.a], B = nodes[e.b];
        const rev = smooth(e.along - 0.16, e.along + 0.06, progress);
        if (rev <= 0.001) continue;
        let alpha = 1;
        const midx = (A.x + B.x) / 2 / W, midy = (A.y + B.y) / 2 / H;
        if (inRect(midx, midy, safe)) alpha *= 0.3;
        ctx.strokeStyle = palette.line[e.tier];
        ctx.globalAlpha = alpha * rev;
        ctx.lineWidth = e.tier === 2 ? 1.25 : e.tier === 1 ? 0.9 : 0.6;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(A.x + (B.x - A.x) * rev, A.y + (B.y - A.y) * rev);
        ctx.stroke();
      }

      // nodes
      for (const n of nodes) {
        const rev = smooth(n.along - 0.16, n.along + 0.04, progress);
        if (rev <= 0.001) continue;
        let a = rev;
        if (idle && n.breathe) a *= 0.65 + 0.35 * (0.5 + 0.5 * Math.sin(t * 0.9 + n.phase));
        if (inRect(n.x / W, n.y / H, safe)) a *= 0.35;
        const scale = 0.8 + 0.2 * rev;
        ctx.globalAlpha = a;
        ctx.fillStyle = n.warm ? palette.warm : palette.node[n.tier];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // travelling signal
      if (idle && chain.length > 1 && progress > 0.05) {
        const span = chain.length - 1;
        const s = (t * 0.18) % 1;
        const seg = Math.min(span - 1, Math.floor(s * span));
        const local = s * span - seg;
        const A = nodes[chain[seg]], B = nodes[chain[seg + 1]];
        if (A && B) {
          const sx = A.x + (B.x - A.x) * local, sy = A.y + (B.y - A.y) * local;
          const revA = smooth(A.along - 0.16, A.along + 0.04, progress);
          ctx.globalAlpha = 0.85 * revA;
          ctx.fillStyle = palette.signal;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      progress = computeProgress();
      draw(now);
    };

    size();
    progress = computeProgress();
    if (reduce) {
      progress = 1;
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && reduce) { progress = computeProgress() || 1; draw(performance.now()); }
    }, { rootMargin: "15% 0px 15% 0px" });
    io.observe(wrap);

    let rt = 0;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (reduce) draw(performance.now()); }, 160); };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(rt);
    };
  }, [cfg, name, reduce]);

  if (!cfg) return null;
  return (
    <div ref={wrapRef} className={`ax-net pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default NetSegment;
