import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Grainient from "./Grainient";

/*
  MarketingGrainientBackground
  --------------------------------------------------------------
  ONE site-level WebGL canvas, mounted once inside PublicLayout, fixed
  behind the whole public site. Not rendered on /try-alter-engine at all
  — that route tree never mounts PublicLayout, so nothing to exclude here.

  Desktop settings are exactly the supplied ones. Below 768px the same
  component is reused with a lighter GPU load (lower DPR ceiling, calmer
  time speed, lighter grain) — never a second canvas.
*/

const BASE = {
  color1: "#F97316",
  color2: "#f9f9f9",
  color3: "#000000",
  timeSpeed: 1.9,
  colorBalance: 0.07,
  warpStrength: 1,
  warpFrequency: 5,
  warpSpeed: 2,
  warpAmplitude: 50,
  blendAngle: 0,
  blendSoftness: 0.11,
  rotationAmount: 500,
  noiseScale: 2,
  grainAmount: 0.1,
  grainScale: 2,
  grainAnimated: true,
  contrast: 1.5,
  gamma: 1,
  saturation: 1,
  centerX: 0,
  centerY: 0,
  zoom: 0.85,
};

export default function MarketingGrainientBackground() {
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setMobile(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const props = mobile
    ? { ...BASE, timeSpeed: 1.25, grainAmount: 0.07 }
    : BASE;
  const maxDpr = mobile ? 1.25 : 1.5;

  return (
    <div className="marketingGrainientBackground" aria-hidden="true">
      <Grainient {...props} paused={!!reduce} maxDpr={maxDpr} />
    </div>
  );
}
