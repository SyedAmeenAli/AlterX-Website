import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./VoiceAgentOrb.css";

/*
  VoiceAgentOrb — real three.js WebGL sphere (user-supplied reference
  reimplemented in React/AlterX palette): solid core + 2 transmissive
  shells + 3 tilted orbital rings + orbiting particles, mouse-parallax,
  idle micro-pulse. AlterX orange only (no gold/white per palette rule).
  size: "nav" | "hero" — scales canvas + geometry via one factor.
*/

const COLORS = {
  core: 0xff8a45,
  shell1: 0xf97316,
  shell2: 0xff641d,
  ring: 0xffa552,
  particle: 0xffb37a,
};

const SIZE_FACTOR = { nav: 1.15, tile: 1.25, hero: 1 };

export default function VoiceAgentOrb({ active = false, interactive = false, size = "nav", className = "" }) {
  const mountRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const stateRef = useRef({});

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const l = () => setReducedMotion(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", l) : mq.addListener(l);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", l) : mq.removeListener(l));
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const factor = SIZE_FACTOR[size] || SIZE_FACTOR.nav;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.scale.setScalar(factor);

    const coreGeo = new THREE.SphereGeometry(2, 48, 48);
    const coreMat = new THREE.MeshStandardMaterial({ color: COLORS.core, emissive: COLORS.core, emissiveIntensity: 0.55, roughness: 0.25, metalness: 0.1 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const shellDefs = [
      { r: 2.2, color: COLORS.shell1, opacity: 0.6, transmission: 0.5, thickness: 0.5 },
      { r: 2.4, color: COLORS.shell2, opacity: 0.3, transmission: 0.8, thickness: 0.2 },
    ];
    const shells = shellDefs.map((d) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(d.r, 48, 48),
        new THREE.MeshPhysicalMaterial({ color: d.color, transparent: true, opacity: d.opacity, roughness: 0.15, transmission: d.transmission, thickness: d.thickness })
      );
      group.add(mesh);
      return mesh;
    });

    const rings = [0, 1, 2].map((i) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(3.5 + i * 0.5, 0.015, 16, 100),
        new THREE.MeshBasicMaterial({ color: COLORS.ring, transparent: true, opacity: 0.4 + i * 0.1 })
      );
      mesh.rotation.x = (i / 3) * Math.PI;
      mesh.rotation.y = ((i * 1.7) % 3) * Math.PI * 0.33;
      const speedX = (0.006 + i * 0.004) * (i % 2 ? -1 : 1);
      const speedY = (0.005 + i * 0.003) * (i % 2 ? 1 : -1);
      group.add(mesh);
      return { mesh, speedX, speedY };
    });

    const particleCount = size === "hero" ? 7 : 5;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 4 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: COLORS.particle, size: 0.1, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }));
    group.add(particles);

    scene.add(group);

    scene.add(new THREE.AmbientLight(0x331a00, 1));
    const centerLight = new THREE.PointLight(COLORS.core, 2, 20);
    scene.add(centerLight);
    const dir1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dir1.position.set(5, 5, 5);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(COLORS.shell2, 0.4);
    dir2.position.set(-5, -5, -5);
    scene.add(dir2);

    const st = stateRef.current;
    st.paused = document.hidden;
    st.destroyed = false;
    st.targetRotX = 0;
    st.targetRotY = 0;

    const onVis = () => { st.paused = document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const onPointerMove = (e) => {
      if (!interactive) return;
      const r = mount.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const my = -((e.clientY - r.top) / r.height) * 2 + 1;
      st.targetRotY = mx * 0.5;
      st.targetRotX = my * 0.5;
    };
    if (interactive) mount.addEventListener("mousemove", onPointerMove);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (st.paused) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      if (!reducedMotion) {
        const pulse = 1 + Math.sin(t * 1.4) * 0.04;
        core.scale.setScalar(pulse);
        core.rotation.y += dt * 0.3;
        shells.forEach((s, i) => {
          s.scale.setScalar(pulse + i * 0.01);
          s.rotation.y -= dt * 0.12 * (i + 1);
          s.rotation.x += dt * 0.06 * (i + 1);
        });
        rings.forEach((r) => {
          r.mesh.rotation.x += r.speedX;
          r.mesh.rotation.y += r.speedY;
        });
        particles.rotation.y += dt * 0.12;
        particles.rotation.z -= dt * 0.06;
      }

      scene.rotation.y += (st.targetRotY - scene.rotation.y) * 0.06;
      scene.rotation.x += (st.targetRotX - scene.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      st.destroyed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (interactive) mount.removeEventListener("mousemove", onPointerMove);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      shells.forEach((s) => { s.geometry.dispose(); s.material.dispose(); });
      rings.forEach((r) => { r.mesh.geometry.dispose(); r.mesh.material.dispose(); });
      particleGeo.dispose();
      particles.material.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, interactive, reducedMotion]);

  return (
    <div
      ref={mountRef}
      className={`vo-scene vo-scene--${size} ${className}`}
      data-active={active}
      aria-hidden="true"
    />
  );
}
